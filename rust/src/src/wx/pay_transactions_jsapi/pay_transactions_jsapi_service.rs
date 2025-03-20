use color_eyre::eyre::Result;
use serde_json::json;

use crate::common::context::Options;

use super::pay_transactions_jsapi_model::RequestPaymentOptions;

use super::pay_transactions_jsapi_model::{
  TransactionsJsapiInput,
  TransactionsJsapiActionEnum,
};
use super::pay_transactions_jsapi_dao::transactions_jsapi;

/// 微信支付测试, requestPayment 所需参数
pub async fn get_test_pay_opt(
  appid: String,
  options: Option<Options>,
) -> Result<RequestPaymentOptions> {
  
  let request_payment_options = transactions_jsapi(
    TransactionsJsapiInput {
      appid,
      description: "测试支付".to_string(),
      amount: 1,
      attach2: json!({
        "action": TransactionsJsapiActionEnum::Test,  
        "playload": "测试"
      }).to_string(),
      ..Default::default()
    },
    options.clone(),
  ).await?;
  
  Ok(request_payment_options)
}
