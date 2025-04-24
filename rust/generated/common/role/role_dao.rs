use color_eyre::eyre::Result;

use crate::common::context::{
  get_auth_id,
  Options,
};

// 用户
use crate::base::usr::usr_model::UsrId;
use crate::base::usr::usr_dao::find_by_id_usr;

// 角色
use crate::base::role::role_model::RoleId;
use crate::base::role::role_model::RoleModel;
use crate::base::role::role_dao::find_by_ids_role;

/// 获取当前用户拥有的角色列表
#[allow(dead_code)]
pub async fn get_auth_role_models() -> Result<Vec<RoleModel>> {
  
  let usr_id = get_auth_id();
  
  if usr_id.is_none() {
    return Ok(vec![]);
  }
  let usr_id = usr_id.unwrap();
  
  let options = Options::new()
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let usr_model = find_by_id_usr(
    usr_id,
    options.clone(),
  ).await?;
  
  if usr_model.is_none() {
    return Ok(vec![]);
  }
  let usr_model = usr_model.unwrap();
  
  if usr_model.is_enabled == 0 {
    return Ok(vec![]);
  }
  
  let role_ids = usr_model.role_ids;
  
  let role_models = find_by_ids_role(
    role_ids,
    options,
  ).await?;
  
  Ok(role_models)
}

/// 获取当前用户拥有的角色ID列表
#[allow(dead_code)]
pub async fn get_auth_role_ids() -> Result<Vec<RoleModel>> {
  
  let usr_id = get_auth_id();
  
  if usr_id.is_none() {
    return Ok(vec![]);
  }
  
  let usr_id = usr_id.unwrap();
  
  let options = Options::new()
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let usr_model = find_by_id_usr(
    usr_id,
    options.clone(),
  ).await?;
  
  if usr_model.is_none() {
    return Ok(vec![]);
  }
  let usr_model = usr_model.unwrap();
  
  if usr_model.is_enabled == 0 {
    return Ok(vec![]);
  }
  
  let role_ids = usr_model.role_ids;
  
  let role_models = find_by_ids_role(
    role_ids,
    options,
  ).await?;
  
  Ok(role_models)
}



/// 获取指定用户的角色ID列表
#[allow(dead_code)]
pub async fn get_role_ids(
  usr_id: UsrId,
) -> Result<Vec<RoleId>> {
  
  let options = Options::new()
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let usr_model = find_by_id_usr(
    usr_id,
    options,
  ).await?;
  
  if usr_model.is_none() {
    return Ok(vec![]);
  }
  
  let usr_model = usr_model.unwrap();
  
  if usr_model.is_enabled == 0 {
    return Ok(vec![]);
  }
  
  Ok(usr_model.role_ids)
}
