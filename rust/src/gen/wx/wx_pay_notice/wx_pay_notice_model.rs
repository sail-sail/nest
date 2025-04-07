
use std::fmt;
use std::ops::Deref;
#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use std::str::FromStr;
use std::sync::OnceLock;

use serde::{Serialize, Deserialize};

use color_eyre::eyre::{Result,eyre};

use sqlx::encode::{Encode, IsNull};
use sqlx::error::BoxDynError;
use sqlx::MySql;
use sqlx::mysql::MySqlValueRef;
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

use crate::common::context::ArgType;
use crate::common::gql::model::SortInput;

use crate::r#gen::base::tenant::tenant_model::TenantId;
use crate::r#gen::base::usr::usr_model::UsrId;

static CAN_SORT_IN_API_WX_PAY_NOTICE: OnceLock<[&'static str; 3]> = OnceLock::new();

/// 微信支付通知 前端允许排序的字段
fn get_can_sort_in_api_wx_pay_notice() -> &'static [&'static str; 3] {
  CAN_SORT_IN_API_WX_PAY_NOTICE.get_or_init(|| [
    "success_time",
    "create_time",
    "update_time",
  ])
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "WxPayNoticeModel")]
#[allow(dead_code)]
pub struct WxPayNoticeModel {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: TenantId,
  /// ID
  pub id: WxPayNoticeId,
  /// 开发者ID
  #[graphql(name = "appid")]
  pub appid: String,
  /// 商户号
  #[graphql(name = "mchid")]
  pub mchid: String,
  /// 用户标识
  #[graphql(name = "openid")]
  pub openid: String,
  /// 商户订单号
  #[graphql(name = "out_trade_no")]
  pub out_trade_no: String,
  /// 微信支付订单号
  #[graphql(name = "transaction_id")]
  pub transaction_id: String,
  /// 交易类型
  #[graphql(name = "trade_type")]
  pub trade_type: WxPayNoticeTradeType,
  /// 交易类型
  #[graphql(name = "trade_type_lbl")]
  pub trade_type_lbl: String,
  /// 交易状态
  #[graphql(name = "trade_state")]
  pub trade_state: WxPayNoticeTradeState,
  /// 交易状态
  #[graphql(name = "trade_state_lbl")]
  pub trade_state_lbl: String,
  /// 交易状态描述
  #[graphql(name = "trade_state_desc")]
  pub trade_state_desc: String,
  /// 付款银行
  #[graphql(name = "bank_type")]
  pub bank_type: String,
  /// 附加数据
  #[graphql(name = "attach")]
  pub attach: String,
  /// 支付完成时间
  #[graphql(name = "success_time")]
  pub success_time: Option<chrono::NaiveDateTime>,
  /// 支付完成时间
  #[graphql(name = "success_time_lbl")]
  pub success_time_lbl: String,
  /// 总金额(分)
  #[graphql(name = "total")]
  pub total: u32,
  /// 用户支付金额(分)
  #[graphql(name = "payer_total")]
  pub payer_total: u32,
  /// 货币类型
  #[graphql(name = "currency")]
  pub currency: WxPayNoticeCurrency,
  /// 货币类型
  #[graphql(name = "currency_lbl")]
  pub currency_lbl: String,
  /// 用户支付币种
  #[graphql(name = "payer_currency")]
  pub payer_currency: WxPayNoticePayerCurrency,
  /// 用户支付币种
  #[graphql(name = "payer_currency_lbl")]
  pub payer_currency_lbl: String,
  /// 商户端设备号
  #[graphql(name = "device_id")]
  pub device_id: String,
  /// 备注
  #[graphql(name = "rem")]
  pub rem: String,
  /// 是否已删除
  pub is_deleted: u8,
  /// 创建人
  pub create_usr_id: UsrId,
  /// 创建人
  pub create_usr_id_lbl: String,
  /// 创建时间
  pub create_time: Option<chrono::NaiveDateTime>,
  /// 创建时间
  pub create_time_lbl: String,
  /// 更新人
  pub update_usr_id: UsrId,
  /// 更新人
  pub update_usr_id_lbl: String,
  /// 更新时间
  pub update_time: Option<chrono::NaiveDateTime>,
  /// 更新时间
  pub update_time_lbl: String,
}

