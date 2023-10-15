use anyhow::Result;
use async_graphql::{Context, Object};

use crate::common::context::Ctx;

use super::app_service;

#[derive(Default)]
pub struct AppQuery;

#[Object]
impl AppQuery {
  
  /// 生成ID主键
  async fn generate_id<'a>(
    &self,
    ctx: &Context<'a>,
  ) -> Result<String> {
    let mut ctx = Ctx::builder(ctx)
      .with_auth()?
      .build();
    let res = app_service::generate_id(&mut ctx).await;
    ctx.ok(res).await
  }
  
  /// 检查是否已经登录
  async fn check_login<'a>(
    &self,
    ctx: &Context<'a>,
  ) -> Result<bool> {
    let mut ctx = Ctx::builder(ctx)
      .build();
    let res = app_service::check_login(&mut ctx).await;
    ctx.ok(res).await
  }
  
}
