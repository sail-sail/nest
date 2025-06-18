use serde_json::json;
use tracing::{info, error};

use poem::Response;
use http::status::StatusCode;

use generated::common::context::get_req_id;

use generated::common::wx_pay::decode::WxPayNotify;

use super::wx_pay_notice_service;

#[function_name::named]
pub async fn wx_pay_notify(
  wx_pay_notify: WxPayNotify,
) -> Response {
  
  info!(
    "{req_id} {function_name}: wx_pay_notify: {wx_pay_notify:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let data = wx_pay_notice_service::wx_pay_notify(
    wx_pay_notify,
    None,
  ).await;
  
  if let Err(err) = &data  {
    error!(
      "{req_id} wx_pay_notify.data: {err:?}",
      req_id = get_req_id(),
    );
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
