use color_eyre::eyre::Result;

use crate::common::context::Options;

use crate::r#gen::wx::pay_transactions_jsapi::pay_transactions_jsapi_model::PayTransactionsJsapiModel;

use super::pay_transactions_jsapi_model::RequestPaymentOptions;

use super::pay_transactions_jsapi_service;

/// 微信支付测试, requestPayment 所需参数
pub async fn get_test_pay_opt(
  appid: String,
  options: Option<Options>,
) -> Result<RequestPaymentOptions> {
  
  let request_payment_options = pay_transactions_jsapi_service::get_test_pay_opt(
    appid,
    options,
  ).await?;
  
  Ok(request_payment_options)
}

/// 通过 out_trade_no 查询支付状态
pub async fn trade_state_pay_transactions_jsapi(
  out_trade_no: String,
  options: Option<Options>,
) -> Result<PayTransactionsJsapiModel> {
  
  let pay_transactions_jsapi_model = pay_transactions_jsapi_service::trade_state_pay_transactions_jsapi(
    out_trade_no,
    options,
  ).await?;
  
  Ok(pay_transactions_jsapi_model)
}
