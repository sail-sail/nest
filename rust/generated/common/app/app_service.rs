use color_eyre::eyre::{Result, bail};
use tracing::info;

use smol_str::SmolStr;

use super::app_dao;

/// 清空缓存
pub async fn generate_id() -> Result<SmolStr> {
  Ok(app_dao::generate_id())
}

/// 检查是否已经登录
pub async fn check_login() -> Result<bool> {
  Ok(app_dao::check_login())
}

/// 根据 appid 获取租户 id
pub async fn get_tenant_id_by_appid(
  platform: SmolStr,
  appid: SmolStr,
) -> Result<SmolStr> {
  info!("get_tenant_id_by_appid is not implemented, platform: {platform}, appid: {appid}",);
  bail!("get_tenant_id_by_appid is not implemented")
}
