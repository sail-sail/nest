use anyhow::{Ok, Result};

use async_graphql::{
  Context, Enum, Interface, Object, OutputType,
  EmptyMutation, EmptySubscription, Request, Response, Schema, ErrorExtensions, FieldResult, SimpleObject,
};
use tracing::info;

use crate::common::context::ReqContext;

pub struct Query;

pub type QuerySchema = Schema<Query, EmptyMutation, EmptySubscription>;

#[derive(sqlx::FromRow, SimpleObject)]
struct Usr { username: String, id: String }

#[Object]
impl Query {
  
  async fn hello(
    &self,
    gql_ctx: &Context<'_>,
  ) -> Result<Vec<Usr>> {
    let mut ctx = ReqContext::new(gql_ctx.to_owned());
    
    let vec = vec![ "1" ];
    
    let res = ctx.query_with::<_, Usr>("#
      select
        *
      from
        usr
      where
        id != ?
    #", vec).await?;
    
    // tokio::time::sleep(std::time::Duration::from_millis(500)).await;
    Ok(res)
  }
  
}
