use anyhow::Result;
use async_graphql::{Context, Object};

use crate::common::context::{CtxImpl, Ctx};

use super::dict_detail_model::GetDict;
use super::dict_detail_service;

#[derive(Default)]
pub struct DictDetailQuery;

#[Object(rename_args = "snake_case")]
impl DictDetailQuery {
  
  async fn get_dict<'a>(
    &self,
    ctx: &Context<'a>,
    codes: Vec<String>,
  ) -> Result<Vec<Vec<GetDict>>> {
    let mut ctx = CtxImpl::new(&ctx);
    let res = dict_detail_service::get_dict(&mut ctx, &codes).await;
    ctx.ok(res).await
  }
  
}
