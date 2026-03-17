#![allow(clippy::clone_on_copy)]
#![allow(clippy::redundant_clone)]
#![allow(clippy::collapsible_if)]

#[allow(unused_imports)]
use std::fmt;
#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use std::str::FromStr;

use serde::{Serialize, Deserialize};
use color_eyre::eyre::{Result, eyre};

#[allow(unused_imports)]
use smol_str::SmolStr;

use sqlx::{
  FromRow,
  mysql::MySqlRow,
  Row,
};

#[allow(unused_imports)]
use async_graphql::{
  SimpleObject,
  InputObject,
  Enum,
};

#[allow(unused_imports)]
use crate::common::context::ArgType;
use crate::common::gql::model::SortInput;
use crate::common::id::{Id, impl_id};
use crate::common::exceptions::service_exception::ServiceException;

use crate::base::tenant::tenant_model::TenantId;

static CAN_SORT_IN_API_WX_REFUND: [&str; 2] = [
  "success_time",
  "create_time",
];

/// 微信退款申请 前端允许排序的字段
fn get_can_sort_in_api_wx_refund() -> &'static [&'static str; 2] {
  &CAN_SORT_IN_API_WX_REFUND
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "WxRefundModel")]
#[allow(dead_code)]
pub struct WxRefundModel {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: TenantId,
  /// ID
  pub id: WxRefundId,
  /// 开发者ID
  #[graphql(name = "appid")]
  pub appid: SmolStr,
  /// 商户号
  #[graphql(name = "mchid")]
  pub mchid: SmolStr,
  /// 商户订单号
  #[graphql(name = "out_trade_no")]
  pub out_trade_no: SmolStr,
  /// 微信支付订单号
  #[graphql(name = "transaction_id")]
  pub transaction_id: SmolStr,
  /// 商户退款单号
  #[graphql(name = "out_refund_no")]
  pub out_refund_no: SmolStr,
  /// 微信退款单号
  #[graphql(name = "refund_id")]
  pub refund_id: SmolStr,
  /// 退款原因
  #[graphql(name = "reason")]
  pub reason: SmolStr,
  /// 附加数据2
  #[graphql(skip)]
  pub attach2: SmolStr,
  /// 退款结果回调地址
  #[graphql(skip)]
  pub notify_url: SmolStr,
  /// 退款渠道
  #[graphql(name = "channel")]
  pub channel: WxRefundChannel,
  /// 退款渠道
  #[graphql(name = "channel_lbl")]
  pub channel_lbl: SmolStr,
  /// 退款入账账户
  #[graphql(name = "user_received_account")]
  pub user_received_account: SmolStr,
  /// 退款成功时间
  #[graphql(name = "success_time")]
  pub success_time: Option<chrono::NaiveDateTime>,
  /// 退款成功时间
  #[graphql(name = "success_time_lbl")]
  pub success_time_lbl: SmolStr,
  /// 退款状态
  #[graphql(name = "status")]
  pub status: WxRefundStatus,
  /// 退款状态
  #[graphql(name = "status_lbl")]
  pub status_lbl: SmolStr,
  /// 资金账户
  #[graphql(name = "funds_account")]
  pub funds_account: WxRefundFundsAccount,
  /// 资金账户
  #[graphql(name = "funds_account_lbl")]
  pub funds_account_lbl: SmolStr,
  /// 订单金额(分)
  #[graphql(name = "amount_total")]
  pub amount_total: u32,
  /// 退款金额(分)
  #[graphql(name = "amount_refund")]
  pub amount_refund: u32,
  /// 用户实际支付金额(分)
  #[graphql(name = "amount_payer_total")]
  pub amount_payer_total: u32,
  /// 用户退款金额(分)
  #[graphql(name = "amount_payer_refund")]
  pub amount_payer_refund: u32,
  /// 应结退款金额(分)
  #[graphql(name = "amount_settlement_refund")]
  pub amount_settlement_refund: u32,
  /// 优惠退款金额(分)
  #[graphql(name = "amount_discount_refund")]
  pub amount_discount_refund: u32,
  /// 退款币种
  #[graphql(name = "amount_currency")]
  pub amount_currency: WxRefundAmountCurrency,
  /// 退款币种
  #[graphql(name = "amount_currency_lbl")]
  pub amount_currency_lbl: SmolStr,
  /// 手续费退款金额(分)
  #[graphql(name = "amount_refund_fee")]
  pub amount_refund_fee: u32,
  /// 备注
  #[graphql(name = "rem")]
  pub rem: SmolStr,
  /// 创建时间
  pub create_time: Option<chrono::NaiveDateTime>,
  /// 创建时间
  pub create_time_lbl: SmolStr,
}