impl FromRow<'_, MySqlRow> for WxPayNoticeModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;
    // ID
    let id: WxPayNoticeId = row.try_get("id")?;
    // 开发者ID
    let appid: String = row.try_get("appid")?;
    // 商户号
    let mchid: String = row.try_get("mchid")?;
    // 用户标识
    let openid: String = row.try_get("openid")?;
    // 商户订单号
    let out_trade_no: String = row.try_get("out_trade_no")?;
    // 微信支付订单号
    let transaction_id: String = row.try_get("transaction_id")?;
    // 交易类型
    let trade_type_lbl: String = row.try_get("trade_type")?;
    let trade_type: WxPayNoticeTradeType = trade_type_lbl.clone().try_into()?;
    // 交易状态
    let trade_state_lbl: String = row.try_get("trade_state")?;
    let trade_state: WxPayNoticeTradeState = trade_state_lbl.clone().try_into()?;
    // 交易状态描述
    let trade_state_desc: String = row.try_get("trade_state_desc")?;
    // 付款银行
    let bank_type: String = row.try_get("bank_type")?;
    // 附加数据
    let attach: String = row.try_get("attach")?;
    // 支付完成时间
    let success_time: Option<chrono::NaiveDateTime> = row.try_get("success_time")?;
    let success_time_lbl: String = match success_time {
      Some(item) => item.format("%Y-%m-%d %H:%M:%S").to_string(),
      None => String::new(),
    };
    // 总金额(分)
    let total: u32 = row.try_get("total")?;
    // 用户支付金额(分)
    let payer_total: u32 = row.try_get("payer_total")?;
    // 货币类型
    let currency_lbl: String = row.try_get("currency")?;
    let currency: WxPayNoticeCurrency = currency_lbl.clone().try_into()?;
    // 用户支付币种
    let payer_currency_lbl: String = row.try_get("payer_currency")?;
    let payer_currency: WxPayNoticePayerCurrency = payer_currency_lbl.clone().try_into()?;
    // 商户端设备号
    let device_id: String = row.try_get("device_id")?;
    // 备注
    let rem: String = row.try_get("rem")?;
    // 创建人
    let create_usr_id: UsrId = row.try_get("create_usr_id")?;
    let create_usr_id_lbl: Option<String> = row.try_get("create_usr_id_lbl")?;
    let create_usr_id_lbl = create_usr_id_lbl.unwrap_or_default();
    // 创建时间
    let create_time: Option<chrono::NaiveDateTime> = row.try_get("create_time")?;
    let create_time_lbl: String = match create_time {
      Some(item) => item.format("%Y-%m-%d %H:%M:%S").to_string(),
      None => String::new(),
    };
    // 更新人
    let update_usr_id: UsrId = row.try_get("update_usr_id")?;
    let update_usr_id_lbl: Option<String> = row.try_get("update_usr_id_lbl")?;
    let update_usr_id_lbl = update_usr_id_lbl.unwrap_or_default();
    // 更新时间
    let update_time: Option<chrono::NaiveDateTime> = row.try_get("update_time")?;
    let update_time_lbl: String = match update_time {
      Some(item) => item.format("%Y-%m-%d %H:%M:%S").to_string(),
      None => String::new(),
    };
    // 是否已删除
    let is_deleted: u8 = row.try_get("is_deleted")?;
    
    let model = Self {
      tenant_id,
      is_deleted,
      id,
      appid,
      mchid,
      openid,
      out_trade_no,
      transaction_id,
      trade_type,
      trade_type_lbl,
      trade_state,
      trade_state_lbl,
      trade_state_desc,
      bank_type,
      attach,
      success_time,
      success_time_lbl,
      total,
      payer_total,
      currency,
      currency_lbl,
      payer_currency,
      payer_currency_lbl,
      device_id,
      rem,
      create_usr_id,
      create_usr_id_lbl,
      create_time,
      create_time_lbl,
      update_usr_id,
      update_usr_id_lbl,
      update_time,
      update_time_lbl,
    };
    
    Ok(model)
  }
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Debug)]
#[graphql(rename_fields = "snake_case")]
#[allow(dead_code)]
pub struct WxPayNoticeFieldComment {
  /// ID
  #[graphql(name = "id")]
  pub id: String,
  /// 开发者ID
  #[graphql(name = "appid")]
  pub appid: String,
  /// 商户号
  #[graphql(name = "mchid")]
  pub mchid: String,
  /// 用户标识
  #[graphql(name = "openid")]
  pub openid: String,
  /// 商户订单号
  #[graphql(name = "out_trade_no")]
  pub out_trade_no: String,
  /// 微信支付订单号
  #[graphql(name = "transaction_id")]
  pub transaction_id: String,
  /// 交易类型
  #[graphql(name = "trade_type")]
  pub trade_type: String,
  /// 交易类型
  #[graphql(name = "trade_type_lbl")]
  pub trade_type_lbl: String,
  /// 交易状态
  #[graphql(name = "trade_state")]
  pub trade_state: String,
  /// 交易状态
  #[graphql(name = "trade_state_lbl")]
  pub trade_state_lbl: String,
  /// 交易状态描述
  #[graphql(name = "trade_state_desc")]
  pub trade_state_desc: String,
  /// 付款银行
  #[graphql(name = "bank_type")]
  pub bank_type: String,
  /// 附加数据
  #[graphql(name = "attach")]
  pub attach: String,
  /// 支付完成时间
  #[graphql(name = "success_time")]
  pub success_time: String,
  /// 支付完成时间
  #[graphql(name = "success_time_lbl")]
  pub success_time_lbl: String,
  /// 总金额(分)
  #[graphql(name = "total")]
  pub total: String,
  /// 用户支付金额(分)
  #[graphql(name = "payer_total")]
  pub payer_total: String,
  /// 货币类型
  #[graphql(name = "currency")]
  pub currency: String,
  /// 货币类型
  #[graphql(name = "currency_lbl")]
  pub currency_lbl: String,
  /// 用户支付币种
  #[graphql(name = "payer_currency")]
  pub payer_currency: String,
  /// 用户支付币种
  #[graphql(name = "payer_currency_lbl")]
  pub payer_currency_lbl: String,
  /// 商户端设备号
  #[graphql(name = "device_id")]
  pub device_id: String,
  /// 备注
  #[graphql(name = "rem")]
  pub rem: String,
  /// 创建人
  #[graphql(name = "create_usr_id")]
  pub create_usr_id: String,
  /// 创建人
  #[graphql(name = "create_usr_id_lbl")]
  pub create_usr_id_lbl: String,
  /// 创建时间
  #[graphql(name = "create_time")]
  pub create_time: String,
  /// 创建时间
  #[graphql(name = "create_time_lbl")]
  pub create_time_lbl: String,
  /// 更新人
  #[graphql(name = "update_usr_id")]
  pub update_usr_id: String,
  /// 更新人
  #[graphql(name = "update_usr_id_lbl")]
  pub update_usr_id_lbl: String,
  /// 更新时间
  #[graphql(name = "update_time")]
  pub update_time: String,
  /// 更新时间
  #[graphql(name = "update_time_lbl")]
  pub update_time_lbl: String,
}

