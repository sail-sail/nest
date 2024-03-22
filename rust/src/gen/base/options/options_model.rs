
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
use crate::gen::base::usr::usr_model::UsrId;

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct OptionsModel {
  /// 系统字段
  #[graphql(skip)]
  pub is_sys: u8,
  /// ID
  pub id: OptionsId,
  /// 名称
  pub lbl: String,
  /// 键
  pub ky: String,
  /// 值
  pub val: String,
  /// 锁定
  pub is_locked: u8,
  /// 锁定
  pub is_locked_lbl: String,
  /// 启用
  pub is_enabled: u8,
  /// 启用
  pub is_enabled_lbl: String,
  /// 排序
  pub order_by: u32,
  /// 备注
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
  /// 版本号
  pub version: u32,
}

impl FromRow<'_, MySqlRow> for OptionsModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 系统记录
    let is_sys = row.try_get("is_sys")?;
    // 版本号
    let version = row.try_get("version")?;
    // ID
    let id: OptionsId = row.try_get("id")?;
    // 名称
    let lbl: String = row.try_get("lbl")?;
    // 键
    let ky: String = row.try_get("ky")?;
    // 值
    let val: String = row.try_get("val")?;
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
      is_sys,
      version,
      is_deleted,
      id,
      lbl,
      ky,
      val,
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
pub struct OptionsFieldComment {
  /// ID
  pub id: String,
  /// 名称
  pub lbl: String,
  /// 键
  pub ky: String,
  /// 值
  pub val: String,
  /// 锁定
  pub is_locked: String,
  /// 锁定
  pub is_locked_lbl: String,
  /// 启用
  pub is_enabled: String,
  /// 启用
  pub is_enabled_lbl: String,
  /// 排序
  pub order_by: String,
  /// 备注
  pub rem: String,
  /// 创建人
  pub create_usr_id: String,
  /// 创建人
  pub create_usr_id_lbl: String,
  /// 创建时间
  pub create_time: String,
  /// 创建时间
  pub create_time_lbl: String,
  /// 更新人
  pub update_usr_id: String,
  /// 更新人
  pub update_usr_id_lbl: String,
  /// 更新时间
  pub update_time: String,
  /// 更新时间
  pub update_time_lbl: String,
}

#[derive(InputObject, Default)]
#[graphql(rename_fields = "snake_case")]
pub struct OptionsSearch {
  /// ID
  pub id: Option<OptionsId>,
  /// ID列表
  pub ids: Option<Vec<OptionsId>>,
  pub is_deleted: Option<u8>,
  /// 名称
  pub lbl: Option<String>,
  /// 名称
  pub lbl_like: Option<String>,
  /// 键
  pub ky: Option<String>,
  /// 键
  pub ky_like: Option<String>,
  /// 值
  pub val: Option<String>,
  /// 值
  pub val_like: Option<String>,
  /// 锁定
  pub is_locked: Option<Vec<u8>>,
  /// 启用
  pub is_enabled: Option<Vec<u8>>,
  /// 排序
  pub order_by: Option<Vec<Option<u32>>>,
  /// 备注
  pub rem: Option<String>,
  /// 备注
  pub rem_like: Option<String>,
  /// 创建人
  pub create_usr_id: Option<Vec<UsrId>>,
  /// 创建人
  pub create_usr_id_is_null: Option<bool>,
  /// 创建时间
  pub create_time: Option<Vec<Option<chrono::NaiveDateTime>>>,
  /// 更新人
  pub update_usr_id: Option<Vec<UsrId>>,
  /// 更新人
  pub update_usr_id_is_null: Option<bool>,
  /// 更新时间
  pub update_time: Option<Vec<Option<chrono::NaiveDateTime>>>,
}

