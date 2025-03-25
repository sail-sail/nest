use color_eyre::eyre::{Result, eyre};
use tracing::{info, error};

use rust_decimal::prelude::Decimal;

use crate::common::context::{
  Options,
  get_req_id,
};

use crate::common::wx_pay::decode::{
  decode_wx_pay,
  WxPayNotify,
  WxPayResource,
};
use crate::common::wx_pay::{
  TradeType,
  TradeState,
};

// wx_pay
use crate::r#gen::wx::wx_pay::wx_pay_dao::{
  find_one_wx_pay,
  validate_option_wx_pay,
};
use crate::r#gen::wx::wx_pay::wx_pay_model::WxPaySearch;

// wx_pay_notice
use crate::r#gen::wx::wx_pay_notice::wx_pay_notice_dao::{
  create_wx_pay_notice,
  update_tenant_by_id_wx_pay_notice,
};
use crate::r#gen::wx::wx_pay_notice::wx_pay_notice_model::{
  WxPayNoticeTradeType,
  WxPayNoticeTradeState,
  WxPayNoticeCurrency,
  WxPayNoticePayerCurrency,
  WxPayNoticeInput,
};

// pay_transactions_jsapi
use crate::r#gen::wx::pay_transactions_jsapi::pay_transactions_jsapi_dao::{
  find_one_pay_transactions_jsapi,
  validate_option_pay_transactions_jsapi,
  update_by_id_pay_transactions_jsapi,
};
use crate::r#gen::wx::pay_transactions_jsapi::pay_transactions_jsapi_model::{
  PayTransactionsJsapiTradeState,
  PayTransactionsJsapiSearch,
  PayTransactionsJsapiInput,
};

static NOTIFY_URL: &str = "/api/wx_pay/wx_pay_notify";

