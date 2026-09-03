use color_eyre::eyre::Result;
use tracing::info;

use crate::common::context::get_req_id;

use super::tenant_service;

use super::tenant_model::GetLoginTenants;

use super::tenant_model::SetTenantAdminPwdInput;
use crate::base::tenant::tenant_model::TenantId;

/// 根据 当前网址的域名+端口 获取 租户列表
#[function_name::named]
pub async fn get_login_tenants(
  domain: String,
) -> Result<Vec<GetLoginTenants>> {
  
  info!(
    "{req_id} {function_name}: domain: {domain:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let res = tenant_service::get_login_tenants(
    domain,
  ).await?;
  
  Ok(res)
}

/// 根据 tenant_ids 获取 租户信息
pub async fn get_login_tenant_by_ids(
  tenant_ids: Vec<TenantId>,
) -> Result<Vec<GetLoginTenants>> {
  
  let res = tenant_service::get_login_tenant_by_ids(
    tenant_ids,
  ).await?;
  
  Ok(res)
}

/// 设置租户管理员密码
#[function_name::named]
pub async fn set_tenant_admin_pwd(
  input: SetTenantAdminPwdInput,
) -> Result<bool> {
  
  info!(
    "{req_id} {function_name}: input: {input:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
    input = input,
  );
  
  let res = tenant_service::set_tenant_admin_pwd(
    input
  ).await?;
  
  Ok(res)
}