#[derive(InputObject, Default)]
#[graphql(rename_fields = "snake_case")]
#[allow(dead_code)]
pub struct WxPayNoticeSearch {
  /// ID
  pub id: Option<WxPayNoticeId>,
  /// ID列表
  pub ids: Option<Vec<WxPayNoticeId>>,
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  pub is_deleted: Option<u8>,
  /// 开发者ID
  #[graphql(skip)]
  pub appid: Option<String>,
  /// 开发者ID
  #[graphql(skip)]
  pub appid_like: Option<String>,
  /// 商户号
  #[graphql(skip)]
  pub mchid: Option<String>,
  /// 商户号
  #[graphql(skip)]
  pub mchid_like: Option<String>,
  /// 用户标识
  #[graphql(name = "openid")]
  pub openid: Option<String>,
  /// 用户标识
  #[graphql(name = "openid_like")]
  pub openid_like: Option<String>,
  /// 商户订单号
  #[graphql(skip)]
  pub out_trade_no: Option<String>,
  /// 商户订单号
  #[graphql(skip)]
  pub out_trade_no_like: Option<String>,
  /// 微信支付订单号
  #[graphql(name = "transaction_id")]
  pub transaction_id: Option<String>,
  /// 微信支付订单号
  #[graphql(name = "transaction_id_like")]
  pub transaction_id_like: Option<String>,
  /// 交易类型
  #[graphql(skip)]
  pub trade_type: Option<Vec<WxPayNoticeTradeType>>,
  /// 交易状态
  #[graphql(skip)]
  pub trade_state: Option<Vec<WxPayNoticeTradeState>>,
  /// 交易状态描述
  #[graphql(skip)]
  pub trade_state_desc: Option<String>,
  /// 交易状态描述
  #[graphql(skip)]
  pub trade_state_desc_like: Option<String>,
  /// 付款银行
  #[graphql(skip)]
  pub bank_type: Option<String>,
  /// 付款银行
  #[graphql(skip)]
  pub bank_type_like: Option<String>,
  /// 附加数据
  #[graphql(skip)]
  pub attach: Option<String>,
  /// 附加数据
  #[graphql(skip)]
  pub attach_like: Option<String>,
  /// 支付完成时间
  #[graphql(name = "success_time")]
  pub success_time: Option<[Option<chrono::NaiveDateTime>; 2]>,
  /// 总金额(分)
  #[graphql(skip)]
  pub total: Option<[Option<u32>; 2]>,
  /// 用户支付金额(分)
  #[graphql(skip)]
  pub payer_total: Option<[Option<u32>; 2]>,
  /// 货币类型
  #[graphql(skip)]
  pub currency: Option<Vec<WxPayNoticeCurrency>>,
  /// 用户支付币种
  #[graphql(skip)]
  pub payer_currency: Option<Vec<WxPayNoticePayerCurrency>>,
  /// 商户端设备号
  #[graphql(skip)]
  pub device_id: Option<String>,
  /// 商户端设备号
  #[graphql(skip)]
  pub device_id_like: Option<String>,
  /// 备注
  #[graphql(skip)]
  pub rem: Option<String>,
  /// 备注
  #[graphql(skip)]
  pub rem_like: Option<String>,
  /// 创建人
  #[graphql(name = "create_usr_id")]
  pub create_usr_id: Option<Vec<UsrId>>,
  /// 创建人
  #[graphql(name = "create_usr_id_save_null")]
  pub create_usr_id_is_null: Option<bool>,
  /// 创建人
  #[graphql(name = "create_usr_id_lbl")]
  pub create_usr_id_lbl: Option<Vec<String>>,
  /// 创建人
  #[graphql(name = "create_usr_id_lbl_like")]
  pub create_usr_id_lbl_like: Option<String>,
  /// 创建时间
  #[graphql(skip)]
  pub create_time: Option<[Option<chrono::NaiveDateTime>; 2]>,
  /// 更新人
  #[graphql(name = "update_usr_id")]
  pub update_usr_id: Option<Vec<UsrId>>,
  /// 更新人
  #[graphql(name = "update_usr_id_save_null")]
  pub update_usr_id_is_null: Option<bool>,
  /// 更新人
  #[graphql(name = "update_usr_id_lbl")]
  pub update_usr_id_lbl: Option<Vec<String>>,
  /// 更新人
  #[graphql(name = "update_usr_id_lbl_like")]
  pub update_usr_id_lbl_like: Option<String>,
  /// 更新时间
  #[graphql(skip)]
  pub update_time: Option<[Option<chrono::NaiveDateTime>; 2]>,
}

