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
use crate::base::usr::usr_model::UsrId;

static CAN_SORT_IN_API_WX_PAY: [&str; 3] = [
  "order_by",
  "create_time",
  "update_time",
];

/// 微信支付设置 前端允许排序的字段
fn get_can_sort_in_api_wx_pay() -> &'static [&'static str; 3] {
  &CAN_SORT_IN_API_WX_PAY
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
  pub lbl: SmolStr,
  /// 开发者ID
  #[graphql(name = "appid")]
  pub appid: SmolStr,
  /// 商户号
  #[graphql(name = "mchid")]
  pub mchid: SmolStr,
  /// 证书序列号
  #[graphql(name = "serial_no")]
  pub serial_no: SmolStr,
  /// 公钥
  #[graphql(name = "public_key")]
  pub public_key: SmolStr,
  /// 私钥
  #[graphql(name = "private_key")]
  pub private_key: SmolStr,
  /// APIv3密钥
  #[graphql(name = "v3_key")]
  pub v3_key: SmolStr,
  /// 支付终端IP
  #[graphql(name = "payer_client_ip")]
  pub payer_client_ip: SmolStr,
  /// 通知地址
  #[graphql(name = "notify_url")]
  pub notify_url: SmolStr,
  /// 退款通知地址
  #[graphql(name = "refund_notify_url")]
  pub refund_notify_url: SmolStr,
  /// 锁定
  #[graphql(name = "is_locked")]
  pub is_locked: u8,
  /// 锁定
  #[graphql(name = "is_locked_lbl")]
  pub is_locked_lbl: SmolStr,
  /// 启用
  #[graphql(name = "is_enabled")]
  pub is_enabled: u8,
  /// 启用
  #[graphql(name = "is_enabled_lbl")]
  pub is_enabled_lbl: SmolStr,
  /// 排序
  #[graphql(name = "order_by")]
  pub order_by: u32,
  /// 备注
  #[graphql(name = "rem")]
  pub rem: SmolStr,
  /// 是否已删除
  pub is_deleted: u8,
  /// 创建人
  pub create_usr_id: UsrId,
  /// 创建人
  pub create_usr_id_lbl: SmolStr,
  /// 创建时间
  pub create_time: Option<chrono::NaiveDateTime>,
  /// 创建时间
  pub create_time_lbl: SmolStr,
  /// 更新人
  pub update_usr_id: UsrId,
  /// 更新人
  pub update_usr_id_lbl: SmolStr,
  /// 更新时间
  pub update_time: Option<chrono::NaiveDateTime>,
  /// 更新时间
  pub update_time_lbl: SmolStr,
}

