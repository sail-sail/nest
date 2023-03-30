use anyhow::{Ok, Result};

use async_graphql::{
  Context, Enum, Interface, Object, OutputType,
  EmptyMutation, EmptySubscription, Request, Response, Schema, ErrorExtensions, FieldResult,
};

use crate::common::context::ReqContext;

pub struct Query;

pub type QuerySchema = Schema<Query, EmptyMutation, EmptySubscription>;

#[Object]
impl Query {
  
  async fn hello(
    &self,
    gql_ctx: &Context<'_>,
  ) -> Result<String> {
    let ctx = ReqContext::new(gql_ctx.to_owned());
    // tokio::time::sleep(std::time::Duration::from_millis(500)).await;
    Ok(ctx.req_id.to_string())
  }
  
}
