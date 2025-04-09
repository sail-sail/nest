use color_eyre::eyre::Result;
use async_graphql::{Context, Object};

use crate::common::context::Ctx;

use super::optbiz_resolver;

#[derive(Default)]
pub struct OptbizQuery;

#[Object(rename_args = "snake_case")]
impl OptbizQuery {
  
  /// 移动端是否发版中 uni_releasing
  async fn get_uni_releasing(
    &self,
    ctx: &Context<'_>,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        optbiz_resolver::get_uni_releasing(
          None,
        )
      }).await
  }
  
}