impl FromRow<'_, MySqlRow> for WxPayModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;
    // ID
    let id: WxPayId = row.try_get("id")?;
    // 名称
    let lbl: &str = row.try_get("lbl")?;
    let lbl = SmolStr::new(lbl);
    // 开发者ID
    let appid: &str = row.try_get("appid")?;
    let appid = SmolStr::new(appid);
    // 商户号
    let mchid: &str = row.try_get("mchid")?;
    let mchid = SmolStr::new(mchid);
    // 证书序列号
    let serial_no: &str = row.try_get("serial_no")?;
    let serial_no = SmolStr::new(serial_no);
    // 公钥
    let public_key: &str = row.try_get("public_key")?;
    let public_key = SmolStr::new(public_key);
    // 私钥
    let private_key: &str = row.try_get("private_key")?;
    let private_key = SmolStr::new(private_key);
    // APIv3密钥
    let v3_key: &str = row.try_get("v3_key")?;
    let v3_key = SmolStr::new(v3_key);
    // 支付终端IP
    let payer_client_ip: &str = row.try_get("payer_client_ip")?;
    let payer_client_ip = SmolStr::new(payer_client_ip);
    // 通知地址
    let notify_url: &str = row.try_get("notify_url")?;
    let notify_url = SmolStr::new(notify_url);
    // 退款通知地址
    let refund_notify_url: &str = row.try_get("refund_notify_url")?;
    let refund_notify_url = SmolStr::new(refund_notify_url);
    // 锁定
    let is_locked: u8 = row.try_get("is_locked")?;
    let is_locked_lbl = SmolStr::new(is_locked.to_string());
    // 启用
    let is_enabled: u8 = row.try_get("is_enabled")?;
    let is_enabled_lbl = SmolStr::new(is_enabled.to_string());
    // 排序
    let order_by: u32 = row.try_get("order_by")?;
    // 备注
    let rem: &str = row.try_get("rem")?;
    let rem = SmolStr::new(rem);
    // 创建人
    let create_usr_id: UsrId = row.try_get("create_usr_id")?;
    let create_usr_id_lbl: Option<&str> = row.try_get("create_usr_id_lbl")?;
    let create_usr_id_lbl = SmolStr::new(create_usr_id_lbl.unwrap_or_default());
    // 创建时间
    let create_time: Option<chrono::NaiveDateTime> = row.try_get("create_time")?;
    let create_time_lbl: SmolStr = match create_time {
      Some(item) => SmolStr::new(item.format("%Y-%m-%d %H:%M:%S").to_string()),
      None => SmolStr::new(""),
    };
    // 更新人
    let update_usr_id: UsrId = row.try_get("update_usr_id")?;
    let update_usr_id_lbl: Option<&str> = row.try_get("update_usr_id_lbl")?;
    let update_usr_id_lbl = SmolStr::new(update_usr_id_lbl.unwrap_or_default());
    // 更新时间
    let update_time: Option<chrono::NaiveDateTime> = row.try_get("update_time")?;
    let update_time_lbl: SmolStr = match update_time {
      Some(item) => SmolStr::new(item.format("%Y-%m-%d %H:%M:%S").to_string()),
      None => SmolStr::new(""),
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
      serial_no,
      public_key,
      private_key,
      v3_key,
      payer_client_ip,
      notify_url,
      refund_notify_url,
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
#[graphql(rename_fields = "snake_case", name = "WxPayFieldComment")]
#[allow(dead_code)]
pub struct WxPayFieldComment {
  /// ID
  #[graphql(name = "id")]
  pub id: SmolStr,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: SmolStr,
  /// 开发者ID
  #[graphql(name = "appid")]
  pub appid: SmolStr,
  /// 商户号
  #[graphql(name = "mchid")]
  pub mchid: SmolStr,
  /// 证书序列号
  #[graphql(name = "serial_no")]
  pub serial_no: SmolStr,
  /// 公钥
  #[graphql(name = "public_key")]
  pub public_key: SmolStr,
  /// 私钥
  #[graphql(name = "private_key")]
  pub private_key: SmolStr,
  /// APIv3密钥
  #[graphql(name = "v3_key")]
  pub v3_key: SmolStr,
  /// 支付终端IP
  #[graphql(name = "payer_client_ip")]
  pub payer_client_ip: SmolStr,
  /// 通知地址
  #[graphql(name = "notify_url")]
  pub notify_url: SmolStr,
  /// 退款通知地址
  #[graphql(name = "refund_notify_url")]
  pub refund_notify_url: SmolStr,
  /// 锁定
  #[graphql(name = "is_locked")]
  pub is_locked: SmolStr,
  /// 锁定
  #[graphql(name = "is_locked_lbl")]
  pub is_locked_lbl: SmolStr,
  /// 启用
  #[graphql(name = "is_enabled")]
  pub is_enabled: SmolStr,
  /// 启用
  #[graphql(name = "is_enabled_lbl")]
  pub is_enabled_lbl: SmolStr,
  /// 排序
  #[graphql(name = "order_by")]
  pub order_by: SmolStr,
  /// 备注
  #[graphql(name = "rem")]
  pub rem: SmolStr,
  /// 创建人
  #[graphql(name = "create_usr_id")]
  pub create_usr_id: SmolStr,
  /// 创建人
  #[graphql(name = "create_usr_id_lbl")]
  pub create_usr_id_lbl: SmolStr,
  /// 创建时间
  #[graphql(name = "create_time")]
  pub create_time: SmolStr,
  /// 创建时间
  #[graphql(name = "create_time_lbl")]
  pub create_time_lbl: SmolStr,
  /// 更新人
  #[graphql(name = "update_usr_id")]
  pub update_usr_id: SmolStr,
  /// 更新人
  #[graphql(name = "update_usr_id_lbl")]
  pub update_usr_id_lbl: SmolStr,
  /// 更新时间
  #[graphql(name = "update_time")]
  pub update_time: SmolStr,
  /// 更新时间
  #[graphql(name = "update_time_lbl")]
  pub update_time_lbl: SmolStr,
}

#[derive(InputObject, Serialize, Deserialize, Default, Clone)]
#[graphql(rename_fields = "snake_case", name = "WxPaySearch")]
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
  pub lbl: Option<SmolStr>,
  /// 名称
  #[graphql(name = "lbl_like")]
  pub lbl_like: Option<SmolStr>,
  /// 开发者ID
  #[graphql(name = "appid")]
  pub appid: Option<SmolStr>,
  /// 开发者ID
  #[graphql(name = "appid_like")]
  pub appid_like: Option<SmolStr>,
  /// 商户号
  #[graphql(skip)]
  pub mchid: Option<SmolStr>,
  /// 商户号
  #[graphql(skip)]
  pub mchid_like: Option<SmolStr>,
  /// 证书序列号
  #[graphql(skip)]
  pub serial_no: Option<SmolStr>,
  /// 证书序列号
  #[graphql(skip)]
  pub serial_no_like: Option<SmolStr>,
  /// 公钥
  #[graphql(skip)]
  pub public_key: Option<SmolStr>,
  /// 公钥
  #[graphql(skip)]
  pub public_key_like: Option<SmolStr>,
  /// 私钥
  #[graphql(skip)]
  pub private_key: Option<SmolStr>,
  /// 私钥
  #[graphql(skip)]
  pub private_key_like: Option<SmolStr>,
  /// APIv3密钥
  #[graphql(skip)]
  pub v3_key: Option<SmolStr>,
  /// APIv3密钥
  #[graphql(skip)]
  pub v3_key_like: Option<SmolStr>,
  /// 支付终端IP
  #[graphql(skip)]
  pub payer_client_ip: Option<SmolStr>,
  /// 支付终端IP
  #[graphql(skip)]
  pub payer_client_ip_like: Option<SmolStr>,
  /// 通知地址
  #[graphql(skip)]
  pub notify_url: Option<SmolStr>,
  /// 通知地址
  #[graphql(skip)]
  pub notify_url_like: Option<SmolStr>,
  /// 退款通知地址
  #[graphql(skip)]
  pub refund_notify_url: Option<SmolStr>,
  /// 退款通知地址
  #[graphql(skip)]
  pub refund_notify_url_like: Option<SmolStr>,
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
  pub rem: Option<SmolStr>,
  /// 备注
  #[graphql(skip)]
  pub rem_like: Option<SmolStr>,
  /// 创建人
  #[graphql(name = "create_usr_id")]
  pub create_usr_id: Option<Vec<UsrId>>,
  /// 创建人
  #[graphql(name = "create_usr_id_save_null")]
  pub create_usr_id_is_null: Option<bool>,
  /// 创建人
  #[graphql(name = "create_usr_id_lbl")]
  pub create_usr_id_lbl: Option<Vec<SmolStr>>,
  /// 创建人
  #[graphql(name = "create_usr_id_lbl_like")]
  pub create_usr_id_lbl_like: Option<SmolStr>,
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
  pub update_usr_id_lbl: Option<Vec<SmolStr>>,
  /// 更新人
  #[graphql(name = "update_usr_id_lbl_like")]
  pub update_usr_id_lbl_like: Option<SmolStr>,
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
    // 证书序列号
    if let Some(ref serial_no) = self.serial_no {
      item = item.field("serial_no", serial_no);
    }
    if let Some(ref serial_no_like) = self.serial_no_like {
      item = item.field("serial_no_like", serial_no_like);
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
    // 退款通知地址
    if let Some(ref refund_notify_url) = self.refund_notify_url {
      item = item.field("refund_notify_url", refund_notify_url);
    }
    if let Some(ref refund_notify_url_like) = self.refund_notify_url_like {
      item = item.field("refund_notify_url_like", refund_notify_url_like);
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
    if let Some(ref create_usr_id_lbl) = self.create_usr_id_lbl {
      item = item.field("create_usr_id_lbl", create_usr_id_lbl);
    }
    if let Some(ref create_usr_id_lbl_like) = self.create_usr_id_lbl_like {
      item = item.field("create_usr_id_lbl_like", create_usr_id_lbl_like);
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
    if let Some(ref update_usr_id_lbl) = self.update_usr_id_lbl {
      item = item.field("update_usr_id_lbl", update_usr_id_lbl);
    }
    if let Some(ref update_usr_id_lbl_like) = self.update_usr_id_lbl_like {
      item = item.field("update_usr_id_lbl_like", update_usr_id_lbl_like);
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

#[derive(InputObject, Serialize, Deserialize, Default, Clone)]
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
  pub lbl: Option<SmolStr>,
  /// 开发者ID
  #[graphql(name = "appid")]
  pub appid: Option<SmolStr>,
  /// 商户号
  #[graphql(name = "mchid")]
  pub mchid: Option<SmolStr>,
  /// 证书序列号
  #[graphql(name = "serial_no")]
  pub serial_no: Option<SmolStr>,
  /// 公钥
  #[graphql(name = "public_key")]
  pub public_key: Option<SmolStr>,
  /// 私钥
  #[graphql(name = "private_key")]
  pub private_key: Option<SmolStr>,
  /// APIv3密钥
  #[graphql(name = "v3_key")]
  pub v3_key: Option<SmolStr>,
  /// 支付终端IP
  #[graphql(name = "payer_client_ip")]
  pub payer_client_ip: Option<SmolStr>,
  /// 通知地址
  #[graphql(name = "notify_url")]
  pub notify_url: Option<SmolStr>,
  /// 退款通知地址
  #[graphql(name = "refund_notify_url")]
  pub refund_notify_url: Option<SmolStr>,
  /// 锁定
  #[graphql(name = "is_locked")]
  pub is_locked: Option<u8>,
  /// 锁定
  #[graphql(name = "is_locked_lbl")]
  pub is_locked_lbl: Option<SmolStr>,
  /// 启用
  #[graphql(name = "is_enabled")]
  pub is_enabled: Option<u8>,
  /// 启用
  #[graphql(name = "is_enabled_lbl")]
  pub is_enabled_lbl: Option<SmolStr>,
  /// 排序
  #[graphql(name = "order_by")]
  pub order_by: Option<u32>,
  /// 备注
  #[graphql(name = "rem")]
  pub rem: Option<SmolStr>,
  /// 创建人
  #[graphql(skip)]
  pub create_usr_id: Option<UsrId>,
  /// 创建人
  #[graphql(skip)]
  pub create_usr_id_lbl: Option<SmolStr>,
  /// 创建时间
  #[graphql(skip)]
  pub create_time: Option<chrono::NaiveDateTime>,
  /// 创建时间
  #[graphql(skip)]
  pub create_time_lbl: Option<SmolStr>,
  /// 创建时间
  #[graphql(skip)]
  pub create_time_save_null: Option<bool>,
  /// 更新人
  #[graphql(skip)]
  pub update_usr_id: Option<UsrId>,
  /// 更新人
  #[graphql(skip)]
  pub update_usr_id_lbl: Option<SmolStr>,
  /// 更新时间
  #[graphql(skip)]
  pub update_time: Option<chrono::NaiveDateTime>,
  /// 更新时间
  #[graphql(skip)]
  pub update_time_lbl: Option<SmolStr>,
  /// 更新时间
  #[graphql(skip)]
  pub update_time_save_null: Option<bool>,
}

impl std::fmt::Debug for WxPayInput {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("WxPayInput");
    if let Some(ref id) = self.id {
      item = item.field("id", id);
    }
    if let Some(ref is_deleted) = self.is_deleted {
      if *is_deleted == 1 {
        item = item.field("is_deleted", is_deleted);
      }
    }
    if let Some(ref tenant_id) = self.tenant_id {
      item = item.field("tenant_id", tenant_id);
    }
    if let Some(ref lbl) = self.lbl {
      item = item.field("lbl", lbl);
    }
    if let Some(ref appid) = self.appid {
      item = item.field("appid", appid);
    }
    if let Some(ref mchid) = self.mchid {
      item = item.field("mchid", mchid);
    }
    if let Some(ref serial_no) = self.serial_no {
      item = item.field("serial_no", serial_no);
    }
    if let Some(ref public_key) = self.public_key {
      item = item.field("public_key", public_key);
    }
    if let Some(ref private_key) = self.private_key {
      item = item.field("private_key", private_key);
    }
    if let Some(ref v3_key) = self.v3_key {
      item = item.field("v3_key", v3_key);
    }
    if let Some(ref payer_client_ip) = self.payer_client_ip {
      item = item.field("payer_client_ip", payer_client_ip);
    }
    if let Some(ref notify_url) = self.notify_url {
      item = item.field("notify_url", notify_url);
    }
    if let Some(ref refund_notify_url) = self.refund_notify_url {
      item = item.field("refund_notify_url", refund_notify_url);
    }
    if let Some(ref is_locked) = self.is_locked {
      item = item.field("is_locked", is_locked);
    }
    if let Some(ref is_enabled) = self.is_enabled {
      item = item.field("is_enabled", is_enabled);
    }
    if let Some(ref order_by) = self.order_by {
      item = item.field("order_by", order_by);
    }
    if let Some(ref rem) = self.rem {
      item = item.field("rem", rem);
    }
    if let Some(ref create_usr_id) = self.create_usr_id {
      item = item.field("create_usr_id", create_usr_id);
    }
    if let Some(ref create_usr_id_lbl) = self.create_usr_id_lbl {
      item = item.field("create_usr_id_lbl", create_usr_id_lbl);
    }
    if let Some(ref create_time) = self.create_time {
      item = item.field("create_time", create_time);
    }
    if let Some(ref update_usr_id) = self.update_usr_id {
      item = item.field("update_usr_id", update_usr_id);
    }
    if let Some(ref update_usr_id_lbl) = self.update_usr_id_lbl {
      item = item.field("update_usr_id_lbl", update_usr_id_lbl);
    }
    if let Some(ref update_time) = self.update_time {
      item = item.field("update_time", update_time);
    }
    item.finish()
  }
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
      // 证书序列号
      serial_no: model.serial_no.into(),
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
      // 退款通知地址
      refund_notify_url: model.refund_notify_url.into(),
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
      // 证书序列号
      serial_no: input.serial_no,
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
      // 退款通知地址
      refund_notify_url: input.refund_notify_url,
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

impl_id!(WxPayId);

/// 微信支付设置 检测字段是否允许前端排序
pub fn check_sort_wx_pay(
  sort: Option<&[SortInput]>,
) -> Result<()> {
  
  if sort.is_none() {
    return Ok(());
  }
  
  let sort = sort.unwrap_or_default();
  
  if sort.is_empty() {
    return Ok(());
  }
  
  let get_can_sort_in_api_wx_pay = get_can_sort_in_api_wx_pay();
  
  for item in sort {
    let prop = item.prop.as_str();
    if prop.is_empty() {
      continue;
    }
    if !get_can_sort_in_api_wx_pay.contains(&prop) {
      return Err(eyre!(ServiceException {
        message: format!("check_sort_wx_pay: {}", serde_json::to_string(item)?).into(),
        trace: true,
        ..Default::default()
      }));
    }
  }
  
  Ok(())
}

// MARK: get_page_path_wx_pay
pub fn get_page_path_wx_pay() -> &'static str {
  "/wx/wx_pay"
}

// MARK: get_table_name_wx_pay
pub fn get_table_name_wx_pay() -> &'static str {
  "wx_wx_pay"
}