impl FromRow<'_, MySqlRow> for WxRefundModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;
    // ID
    let id: WxRefundId = row.try_get("id")?;
    // 开发者ID
    let appid: &str = row.try_get("appid")?;
    let appid = SmolStr::new(appid);
    // 商户号
    let mchid: &str = row.try_get("mchid")?;
    let mchid = SmolStr::new(mchid);
    // 商户订单号
    let out_trade_no: &str = row.try_get("out_trade_no")?;
    let out_trade_no = SmolStr::new(out_trade_no);
    // 微信支付订单号
    let transaction_id: &str = row.try_get("transaction_id")?;
    let transaction_id = SmolStr::new(transaction_id);
    // 商户退款单号
    let out_refund_no: &str = row.try_get("out_refund_no")?;
    let out_refund_no = SmolStr::new(out_refund_no);
    // 微信退款单号
    let refund_id: &str = row.try_get("refund_id")?;
    let refund_id = SmolStr::new(refund_id);
    // 退款原因
    let reason: &str = row.try_get("reason")?;
    let reason = SmolStr::new(reason);
    // 附加数据2
    let attach2: &str = row.try_get("attach2")?;
    let attach2 = SmolStr::new(attach2);
    // 退款结果回调地址
    let notify_url: &str = row.try_get("notify_url")?;
    let notify_url = SmolStr::new(notify_url);
    // 退款渠道
    let channel_lbl: &str = row.try_get("channel")?;
    let channel: WxRefundChannel = channel_lbl.try_into()?;
    let channel_lbl = SmolStr::new(channel_lbl);
    // 退款入账账户
    let user_received_account: &str = row.try_get("user_received_account")?;
    let user_received_account = SmolStr::new(user_received_account);
    // 退款成功时间
    let success_time: Option<chrono::NaiveDateTime> = row.try_get("success_time")?;
    let success_time_lbl: SmolStr = match success_time {
      Some(item) => SmolStr::new(item.format("%Y-%m-%d %H:%M:%S").to_string()),
      None => SmolStr::new(""),
    };
    // 退款状态
    let status_lbl: &str = row.try_get("status")?;
    let status: WxRefundStatus = status_lbl.try_into()?;
    let status_lbl = SmolStr::new(status_lbl);
    // 资金账户
    let funds_account_lbl: &str = row.try_get("funds_account")?;
    let funds_account: WxRefundFundsAccount = funds_account_lbl.try_into()?;
    let funds_account_lbl = SmolStr::new(funds_account_lbl);
    // 订单金额(分)
    let amount_total: u32 = row.try_get("amount_total")?;
    // 退款金额(分)
    let amount_refund: u32 = row.try_get("amount_refund")?;
    // 用户实际支付金额(分)
    let amount_payer_total: u32 = row.try_get("amount_payer_total")?;
    // 用户退款金额(分)
    let amount_payer_refund: u32 = row.try_get("amount_payer_refund")?;
    // 应结退款金额(分)
    let amount_settlement_refund: u32 = row.try_get("amount_settlement_refund")?;
    // 优惠退款金额(分)
    let amount_discount_refund: u32 = row.try_get("amount_discount_refund")?;
    // 退款币种
    let amount_currency_lbl: &str = row.try_get("amount_currency")?;
    let amount_currency: WxRefundAmountCurrency = amount_currency_lbl.try_into()?;
    let amount_currency_lbl = SmolStr::new(amount_currency_lbl);
    // 手续费退款金额(分)
    let amount_refund_fee: u32 = row.try_get("amount_refund_fee")?;
    // 备注
    let rem: &str = row.try_get("rem")?;
    let rem = SmolStr::new(rem);
    // 创建时间
    let create_time: Option<chrono::NaiveDateTime> = row.try_get("create_time")?;
    let create_time_lbl: SmolStr = match create_time {
      Some(item) => SmolStr::new(item.format("%Y-%m-%d %H:%M:%S").to_string()),
      None => SmolStr::new(""),
    };
    
    let model = Self {
      tenant_id,
      id,
      appid,
      mchid,
      out_trade_no,
      transaction_id,
      out_refund_no,
      refund_id,
      reason,
      attach2,
      notify_url,
      channel,
      channel_lbl,
      user_received_account,
      success_time,
      success_time_lbl,
      status,
      status_lbl,
      funds_account,
      funds_account_lbl,
      amount_total,
      amount_refund,
      amount_payer_total,
      amount_payer_refund,
      amount_settlement_refund,
      amount_discount_refund,
      amount_currency,
      amount_currency_lbl,
      amount_refund_fee,
      rem,
      create_time,
      create_time_lbl,
    };
    
    Ok(model)
  }
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Debug)]
#[graphql(rename_fields = "snake_case", name = "WxRefundFieldComment")]
#[allow(dead_code)]
pub struct WxRefundFieldComment {
  /// ID
  #[graphql(name = "id")]
  pub id: SmolStr,
  /// 开发者ID
  #[graphql(name = "appid")]
  pub appid: SmolStr,
  /// 商户号
  #[graphql(name = "mchid")]
  pub mchid: SmolStr,
  /// 商户订单号
  #[graphql(name = "out_trade_no")]
  pub out_trade_no: SmolStr,
  /// 微信支付订单号
  #[graphql(name = "transaction_id")]
  pub transaction_id: SmolStr,
  /// 商户退款单号
  #[graphql(name = "out_refund_no")]
  pub out_refund_no: SmolStr,
  /// 微信退款单号
  #[graphql(name = "refund_id")]
  pub refund_id: SmolStr,
  /// 退款原因
  #[graphql(name = "reason")]
  pub reason: SmolStr,
  /// 退款渠道
  #[graphql(name = "channel")]
  pub channel: SmolStr,
  /// 退款渠道
  #[graphql(name = "channel_lbl")]
  pub channel_lbl: SmolStr,
  /// 退款入账账户
  #[graphql(name = "user_received_account")]
  pub user_received_account: SmolStr,
  /// 退款成功时间
  #[graphql(name = "success_time")]
  pub success_time: SmolStr,
  /// 退款成功时间
  #[graphql(name = "success_time_lbl")]
  pub success_time_lbl: SmolStr,
  /// 退款状态
  #[graphql(name = "status")]
  pub status: SmolStr,
  /// 退款状态
  #[graphql(name = "status_lbl")]
  pub status_lbl: SmolStr,
  /// 资金账户
  #[graphql(name = "funds_account")]
  pub funds_account: SmolStr,
  /// 资金账户
  #[graphql(name = "funds_account_lbl")]
  pub funds_account_lbl: SmolStr,
  /// 订单金额(分)
  #[graphql(name = "amount_total")]
  pub amount_total: SmolStr,
  /// 退款金额(分)
  #[graphql(name = "amount_refund")]
  pub amount_refund: SmolStr,
  /// 用户实际支付金额(分)
  #[graphql(name = "amount_payer_total")]
  pub amount_payer_total: SmolStr,
  /// 用户退款金额(分)
  #[graphql(name = "amount_payer_refund")]
  pub amount_payer_refund: SmolStr,
  /// 应结退款金额(分)
  #[graphql(name = "amount_settlement_refund")]
  pub amount_settlement_refund: SmolStr,
  /// 优惠退款金额(分)
  #[graphql(name = "amount_discount_refund")]
  pub amount_discount_refund: SmolStr,
  /// 退款币种
  #[graphql(name = "amount_currency")]
  pub amount_currency: SmolStr,
  /// 退款币种
  #[graphql(name = "amount_currency_lbl")]
  pub amount_currency_lbl: SmolStr,
  /// 手续费退款金额(分)
  #[graphql(name = "amount_refund_fee")]
  pub amount_refund_fee: SmolStr,
  /// 备注
  #[graphql(name = "rem")]
  pub rem: SmolStr,
  /// 创建时间
  #[graphql(name = "create_time")]
  pub create_time: SmolStr,
  /// 创建时间
  #[graphql(name = "create_time_lbl")]
  pub create_time_lbl: SmolStr,
}

