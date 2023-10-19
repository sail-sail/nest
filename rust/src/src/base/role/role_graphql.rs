use anyhow::Result;
use async_graphql::{Context, Object};

use crate::common::context::Ctx;

use super::role_resolver;

#[derive(Default)]
pub struct RoleQuery;

#[Object(rename_args = "snake_case")]
impl RoleQuery {
  
  /// 获取当前角色的首页轮播图路由
  async fn get_home_urls<'a>(
    &self,
    ctx: &Context<'a>,
  ) -> Result<Vec<String>> {
    
    let ctx = Ctx::builder(ctx)
      .with_auth()?
      .build();
    
    let res = role_resolver::get_home_urls(
      &ctx,
    ).await;
    
    ctx.ok(res).await
  }
  
}
