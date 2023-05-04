use anyhow::Result;
use async_graphql::{Context, Object};

use crate::common::context::CtxImpl;

use super::tenant_service;
use crate::gen::base::tenant::tenant_model::TenantModel;

#[derive(Default)]
pub struct TenantQuery;

#[Object]
impl TenantQuery {
  
  /// 根据 当前网址的域名+端口 获取 租户列表
  async fn get_login_teants<'a>(
    &self,
    ctx: &Context<'a>,
    host: String,
  ) -> Result<Vec<TenantModel>> {
    let mut ctx = CtxImpl::new(ctx);
    let res = tenant_service::get_login_teants(&mut ctx, host).await?;
    Ok(res)
  }
  
}
