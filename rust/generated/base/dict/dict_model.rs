
use std::fmt;
use std::ops::Deref;
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

use crate::base::dict_detail::dict_detail_model::{
  DictDetailModel,
  DictDetailInput,
};
use crate::base::usr::usr_model::UsrId;

static CAN_SORT_IN_API_DICT: OnceLock<[&'static str; 3]> = OnceLock::new();

/// 系统字典 前端允许排序的字段
fn get_can_sort_in_api_dict() -> &'static [&'static str; 3] {
  CAN_SORT_IN_API_DICT.get_or_init(|| [
    "order_by",
    "create_time",
    "update_time",
  ])
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "DictModel")]
#[allow(dead_code)]
pub struct DictModel {
  /// 系统字段
  pub is_sys: u8,
  /// ID
  pub id: DictId,
  /// 编码
  #[graphql(name = "code")]
  pub code: String,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: String,
  /// 数据类型
  #[graphql(name = "type")]
  pub r#type: DictType,
  /// 数据类型
  #[graphql(name = "type_lbl")]
  pub type_lbl: String,
  /// 可新增
  #[graphql(name = "is_add")]
  pub is_add: u8,
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
  /// 系统字典明细
  pub dict_detail: Vec<DictDetailModel>,
}

impl FromRow<'_, MySqlRow> for DictModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 系统记录
    let is_sys = row.try_get("is_sys")?;
    // ID
    let id: DictId = row.try_get("id")?;
    // 编码
    let code: String = row.try_get("code")?;
    // 名称
    let lbl: String = row.try_get("lbl")?;
    // 数据类型
    let type_lbl: String = row.try_get("type")?;
    let r#type: DictType = type_lbl.clone().try_into()?;
    // 可新增
    let is_add: u8 = row.try_get("is_add")?;
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
      is_sys,
      is_deleted,
      id,
      code,
      lbl,
      r#type,
      type_lbl,
      is_add,
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
      // 系统字典明细
      dict_detail: vec![],
    };
    
    Ok(model)
  }
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Debug)]
#[graphql(rename_fields = "snake_case")]
#[allow(dead_code)]
pub struct DictFieldComment {
  /// ID
  #[graphql(name = "id")]
  pub id: String,
  /// 编码
  #[graphql(name = "code")]
  pub code: String,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: String,
  /// 数据类型
  #[graphql(name = "type")]
  pub r#type: String,
  /// 数据类型
  #[graphql(name = "type_lbl")]
  pub type_lbl: String,
  /// 可新增
  #[graphql(name = "is_add")]
  pub is_add: String,
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
pub struct DictSearch {
  /// ID
  pub id: Option<DictId>,
  /// ID列表
  pub ids: Option<Vec<DictId>>,
  pub is_deleted: Option<u8>,
  /// 编码
  #[graphql(name = "code")]
  pub code: Option<String>,
  /// 编码
  #[graphql(name = "code_like")]
  pub code_like: Option<String>,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: Option<String>,
  /// 名称
  #[graphql(name = "lbl_like")]
  pub lbl_like: Option<String>,
  /// 数据类型
  #[graphql(skip)]
  pub r#type: Option<Vec<DictType>>,
  /// 可新增
  #[graphql(skip)]
  pub is_add: Option<Vec<u8>>,
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

impl std::fmt::Debug for DictSearch {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("DictSearch");
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
    // 编码
    if let Some(ref code) = self.code {
      item = item.field("code", code);
    }
    if let Some(ref code_like) = self.code_like {
      item = item.field("code_like", code_like);
    }
    // 名称
    if let Some(ref lbl) = self.lbl {
      item = item.field("lbl", lbl);
    }
    if let Some(ref lbl_like) = self.lbl_like {
      item = item.field("lbl_like", lbl_like);
    }
    // 数据类型
    if let Some(ref r#type) = self.r#type {
      item = item.field("r#type", r#type);
    }
    // 可新增
    if let Some(ref is_add) = self.is_add {
      item = item.field("is_add", is_add);
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
#[graphql(rename_fields = "snake_case", name = "DictInput")]
#[allow(dead_code)]
pub struct DictInput {
  /// ID
  pub id: Option<DictId>,
  /// 已删除
  #[graphql(skip)]
  pub is_deleted: Option<u8>,
  /// 系统记录
  pub is_sys: Option<u8>,
  /// 编码
  #[graphql(name = "code")]
  pub code: Option<String>,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: Option<String>,
  /// 数据类型
  #[graphql(name = "type")]
  pub r#type: Option<DictType>,
  /// 数据类型
  #[graphql(name = "type_lbl")]
  pub type_lbl: Option<String>,
  /// 可新增
  #[graphql(name = "is_add")]
  pub is_add: Option<u8>,
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
  /// 系统字典明细
  pub dict_detail: Option<Vec<DictDetailInput>>,
}

impl From<DictModel> for DictInput {
  fn from(model: DictModel) -> Self {
    Self {
      id: model.id.into(),
      is_deleted: model.is_deleted.into(),
      is_sys: model.is_sys.into(),
      // 编码
      code: model.code.into(),
      // 名称
      lbl: model.lbl.into(),
      // 数据类型
      r#type: model.r#type.into(),
      type_lbl: model.type_lbl.into(),
      // 可新增
      is_add: model.is_add.into(),
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
      // 系统字典明细
      dict_detail: model.dict_detail
        .into_iter()
        .map(|x| x.into())
        .collect::<Vec<DictDetailInput>>()
        .into(),
    }
  }
}

impl From<DictInput> for DictSearch {
  fn from(input: DictInput) -> Self {
    Self {
      id: input.id,
      ids: None,
      is_deleted: None,
      // 编码
      code: input.code,
      // 名称
      lbl: input.lbl,
      // 数据类型
      r#type: input.r#type.map(|x| vec![x]),
      // 可新增
      is_add: input.is_add.map(|x| vec![x]),
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
pub struct DictId(SmolStr);

impl fmt::Display for DictId {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(f, "{}", self.0)
  }
}

#[async_graphql::Scalar(name = "DictId")]
impl async_graphql::ScalarType for DictId {
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

impl From<DictId> for ArgType {
  fn from(value: DictId) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl From<&DictId> for ArgType {
  fn from(value: &DictId) -> Self {
    ArgType::SmolStr(value.clone().into())
  }
}

impl From<DictId> for SmolStr {
  fn from(id: DictId) -> Self {
    id.0
  }
}

impl From<SmolStr> for DictId {
  fn from(s: SmolStr) -> Self {
    Self(s)
  }
}

impl From<&SmolStr> for DictId {
  fn from(s: &SmolStr) -> Self {
    Self(s.clone())
  }
}

impl From<String> for DictId {
  fn from(s: String) -> Self {
    Self(s.into())
  }
}

impl From<&str> for DictId {
  fn from(s: &str) -> Self {
    Self(s.into())
  }
}

impl Deref for DictId {
  type Target = SmolStr;
  
  fn deref(&self) -> &SmolStr {
    &self.0
  }
}

impl Encode<'_, MySql> for DictId {
  fn encode_by_ref(&self, buf: &mut Vec<u8>) -> sqlx::Result<IsNull, BoxDynError> {
    <&str as Encode<MySql>>::encode(self.as_str(), buf)
  }
  
  fn size_hint(&self) -> usize {
    self.len()
  }
}

impl sqlx::Type<MySql> for DictId {
  fn type_info() -> <MySql as sqlx::Database>::TypeInfo {
    <&str as sqlx::Type<MySql>>::type_info()
  }
  
  fn compatible(ty: &<MySql as sqlx::Database>::TypeInfo) -> bool {
    <&str as sqlx::Type<MySql>>::compatible(ty)
  }
}

impl<'r> sqlx::Decode<'r, MySql> for DictId {
  fn decode(
    value: MySqlValueRef<'r>,
  ) -> Result<Self, BoxDynError> {
    <&str as sqlx::Decode<MySql>>::decode(value).map(Self::from)
  }
}

impl PartialEq<str> for DictId {
  fn eq(&self, other: &str) -> bool {
    self.0 == other
  }
}

/// 系统字典数据类型
#[derive(Enum, Copy, Clone, Default, Eq, PartialEq, Serialize, Deserialize, Debug)]
pub enum DictType {
  /// 字符串
  #[default]
  #[graphql(name="string")]
  String,
  /// 数值
  #[graphql(name="number")]
  Number,
  /// 日期
  #[graphql(name="date")]
  Date,
  /// 日期时间
  #[graphql(name="datetime")]
  Datetime,
  /// 时间
  #[graphql(name="time")]
  Time,
  /// 布尔
  #[graphql(name="boolean")]
  Boolean,
}

impl fmt::Display for DictType {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    match self {
      Self::String => write!(f, "string"),
      Self::Number => write!(f, "number"),
      Self::Date => write!(f, "date"),
      Self::Datetime => write!(f, "datetime"),
      Self::Time => write!(f, "time"),
      Self::Boolean => write!(f, "boolean"),
    }
  }
}

impl From<DictType> for SmolStr {
  fn from(value: DictType) -> Self {
    match value {
      DictType::String => "string".into(),
      DictType::Number => "number".into(),
      DictType::Date => "date".into(),
      DictType::Datetime => "datetime".into(),
      DictType::Time => "time".into(),
      DictType::Boolean => "boolean".into(),
    }
  }
}

impl From<DictType> for String {
  fn from(value: DictType) -> Self {
    match value {
      DictType::String => "string".into(),
      DictType::Number => "number".into(),
      DictType::Date => "date".into(),
      DictType::Datetime => "datetime".into(),
      DictType::Time => "time".into(),
      DictType::Boolean => "boolean".into(),
    }
  }
}

impl From<DictType> for ArgType {
  fn from(value: DictType) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl FromStr for DictType {
  type Err = color_eyre::eyre::Error;
  
  fn from_str(s: &str) -> Result<Self, Self::Err> {
    match s {
      "string" => Ok(Self::String),
      "number" => Ok(Self::Number),
      "date" => Ok(Self::Date),
      "datetime" => Ok(Self::Datetime),
      "time" => Ok(Self::Time),
      "boolean" => Ok(Self::Boolean),
      _ => Err(eyre!("DictType can't convert from {s}")),
    }
  }
}

impl DictType {
  pub fn as_str(&self) -> &str {
    match self {
      Self::String => "string",
      Self::Number => "number",
      Self::Date => "date",
      Self::Datetime => "datetime",
      Self::Time => "time",
      Self::Boolean => "boolean",
    }
  }
}

impl TryFrom<String> for DictType {
  type Error = sqlx::Error;
  
  fn try_from(s: String) -> Result<Self, sqlx::Error> {
    match s.as_str() {
      "string" => Ok(Self::String),
      "number" => Ok(Self::Number),
      "date" => Ok(Self::Date),
      "datetime" => Ok(Self::Datetime),
      "time" => Ok(Self::Time),
      "boolean" => Ok(Self::Boolean),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "type".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "DictType can't convert from {s}".to_owned(),
          )),
        }),
      )),
    }
  }
}

/// 系统字典 检测字段是否允许前端排序
pub fn check_sort_dict(
  sort: Option<&[SortInput]>,
) -> Result<()> {
  
  if sort.is_none() {
    return Ok(());
  }
  let sort = sort.unwrap();
  
  let get_can_sort_in_api_dict = get_can_sort_in_api_dict();
  
  for item in sort {
    let prop = item.prop.as_str();
    if prop.is_empty() {
      continue;
    }
    if !get_can_sort_in_api_dict.contains(&prop) {
      return Err(eyre!("check_sort_dict: {}", serde_json::to_string(item)?));
    }
  }
  
  Ok(())
}

/// 获取路由地址
#[allow(dead_code)]
pub fn get_route_path_dict() -> String {
  "/base/dict".to_owned()
}