#[derive(InputObject, Serialize, Deserialize, Default, Clone)]
#[graphql(rename_fields = "snake_case", name = "WxRefundSearch")]
#[allow(dead_code)]
pub struct WxRefundSearch {
  /// ID
  pub id: Option<WxRefundId>,
  /// ID列表
  pub ids: Option<Vec<WxRefundId>>,
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  /// 开发者ID
  #[graphql(skip)]
  pub appid: Option<SmolStr>,
  /// 开发者ID
  #[graphql(skip)]
  pub appid_like: Option<SmolStr>,
  /// 商户号
  #[graphql(skip)]
  pub mchid: Option<SmolStr>,
  /// 商户号
  #[graphql(skip)]
  pub mchid_like: Option<SmolStr>,
  /// 商户订单号
  #[graphql(skip)]
  pub out_trade_no: Option<SmolStr>,
  /// 商户订单号
  #[graphql(skip)]
  pub out_trade_no_like: Option<SmolStr>,
  /// 微信支付订单号
  #[graphql(name = "transaction_id")]
  pub transaction_id: Option<SmolStr>,
  /// 微信支付订单号
  #[graphql(name = "transaction_id_like")]
  pub transaction_id_like: Option<SmolStr>,
  /// 商户退款单号
  #[graphql(name = "out_refund_no")]
  pub out_refund_no: Option<SmolStr>,
  /// 商户退款单号
  #[graphql(name = "out_refund_no_like")]
  pub out_refund_no_like: Option<SmolStr>,
  /// 微信退款单号
  #[graphql(name = "refund_id")]
  pub refund_id: Option<SmolStr>,
  /// 微信退款单号
  #[graphql(name = "refund_id_like")]
  pub refund_id_like: Option<SmolStr>,
  /// 退款原因
  #[graphql(skip)]
  pub reason: Option<SmolStr>,
  /// 退款原因
  #[graphql(skip)]
  pub reason_like: Option<SmolStr>,
  /// 附加数据2
  #[graphql(skip)]
  pub attach2: Option<SmolStr>,
  /// 附加数据2
  #[graphql(skip)]
  pub attach2_like: Option<SmolStr>,
  /// 退款结果回调地址
  #[graphql(skip)]
  pub notify_url: Option<SmolStr>,
  /// 退款结果回调地址
  #[graphql(skip)]
  pub notify_url_like: Option<SmolStr>,
  /// 退款渠道
  #[graphql(skip)]
  pub channel: Option<Vec<WxRefundChannel>>,
  /// 退款入账账户
  #[graphql(skip)]
  pub user_received_account: Option<SmolStr>,
  /// 退款入账账户
  #[graphql(skip)]
  pub user_received_account_like: Option<SmolStr>,
  /// 退款成功时间
  #[graphql(name = "success_time")]
  pub success_time: Option<[Option<chrono::NaiveDateTime>; 2]>,
  /// 退款状态
  #[graphql(name = "status")]
  pub status: Option<Vec<WxRefundStatus>>,
  /// 资金账户
  #[graphql(skip)]
  pub funds_account: Option<Vec<WxRefundFundsAccount>>,
  /// 订单金额(分)
  #[graphql(skip)]
  pub amount_total: Option<[Option<u32>; 2]>,
  /// 退款金额(分)
  #[graphql(skip)]
  pub amount_refund: Option<[Option<u32>; 2]>,
  /// 用户实际支付金额(分)
  #[graphql(skip)]
  pub amount_payer_total: Option<[Option<u32>; 2]>,
  /// 用户退款金额(分)
  #[graphql(skip)]
  pub amount_payer_refund: Option<[Option<u32>; 2]>,
  /// 应结退款金额(分)
  #[graphql(skip)]
  pub amount_settlement_refund: Option<[Option<u32>; 2]>,
  /// 优惠退款金额(分)
  #[graphql(skip)]
  pub amount_discount_refund: Option<[Option<u32>; 2]>,
  /// 退款币种
  #[graphql(skip)]
  pub amount_currency: Option<Vec<WxRefundAmountCurrency>>,
  /// 手续费退款金额(分)
  #[graphql(skip)]
  pub amount_refund_fee: Option<[Option<u32>; 2]>,
  /// 备注
  #[graphql(skip)]
  pub rem: Option<SmolStr>,
  /// 备注
  #[graphql(skip)]
  pub rem_like: Option<SmolStr>,
  /// 创建时间
  #[graphql(skip)]
  pub create_time: Option<[Option<chrono::NaiveDateTime>; 2]>,
}

impl std::fmt::Debug for WxRefundSearch {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("WxRefundSearch");
    if let Some(ref id) = self.id {
      item = item.field("id", id);
    }
    if let Some(ref ids) = self.ids {
      item = item.field("ids", ids);
    }
    if let Some(ref tenant_id) = self.tenant_id {
      item = item.field("tenant_id", tenant_id);
    }
    // 开发者ID
    if let Some(ref appid) = self.appid {
      item = item.field("appid", appid);
    }
    if let Some(ref appid_like) = self.appid_like {
      item = item.field("appid_like", appid_like);
    }
    // 商户号
    if let Some(ref mchid) = self.mchid {
      item = item.field("mchid", mchid);
    }
    if let Some(ref mchid_like) = self.mchid_like {
      item = item.field("mchid_like", mchid_like);
    }
    // 商户订单号
    if let Some(ref out_trade_no) = self.out_trade_no {
      item = item.field("out_trade_no", out_trade_no);
    }
    if let Some(ref out_trade_no_like) = self.out_trade_no_like {
      item = item.field("out_trade_no_like", out_trade_no_like);
    }
    // 微信支付订单号
    if let Some(ref transaction_id) = self.transaction_id {
      item = item.field("transaction_id", transaction_id);
    }
    if let Some(ref transaction_id_like) = self.transaction_id_like {
      item = item.field("transaction_id_like", transaction_id_like);
    }
    // 商户退款单号
    if let Some(ref out_refund_no) = self.out_refund_no {
      item = item.field("out_refund_no", out_refund_no);
    }
    if let Some(ref out_refund_no_like) = self.out_refund_no_like {
      item = item.field("out_refund_no_like", out_refund_no_like);
    }
    // 微信退款单号
    if let Some(ref refund_id) = self.refund_id {
      item = item.field("refund_id", refund_id);
    }
    if let Some(ref refund_id_like) = self.refund_id_like {
      item = item.field("refund_id_like", refund_id_like);
    }
    // 退款原因
    if let Some(ref reason) = self.reason {
      item = item.field("reason", reason);
    }
    if let Some(ref reason_like) = self.reason_like {
      item = item.field("reason_like", reason_like);
    }
    // 附加数据2
    if let Some(ref attach2) = self.attach2 {
      item = item.field("attach2", attach2);
    }
    if let Some(ref attach2_like) = self.attach2_like {
      item = item.field("attach2_like", attach2_like);
    }
    // 退款结果回调地址
    if let Some(ref notify_url) = self.notify_url {
      item = item.field("notify_url", notify_url);
    }
    if let Some(ref notify_url_like) = self.notify_url_like {
      item = item.field("notify_url_like", notify_url_like);
    }
    // 退款渠道
    if let Some(ref channel) = self.channel {
      item = item.field("channel", channel);
    }
    // 退款入账账户
    if let Some(ref user_received_account) = self.user_received_account {
      item = item.field("user_received_account", user_received_account);
    }
    if let Some(ref user_received_account_like) = self.user_received_account_like {
      item = item.field("user_received_account_like", user_received_account_like);
    }
    // 退款成功时间
    if let Some(ref success_time) = self.success_time {
      item = item.field("success_time", success_time);
    }
    // 退款状态
    if let Some(ref status) = self.status {
      item = item.field("status", status);
    }
    // 资金账户
    if let Some(ref funds_account) = self.funds_account {
      item = item.field("funds_account", funds_account);
    }
    // 订单金额(分)
    if let Some(ref amount_total) = self.amount_total {
      item = item.field("amount_total", amount_total);
    }
    // 退款金额(分)
    if let Some(ref amount_refund) = self.amount_refund {
      item = item.field("amount_refund", amount_refund);
    }
    // 用户实际支付金额(分)
    if let Some(ref amount_payer_total) = self.amount_payer_total {
      item = item.field("amount_payer_total", amount_payer_total);
    }
    // 用户退款金额(分)
    if let Some(ref amount_payer_refund) = self.amount_payer_refund {
      item = item.field("amount_payer_refund", amount_payer_refund);
    }
    // 应结退款金额(分)
    if let Some(ref amount_settlement_refund) = self.amount_settlement_refund {
      item = item.field("amount_settlement_refund", amount_settlement_refund);
    }
    // 优惠退款金额(分)
    if let Some(ref amount_discount_refund) = self.amount_discount_refund {
      item = item.field("amount_discount_refund", amount_discount_refund);
    }
    // 退款币种
    if let Some(ref amount_currency) = self.amount_currency {
      item = item.field("amount_currency", amount_currency);
    }
    // 手续费退款金额(分)
    if let Some(ref amount_refund_fee) = self.amount_refund_fee {
      item = item.field("amount_refund_fee", amount_refund_fee);
    }
    // 备注
    if let Some(ref rem) = self.rem {
      item = item.field("rem", rem);
    }
    if let Some(ref rem_like) = self.rem_like {
      item = item.field("rem_like", rem_like);
    }
    // 创建时间
    if let Some(ref create_time) = self.create_time {
      item = item.field("create_time", create_time);
    }
    item.finish()
  }
}