impl std::fmt::Debug for WxPayNoticeSearch {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("WxPayNoticeSearch");
    if let Some(ref id) = self.id {
      item = item.field("id", id);
    }
    if let Some(ref ids) = self.ids {
      item = item.field("ids", ids);
    }
    if let Some(ref tenant_id) = self.tenant_id {
      item = item.field("tenant_id", tenant_id);
    }
    if let Some(ref is_deleted) = self.is_deleted {
      if *is_deleted == 1 {
        item = item.field("is_deleted", is_deleted);
      }
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
    // 用户标识
    if let Some(ref openid) = self.openid {
      item = item.field("openid", openid);
    }
    if let Some(ref openid_like) = self.openid_like {
      item = item.field("openid_like", openid_like);
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
    // 交易类型
    if let Some(ref trade_type) = self.trade_type {
      item = item.field("trade_type", trade_type);
    }
    // 交易状态
    if let Some(ref trade_state) = self.trade_state {
      item = item.field("trade_state", trade_state);
    }
    // 交易状态描述
    if let Some(ref trade_state_desc) = self.trade_state_desc {
      item = item.field("trade_state_desc", trade_state_desc);
    }
    if let Some(ref trade_state_desc_like) = self.trade_state_desc_like {
      item = item.field("trade_state_desc_like", trade_state_desc_like);
    }
    // 付款银行
    if let Some(ref bank_type) = self.bank_type {
      item = item.field("bank_type", bank_type);
    }
    if let Some(ref bank_type_like) = self.bank_type_like {
      item = item.field("bank_type_like", bank_type_like);
    }
    // 附加数据
    if let Some(ref attach) = self.attach {
      item = item.field("attach", attach);
    }
    if let Some(ref attach_like) = self.attach_like {
      item = item.field("attach_like", attach_like);
    }
    // 支付完成时间
    if let Some(ref success_time) = self.success_time {
      item = item.field("success_time", success_time);
    }
    // 总金额(分)
    if let Some(ref total) = self.total {
      item = item.field("total", total);
    }
    // 用户支付金额(分)
    if let Some(ref payer_total) = self.payer_total {
      item = item.field("payer_total", payer_total);
    }
    // 货币类型
    if let Some(ref currency) = self.currency {
      item = item.field("currency", currency);
    }
    // 用户支付币种
    if let Some(ref payer_currency) = self.payer_currency {
      item = item.field("payer_currency", payer_currency);
    }
    // 商户端设备号
    if let Some(ref device_id) = self.device_id {
      item = item.field("device_id", device_id);
    }
    if let Some(ref device_id_like) = self.device_id_like {
      item = item.field("device_id_like", device_id_like);
    }
    // 备注
    if let Some(ref rem) = self.rem {
      item = item.field("rem", rem);
    }
    if let Some(ref rem_like) = self.rem_like {
      item = item.field("rem_like", rem_like);
    }
    // 创建人
    if let Some(ref create_usr_id) = self.create_usr_id {
      item = item.field("create_usr_id", create_usr_id);
    }
    if let Some(ref create_usr_id_is_null) = self.create_usr_id_is_null {
      item = item.field("create_usr_id_is_null", create_usr_id_is_null);
    }
    // 创建时间
    if let Some(ref create_time) = self.create_time {
      item = item.field("create_time", create_time);
    }
    // 更新人
    if let Some(ref update_usr_id) = self.update_usr_id {
      item = item.field("update_usr_id", update_usr_id);
    }
    if let Some(ref update_usr_id_is_null) = self.update_usr_id_is_null {
      item = item.field("update_usr_id_is_null", update_usr_id_is_null);
    }
    // 更新时间
    if let Some(ref update_time) = self.update_time {
      item = item.field("update_time", update_time);
    }
    item.finish()
  }
}

#[derive(InputObject, Default, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "WxPayNoticeInput")]
#[allow(dead_code)]
pub struct WxPayNoticeInput {
  /// ID
  pub id: Option<WxPayNoticeId>,
  /// 已删除
  #[graphql(skip)]
  pub is_deleted: Option<u8>,
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  /// 开发者ID
  #[graphql(name = "appid")]
  pub appid: Option<String>,
  /// 商户号
  #[graphql(name = "mchid")]
  pub mchid: Option<String>,
  /// 用户标识
  #[graphql(name = "openid")]
  pub openid: Option<String>,
  /// 商户订单号
  #[graphql(name = "out_trade_no")]
  pub out_trade_no: Option<String>,
  /// 微信支付订单号
  #[graphql(name = "transaction_id")]
  pub transaction_id: Option<String>,
  /// 交易类型
  #[graphql(name = "trade_type")]
  pub trade_type: Option<WxPayNoticeTradeType>,
  /// 交易类型
  #[graphql(name = "trade_type_lbl")]
  pub trade_type_lbl: Option<String>,
  /// 交易状态
  #[graphql(name = "trade_state")]
  pub trade_state: Option<WxPayNoticeTradeState>,
  /// 交易状态
  #[graphql(name = "trade_state_lbl")]
  pub trade_state_lbl: Option<String>,
  /// 交易状态描述
  #[graphql(name = "trade_state_desc")]
  pub trade_state_desc: Option<String>,
  /// 付款银行
  #[graphql(name = "bank_type")]
  pub bank_type: Option<String>,
  /// 附加数据
  #[graphql(name = "attach")]
  pub attach: Option<String>,
  /// 支付完成时间
  #[graphql(name = "success_time")]
  pub success_time: Option<chrono::NaiveDateTime>,
  /// 支付完成时间
  #[graphql(name = "success_time_lbl")]
  pub success_time_lbl: Option<String>,
  /// 支付完成时间
  #[graphql(name = "success_time_save_null")]
  pub success_time_save_null: Option<bool>,
  /// 总金额(分)
  #[graphql(name = "total")]
  pub total: Option<u32>,
  /// 用户支付金额(分)
  #[graphql(name = "payer_total")]
  pub payer_total: Option<u32>,
  /// 货币类型
  #[graphql(name = "currency")]
  pub currency: Option<WxPayNoticeCurrency>,
  /// 货币类型
  #[graphql(name = "currency_lbl")]
  pub currency_lbl: Option<String>,
  /// 用户支付币种
  #[graphql(name = "payer_currency")]
  pub payer_currency: Option<WxPayNoticePayerCurrency>,
  /// 用户支付币种
  #[graphql(name = "payer_currency_lbl")]
  pub payer_currency_lbl: Option<String>,
  /// 商户端设备号
  #[graphql(name = "device_id")]
  pub device_id: Option<String>,
  /// 备注
  #[graphql(name = "rem")]
  pub rem: Option<String>,
  /// 创建人
  #[graphql(skip)]
  pub create_usr_id: Option<UsrId>,
  /// 创建人
  #[graphql(skip)]
  pub create_usr_id_lbl: Option<String>,
  /// 创建时间
  #[graphql(skip)]
  pub create_time: Option<chrono::NaiveDateTime>,
  /// 创建时间
  #[graphql(skip)]
  pub create_time_lbl: Option<String>,
  /// 创建时间
  #[graphql(skip)]
  pub create_time_save_null: Option<bool>,
  /// 更新人
  #[graphql(skip)]
  pub update_usr_id: Option<UsrId>,
  /// 更新人
  #[graphql(skip)]
  pub update_usr_id_lbl: Option<String>,
  /// 更新时间
  #[graphql(skip)]
  pub update_time: Option<chrono::NaiveDateTime>,
  /// 更新时间
  #[graphql(skip)]
  pub update_time_lbl: Option<String>,
  /// 更新时间
  #[graphql(skip)]
  pub update_time_save_null: Option<bool>,
}

impl From<WxPayNoticeModel> for WxPayNoticeInput {
  fn from(model: WxPayNoticeModel) -> Self {
    Self {
      id: model.id.into(),
      is_deleted: model.is_deleted.into(),
      tenant_id: model.tenant_id.into(),
      // 开发者ID
      appid: model.appid.into(),
      // 商户号
      mchid: model.mchid.into(),
      // 用户标识
      openid: model.openid.into(),
      // 商户订单号
      out_trade_no: model.out_trade_no.into(),
      // 微信支付订单号
      transaction_id: model.transaction_id.into(),
      // 交易类型
      trade_type: model.trade_type.into(),
      trade_type_lbl: model.trade_type_lbl.into(),
      // 交易状态
      trade_state: model.trade_state.into(),
      trade_state_lbl: model.trade_state_lbl.into(),
      // 交易状态描述
      trade_state_desc: model.trade_state_desc.into(),
      // 付款银行
      bank_type: model.bank_type.into(),
      // 附加数据
      attach: model.attach.into(),
      // 支付完成时间
      success_time: model.success_time,
      success_time_lbl: model.success_time_lbl.into(),
      success_time_save_null: Some(true),
      // 总金额(分)
      total: model.total.into(),
      // 用户支付金额(分)
      payer_total: model.payer_total.into(),
      // 货币类型
      currency: model.currency.into(),
      currency_lbl: model.currency_lbl.into(),
      // 用户支付币种
      payer_currency: model.payer_currency.into(),
      payer_currency_lbl: model.payer_currency_lbl.into(),
      // 商户端设备号
      device_id: model.device_id.into(),
      // 备注
      rem: model.rem.into(),
      // 创建人
      create_usr_id: model.create_usr_id.into(),
      create_usr_id_lbl: model.create_usr_id_lbl.into(),
      // 创建时间
      create_time: model.create_time,
      create_time_lbl: model.create_time_lbl.into(),
      create_time_save_null: Some(true),
      // 更新人
      update_usr_id: model.update_usr_id.into(),
      update_usr_id_lbl: model.update_usr_id_lbl.into(),
      // 更新时间
      update_time: model.update_time,
      update_time_lbl: model.update_time_lbl.into(),
      update_time_save_null: Some(true),
    }
  }
}

impl From<WxPayNoticeInput> for WxPayNoticeSearch {
  fn from(input: WxPayNoticeInput) -> Self {
    Self {
      id: input.id,
      ids: None,
      // 租户ID
      tenant_id: input.tenant_id,
      is_deleted: None,
      // 开发者ID
      appid: input.appid,
      // 商户号
      mchid: input.mchid,
      // 用户标识
      openid: input.openid,
      // 商户订单号
      out_trade_no: input.out_trade_no,
      // 微信支付订单号
      transaction_id: input.transaction_id,
      // 交易类型
      trade_type: input.trade_type.map(|x| vec![x]),
      // 交易状态
      trade_state: input.trade_state.map(|x| vec![x]),
      // 交易状态描述
      trade_state_desc: input.trade_state_desc,
      // 付款银行
      bank_type: input.bank_type,
      // 附加数据
      attach: input.attach,
      // 支付完成时间
      success_time: input.success_time.map(|x| [Some(x), Some(x)]),
      // 总金额(分)
      total: input.total.map(|x| [Some(x), Some(x)]),
      // 用户支付金额(分)
      payer_total: input.payer_total.map(|x| [Some(x), Some(x)]),
      // 货币类型
      currency: input.currency.map(|x| vec![x]),
      // 用户支付币种
      payer_currency: input.payer_currency.map(|x| vec![x]),
      // 商户端设备号
      device_id: input.device_id,
      // 备注
      rem: input.rem,
      // 创建人
      create_usr_id: input.create_usr_id.map(|x| vec![x]),
      // 创建人
      create_usr_id_lbl: input.create_usr_id_lbl.map(|x| vec![x]),
      // 创建时间
      create_time: input.create_time.map(|x| [Some(x), Some(x)]),
      // 更新人
      update_usr_id: input.update_usr_id.map(|x| vec![x]),
      // 更新人
      update_usr_id_lbl: input.update_usr_id_lbl.map(|x| vec![x]),
      // 更新时间
      update_time: input.update_time.map(|x| [Some(x), Some(x)]),
      ..Default::default()
    }
  }
}

#[derive(Default, Serialize, Deserialize, Clone, Debug, PartialEq, Eq, Hash)]
pub struct WxPayNoticeId(SmolStr);

impl fmt::Display for WxPayNoticeId {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(f, "{}", self.0)
  }
}

