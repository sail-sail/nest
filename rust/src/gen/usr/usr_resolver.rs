
use anyhow::{Ok, Result};
use tracing::{info, error};

use async_graphql::{
  Context, Object, OutputType,
  EmptyMutation, EmptySubscription, Request, Response, Schema, SimpleObject,
};

use crate::common::context::Ctx;

use crate::gen::usr::usr_model::UsrModel;
use crate::gen::usr::usr_service;

#[derive(Default)]
pub struct UsrQuery;

#[Object]
impl UsrQuery {
  
  async fn hello(
    &self,
    ctx: &Context<'_>,
  ) -> Result<Vec<UsrModel>> {
    let mut ctx = Ctx::new(ctx, true);
    let res = usr_service::hello(&mut ctx).await;
    ctx.ok(res).await
  }
  
}