impl std::fmt::Debug for OptionsSearch {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("OptionsSearch");
    if let Some(ref id) = self.id {
      item = item.field("id", id);
    }
    if let Some(ref ids) = self.ids {
      item = item.field("ids", ids);
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
    // 键
    if let Some(ref ky) = self.ky {
      item = item.field("ky", ky);
    }
    if let Some(ref ky_like) = self.ky_like {
      item = item.field("ky_like", ky_like);
    }
    // 值
    if let Some(ref val) = self.val {
      item = item.field("val", val);
    }
    if let Some(ref val_like) = self.val_like {
      item = item.field("val_like", val_like);
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
#[graphql(rename_fields = "snake_case")]
pub struct OptionsInput {
  /// ID
  pub id: Option<OptionsId>,
  #[graphql(skip)]
  pub is_deleted: Option<u8>,
  /// 系统记录
  #[graphql(skip)]
  pub is_sys: Option<u8>,
  /// 名称
  pub lbl: Option<String>,
  /// 键
  pub ky: Option<String>,
  /// 值
  pub val: Option<String>,
  /// 锁定
  pub is_locked: Option<u8>,
  /// 锁定
  pub is_locked_lbl: Option<String>,
  /// 启用
  pub is_enabled: Option<u8>,
  /// 启用
  pub is_enabled_lbl: Option<String>,
  /// 排序
  pub order_by: Option<u32>,
  /// 备注
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
  /// 版本号
  pub version: Option<u32>,
}

impl From<OptionsModel> for OptionsInput {
  fn from(model: OptionsModel) -> Self {
    Self {
      id: model.id.into(),
      is_deleted: model.is_deleted.into(),
      is_sys: model.is_sys.into(),
      version: model.version.into(),
      // 名称
      lbl: model.lbl.into(),
      // 键
      ky: model.ky.into(),
      // 值
      val: model.val.into(),
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
      // 更新人
      update_usr_id: model.update_usr_id.into(),
      update_usr_id_lbl: model.update_usr_id_lbl.into(),
      // 更新时间
      update_time: model.update_time,
      update_time_lbl: model.update_time_lbl.into(),
    }
  }
}

impl From<OptionsInput> for OptionsSearch {
  fn from(input: OptionsInput) -> Self {
    Self {
      id: input.id,
      ids: None,
      is_deleted: None,
      // 名称
      lbl: input.lbl,
      // 键
      ky: input.ky,
      // 值
      val: input.val,
      // 锁定
      is_locked: input.is_locked.map(|x| vec![x]),
      // 启用
      is_enabled: input.is_enabled.map(|x| vec![x]),
      // 排序
      order_by: input.order_by.map(|x| vec![Some(x), Some(x)]),
      // 备注
      rem: input.rem,
      // 创建人
      create_usr_id: input.create_usr_id.map(|x| vec![x]),
      // 创建时间
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
pub struct OptionsId(SmolStr);

impl fmt::Display for OptionsId {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(f, "{}", self.0)
  }
}

#[async_graphql::Scalar(name = "OptionsId")]
impl async_graphql::ScalarType for OptionsId {
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

impl From<OptionsId> for ArgType {
  fn from(value: OptionsId) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl From<&OptionsId> for ArgType {
  fn from(value: &OptionsId) -> Self {
    ArgType::SmolStr(value.clone().into())
  }
}

impl From<OptionsId> for SmolStr {
  fn from(id: OptionsId) -> Self {
    id.0
  }
}

impl From<SmolStr> for OptionsId {
  fn from(s: SmolStr) -> Self {
    Self(s)
  }
}

impl From<&SmolStr> for OptionsId {
  fn from(s: &SmolStr) -> Self {
    Self(s.clone())
  }
}

impl From<String> for OptionsId {
  fn from(s: String) -> Self {
    Self(s.into())
  }
}

impl From<&str> for OptionsId {
  fn from(s: &str) -> Self {
    Self(s.into())
  }
}

impl Deref for OptionsId {
  type Target = SmolStr;
  
  fn deref(&self) -> &SmolStr {
    &self.0
  }
}

impl Encode<'_, MySql> for OptionsId {
  fn encode_by_ref(&self, buf: &mut Vec<u8>) -> IsNull {
    <&str as Encode<MySql>>::encode(self.as_str(), buf)
  }
  
  fn size_hint(&self) -> usize {
    self.len()
  }
}

impl sqlx::Type<MySql> for OptionsId {
  fn type_info() -> <MySql as sqlx::Database>::TypeInfo {
    <&str as sqlx::Type<MySql>>::type_info()
  }
  
  fn compatible(ty: &<MySql as sqlx::Database>::TypeInfo) -> bool {
    <&str as sqlx::Type<MySql>>::compatible(ty)
  }
}

impl<'r> sqlx::Decode<'r, MySql> for OptionsId {
  fn decode(
    value: <MySql as sqlx::database::HasValueRef>::ValueRef,
  ) -> Result<Self, sqlx::error::BoxDynError> {
    <&str as sqlx::Decode<MySql>>::decode(value).map(Self::from)
  }
}
