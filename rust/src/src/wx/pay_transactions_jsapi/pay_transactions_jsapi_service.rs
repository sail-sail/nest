use color_eyre::eyre::Result;

use wx_pay::{Amount, Jsapi, Payer, WxPayData, WxPay};

use super::pay_transactions_jsapi_model::RequestPaymentOptions;

/// 微信支付测试, requestPayment 所需参数
pub async fn get_test_pay_opt(
  appid: String,
) -> Result<RequestPaymentOptions> {
  todo!()
}
