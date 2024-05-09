use std::time::Instant;

use tracing::error;

use poem::{
  handler, web::Query, Response,
};
use poem::http::StatusCode;
use serde::Deserialize;

use super::health_resful;

static KEY: &str = "lLpR1EKETWSb5x7TR4R32Q";

#[derive(Deserialize)]
pub struct HealthQuery {
  key: Option<String>,
}

#[handler]
pub async fn health(
   Query(HealthQuery {
    key,
   }): Query<HealthQuery>,
) -> Response {
  
  let key = key.unwrap_or_default();
  
  if key != KEY {
    return Response::builder()
      .status(StatusCode::UNAUTHORIZED)
      .body("Unauthorized");
  }
  
  let now0 = Instant::now();
  
  let res = health_resful::health_check().await;
  
  if res.is_err() {
    let err = res.err().unwrap();
    error!("{}", err);
    return Response::builder()
      .status(StatusCode::INTERNAL_SERVER_ERROR)
      .body(err.to_string());
  }
  
  let mut response = Response::builder();
  response = response.header("Content-Type", "application/json");
  let mut response = response.body("OK");
  
  let headers = response.headers_mut();
  let now1 = Instant::now();
  let response_time = format!("app;dur={}", now1.saturating_duration_since(now0).as_millis());
  let response_time = poem::http::header::HeaderValue::from_str(&response_time);
  let response_time = match response_time {
    Ok(response_time) => response_time,
    Err(err) => {
      error!("{}", err);
      return Response::builder()
        .status(StatusCode::INTERNAL_SERVER_ERROR)
        .body(err.to_string())
    }
  };
  headers.insert("Server-Timing", response_time);
  
  response
}
