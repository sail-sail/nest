use serde::{Deserialize, Serialize};
use serde_with::skip_serializing_none;

#[allow(clippy::upper_case_acronyms)]
#[derive(Serialize, Deserialize, Debug, Clone, Default, PartialEq, Eq)]
pub enum TradeType {
  #[default]
  JSAPI,
  NATIVE,
  APP,
  MICROPAY,
  MWEB,
  FACEPAY,
}

#[allow(clippy::upper_case_acronyms)]
#[derive(Serialize, Deserialize, Debug, Clone, Default, PartialEq, Eq)]
pub enum TradeState {
  #[default]
  SUCCESS,
  REFUND,
  NOTPAY,
  CLOSED,
  REVOKED,
  USERPAYING,
  PAYERROR,
}

#[skip_serializing_none]
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct Amount {
  pub total: u64,
  pub currency: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct Payer {
  pub openid: String,
}

#[skip_serializing_none]
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct WxPayData {
  pub app_id: Option<String>,
  pub sign_type: String,
  pub pay_sign: String,
  pub package: String,
  pub nonce_str: String,
  pub time_stamp: i64,
}

#[skip_serializing_none]
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct GoodsDetail {
  pub merchant_goods_id: String,
  pub wechatpay_goods_id: Option<String>,
  pub goods_name: Option<String>,
  pub quantity: u64,
  pub unit_price: u64,
}

#[skip_serializing_none]
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct OrderDetail {
  pub cost_price: Option<u64>,
  pub invoice_id: Option<String>,
  pub goods_detail: Vec<GoodsDetail>,
}

#[skip_serializing_none]
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct StoreInfo {
  pub id: String,
  pub name: Option<String>,
  pub area_code: Option<String>,
  pub address: Option<String>,
}

#[skip_serializing_none]
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SceneInfo {
  pub payer_client_ip: Option<String>,
  pub device_id: Option<String>,
  pub store_info: Option<StoreInfo>,
}

#[skip_serializing_none]
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct SettleInfo {
  pub profit_sharing: Option<bool>,
}

#[skip_serializing_none]
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct Jsapi {
  pub description: String,
  pub out_trade_no: String,
  pub time_expire: Option<String>,
  pub attach: Option<String>,
  pub goods_tag: Option<String>,
  pub support_fapiao: Option<bool>,
  pub amount: Amount,
  pub payer: Payer,
  pub detail: Option<OrderDetail>,
  pub scene_info: Option<SceneInfo>,
  pub settle_info: Option<SettleInfo>,
}

#[skip_serializing_none]
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub(crate) struct JsapiParams {
  pub appid: String,
  pub mchid: String,
  pub notify_url: String,
  pub description: String,
  pub out_trade_no: String,
  pub time_expire: Option<String>,
  pub attach: Option<String>,
  pub goods_tag: Option<String>,
  pub support_fapiao: Option<bool>,
  pub amount: Amount,
  pub payer: Payer,
  pub detail: Option<OrderDetail>,
  pub scene_info: Option<SceneInfo>,
  pub settle_info: Option<SettleInfo>,
}

#[skip_serializing_none]
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct TransactionDetail {
  pub appid: Option<String>,
  pub mchid: String,
  pub out_trade_no: String,
  pub transaction_id: Option<String>,
  pub trade_type: Option<TradeType>,
  pub trade_state: TradeState,
  pub trade_state_desc: String,
  pub bank_type: Option<String>,
  pub attach: Option<String>,
  pub success_time: Option<String>,
  pub payer: Option<Payer>,
  pub amount: Option<Amount>,
  pub scene_info: Option<SceneInfo>,
}

#[skip_serializing_none]
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct Refund {
  pub transaction_id: Option<String>,
  pub out_trade_no: Option<String>,
  pub out_refund_no: String,
  pub reason: Option<String>,
  pub notify_url: Option<String>,
  pub funds_account: Option<String>,
  pub amount: RefundAmount,
  pub goods_detail: Option<Vec<RefundGoodsDetail>>,
}

#[skip_serializing_none]
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct RefundAmount {
  pub refund: u64,
  pub from: Option<Vec<RefundAmountFrom>>,
  pub total: u64,
  pub currency: String,
  pub payer_total: Option<u64>,
  pub payer_refund: Option<u64>,
  pub settlement_refund: Option<u64>,
  pub settlement_total: Option<u64>,
  pub discount_refund: Option<u64>,
  pub refund_fee: Option<u64>,
}

#[skip_serializing_none]
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct RefundAmountFrom {
  pub account: String,
  pub amount: u64,
}

#[skip_serializing_none]
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct RefundGoodsDetail {
  pub merchant_goods_id: String,
  pub wechatpay_goods_id: Option<String>,
  pub goods_name: Option<String>,
  pub unit_price: u64,
  pub refund_amount: u64,
  pub refund_quantity: u64,
}

#[skip_serializing_none]
#[derive(Serialize, Deserialize, Debug, Clone, Default)]
pub struct RefundDetail {
  pub refund_id: Option<String>,
  pub out_refund_no: String,
  pub transaction_id: String,
  pub out_trade_no: String,
  pub channel: String,
  pub user_received_account: String,
  pub success_time: Option<String>,
  pub create_time: String,
  pub status: RefundStatus,
  pub funds_account: Option<String>,
  pub amount: RefundAmount,
}

#[allow(clippy::upper_case_acronyms)]
#[derive(Serialize, Deserialize, Debug, Clone, Default, PartialEq, Eq)]
pub enum RefundStatus {
  #[default]
  SUCCESS,
  CLOSED,
  PROCESSING,
  ABNORMAL,
}