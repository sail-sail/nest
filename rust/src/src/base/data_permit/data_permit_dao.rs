use color_eyre::eyre::Result;

use crate::common::context::{
  Options,
  get_auth_id,
};

use crate::r#gen::base::menu::menu_dao::find_one as find_one_menu;
use crate::r#gen::base::menu::menu_model::MenuSearch;

use crate::r#gen::base::data_permit::data_permit_dao::find_all as find_all_permit;
use crate::r#gen::base::data_permit::data_permit_model::{
  DataPermitModel,
  DataPermitSearch,
};

use crate::r#gen::base::usr::usr_dao::{
  find_by_id as find_by_id_usr,
  validate_option as validate_option_usr,
  validate_is_enabled as validate_is_enabled_usr,
};

use crate::r#gen::base::role::role_dao::find_all as find_all_role;
use crate::r#gen::base::role::role_model::RoleSearch;

/// 获取数据权限列表
#[allow(dead_code)]
pub async fn get_data_permits(
  route_path: String,
  options: Option<&Options>,
) -> Result<Vec<DataPermitModel>> {
  
  let has_data_permits = options
    .map(|options|
      options.get_has_data_permit().unwrap_or(false)
    )
    .unwrap_or(false);
  
  if !has_data_permits {
    return Ok(vec![]);
  }
  
  let usr_id = get_auth_id();
  
  if usr_id.is_none() {
    return Ok(vec![]);
  }
  let usr_id = usr_id.unwrap();
  
  let options = Options::new();
  let options = options.set_is_debug(Some(false));
  let options = Some(options);
  
  let usr_model = validate_option_usr(
    find_by_id_usr(
      usr_id,
      options.clone(),
    ).await?,
  ).await?;
  validate_is_enabled_usr(&usr_model).await?;
  
  let username = usr_model.username;
  let role_ids = usr_model.role_ids;
  
  if username == "admin" {
    return Ok(vec![]);
  }
  
  let menu_model = find_one_menu(
    MenuSearch {
      route_path: Some(route_path),
      ..Default::default()
    }.into(),
    None,
    options.clone(),
  ).await?;
  
  if menu_model.is_none() {
    return Ok(vec![]);
  }
  let menu_model = menu_model.unwrap();
  let menu_id = menu_model.id;
  
  let role_models = find_all_role(
    RoleSearch {
      ids: role_ids.into(),
      ..Default::default()
    }.into(),
    None,
    None,
    options.clone(),
  ).await?;
  
  let data_permit_ids = role_models
    .into_iter()
    .flat_map(|role_model|
      role_model.data_permit_ids.into_iter()
    )
    .collect::<std::collections::HashSet<_>>()
    .into_iter()
    .collect::<Vec<_>>();
  
  let data_permit_models = find_all_permit(
    DataPermitSearch {
      ids: data_permit_ids.into(),
      menu_id: vec![menu_id].into(),
      ..Default::default()
    }.into(),
    None,
    None,
    options,
  ).await?;
  
  Ok(data_permit_models)
}
