use anyhow::Result;
use async_graphql::{Context, Object};

use crate::common::context::{CtxImpl, Ctx};

use super::cache_service;

#[derive(Default)]
pub struct CacheMutation;

#[Object]
impl CacheMutation {
  
  /// 清空缓存
  async fn clear_cache<'a>(
    &self,
    ctx: &Context<'a>,
  ) -> Result<bool> {
    let mut ctx = CtxImpl::new(ctx);
    let res = cache_service::clear_cache(&mut ctx).await;
    ctx.ok(res).await
  }
  
}
