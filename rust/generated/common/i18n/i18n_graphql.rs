use color_eyre::eyre::Result;
use async_graphql::{Context, Object};

use crate::common::context::Ctx;

use smol_str::SmolStr;

use super::i18n_resolver;

#[derive(Default)]
pub struct I18nQuery;

#[Object]
impl I18nQuery {
  
  async fn n(
    &self,
    ctx: &Context<'_>,
    lang_code: SmolStr,
    route_path: Option<SmolStr>,
    code: SmolStr,
  ) -> Result<SmolStr> {
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
