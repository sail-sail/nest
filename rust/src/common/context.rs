use std::{sync::{Arc}, collections::{HashMap, BTreeMap}, num::ParseIntError};
use anyhow::Ok;
use lazy_static::lazy_static;

use tokio::sync::{Mutex};

use async_graphql::{
  Context, Enum, Interface, Object, OutputType,
  EmptyMutation, EmptySubscription, Request, Response, Schema, ErrorExtensions, FieldResult,
};
use chrono::{Local, DateTime};
use futures_util::{Future};

use std::sync::atomic::{AtomicUsize, Ordering};

// type Result<T> = std::fmt::Result<T, std::fmt::Error>;

static REQUEST_RECV_NUM: AtomicUsize  = AtomicUsize::new(0);

lazy_static! {
  static ref REQ_CTX_MAP: Mutex<HashMap<usize, Arc<Mutex<ReqContext>>>> = Mutex::new(HashMap::new());
}

pub type QuerySchema = Schema<Query, EmptyMutation, EmptySubscription>;

pub struct Query;

#[Object]
impl Query {
  
  async fn hello(
    &self,
    // req_ctx: &Context<'_>,
  ) -> anyhow::Result<i32> {
    scope(async {
      let ctx = use_req_ctx().await;
      ctx.lock().await.is_tran = true;
      tokio::time::sleep(std::time::Duration::from_secs(10)).await;
      println!("req_id: {}", ctx.lock().await.req_id);
      let res = String::from("22").parse()
        .map_err(|e: ParseIntError| anyhow::anyhow!(e))?;
      Ok(res)
    }).await
  }
  
}

tokio::task_local! {
  pub static CONTEXT_NUM: usize;
}

pub struct ReqContext {
  
  pub is_tran: bool,
  pub req_id: String,
  
  pub cache_key1s: Vec<String>,
  
}

impl ReqContext {
  
  pub fn new() -> ReqContext {
    
    let now: DateTime<Local> = Local::now();
    let req_id = now.timestamp_millis().to_string();
    
    ReqContext {
      is_tran: false,
      req_id,
      cache_key1s: Vec::new(),
    }
  }
  
}

pub async fn scope<F>(
  f: F,
) -> F::Output
where
  F: Future
{
  let ctx_num = REQUEST_RECV_NUM.fetch_add(1, Ordering::SeqCst);
  {
    let ctx = ReqContext::new();
    let ctx = Arc::new(Mutex::new(ctx));
    let mut req_ctx_map = REQ_CTX_MAP.lock().await;
    req_ctx_map.insert(ctx_num, ctx);
  }
  let res = CONTEXT_NUM.scope(ctx_num, f).await;
  {
    let mut req_ctx_map = REQ_CTX_MAP.lock().await;
    req_ctx_map.remove(&ctx_num);
    let mut max = 0;
    for (k, _) in req_ctx_map.iter() {
      if k > &max {
        max = *k;
      }
    }
    println!("max: {}, req_ctx_map: {}", max, req_ctx_map.len());
    REQUEST_RECV_NUM.store(max, Ordering::SeqCst);
  }
  res
}

pub async fn use_req_ctx() -> Arc<Mutex<ReqContext>> {
  let ctx_num = CONTEXT_NUM.get();
  let req_ctx = REQ_CTX_MAP.lock().await;
  let req_ctx = req_ctx.get(&ctx_num).unwrap().to_owned();
  req_ctx
}

pub async fn use_maybe_req_ctx() -> Option<Arc<Mutex<ReqContext>>> {
  let ctx_num = CONTEXT_NUM.get();
  let req_ctx = REQ_CTX_MAP.lock().await;
  let req_ctx = req_ctx.get(&ctx_num).and_then(|item| Some(item.to_owned()));
  req_ctx
}
