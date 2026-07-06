use poem::{
  IntoResponse,
  Response,
  http::StatusCode,
};

use generated::common::context::Options;

use super::wxw_app_model::NotifyQuery;
use super::wxw_app_service;

/// 企业微信应用回调通知
pub async fn wxwork_app_notify_get(
  notify_query: NotifyQuery,
  options: Option<Options>,
) -> Response {
  match wxw_app_service::wxwork_app_notify_get(
    notify_query,
    options,
  ).await {
    Ok(res) => res,
    Err(err) => Response::builder()
      .status(StatusCode::INTERNAL_SERVER_ERROR)
      .body(err.to_string())
      .into_response(),
  }
}
