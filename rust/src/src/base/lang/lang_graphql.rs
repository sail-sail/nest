use anyhow::Result;
use async_graphql::{Context, Object};

use crate::common::context::Ctx;

use super::lang_resolver;
use crate::gen::base::lang::lang_model::LangModel;

#[derive(Default)]
pub struct LangQuery;

#[Object(rename_args = "snake_case")]
impl LangQuery {
  
  async fn get_login_langs(
    &self,
    ctx: &Context<'_>,
  ) -> Result<Vec<LangModel>> {
    let ctx = Ctx::builder(ctx)
      .build();
    
    let res = lang_resolver::get_login_langs(
      &ctx,
    ).await;
    
    ctx.ok(res).await
  }
  
}
