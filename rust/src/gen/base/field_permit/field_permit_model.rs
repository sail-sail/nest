
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
use crate::gen::base::menu::menu_model::MenuId;
use crate::gen::base::usr::usr_model::UsrId;

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct FieldPermitModel {
  /// 系统字段
  #[graphql(skip)]
  pub is_sys: u8,
  /// ID
  pub id: FieldPermitId,
  /// 菜单
  pub menu_id: MenuId,
  /// 菜单
  pub menu_id_lbl: String,
  /// 编码
  pub code: String,
  /// 名称
  pub lbl: String,
  /// 类型
  pub r#type: FieldPermitType,
  /// 类型
  pub type_lbl: String,
  /// 备注
  pub rem: String,
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
  /// 是否已删除
  pub is_deleted: u8,
}

impl FromRow<'_, MySqlRow> for FieldPermitModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 系统记录
    let is_sys = row.try_get("is_sys")?;
    // ID
    let id: FieldPermitId = row.try_get("id")?;
    // 菜单
    let menu_id: MenuId = row.try_get("menu_id")?;
    let menu_id_lbl: Option<String> = row.try_get("menu_id_lbl")?;
    let menu_id_lbl = menu_id_lbl.unwrap_or_default();
    // 编码
    let code: String = row.try_get("code")?;
    // 名称
    let lbl: String = row.try_get("lbl")?;
    // 类型
    let type_lbl: String = row.try_get("type")?;
    let r#type: FieldPermitType = type_lbl.clone().try_into()?;
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
      is_deleted,
      id,
      menu_id,
      menu_id_lbl,
      code,
      lbl,
      r#type,
      type_lbl,
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
pub struct FieldPermitFieldComment {
  /// ID
  pub id: String,
  /// 菜单
  pub menu_id: String,
  /// 菜单
  pub menu_id_lbl: String,
  /// 编码
  pub code: String,
  /// 名称
  pub lbl: String,
  /// 类型
  pub r#type: String,
  /// 类型
  pub type_lbl: String,
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

#[derive(InputObject, Default, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct FieldPermitSearch {
  /// ID
  pub id: Option<FieldPermitId>,
  /// ID列表
  pub ids: Option<Vec<FieldPermitId>>,
  pub is_deleted: Option<u8>,
  /// 菜单
  pub menu_id: Option<Vec<MenuId>>,
  /// 菜单
  pub menu_id_is_null: Option<bool>,
  /// 编码
  pub code: Option<String>,
  /// 编码
  pub code_like: Option<String>,
  /// 名称
  pub lbl: Option<String>,
  /// 名称
  pub lbl_like: Option<String>,
  /// 类型
  pub r#type: Option<Vec<FieldPermitType>>,
  /// 备注
  pub rem: Option<String>,
  /// 备注
  pub rem_like: Option<String>,
  /// 创建人
  pub create_usr_id: Option<Vec<UsrId>>,
  /// 创建人
  pub create_usr_id_is_null: Option<bool>,
  /// 创建时间
  pub create_time: Option<Vec<chrono::NaiveDateTime>>,
  /// 更新人
  pub update_usr_id: Option<Vec<UsrId>>,
  /// 更新人
  pub update_usr_id_is_null: Option<bool>,
  /// 更新时间
  pub update_time: Option<Vec<chrono::NaiveDateTime>>,
}

#[derive(InputObject, Default, Clone, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct FieldPermitInput {
  /// ID
  pub id: Option<FieldPermitId>,
  #[graphql(skip)]
  pub is_deleted: Option<u8>,
  /// 系统记录
  #[graphql(skip)]
  pub is_sys: Option<u8>,
  /// 菜单
  pub menu_id: Option<MenuId>,
  /// 菜单
  pub menu_id_lbl: Option<String>,
  /// 编码
  pub code: Option<String>,
  /// 名称
  pub lbl: Option<String>,
  /// 类型
  pub r#type: Option<FieldPermitType>,
  /// 类型
  pub type_lbl: Option<String>,
  /// 备注
  pub rem: Option<String>,
  /// 创建人
  pub create_usr_id: Option<UsrId>,
  /// 创建人
  pub create_usr_id_lbl: Option<String>,
  /// 创建时间
  pub create_time: Option<chrono::NaiveDateTime>,
  /// 创建时间
  pub create_time_lbl: Option<String>,
  /// 更新人
  pub update_usr_id: Option<UsrId>,
  /// 更新人
  pub update_usr_id_lbl: Option<String>,
  /// 更新时间
  pub update_time: Option<chrono::NaiveDateTime>,
  /// 更新时间
  pub update_time_lbl: Option<String>,
}