#[derive(InputObject, Serialize, Deserialize, Default, Clone)]
#[graphql(rename_fields = "snake_case", name = "WxRefundInput")]
#[allow(dead_code)]
pub struct WxRefundInput {
  /// ID
  pub id: Option<WxRefundId>,
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  /// 开发者ID
  #[graphql(name = "appid")]
  pub appid: Option<SmolStr>,
  /// 商户号
  #[graphql(name = "mchid")]
  pub mchid: Option<SmolStr>,
  /// 商户订单号
  #[graphql(name = "out_trade_no")]
  pub out_trade_no: Option<SmolStr>,
  /// 微信支付订单号
  #[graphql(name = "transaction_id")]
  pub transaction_id: Option<SmolStr>,
  /// 商户退款单号
  #[graphql(name = "out_refund_no")]
  pub out_refund_no: Option<SmolStr>,
  /// 微信退款单号
  #[graphql(name = "refund_id")]
  pub refund_id: Option<SmolStr>,
  /// 退款原因
  #[graphql(name = "reason")]
  pub reason: Option<SmolStr>,
  /// 附加数据2
  #[graphql(skip)]
  pub attach2: Option<SmolStr>,
  /// 退款结果回调地址
  #[graphql(skip)]
  pub notify_url: Option<SmolStr>,
  /// 退款渠道
  #[graphql(name = "channel")]
  pub channel: Option<WxRefundChannel>,
  /// 退款渠道
  #[graphql(name = "channel_lbl")]
  pub channel_lbl: Option<SmolStr>,
  /// 退款入账账户
  #[graphql(name = "user_received_account")]
  pub user_received_account: Option<SmolStr>,
  /// 退款成功时间
  #[graphql(name = "success_time")]
  pub success_time: Option<chrono::NaiveDateTime>,
  /// 退款成功时间
  #[graphql(name = "success_time_lbl")]
  pub success_time_lbl: Option<SmolStr>,
  /// 退款成功时间
  #[graphql(name = "success_time_save_null")]
  pub success_time_save_null: Option<bool>,
  /// 退款状态
  #[graphql(name = "status")]
  pub status: Option<WxRefundStatus>,
  /// 退款状态
  #[graphql(name = "status_lbl")]
  pub status_lbl: Option<SmolStr>,
  /// 资金账户
  #[graphql(name = "funds_account")]
  pub funds_account: Option<WxRefundFundsAccount>,
  /// 资金账户
  #[graphql(name = "funds_account_lbl")]
  pub funds_account_lbl: Option<SmolStr>,
  /// 订单金额(分)
  #[graphql(name = "amount_total")]
  pub amount_total: Option<u32>,
  /// 退款金额(分)
  #[graphql(name = "amount_refund")]
  pub amount_refund: Option<u32>,
  /// 用户实际支付金额(分)
  #[graphql(name = "amount_payer_total")]
  pub amount_payer_total: Option<u32>,
  /// 用户退款金额(分)
  #[graphql(name = "amount_payer_refund")]
  pub amount_payer_refund: Option<u32>,
  /// 应结退款金额(分)
  #[graphql(name = "amount_settlement_refund")]
  pub amount_settlement_refund: Option<u32>,
  /// 优惠退款金额(分)
  #[graphql(name = "amount_discount_refund")]
  pub amount_discount_refund: Option<u32>,
  /// 退款币种
  #[graphql(name = "amount_currency")]
  pub amount_currency: Option<WxRefundAmountCurrency>,
  /// 退款币种
  #[graphql(name = "amount_currency_lbl")]
  pub amount_currency_lbl: Option<SmolStr>,
  /// 手续费退款金额(分)
  #[graphql(name = "amount_refund_fee")]
  pub amount_refund_fee: Option<u32>,
  /// 备注
  #[graphql(name = "rem")]
  pub rem: Option<SmolStr>,
  /// 创建时间
  #[graphql(skip)]
  pub create_time: Option<chrono::NaiveDateTime>,
  /// 创建时间
  #[graphql(skip)]
  pub create_time_lbl: Option<SmolStr>,
  /// 创建时间
  #[graphql(skip)]
  pub create_time_save_null: Option<bool>,
}

