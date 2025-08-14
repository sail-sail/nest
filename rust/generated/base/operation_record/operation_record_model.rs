
#![allow(clippy::clone_on_copy)]
#![allow(clippy::redundant_clone)]
#![allow(clippy::collapsible_if)]
#![allow(clippy::len_zero)]

use std::fmt;
#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use std::str::FromStr;
use std::sync::OnceLock;

use serde::{Serialize, Deserialize};

use color_eyre::eyre::{Result, eyre};

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

use crate::base::tenant::tenant_model::TenantId;
use crate::base::usr::usr_model::UsrId;

static CAN_SORT_IN_API_OPERATION_RECORD: OnceLock<[&'static str; 2]> = OnceLock::new();

/// 操作记录 前端允许排序的字段
fn get_can_sort_in_api_operation_record() -> &'static [&'static str; 2] {
  CAN_SORT_IN_API_OPERATION_RECORD.get_or_init(|| [
    "create_time",
    "update_time",
  ])
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "OperationRecordModel")]
#[allow(dead_code)]
pub struct OperationRecordModel {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: TenantId,
  /// ID
  pub id: OperationRecordId,
  /// 模块
  #[graphql(name = "module")]
  pub module: String,
  /// 模块名称
  #[graphql(name = "module_lbl")]
  pub module_lbl: String,
  /// 方法
  #[graphql(name = "method")]
  pub method: String,
  /// 方法名称
  #[graphql(name = "method_lbl")]
  pub method_lbl: String,
  /// 操作
  #[graphql(name = "lbl")]
  pub lbl: String,
  /// 耗时(毫秒)
  #[graphql(name = "time")]
  pub time: u32,
  /// 操作前数据
  #[graphql(name = "old_data")]
  pub old_data: Option<String>,
  /// 操作后数据
  #[graphql(name = "new_data")]
  pub new_data: Option<String>,
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
  #[graphql(skip)]
  pub update_usr_id: UsrId,
  /// 更新人
  #[graphql(skip)]
  pub update_usr_id_lbl: String,
  /// 更新时间
  #[graphql(skip)]
  pub update_time: Option<chrono::NaiveDateTime>,
  /// 更新时间
  #[graphql(skip)]
  pub update_time_lbl: String,
}

impl FromRow<'_, MySqlRow> for OperationRecordModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;
    // ID
    let id: OperationRecordId = row.try_get("id")?;
    // 模块
    let module: String = row.try_get("module")?;
    // 模块名称
    let module_lbl: String = row.try_get("module_lbl")?;
    // 方法
    let method: String = row.try_get("method")?;
    // 方法名称
    let method_lbl: String = row.try_get("method_lbl")?;
    // 操作
    let lbl: String = row.try_get("lbl")?;
    // 耗时(毫秒)
    let time: u32 = row.try_get("time")?;
    // 操作前数据
    let old_data: Option<String> = row.try_get("old_data")?;
    // 操作后数据
    let new_data: Option<String> = row.try_get("new_data")?;
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
      module,
      module_lbl,
      method,
      method_lbl,
      lbl,
      time,
      old_data,
      new_data,
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
#[graphql(rename_fields = "snake_case", name = "OperationRecordFieldComment")]
#[allow(dead_code)]
pub struct OperationRecordFieldComment {
  /// ID
  #[graphql(name = "id")]
  pub id: String,
  /// 模块
  #[graphql(name = "module")]
  pub module: String,
  /// 模块名称
  #[graphql(name = "module_lbl")]
  pub module_lbl: String,
  /// 方法
  #[graphql(name = "method")]
  pub method: String,
  /// 方法名称
  #[graphql(name = "method_lbl")]
  pub method_lbl: String,
  /// 操作
  #[graphql(name = "lbl")]
  pub lbl: String,
  /// 耗时(毫秒)
  #[graphql(name = "time")]
  pub time: String,
  /// 操作前数据
  #[graphql(name = "old_data")]
  pub old_data: String,
  /// 操作后数据
  #[graphql(name = "new_data")]
  pub new_data: String,
  /// 操作人
  #[graphql(name = "create_usr_id")]
  pub create_usr_id: String,
  /// 操作人
  #[graphql(name = "create_usr_id_lbl")]
  pub create_usr_id_lbl: String,
  /// 操作时间
  #[graphql(name = "create_time")]
  pub create_time: String,
  /// 操作时间
  #[graphql(name = "create_time_lbl")]
  pub create_time_lbl: String,
}