pub async fn wx_pay_notify(
  wx_pay_notify: WxPayNotify,
  options: Option<Options>,
) -> Result<()> {
  
  info!(
    "{req_id} wx_pay_notify: {wx_pay_notify:?}",
    req_id = get_req_id(),
  );
  
  let wx_pay_model = validate_option_wx_pay(
    find_one_wx_pay(
      Some(WxPaySearch {
        notify_url: Some(NOTIFY_URL.to_string()),
        ..Default::default()
      }),
      None,
      options.clone(),
    ).await?,
  ).await?;
  
  let appid = wx_pay_model.appid;
  let mchid = wx_pay_model.mchid;
  let v3_key = wx_pay_model.v3_key;
  
  let raw = serde_json::to_string(&wx_pay_notify)?;
  
  let wx_pay_resource: WxPayResource = decode_wx_pay(
    &v3_key,
    wx_pay_notify,
  )?;
  
  info!(
    "{req_id} wx_pay_resource: {wx_pay_resource:?}",
    req_id = get_req_id(),
  );
  
  let openid = wx_pay_resource.payer.openid;
  let out_trade_no = wx_pay_resource.out_trade_no;
  let transaction_id = wx_pay_resource.transaction_id;
  let trade_type: WxPayNoticeTradeType = match wx_pay_resource.trade_type {
    TradeType::JSAPI => WxPayNoticeTradeType::Jsapi,
    TradeType::NATIVE => WxPayNoticeTradeType::Native,
    TradeType::APP => WxPayNoticeTradeType::App,
    TradeType::MICROPAY => WxPayNoticeTradeType::Micropay,
    TradeType::MWEB => WxPayNoticeTradeType::Mweb,
    TradeType::FACEPAY => WxPayNoticeTradeType::Facepay,
  };
  let trade_state: WxPayNoticeTradeState = match wx_pay_resource.trade_state {
    TradeState::SUCCESS => WxPayNoticeTradeState::Success,
    TradeState::REFUND => WxPayNoticeTradeState::Refund,
    TradeState::NOTPAY => WxPayNoticeTradeState::Notpay,
    TradeState::CLOSED => WxPayNoticeTradeState::Closed,
    TradeState::REVOKED => WxPayNoticeTradeState::Revoked,
    TradeState::USERPAYING => WxPayNoticeTradeState::Userpaying,
    TradeState::PAYERROR => WxPayNoticeTradeState::Payerror,
  };
  let trade_state_desc = wx_pay_resource.trade_state_desc;
  let bank_type = wx_pay_resource.bank_type;
  let attach = wx_pay_resource.attach.unwrap_or_default();
  //  "2018-06-08T10:34:56+08:00"
  let success_time = wx_pay_resource.success_time;
  let success_time = chrono::NaiveDateTime::parse_from_str(&success_time, "%Y-%m-%dT%H:%M:%S%z")?;
  let total = wx_pay_resource.amount.total;
  if total > u32::MAX as u64 {
    return Err(eyre!("total is too large"));
  }
  let total = total as u32;
  let payer_total = wx_pay_resource.amount.payer_total;
  if payer_total > u32::MAX as u64 {
    return Err(eyre!("payer_total is too large"));
  }
  let payer_total = payer_total as u32;
  let currency = match wx_pay_resource.amount.currency.as_str() {
    "CNY" => Some(WxPayNoticeCurrency::Cny),
    _ => None,
  };
  let payer_currency = wx_pay_resource.amount.payer_currency;
  let payer_currency: Option<WxPayNoticePayerCurrency> = match payer_currency.as_str() {
    "CNY" => Some(WxPayNoticePayerCurrency::Cny),
    _ => None,
  };
  let device_id = wx_pay_resource.scene_info
    .map(|scene_info|
      scene_info.device_id.unwrap_or_default()
    );
  
  let wx_pay_notice_id = create_wx_pay_notice(
    WxPayNoticeInput {
      appid: Some(appid),
      mchid: Some(mchid),
      openid: Some(openid),
      out_trade_no: Some(out_trade_no.clone()),
      transaction_id: Some(transaction_id.clone()),
      trade_type: Some(trade_type),
      trade_state: Some(trade_state),
      trade_state_desc: Some(trade_state_desc.clone()),
      bank_type: Some(bank_type),
      attach: Some(attach),
      success_time: Some(success_time.clone()),
      total: Some(total),
      payer_total: Some(payer_total),
      currency,
      payer_currency,
      device_id,
      raw: Some(raw),
      ..Default::default()
    },
    options.clone(),
  ).await?;
  
  let pay_transactions_jsapi_model = validate_option_pay_transactions_jsapi(
    find_one_pay_transactions_jsapi(
      Some(PayTransactionsJsapiSearch {
        out_trade_no: Some(out_trade_no),
        ..Default::default()
      }),
      None,
      options.clone(),
    ).await?,
  ).await?;
  
  let pay_transactions_jsapi_id = pay_transactions_jsapi_model.id;
  let tenant_id = pay_transactions_jsapi_model.tenant_id;
  let attach2 = pay_transactions_jsapi_model.attach2;
  
  update_tenant_by_id_wx_pay_notice(
    wx_pay_notice_id,
    tenant_id,
    options.clone(),
  ).await?;
  
  let trade_state = match trade_state {
    WxPayNoticeTradeState::Success => PayTransactionsJsapiTradeState::Success,
    WxPayNoticeTradeState::Refund => PayTransactionsJsapiTradeState::Refund,
    WxPayNoticeTradeState::Notpay => PayTransactionsJsapiTradeState::Notpay,
    WxPayNoticeTradeState::Closed => PayTransactionsJsapiTradeState::Closed,
    WxPayNoticeTradeState::Revoked => PayTransactionsJsapiTradeState::Revoked,
    WxPayNoticeTradeState::Userpaying => PayTransactionsJsapiTradeState::Userpaying,
    WxPayNoticeTradeState::Payerror => PayTransactionsJsapiTradeState::Payerror,
  };
  
  update_by_id_pay_transactions_jsapi(
    pay_transactions_jsapi_id,
    PayTransactionsJsapiInput {
      transaction_id: Some(transaction_id),
      trade_state: Some(trade_state),
      trade_state_desc: Some(trade_state_desc),
      success_time: Some(success_time),
      ..Default::default()
    },
    options.clone(),
  ).await?;
  
  if trade_state != PayTransactionsJsapiTradeState::Success {
    return Ok(());
  }
  
  if attach2.is_empty() {
    error!(
      "{req_id} pay_notice_attach2: attach2 is empty",
      req_id = get_req_id(),
    );
    return Ok(());
  }
  
  let attach2_obj: serde_json::Value = serde_json::from_str(&attach2)?;
  let action = attach2_obj["action"].as_str().unwrap_or_default();
  
  let amt = Decimal::from(payer_total) / Decimal::from(100);
  
  info!(
    "{req_id} pay_notice_attach2: action: {action} amt: {amt} {attach2:?}",
    req_id = get_req_id(),
    attach2 = attach2_obj,
  );
  
  // TODO: handle action
  
  Ok(())
}