impl std::fmt::Debug for WxRefundInput {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("WxRefundInput");
    if let Some(ref id) = self.id {
      item = item.field("id", id);
    }
    if let Some(ref tenant_id) = self.tenant_id {
      item = item.field("tenant_id", tenant_id);
    }
    if let Some(ref appid) = self.appid {
      item = item.field("appid", appid);
    }
    if let Some(ref mchid) = self.mchid {
      item = item.field("mchid", mchid);
    }
    if let Some(ref out_trade_no) = self.out_trade_no {
      item = item.field("out_trade_no", out_trade_no);
    }
    if let Some(ref transaction_id) = self.transaction_id {
      item = item.field("transaction_id", transaction_id);
    }
    if let Some(ref out_refund_no) = self.out_refund_no {
      item = item.field("out_refund_no", out_refund_no);
    }
    if let Some(ref refund_id) = self.refund_id {
      item = item.field("refund_id", refund_id);
    }
    if let Some(ref reason) = self.reason {
      item = item.field("reason", reason);
    }
    if let Some(ref attach2) = self.attach2 {
      item = item.field("attach2", attach2);
    }
    if let Some(ref notify_url) = self.notify_url {
      item = item.field("notify_url", notify_url);
    }
    if let Some(ref channel) = self.channel {
      item = item.field("channel", channel);
    }
    if let Some(ref user_received_account) = self.user_received_account {
      item = item.field("user_received_account", user_received_account);
    }
    if let Some(ref success_time) = self.success_time {
      item = item.field("success_time", success_time);
    }
    if let Some(ref status) = self.status {
      item = item.field("status", status);
    }
    if let Some(ref funds_account) = self.funds_account {
      item = item.field("funds_account", funds_account);
    }
    if let Some(ref amount_total) = self.amount_total {
      item = item.field("amount_total", amount_total);
    }
    if let Some(ref amount_refund) = self.amount_refund {
      item = item.field("amount_refund", amount_refund);
    }
    if let Some(ref amount_payer_total) = self.amount_payer_total {
      item = item.field("amount_payer_total", amount_payer_total);
    }
    if let Some(ref amount_payer_refund) = self.amount_payer_refund {
      item = item.field("amount_payer_refund", amount_payer_refund);
    }
    if let Some(ref amount_settlement_refund) = self.amount_settlement_refund {
      item = item.field("amount_settlement_refund", amount_settlement_refund);
    }
    if let Some(ref amount_discount_refund) = self.amount_discount_refund {
      item = item.field("amount_discount_refund", amount_discount_refund);
    }
    if let Some(ref amount_currency) = self.amount_currency {
      item = item.field("amount_currency", amount_currency);
    }
    if let Some(ref amount_refund_fee) = self.amount_refund_fee {
      item = item.field("amount_refund_fee", amount_refund_fee);
    }
    if let Some(ref rem) = self.rem {
      item = item.field("rem", rem);
    }
    if let Some(ref create_time) = self.create_time {
      item = item.field("create_time", create_time);
    }
    item.finish()
  }
}

impl From<WxRefundModel> for WxRefundInput {
  fn from(model: WxRefundModel) -> Self {
    Self {
      id: model.id.into(),
      tenant_id: model.tenant_id.into(),
      // 开发者ID
      appid: model.appid.into(),
      // 商户号
      mchid: model.mchid.into(),
      // 商户订单号
      out_trade_no: model.out_trade_no.into(),
      // 微信支付订单号
      transaction_id: model.transaction_id.into(),
      // 商户退款单号
      out_refund_no: model.out_refund_no.into(),
      // 微信退款单号
      refund_id: model.refund_id.into(),
      // 退款原因
      reason: model.reason.into(),
      // 附加数据2
      attach2: model.attach2.into(),
      // 退款结果回调地址
      notify_url: model.notify_url.into(),
      // 退款渠道
      channel: model.channel.into(),
      channel_lbl: model.channel_lbl.into(),
      // 退款入账账户
      user_received_account: model.user_received_account.into(),
      // 退款成功时间
      success_time: model.success_time,
      success_time_lbl: model.success_time_lbl.into(),
      success_time_save_null: Some(true),
      // 退款状态
      status: model.status.into(),
      status_lbl: model.status_lbl.into(),
      // 资金账户
      funds_account: model.funds_account.into(),
      funds_account_lbl: model.funds_account_lbl.into(),
      // 订单金额(分)
      amount_total: model.amount_total.into(),
      // 退款金额(分)
      amount_refund: model.amount_refund.into(),
      // 用户实际支付金额(分)
      amount_payer_total: model.amount_payer_total.into(),
      // 用户退款金额(分)
      amount_payer_refund: model.amount_payer_refund.into(),
      // 应结退款金额(分)
      amount_settlement_refund: model.amount_settlement_refund.into(),
      // 优惠退款金额(分)
      amount_discount_refund: model.amount_discount_refund.into(),
      // 退款币种
      amount_currency: model.amount_currency.into(),
      amount_currency_lbl: model.amount_currency_lbl.into(),
      // 手续费退款金额(分)
      amount_refund_fee: model.amount_refund_fee.into(),
      // 备注
      rem: model.rem.into(),
      // 创建时间
      create_time: model.create_time,
      create_time_lbl: model.create_time_lbl.into(),
      create_time_save_null: Some(true),
    }
  }
}

impl From<WxRefundInput> for WxRefundSearch {
  fn from(input: WxRefundInput) -> Self {
    Self {
      id: input.id,
      ids: None,
      // 租户ID
      tenant_id: input.tenant_id,
      // 开发者ID
      appid: input.appid,
      // 商户号
      mchid: input.mchid,
      // 商户订单号
      out_trade_no: input.out_trade_no,
      // 微信支付订单号
      transaction_id: input.transaction_id,
      // 商户退款单号
      out_refund_no: input.out_refund_no,
      // 微信退款单号
      refund_id: input.refund_id,
      // 退款原因
      reason: input.reason,
      // 附加数据2
      attach2: input.attach2,
      // 退款结果回调地址
      notify_url: input.notify_url,
      // 退款渠道
      channel: input.channel.map(|x| vec![x]),
      // 退款入账账户
      user_received_account: input.user_received_account,
      // 退款成功时间
      success_time: input.success_time.map(|x| [Some(x), Some(x)]),
      // 退款状态
      status: input.status.map(|x| vec![x]),
      // 资金账户
      funds_account: input.funds_account.map(|x| vec![x]),
      // 订单金额(分)
      amount_total: input.amount_total.map(|x| [Some(x), Some(x)]),
      // 退款金额(分)
      amount_refund: input.amount_refund.map(|x| [Some(x), Some(x)]),
      // 用户实际支付金额(分)
      amount_payer_total: input.amount_payer_total.map(|x| [Some(x), Some(x)]),
      // 用户退款金额(分)
      amount_payer_refund: input.amount_payer_refund.map(|x| [Some(x), Some(x)]),
      // 应结退款金额(分)
      amount_settlement_refund: input.amount_settlement_refund.map(|x| [Some(x), Some(x)]),
      // 优惠退款金额(分)
      amount_discount_refund: input.amount_discount_refund.map(|x| [Some(x), Some(x)]),
      // 退款币种
      amount_currency: input.amount_currency.map(|x| vec![x]),
      // 手续费退款金额(分)
      amount_refund_fee: input.amount_refund_fee.map(|x| [Some(x), Some(x)]),
      // 备注
      rem: input.rem,
      // 创建时间
      create_time: input.create_time.map(|x| [Some(x), Some(x)]),
      ..Default::default()
    }
  }
}

