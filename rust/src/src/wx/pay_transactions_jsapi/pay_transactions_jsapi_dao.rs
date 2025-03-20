use color_eyre::eyre::Result;

use crate::common::context::{
  Options,
  get_short_uuid,
  get_auth_id_err,
};

use wx_pay::{Amount, Jsapi, Payer, WxPayData, WxPay};

use super::pay_transactions_jsapi_model::RequestPaymentOptions;

// wx_app
use crate::r#gen::wx::wx_app::wx_app_dao::{
  find_one as find_one_wx_app,
  validate_option as validate_option_wx_app,
  validate_is_enabled as validate_is_enabled_wx_app,
};
use crate::r#gen::wx::wx_app::wx_app_model::{
  WxAppId,
  WxAppModel,
  WxAppSearch,
};

// wx_pay
use crate::r#gen::wx::wx_pay::wx_pay_dao::{
  find_one as find_one_wx_pay,
  validate_option as validate_option_wx_pay,
  validate_is_enabled as validate_is_enabled_wx_pay,
};
use crate::r#gen::wx::wx_pay::wx_pay_model::{
  WxPayId,
  WxPayModel,
  WxPaySearch,
};

// wx_usr
use crate::r#gen::wx::wx_usr::wx_usr_dao::{
  find_one as find_one_wx_usr,
  validate_option as validate_option_wx_usr,
};
use crate::r#gen::wx::wx_usr::wx_usr_model::{
  WxUsrId,
  WxUsrModel,
  WxUsrSearch,
};

use crate::r#gen::wx::pay_transactions_jsapi::pay_transactions_jsapi_model::{
  PayTransactionsJsapiTradeState,
  PayTransactionsJsapiInput,
};
use crate::r#gen::wx::pay_transactions_jsapi::pay_transactions_jsapi_dao::create as create_pay_transactions_jsapi;

use super::pay_transactions_jsapi_model::TransactionsJsapiInput;

/// 生成商户订单号 out_trade_no
pub fn get_out_trade_no() -> String {
  let out_trade_no= get_short_uuid()
    .replace("+", "-")
    .replace("/", "_")
    .replace("=", "");
  out_trade_no
}

/// 微信支付 统一下单
pub async fn transactions_jsapi(
  transactions_jsapi_input: TransactionsJsapiInput,
  options: Option<Options>,
) -> Result<RequestPaymentOptions> {
  
  let appid = transactions_jsapi_input.appid;
  let description = transactions_jsapi_input.description;
  let amount = transactions_jsapi_input.amount;
  
  // 微信支付设置
  let wx_pay_model = validate_option_wx_pay(
    find_one_wx_pay(
      Some(WxPaySearch {
        appid: Some(appid),
        ..Default::default()
      }),
      None,
      options.clone(),
    ).await?
  ).await?;
  
  validate_is_enabled_wx_pay(
    &wx_pay_model,
  ).await?;
  
  // 当前用户
  let auth_id = get_auth_id_err()?;
  
  let wx_usr_model = validate_option_wx_usr(
    find_one_wx_usr(
      Some(WxUsrSearch {
        usr_id: Some(vec![auth_id]),
        ..Default::default()
      }),
      None,
      options.clone(),
    ).await?
  ).await?;
  
  let openid = wx_usr_model.openid;
  let tenant_id = wx_usr_model.tenant_id;
  
  let appid = wx_pay_model.appid;
  let mchid = wx_pay_model.mchid;
  let public_key = wx_pay_model.public_key;
  let private_key = wx_pay_model.private_key;
  let v3_key = wx_pay_model.v3_key;
  let payer_client_ip = wx_pay_model.payer_client_ip;
  let notify_url = wx_pay_model.notify_url;
  
  let wxpay = WxPay {
    appid: appid.as_str(),
    mchid: mchid.as_str(),
    private_key: private_key.as_str(),
    serial_no: v3_key.as_str(),
    api_v3_private_key: private_key.as_str(),
    notify_url: notify_url.as_str(),
  };
  
  let out_trade_no = get_out_trade_no();
  
  let jsapi = Jsapi {
    description: description.clone(),
    out_trade_no: out_trade_no.clone(),
    amount: Amount {
      total: amount,
      ..Default::default()
    },
    payer: Payer {
      openid: openid.clone(),
    },
    time_expire: transactions_jsapi_input.time_expire.clone(),
    attach: transactions_jsapi_input.attach.clone(),
    ..Default::default()
  };
  
  let wx_pay_data: WxPayData = wxpay.jsapi(&jsapi).await?;
  
  let request_payment_options = RequestPaymentOptions {
    time_stamp: wx_pay_data.time_stamp,
    nonce_str: wx_pay_data.nonce_str,
    package: wx_pay_data.package.clone(),
    sign_type: wx_pay_data.sign_type,
    pay_sign: wx_pay_data.pay_sign,
  };
  
  let profit_sharing = if transactions_jsapi_input.profit_sharing.unwrap_or_default() {
    Some("Y".to_string())
  } else {
    Some("N".to_string())
  };
  
  // 创建支付交易
  create_pay_transactions_jsapi(
    PayTransactionsJsapiInput {
      appid: Some(appid),
      mchid: Some(mchid),
      description: Some(description),
      out_trade_no: Some(out_trade_no),
      transaction_id: Some("".to_string()),
      trade_state: Some(PayTransactionsJsapiTradeState::Notpay),
      trade_state_desc: Some("未支付".to_string()),
      time_expire: transactions_jsapi_input.time_expire.clone(),
      attach: transactions_jsapi_input.attach.clone(),
      attach2: Some(transactions_jsapi_input.attach2),
      notify_url: Some(notify_url),
      receipt: transactions_jsapi_input.receipt,
      profit_sharing,
      total_fee: Some(amount),
      openid: Some(openid),
      prepay_id: Some(wx_pay_data.package),
      tenant_id: Some(tenant_id),
      ..Default::default()
    },
    options.clone(),
  ).await?;
  
  Ok(request_payment_options)
}