use anyhow::Result;
use async_graphql::{Context, Object};

use crate::common::context::{CtxImpl, Ctx};

use super::i18n_service;

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
    let mut ctx = CtxImpl::new(&ctx);
    
    let res = i18n_service::n_lang(
      &mut ctx,
      lang_code,
      route_path,
      code,
      None,
    ).await;
    
    ctx.ok(res).await
  }
  
}   
