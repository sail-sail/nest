
use std::fmt;
use std::ops::Deref;
#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use std::str::FromStr;
use serde::{Serialize, Deserialize};

use sqlx::encode::{Encode, IsNull};
use sqlx::MySql;
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

use crate::gen::base::tenant::tenant_model::TenantId;
use crate::gen::base::usr::usr_model::UsrId;

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct OperationRecordModel {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: TenantId,
  /// ID
  pub id: OperationRecordId,
  /// 模块
  pub module: String,
  /// 模块名称
  pub module_lbl: String,
  /// 方法
  pub method: String,
  /// 方法名称
  pub method_lbl: String,
  /// 操作
  pub lbl: String,
  /// 耗时(毫秒)
  pub time: u32,
  /// 操作前数据
  pub old_data: Option<String>,
  /// 操作后数据
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
      None => "".to_owned(),
    };
    // 更新人
    let update_usr_id: UsrId = row.try_get("update_usr_id")?;
    let update_usr_id_lbl: Option<String> = row.try_get("update_usr_id_lbl")?;
    let update_usr_id_lbl = update_usr_id_lbl.unwrap_or_default();
    // 更新时间
    let update_time: Option<chrono::NaiveDateTime> = row.try_get("update_time")?;
    let update_time_lbl: String = match update_time {
      Some(item) => item.format("%Y-%m-%d %H:%M:%S").to_string(),
      None => "".to_owned(),
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
#[graphql(rename_fields = "snake_case")]
pub struct OperationRecordFieldComment {
  /// ID
  pub id: String,
  /// 模块
  pub module: String,
  /// 模块名称
  pub module_lbl: String,
  /// 方法
  pub method: String,
  /// 方法名称
  pub method_lbl: String,
  /// 操作
  pub lbl: String,
  /// 耗时(毫秒)
  pub time: String,
  /// 操作前数据
  pub old_data: String,
  /// 操作后数据
  pub new_data: String,
  /// 操作人
  pub create_usr_id: String,
  /// 操作人
  pub create_usr_id_lbl: String,
  /// 操作时间
  pub create_time: String,
  /// 操作时间
  pub create_time_lbl: String,
  /// 更新人
  #[graphql(skip)]
  pub update_usr_id: String,
  /// 更新人
  #[graphql(skip)]
  pub update_usr_id_lbl: String,
  /// 更新时间
  #[graphql(skip)]
  pub update_time: String,
  /// 更新时间
  #[graphql(skip)]
  pub update_time_lbl: String,
}

#[derive(InputObject, Default)]
#[graphql(rename_fields = "snake_case")]
pub struct OperationRecordSearch {
  /// ID
  pub id: Option<OperationRecordId>,
  /// ID列表
  pub ids: Option<Vec<OperationRecordId>>,
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  pub is_deleted: Option<u8>,
  /// 模块
  pub module: Option<String>,
  /// 模块
  pub module_like: Option<String>,
  /// 模块名称
  pub module_lbl: Option<String>,
  /// 模块名称
  pub module_lbl_like: Option<String>,
  /// 方法
  pub method: Option<String>,
  /// 方法
  pub method_like: Option<String>,
  /// 方法名称
  pub method_lbl: Option<String>,
  /// 方法名称
  pub method_lbl_like: Option<String>,
  /// 操作
  pub lbl: Option<String>,
  /// 操作
  pub lbl_like: Option<String>,
  /// 耗时(毫秒)
  pub time: Option<Vec<Option<u32>>>,
  /// 操作前数据
  pub old_data: Option<String>,
  /// 操作前数据
  pub old_data_like: Option<String>,
  /// 操作后数据
  pub new_data: Option<String>,
  /// 操作后数据
  pub new_data_like: Option<String>,
  /// 操作人
  pub create_usr_id: Option<Vec<UsrId>>,
  /// 操作人
  pub create_usr_id_is_null: Option<bool>,
  /// 操作时间
  pub create_time: Option<Vec<Option<chrono::NaiveDateTime>>>,
  /// 更新人
  #[graphql(skip)]
  pub update_usr_id: Option<Vec<UsrId>>,
  /// 更新人
  #[graphql(skip)]
  pub update_usr_id_is_null: Option<bool>,
  /// 更新时间
  #[graphql(skip)]
  pub update_time: Option<Vec<Option<chrono::NaiveDateTime>>>,
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
#[graphql(rename_fields = "snake_case")]
pub struct OperationRecordInput {
  /// ID
  pub id: Option<OperationRecordId>,
  #[graphql(skip)]
  pub is_deleted: Option<u8>,
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  /// 模块
  pub module: Option<String>,
  /// 模块名称
  pub module_lbl: Option<String>,
  /// 方法
  pub method: Option<String>,
  /// 方法名称
  pub method_lbl: Option<String>,
  /// 操作
  pub lbl: Option<String>,
  /// 耗时(毫秒)
  pub time: Option<u32>,
  /// 操作前数据
  pub old_data: Option<String>,
  /// 操作后数据
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
      // 更新人
      update_usr_id: model.update_usr_id.into(),
      update_usr_id_lbl: model.update_usr_id_lbl.into(),
      // 更新时间
      update_time: model.update_time,
      update_time_lbl: model.update_time_lbl.into(),
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
      time: input.time.map(|x| vec![Some(x), Some(x)]),
      // 操作前数据
      old_data: input.old_data,
      // 操作后数据
      new_data: input.new_data,
      // 操作人
      create_usr_id: input.create_usr_id.map(|x| vec![x]),
      // 操作时间
      create_time: input.create_time.map(|x| vec![Some(x), Some(x)]),
      // 更新人
      update_usr_id: input.update_usr_id.map(|x| vec![x]),
      // 更新时间
      update_time: input.update_time.map(|x| vec![Some(x), Some(x)]),
      ..Default::default()
    }
  }
}

