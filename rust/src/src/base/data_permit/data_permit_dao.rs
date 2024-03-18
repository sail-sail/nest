use anyhow::Result;

use crate::common::context::{
  Options,
  get_auth_id,
};

use crate::gen::base::menu::menu_dao::find_one as find_one_menu;
use crate::gen::base::menu::menu_model::MenuSearch;

use crate::gen::base::data_permit::data_permit_dao::find_all as find_all_permit;
use crate::gen::base::data_permit::data_permit_model::{
  DataPermitModel,
  DataPermitSearch,
};

use crate::gen::base::usr::usr_dao::{
  find_by_id as find_by_id_usr,
  validate_option as validate_option_usr,
  validate_is_enabled as validate_is_enabled_usr,
};

/// 获取数据权限列表
#[allow(dead_code)]
pub async fn get_data_permits(
  route_path: String,
  options: Option<Options>,
) -> Result<Vec<DataPermitModel>> {
  
  let has_data_permits = options
    .as_ref()
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
  
  let usr_model = validate_option_usr(
    find_by_id_usr(usr_id, None).await?,
  ).await?;
  validate_is_enabled_usr(&usr_model).await?;
  
  let username = usr_model.username;
  
  if username == "admin" {
    return Ok(vec![]);
  }
  
  let menu_model = find_one_menu(
    MenuSearch {
      route_path: Some(route_path),
      ..Default::default()
    }.into(),
    None,
    None,
  ).await?;
  
  if menu_model.is_none() {
    return Ok(vec![]);
  }
  let menu_model = menu_model.unwrap();
  let menu_id = menu_model.id;
  
  let data_permit_models = find_all_permit(
    DataPermitSearch {
      menu_id: vec![menu_id].into(),
      ..Default::default()
    }.into(),
    None,
    None,
    None,
  ).await?;
  
  Ok(data_permit_models)
}
