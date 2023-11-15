use anyhow::Result;

use crate::common::id::ID;

use super::app_dao;


/// 清空缓存
pub async fn generate_id() -> Result<ID> {
  Ok(app_dao::generate_id())
}

/// 检查是否已经登录
pub async fn check_login() -> Result<bool> {
  Ok(app_dao::check_login())
}
