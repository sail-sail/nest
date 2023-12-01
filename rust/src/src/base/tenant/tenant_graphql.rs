use anyhow::Result;
use async_graphql::{Context, Object};

use crate::common::context::Ctx;

use super::tenant_resolver;
use super::tenant_model::GetLoginTenants;

#[derive(Default)]
pub struct TenantQuery;

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
  
}
