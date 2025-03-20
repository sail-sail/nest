use color_eyre::eyre::Result;
use serde_json::json;

use poem::{
  Request, Response,
  handler, web::Json,
};
use http::status::StatusCode;

use crate::common::context::Ctx;

use super::wx_pay_notice_resful;

use wx_pay::decode::WxPayNotify;

/// https://pay.weixin.qq.com/doc/v3/merchant/4012791861
/// 支付成功回调通知
#[handler]
pub async fn wx_pay_notify(
  req: &Request,
  Json(wx_pay_notify): Json<WxPayNotify>,
) -> Response {
  let res: Result<Response> = Ctx::resful_builder(Some(req))
    .with_tran().unwrap()
    .build()
    .resful_scope({
      wx_pay_notice_resful::wx_pay_notify(wx_pay_notify)
    }).await;
  if let Err(err) = res {
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
