use color_eyre::eyre::{Result, bail};
use tracing::error;

use smol_str::SmolStr;

use super::app_dao;
use crate::common::context::Options;
use crate::base::tenant::tenant_model::TenantId;

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
  agentid: Option<SmolStr>,
  options: Option<Options>,
) -> Result<TenantId> {
  
  error!("get_tenant_id_by_appid is not implemented, platform: {platform}, appid: {appid}, agentid: {agentid:?}, options: {options:?}",);
  bail!("get_tenant_id_by_appid is not implemented")
}
