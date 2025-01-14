use color_eyre::eyre::Result;
use async_graphql::{Context, Object};

use crate::common::context::Ctx;

use super::i18n_resolver;

#[derive(Default)]
pub struct I18nQuery;

#[Object]
impl I18nQuery {
  
  async fn n(
    &self,
    ctx: &Context<'_>,
    lang_code: String,
    route_path: Option<String>,
    code: String,
  ) -> Result<String> {
    Ctx::builder(ctx)
      .build()
      .scope({
        i18n_resolver::n_lang(
          lang_code,
          route_path,
          code,
          None,
        )
      }).await
  }
  
}   
