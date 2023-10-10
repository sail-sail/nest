use anyhow::Result;
use async_graphql::{Context, Object};

use crate::common::context::{CtxImpl, Ctx};

use super::options_service;
use crate::gen::base::options::options_model::OptionsModel;

#[derive(Default)]
pub struct OptionsQuery;

#[Object(rename_args = "snake_case")]
impl OptionsQuery {
  
  async fn get_options_by_lbl<'a>(
    &self,
    ctx: &Context<'a>,
    lbl: String,
  ) -> Result<Vec<OptionsModel>> {
    let mut ctx = CtxImpl::new(ctx);
    let res = options_service::get_options_by_lbl(&mut ctx, lbl).await;
    ctx.ok(res).await
  }
  
}
