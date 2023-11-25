
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
pub struct BackgroundTaskModel {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: TenantId,
  /// ID
  pub id: BackgroundTaskId,
  /// 名称
  pub lbl: String,
  /// 状态
  pub state: BackgroundTaskState,
  /// 状态
  pub state_lbl: String,
  /// 类型
  pub r#type: BackgroundTaskType,
  /// 类型
  pub type_lbl: String,
  /// 执行结果
  pub result: String,
  /// 错误信息
  pub err_msg: String,
  /// 开始时间
  pub begin_time: Option<chrono::NaiveDateTime>,
  /// 开始时间
  pub begin_time_lbl: String,
  /// 结束时间
  pub end_time: Option<chrono::NaiveDateTime>,
  /// 结束时间
  pub end_time_lbl: String,
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

impl FromRow<'_, MySqlRow> for BackgroundTaskModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;
    // ID
    let id: BackgroundTaskId = row.try_get("id")?;
    // 名称
    let lbl: String = row.try_get("lbl")?;
    // 状态
    let state_lbl: String = row.try_get("state")?;
    let state: BackgroundTaskState = state_lbl.clone().try_into()?;
    // 类型
    let type_lbl: String = row.try_get("type")?;
    let r#type: BackgroundTaskType = type_lbl.clone().try_into()?;
    // 执行结果
    let result: String = row.try_get("result")?;
    // 错误信息
    let err_msg: String = row.try_get("err_msg")?;
    // 开始时间
    let begin_time: Option<chrono::NaiveDateTime> = row.try_get("begin_time")?;
    let begin_time_lbl: String = match begin_time {
      Some(item) => item.format("%Y-%m-%d %H:%M:%S").to_string(),
      None => "".to_owned(),
    };
    // 结束时间
    let end_time: Option<chrono::NaiveDateTime> = row.try_get("end_time")?;
    let end_time_lbl: String = match end_time {
      Some(item) => item.format("%Y-%m-%d %H:%M:%S").to_string(),
      None => "".to_owned(),
    };
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
      tenant_id,
      is_deleted,
      id,
      lbl,
      state,
      state_lbl,
      r#type,
      type_lbl,
      result,
      err_msg,
      begin_time,
      begin_time_lbl,
      end_time,
      end_time_lbl,
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
pub struct BackgroundTaskFieldComment {
  /// ID
  pub id: String,
  /// 名称
  pub lbl: String,
  /// 状态
  pub state: String,
  /// 状态
  pub state_lbl: String,
  /// 类型
  pub r#type: String,
  /// 类型
  pub type_lbl: String,
  /// 执行结果
  pub result: String,
  /// 错误信息
  pub err_msg: String,
  /// 开始时间
  pub begin_time: String,
  /// 开始时间
  pub begin_time_lbl: String,
  /// 结束时间
  pub end_time: String,
  /// 结束时间
  pub end_time_lbl: String,
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
pub struct BackgroundTaskSearch {
  /// ID
  pub id: Option<BackgroundTaskId>,
  /// ID列表
  pub ids: Option<Vec<BackgroundTaskId>>,
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  pub is_deleted: Option<u8>,
  /// 名称
  pub lbl: Option<String>,
  /// 名称
  pub lbl_like: Option<String>,
  /// 状态
  pub state: Option<Vec<BackgroundTaskState>>,
  /// 类型
  pub r#type: Option<Vec<BackgroundTaskType>>,
  /// 执行结果
  pub result: Option<String>,
  /// 执行结果
  pub result_like: Option<String>,
  /// 错误信息
  pub err_msg: Option<String>,
  /// 错误信息
  pub err_msg_like: Option<String>,
  /// 开始时间
  pub begin_time: Option<Vec<chrono::NaiveDateTime>>,
  /// 结束时间
  pub end_time: Option<Vec<chrono::NaiveDateTime>>,
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
pub struct BackgroundTaskInput {
  /// ID
  pub id: Option<BackgroundTaskId>,
  #[graphql(skip)]
  pub is_deleted: Option<u8>,
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  /// 名称
  pub lbl: Option<String>,
  /// 状态
  pub state: Option<BackgroundTaskState>,
  /// 状态
  pub state_lbl: Option<String>,
  /// 类型
  pub r#type: Option<BackgroundTaskType>,
  /// 类型
  pub type_lbl: Option<String>,
  /// 执行结果
  pub result: Option<String>,
  /// 错误信息
  pub err_msg: Option<String>,
  /// 开始时间
  pub begin_time: Option<chrono::NaiveDateTime>,
  /// 开始时间
  pub begin_time_lbl: Option<String>,
  /// 结束时间
  pub end_time: Option<chrono::NaiveDateTime>,
  /// 结束时间
  pub end_time_lbl: Option<String>,
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

impl From<BackgroundTaskModel> for BackgroundTaskInput {
  fn from(model: BackgroundTaskModel) -> Self {
    Self {
      id: model.id.into(),
      is_deleted: model.is_deleted.into(),
      tenant_id: model.tenant_id.into(),
      // 名称
      lbl: model.lbl.into(),
      // 状态
      state: model.state.into(),
      state_lbl: model.state_lbl.into(),
      // 类型
      r#type: model.r#type.into(),
      type_lbl: model.type_lbl.into(),
      // 执行结果
      result: model.result.into(),
      // 错误信息
      err_msg: model.err_msg.into(),
      // 开始时间
      begin_time: model.begin_time,
      begin_time_lbl: model.begin_time_lbl.into(),
      // 结束时间
      end_time: model.end_time,
      end_time_lbl: model.end_time_lbl.into(),
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

impl From<BackgroundTaskInput> for BackgroundTaskSearch {
  fn from(input: BackgroundTaskInput) -> Self {
    Self {
      id: input.id,
      ids: None,
      // 租户ID
      tenant_id: input.tenant_id,
      is_deleted: None,
      // 名称
      lbl: input.lbl,
      // 状态
      state: input.state.map(|x| vec![x]),
      // 类型
      r#type: input.r#type.map(|x| vec![x]),
      // 执行结果
      result: input.result,
      // 错误信息
      err_msg: input.err_msg,
      // 开始时间
      begin_time: input.begin_time.map(|x| vec![x, x]),
      // 结束时间
      end_time: input.end_time.map(|x| vec![x, x]),
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
pub struct BackgroundTaskId(SmolStr);

impl fmt::Display for BackgroundTaskId {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(f, "{}", self.0)
  }
}

#[async_graphql::Scalar(name = "BackgroundTaskId")]
impl async_graphql::ScalarType for BackgroundTaskId {
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

impl From<BackgroundTaskId> for ArgType {
  fn from(value: BackgroundTaskId) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl From<&BackgroundTaskId> for ArgType {
  fn from(value: &BackgroundTaskId) -> Self {
    ArgType::SmolStr(value.clone().into())
  }
}

impl From<BackgroundTaskId> for SmolStr {
  fn from(id: BackgroundTaskId) -> Self {
    id.0
  }
}

impl From<SmolStr> for BackgroundTaskId {
  fn from(s: SmolStr) -> Self {
    Self(s)
  }
}

impl From<&SmolStr> for BackgroundTaskId {
  fn from(s: &SmolStr) -> Self {
    Self(s.clone())
  }
}

impl From<String> for BackgroundTaskId {
  fn from(s: String) -> Self {
    Self(s.into())
  }
}

impl From<&str> for BackgroundTaskId {
  fn from(s: &str) -> Self {
    Self(s.into())
  }
}

impl Deref for BackgroundTaskId {
  type Target = SmolStr;
  
  fn deref(&self) -> &SmolStr {
    &self.0
  }
}

impl Encode<'_, MySql> for BackgroundTaskId {
  fn encode_by_ref(&self, buf: &mut Vec<u8>) -> IsNull {
    <&str as Encode<MySql>>::encode(self.as_str(), buf)
  }
  
  fn size_hint(&self) -> usize {
    self.len()
  }
}

impl sqlx::Type<MySql> for BackgroundTaskId {
  fn type_info() -> <MySql as sqlx::Database>::TypeInfo {
    <&str as sqlx::Type<MySql>>::type_info()
  }
  
  fn compatible(ty: &<MySql as sqlx::Database>::TypeInfo) -> bool {
    <&str as sqlx::Type<MySql>>::compatible(ty)
  }
}

impl<'r> sqlx::Decode<'r, MySql> for BackgroundTaskId {
  fn decode(
    value: <MySql as sqlx::database::HasValueRef>::ValueRef,
  ) -> Result<Self, sqlx::error::BoxDynError> {
    <&str as sqlx::Decode<MySql>>::decode(value).map(Self::from)
  }
}

/// 后台任务状态
#[derive(Enum, Copy, Clone, Eq, PartialEq, Serialize, Deserialize, Debug)]
pub enum BackgroundTaskState {
  /// 运行中
  #[graphql(name="running")]
  Running,
  /// 成功
  #[graphql(name="success")]
  Success,
  /// 失败
  #[graphql(name="fail")]
  Fail,
  /// 取消
  #[graphql(name="cancel")]
  Cancel,
}

impl fmt::Display for BackgroundTaskState {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    match self {
      Self::Running => write!(f, "running"),
      Self::Success => write!(f, "success"),
      Self::Fail => write!(f, "fail"),
      Self::Cancel => write!(f, "cancel"),
    }
  }
}

impl From<BackgroundTaskState> for SmolStr {
  fn from(value: BackgroundTaskState) -> Self {
    match value {
      BackgroundTaskState::Running => "running".into(),
      BackgroundTaskState::Success => "success".into(),
      BackgroundTaskState::Fail => "fail".into(),
      BackgroundTaskState::Cancel => "cancel".into(),
    }
  }
}

impl From<BackgroundTaskState> for String {
  fn from(value: BackgroundTaskState) -> Self {
    match value {
      BackgroundTaskState::Running => "running".into(),
      BackgroundTaskState::Success => "success".into(),
      BackgroundTaskState::Fail => "fail".into(),
      BackgroundTaskState::Cancel => "cancel".into(),
    }
  }
}

impl From<BackgroundTaskState> for ArgType {
  fn from(value: BackgroundTaskState) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl Default for BackgroundTaskState {
  fn default() -> Self {
    Self::Running
  }
}

impl FromStr for BackgroundTaskState {
  type Err = anyhow::Error;
  
  fn from_str(s: &str) -> Result<Self, Self::Err> {
    match s {
      "running" => Ok(Self::Running),
      "success" => Ok(Self::Success),
      "fail" => Ok(Self::Fail),
      "cancel" => Ok(Self::Cancel),
      _ => Err(anyhow::anyhow!("BackgroundTaskState can't convert from {s}")),
    }
  }
}

impl BackgroundTaskState {
  pub fn as_str(&self) -> &str {
    match self {
      Self::Running => "running",
      Self::Success => "success",
      Self::Fail => "fail",
      Self::Cancel => "cancel",
    }
  }
}

impl TryFrom<String> for BackgroundTaskState {
  type Error = sqlx::Error;
  
  fn try_from(s: String) -> Result<Self, Self::Error> {
    match s.as_str() {
      "running" => Ok(Self::Running),
      "success" => Ok(Self::Success),
      "fail" => Ok(Self::Fail),
      "cancel" => Ok(Self::Cancel),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "state".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "BackgroundTaskState can't convert from {s}".to_owned(),
          )),
        }),
      )),
    }
  }
}

/// 后台任务类型
#[derive(Enum, Copy, Clone, Eq, PartialEq, Serialize, Deserialize, Debug)]
pub enum BackgroundTaskType {
  /// 文本
  #[graphql(name="text")]
  Text,
  /// 下载
  #[graphql(name="download")]
  Download,
  /// 查看
  #[graphql(name="inline")]
  Inline,
  /// 标签
  #[graphql(name="tag")]
  Tag,
}

impl fmt::Display for BackgroundTaskType {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    match self {
      Self::Text => write!(f, "text"),
      Self::Download => write!(f, "download"),
      Self::Inline => write!(f, "inline"),
      Self::Tag => write!(f, "tag"),
    }
  }
}

impl From<BackgroundTaskType> for SmolStr {
  fn from(value: BackgroundTaskType) -> Self {
    match value {
      BackgroundTaskType::Text => "text".into(),
      BackgroundTaskType::Download => "download".into(),
      BackgroundTaskType::Inline => "inline".into(),
      BackgroundTaskType::Tag => "tag".into(),
    }
  }
}

impl From<BackgroundTaskType> for String {
  fn from(value: BackgroundTaskType) -> Self {
    match value {
      BackgroundTaskType::Text => "text".into(),
      BackgroundTaskType::Download => "download".into(),
      BackgroundTaskType::Inline => "inline".into(),
      BackgroundTaskType::Tag => "tag".into(),
    }
  }
}

impl From<BackgroundTaskType> for ArgType {
  fn from(value: BackgroundTaskType) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl Default for BackgroundTaskType {
  fn default() -> Self {
    Self::Text
  }
}

impl FromStr for BackgroundTaskType {
  type Err = anyhow::Error;
  
  fn from_str(s: &str) -> Result<Self, Self::Err> {
    match s {
      "text" => Ok(Self::Text),
      "download" => Ok(Self::Download),
      "inline" => Ok(Self::Inline),
      "tag" => Ok(Self::Tag),
      _ => Err(anyhow::anyhow!("BackgroundTaskType can't convert from {s}")),
    }
  }
}

impl BackgroundTaskType {
  pub fn as_str(&self) -> &str {
    match self {
      Self::Text => "text",
      Self::Download => "download",
      Self::Inline => "inline",
      Self::Tag => "tag",
    }
  }
}

impl TryFrom<String> for BackgroundTaskType {
  type Error = sqlx::Error;
  
  fn try_from(s: String) -> Result<Self, Self::Error> {
    match s.as_str() {
      "text" => Ok(Self::Text),
      "download" => Ok(Self::Download),
      "inline" => Ok(Self::Inline),
      "tag" => Ok(Self::Tag),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "type".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "BackgroundTaskType can't convert from {s}".to_owned(),
          )),
        }),
      )),
    }
  }
}
