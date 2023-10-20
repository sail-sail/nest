use anyhow::Result;
use crate::common::context::Ctx;

use super::tenant_service;

use crate::gen::base::tenant::tenant_model::TenantModel;

/// 根据 当前网址的域名+端口 获取 租户列表
pub async fn get_login_tenants<'a>(
  ctx: &Ctx<'a>,
  domain: String,
) -> Result<Vec<TenantModel>> {
  
  let res = tenant_service::get_login_tenants(
    ctx,
    domain,
  ).await?;
  
  Ok(res)
}
