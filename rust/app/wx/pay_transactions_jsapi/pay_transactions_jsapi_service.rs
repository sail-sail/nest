use color_eyre::eyre::Result;
use serde_json::json;

use generated::common::context::Options;

// wx_pay_transactions_jsapi
use generated::wx::pay_transactions_jsapi::pay_transactions_jsapi_dao::{
  find_one_pay_transactions_jsapi,
  validate_option_pay_transactions_jsapi,
};
use generated::wx::pay_transactions_jsapi::pay_transactions_jsapi_model::{
  PayTransactionsJsapiTradeState,
  PayTransactionsJsapiModel,
  PayTransactionsJsapiSearch,
};

use super::pay_transactions_jsapi_model::RequestPaymentOptions;

use super::pay_transactions_jsapi_model::{
  TransactionsJsapiInput,
  TransactionsJsapiActionEnum,
};
use super::pay_transactions_jsapi_dao::transactions_jsapi;
use rust_decimal::Decimal;

/// 微信支付测试, requestPayment 所需参数
pub async fn get_test_pay_opt(
  appid: String,
  options: Option<Options>,
) -> Result<RequestPaymentOptions> {
  
  let request_payment_options = transactions_jsapi(
    TransactionsJsapiInput {
      appid,
      description: "测试支付".to_string(),
      amount: Decimal::new(1, 2),
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

/// 通过 out_trade_no 查询支付状态
pub async fn trade_state_pay_transactions_jsapi(
  out_trade_no: String,
  options: Option<Options>,
) -> Result<PayTransactionsJsapiModel> {
  
  let pay_transactions_jsapi_model = validate_option_pay_transactions_jsapi(
    find_one_pay_transactions_jsapi(
      Some(PayTransactionsJsapiSearch {
        out_trade_no: Some(out_trade_no.clone()),
        ..Default::default()
      }),
      None,
      options.clone(),
    ).await?,
  ).await?;
  
  let pay_transactions_jsapi_trace_state = pay_transactions_jsapi_model.trade_state;
  
  if pay_transactions_jsapi_trace_state != PayTransactionsJsapiTradeState::Notpay {
    return Ok(PayTransactionsJsapiModel {
      trade_state: pay_transactions_jsapi_trace_state,
      trade_state_desc: pay_transactions_jsapi_model.trade_state_desc,
      ..Default::default()
    });
  }
  
  // 循环检查支付状态20次, 每次间隔500毫秒
  for _ in 0..20 {
    let pay_transactions_jsapi_model = validate_option_pay_transactions_jsapi(
      find_one_pay_transactions_jsapi(
        Some(PayTransactionsJsapiSearch {
          out_trade_no: Some(out_trade_no.clone()),
          ..Default::default()
        }),
        None,
        options.clone(),
      ).await?,
    ).await?;
    
    if pay_transactions_jsapi_model.trade_state != PayTransactionsJsapiTradeState::Notpay {
      return Ok(pay_transactions_jsapi_model);
    }
    
    tokio::time::sleep(std::time::Duration::from_millis(500)).await;
  }
  
  Ok(PayTransactionsJsapiModel {
    trade_state: pay_transactions_jsapi_model.trade_state,
    trade_state_desc: pay_transactions_jsapi_model.trade_state_desc,
    ..Default::default()
  })
}