impl_id!(WxRefundId);

/// 微信退款申请退款渠道
#[derive(Enum, Copy, Clone, Default, Eq, PartialEq, Serialize, Deserialize, Debug)]
pub enum WxRefundChannel {
  /// 原路退款
  #[default]
  #[graphql(name="ORIGINAL")]
  #[serde(rename = "ORIGINAL")]
  Original,
  /// 退回到余额
  #[graphql(name="BALANCE")]
  #[serde(rename = "BALANCE")]
  Balance,
  /// 原账户异常退到其他余额账户
  #[graphql(name="OTHER_BALANCE")]
  #[serde(rename = "OTHER_BALANCE")]
  OtherBalance,
  /// 原银行卡异常退到其他银行卡(发起异常退款成功后返回)
  #[graphql(name="OTHER_BANKCARD")]
  #[serde(rename = "OTHER_BANKCARD")]
  OtherBankcard,
}

impl fmt::Display for WxRefundChannel {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    match self {
      Self::Original => write!(f, "ORIGINAL"),
      Self::Balance => write!(f, "BALANCE"),
      Self::OtherBalance => write!(f, "OTHER_BALANCE"),
      Self::OtherBankcard => write!(f, "OTHER_BANKCARD"),
    }
  }
}

impl From<WxRefundChannel> for SmolStr {
  fn from(value: WxRefundChannel) -> Self {
    match value {
      WxRefundChannel::Original => "ORIGINAL".into(),
      WxRefundChannel::Balance => "BALANCE".into(),
      WxRefundChannel::OtherBalance => "OTHER_BALANCE".into(),
      WxRefundChannel::OtherBankcard => "OTHER_BANKCARD".into(),
    }
  }
}

impl From<WxRefundChannel> for String {
  fn from(value: WxRefundChannel) -> Self {
    match value {
      WxRefundChannel::Original => "ORIGINAL".into(),
      WxRefundChannel::Balance => "BALANCE".into(),
      WxRefundChannel::OtherBalance => "OTHER_BALANCE".into(),
      WxRefundChannel::OtherBankcard => "OTHER_BANKCARD".into(),
    }
  }
}

impl From<WxRefundChannel> for ArgType {
  fn from(value: WxRefundChannel) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl FromStr for WxRefundChannel {
  type Err = color_eyre::eyre::Error;
  
  fn from_str(s: &str) -> Result<Self, Self::Err> {
    match s {
      "ORIGINAL" => Ok(Self::Original),
      "BALANCE" => Ok(Self::Balance),
      "OTHER_BALANCE" => Ok(Self::OtherBalance),
      "OTHER_BANKCARD" => Ok(Self::OtherBankcard),
      _ => Err(eyre!("{s} 无法转换到 退款渠道")),
    }
  }
}

impl TryFrom<&str> for WxRefundChannel {
  type Error = sqlx::Error;
  
  fn try_from(s: &str) -> Result<Self, sqlx::Error> {
    match s {
      "ORIGINAL" => Ok(Self::Original),
      "BALANCE" => Ok(Self::Balance),
      "OTHER_BALANCE" => Ok(Self::OtherBalance),
      "OTHER_BANKCARD" => Ok(Self::OtherBankcard),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "channel".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "{s} 无法转换到 退款渠道".to_owned(),
          )),
        }),
      )),
    }
  }
}

impl TryFrom<SmolStr> for WxRefundChannel {
  type Error = sqlx::Error;
  
  fn try_from(s: SmolStr) -> Result<Self, sqlx::Error> {
    match s.as_str() {
      "ORIGINAL" => Ok(Self::Original),
      "BALANCE" => Ok(Self::Balance),
      "OTHER_BALANCE" => Ok(Self::OtherBalance),
      "OTHER_BANKCARD" => Ok(Self::OtherBankcard),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "channel".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "{s} 无法转换到 退款渠道".to_owned(),
          )),
        }),
      )),
    }
  }
}

impl WxRefundChannel {
  pub fn as_str(&self) -> &str {
    match self {
      Self::Original => "ORIGINAL",
      Self::Balance => "BALANCE",
      Self::OtherBalance => "OTHER_BALANCE",
      Self::OtherBankcard => "OTHER_BANKCARD",
    }
  }
}

impl TryFrom<String> for WxRefundChannel {
  type Error = sqlx::Error;
  
  fn try_from(s: String) -> Result<Self, sqlx::Error> {
    match s.as_str() {
      "ORIGINAL" => Ok(Self::Original),
      "BALANCE" => Ok(Self::Balance),
      "OTHER_BALANCE" => Ok(Self::OtherBalance),
      "OTHER_BANKCARD" => Ok(Self::OtherBankcard),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "channel".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "{s} 无法转换到 退款渠道".to_owned(),
          )),
        }),
      )),
    }
  }
}

/// 微信退款申请退款状态
#[derive(Enum, Copy, Clone, Default, Eq, PartialEq, Serialize, Deserialize, Debug)]
pub enum WxRefundStatus {
  /// 未退款
  #[default]
  #[graphql(name="NO_REFUND")]
  #[serde(rename = "NO_REFUND")]
  NoRefund,
  /// 退款成功
  #[graphql(name="SUCCESS")]
  #[serde(rename = "SUCCESS")]
  Success,
  /// 退款关闭
  #[graphql(name="CLOSED")]
  #[serde(rename = "CLOSED")]
  Closed,
  /// 退款处理中
  #[graphql(name="PROCESSING")]
  #[serde(rename = "PROCESSING")]
  Processing,
  /// 退款异常
  #[graphql(name="ABNORMAL")]
  #[serde(rename = "ABNORMAL")]
  Abnormal,
}

impl fmt::Display for WxRefundStatus {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    match self {
      Self::NoRefund => write!(f, "NO_REFUND"),
      Self::Success => write!(f, "SUCCESS"),
      Self::Closed => write!(f, "CLOSED"),
      Self::Processing => write!(f, "PROCESSING"),
      Self::Abnormal => write!(f, "ABNORMAL"),
    }
  }
}