#[derive(Default, Serialize, Deserialize, Clone, Debug, PartialEq, Eq, Hash)]
pub struct OperationRecordId(SmolStr);

impl fmt::Display for OperationRecordId {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(f, "{}", self.0)
  }
}

#[async_graphql::Scalar(name = "OperationRecordId")]
impl async_graphql::ScalarType for OperationRecordId {
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

impl From<OperationRecordId> for ArgType {
  fn from(value: OperationRecordId) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl From<&OperationRecordId> for ArgType {
  fn from(value: &OperationRecordId) -> Self {
    ArgType::SmolStr(value.clone().into())
  }
}

impl From<OperationRecordId> for SmolStr {
  fn from(id: OperationRecordId) -> Self {
    id.0
  }
}

impl From<SmolStr> for OperationRecordId {
  fn from(s: SmolStr) -> Self {
    Self(s)
  }
}

impl From<&SmolStr> for OperationRecordId {
  fn from(s: &SmolStr) -> Self {
    Self(s.clone())
  }
}

impl From<String> for OperationRecordId {
  fn from(s: String) -> Self {
    Self(s.into())
  }
}

impl From<&str> for OperationRecordId {
  fn from(s: &str) -> Self {
    Self(s.into())
  }
}

impl Deref for OperationRecordId {
  type Target = SmolStr;
  
  fn deref(&self) -> &SmolStr {
    &self.0
  }
}

impl Encode<'_, MySql> for OperationRecordId {
  fn encode_by_ref(&self, buf: &mut Vec<u8>) -> IsNull {
    <&str as Encode<MySql>>::encode(self.as_str(), buf)
  }
  
  fn size_hint(&self) -> usize {
    self.len()
  }
}

impl sqlx::Type<MySql> for OperationRecordId {
  fn type_info() -> <MySql as sqlx::Database>::TypeInfo {
    <&str as sqlx::Type<MySql>>::type_info()
  }
  
  fn compatible(ty: &<MySql as sqlx::Database>::TypeInfo) -> bool {
    <&str as sqlx::Type<MySql>>::compatible(ty)
  }
}

impl<'r> sqlx::Decode<'r, MySql> for OperationRecordId {
  fn decode(
    value: <MySql as sqlx::database::HasValueRef>::ValueRef,
  ) -> Result<Self, sqlx::error::BoxDynError> {
    <&str as sqlx::Decode<MySql>>::decode(value).map(Self::from)
  }
}

impl PartialEq<str> for OperationRecordId {
  fn eq(&self, other: &str) -> bool {
    self.0 == other
  }
}
