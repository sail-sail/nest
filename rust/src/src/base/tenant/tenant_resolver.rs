use anyhow::Result;

use super::tenant_service;

use super::tenant_model::GetLoginTenants;

/// 根据 当前网址的域名+端口 获取 租户列表
pub async fn get_login_tenants(
  domain: String,
) -> Result<Vec<GetLoginTenants>> {
  
  let res = tenant_service::get_login_tenants(
    domain,
  ).await?;
  
  Ok(res)
}
