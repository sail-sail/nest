use anyhow::Result;
use async_graphql::{Context, Object};

use crate::common::context::Ctx;

use super::cache_service;

#[derive(Default)]
pub struct CacheMutation;

#[Object]
impl CacheMutation {
  
  /// 清空缓存
  async fn clear_cache(
    &self,
    ctx: &Context<'_>,
  ) -> Result<bool> {
    let mut ctx = Ctx::builder(ctx)
      .build();
    let res = cache_service::clear_cache(&mut ctx).await;
    ctx.ok(res).await
  }
  
}
