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

use crate::base::tenant::tenant_model::TenantId;

static CAN_SORT_IN_API_WX_REFUND_NOTICE: [&str; 2] = [
  "success_time",
  "create_time",
];

/// 微信退款通知 前端允许排序的字段
fn get_can_sort_in_api_wx_refund_notice() -> &'static [&'static str; 2] {
  &CAN_SORT_IN_API_WX_REFUND_NOTICE
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "WxRefundNoticeModel")]
#[allow(dead_code)]
pub struct WxRefundNoticeModel {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: TenantId,
  /// ID
  pub id: WxRefundNoticeId,
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
  /// 退款状态
  #[graphql(name = "refund_status")]
  pub refund_status: WxRefundNoticeRefundStatus,
  /// 退款状态
  #[graphql(name = "refund_status_lbl")]
  pub refund_status_lbl: SmolStr,
  /// 退款成功时间
  #[graphql(name = "success_time")]
  pub success_time: Option<chrono::NaiveDateTime>,
  /// 退款成功时间
  #[graphql(name = "success_time_lbl")]
  pub success_time_lbl: SmolStr,
  /// 退款入账账户
  #[graphql(name = "user_received_account")]
  pub user_received_account: SmolStr,
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
  /// 创建时间
  pub create_time: Option<chrono::NaiveDateTime>,
  /// 创建时间
  pub create_time_lbl: SmolStr,
}

impl FromRow<'_, MySqlRow> for WxRefundNoticeModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;
    // ID
    let id: WxRefundNoticeId = row.try_get("id")?;
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
    // 退款状态
    let refund_status_lbl: &str = row.try_get("refund_status")?;
    let refund_status: WxRefundNoticeRefundStatus = refund_status_lbl.try_into()?;
    let refund_status_lbl = SmolStr::new(refund_status_lbl);
    // 退款成功时间
    let success_time: Option<chrono::NaiveDateTime> = row.try_get("success_time")?;
    let success_time_lbl: SmolStr = match success_time {
      Some(item) => SmolStr::new(item.format("%Y-%m-%d %H:%M:%S").to_string()),
      None => SmolStr::new(""),
    };
    // 退款入账账户
    let user_received_account: &str = row.try_get("user_received_account")?;
    let user_received_account = SmolStr::new(user_received_account);
    // 订单金额(分)
    let amount_total: u32 = row.try_get("amount_total")?;
    // 退款金额(分)
    let amount_refund: u32 = row.try_get("amount_refund")?;
    // 用户实际支付金额(分)
    let amount_payer_total: u32 = row.try_get("amount_payer_total")?;
    // 用户退款金额(分)
    let amount_payer_refund: u32 = row.try_get("amount_payer_refund")?;
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
      refund_status,
      refund_status_lbl,
      success_time,
      success_time_lbl,
      user_received_account,
      amount_total,
      amount_refund,
      amount_payer_total,
      amount_payer_refund,
      create_time,
      create_time_lbl,
    };
    
    Ok(model)
  }
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Debug)]
#[graphql(rename_fields = "snake_case", name = "WxRefundNoticeFieldComment")]
#[allow(dead_code)]
pub struct WxRefundNoticeFieldComment {
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
  /// 退款状态
  #[graphql(name = "refund_status")]
  pub refund_status: SmolStr,
  /// 退款状态
  #[graphql(name = "refund_status_lbl")]
  pub refund_status_lbl: SmolStr,
  /// 退款成功时间
  #[graphql(name = "success_time")]
  pub success_time: SmolStr,
  /// 退款成功时间
  #[graphql(name = "success_time_lbl")]
  pub success_time_lbl: SmolStr,
  /// 退款入账账户
  #[graphql(name = "user_received_account")]
  pub user_received_account: SmolStr,
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
  /// 创建时间
  #[graphql(name = "create_time")]
  pub create_time: SmolStr,
  /// 创建时间
  #[graphql(name = "create_time_lbl")]
  pub create_time_lbl: SmolStr,
}

