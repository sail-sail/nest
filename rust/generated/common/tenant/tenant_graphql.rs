use color_eyre::eyre::Result;
use async_graphql::{Context, Object};

use crate::common::context::Ctx;

use super::tenant_resolver;
use super::tenant_model::GetLoginTenants;

use super::tenant_model::SetTenantAdminPwdInput;
use crate::base::tenant::tenant_model::TenantId;

#[derive(Default)]
pub struct TenantQuery;

#[derive(Default)]
pub struct TenantMutation;

#[Object(rename_args = "snake_case")]
impl TenantQuery {
  
  /// 根据 当前网址的域名+端口 获取 租户列表
  async fn get_login_tenants(
    &self,
    ctx: &Context<'_>,
    domain: String,
  ) -> Result<Vec<GetLoginTenants>> {
    Ctx::builder(ctx)
      .build()
      .scope({
        tenant_resolver::get_login_tenants(
          domain,
        )
      }).await
  }
  
  /// 根据 tenant_ids 获取 租户信息
  async fn get_login_tenant_by_ids(
    &self,
    ctx: &Context<'_>,
    tenant_ids: Vec<TenantId>,
  ) -> Result<Vec<GetLoginTenants>> {
    Ctx::builder(ctx)
      .build()
      .scope({
        tenant_resolver::get_login_tenant_by_ids(
          tenant_ids,
        )
      }).await
  }
  
}

#[Object(rename_args = "snake_case")]
impl TenantMutation {
  
  /// 设置租户管理员密码
  async fn set_tenant_admin_pwd(
    &self,
    ctx: &Context<'_>,
    input: SetTenantAdminPwdInput,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .with_tran()
      .build()
      .scope({
        tenant_resolver::set_tenant_admin_pwd(
          input
        )
      }).await
  }
  
}