impl From<FieldPermitModel> for FieldPermitInput {
  fn from(model: FieldPermitModel) -> Self {
    Self {
      id: model.id.into(),
      is_deleted: model.is_deleted.into(),
      is_sys: model.is_sys.into(),
      // 菜单
      menu_id: model.menu_id.into(),
      menu_id_lbl: model.menu_id_lbl.into(),
      // 编码
      code: model.code.into(),
      // 名称
      lbl: model.lbl.into(),
      // 类型
      r#type: model.r#type.into(),
      type_lbl: model.type_lbl.into(),
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

impl From<FieldPermitInput> for FieldPermitSearch {
  fn from(input: FieldPermitInput) -> Self {
    Self {
      id: input.id,
      ids: None,
      is_deleted: None,
      // 菜单
      menu_id: input.menu_id.map(|x| vec![x]),
      // 编码
      code: input.code,
      // 名称
      lbl: input.lbl,
      // 类型
      r#type: input.r#type.map(|x| vec![x]),
      // 备注
      rem: input.rem,
      // 创建人
      create_usr_id: input.create_usr_id.map(|x| vec![x]),
      // 创建时间
      create_time: input.create_time.map(|x| vec![x, x]),
      // 更新人
      update_usr_id: input.update_usr_id.map(|x| vec![x]),
      // 更新时间
      update_time: input.update_time.map(|x| vec![x, x]),
      ..Default::default()
    }
  }
}

#[derive(Default, Serialize, Deserialize, Clone, Debug, PartialEq, Eq, Hash)]
pub struct FieldPermitId(SmolStr);

impl fmt::Display for FieldPermitId {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(f, "{}", self.0)
  }
}

#[async_graphql::Scalar(name = "FieldPermitId")]
impl async_graphql::ScalarType for FieldPermitId {
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

impl From<FieldPermitId> for ArgType {
  fn from(value: FieldPermitId) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl From<&FieldPermitId> for ArgType {
  fn from(value: &FieldPermitId) -> Self {
    ArgType::SmolStr(value.clone().into())
  }
}

impl From<FieldPermitId> for SmolStr {
  fn from(id: FieldPermitId) -> Self {
    id.0
  }
}

impl From<SmolStr> for FieldPermitId {
  fn from(s: SmolStr) -> Self {
    Self(s)
  }
}

impl From<&SmolStr> for FieldPermitId {
  fn from(s: &SmolStr) -> Self {
    Self(s.clone())
  }
}

impl From<String> for FieldPermitId {
  fn from(s: String) -> Self {
    Self(s.into())
  }
}

impl From<&str> for FieldPermitId {
  fn from(s: &str) -> Self {
    Self(s.into())
  }
}

impl Deref for FieldPermitId {
  type Target = SmolStr;
  
  fn deref(&self) -> &SmolStr {
    &self.0
  }
}

impl Encode<'_, MySql> for FieldPermitId {
  fn encode_by_ref(&self, buf: &mut Vec<u8>) -> IsNull {
    <&str as Encode<MySql>>::encode(self.as_str(), buf)
  }
  
  fn size_hint(&self) -> usize {
    self.len()
  }
}

impl sqlx::Type<MySql> for FieldPermitId {
  fn type_info() -> <MySql as sqlx::Database>::TypeInfo {
    <&str as sqlx::Type<MySql>>::type_info()
  }
  
  fn compatible(ty: &<MySql as sqlx::Database>::TypeInfo) -> bool {
    <&str as sqlx::Type<MySql>>::compatible(ty)
  }
}

impl<'r> sqlx::Decode<'r, MySql> for FieldPermitId {
  fn decode(
    value: <MySql as sqlx::database::HasValueRef>::ValueRef,
  ) -> Result<Self, sqlx::error::BoxDynError> {
    <&str as sqlx::Decode<MySql>>::decode(value).map(Self::from)
  }
}

/// 字段权限类型
#[derive(Enum, Copy, Clone, Eq, PartialEq, Serialize, Deserialize, Debug)]
pub enum FieldPermitType {
  /// 可改
  #[graphql(name="editable")]
  Editable,
  /// 隐藏
  #[graphql(name="hidden")]
  Hidden,
  /// 只读
  #[graphql(name="readonly")]
  Readonly,
}

impl fmt::Display for FieldPermitType {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    match self {
      Self::Editable => write!(f, "editable"),
      Self::Hidden => write!(f, "hidden"),
      Self::Readonly => write!(f, "readonly"),
    }
  }
}

impl From<FieldPermitType> for SmolStr {
  fn from(value: FieldPermitType) -> Self {
    match value {
      FieldPermitType::Editable => "editable".into(),
      FieldPermitType::Hidden => "hidden".into(),
      FieldPermitType::Readonly => "readonly".into(),
    }
  }
}

impl From<FieldPermitType> for String {
  fn from(value: FieldPermitType) -> Self {
    match value {
      FieldPermitType::Editable => "editable".into(),
      FieldPermitType::Hidden => "hidden".into(),
      FieldPermitType::Readonly => "readonly".into(),
    }
  }
}

impl From<FieldPermitType> for ArgType {
  fn from(value: FieldPermitType) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl Default for FieldPermitType {
  fn default() -> Self {
    Self::Editable
  }
}

impl FromStr for FieldPermitType {
  type Err = anyhow::Error;
  
  fn from_str(s: &str) -> Result<Self, Self::Err> {
    match s {
      "editable" => Ok(Self::Editable),
      "hidden" => Ok(Self::Hidden),
      "readonly" => Ok(Self::Readonly),
      _ => Err(anyhow::anyhow!("FieldPermitType can't convert from {s}")),
    }
  }
}

impl FieldPermitType {
  pub fn as_str(&self) -> &str {
    match self {
      Self::Editable => "editable",
      Self::Hidden => "hidden",
      Self::Readonly => "readonly",
    }
  }
}

impl TryFrom<String> for FieldPermitType {
  type Error = sqlx::Error;
  
  fn try_from(s: String) -> Result<Self, Self::Error> {
    match s.as_str() {
      "editable" => Ok(Self::Editable),
      "hidden" => Ok(Self::Hidden),
      "readonly" => Ok(Self::Readonly),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "type".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "FieldPermitType can't convert from {s}".to_owned(),
          )),
        }),
      )),
    }
  }
}