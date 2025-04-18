use color_eyre::eyre::Result;
use crate::common::context::{get_auth_id_ok, Options};

use crate::r#gen::base::role::role_dao::find_all_role;

use crate::r#gen::base::role::role_model::RoleSearch;
use crate::r#gen::base::usr::usr_dao::{
  find_by_id_usr,
  validate_option_usr,
  validate_is_enabled_usr,
};

/// 获取当前角色的首页轮播图路由
pub async fn get_home_urls() -> Result<Vec<String>> {
  
  let options = Options::new()
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let usr_id = get_auth_id_ok()?;
  
  // 获取当前登录用户
  let usr_model = find_by_id_usr(
    usr_id,
    options.clone(),
  ).await?;
  let usr_model = validate_option_usr(
    usr_model,
  ).await?;
  validate_is_enabled_usr(
    &usr_model,
  ).await?;
  
  let role_ids = usr_model.role_ids;
  
  let role_models = find_all_role(
    RoleSearch {
      ids: Some(role_ids),
      ..Default::default()
    }.into(),
    None,
    None,
    options.clone(),
  ).await?;
  
  let home_urls = role_models
    .into_iter()
    .map(|role_model| {
      role_model.home_url
    })
    .filter(|home_url| {
      !home_url.is_empty()
    })
    .flat_map(|home_url| {
      home_url.split(',')
        .map(|home_url| {
          home_url.to_string()
        })
        .collect::<Vec<String>>()
    })
    .collect::<Vec<String>>();
  Ok(home_urls)
}