#[async_graphql::Scalar(name = "WxPayNoticeId")]
impl async_graphql::ScalarType for WxPayNoticeId {
  fn parse(value: async_graphql::Value) -> async_graphql::InputValueResult<Self> {
    match value {
      async_graphql::Value::String(s) => Ok(Self(s.into())),
      _ => Err(async_graphql::InputValueError::expected_type(value)),
    }
  }
  
  fn to_value(&self) -> async_graphql::Value {
    async_graphql::Value::String(self.0.clone().into())
  }
}

impl From<WxPayNoticeId> for ArgType {
  fn from(value: WxPayNoticeId) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl From<&WxPayNoticeId> for ArgType {
  fn from(value: &WxPayNoticeId) -> Self {
    ArgType::SmolStr(value.clone().into())
  }
}

impl From<WxPayNoticeId> for SmolStr {
  fn from(id: WxPayNoticeId) -> Self {
    id.0
  }
}

impl From<SmolStr> for WxPayNoticeId {
  fn from(s: SmolStr) -> Self {
    Self(s)
  }
}

impl From<&SmolStr> for WxPayNoticeId {
  fn from(s: &SmolStr) -> Self {
    Self(s.clone())
  }
}

impl From<String> for WxPayNoticeId {
  fn from(s: String) -> Self {
    Self(s.into())
  }
}

impl From<&str> for WxPayNoticeId {
  fn from(s: &str) -> Self {
    Self(s.into())
  }
}

impl Deref for WxPayNoticeId {
  type Target = SmolStr;
  
