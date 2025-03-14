use color_eyre::eyre::Result;
use crate::common::context::{get_auth_model, Options};

use crate::r#gen::base::usr::usr_dao::find_by_id as find_by_id_usr;

// 角色
use crate::r#gen::base::role::role_dao::find_by_ids as find_by_ids_role;

use crate::r#gen::base::role::role_model::RoleModel;

/// 获取当前用户拥有的角色列表
#[allow(dead_code)]
pub async fn get_auth_role_models() -> Result<Vec<RoleModel>> {
  
  let aut_model = get_auth_model();
  if aut_model.is_none() {
    return Ok(vec![]);
  }
  
  let aut_model = aut_model.unwrap();
  
  let usr_id = aut_model.id;
  
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