impl From<WxRefundStatus> for SmolStr {
  fn from(value: WxRefundStatus) -> Self {
    match value {
      WxRefundStatus::NoRefund => "NO_REFUND".into(),
      WxRefundStatus::Success => "SUCCESS".into(),
      WxRefundStatus::Closed => "CLOSED".into(),
      WxRefundStatus::Processing => "PROCESSING".into(),
      WxRefundStatus::Abnormal => "ABNORMAL".into(),
    }
  }
}

impl From<WxRefundStatus> for String {
  fn from(value: WxRefundStatus) -> Self {
    match value {
      WxRefundStatus::NoRefund => "NO_REFUND".into(),
      WxRefundStatus::Success => "SUCCESS".into(),
      WxRefundStatus::Closed => "CLOSED".into(),
      WxRefundStatus::Processing => "PROCESSING".into(),
      WxRefundStatus::Abnormal => "ABNORMAL".into(),
    }
  }
}

impl From<WxRefundStatus> for ArgType {
  fn from(value: WxRefundStatus) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl FromStr for WxRefundStatus {
  type Err = color_eyre::eyre::Error;
  
  fn from_str(s: &str) -> Result<Self, Self::Err> {
    match s {
      "NO_REFUND" => Ok(Self::NoRefund),
      "SUCCESS" => Ok(Self::Success),
      "CLOSED" => Ok(Self::Closed),
      "PROCESSING" => Ok(Self::Processing),
      "ABNORMAL" => Ok(Self::Abnormal),
      _ => Err(eyre!("{s} 无法转换到 退款状态")),
    }
  }
}

impl TryFrom<&str> for WxRefundStatus {
  type Error = sqlx::Error;
  
  fn try_from(s: &str) -> Result<Self, sqlx::Error> {
    match s {
      "NO_REFUND" => Ok(Self::NoRefund),
      "SUCCESS" => Ok(Self::Success),
      "CLOSED" => Ok(Self::Closed),
      "PROCESSING" => Ok(Self::Processing),
      "ABNORMAL" => Ok(Self::Abnormal),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "status".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "{s} 无法转换到 退款状态".to_owned(),
          )),
        }),
      )),
    }
  }
}

impl TryFrom<SmolStr> for WxRefundStatus {
  type Error = sqlx::Error;
  
  fn try_from(s: SmolStr) -> Result<Self, sqlx::Error> {
    match s.as_str() {
      "NO_REFUND" => Ok(Self::NoRefund),
      "SUCCESS" => Ok(Self::Success),
      "CLOSED" => Ok(Self::Closed),
      "PROCESSING" => Ok(Self::Processing),
      "ABNORMAL" => Ok(Self::Abnormal),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "status".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "{s} 无法转换到 退款状态".to_owned(),
          )),
        }),
      )),
    }
  }
}

impl WxRefundStatus {
  pub fn as_str(&self) -> &str {
    match self {
      Self::NoRefund => "NO_REFUND",
      Self::Success => "SUCCESS",
      Self::Closed => "CLOSED",
      Self::Processing => "PROCESSING",
      Self::Abnormal => "ABNORMAL",
    }
  }
}

impl TryFrom<String> for WxRefundStatus {
  type Error = sqlx::Error;
  
  fn try_from(s: String) -> Result<Self, sqlx::Error> {
    match s.as_str() {
      "NO_REFUND" => Ok(Self::NoRefund),
      "SUCCESS" => Ok(Self::Success),
      "CLOSED" => Ok(Self::Closed),
      "PROCESSING" => Ok(Self::Processing),
      "ABNORMAL" => Ok(Self::Abnormal),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "status".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "{s} 无法转换到 退款状态".to_owned(),
          )),
        }),
      )),
    }
  }
}

/// 微信退款申请资金账户
#[derive(Enum, Copy, Clone, Default, Eq, PartialEq, Serialize, Deserialize, Debug)]
pub enum WxRefundFundsAccount {
  /// 未结算资金
  #[default]
  #[graphql(name="UNSETTLED")]
  #[serde(rename = "UNSETTLED")]
  Unsettled,
  /// 可用余额
  #[graphql(name="AVAILABLE")]
  #[serde(rename = "AVAILABLE")]
  Available,
  /// 不可用余额
  #[graphql(name="UNAVAILABLE")]
  #[serde(rename = "UNAVAILABLE")]
  Unavailable,
  /// 运营账户
  #[graphql(name="OPERATION")]
  #[serde(rename = "OPERATION")]
  Operation,
  /// 基本账户
  #[graphql(name="BASIC")]
  #[serde(rename = "BASIC")]
  Basic,
  /// 数字人民币基本账户
  #[graphql(name="ECNY_BASIC")]
  #[serde(rename = "ECNY_BASIC")]
  EcnyBasic,
}

impl fmt::Display for WxRefundFundsAccount {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    match self {
      Self::Unsettled => write!(f, "UNSETTLED"),
      Self::Available => write!(f, "AVAILABLE"),
      Self::Unavailable => write!(f, "UNAVAILABLE"),
      Self::Operation => write!(f, "OPERATION"),
      Self::Basic => write!(f, "BASIC"),
      Self::EcnyBasic => write!(f, "ECNY_BASIC"),
    }
  }
}

impl From<WxRefundFundsAccount> for SmolStr {
  fn from(value: WxRefundFundsAccount) -> Self {
    match value {
      WxRefundFundsAccount::Unsettled => "UNSETTLED".into(),
      WxRefundFundsAccount::Available => "AVAILABLE".into(),
      WxRefundFundsAccount::Unavailable => "UNAVAILABLE".into(),
      WxRefundFundsAccount::Operation => "OPERATION".into(),
      WxRefundFundsAccount::Basic => "BASIC".into(),
      WxRefundFundsAccount::EcnyBasic => "ECNY_BASIC".into(),
    }
  }
}

impl From<WxRefundFundsAccount> for String {
  fn from(value: WxRefundFundsAccount) -> Self {
    match value {
      WxRefundFundsAccount::Unsettled => "UNSETTLED".into(),
      WxRefundFundsAccount::Available => "AVAILABLE".into(),
      WxRefundFundsAccount::Unavailable => "UNAVAILABLE".into(),
      WxRefundFundsAccount::Operation => "OPERATION".into(),
      WxRefundFundsAccount::Basic => "BASIC".into(),
      WxRefundFundsAccount::EcnyBasic => "ECNY_BASIC".into(),
    }
  }
}

