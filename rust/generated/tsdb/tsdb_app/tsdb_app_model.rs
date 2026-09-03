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
use crate::common::exceptions::service_exception::ServiceException;

use crate::base::tenant::tenant_model::TenantId;
use crate::base::usr::usr_model::UsrId;

static CAN_SORT_IN_API_TSDB_APP: [&str; 3] = [
  "order_by",
  "create_time",
  "update_time",
];

/// 时序数据库 前端允许排序的字段
fn get_can_sort_in_api_tsdb_app() -> &'static [&'static str; 3] {
  &CAN_SORT_IN_API_TSDB_APP
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "TsdbAppModel")]
#[allow(dead_code)]
pub struct TsdbAppModel {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: TenantId,
  /// ID
  pub id: TsdbAppId,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: String,
  /// 类型
  #[graphql(name = "type")]
  pub r#type: TsdbAppType,
  /// 类型
  #[graphql(name = "type_lbl")]
  pub type_lbl: String,
  /// 协议
  #[graphql(name = "protocol")]
  pub protocol: TsdbAppProtocol,
  /// 协议
  #[graphql(name = "protocol_lbl")]
  pub protocol_lbl: String,
  /// 主机名
  #[graphql(name = "hostname")]
  pub hostname: String,
  /// 端口
  #[graphql(name = "port")]
  pub port: i32,
  /// 数据库
  #[graphql(name = "database")]
  pub database: String,
  /// 令牌
  #[graphql(name = "token")]
  pub token: String,
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

impl FromRow<'_, MySqlRow> for TsdbAppModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;
    // ID
    let id: TsdbAppId = row.try_get("id")?;
    // 名称
    let lbl: String = row.try_get("lbl")?;
    // 类型
    let type_lbl: &str = row.try_get("type")?;
    let r#type: TsdbAppType = type_lbl.try_into()?;
    let type_lbl = String::from(type_lbl);
    // 协议
    let protocol_lbl: &str = row.try_get("protocol")?;
    let protocol: TsdbAppProtocol = protocol_lbl.try_into()?;
    let protocol_lbl = String::from(protocol_lbl);
    // 主机名
    let hostname: String = row.try_get("hostname")?;
    // 端口
    let port: i32 = row.try_get("port")?;
    // 数据库
    let database: String = row.try_get("database")?;
    // 令牌
    let token: String = row.try_get("token")?;
    // 启用
    let is_enabled: u8 = row.try_get("is_enabled")?;
    let is_enabled_lbl = is_enabled.to_string();
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
      r#type,
      type_lbl,
      protocol,
      protocol_lbl,
      hostname,
      port,
      database,
      token,
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
#[graphql(rename_fields = "snake_case", name = "TsdbAppFieldComment")]
#[allow(dead_code)]
pub struct TsdbAppFieldComment {
  /// ID
  #[graphql(name = "id")]
  pub id: String,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: String,
  /// 类型
  #[graphql(name = "type")]
  pub r#type: String,
  /// 类型
  #[graphql(name = "type_lbl")]
  pub type_lbl: String,
  /// 协议
  #[graphql(name = "protocol")]
  pub protocol: String,
  /// 协议
  #[graphql(name = "protocol_lbl")]
  pub protocol_lbl: String,
  /// 主机名
  #[graphql(name = "hostname")]
  pub hostname: String,
  /// 端口
  #[graphql(name = "port")]
  pub port: String,
  /// 数据库
  #[graphql(name = "database")]
  pub database: String,
  /// 令牌
  #[graphql(name = "token")]
  pub token: String,
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

#[derive(InputObject, Serialize, Deserialize, Default, Clone)]
#[graphql(rename_fields = "snake_case", name = "TsdbAppSearch")]
#[allow(dead_code)]
pub struct TsdbAppSearch {
  /// ID
  pub id: Option<TsdbAppId>,
  /// ID列表
  pub ids: Option<Vec<TsdbAppId>>,
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  pub is_deleted: Option<u8>,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: Option<String>,
  /// 名称
  #[graphql(name = "lbl_like")]
  pub lbl_like: Option<String>,
  /// 类型
  #[graphql(skip)]
  pub r#type: Option<Vec<TsdbAppType>>,
  /// 协议
  #[graphql(skip)]
  pub protocol: Option<Vec<TsdbAppProtocol>>,
  /// 主机名
  #[graphql(name = "hostname")]
  pub hostname: Option<String>,
  /// 主机名
  #[graphql(name = "hostname_like")]
  pub hostname_like: Option<String>,
  /// 端口
  #[graphql(skip)]
  pub port: Option<[Option<i32>; 2]>,
  /// 数据库
  #[graphql(name = "database")]
  pub database: Option<String>,
  /// 数据库
  #[graphql(name = "database_like")]
  pub database_like: Option<String>,
  /// 令牌
  #[graphql(skip)]
  pub token: Option<String>,
  /// 令牌
  #[graphql(skip)]
  pub token_like: Option<String>,
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
  #[graphql(name = "create_usr_id_is_null")]
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
  #[graphql(name = "update_usr_id_is_null")]
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

impl std::fmt::Debug for TsdbAppSearch {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("TsdbAppSearch");
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
    // 类型
    if let Some(ref r#type) = self.r#type {
      item = item.field("r#type", r#type);
    }
    // 协议
    if let Some(ref protocol) = self.protocol {
      item = item.field("protocol", protocol);
    }
    // 主机名
    if let Some(ref hostname) = self.hostname {
      item = item.field("hostname", hostname);
    }
    if let Some(ref hostname_like) = self.hostname_like {
      item = item.field("hostname_like", hostname_like);
    }
    // 端口
    if let Some(ref port) = self.port {
      item = item.field("port", port);
    }
    // 数据库
    if let Some(ref database) = self.database {
      item = item.field("database", database);
    }
    if let Some(ref database_like) = self.database_like {
      item = item.field("database_like", database_like);
    }
    // 令牌
    if let Some(ref token) = self.token {
      item = item.field("token", token);
    }
    if let Some(ref token_like) = self.token_like {
      item = item.field("token_like", token_like);
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
#[graphql(rename_fields = "snake_case", name = "TsdbAppInput")]
#[allow(dead_code)]
pub struct TsdbAppInput {
  /// ID
  pub id: Option<TsdbAppId>,
  /// 已删除
  #[graphql(skip)]
  pub is_deleted: Option<u8>,
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: Option<String>,
  /// 类型
  #[graphql(name = "type")]
  pub r#type: Option<TsdbAppType>,
  /// 类型
  #[graphql(name = "type_lbl")]
  pub type_lbl: Option<String>,
  /// 协议
  #[graphql(name = "protocol")]
  pub protocol: Option<TsdbAppProtocol>,
  /// 协议
  #[graphql(name = "protocol_lbl")]
  pub protocol_lbl: Option<String>,
  /// 主机名
  #[graphql(name = "hostname")]
  pub hostname: Option<String>,
  /// 端口
  #[graphql(name = "port")]
  pub port: Option<i32>,
  /// 数据库
  #[graphql(name = "database")]
  pub database: Option<String>,
  /// 令牌
  #[graphql(name = "token")]
  pub token: Option<String>,
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

impl std::fmt::Debug for TsdbAppInput {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("TsdbAppInput");
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
    if let Some(ref r#type) = self.r#type {
      item = item.field("r#type", r#type);
    }
    if let Some(ref protocol) = self.protocol {
      item = item.field("protocol", protocol);
    }
    if let Some(ref hostname) = self.hostname {
      item = item.field("hostname", hostname);
    }
    if let Some(ref port) = self.port {
      item = item.field("port", port);
    }
    if let Some(ref database) = self.database {
      item = item.field("database", database);
    }
    if let Some(ref token) = self.token {
      item = item.field("token", token);
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

impl From<TsdbAppModel> for TsdbAppInput {
  fn from(model: TsdbAppModel) -> Self {
    Self {
      id: model.id.into(),
      is_deleted: model.is_deleted.into(),
      tenant_id: model.tenant_id.into(),
      // 名称
      lbl: model.lbl.into(),
      // 类型
      r#type: model.r#type.into(),
      type_lbl: model.type_lbl.into(),
      // 协议
      protocol: model.protocol.into(),
      protocol_lbl: model.protocol_lbl.into(),
      // 主机名
      hostname: model.hostname.into(),
      // 端口
      port: model.port.into(),
      // 数据库
      database: model.database.into(),
      // 令牌
      token: model.token.into(),
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

impl From<TsdbAppInput> for TsdbAppSearch {
  fn from(input: TsdbAppInput) -> Self {
    Self {
      id: input.id,
      ids: None,
      // 租户ID
      tenant_id: input.tenant_id,
      is_deleted: None,
      // 名称
      lbl: input.lbl,
      // 类型
      r#type: input.r#type.map(|x| vec![x]),
      // 协议
      protocol: input.protocol.map(|x| vec![x]),
      // 主机名
      hostname: input.hostname,
      // 端口
      port: input.port.map(|x| [Some(x), Some(x)]),
      // 数据库
      database: input.database,
      // 令牌
      token: input.token,
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

crate::common::id::impl_id!(TsdbAppId);

/// 时序数据库类型
#[derive(Enum, Copy, Clone, Default, Eq, PartialEq, Serialize, Deserialize, Debug)]
pub enum TsdbAppType {
  /// influxdb3
  #[default]
  #[graphql(name="influxdb3")]
  #[serde(rename = "influxdb3")]
  Influxdb3,
}

impl fmt::Display for TsdbAppType {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    match self {
      Self::Influxdb3 => write!(f, "influxdb3"),
    }
  }
}

impl From<TsdbAppType> for String {
  fn from(value: TsdbAppType) -> Self {
    match value {
      TsdbAppType::Influxdb3 => "influxdb3".into(),
    }
  }
}

impl From<TsdbAppType> for ArgType {
  fn from(value: TsdbAppType) -> Self {
    ArgType::String(value.into())
  }
}

impl FromStr for TsdbAppType {
  type Err = color_eyre::eyre::Error;
  
  fn from_str(s: &str) -> Result<Self, Self::Err> {
    match s {
      "influxdb3" => Ok(Self::Influxdb3),
      _ => Err(eyre!("{s} 无法转换到 类型")),
    }
  }
}

impl TryFrom<&str> for TsdbAppType {
  type Error = sqlx::Error;
  
  fn try_from(s: &str) -> Result<Self, sqlx::Error> {
    match s {
      "influxdb3" => Ok(Self::Influxdb3),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "type".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "{s} 无法转换到 类型".to_owned(),
          )),
        }),
      )),
    }
  }
}

impl TsdbAppType {
  pub fn as_str(&self) -> &str {
    match self {
      Self::Influxdb3 => "influxdb3",
    }
  }
}

impl TryFrom<String> for TsdbAppType {
  type Error = sqlx::Error;
  
  fn try_from(s: String) -> Result<Self, sqlx::Error> {
    match s.as_str() {
      "influxdb3" => Ok(Self::Influxdb3),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "type".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "{s} 无法转换到 类型".to_owned(),
          )),
        }),
      )),
    }
  }
}

/// 时序数据库协议
#[derive(Enum, Copy, Clone, Default, Eq, PartialEq, Serialize, Deserialize, Debug)]
pub enum TsdbAppProtocol {
  /// https
  #[default]
  #[graphql(name="https")]
  #[serde(rename = "https")]
  Https,
  /// http
  #[graphql(name="http")]
  #[serde(rename = "http")]
  Http,
}

impl fmt::Display for TsdbAppProtocol {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    match self {
      Self::Https => write!(f, "https"),
      Self::Http => write!(f, "http"),
    }
  }
}

impl From<TsdbAppProtocol> for String {
  fn from(value: TsdbAppProtocol) -> Self {
    match value {
      TsdbAppProtocol::Https => "https".into(),
      TsdbAppProtocol::Http => "http".into(),
    }
  }
}

impl From<TsdbAppProtocol> for ArgType {
  fn from(value: TsdbAppProtocol) -> Self {
    ArgType::String(value.into())
  }
}

impl FromStr for TsdbAppProtocol {
  type Err = color_eyre::eyre::Error;
  
