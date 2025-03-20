use color_eyre::eyre::Result;

use super::pay_transactions_jsapi_model::RequestPaymentOptions;

use super::pay_transactions_jsapi_service;

/// 微信支付测试, requestPayment 所需参数
pub async fn get_test_pay_opt(
  appid: String,
) -> Result<RequestPaymentOptions> {
  
  let request_payment_options = pay_transactions_jsapi_service::get_test_pay_opt(
    appid,
    None,
  ).await?;
  
  Ok(request_payment_options)
}