impl From<WxRefundFundsAccount> for ArgType {
  fn from(value: WxRefundFundsAccount) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl FromStr for WxRefundFundsAccount {
  type Err = color_eyre::eyre::Error;
  
  fn from_str(s: &str) -> Result<Self, Self::Err> {
    match s {
      "UNSETTLED" => Ok(Self::Unsettled),
      "AVAILABLE" => Ok(Self::Available),
      "UNAVAILABLE" => Ok(Self::Unavailable),
      "OPERATION" => Ok(Self::Operation),
      "BASIC" => Ok(Self::Basic),
      "ECNY_BASIC" => Ok(Self::EcnyBasic),
      _ => Err(eyre!("{s} 无法转换到 资金账户")),
    }
  }
}

impl TryFrom<&str> for WxRefundFundsAccount {
  type Error = sqlx::Error;
  
  fn try_from(s: &str) -> Result<Self, sqlx::Error> {
    match s {
      "UNSETTLED" => Ok(Self::Unsettled),
      "AVAILABLE" => Ok(Self::Available),
      "UNAVAILABLE" => Ok(Self::Unavailable),
      "OPERATION" => Ok(Self::Operation),
      "BASIC" => Ok(Self::Basic),
      "ECNY_BASIC" => Ok(Self::EcnyBasic),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "funds_account".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "{s} 无法转换到 资金账户".to_owned(),
          )),
        }),
      )),
    }
  }
}

impl TryFrom<SmolStr> for WxRefundFundsAccount {
  type Error = sqlx::Error;
  
  fn try_from(s: SmolStr) -> Result<Self, sqlx::Error> {
    match s.as_str() {
      "UNSETTLED" => Ok(Self::Unsettled),
      "AVAILABLE" => Ok(Self::Available),
      "UNAVAILABLE" => Ok(Self::Unavailable),
      "OPERATION" => Ok(Self::Operation),
      "BASIC" => Ok(Self::Basic),
      "ECNY_BASIC" => Ok(Self::EcnyBasic),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "funds_account".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "{s} 无法转换到 资金账户".to_owned(),
          )),
        }),
      )),
    }
  }
}

impl WxRefundFundsAccount {
  pub fn as_str(&self) -> &str {
    match self {
      Self::Unsettled => "UNSETTLED",
      Self::Available => "AVAILABLE",
      Self::Unavailable => "UNAVAILABLE",
      Self::Operation => "OPERATION",
      Self::Basic => "BASIC",
      Self::EcnyBasic => "ECNY_BASIC",
    }
  }
}

impl TryFrom<String> for WxRefundFundsAccount {
  type Error = sqlx::Error;
  
  fn try_from(s: String) -> Result<Self, sqlx::Error> {
    match s.as_str() {
      "UNSETTLED" => Ok(Self::Unsettled),
      "AVAILABLE" => Ok(Self::Available),
      "UNAVAILABLE" => Ok(Self::Unavailable),
      "OPERATION" => Ok(Self::Operation),
      "BASIC" => Ok(Self::Basic),
      "ECNY_BASIC" => Ok(Self::EcnyBasic),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "funds_account".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "{s} 无法转换到 资金账户".to_owned(),
          )),
        }),
      )),
    }
  }
}

/// 微信退款申请退款币种
#[derive(Enum, Copy, Clone, Default, Eq, PartialEq, Serialize, Deserialize, Debug)]
pub enum WxRefundAmountCurrency {
  /// 人民币
  #[default]
  #[graphql(name="CNY")]
  #[serde(rename = "CNY")]
  Cny,
}

impl fmt::Display for WxRefundAmountCurrency {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    match self {
      Self::Cny => write!(f, "CNY"),
    }
  }
}

impl From<WxRefundAmountCurrency> for SmolStr {
  fn from(value: WxRefundAmountCurrency) -> Self {
    match value {
      WxRefundAmountCurrency::Cny => "CNY".into(),
    }
  }
}

impl From<WxRefundAmountCurrency> for String {
  fn from(value: WxRefundAmountCurrency) -> Self {
    match value {
      WxRefundAmountCurrency::Cny => "CNY".into(),
    }
  }
}

impl From<WxRefundAmountCurrency> for ArgType {
  fn from(value: WxRefundAmountCurrency) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl FromStr for WxRefundAmountCurrency {
  type Err = color_eyre::eyre::Error;
  
  fn from_str(s: &str) -> Result<Self, Self::Err> {
    match s {
      "CNY" => Ok(Self::Cny),
      _ => Err(eyre!("{s} 无法转换到 退款币种")),
    }
  }
}

impl TryFrom<&str> for WxRefundAmountCurrency {
  type Error = sqlx::Error;
  
  fn try_from(s: &str) -> Result<Self, sqlx::Error> {
    match s {
      "CNY" => Ok(Self::Cny),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "amount_currency".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "{s} 无法转换到 退款币种".to_owned(),
          )),
        }),
      )),
    }
  }
}

impl TryFrom<SmolStr> for WxRefundAmountCurrency {
  type Error = sqlx::Error;
  
  fn try_from(s: SmolStr) -> Result<Self, sqlx::Error> {
    match s.as_str() {
      "CNY" => Ok(Self::Cny),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "amount_currency".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "{s} 无法转换到 退款币种".to_owned(),
          )),
        }),
      )),
    }
  }
}

impl WxRefundAmountCurrency {
  pub fn as_str(&self) -> &str {
    match self {
      Self::Cny => "CNY",
    }
  }
}

impl TryFrom<String> for WxRefundAmountCurrency {
  type Error = sqlx::Error;
  
  fn try_from(s: String) -> Result<Self, sqlx::Error> {
    match s.as_str() {
      "CNY" => Ok(Self::Cny),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "amount_currency".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "{s} 无法转换到 退款币种".to_owned(),
          )),
        }),
      )),
    }
  }
}

/// 微信退款申请 检测字段是否允许前端排序
pub fn check_sort_wx_refund(
  sort: Option<&[SortInput]>,
) -> Result<()> {
  
  if sort.is_none() {
    return Ok(());
  }
  
  let sort = sort.unwrap_or_default();
  
  if sort.is_empty() {
    return Ok(());
  }
  
  let get_can_sort_in_api_wx_refund = get_can_sort_in_api_wx_refund();
  
  for item in sort {
    let prop = item.prop.as_str();
    if prop.is_empty() {
      continue;
    }
    if !get_can_sort_in_api_wx_refund.contains(&prop) {
      return Err(eyre!(ServiceException {
        message: format!("check_sort_wx_refund: {}", serde_json::to_string(item)?).into(),
        trace: true,
        ..Default::default()
      }));
    }
  }
  
  Ok(())
}

// MARK: get_page_path_wx_refund
pub fn get_page_path_wx_refund() -> &'static str {
  "/wx/wx_refund"
}

// MARK: get_table_name_wx_refund
pub fn get_table_name_wx_refund() -> &'static str {
  "wx_wx_refund"
}