  fn from_str(s: &str) -> Result<Self, Self::Err> {
    match s {
      "https" => Ok(Self::Https),
      "http" => Ok(Self::Http),
      _ => Err(eyre!("{s} 无法转换到 协议")),
    }
  }
}

impl TryFrom<&str> for TsdbAppProtocol {
  type Error = sqlx::Error;
  
  fn try_from(s: &str) -> Result<Self, sqlx::Error> {
    match s {
      "https" => Ok(Self::Https),
      "http" => Ok(Self::Http),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "protocol".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "{s} 无法转换到 协议".to_owned(),
          )),
        }),
      )),
    }
  }
}

impl TsdbAppProtocol {
  pub fn as_str(&self) -> &str {
    match self {
      Self::Https => "https",
      Self::Http => "http",
    }
  }
}

impl TryFrom<String> for TsdbAppProtocol {
  type Error = sqlx::Error;
  
  fn try_from(s: String) -> Result<Self, sqlx::Error> {
    match s.as_str() {
      "https" => Ok(Self::Https),
      "http" => Ok(Self::Http),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "protocol".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "{s} 无法转换到 协议".to_owned(),
          )),
        }),
      )),
    }
  }
}

/// 时序数据库 检测字段是否允许前端排序
pub fn check_sort_tsdb_app(
  sort: Option<&[SortInput]>,
) -> Result<()> {
  
  if sort.is_none() {
    return Ok(());
  }
  
  let sort = sort.unwrap_or_default();
  
  if sort.is_empty() {
    return Ok(());
  }
  
  let get_can_sort_in_api_tsdb_app = get_can_sort_in_api_tsdb_app();
  
  for item in sort {
    let prop = item.prop.as_str();
    if prop.is_empty() {
      continue;
    }
    if !get_can_sort_in_api_tsdb_app.contains(&prop) {
      return Err(eyre!(ServiceException {
        message: format!("check_sort_tsdb_app: {}", serde_json::to_string(item)?),
        trace: true,
        ..Default::default()
      }));
    }
  }
  
  Ok(())
}

// MARK: get_page_path_tsdb_app
pub fn get_page_path_tsdb_app() -> &'static str {
  "/tsdb/tsdb_app"
}

// MARK: get_table_name_tsdb_app
pub fn get_table_name_tsdb_app() -> &'static str {
  "tsdb_tsdb_app"
}
