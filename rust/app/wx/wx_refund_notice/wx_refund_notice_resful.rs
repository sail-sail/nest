use serde_json::json;
use tracing::{info, error};

use poem::Response;
use http::status::StatusCode;

use generated::common::context::get_req_id;

use generated::common::wx_pay::decode::WxRefundNotify;

use super::wx_refund_notice_service;

#[function_name::named]
pub async fn wx_refund_notify(
  wx_refund_notify: WxRefundNotify,
) -> Response {
  info!("{req_id} {function_name}: wx_refund_notify: {wx_refund_notify:?}", req_id = get_req_id(), function_name = function_name!());

  let data = wx_refund_notice_service::wx_refund_notify(
    wx_refund_notify,
    None,
  ).await;

  if let Err(err) = &data  {
    error!("{req_id} wx_refund_notify.data: {err:?}", req_id = get_req_id());
    return Response::builder()
      .header("Content-Type", "application/json")
      .status(StatusCode::INTERNAL_SERVER_ERROR)
      .body(json!({
        "code": "FAIL",
        "message": err.to_string(),
      }).to_string());
  }

  Response::builder()
    .status(StatusCode::OK)
    .finish()
}