  fn deref(&self) -> &SmolStr {
    &self.0
  }
}

impl Encode<'_, MySql> for WxPayNoticeId {
  fn encode_by_ref(&self, buf: &mut Vec<u8>) -> sqlx::Result<IsNull, BoxDynError> {
    <&str as Encode<MySql>>::encode(self.as_str(), buf)
  }
  
  fn size_hint(&self) -> usize {
    self.len()
  }
}

impl sqlx::Type<MySql> for WxPayNoticeId {
  fn type_info() -> <MySql as sqlx::Database>::TypeInfo {
    <&str as sqlx::Type<MySql>>::type_info()
  }
  
  fn compatible(ty: &<MySql as sqlx::Database>::TypeInfo) -> bool {
    <&str as sqlx::Type<MySql>>::compatible(ty)
  }
}

impl<'r> sqlx::Decode<'r, MySql> for WxPayNoticeId {
  fn decode(
    value: MySqlValueRef<'r>,
  ) -> Result<Self, BoxDynError> {
    <&str as sqlx::Decode<MySql>>::decode(value).map(Self::from)
  }
}

impl PartialEq<str> for WxPayNoticeId {
  fn eq(&self, other: &str) -> bool {
    self.0 == other
  }
}

/// 微信支付通知交易类型
#[derive(Enum, Copy, Clone, Default, Eq, PartialEq, Serialize, Deserialize, Debug)]
pub enum WxPayNoticeTradeType {
  /// 小程序支付
  #[default]
  #[graphql(name="JSAPI")]
  Jsapi,
  /// Native支付
  #[graphql(name="NATIVE")]
  Native,
  /// app支付
  #[graphql(name="APP")]
  App,
  /// 扫码支付
  #[graphql(name="MICROPAY")]
  Micropay,
  /// H5支付
  #[graphql(name="MWEB")]
  Mweb,
  /// 刷脸支付
  #[graphql(name="FACEPAY")]
  Facepay,
}

impl fmt::Display for WxPayNoticeTradeType {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    match self {
      Self::Jsapi => write!(f, "JSAPI"),
      Self::Native => write!(f, "NATIVE"),
      Self::App => write!(f, "APP"),
      Self::Micropay => write!(f, "MICROPAY"),
      Self::Mweb => write!(f, "MWEB"),
      Self::Facepay => write!(f, "FACEPAY"),
    }
  }
}

impl From<WxPayNoticeTradeType> for SmolStr {
  fn from(value: WxPayNoticeTradeType) -> Self {
    match value {
      WxPayNoticeTradeType::Jsapi => "JSAPI".into(),
      WxPayNoticeTradeType::Native => "NATIVE".into(),
      WxPayNoticeTradeType::App => "APP".into(),
      WxPayNoticeTradeType::Micropay => "MICROPAY".into(),
      WxPayNoticeTradeType::Mweb => "MWEB".into(),
      WxPayNoticeTradeType::Facepay => "FACEPAY".into(),
    }
  }
}

impl From<WxPayNoticeTradeType> for String {
  fn from(value: WxPayNoticeTradeType) -> Self {
    match value {
      WxPayNoticeTradeType::Jsapi => "JSAPI".into(),
      WxPayNoticeTradeType::Native => "NATIVE".into(),
      WxPayNoticeTradeType::App => "APP".into(),
      WxPayNoticeTradeType::Micropay => "MICROPAY".into(),
      WxPayNoticeTradeType::Mweb => "MWEB".into(),
      WxPayNoticeTradeType::Facepay => "FACEPAY".into(),
    }
  }
}

