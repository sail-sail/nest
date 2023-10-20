use anyhow::Result;
use async_graphql::{Context, Object};

use crate::common::context::Ctx;

use super::tenant_resolver;
use crate::gen::base::tenant::tenant_model::TenantModel;

#[derive(Default)]
pub struct TenantQuery;

#[Object(rename_args = "snake_case")]
impl TenantQuery {
  
  /// 根据 当前网址的域名+端口 获取 租户列表
  async fn get_login_tenants<'a>(
    &self,
    ctx: &Context<'a>,
    domain: String,
  ) -> Result<Vec<TenantModel>> {
    
    let ctx = Ctx::builder(ctx)
      .build();
    
    let res = tenant_resolver::get_login_tenants(
      &ctx,
      domain,
    ).await;
    
    ctx.ok(res).await
  }
  
}
