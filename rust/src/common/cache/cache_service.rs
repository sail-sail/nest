use anyhow::Result;

use crate::common::context::get_auth_id_err;

use crate::gen::base::usr::usr_dao::{
  find_by_id as find_by_id_usr,
  validate_option as validate_option_usr,
};

use super::cache_dao;

/// 清空缓存
pub async fn clear_cache(
) -> Result<bool> {
  
  let usr_id = get_auth_id_err()?;
  
  let usr_model = validate_option_usr(
    find_by_id_usr(
      usr_id,
      None,
    ).await?
  ).await?;
  
  let usrername = usr_model.username;
  
  if usrername != "admin" {
    anyhow::bail!("只有超级管理员 admin 才能清空缓存");
  }
  
  cache_dao::flash_db().await?;
  Ok(true)
}