#[derive(InputObject, Serialize, Deserialize, Default, Clone)]
#[graphql(rename_fields = "snake_case", name = "WxRefundNoticeSearch")]
#[allow(dead_code)]
pub struct WxRefundNoticeSearch {
  /// ID
  pub id: Option<WxRefundNoticeId>,
  /// ID列表
  pub ids: Option<Vec<WxRefundNoticeId>>,
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
  /// 退款状态
  #[graphql(name = "refund_status")]
  pub refund_status: Option<Vec<WxRefundNoticeRefundStatus>>,
  /// 退款成功时间
  #[graphql(name = "success_time")]
  pub success_time: Option<[Option<chrono::NaiveDateTime>; 2]>,
  /// 退款入账账户
  #[graphql(skip)]
  pub user_received_account: Option<SmolStr>,
  /// 退款入账账户
  #[graphql(skip)]
  pub user_received_account_like: Option<SmolStr>,
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
  /// 创建时间
  #[graphql(skip)]
  pub create_time: Option<[Option<chrono::NaiveDateTime>; 2]>,
}

impl std::fmt::Debug for WxRefundNoticeSearch {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("WxRefundNoticeSearch");
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
    // 退款状态
    if let Some(ref refund_status) = self.refund_status {
      item = item.field("refund_status", refund_status);
    }
    // 退款成功时间
    if let Some(ref success_time) = self.success_time {
      item = item.field("success_time", success_time);
    }
    // 退款入账账户
    if let Some(ref user_received_account) = self.user_received_account {
      item = item.field("user_received_account", user_received_account);
    }
    if let Some(ref user_received_account_like) = self.user_received_account_like {
      item = item.field("user_received_account_like", user_received_account_like);
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
    // 创建时间
    if let Some(ref create_time) = self.create_time {
      item = item.field("create_time", create_time);
    }
    item.finish()
  }
}

#[derive(InputObject, Serialize, Deserialize, Default, Clone)]
#[graphql(rename_fields = "snake_case", name = "WxRefundNoticeInput")]
#[allow(dead_code)]
pub struct WxRefundNoticeInput {
  /// ID
  pub id: Option<WxRefundNoticeId>,
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
  /// 退款状态
  #[graphql(name = "refund_status")]
  pub refund_status: Option<WxRefundNoticeRefundStatus>,
  /// 退款状态
  #[graphql(name = "refund_status_lbl")]
  pub refund_status_lbl: Option<SmolStr>,
  /// 退款成功时间
  #[graphql(name = "success_time")]
  pub success_time: Option<chrono::NaiveDateTime>,
  /// 退款成功时间
  #[graphql(name = "success_time_lbl")]
  pub success_time_lbl: Option<SmolStr>,
  /// 退款成功时间
  #[graphql(name = "success_time_save_null")]
  pub success_time_save_null: Option<bool>,
  /// 退款入账账户
  #[graphql(name = "user_received_account")]
  pub user_received_account: Option<SmolStr>,
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

impl std::fmt::Debug for WxRefundNoticeInput {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("WxRefundNoticeInput");
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
    if let Some(ref refund_status) = self.refund_status {
      item = item.field("refund_status", refund_status);
    }
    if let Some(ref success_time) = self.success_time {
      item = item.field("success_time", success_time);
    }
    if let Some(ref user_received_account) = self.user_received_account {
      item = item.field("user_received_account", user_received_account);
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
    if let Some(ref create_time) = self.create_time {
      item = item.field("create_time", create_time);
    }
    item.finish()
  }
}

impl From<WxRefundNoticeModel> for WxRefundNoticeInput {
  fn from(model: WxRefundNoticeModel) -> Self {
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
      // 退款状态
      refund_status: model.refund_status.into(),
      refund_status_lbl: model.refund_status_lbl.into(),
      // 退款成功时间
      success_time: model.success_time,
      success_time_lbl: model.success_time_lbl.into(),
      success_time_save_null: Some(true),
      // 退款入账账户
      user_received_account: model.user_received_account.into(),
      // 订单金额(分)
      amount_total: model.amount_total.into(),
      // 退款金额(分)
      amount_refund: model.amount_refund.into(),
      // 用户实际支付金额(分)
      amount_payer_total: model.amount_payer_total.into(),
      // 用户退款金额(分)
      amount_payer_refund: model.amount_payer_refund.into(),
      // 创建时间
      create_time: model.create_time,
      create_time_lbl: model.create_time_lbl.into(),
      create_time_save_null: Some(true),
    }
  }
}

