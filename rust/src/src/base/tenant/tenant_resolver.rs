use color_eyre::eyre::Result;

use super::tenant_service;

use super::tenant_model::GetLoginTenants;

use super::tenant_model::SetTenantAdminPwdInput;

/// 根据 当前网址的域名+端口 获取 租户列表
pub async fn get_login_tenants(
  domain: String,
) -> Result<Vec<GetLoginTenants>> {
  
  let res = tenant_service::get_login_tenants(
    domain,
  ).await?;
  
  Ok(res)
}

/// 设置租户管理员密码
pub async fn set_tenant_admin_pwd(
  input: SetTenantAdminPwdInput,
) -> Result<bool> {
  
  let res = tenant_service::set_tenant_admin_pwd(
    input
  ).await?;
  
  Ok(res)
}