impl From<WxPayNoticeTradeType> for ArgType {
  fn from(value: WxPayNoticeTradeType) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl FromStr for WxPayNoticeTradeType {
  type Err = color_eyre::eyre::Error;
  
  fn from_str(s: &str) -> Result<Self, Self::Err> {
    match s {
      "JSAPI" => Ok(Self::Jsapi),
      "NATIVE" => Ok(Self::Native),
      "APP" => Ok(Self::App),
      "MICROPAY" => Ok(Self::Micropay),
      "MWEB" => Ok(Self::Mweb),
      "FACEPAY" => Ok(Self::Facepay),
      _ => Err(eyre!("WxPayNoticeTradeType can't convert from {s}")),
    }
  }
}

impl WxPayNoticeTradeType {
  pub fn as_str(&self) -> &str {
    match self {
      Self::Jsapi => "JSAPI",
      Self::Native => "NATIVE",
      Self::App => "APP",
      Self::Micropay => "MICROPAY",
      Self::Mweb => "MWEB",
      Self::Facepay => "FACEPAY",
    }
  }
}

impl TryFrom<String> for WxPayNoticeTradeType {
  type Error = sqlx::Error;
  
  fn try_from(s: String) -> Result<Self, sqlx::Error> {
    match s.as_str() {
      "JSAPI" => Ok(Self::Jsapi),
      "NATIVE" => Ok(Self::Native),
      "APP" => Ok(Self::App),
      "MICROPAY" => Ok(Self::Micropay),
      "MWEB" => Ok(Self::Mweb),
      "FACEPAY" => Ok(Self::Facepay),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "trade_type".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "WxPayNoticeTradeType can't convert from {s}".to_owned(),
          )),
        }),
      )),
    }
  }
}

/// 微信支付通知交易状态
#[derive(Enum, Copy, Clone, Default, Eq, PartialEq, Serialize, Deserialize, Debug)]
pub enum WxPayNoticeTradeState {
  /// 支付成功
  #[graphql(name="SUCCESS")]
  Success,
  /// 转入退款
  #[graphql(name="REFUND")]
  Refund,
  /// 未支付
  #[default]
  #[graphql(name="NOTPAY")]
  Notpay,
  /// 已关闭
  #[graphql(name="CLOSED")]
  Closed,
  /// 已撤销
  #[graphql(name="REVOKED")]
  Revoked,
  /// 用户支付中
  #[graphql(name="USERPAYING")]
  Userpaying,
  /// 支付失败
  #[graphql(name="PAYERROR")]
  Payerror,
}

impl fmt::Display for WxPayNoticeTradeState {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    match self {
      Self::Success => write!(f, "SUCCESS"),
      Self::Refund => write!(f, "REFUND"),
      Self::Notpay => write!(f, "NOTPAY"),
      Self::Closed => write!(f, "CLOSED"),
      Self::Revoked => write!(f, "REVOKED"),
      Self::Userpaying => write!(f, "USERPAYING"),
      Self::Payerror => write!(f, "PAYERROR"),
    }
  }
}

impl From<WxPayNoticeTradeState> for SmolStr {
  fn from(value: WxPayNoticeTradeState) -> Self {
    match value {
      WxPayNoticeTradeState::Success => "SUCCESS".into(),
      WxPayNoticeTradeState::Refund => "REFUND".into(),
      WxPayNoticeTradeState::Notpay => "NOTPAY".into(),
      WxPayNoticeTradeState::Closed => "CLOSED".into(),
      WxPayNoticeTradeState::Revoked => "REVOKED".into(),
      WxPayNoticeTradeState::Userpaying => "USERPAYING".into(),
      WxPayNoticeTradeState::Payerror => "PAYERROR".into(),
    }
  }
}

impl From<WxPayNoticeTradeState> for String {
  fn from(value: WxPayNoticeTradeState) -> Self {
    match value {
      WxPayNoticeTradeState::Success => "SUCCESS".into(),
      WxPayNoticeTradeState::Refund => "REFUND".into(),
      WxPayNoticeTradeState::Notpay => "NOTPAY".into(),
      WxPayNoticeTradeState::Closed => "CLOSED".into(),
      WxPayNoticeTradeState::Revoked => "REVOKED".into(),
      WxPayNoticeTradeState::Userpaying => "USERPAYING".into(),
      WxPayNoticeTradeState::Payerror => "PAYERROR".into(),
    }
  }
}

impl From<WxPayNoticeTradeState> for ArgType {
  fn from(value: WxPayNoticeTradeState) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl FromStr for WxPayNoticeTradeState {
  type Err = color_eyre::eyre::Error;
  
  fn from_str(s: &str) -> Result<Self, Self::Err> {
    match s {
      "SUCCESS" => Ok(Self::Success),
      "REFUND" => Ok(Self::Refund),
      "NOTPAY" => Ok(Self::Notpay),
      "CLOSED" => Ok(Self::Closed),
      "REVOKED" => Ok(Self::Revoked),
      "USERPAYING" => Ok(Self::Userpaying),
      "PAYERROR" => Ok(Self::Payerror),
      _ => Err(eyre!("WxPayNoticeTradeState can't convert from {s}")),
    }
  }
}

impl WxPayNoticeTradeState {
  pub fn as_str(&self) -> &str {
    match self {
      Self::Success => "SUCCESS",
      Self::Refund => "REFUND",
      Self::Notpay => "NOTPAY",
      Self::Closed => "CLOSED",
      Self::Revoked => "REVOKED",
      Self::Userpaying => "USERPAYING",
      Self::Payerror => "PAYERROR",
    }
  }
}

impl TryFrom<String> for WxPayNoticeTradeState {
  type Error = sqlx::Error;
  
