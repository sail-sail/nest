use color_eyre::eyre::Result;
use tracing::info;

use generated::common::context::{
  Options,
  get_req_id,
};

use smol_str::SmolStr;

use generated::wx::pay_transactions_jsapi::pay_transactions_jsapi_model::PayTransactionsJsapiModel;

use super::pay_transactions_jsapi_model::RequestPaymentOptions;

use super::pay_transactions_jsapi_service;

/// 微信支付测试, requestPayment 所需参数
#[function_name::named]
pub async fn get_test_pay_opt(
  appid: SmolStr,
  options: Option<Options>,
) -> Result<RequestPaymentOptions> {
  
  info!(
    "{req_id} {function_name}: appid: {appid}",
    req_id = get_req_id(),
    function_name = function_name!(),
    appid = appid,
  );
  
  let request_payment_options = pay_transactions_jsapi_service::get_test_pay_opt(
    appid,
    options,
  ).await?;
  
  Ok(request_payment_options)
}

/// 通过 out_trade_no 查询支付状态
#[function_name::named]
pub async fn trade_state_pay_transactions_jsapi(
  out_trade_no: SmolStr,
  options: Option<Options>,
) -> Result<PayTransactionsJsapiModel> {
  
  info!(
    "{req_id} {function_name}: out_trade_no: {out_trade_no}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let pay_transactions_jsapi_model = pay_transactions_jsapi_service::trade_state_pay_transactions_jsapi(
    out_trade_no,
    options,
  ).await?;
  
  Ok(pay_transactions_jsapi_model)
}
