use chrono::{Local, DateTime};

use async_graphql::Context;

pub struct ReqContext<'a> {
  
  pub gql_ctx: Context<'a>,
  
  pub is_tran: bool,
  pub req_id: String,
  
  pub cache_key1s: Vec<String>,
  
}

impl<'a> ReqContext<'a> {
  
  pub fn new(
    gql_ctx: Context<'a>,
  ) -> ReqContext {
    let now: DateTime<Local> = Local::now();
    let req_id = now.timestamp_millis().to_string();
    ReqContext {
      gql_ctx,
      is_tran: false,
      req_id,
      cache_key1s: Vec::new(),
    }
  }
  
}