impl From<WxRefundNoticeInput> for WxRefundNoticeSearch {
  fn from(input: WxRefundNoticeInput) -> Self {
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
      // 退款状态
      refund_status: input.refund_status.map(|x| vec![x]),
      // 退款成功时间
      success_time: input.success_time.map(|x| [Some(x), Some(x)]),
      // 退款入账账户
      user_received_account: input.user_received_account,
      // 订单金额(分)
      amount_total: input.amount_total.map(|x| [Some(x), Some(x)]),
      // 退款金额(分)
      amount_refund: input.amount_refund.map(|x| [Some(x), Some(x)]),
      // 用户实际支付金额(分)
      amount_payer_total: input.amount_payer_total.map(|x| [Some(x), Some(x)]),
      // 用户退款金额(分)
      amount_payer_refund: input.amount_payer_refund.map(|x| [Some(x), Some(x)]),
      // 创建时间
      create_time: input.create_time.map(|x| [Some(x), Some(x)]),
      ..Default::default()
    }
  }
}

impl_id!(WxRefundNoticeId);

/// 微信退款通知退款状态
#[derive(Enum, Copy, Clone, Default, Eq, PartialEq, Serialize, Deserialize, Debug)]
pub enum WxRefundNoticeRefundStatus {
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

impl fmt::Display for WxRefundNoticeRefundStatus {
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

impl From<WxRefundNoticeRefundStatus> for SmolStr {
  fn from(value: WxRefundNoticeRefundStatus) -> Self {
    match value {
      WxRefundNoticeRefundStatus::NoRefund => "NO_REFUND".into(),
      WxRefundNoticeRefundStatus::Success => "SUCCESS".into(),
      WxRefundNoticeRefundStatus::Closed => "CLOSED".into(),
      WxRefundNoticeRefundStatus::Processing => "PROCESSING".into(),
      WxRefundNoticeRefundStatus::Abnormal => "ABNORMAL".into(),
    }
  }
}

impl From<WxRefundNoticeRefundStatus> for String {
  fn from(value: WxRefundNoticeRefundStatus) -> Self {
    match value {
      WxRefundNoticeRefundStatus::NoRefund => "NO_REFUND".into(),
      WxRefundNoticeRefundStatus::Success => "SUCCESS".into(),
      WxRefundNoticeRefundStatus::Closed => "CLOSED".into(),
      WxRefundNoticeRefundStatus::Processing => "PROCESSING".into(),
      WxRefundNoticeRefundStatus::Abnormal => "ABNORMAL".into(),
    }
  }
}

impl From<WxRefundNoticeRefundStatus> for ArgType {
  fn from(value: WxRefundNoticeRefundStatus) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl FromStr for WxRefundNoticeRefundStatus {
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

impl TryFrom<&str> for WxRefundNoticeRefundStatus {
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
          index: "refund_status".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "{s} 无法转换到 退款状态".to_owned(),
          )),
        }),
      )),
    }
  }
}

impl TryFrom<SmolStr> for WxRefundNoticeRefundStatus {
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
          index: "refund_status".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "{s} 无法转换到 退款状态".to_owned(),
          )),
        }),
      )),
    }
  }
}

impl WxRefundNoticeRefundStatus {
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

impl TryFrom<String> for WxRefundNoticeRefundStatus {
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
          index: "refund_status".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "{s} 无法转换到 退款状态".to_owned(),
          )),
        }),
      )),
    }
  }
}

/// 微信退款通知 检测字段是否允许前端排序
pub fn check_sort_wx_refund_notice(
  sort: Option<&[SortInput]>,
) -> Result<()> {
  
  if sort.is_none() {
    return Ok(());
  }
  let sort = sort.unwrap();
  
  let get_can_sort_in_api_wx_refund_notice = get_can_sort_in_api_wx_refund_notice();
  
  for item in sort {
    let prop = item.prop.as_str();
    if prop.is_empty() {
      continue;
    }
    if !get_can_sort_in_api_wx_refund_notice.contains(&prop) {
      return Err(eyre!("check_sort_wx_refund_notice: {}", serde_json::to_string(item)?));
    }
  }
  
  Ok(())
}

// MARK: get_page_path_wx_refund_notice
pub fn get_page_path_wx_refund_notice() -> &'static str {
  "/wx/wx_refund_notice"
}

// MARK: get_table_name_wx_refund_notice
pub fn get_table_name_wx_refund_notice() -> &'static str {
  "wx_wx_refund_notice"
}
