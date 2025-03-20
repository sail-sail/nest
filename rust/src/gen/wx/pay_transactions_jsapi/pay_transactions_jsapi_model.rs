
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

static CAN_SORT_IN_API_PAY_TRANSACTIONS_JSAPI: OnceLock<[&'static str; 2]> = OnceLock::new();

/// 微信JSAPI下单 前端允许排序的字段
fn get_can_sort_in_api_pay_transactions_jsapi() -> &'static [&'static str; 2] {
  CAN_SORT_IN_API_PAY_TRANSACTIONS_JSAPI.get_or_init(|| [
    "create_time",
    "update_time",
  ])
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "PayTransactionsJsapiModel")]
#[allow(dead_code)]
pub struct PayTransactionsJsapiModel {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: TenantId,
  /// ID
  pub id: PayTransactionsJsapiId,
  /// 开发者ID
  #[graphql(name = "appid")]
  pub appid: String,
  /// 商户号
  #[graphql(name = "mchid")]
  pub mchid: String,
  /// 商品描述
  #[graphql(name = "description")]
  pub description: String,
  /// 商户订单号
  #[graphql(name = "out_trade_no")]
  pub out_trade_no: String,
  /// 微信支付订单号
  #[graphql(name = "transaction_id")]
  pub transaction_id: String,
  /// 交易状态
  #[graphql(name = "trade_state")]
  pub trade_state: PayTransactionsJsapiTradeState,
  /// 交易状态
  #[graphql(name = "trade_state_lbl")]
  pub trade_state_lbl: String,
  /// 交易状态描述
  #[graphql(name = "trade_state_desc")]
  pub trade_state_desc: String,
  /// 支付完成时间
  #[graphql(name = "success_time")]
  pub success_time: Option<chrono::NaiveDateTime>,
  /// 支付完成时间
  #[graphql(name = "success_time_lbl")]
  pub success_time_lbl: String,
  /// 交易限制时间
  #[graphql(name = "time_expire")]
  pub time_expire: String,
  /// 附加数据
  #[graphql(name = "attach")]
  pub attach: String,
  /// 附加数据2
  #[graphql(name = "attach2")]
  pub attach2: String,
  /// 通知地址
  #[graphql(name = "notify_url")]
  pub notify_url: String,
  /// 开发票
  #[graphql(name = "receipt")]
  pub receipt: String,
  /// 分账
  #[graphql(name = "profit_sharing")]
  pub profit_sharing: String,
  /// 订单金额(分)
  #[graphql(name = "total_fee")]
  pub total_fee: u32,
  /// 货币类型
  #[graphql(name = "currency")]
  pub currency: PayTransactionsJsapiCurrency,
  /// 货币类型
  #[graphql(name = "currency_lbl")]
  pub currency_lbl: String,
  /// 用户标识
  #[graphql(name = "openid")]
  pub openid: String,
  /// 预支付交易会话标识
  #[graphql(name = "prepay_id")]
  pub prepay_id: String,
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

impl FromRow<'_, MySqlRow> for PayTransactionsJsapiModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;
    // ID
    let id: PayTransactionsJsapiId = row.try_get("id")?;
    // 开发者ID
    let appid: String = row.try_get("appid")?;
    // 商户号
    let mchid: String = row.try_get("mchid")?;
    // 商品描述
    let description: String = row.try_get("description")?;
    // 商户订单号
    let out_trade_no: String = row.try_get("out_trade_no")?;
    // 微信支付订单号
    let transaction_id: String = row.try_get("transaction_id")?;
    // 交易状态
    let trade_state_lbl: String = row.try_get("trade_state")?;
    let trade_state: PayTransactionsJsapiTradeState = trade_state_lbl.clone().try_into()?;
    // 交易状态描述
    let trade_state_desc: String = row.try_get("trade_state_desc")?;
    // 支付完成时间
    let success_time: Option<chrono::NaiveDateTime> = row.try_get("success_time")?;
    let success_time_lbl: String = match success_time {
      Some(item) => item.format("%Y-%m-%d %H:%M:%S").to_string(),
      None => String::new(),
    };
    // 交易限制时间
    let time_expire: String = row.try_get("time_expire")?;
    // 附加数据
    let attach: String = row.try_get("attach")?;
    // 附加数据2
    let attach2: String = row.try_get("attach2")?;
    // 通知地址
    let notify_url: String = row.try_get("notify_url")?;
    // 开发票
    let receipt: String = row.try_get("receipt")?;
    // 分账
    let profit_sharing: String = row.try_get("profit_sharing")?;
    // 订单金额(分)
    let total_fee: u32 = row.try_get("total_fee")?;
    // 货币类型
    let currency_lbl: String = row.try_get("currency")?;
    let currency: PayTransactionsJsapiCurrency = currency_lbl.clone().try_into()?;
    // 用户标识
    let openid: String = row.try_get("openid")?;
    // 预支付交易会话标识
    let prepay_id: String = row.try_get("prepay_id")?;
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
      description,
      out_trade_no,
      transaction_id,
      trade_state,
      trade_state_lbl,
      trade_state_desc,
      success_time,
      success_time_lbl,
      time_expire,
      attach,
      attach2,
      notify_url,
      receipt,
      profit_sharing,
      total_fee,
      currency,
      currency_lbl,
      openid,
      prepay_id,
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
pub struct PayTransactionsJsapiFieldComment {
  /// ID
  #[graphql(name = "id")]
  pub id: String,
  /// 开发者ID
  #[graphql(name = "appid")]
  pub appid: String,
  /// 商户号
  #[graphql(name = "mchid")]
  pub mchid: String,
  /// 商品描述
  #[graphql(name = "description")]
  pub description: String,
  /// 商户订单号
  #[graphql(name = "out_trade_no")]
  pub out_trade_no: String,
  /// 微信支付订单号
  #[graphql(name = "transaction_id")]
  pub transaction_id: String,
  /// 交易状态
  #[graphql(name = "trade_state")]
  pub trade_state: String,
  /// 交易状态
  #[graphql(name = "trade_state_lbl")]
  pub trade_state_lbl: String,
  /// 交易状态描述
  #[graphql(name = "trade_state_desc")]
  pub trade_state_desc: String,
  /// 支付完成时间
  #[graphql(name = "success_time")]
  pub success_time: String,
  /// 支付完成时间
  #[graphql(name = "success_time_lbl")]
  pub success_time_lbl: String,
  /// 交易限制时间
  #[graphql(name = "time_expire")]
  pub time_expire: String,
  /// 附加数据
  #[graphql(name = "attach")]
  pub attach: String,
  /// 附加数据2
  #[graphql(name = "attach2")]
  pub attach2: String,
  /// 通知地址
  #[graphql(name = "notify_url")]
  pub notify_url: String,
  /// 开发票
  #[graphql(name = "receipt")]
  pub receipt: String,
  /// 分账
  #[graphql(name = "profit_sharing")]
  pub profit_sharing: String,
  /// 订单金额(分)
  #[graphql(name = "total_fee")]
  pub total_fee: String,
  /// 货币类型
  #[graphql(name = "currency")]
  pub currency: String,
  /// 货币类型
  #[graphql(name = "currency_lbl")]
  pub currency_lbl: String,
  /// 用户标识
  #[graphql(name = "openid")]
  pub openid: String,
  /// 预支付交易会话标识
  #[graphql(name = "prepay_id")]
  pub prepay_id: String,
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
pub struct PayTransactionsJsapiSearch {
  /// ID
  pub id: Option<PayTransactionsJsapiId>,
  /// ID列表
  pub ids: Option<Vec<PayTransactionsJsapiId>>,
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
  /// 商品描述
  #[graphql(skip)]
  pub description: Option<String>,
  /// 商品描述
  #[graphql(skip)]
  pub description_like: Option<String>,
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
  /// 交易状态
  #[graphql(skip)]
  pub trade_state: Option<Vec<PayTransactionsJsapiTradeState>>,
  /// 交易状态描述
  #[graphql(skip)]
  pub trade_state_desc: Option<String>,
  /// 交易状态描述
  #[graphql(skip)]
  pub trade_state_desc_like: Option<String>,
  /// 支付完成时间
  #[graphql(skip)]
  pub success_time: Option<[Option<chrono::NaiveDateTime>; 2]>,
  /// 交易限制时间
  #[graphql(skip)]
  pub time_expire: Option<String>,
  /// 交易限制时间
  #[graphql(skip)]
  pub time_expire_like: Option<String>,
  /// 附加数据
  #[graphql(skip)]
  pub attach: Option<String>,
  /// 附加数据
  #[graphql(skip)]
  pub attach_like: Option<String>,
  /// 附加数据2
  #[graphql(skip)]
  pub attach2: Option<String>,
  /// 附加数据2
  #[graphql(skip)]
  pub attach2_like: Option<String>,
  /// 通知地址
  #[graphql(skip)]
  pub notify_url: Option<String>,
  /// 通知地址
  #[graphql(skip)]
  pub notify_url_like: Option<String>,
  /// 开发票
  #[graphql(skip)]
  pub receipt: Option<String>,
  /// 开发票
  #[graphql(skip)]
  pub receipt_like: Option<String>,
  /// 分账
  #[graphql(skip)]
  pub profit_sharing: Option<String>,
  /// 分账
  #[graphql(skip)]
  pub profit_sharing_like: Option<String>,
  /// 订单金额(分)
  #[graphql(skip)]
  pub total_fee: Option<[Option<u32>; 2]>,
  /// 货币类型
  #[graphql(skip)]
  pub currency: Option<Vec<PayTransactionsJsapiCurrency>>,
  /// 用户标识
  #[graphql(skip)]
  pub openid: Option<String>,
  /// 用户标识
  #[graphql(skip)]
  pub openid_like: Option<String>,
  /// 预支付交易会话标识
  #[graphql(skip)]
  pub prepay_id: Option<String>,
  /// 预支付交易会话标识
  #[graphql(skip)]
  pub prepay_id_like: Option<String>,
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

impl std::fmt::Debug for PayTransactionsJsapiSearch {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("PayTransactionsJsapiSearch");
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
    // 商品描述
    if let Some(ref description) = self.description {
      item = item.field("description", description);
    }
    if let Some(ref description_like) = self.description_like {
      item = item.field("description_like", description_like);
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
    // 支付完成时间
    if let Some(ref success_time) = self.success_time {
      item = item.field("success_time", success_time);
    }
    // 交易限制时间
    if let Some(ref time_expire) = self.time_expire {
      item = item.field("time_expire", time_expire);
    }
    if let Some(ref time_expire_like) = self.time_expire_like {
      item = item.field("time_expire_like", time_expire_like);
    }
    // 附加数据
    if let Some(ref attach) = self.attach {
      item = item.field("attach", attach);
    }
    if let Some(ref attach_like) = self.attach_like {
      item = item.field("attach_like", attach_like);
    }
    // 附加数据2
    if let Some(ref attach2) = self.attach2 {
      item = item.field("attach2", attach2);
    }
    if let Some(ref attach2_like) = self.attach2_like {
      item = item.field("attach2_like", attach2_like);
    }
    // 通知地址
    if let Some(ref notify_url) = self.notify_url {
      item = item.field("notify_url", notify_url);
    }
    if let Some(ref notify_url_like) = self.notify_url_like {
      item = item.field("notify_url_like", notify_url_like);
    }
    // 开发票
    if let Some(ref receipt) = self.receipt {
      item = item.field("receipt", receipt);
    }
    if let Some(ref receipt_like) = self.receipt_like {
      item = item.field("receipt_like", receipt_like);
    }
    // 分账
    if let Some(ref profit_sharing) = self.profit_sharing {
      item = item.field("profit_sharing", profit_sharing);
    }
    if let Some(ref profit_sharing_like) = self.profit_sharing_like {
      item = item.field("profit_sharing_like", profit_sharing_like);
    }
    // 订单金额(分)
    if let Some(ref total_fee) = self.total_fee {
      item = item.field("total_fee", total_fee);
    }
    // 货币类型
    if let Some(ref currency) = self.currency {
      item = item.field("currency", currency);
    }
    // 用户标识
    if let Some(ref openid) = self.openid {
      item = item.field("openid", openid);
    }
    if let Some(ref openid_like) = self.openid_like {
      item = item.field("openid_like", openid_like);
    }
    // 预支付交易会话标识
    if let Some(ref prepay_id) = self.prepay_id {
      item = item.field("prepay_id", prepay_id);
    }
    if let Some(ref prepay_id_like) = self.prepay_id_like {
      item = item.field("prepay_id_like", prepay_id_like);
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
#[graphql(rename_fields = "snake_case", name = "PayTransactionsJsapiInput")]
#[allow(dead_code)]
pub struct PayTransactionsJsapiInput {
  /// ID
  pub id: Option<PayTransactionsJsapiId>,
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
  /// 商品描述
  #[graphql(name = "description")]
  pub description: Option<String>,
  /// 商户订单号
  #[graphql(name = "out_trade_no")]
  pub out_trade_no: Option<String>,
  /// 微信支付订单号
  #[graphql(name = "transaction_id")]
  pub transaction_id: Option<String>,
  /// 交易状态
  #[graphql(name = "trade_state")]
  pub trade_state: Option<PayTransactionsJsapiTradeState>,
  /// 交易状态
  #[graphql(name = "trade_state_lbl")]
  pub trade_state_lbl: Option<String>,
  /// 交易状态描述
  #[graphql(name = "trade_state_desc")]
  pub trade_state_desc: Option<String>,
  /// 支付完成时间
  #[graphql(name = "success_time")]
  pub success_time: Option<chrono::NaiveDateTime>,
  /// 支付完成时间
  #[graphql(name = "success_time_lbl")]
  pub success_time_lbl: Option<String>,
  /// 支付完成时间
  #[graphql(name = "success_time_save_null")]
  pub success_time_save_null: Option<bool>,
  /// 交易限制时间
  #[graphql(name = "time_expire")]
  pub time_expire: Option<String>,
  /// 附加数据
  #[graphql(name = "attach")]
  pub attach: Option<String>,
  /// 附加数据2
  #[graphql(name = "attach2")]
  pub attach2: Option<String>,
  /// 通知地址
  #[graphql(name = "notify_url")]
  pub notify_url: Option<String>,
  /// 开发票
  #[graphql(name = "receipt")]
  pub receipt: Option<String>,
  /// 分账
  #[graphql(name = "profit_sharing")]
  pub profit_sharing: Option<String>,
  /// 订单金额(分)
  #[graphql(name = "total_fee")]
  pub total_fee: Option<u32>,
  /// 货币类型
  #[graphql(name = "currency")]
  pub currency: Option<PayTransactionsJsapiCurrency>,
  /// 货币类型
  #[graphql(name = "currency_lbl")]
  pub currency_lbl: Option<String>,
  /// 用户标识
  #[graphql(name = "openid")]
  pub openid: Option<String>,
  /// 预支付交易会话标识
  #[graphql(name = "prepay_id")]
  pub prepay_id: Option<String>,
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

impl From<PayTransactionsJsapiModel> for PayTransactionsJsapiInput {
  fn from(model: PayTransactionsJsapiModel) -> Self {
    Self {
      id: model.id.into(),
      is_deleted: model.is_deleted.into(),
      tenant_id: model.tenant_id.into(),
      // 开发者ID
      appid: model.appid.into(),
      // 商户号
      mchid: model.mchid.into(),
      // 商品描述
      description: model.description.into(),
      // 商户订单号
      out_trade_no: model.out_trade_no.into(),
      // 微信支付订单号
      transaction_id: model.transaction_id.into(),
      // 交易状态
      trade_state: model.trade_state.into(),
      trade_state_lbl: model.trade_state_lbl.into(),
      // 交易状态描述
      trade_state_desc: model.trade_state_desc.into(),
      // 支付完成时间
      success_time: model.success_time,
      success_time_lbl: model.success_time_lbl.into(),
      success_time_save_null: Some(true),
      // 交易限制时间
      time_expire: model.time_expire.into(),
      // 附加数据
      attach: model.attach.into(),
      // 附加数据2
      attach2: model.attach2.into(),
      // 通知地址
      notify_url: model.notify_url.into(),
      // 开发票
      receipt: model.receipt.into(),
      // 分账
      profit_sharing: model.profit_sharing.into(),
      // 订单金额(分)
      total_fee: model.total_fee.into(),
      // 货币类型
      currency: model.currency.into(),
      currency_lbl: model.currency_lbl.into(),
      // 用户标识
      openid: model.openid.into(),
      // 预支付交易会话标识
      prepay_id: model.prepay_id.into(),
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

impl From<PayTransactionsJsapiInput> for PayTransactionsJsapiSearch {
  fn from(input: PayTransactionsJsapiInput) -> Self {
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
      // 商品描述
      description: input.description,
      // 商户订单号
      out_trade_no: input.out_trade_no,
      // 微信支付订单号
      transaction_id: input.transaction_id,
      // 交易状态
      trade_state: input.trade_state.map(|x| vec![x]),
      // 交易状态描述
      trade_state_desc: input.trade_state_desc,
      // 支付完成时间
      success_time: input.success_time.map(|x| [Some(x), Some(x)]),
      // 交易限制时间
      time_expire: input.time_expire,
      // 附加数据
      attach: input.attach,
      // 附加数据2
      attach2: input.attach2,
      // 通知地址
      notify_url: input.notify_url,
      // 开发票
      receipt: input.receipt,
      // 分账
      profit_sharing: input.profit_sharing,
      // 订单金额(分)
      total_fee: input.total_fee.map(|x| [Some(x), Some(x)]),
      // 货币类型
      currency: input.currency.map(|x| vec![x]),
      // 用户标识
      openid: input.openid,
      // 预支付交易会话标识
      prepay_id: input.prepay_id,
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
pub struct PayTransactionsJsapiId(SmolStr);

impl fmt::Display for PayTransactionsJsapiId {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(f, "{}", self.0)
  }
}

#[async_graphql::Scalar(name = "PayTransactionsJsapiId")]
impl async_graphql::ScalarType for PayTransactionsJsapiId {
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

impl From<PayTransactionsJsapiId> for ArgType {
  fn from(value: PayTransactionsJsapiId) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl From<&PayTransactionsJsapiId> for ArgType {
  fn from(value: &PayTransactionsJsapiId) -> Self {
    ArgType::SmolStr(value.clone().into())
  }
}

impl From<PayTransactionsJsapiId> for SmolStr {
  fn from(id: PayTransactionsJsapiId) -> Self {
    id.0
  }
}

impl From<SmolStr> for PayTransactionsJsapiId {
  fn from(s: SmolStr) -> Self {
    Self(s)
  }
}

impl From<&SmolStr> for PayTransactionsJsapiId {
  fn from(s: &SmolStr) -> Self {
    Self(s.clone())
  }
}

impl From<String> for PayTransactionsJsapiId {
  fn from(s: String) -> Self {
    Self(s.into())
  }
}

impl From<&str> for PayTransactionsJsapiId {
  fn from(s: &str) -> Self {
    Self(s.into())
  }
}

impl Deref for PayTransactionsJsapiId {
  type Target = SmolStr;
  
  fn deref(&self) -> &SmolStr {
    &self.0
  }
}

impl Encode<'_, MySql> for PayTransactionsJsapiId {
  fn encode_by_ref(&self, buf: &mut Vec<u8>) -> sqlx::Result<IsNull, BoxDynError> {
    <&str as Encode<MySql>>::encode(self.as_str(), buf)
  }
  
  fn size_hint(&self) -> usize {
    self.len()
  }
}

impl sqlx::Type<MySql> for PayTransactionsJsapiId {
  fn type_info() -> <MySql as sqlx::Database>::TypeInfo {
    <&str as sqlx::Type<MySql>>::type_info()
  }
  
  fn compatible(ty: &<MySql as sqlx::Database>::TypeInfo) -> bool {
    <&str as sqlx::Type<MySql>>::compatible(ty)
  }
}

impl<'r> sqlx::Decode<'r, MySql> for PayTransactionsJsapiId {
  fn decode(
    value: MySqlValueRef<'r>,
  ) -> Result<Self, BoxDynError> {
    <&str as sqlx::Decode<MySql>>::decode(value).map(Self::from)
  }
}

impl PartialEq<str> for PayTransactionsJsapiId {
  fn eq(&self, other: &str) -> bool {
    self.0 == other
  }
}

/// 微信JSAPI下单交易状态
#[derive(Enum, Copy, Clone, Default, Eq, PartialEq, Serialize, Deserialize, Debug)]
pub enum PayTransactionsJsapiTradeState {
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

impl fmt::Display for PayTransactionsJsapiTradeState {
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

impl From<PayTransactionsJsapiTradeState> for SmolStr {
  fn from(value: PayTransactionsJsapiTradeState) -> Self {
    match value {
      PayTransactionsJsapiTradeState::Success => "SUCCESS".into(),
      PayTransactionsJsapiTradeState::Refund => "REFUND".into(),
      PayTransactionsJsapiTradeState::Notpay => "NOTPAY".into(),
      PayTransactionsJsapiTradeState::Closed => "CLOSED".into(),
      PayTransactionsJsapiTradeState::Revoked => "REVOKED".into(),
      PayTransactionsJsapiTradeState::Userpaying => "USERPAYING".into(),
      PayTransactionsJsapiTradeState::Payerror => "PAYERROR".into(),
    }
  }
}

impl From<PayTransactionsJsapiTradeState> for String {
  fn from(value: PayTransactionsJsapiTradeState) -> Self {
    match value {
      PayTransactionsJsapiTradeState::Success => "SUCCESS".into(),
      PayTransactionsJsapiTradeState::Refund => "REFUND".into(),
      PayTransactionsJsapiTradeState::Notpay => "NOTPAY".into(),
      PayTransactionsJsapiTradeState::Closed => "CLOSED".into(),
      PayTransactionsJsapiTradeState::Revoked => "REVOKED".into(),
      PayTransactionsJsapiTradeState::Userpaying => "USERPAYING".into(),
      PayTransactionsJsapiTradeState::Payerror => "PAYERROR".into(),
    }
  }
}

impl From<PayTransactionsJsapiTradeState> for ArgType {
  fn from(value: PayTransactionsJsapiTradeState) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl FromStr for PayTransactionsJsapiTradeState {
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
      _ => Err(eyre!("PayTransactionsJsapiTradeState can't convert from {s}")),
    }
  }
}

impl PayTransactionsJsapiTradeState {
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

impl TryFrom<String> for PayTransactionsJsapiTradeState {
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
            "PayTransactionsJsapiTradeState can't convert from {s}".to_owned(),
          )),
        }),
      )),
    }
  }
}

/// 微信JSAPI下单货币类型
#[derive(Enum, Copy, Clone, Default, Eq, PartialEq, Serialize, Deserialize, Debug)]
pub enum PayTransactionsJsapiCurrency {
  /// 人民币
  #[default]
  #[graphql(name="CNY")]
  Cny,
}

impl fmt::Display for PayTransactionsJsapiCurrency {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    match self {
      Self::Cny => write!(f, "CNY"),
    }
  }
}

impl From<PayTransactionsJsapiCurrency> for SmolStr {
  fn from(value: PayTransactionsJsapiCurrency) -> Self {
    match value {
      PayTransactionsJsapiCurrency::Cny => "CNY".into(),
    }
  }
}

impl From<PayTransactionsJsapiCurrency> for String {
  fn from(value: PayTransactionsJsapiCurrency) -> Self {
    match value {
      PayTransactionsJsapiCurrency::Cny => "CNY".into(),
    }
  }
}

impl From<PayTransactionsJsapiCurrency> for ArgType {
  fn from(value: PayTransactionsJsapiCurrency) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl FromStr for PayTransactionsJsapiCurrency {
  type Err = color_eyre::eyre::Error;
  
  fn from_str(s: &str) -> Result<Self, Self::Err> {
    match s {
      "CNY" => Ok(Self::Cny),
      _ => Err(eyre!("PayTransactionsJsapiCurrency can't convert from {s}")),
    }
  }
}

impl PayTransactionsJsapiCurrency {
  pub fn as_str(&self) -> &str {
    match self {
      Self::Cny => "CNY",
    }
  }
}

impl TryFrom<String> for PayTransactionsJsapiCurrency {
  type Error = sqlx::Error;
  
  fn try_from(s: String) -> Result<Self, sqlx::Error> {
    match s.as_str() {
      "CNY" => Ok(Self::Cny),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "currency".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "PayTransactionsJsapiCurrency can't convert from {s}".to_owned(),
          )),
        }),
      )),
    }
  }
}

/// 微信JSAPI下单 检测字段是否允许前端排序
pub fn check_sort_pay_transactions_jsapi(
  sort: Option<&[SortInput]>,
) -> Result<()> {
  
  if sort.is_none() {
    return Ok(());
  }
  let sort = sort.unwrap();
  
  let get_can_sort_in_api_pay_transactions_jsapi = get_can_sort_in_api_pay_transactions_jsapi();
  
  for item in sort {
    let prop = item.prop.as_str();
    if prop.is_empty() {
      continue;
    }
    if !get_can_sort_in_api_pay_transactions_jsapi.contains(&prop) {
      return Err(eyre!("check_sort_pay_transactions_jsapi: {}", serde_json::to_string(item)?));
    }
  }
  
  Ok(())
}

/// 获取路由地址
pub fn get_route_path_pay_transactions_jsapi() -> String {
  "/wx/pay_transactions_jsapi".to_owned()
}