  fn try_from(s: String) -> Result<Self, sqlx::Error> {
    match s.as_str() {
      "SUCCESS" => Ok(Self::Success),
      "REFUND" => Ok(Self::Refund),
      "NOTPAY" => Ok(Self::Notpay),
      "CLOSED" => Ok(Self::Closed),
      "REVOKED" => Ok(Self::Revoked),
      "USERPAYING" => Ok(Self::Userpaying),
      "PAYERROR" => Ok(Self::Payerror),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "trade_state".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "WxPayNoticeTradeState can't convert from {s}".to_owned(),
          )),
        }),
      )),
    }
  }
}

/// 微信支付通知货币类型
#[derive(Enum, Copy, Clone, Default, Eq, PartialEq, Serialize, Deserialize, Debug)]
pub enum WxPayNoticeCurrency {
  /// 人民币
  #[default]
  #[graphql(name="CNY")]
  Cny,
}

impl fmt::Display for WxPayNoticeCurrency {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    match self {
      Self::Cny => write!(f, "CNY"),
    }
  }
}

impl From<WxPayNoticeCurrency> for SmolStr {
  fn from(value: WxPayNoticeCurrency) -> Self {
    match value {
      WxPayNoticeCurrency::Cny => "CNY".into(),
    }
  }
}

impl From<WxPayNoticeCurrency> for String {
  fn from(value: WxPayNoticeCurrency) -> Self {
    match value {
      WxPayNoticeCurrency::Cny => "CNY".into(),
    }
  }
}

impl From<WxPayNoticeCurrency> for ArgType {
  fn from(value: WxPayNoticeCurrency) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl FromStr for WxPayNoticeCurrency {
  type Err = color_eyre::eyre::Error;
  
  fn from_str(s: &str) -> Result<Self, Self::Err> {
    match s {
      "CNY" => Ok(Self::Cny),
      _ => Err(eyre!("WxPayNoticeCurrency can't convert from {s}")),
    }
  }
}

impl WxPayNoticeCurrency {
  pub fn as_str(&self) -> &str {
    match self {
      Self::Cny => "CNY",
    }
  }
}

impl TryFrom<String> for WxPayNoticeCurrency {
  type Error = sqlx::Error;
  
  fn try_from(s: String) -> Result<Self, sqlx::Error> {
    match s.as_str() {
      "CNY" => Ok(Self::Cny),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "currency".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "WxPayNoticeCurrency can't convert from {s}".to_owned(),
          )),
        }),
      )),
    }
  }
}

/// 微信支付通知用户支付币种
#[derive(Enum, Copy, Clone, Default, Eq, PartialEq, Serialize, Deserialize, Debug)]
pub enum WxPayNoticePayerCurrency {
  /// 人民币
  #[default]
  #[graphql(name="CNY")]
  Cny,
}

impl fmt::Display for WxPayNoticePayerCurrency {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    match self {
      Self::Cny => write!(f, "CNY"),
    }
  }
}

impl From<WxPayNoticePayerCurrency> for SmolStr {
  fn from(value: WxPayNoticePayerCurrency) -> Self {
    match value {
      WxPayNoticePayerCurrency::Cny => "CNY".into(),
    }
  }
}

impl From<WxPayNoticePayerCurrency> for String {
  fn from(value: WxPayNoticePayerCurrency) -> Self {
    match value {
      WxPayNoticePayerCurrency::Cny => "CNY".into(),
    }
  }
}

impl From<WxPayNoticePayerCurrency> for ArgType {
  fn from(value: WxPayNoticePayerCurrency) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl FromStr for WxPayNoticePayerCurrency {
  type Err = color_eyre::eyre::Error;
  
  fn from_str(s: &str) -> Result<Self, Self::Err> {
    match s {
      "CNY" => Ok(Self::Cny),
      _ => Err(eyre!("WxPayNoticePayerCurrency can't convert from {s}")),
    }
  }
}

impl WxPayNoticePayerCurrency {
  pub fn as_str(&self) -> &str {
    match self {
      Self::Cny => "CNY",
    }
  }
}

impl TryFrom<String> for WxPayNoticePayerCurrency {
  type Error = sqlx::Error;
  
  fn try_from(s: String) -> Result<Self, sqlx::Error> {
    match s.as_str() {
      "CNY" => Ok(Self::Cny),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "payer_currency".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "WxPayNoticePayerCurrency can't convert from {s}".to_owned(),
          )),
        }),
      )),
    }
  }
}

/// 微信支付通知 检测字段是否允许前端排序
pub fn check_sort_wx_pay_notice(
  sort: Option<&[SortInput]>,
) -> Result<()> {
  
  if sort.is_none() {
    return Ok(());
  }
  let sort = sort.unwrap();
  
  let get_can_sort_in_api_wx_pay_notice = get_can_sort_in_api_wx_pay_notice();
  
  for item in sort {
    let prop = item.prop.as_str();
    if prop.is_empty() {
      continue;
    }
    if !get_can_sort_in_api_wx_pay_notice.contains(&prop) {
      return Err(eyre!("check_sort_wx_pay_notice: {}", serde_json::to_string(item)?));
    }
  }
  
  Ok(())
}

/// 获取路由地址
#[allow(dead_code)]
pub fn get_route_path_wx_pay_notice() -> String {
  "/wx/wx_pay_notice".to_owned()
}
