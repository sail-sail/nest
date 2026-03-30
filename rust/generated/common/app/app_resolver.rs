use color_eyre::eyre::Result;

use smol_str::SmolStr;

use super::app_service;

/// 生成 id 主键
pub async fn generate_id(
) -> Result<SmolStr> {
  let res = app_service::generate_id().await?;
  Ok(res)
}

/// 检查是否已经登录
pub async fn check_login(
) -> Result<bool> {
  let res = app_service::check_login().await?;
  Ok(res)
}

/// 根据 appid 获取租户 id
pub async fn get_tenant_id_by_appid(
  platform: SmolStr,
  appid: SmolStr,
) -> Result<SmolStr> {
  
  let res = app_service::get_tenant_id_by_appid(
    platform,
    appid,
  ).await?;
  
  Ok(res)
}