#[derive(InputObject, Default)]
#[graphql(rename_fields = "snake_case", name = "OperationRecordSearch")]
#[allow(dead_code)]
pub struct OperationRecordSearch {
  /// ID
  pub id: Option<OperationRecordId>,
  /// ID列表
  pub ids: Option<Vec<OperationRecordId>>,
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  pub is_deleted: Option<u8>,
  /// 模块
  #[graphql(skip)]
  pub module: Option<String>,
  /// 模块
  #[graphql(skip)]
  pub module_like: Option<String>,
  /// 模块名称
  #[graphql(name = "module_lbl")]
  pub module_lbl: Option<String>,
  /// 模块名称
  #[graphql(name = "module_lbl_like")]
  pub module_lbl_like: Option<String>,
  /// 方法
  #[graphql(skip)]
  pub method: Option<String>,
  /// 方法
  #[graphql(skip)]
  pub method_like: Option<String>,
  /// 方法名称
  #[graphql(name = "method_lbl")]
  pub method_lbl: Option<String>,
  /// 方法名称
  #[graphql(name = "method_lbl_like")]
  pub method_lbl_like: Option<String>,
  /// 操作
  #[graphql(name = "lbl")]
  pub lbl: Option<String>,
  /// 操作
  #[graphql(name = "lbl_like")]
  pub lbl_like: Option<String>,
  /// 耗时(毫秒)
  #[graphql(skip)]
  pub time: Option<[Option<u32>; 2]>,
  /// 操作前数据
  #[graphql(skip)]
  pub old_data: Option<String>,
  /// 操作前数据
  #[graphql(skip)]
  pub old_data_like: Option<String>,
  /// 操作后数据
  #[graphql(skip)]
  pub new_data: Option<String>,
  /// 操作后数据
  #[graphql(skip)]
  pub new_data_like: Option<String>,
  /// 操作人
  #[graphql(name = "create_usr_id")]
  pub create_usr_id: Option<Vec<UsrId>>,
  /// 操作人
  #[graphql(name = "create_usr_id_save_null")]
  pub create_usr_id_is_null: Option<bool>,
  /// 操作人
  #[graphql(name = "create_usr_id_lbl")]
  pub create_usr_id_lbl: Option<Vec<String>>,
  /// 操作人
  #[graphql(name = "create_usr_id_lbl_like")]
  pub create_usr_id_lbl_like: Option<String>,
  /// 操作时间
  #[graphql(name = "create_time")]
  pub create_time: Option<[Option<chrono::NaiveDateTime>; 2]>,
  /// 更新人
  #[graphql(skip)]
  pub update_usr_id: Option<Vec<UsrId>>,
  /// 更新人
  #[graphql(skip)]
  pub update_usr_id_is_null: Option<bool>,
  /// 更新人
  #[graphql(skip)]
  pub update_usr_id_lbl: Option<Vec<String>>,
  /// 更新人
  #[graphql(skip)]
  pub update_usr_id_lbl_like: Option<String>,
  /// 更新时间
  #[graphql(skip)]
  pub update_time: Option<[Option<chrono::NaiveDateTime>; 2]>,
}

