use anyhow::Result;
use async_graphql::{Context, Object};

use crate::common::context::{CtxImpl, Ctx};

use crate::gen::base::usr::usr_model::UsrModel;
use crate::gen::base::usr::usr_service;

#[derive(Default)]
pub struct UsrResolver;

#[Object]
impl UsrResolver {
  
  async fn hello<'a>(
    &self,
    ctx: &Context<'a>,
  ) -> Result<Vec<UsrModel>> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    let res = usr_service::hello(&mut ctx).await;
    ctx.ok(res).await
  }
  
}
