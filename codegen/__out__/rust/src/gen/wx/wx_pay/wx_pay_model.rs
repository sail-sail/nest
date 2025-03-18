
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

static CAN_SORT_IN_API_WX_PAY: OnceLock<[&'static str; 3]> = OnceLock::new();

/// 微信支付设置 前端允许排序的字段
fn get_can_sort_in_api_wx_pay() -> &'static [&'static str; 3] {
  CAN_SORT_IN_API_WX_PAY.get_or_init(|| [
    "order_by",
    "create_time",
    "update_time",
  ])
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "WxPayModel")]
#[allow(dead_code)]
pub struct WxPayModel {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: TenantId,
  /// ID
  pub id: WxPayId,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: String,
  /// 开发者ID
  #[graphql(name = "appid")]
  pub appid: String,
  /// 商户号
  #[graphql(name = "mchid")]
  pub mchid: String,
  /// 公钥
  #[graphql(name = "public_key")]
  pub public_key: String,
  /// 私钥
  #[graphql(name = "private_key")]
  pub private_key: String,
  /// APIv3密钥
  #[graphql(name = "v3_key")]
  pub v3_key: String,
  /// 支付终端IP
  #[graphql(name = "payer_client_ip")]
  pub payer_client_ip: String,
  /// 通知地址
  #[graphql(name = "notify_url")]
  pub notify_url: String,
  /// 锁定
  #[graphql(name = "is_locked")]
  pub is_locked: u8,
  /// 锁定
  #[graphql(name = "is_locked_lbl")]
  pub is_locked_lbl: String,
  /// 启用
  #[graphql(name = "is_enabled")]
  pub is_enabled: u8,
  /// 启用
  #[graphql(name = "is_enabled_lbl")]
  pub is_enabled_lbl: String,
  /// 排序
  #[graphql(name = "order_by")]
  pub order_by: u32,
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

impl FromRow<'_, MySqlRow> for WxPayModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;
    // ID
    let id: WxPayId = row.try_get("id")?;
    // 名称
    let lbl: String = row.try_get("lbl")?;
    // 开发者ID
    let appid: String = row.try_get("appid")?;
    // 商户号
    let mchid: String = row.try_get("mchid")?;
    // 公钥
    let public_key: String = row.try_get("public_key")?;
    // 私钥
    let private_key: String = row.try_get("private_key")?;
    // APIv3密钥
    let v3_key: String = row.try_get("v3_key")?;
    // 支付终端IP
    let payer_client_ip: String = row.try_get("payer_client_ip")?;
    // 通知地址
    let notify_url: String = row.try_get("notify_url")?;
    // 锁定
    let is_locked: u8 = row.try_get("is_locked")?;
    let is_locked_lbl: String = is_locked.to_string();
    // 启用
    let is_enabled: u8 = row.try_get("is_enabled")?;
    let is_enabled_lbl: String = is_enabled.to_string();
    // 排序
    let order_by: u32 = row.try_get("order_by")?;
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
      lbl,
      appid,
      mchid,
      public_key,
      private_key,
      v3_key,
      payer_client_ip,
      notify_url,
      is_locked,
      is_locked_lbl,
      is_enabled,
      is_enabled_lbl,
      order_by,
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
pub struct WxPayFieldComment {
  /// ID
  #[graphql(name = "id")]
  pub id: String,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: String,
  /// 开发者ID
  #[graphql(name = "appid")]
  pub appid: String,
  /// 商户号
  #[graphql(name = "mchid")]
  pub mchid: String,
  /// 公钥
  #[graphql(name = "public_key")]
  pub public_key: String,
  /// 私钥
  #[graphql(name = "private_key")]
  pub private_key: String,
  /// APIv3密钥
  #[graphql(name = "v3_key")]
  pub v3_key: String,
  /// 支付终端IP
  #[graphql(name = "payer_client_ip")]
  pub payer_client_ip: String,
  /// 通知地址
  #[graphql(name = "notify_url")]
  pub notify_url: String,
  /// 锁定
  #[graphql(name = "is_locked")]
  pub is_locked: String,
  /// 锁定
  #[graphql(name = "is_locked_lbl")]
  pub is_locked_lbl: String,
  /// 启用
  #[graphql(name = "is_enabled")]
  pub is_enabled: String,
  /// 启用
  #[graphql(name = "is_enabled_lbl")]
  pub is_enabled_lbl: String,
  /// 排序
  #[graphql(name = "order_by")]
  pub order_by: String,
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
pub struct WxPaySearch {
  /// ID
  pub id: Option<WxPayId>,
  /// ID列表
  pub ids: Option<Vec<WxPayId>>,
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  pub is_deleted: Option<u8>,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: Option<String>,
  /// 名称
  #[graphql(name = "lbl_like")]
  pub lbl_like: Option<String>,
  /// 开发者ID
  #[graphql(name = "appid")]
  pub appid: Option<String>,
  /// 开发者ID
  #[graphql(name = "appid_like")]
  pub appid_like: Option<String>,
  /// 商户号
  #[graphql(skip)]
  pub mchid: Option<String>,
  /// 商户号
  #[graphql(skip)]
  pub mchid_like: Option<String>,
  /// 公钥
  #[graphql(skip)]
  pub public_key: Option<String>,
  /// 公钥
  #[graphql(skip)]
  pub public_key_like: Option<String>,
  /// 私钥
  #[graphql(skip)]
  pub private_key: Option<String>,
  /// 私钥
  #[graphql(skip)]
  pub private_key_like: Option<String>,
  /// APIv3密钥
  #[graphql(skip)]
  pub v3_key: Option<String>,
  /// APIv3密钥
  #[graphql(skip)]
  pub v3_key_like: Option<String>,
  /// 支付终端IP
  #[graphql(skip)]
  pub payer_client_ip: Option<String>,
  /// 支付终端IP
  #[graphql(skip)]
  pub payer_client_ip_like: Option<String>,
  /// 通知地址
  #[graphql(skip)]
  pub notify_url: Option<String>,
  /// 通知地址
  #[graphql(skip)]
  pub notify_url_like: Option<String>,
  /// 锁定
  #[graphql(skip)]
  pub is_locked: Option<Vec<u8>>,
  /// 启用
  #[graphql(name = "is_enabled")]
  pub is_enabled: Option<Vec<u8>>,
  /// 排序
  #[graphql(skip)]
  pub order_by: Option<[Option<u32>; 2]>,
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

impl std::fmt::Debug for WxPaySearch {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("WxPaySearch");
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
    // 名称
    if let Some(ref lbl) = self.lbl {
      item = item.field("lbl", lbl);
    }
    if let Some(ref lbl_like) = self.lbl_like {
      item = item.field("lbl_like", lbl_like);
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
    // 公钥
    if let Some(ref public_key) = self.public_key {
      item = item.field("public_key", public_key);
    }
    if let Some(ref public_key_like) = self.public_key_like {
      item = item.field("public_key_like", public_key_like);
    }
    // 私钥
    if let Some(ref private_key) = self.private_key {
      item = item.field("private_key", private_key);
    }
    if let Some(ref private_key_like) = self.private_key_like {
      item = item.field("private_key_like", private_key_like);
    }
    // APIv3密钥
    if let Some(ref v3_key) = self.v3_key {
      item = item.field("v3_key", v3_key);
    }
    if let Some(ref v3_key_like) = self.v3_key_like {
      item = item.field("v3_key_like", v3_key_like);
    }
    // 支付终端IP
    if let Some(ref payer_client_ip) = self.payer_client_ip {
      item = item.field("payer_client_ip", payer_client_ip);
    }
    if let Some(ref payer_client_ip_like) = self.payer_client_ip_like {
      item = item.field("payer_client_ip_like", payer_client_ip_like);
    }
    // 通知地址
    if let Some(ref notify_url) = self.notify_url {
      item = item.field("notify_url", notify_url);
    }
    if let Some(ref notify_url_like) = self.notify_url_like {
      item = item.field("notify_url_like", notify_url_like);
    }
    // 锁定
    if let Some(ref is_locked) = self.is_locked {
      item = item.field("is_locked", is_locked);
    }
    // 启用
    if let Some(ref is_enabled) = self.is_enabled {
      item = item.field("is_enabled", is_enabled);
    }
    // 排序
    if let Some(ref order_by) = self.order_by {
      item = item.field("order_by", order_by);
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
#[graphql(rename_fields = "snake_case", name = "WxPayInput")]
#[allow(dead_code)]
pub struct WxPayInput {
  /// ID
  pub id: Option<WxPayId>,
  /// 已删除
  #[graphql(skip)]
  pub is_deleted: Option<u8>,
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: Option<String>,
  /// 开发者ID
  #[graphql(name = "appid")]
  pub appid: Option<String>,
  /// 商户号
  #[graphql(name = "mchid")]
  pub mchid: Option<String>,
  /// 公钥
  #[graphql(name = "public_key")]
  pub public_key: Option<String>,
  /// 私钥
  #[graphql(name = "private_key")]
  pub private_key: Option<String>,
  /// APIv3密钥
  #[graphql(name = "v3_key")]
  pub v3_key: Option<String>,
  /// 支付终端IP
  #[graphql(name = "payer_client_ip")]
  pub payer_client_ip: Option<String>,
  /// 通知地址
  #[graphql(name = "notify_url")]
  pub notify_url: Option<String>,
  /// 锁定
  #[graphql(name = "is_locked")]
  pub is_locked: Option<u8>,
  /// 锁定
  #[graphql(name = "is_locked_lbl")]
  pub is_locked_lbl: Option<String>,
  /// 启用
  #[graphql(name = "is_enabled")]
  pub is_enabled: Option<u8>,
  /// 启用
  #[graphql(name = "is_enabled_lbl")]
  pub is_enabled_lbl: Option<String>,
  /// 排序
  #[graphql(name = "order_by")]
  pub order_by: Option<u32>,
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

impl From<WxPayModel> for WxPayInput {
  fn from(model: WxPayModel) -> Self {
    Self {
      id: model.id.into(),
      is_deleted: model.is_deleted.into(),
      tenant_id: model.tenant_id.into(),
      // 名称
      lbl: model.lbl.into(),
      // 开发者ID
      appid: model.appid.into(),
      // 商户号
      mchid: model.mchid.into(),
      // 公钥
      public_key: model.public_key.into(),
      // 私钥
      private_key: model.private_key.into(),
      // APIv3密钥
      v3_key: model.v3_key.into(),
      // 支付终端IP
      payer_client_ip: model.payer_client_ip.into(),
      // 通知地址
      notify_url: model.notify_url.into(),
      // 锁定
      is_locked: model.is_locked.into(),
      is_locked_lbl: model.is_locked_lbl.into(),
      // 启用
      is_enabled: model.is_enabled.into(),
      is_enabled_lbl: model.is_enabled_lbl.into(),
      // 排序
      order_by: model.order_by.into(),
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

impl From<WxPayInput> for WxPaySearch {
  fn from(input: WxPayInput) -> Self {
    Self {
      id: input.id,
      ids: None,
      // 租户ID
      tenant_id: input.tenant_id,
      is_deleted: None,
      // 名称
      lbl: input.lbl,
      // 开发者ID
      appid: input.appid,
      // 商户号
      mchid: input.mchid,
      // 公钥
      public_key: input.public_key,
      // 私钥
      private_key: input.private_key,
      // APIv3密钥
      v3_key: input.v3_key,
      // 支付终端IP
      payer_client_ip: input.payer_client_ip,
      // 通知地址
      notify_url: input.notify_url,
      // 锁定
      is_locked: input.is_locked.map(|x| vec![x]),
      // 启用
      is_enabled: input.is_enabled.map(|x| vec![x]),
      // 排序
      order_by: input.order_by.map(|x| [Some(x), Some(x)]),
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
pub struct WxPayId(SmolStr);

impl fmt::Display for WxPayId {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(f, "{}", self.0)
  }
}

#[async_graphql::Scalar(name = "WxPayId")]
impl async_graphql::ScalarType for WxPayId {
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

impl From<WxPayId> for ArgType {
  fn from(value: WxPayId) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl From<&WxPayId> for ArgType {
  fn from(value: &WxPayId) -> Self {
    ArgType::SmolStr(value.clone().into())
  }
}

impl From<WxPayId> for SmolStr {
  fn from(id: WxPayId) -> Self {
    id.0
  }
}

impl From<SmolStr> for WxPayId {
  fn from(s: SmolStr) -> Self {
    Self(s)
  }
}

impl From<&SmolStr> for WxPayId {
  fn from(s: &SmolStr) -> Self {
    Self(s.clone())
  }
}

impl From<String> for WxPayId {
  fn from(s: String) -> Self {
    Self(s.into())
  }
}

impl From<&str> for WxPayId {
  fn from(s: &str) -> Self {
    Self(s.into())
  }
}

impl Deref for WxPayId {
  type Target = SmolStr;
  
  fn deref(&self) -> &SmolStr {
    &self.0
  }
}

impl Encode<'_, MySql> for WxPayId {
  fn encode_by_ref(&self, buf: &mut Vec<u8>) -> sqlx::Result<IsNull, BoxDynError> {
    <&str as Encode<MySql>>::encode(self.as_str(), buf)
  }
  
  fn size_hint(&self) -> usize {
    self.len()
  }
}

impl sqlx::Type<MySql> for WxPayId {
  fn type_info() -> <MySql as sqlx::Database>::TypeInfo {
    <&str as sqlx::Type<MySql>>::type_info()
  }
  
  fn compatible(ty: &<MySql as sqlx::Database>::TypeInfo) -> bool {
    <&str as sqlx::Type<MySql>>::compatible(ty)
  }
}

impl<'r> sqlx::Decode<'r, MySql> for WxPayId {
  fn decode(
    value: MySqlValueRef<'r>,
  ) -> Result<Self, BoxDynError> {
    <&str as sqlx::Decode<MySql>>::decode(value).map(Self::from)
  }
}

impl PartialEq<str> for WxPayId {
  fn eq(&self, other: &str) -> bool {
    self.0 == other
  }
}

/// 微信支付设置 检测字段是否允许前端排序
pub fn check_sort_wx_pay(
  sort: Option<&[SortInput]>,
) -> Result<()> {
  
  if sort.is_none() {
    return Ok(());
  }
  let sort = sort.unwrap();
  
  let get_can_sort_in_api_wx_pay = get_can_sort_in_api_wx_pay();
  
  for item in sort {
    let prop = item.prop.as_str();
    if prop.is_empty() {
      continue;
    }
    if !get_can_sort_in_api_wx_pay.contains(&prop) {
      return Err(eyre!("check_sort_wx_pay: {}", serde_json::to_string(item)?));
    }
  }
  
  Ok(())
}

/// 获取路由地址
pub fn get_route_path_wx_pay() -> String {
  "/wx/wx_pay".to_owned()
}
