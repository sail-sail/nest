use anyhow::Result;
use async_graphql::{Context, Object};

use crate::common::context::{CtxImpl, Ctx};

use super::dictbiz_detail_model::GetDictbiz;
use super::dictbiz_detail_service;

#[derive(Default)]
pub struct DictbizDetailQuery;

#[Object]
impl DictbizDetailQuery {
  
  async fn get_dict<'a>(
    &self,
    ctx: &Context<'a>,
    codes: Vec<String>,
  ) -> Result<Vec<Vec<GetDictbiz>>> {
    let mut ctx = CtxImpl::new(&ctx);
    let res = dictbiz_detail_service::get_dict(&mut ctx, &codes).await;
    ctx.ok(res).await
  }
  
}
