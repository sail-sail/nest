use anyhow::Result;
use crate::common::context::use_ctx;

use crate::gen::base::usr::usr_dao::find_by_id as find_by_id_usr;

/// 获取当前用户拥有的角色id列表
#[allow(dead_code)]
async fn get_auth_role_ids() -> Result<Vec<String>> {
  
  let ctx = &use_ctx();
  
  let aut_model = ctx.get_auth_model();
  if aut_model.is_none() {
    return Ok(vec![]);
  }
  
  let aut_model = aut_model.unwrap();
  
  let usr_model = find_by_id_usr(
    aut_model.id,
    None,
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
