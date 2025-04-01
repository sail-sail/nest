
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
use crate::r#gen::cron::cron_job::cron_job_model::CronJobId;
use crate::r#gen::base::usr::usr_model::UsrId;

static CAN_SORT_IN_API_CRON_JOB_LOG: OnceLock<[&'static str; 2]> = OnceLock::new();

/// 定时任务日志 前端允许排序的字段
fn get_can_sort_in_api_cron_job_log() -> &'static [&'static str; 2] {
  CAN_SORT_IN_API_CRON_JOB_LOG.get_or_init(|| [
    "create_time",
    "update_time",
  ])
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "CronJobLogModel")]
#[allow(dead_code)]
pub struct CronJobLogModel {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: TenantId,
  /// ID
  pub id: CronJobLogId,
  /// 定时任务
  #[graphql(name = "cron_job_id")]
  pub cron_job_id: CronJobId,
  /// 定时任务
  #[graphql(name = "cron_job_id_lbl")]
  pub cron_job_id_lbl: String,
  /// 执行状态
  #[graphql(name = "exec_state")]
  pub exec_state: CronJobLogExecState,
  /// 执行状态
  #[graphql(name = "exec_state_lbl")]
  pub exec_state_lbl: String,
  /// 执行结果
  #[graphql(name = "exec_result")]
  pub exec_result: String,
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
  #[graphql(skip)]
  pub create_usr_id: UsrId,
  /// 创建人
  #[graphql(skip)]
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

impl FromRow<'_, MySqlRow> for CronJobLogModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;
    // ID
    let id: CronJobLogId = row.try_get("id")?;
    // 定时任务
    let cron_job_id: CronJobId = row.try_get("cron_job_id")?;
    let cron_job_id_lbl: Option<String> = row.try_get("cron_job_id_lbl")?;
    let cron_job_id_lbl = cron_job_id_lbl.unwrap_or_default();
    // 执行状态
    let exec_state_lbl: String = row.try_get("exec_state")?;
    let exec_state: CronJobLogExecState = exec_state_lbl.clone().try_into()?;
    // 执行结果
    let exec_result: String = row.try_get("exec_result")?;
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
      cron_job_id,
      cron_job_id_lbl,
      exec_state,
      exec_state_lbl,
      exec_result,
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
pub struct CronJobLogFieldComment {
  /// ID
  #[graphql(name = "id")]
  pub id: String,
  /// 定时任务
  #[graphql(name = "cron_job_id")]
  pub cron_job_id: String,
  /// 定时任务
  #[graphql(name = "cron_job_id_lbl")]
  pub cron_job_id_lbl: String,
  /// 执行状态
  #[graphql(name = "exec_state")]
  pub exec_state: String,
  /// 执行状态
  #[graphql(name = "exec_state_lbl")]
  pub exec_state_lbl: String,
  /// 执行结果
  #[graphql(name = "exec_result")]
  pub exec_result: String,
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
  /// 创建时间
  #[graphql(name = "create_time")]
  pub create_time: String,
  /// 创建时间
  #[graphql(name = "create_time_lbl")]
  pub create_time_lbl: String,
}

#[derive(InputObject, Default)]
#[graphql(rename_fields = "snake_case")]
#[allow(dead_code)]
pub struct CronJobLogSearch {
  /// ID
  pub id: Option<CronJobLogId>,
  /// ID列表
  pub ids: Option<Vec<CronJobLogId>>,
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  pub is_deleted: Option<u8>,
  /// 定时任务
  #[graphql(name = "cron_job_id")]
  pub cron_job_id: Option<Vec<CronJobId>>,
  /// 定时任务
  #[graphql(name = "cron_job_id_save_null")]
  pub cron_job_id_is_null: Option<bool>,
  /// 定时任务
  #[graphql(name = "cron_job_id_lbl")]
  pub cron_job_id_lbl: Option<Vec<String>>,
  /// 定时任务
  #[graphql(name = "cron_job_id_lbl_like")]
  pub cron_job_id_lbl_like: Option<String>,
  /// 执行状态
  #[graphql(name = "exec_state")]
  pub exec_state: Option<Vec<CronJobLogExecState>>,
  /// 执行结果
  #[graphql(skip)]
  pub exec_result: Option<String>,
  /// 执行结果
  #[graphql(skip)]
  pub exec_result_like: Option<String>,
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
  /// 创建时间
  #[graphql(skip)]
  pub create_time: Option<[Option<chrono::NaiveDateTime>; 2]>,
  /// 创建人
  #[graphql(skip)]
  pub create_usr_id: Option<Vec<UsrId>>,
  /// 创建人
  #[graphql(skip)]
  pub create_usr_id_is_null: Option<bool>,
  /// 创建人
  #[graphql(skip)]
  pub create_usr_id_lbl: Option<Vec<String>>,
  /// 创建人
  #[graphql(skip)]
  pub create_usr_id_lbl_like: Option<String>,
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

impl std::fmt::Debug for CronJobLogSearch {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("CronJobLogSearch");
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
    // 定时任务
    if let Some(ref cron_job_id) = self.cron_job_id {
      item = item.field("cron_job_id", cron_job_id);
    }
    if let Some(ref cron_job_id_is_null) = self.cron_job_id_is_null {
      item = item.field("cron_job_id_is_null", cron_job_id_is_null);
    }
    // 执行状态
    if let Some(ref exec_state) = self.exec_state {
      item = item.field("exec_state", exec_state);
    }
    // 执行结果
    if let Some(ref exec_result) = self.exec_result {
      item = item.field("exec_result", exec_result);
    }
    if let Some(ref exec_result_like) = self.exec_result_like {
      item = item.field("exec_result_like", exec_result_like);
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
    // 创建时间
    if let Some(ref create_time) = self.create_time {
      item = item.field("create_time", create_time);
    }
    // 创建人
    if let Some(ref create_usr_id) = self.create_usr_id {
      item = item.field("create_usr_id", create_usr_id);
    }
    if let Some(ref create_usr_id_is_null) = self.create_usr_id_is_null {
      item = item.field("create_usr_id_is_null", create_usr_id_is_null);
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
#[graphql(rename_fields = "snake_case", name = "CronJobLogInput")]
#[allow(dead_code)]
pub struct CronJobLogInput {
  /// ID
  pub id: Option<CronJobLogId>,
  /// 已删除
  #[graphql(skip)]
  pub is_deleted: Option<u8>,
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  /// 定时任务
  #[graphql(name = "cron_job_id")]
  pub cron_job_id: Option<CronJobId>,
  /// 定时任务
  #[graphql(name = "cron_job_id_lbl")]
  pub cron_job_id_lbl: Option<String>,
  /// 执行状态
  #[graphql(name = "exec_state")]
  pub exec_state: Option<CronJobLogExecState>,
  /// 执行状态
  #[graphql(name = "exec_state_lbl")]
  pub exec_state_lbl: Option<String>,
  /// 执行结果
  #[graphql(name = "exec_result")]
  pub exec_result: Option<String>,
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

impl From<CronJobLogModel> for CronJobLogInput {
  fn from(model: CronJobLogModel) -> Self {
    Self {
      id: model.id.into(),
      is_deleted: model.is_deleted.into(),
      tenant_id: model.tenant_id.into(),
      // 定时任务
      cron_job_id: model.cron_job_id.into(),
      cron_job_id_lbl: model.cron_job_id_lbl.into(),
      // 执行状态
      exec_state: model.exec_state.into(),
      exec_state_lbl: model.exec_state_lbl.into(),
      // 执行结果
      exec_result: model.exec_result.into(),
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

impl From<CronJobLogInput> for CronJobLogSearch {
  fn from(input: CronJobLogInput) -> Self {
    Self {
      id: input.id,
      ids: None,
      // 租户ID
      tenant_id: input.tenant_id,
      is_deleted: None,
      // 定时任务
      cron_job_id: input.cron_job_id.map(|x| vec![x]),
      // 执行状态
      exec_state: input.exec_state.map(|x| vec![x]),
      // 执行结果
      exec_result: input.exec_result,
      // 开始时间
      begin_time: input.begin_time.map(|x| [Some(x), Some(x)]),
      // 结束时间
      end_time: input.end_time.map(|x| [Some(x), Some(x)]),
      // 备注
      rem: input.rem,
      // 创建时间
      create_time: input.create_time.map(|x| [Some(x), Some(x)]),
      // 创建人
      create_usr_id: input.create_usr_id.map(|x| vec![x]),
      // 创建人
      create_usr_id_lbl: input.create_usr_id_lbl.map(|x| vec![x]),
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
pub struct CronJobLogId(SmolStr);

impl fmt::Display for CronJobLogId {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(f, "{}", self.0)
  }
}

#[async_graphql::Scalar(name = "CronJobLogId")]
impl async_graphql::ScalarType for CronJobLogId {
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

impl From<CronJobLogId> for ArgType {
  fn from(value: CronJobLogId) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl From<&CronJobLogId> for ArgType {
  fn from(value: &CronJobLogId) -> Self {
    ArgType::SmolStr(value.clone().into())
  }
}

impl From<CronJobLogId> for SmolStr {
  fn from(id: CronJobLogId) -> Self {
    id.0
  }
}

impl From<SmolStr> for CronJobLogId {
  fn from(s: SmolStr) -> Self {
    Self(s)
  }
}

impl From<&SmolStr> for CronJobLogId {
  fn from(s: &SmolStr) -> Self {
    Self(s.clone())
  }
}

impl From<String> for CronJobLogId {
  fn from(s: String) -> Self {
    Self(s.into())
  }
}

impl From<&str> for CronJobLogId {
  fn from(s: &str) -> Self {
    Self(s.into())
  }
}

impl Deref for CronJobLogId {
  type Target = SmolStr;
  
  fn deref(&self) -> &SmolStr {
    &self.0
  }
}

impl Encode<'_, MySql> for CronJobLogId {
  fn encode_by_ref(&self, buf: &mut Vec<u8>) -> sqlx::Result<IsNull, BoxDynError> {
    <&str as Encode<MySql>>::encode(self.as_str(), buf)
  }
  
  fn size_hint(&self) -> usize {
    self.len()
  }
}

impl sqlx::Type<MySql> for CronJobLogId {
  fn type_info() -> <MySql as sqlx::Database>::TypeInfo {
    <&str as sqlx::Type<MySql>>::type_info()
  }
  
  fn compatible(ty: &<MySql as sqlx::Database>::TypeInfo) -> bool {
    <&str as sqlx::Type<MySql>>::compatible(ty)
  }
}

impl<'r> sqlx::Decode<'r, MySql> for CronJobLogId {
  fn decode(
    value: MySqlValueRef<'r>,
  ) -> Result<Self, BoxDynError> {
    <&str as sqlx::Decode<MySql>>::decode(value).map(Self::from)
  }
}

impl PartialEq<str> for CronJobLogId {
  fn eq(&self, other: &str) -> bool {
    self.0 == other
  }
}

/// 定时任务日志执行状态
#[derive(Enum, Copy, Clone, Default, Eq, PartialEq, Serialize, Deserialize, Debug)]
pub enum CronJobLogExecState {
  /// 执行中
  #[default]
  #[graphql(name="running")]
  Running,
  /// 成功
  #[graphql(name="success")]
  Success,
  /// 失败
  #[graphql(name="fail")]
  Fail,
}

impl fmt::Display for CronJobLogExecState {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    match self {
      Self::Running => write!(f, "running"),
      Self::Success => write!(f, "success"),
      Self::Fail => write!(f, "fail"),
    }
  }
}

impl From<CronJobLogExecState> for SmolStr {
  fn from(value: CronJobLogExecState) -> Self {
    match value {
      CronJobLogExecState::Running => "running".into(),
      CronJobLogExecState::Success => "success".into(),
      CronJobLogExecState::Fail => "fail".into(),
    }
  }
}

impl From<CronJobLogExecState> for String {
  fn from(value: CronJobLogExecState) -> Self {
    match value {
      CronJobLogExecState::Running => "running".into(),
      CronJobLogExecState::Success => "success".into(),
      CronJobLogExecState::Fail => "fail".into(),
    }
  }
}

impl From<CronJobLogExecState> for ArgType {
  fn from(value: CronJobLogExecState) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl FromStr for CronJobLogExecState {
  type Err = color_eyre::eyre::Error;
  
  fn from_str(s: &str) -> Result<Self, Self::Err> {
    match s {
      "running" => Ok(Self::Running),
      "success" => Ok(Self::Success),
      "fail" => Ok(Self::Fail),
      _ => Err(eyre!("CronJobLogExecState can't convert from {s}")),
    }
  }
}

impl CronJobLogExecState {
  pub fn as_str(&self) -> &str {
    match self {
      Self::Running => "running",
      Self::Success => "success",
      Self::Fail => "fail",
    }
  }
}

impl TryFrom<String> for CronJobLogExecState {
  type Error = sqlx::Error;
  
  fn try_from(s: String) -> Result<Self, sqlx::Error> {
    match s.as_str() {
      "running" => Ok(Self::Running),
      "success" => Ok(Self::Success),
      "fail" => Ok(Self::Fail),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "exec_state".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "CronJobLogExecState can't convert from {s}".to_owned(),
          )),
        }),
      )),
    }
  }
}

/// 定时任务日志 检测字段是否允许前端排序
pub fn check_sort_cron_job_log(
  sort: Option<&[SortInput]>,
) -> Result<()> {
  
  if sort.is_none() {
    return Ok(());
  }
  let sort = sort.unwrap();
  
  let get_can_sort_in_api_cron_job_log = get_can_sort_in_api_cron_job_log();
  
  for item in sort {
    let prop = item.prop.as_str();
    if prop.is_empty() {
      continue;
    }
    if !get_can_sort_in_api_cron_job_log.contains(&prop) {
      return Err(eyre!("check_sort_cron_job_log: {}", serde_json::to_string(item)?));
    }
  }
  
  Ok(())
}

/// 获取路由地址
#[allow(dead_code)]
pub fn get_route_path_cron_job_log() -> String {
  "/cron/cron_job_log".to_owned()
}
