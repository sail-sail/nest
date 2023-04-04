use anyhow::{Ok, Result};
use tracing::{info, error};

use async_graphql::{
  MergedObject,
  EmptyMutation, EmptySubscription, Schema,
};

// use crate::gen::usr::usr_resolver::UsrQuery;

use crate::common::context::Ctx;

use crate::gen::usr::usr_model::UsrModel;
use crate::gen::usr::usr_service;

#[derive(Default)]
pub struct UsrQuery;

#[async_graphql::Object]
impl UsrQuery {
  
  pub async fn hello2(
    &self,
    ctx: &async_graphql::Context<'_> ,
  ) -> Result<Vec<UsrModel>> {
    let mut ctx = Ctx::new(ctx, true);
    let res = usr_service::hello(&mut ctx).await;
    ctx.ok(res).await
  }
  
}

#[derive(MergedObject, Default)]
pub struct GenQuery(UsrQuery);
