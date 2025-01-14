use color_eyre::eyre::Result;

use super::app_dao;

/// 清空缓存
pub async fn generate_id() -> Result<String> {
  Ok(app_dao::generate_id().to_string())
}

/// 检查是否已经登录
pub async fn check_login() -> Result<bool> {
  Ok(app_dao::check_login())
}
