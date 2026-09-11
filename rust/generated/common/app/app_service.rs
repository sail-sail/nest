use color_eyre::eyre::{Result, eyre};
use tracing::error;

use super::app_dao;
use crate::common::context::Options;
use crate::base::tenant::tenant_model::TenantId;

/// 清空缓存
pub async fn generate_id() -> Result<String> {
  Ok(app_dao::generate_id())
}

/// 检查是否已经登录
pub async fn check_login() -> Result<bool> {
  Ok(app_dao::check_login())
}

/// 根据 appid 获取租户 id
pub async fn get_tenant_id_by_appid(
  platform: String,
  appid: String,
  agentid: Option<String>,
  options: Option<Options>,
) -> Result<TenantId> {
  
  let wx_app_model = crate::wxwork::wxw_app::wxw_app_dao::find_one_ok_wxw_app(
    Some(crate::wxwork::wxw_app::wxw_app_model::WxwAppSearch {
      corpid: Some(appid.clone()),
      agentid: agentid.clone(),
      ..Default::default()
    }),
    None,
    options,
  ).await?;
  
  crate::wxwork::wxw_app::wxw_app_dao::validate_is_enabled_wxw_app(
    &wx_app_model,
  ).await?;
  
  let tenant_id = wx_app_model.tenant_id;
  
  if !tenant_id.is_empty() {
    return Ok(tenant_id);
  }
  
  error!("get_tenant_id_by_appid is not implemented, platform: {platform}, appid: {appid}, agentid: {agentid:?}, options: {options:?}",);
  Err(eyre!("get_tenant_id_by_appid is not implemented"))
}
