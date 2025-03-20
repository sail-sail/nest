use color_eyre::eyre::Result;

use poem::Response;
use http::status::StatusCode;

use wx_pay::decode::WxPayNotify;

use super::wx_pay_notice_service;

pub async fn wx_pay_notify(
  wx_pay_notify: WxPayNotify,
) -> Response {
  
  let data = wx_pay_notice_service::wx_pay_notify(wx_pay_notify).await;
  
  if let Err(err) = &data  {
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
