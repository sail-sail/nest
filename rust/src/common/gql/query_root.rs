use anyhow::{Ok, Result};

use async_graphql::{
  Context, Object, OutputType,
  EmptyMutation, EmptySubscription, Request, Response, Schema, SimpleObject,
};
use tracing::{info, error};

use crate::common::context::ReqContext;
use crate::gen::usr::usr_model::UsrModel;
use crate::gen::usr::usr_service;

pub struct Query;

pub type QuerySchema = Schema<Query, EmptyMutation, EmptySubscription>;

#[Object]
impl Query {
  
  async fn hello(
    &self,
    gql_ctx: &Context<'_>,
  ) -> Result<Vec<UsrModel>> {
    let mut ctx = ReqContext::new(gql_ctx.to_owned(), true);
    
    let res = usr_service::hello(&mut ctx).await;
    
    if let Err(e) = res {
      ctx.rollback().await?;
      return Err(e);
    }
    ctx.commit().await?;
    
    // tokio::time::sleep(std::time::Duration::from_millis(500)).await;
    Ok(res.unwrap())
  }
  
}
