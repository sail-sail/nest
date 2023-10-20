use anyhow::Result;
use async_graphql::{Context, Object};

use crate::common::context::Ctx;

use super::i18n_resolver;

#[derive(Default)]
pub struct I18nQuery;

#[Object]
impl I18nQuery {
  
  async fn n<'a>(
    &self,
    ctx: &Context<'a>,
    lang_code: String,
    route_path: Option<String>,
    code: String,
  ) -> Result<String> {
    let ctx = Ctx::builder(ctx)
      .build();
    
    let res = i18n_resolver::n_lang(
      &ctx,
      lang_code,
      route_path,
      code,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
}   
