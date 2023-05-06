use anyhow::Result;
use async_graphql::{Context, Object};

use crate::common::context::{CtxImpl, Ctx};

use super::lang_service;
use crate::gen::base::lang::lang_model::LangModel;

#[derive(Default)]
pub struct LangQuery;

#[Object(rename_args = "snake_case")]
impl LangQuery {
  
  async fn get_login_langs<'a>(
    &self,
    ctx: &Context<'a>,
  ) -> Result<Vec<LangModel>> {
    let mut ctx = CtxImpl::new(&ctx);
    
    let res = lang_service::get_login_langs(
      &mut ctx,
    ).await;
    
    ctx.ok(res).await
  }
  
}
