use anyhow::Result;
use crate::common::context::use_ctx;

use crate::gen::base::role::role_dao::find_all as find_all_role;

use crate::gen::base::role::role_model::RoleSearch;
use crate::gen::base::usr::usr_dao::{
  find_by_id as find_usr_by_id,
  validate_option as validate_option_usr,
  validate_is_enabled as validate_is_enabled_usr,
};

/// 获取当前角色的首页轮播图路由
pub async fn get_home_urls() -> Result<Vec<String>> {
  
  let ctx = &use_ctx();
  
  let usr_id = ctx.get_auth_model_err()?.id;
  
  // 获取当前登录用户
  let usr_model = find_usr_by_id(
    usr_id,
    None,
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
    None,
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