impl std::fmt::Debug for OperationRecordSearch {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("OperationRecordSearch");
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
    // 模块
    if let Some(ref module) = self.module {
      item = item.field("module", module);
    }
    if let Some(ref module_like) = self.module_like {
      item = item.field("module_like", module_like);
    }
    // 模块名称
    if let Some(ref module_lbl) = self.module_lbl {
      item = item.field("module_lbl", module_lbl);
    }
    if let Some(ref module_lbl_like) = self.module_lbl_like {
      item = item.field("module_lbl_like", module_lbl_like);
    }
    // 方法
    if let Some(ref method) = self.method {
      item = item.field("method", method);
    }
    if let Some(ref method_like) = self.method_like {
      item = item.field("method_like", method_like);
    }
    // 方法名称
    if let Some(ref method_lbl) = self.method_lbl {
      item = item.field("method_lbl", method_lbl);
    }
    if let Some(ref method_lbl_like) = self.method_lbl_like {
      item = item.field("method_lbl_like", method_lbl_like);
    }
    // 操作
    if let Some(ref lbl) = self.lbl {
      item = item.field("lbl", lbl);
    }
    if let Some(ref lbl_like) = self.lbl_like {
      item = item.field("lbl_like", lbl_like);
    }
    // 耗时(毫秒)
    if let Some(ref time) = self.time {
      item = item.field("time", time);
    }
    // 操作前数据
    if let Some(ref old_data) = self.old_data {
      item = item.field("old_data", old_data);
    }
    if let Some(ref old_data_like) = self.old_data_like {
      item = item.field("old_data_like", old_data_like);
    }
    // 操作后数据
    if let Some(ref new_data) = self.new_data {
      item = item.field("new_data", new_data);
    }
    if let Some(ref new_data_like) = self.new_data_like {
      item = item.field("new_data_like", new_data_like);
    }
    // 操作人
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
    // 操作时间
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

#[derive(InputObject, Default, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "OperationRecordInput")]
#[allow(dead_code)]
pub struct OperationRecordInput {
  /// ID
  pub id: Option<OperationRecordId>,
  /// 已删除
  #[graphql(skip)]
  pub is_deleted: Option<u8>,
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  /// 模块
  #[graphql(name = "module")]
  pub module: Option<String>,
  /// 模块名称
  #[graphql(name = "module_lbl")]
  pub module_lbl: Option<String>,
  /// 方法
  #[graphql(name = "method")]
  pub method: Option<String>,
  /// 方法名称
  #[graphql(name = "method_lbl")]
  pub method_lbl: Option<String>,
  /// 操作
  #[graphql(name = "lbl")]
  pub lbl: Option<String>,
  /// 耗时(毫秒)
  #[graphql(name = "time")]
  pub time: Option<u32>,
  /// 操作前数据
  #[graphql(name = "old_data")]
  pub old_data: Option<String>,
  /// 操作后数据
  #[graphql(name = "new_data")]
  pub new_data: Option<String>,
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

impl From<OperationRecordModel> for OperationRecordInput {
  fn from(model: OperationRecordModel) -> Self {
    Self {
      id: model.id.into(),
      is_deleted: model.is_deleted.into(),
      tenant_id: model.tenant_id.into(),
      // 模块
      module: model.module.into(),
      // 模块名称
      module_lbl: model.module_lbl.into(),
      // 方法
      method: model.method.into(),
      // 方法名称
      method_lbl: model.method_lbl.into(),
      // 操作
      lbl: model.lbl.into(),
      // 耗时(毫秒)
      time: model.time.into(),
      // 操作前数据
      old_data: model.old_data,
      // 操作后数据
      new_data: model.new_data,
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

impl From<OperationRecordInput> for OperationRecordSearch {
  fn from(input: OperationRecordInput) -> Self {
    Self {
      id: input.id,
      ids: None,
      // 租户ID
      tenant_id: input.tenant_id,
      is_deleted: None,
      // 模块
      module: input.module,
      // 模块名称
      module_lbl: input.module_lbl,
      // 方法
      method: input.method,
      // 方法名称
      method_lbl: input.method_lbl,
      // 操作
      lbl: input.lbl,
      // 耗时(毫秒)
      time: input.time.map(|x| [Some(x), Some(x)]),
      // 操作前数据
      old_data: input.old_data,
      // 操作后数据
      new_data: input.new_data,
      // 操作人
      create_usr_id: input.create_usr_id.map(|x| vec![x]),
      // 操作人
      create_usr_id_lbl: input.create_usr_id_lbl.map(|x| vec![x]),
      // 操作时间
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

#[derive(Default, Clone, Copy, PartialEq, Eq, Hash)]
pub struct OperationRecordId([u8; 22]);

impl Serialize for OperationRecordId {
  fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
  where
    S: serde::Serializer,
  {
    match std::str::from_utf8(&self.0) {
      Ok(s) => serializer.serialize_str(s),
      Err(_) => serializer.serialize_str("")
    }
  }
}

impl<'de> Deserialize<'de> for OperationRecordId {
  fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
  where
    D: serde::Deserializer<'de>,
  {
    let s = String::deserialize(deserializer)?;
    Ok(s.as_str().into())
  }
}

impl fmt::Debug for OperationRecordId {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    match std::str::from_utf8(&self.0) {
      Ok(s) => write!(f, "OperationRecordId({s})"),
      Err(_) => write!(f, "OperationRecordId()")
    }
  }
}

impl fmt::Display for OperationRecordId {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    match std::str::from_utf8(&self.0) {
      Ok(s) => write!(f, "{s}"),
      Err(_) => write!(f, "")
    }
  }
}

#[async_graphql::Scalar(name = "OperationRecordId")]
impl async_graphql::ScalarType for OperationRecordId {
  fn parse(value: async_graphql::Value) -> async_graphql::InputValueResult<Self> {
    match value {
      async_graphql::Value::String(s) => {
        let bytes = s.as_bytes();
        if bytes.len() == 0 {
          return Ok(Self([0u8; 22]));
        }
        if bytes.len() != 22 {
          return Err(async_graphql::InputValueError::custom("OperationRecordId must be 22 bytes string or empty"));
        }
        let mut arr = [0u8; 22];
        arr.copy_from_slice(bytes);
        Ok(Self(arr))
      },
      _ => Err(async_graphql::InputValueError::expected_type(value)),
    }
  }
  
  fn to_value(&self) -> async_graphql::Value {
    let s = std::str::from_utf8(&self.0).unwrap_or("");
    async_graphql::Value::String(s.into())
  }
}

impl From<OperationRecordId> for ArgType {
  fn from(value: OperationRecordId) -> Self {
    value.to_string().into()
  }
}

impl From<&OperationRecordId> for ArgType {
  fn from(value: &OperationRecordId) -> Self {
    value.to_string().into()
  }
}

impl From<OperationRecordId> for SmolStr {
  fn from(id: OperationRecordId) -> Self {
    std::str::from_utf8(&id.0).unwrap_or("").into()
  }
}

impl From<SmolStr> for OperationRecordId {
  fn from(s: SmolStr) -> Self {
    s.as_str().into()
  }
}

impl From<&SmolStr> for OperationRecordId {
  fn from(s: &SmolStr) -> Self {
    s.as_str().into()
  }
}

impl From<String> for OperationRecordId {
  fn from(s: String) -> Self {
    s.as_str().into()
  }
}

impl From<[u8; 22]> for OperationRecordId {
  fn from(arr: [u8; 22]) -> Self {
    Self(arr)
  }
}

impl From<&[u8; 22]> for OperationRecordId {
  fn from(arr: &[u8; 22]) -> Self {
    Self(*arr)
  }
}

impl From<OperationRecordId> for [u8; 22] {
  fn from(id: OperationRecordId) -> Self {
    id.0
  }
}

impl From<&str> for OperationRecordId {
  fn from(s: &str) -> Self {
    let bytes = s.as_bytes();
    let mut arr = [0u8; 22];
    if bytes.len() == 22 {
      arr.copy_from_slice(bytes);
    }
    Self(arr)
  }
}

impl OperationRecordId {
  pub fn as_str(&self) -> &str {
    std::str::from_utf8(&self.0).unwrap_or("")
  }
  
  pub fn is_empty(&self) -> bool {
    self.0 == [0u8; 22]
  }
}

impl Encode<'_, MySql> for OperationRecordId {
  fn encode_by_ref(&self, buf: &mut Vec<u8>) -> sqlx::Result<IsNull, BoxDynError> {
    buf.extend_from_slice(&self.0);
    Ok(IsNull::No)
  }
  
  fn size_hint(&self) -> usize {
    22
  }
}

impl sqlx::Type<MySql> for OperationRecordId {
  fn type_info() -> <MySql as sqlx::Database>::TypeInfo {
    <&[u8] as sqlx::Type<MySql>>::type_info()
  }
  
  fn compatible(ty: &<MySql as sqlx::Database>::TypeInfo) -> bool {
    <&[u8] as sqlx::Type<MySql>>::compatible(ty)
  }
}

impl<'r> sqlx::Decode<'r, MySql> for OperationRecordId {
  fn decode(
    value: MySqlValueRef<'r>,
  ) -> Result<Self, BoxDynError> {
    let bytes: &[u8] = <&[u8] as sqlx::Decode<MySql>>::decode(value)?;
    let mut arr = [0u8; 22];
    if bytes.len() == 22 {
      arr.copy_from_slice(bytes);
    } else if bytes.len() > 22 {
      return Err("OperationRecordId must be 22 bytes".into());
    }
    Ok(Self(arr))
  }
}

impl PartialEq<str> for OperationRecordId {
  fn eq(&self, other: &str) -> bool {
    let bytes = other.as_bytes();
    self.0 == bytes
  }
}

/// 操作记录 检测字段是否允许前端排序
pub fn check_sort_operation_record(
  sort: Option<&[SortInput]>,
) -> Result<()> {
  
  if sort.is_none() {
    return Ok(());
  }
  let sort = sort.unwrap();
  
  let get_can_sort_in_api_operation_record = get_can_sort_in_api_operation_record();
  
  for item in sort {
    let prop = item.prop.as_str();
    if prop.is_empty() {
      continue;
    }
    if !get_can_sort_in_api_operation_record.contains(&prop) {
      return Err(eyre!("check_sort_operation_record: {}", serde_json::to_string(item)?));
    }
  }
  
  Ok(())
}

/// 获取路由地址
#[allow(dead_code)]
pub fn get_route_path_operation_record() -> String {
  "/base/operation_record".to_owned()
}
