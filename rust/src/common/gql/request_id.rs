use std::env;
use std::collections::HashMap;
use chrono::{NaiveDateTime, Local};

use std::sync::OnceLock;
use std::sync::Arc;
use tokio::sync::Mutex;

use poem::Response;

use crate::common::cache::cache_dao::{
  exists as cache_exists,
  set as cache_set,
  expire as cache_expire,
};

static REQUEST_ID_MAP: OnceLock<Arc<Mutex<HashMap<String, NaiveDateTime>>>> = OnceLock::new();
static CACHE_X_REQUEST_ID: OnceLock<String> = OnceLock::new();

const REQUEST_TIMEOUT: u32 = 60;

fn request_id_map() -> &'static Arc<Mutex<HashMap<String, NaiveDateTime>>> {
  REQUEST_ID_MAP.get_or_init(|| Arc::new(Mutex::new(HashMap::new())))
}
fn cache_x_request_id() -> &'static str {
  CACHE_X_REQUEST_ID.get_or_init(|| env::var("cache_x_request_id").unwrap_or_default()).as_str()
}

pub async fn handle_request_id(
    request_id: Option<String>,
) -> Option<Response> {
  
  request_id.as_ref()?;

  let request_id = request_id.unwrap();

  if request_id.is_empty() {
    return None;
  }
  
  let now = Local::now().naive_local();
  
  {
    let request_id_map = request_id_map().clone();
    let mut request_id_map = request_id_map.lock().await;
    
    // 删除过期的 request_id
    let mut expired_request_ids = Vec::new();
    for (k, v) in request_id_map.iter() {
      if now.signed_duration_since(*v).num_seconds() > REQUEST_TIMEOUT.into() {
        expired_request_ids.push(k.clone());
      }
    }
    for k in expired_request_ids {
      request_id_map.remove(&k);
    }
    
    if request_id_map.contains_key(&request_id) {
      return Response::builder()
        .status(poem::http::StatusCode::INTERNAL_SERVER_ERROR)
        .body(format!("x-request-id is duplicated: {request_id}"))
        .into();
    }
    
    request_id_map.insert(request_id.clone(), now);
  }
  
  let cache_request_id = cache_x_request_id();
  
  if cache_request_id.is_empty() {
    return None;
  }
  
  let cache_key1 = format!("{cache_request_id}:{request_id}");
  
  let is_exists = cache_exists(
    &cache_key1,
  ).await;
  
  if let Err(err) = is_exists {
    return Response::builder()
      .status(poem::http::StatusCode::INTERNAL_SERVER_ERROR)
      .body(err.to_string())
      .into();
  }
  let is_exists = is_exists.unwrap();
  
  if is_exists {
    return Response::builder()
      .status(poem::http::StatusCode::INTERNAL_SERVER_ERROR)
      .body(format!("x-request-id is duplicated: {request_id}"))
      .into();
  }
  
  let res = cache_set(
    &cache_key1,
    &request_id,
  ).await;
  
  if let Err(err) = res {
    return Response::builder()
      .status(poem::http::StatusCode::INTERNAL_SERVER_ERROR)
      .body(err.to_string())
      .into();
  }
  
  let res = cache_expire(
    &cache_key1,
    REQUEST_TIMEOUT,
  ).await;
  
  if let Err(err) = res {
    return Response::builder()
      .status(poem::http::StatusCode::INTERNAL_SERVER_ERROR)
      .body(err.to_string())
      .into();
  }
  
  None
}
