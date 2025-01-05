use color_eyre::eyre::Result;
use crate::common::context::{get_auth_model, Options};

use crate::r#gen::base::usr::usr_dao::find_by_id as find_by_id_usr;

use crate::r#gen::base::role::role_model::RoleId;
use crate::r#gen::base::usr::usr_model::UsrId;

/// 获取当前用户拥有的角色ID列表
#[allow(dead_code)]
pub async fn get_auth_role_ids() -> Result<Vec<RoleId>> {
  
  let aut_model = get_auth_model();
  if aut_model.is_none() {
    return Ok(vec![]);
  }
  
  let aut_model = aut_model.unwrap();
  
  let options = Options::new()
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let usr_model = find_by_id_usr(
    aut_model.id,
    options,
  ).await?;
  
  if usr_model.is_none() {
    return Ok(vec![]);
  }
  
  let usr_model = usr_model.unwrap();
  
  if usr_model.is_enabled == 0 {
    return Ok(vec![]);
  }
  
  let role_ids = usr_model.role_ids;
  
  Ok(role_ids)
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
