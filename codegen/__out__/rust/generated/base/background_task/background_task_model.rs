
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

use crate::base::tenant::tenant_model::TenantId;
use crate::base::usr::usr_model::UsrId;

static CAN_SORT_IN_API_BACKGROUND_TASK: OnceLock<[&'static str; 4]> = OnceLock::new();

/// 后台任务 前端允许排序的字段
fn get_can_sort_in_api_background_task() -> &'static [&'static str; 4] {
  CAN_SORT_IN_API_BACKGROUND_TASK.get_or_init(|| [
    "begin_time",
    "end_time",
    "create_time",
    "update_time",
  ])
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "BackgroundTaskModel")]
#[allow(dead_code)]
pub struct BackgroundTaskModel {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: TenantId,
  /// ID
  pub id: BackgroundTaskId,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: String,
  /// 状态
  #[graphql(name = "state")]
  pub state: BackgroundTaskState,
  /// 状态
  #[graphql(name = "state_lbl")]
  pub state_lbl: String,
  /// 类型
  #[graphql(name = "type")]
  pub r#type: BackgroundTaskType,
  /// 类型
  #[graphql(name = "type_lbl")]
  pub type_lbl: String,
  /// 执行结果
  #[graphql(name = "result")]
  pub result: String,
  /// 错误信息
  #[graphql(name = "err_msg")]
  pub err_msg: String,
  /// 开始时间
  #[graphql(name = "begin_time")]
  pub begin_time: Option<chrono::NaiveDateTime>,
  /// 开始时间
  #[graphql(name = "begin_time_lbl")]
  pub begin_time_lbl: String,
  /// 结束时间
  #[graphql(name = "end_time")]
  pub end_time: Option<chrono::NaiveDateTime>,
  /// 结束时间
  #[graphql(name = "end_time_lbl")]
  pub end_time_lbl: String,
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
      None => String::new(),
    };
    // 结束时间
    let end_time: Option<chrono::NaiveDateTime> = row.try_get("end_time")?;
    let end_time_lbl: String = match end_time {
      Some(item) => item.format("%Y-%m-%d %H:%M:%S").to_string(),
      None => String::new(),
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
#[allow(dead_code)]
pub struct BackgroundTaskFieldComment {
  /// ID
  #[graphql(name = "id")]
  pub id: String,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: String,
  /// 状态
  #[graphql(name = "state")]
  pub state: String,
  /// 状态
  #[graphql(name = "state_lbl")]
  pub state_lbl: String,
  /// 类型
  #[graphql(name = "type")]
  pub r#type: String,
  /// 类型
  #[graphql(name = "type_lbl")]
  pub type_lbl: String,
  /// 执行结果
  #[graphql(name = "result")]
  pub result: String,
  /// 错误信息
  #[graphql(name = "err_msg")]
  pub err_msg: String,
  /// 开始时间
  #[graphql(name = "begin_time")]
  pub begin_time: String,
  /// 开始时间
  #[graphql(name = "begin_time_lbl")]
  pub begin_time_lbl: String,
  /// 结束时间
  #[graphql(name = "end_time")]
  pub end_time: String,
  /// 结束时间
  #[graphql(name = "end_time_lbl")]
  pub end_time_lbl: String,
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
pub struct BackgroundTaskSearch {
  /// ID
  pub id: Option<BackgroundTaskId>,
  /// ID列表
  pub ids: Option<Vec<BackgroundTaskId>>,
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  pub is_deleted: Option<u8>,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: Option<String>,
  /// 名称
  #[graphql(name = "lbl_like")]
  pub lbl_like: Option<String>,
  /// 状态
  #[graphql(name = "state")]
  pub state: Option<Vec<BackgroundTaskState>>,
  /// 类型
  #[graphql(name = "type")]
  pub r#type: Option<Vec<BackgroundTaskType>>,
  /// 执行结果
  #[graphql(skip)]
  pub result: Option<String>,
  /// 执行结果
  #[graphql(skip)]
  pub result_like: Option<String>,
  /// 错误信息
  #[graphql(skip)]
  pub err_msg: Option<String>,
  /// 错误信息
  #[graphql(skip)]
  pub err_msg_like: Option<String>,
  /// 开始时间
  #[graphql(name = "begin_time")]
  pub begin_time: Option<[Option<chrono::NaiveDateTime>; 2]>,
  /// 结束时间
  #[graphql(skip)]
  pub end_time: Option<[Option<chrono::NaiveDateTime>; 2]>,
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

impl std::fmt::Debug for BackgroundTaskSearch {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("BackgroundTaskSearch");
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
    // 状态
    if let Some(ref state) = self.state {
      item = item.field("state", state);
    }
    // 类型
    if let Some(ref r#type) = self.r#type {
      item = item.field("r#type", r#type);
    }
    // 执行结果
    if let Some(ref result) = self.result {
      item = item.field("result", result);
    }
    if let Some(ref result_like) = self.result_like {
      item = item.field("result_like", result_like);
    }
    // 错误信息
    if let Some(ref err_msg) = self.err_msg {
      item = item.field("err_msg", err_msg);
    }
    if let Some(ref err_msg_like) = self.err_msg_like {
      item = item.field("err_msg_like", err_msg_like);
    }
    // 开始时间
    if let Some(ref begin_time) = self.begin_time {
      item = item.field("begin_time", begin_time);
    }
    // 结束时间
    if let Some(ref end_time) = self.end_time {
      item = item.field("end_time", end_time);
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
#[graphql(rename_fields = "snake_case", name = "BackgroundTaskInput")]
#[allow(dead_code)]
pub struct BackgroundTaskInput {
  /// ID
  pub id: Option<BackgroundTaskId>,
  /// 已删除
  #[graphql(skip)]
  pub is_deleted: Option<u8>,
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: Option<String>,
  /// 状态
  #[graphql(name = "state")]
  pub state: Option<BackgroundTaskState>,
  /// 状态
  #[graphql(name = "state_lbl")]
  pub state_lbl: Option<String>,
  /// 类型
  #[graphql(name = "type")]
  pub r#type: Option<BackgroundTaskType>,
  /// 类型
  #[graphql(name = "type_lbl")]
  pub type_lbl: Option<String>,
  /// 执行结果
  #[graphql(name = "result")]
  pub result: Option<String>,
  /// 错误信息
  #[graphql(name = "err_msg")]
  pub err_msg: Option<String>,
  /// 开始时间
  #[graphql(name = "begin_time")]
  pub begin_time: Option<chrono::NaiveDateTime>,
  /// 开始时间
  #[graphql(name = "begin_time_lbl")]
  pub begin_time_lbl: Option<String>,
  /// 开始时间
  #[graphql(name = "begin_time_save_null")]
  pub begin_time_save_null: Option<bool>,
  /// 结束时间
  #[graphql(name = "end_time")]
  pub end_time: Option<chrono::NaiveDateTime>,
  /// 结束时间
  #[graphql(name = "end_time_lbl")]
  pub end_time_lbl: Option<String>,
  /// 结束时间
  #[graphql(name = "end_time_save_null")]
  pub end_time_save_null: Option<bool>,
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
      begin_time_save_null: Some(true),
      // 结束时间
      end_time: model.end_time,
      end_time_lbl: model.end_time_lbl.into(),
      end_time_save_null: Some(true),
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
      begin_time: input.begin_time.map(|x| [Some(x), Some(x)]),
      // 结束时间
      end_time: input.end_time.map(|x| [Some(x), Some(x)]),
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
  fn encode_by_ref(&self, buf: &mut Vec<u8>) -> sqlx::Result<IsNull, BoxDynError> {
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
    value: MySqlValueRef<'r>,
  ) -> Result<Self, BoxDynError> {
    <&str as sqlx::Decode<MySql>>::decode(value).map(Self::from)
  }
}

impl PartialEq<str> for BackgroundTaskId {
  fn eq(&self, other: &str) -> bool {
    self.0 == other
  }
}

/// 后台任务状态
#[derive(Enum, Copy, Clone, Default, Eq, PartialEq, Serialize, Deserialize, Debug)]
pub enum BackgroundTaskState {
  /// 运行中
  #[default]
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

impl FromStr for BackgroundTaskState {
  type Err = color_eyre::eyre::Error;
  
  fn from_str(s: &str) -> Result<Self, Self::Err> {
    match s {
      "running" => Ok(Self::Running),
      "success" => Ok(Self::Success),
      "fail" => Ok(Self::Fail),
      "cancel" => Ok(Self::Cancel),
      _ => Err(eyre!("BackgroundTaskState can't convert from {s}")),
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
  
  fn try_from(s: String) -> Result<Self, sqlx::Error> {
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
#[derive(Enum, Copy, Clone, Default, Eq, PartialEq, Serialize, Deserialize, Debug)]
pub enum BackgroundTaskType {
  /// 文本
  #[default]
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

impl FromStr for BackgroundTaskType {
  type Err = color_eyre::eyre::Error;
  
  fn from_str(s: &str) -> Result<Self, Self::Err> {
    match s {
      "text" => Ok(Self::Text),
      "download" => Ok(Self::Download),
      "inline" => Ok(Self::Inline),
      "tag" => Ok(Self::Tag),
      _ => Err(eyre!("BackgroundTaskType can't convert from {s}")),
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
  
  fn try_from(s: String) -> Result<Self, sqlx::Error> {
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

/// 后台任务 检测字段是否允许前端排序
pub fn check_sort_background_task(
  sort: Option<&[SortInput]>,
) -> Result<()> {
  
  if sort.is_none() {
    return Ok(());
  }
  let sort = sort.unwrap();
  
  let get_can_sort_in_api_background_task = get_can_sort_in_api_background_task();
  
  for item in sort {
    let prop = item.prop.as_str();
    if prop.is_empty() {
      continue;
    }
    if !get_can_sort_in_api_background_task.contains(&prop) {
      return Err(eyre!("check_sort_background_task: {}", serde_json::to_string(item)?));
    }
  }
  
  Ok(())
}

/// 获取路由地址
#[allow(dead_code)]
pub fn get_route_path_background_task() -> String {
  "/base/background_task".to_owned()
}
