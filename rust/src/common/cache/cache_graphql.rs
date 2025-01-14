use color_eyre::eyre::Result;
use async_graphql::{Context, Object};

use crate::common::context::Ctx;

use super::cache_resolver;

#[derive(Default)]
pub struct CacheMutation;

#[Object]
impl CacheMutation {
  
  /// 清空缓存
  async fn clear_cache(
    &self,
    ctx: &Context<'_>,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        cache_resolver::clear_cache()
      }).await
  }
  
}
