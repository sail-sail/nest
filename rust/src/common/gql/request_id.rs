use poem::Response;
use std::collections::HashMap;
use chrono::{NaiveDateTime, Local};

use lazy_static::lazy_static;
use std::sync::Arc;
use tokio::sync::Mutex;

lazy_static! {
  static ref REQUEST_ID_MAP: Arc<Mutex<HashMap<String, NaiveDateTime>>> = Arc::new(Mutex::new(HashMap::new()));
}

pub async fn handle_request_id(
    request_id: Option<String>,
) -> Option<Response> {
  
  if request_id.is_none() {
    return None;
  }

  let request_id = request_id.unwrap();

  if request_id.is_empty() {
    return None;
  }
  
  let now = Local::now().naive_local();
  
  let request_id_map = REQUEST_ID_MAP.clone();
  let mut request_id_map = request_id_map.lock().await;
  
  // 删除过期的 request_id
  let mut expired_request_ids = Vec::new();
  for (k, v) in request_id_map.iter() {
    if now.signed_duration_since(*v).num_seconds() > 60 {
      expired_request_ids.push(k.clone());
    }
  }
  for k in expired_request_ids {
    request_id_map.remove(&k);
  }
  
  if request_id_map.contains_key(&request_id) {
    return Response::builder()
      .status(poem::http::StatusCode::INTERNAL_SERVER_ERROR)
      .body("x-request-id is duplicated: {request_id}")
      .into();
  }
  
  request_id_map.insert(request_id, now);
  
  None
}
