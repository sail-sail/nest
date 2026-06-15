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
use crate::cron::cron_job::cron_job_model::CronJobId;
use crate::base::usr::usr_model::UsrId;

static CAN_SORT_IN_API_CRON_JOB_LOG: [&str; 2] = [
  "create_time",
  "update_time",
];

/// 定时任务日志 前端允许排序的字段
fn get_can_sort_in_api_cron_job_log() -> &'static [&'static str; 2] {
  &CAN_SORT_IN_API_CRON_JOB_LOG
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
  pub cron_job_id_lbl: SmolStr,
  /// 执行状态
  #[graphql(name = "exec_state")]
  pub exec_state: CronJobLogExecState,
  /// 执行状态
  #[graphql(name = "exec_state_lbl")]
  pub exec_state_lbl: SmolStr,
  /// 执行结果
  #[graphql(name = "exec_result")]
  pub exec_result: SmolStr,
  /// 开始时间
  #[graphql(name = "begin_time")]
  pub begin_time: Option<chrono::NaiveDateTime>,
  /// 开始时间
  #[graphql(name = "begin_time_lbl")]
  pub begin_time_lbl: SmolStr,
  /// 结束时间
  #[graphql(name = "end_time")]
  pub end_time: Option<chrono::NaiveDateTime>,
  /// 结束时间
  #[graphql(name = "end_time_lbl")]
  pub end_time_lbl: SmolStr,
  /// 备注
  #[graphql(name = "rem")]
  pub rem: SmolStr,
  /// 是否已删除
  pub is_deleted: u8,
  /// 创建人
  #[graphql(skip)]
  pub create_usr_id: UsrId,
  /// 创建人
  #[graphql(skip)]
  pub create_usr_id_lbl: SmolStr,
  /// 创建时间
  pub create_time: Option<chrono::NaiveDateTime>,
  /// 创建时间
  pub create_time_lbl: SmolStr,
  /// 更新人
  #[graphql(skip)]
  pub update_usr_id: UsrId,
  /// 更新人
  #[graphql(skip)]
  pub update_usr_id_lbl: SmolStr,
  /// 更新时间
  #[graphql(skip)]
  pub update_time: Option<chrono::NaiveDateTime>,
  /// 更新时间
  #[graphql(skip)]
  pub update_time_lbl: SmolStr,
}

impl FromRow<'_, MySqlRow> for CronJobLogModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;
    // ID
    let id: CronJobLogId = row.try_get("id")?;
    // 定时任务
    let cron_job_id: CronJobId = row.try_get("cron_job_id")?;
    let cron_job_id_lbl: Option<&str> = row.try_get("cron_job_id_lbl")?;
    let cron_job_id_lbl = SmolStr::new(cron_job_id_lbl.unwrap_or_default());
    // 执行状态
    let exec_state_lbl: &str = row.try_get("exec_state")?;
    let exec_state: CronJobLogExecState = exec_state_lbl.try_into()?;
    let exec_state_lbl = SmolStr::new(exec_state_lbl);
    // 执行结果
    let exec_result: &str = row.try_get("exec_result")?;
    let exec_result = SmolStr::new(exec_result);
    // 开始时间
    let begin_time: Option<chrono::NaiveDateTime> = row.try_get("begin_time")?;
    let begin_time_lbl: SmolStr = match begin_time {
      Some(item) => SmolStr::new(item.format("%Y-%m-%d %H:%M:%S").to_string()),
      None => SmolStr::new(""),
    };
    // 结束时间
    let end_time: Option<chrono::NaiveDateTime> = row.try_get("end_time")?;
    let end_time_lbl: SmolStr = match end_time {
      Some(item) => SmolStr::new(item.format("%Y-%m-%d %H:%M:%S").to_string()),
      None => SmolStr::new(""),
    };
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
#[graphql(rename_fields = "snake_case", name = "CronJobLogFieldComment")]
#[allow(dead_code)]
pub struct CronJobLogFieldComment {
  /// ID
  #[graphql(name = "id")]
  pub id: SmolStr,
  /// 定时任务
  #[graphql(name = "cron_job_id")]
  pub cron_job_id: SmolStr,
  /// 定时任务
  #[graphql(name = "cron_job_id_lbl")]
  pub cron_job_id_lbl: SmolStr,
  /// 执行状态
  #[graphql(name = "exec_state")]
  pub exec_state: SmolStr,
  /// 执行状态
  #[graphql(name = "exec_state_lbl")]
  pub exec_state_lbl: SmolStr,
  /// 执行结果
  #[graphql(name = "exec_result")]
  pub exec_result: SmolStr,
  /// 开始时间
  #[graphql(name = "begin_time")]
  pub begin_time: SmolStr,
  /// 开始时间
  #[graphql(name = "begin_time_lbl")]
  pub begin_time_lbl: SmolStr,
  /// 结束时间
  #[graphql(name = "end_time")]
  pub end_time: SmolStr,
  /// 结束时间
  #[graphql(name = "end_time_lbl")]
  pub end_time_lbl: SmolStr,
  /// 备注
  #[graphql(name = "rem")]
  pub rem: SmolStr,
  /// 创建时间
  #[graphql(name = "create_time")]
  pub create_time: SmolStr,
  /// 创建时间
  #[graphql(name = "create_time_lbl")]
  pub create_time_lbl: SmolStr,
}

#[derive(InputObject, Serialize, Deserialize, Default, Clone)]
#[graphql(rename_fields = "snake_case", name = "CronJobLogSearch")]
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
  pub cron_job_id_lbl: Option<Vec<SmolStr>>,
  /// 定时任务
  #[graphql(name = "cron_job_id_lbl_like")]
  pub cron_job_id_lbl_like: Option<SmolStr>,
  /// 执行状态
  #[graphql(name = "exec_state")]
  pub exec_state: Option<Vec<CronJobLogExecState>>,
  /// 执行结果
  #[graphql(skip)]
  pub exec_result: Option<SmolStr>,
  /// 执行结果
  #[graphql(skip)]
  pub exec_result_like: Option<SmolStr>,
  /// 开始时间
  #[graphql(name = "begin_time")]
  pub begin_time: Option<[Option<chrono::NaiveDateTime>; 2]>,
  /// 结束时间
  #[graphql(skip)]
  pub end_time: Option<[Option<chrono::NaiveDateTime>; 2]>,
  /// 备注
  #[graphql(skip)]
  pub rem: Option<SmolStr>,
  /// 备注
  #[graphql(skip)]
  pub rem_like: Option<SmolStr>,
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
  pub create_usr_id_lbl: Option<Vec<SmolStr>>,
  /// 创建人
  #[graphql(skip)]
  pub create_usr_id_lbl_like: Option<SmolStr>,
  /// 更新人
  #[graphql(skip)]
  pub update_usr_id: Option<Vec<UsrId>>,
  /// 更新人
  #[graphql(skip)]
  pub update_usr_id_is_null: Option<bool>,
  /// 更新人
  #[graphql(skip)]
  pub update_usr_id_lbl: Option<Vec<SmolStr>>,
  /// 更新人
  #[graphql(skip)]
  pub update_usr_id_lbl_like: Option<SmolStr>,
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
    if let Some(ref cron_job_id_lbl) = self.cron_job_id_lbl {
      item = item.field("cron_job_id_lbl", cron_job_id_lbl);
    }
    if let Some(ref cron_job_id_lbl_like) = self.cron_job_id_lbl_like {
      item = item.field("cron_job_id_lbl_like", cron_job_id_lbl_like);
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
    if let Some(ref create_usr_id_lbl) = self.create_usr_id_lbl {
      item = item.field("create_usr_id_lbl", create_usr_id_lbl);
    }
    if let Some(ref create_usr_id_lbl_like) = self.create_usr_id_lbl_like {
      item = item.field("create_usr_id_lbl_like", create_usr_id_lbl_like);
    }
    if let Some(ref create_usr_id_is_null) = self.create_usr_id_is_null {
      item = item.field("create_usr_id_is_null", create_usr_id_is_null);
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
  pub cron_job_id_lbl: Option<SmolStr>,
  /// 执行状态
  #[graphql(name = "exec_state")]
  pub exec_state: Option<CronJobLogExecState>,
  /// 执行状态
  #[graphql(name = "exec_state_lbl")]
  pub exec_state_lbl: Option<SmolStr>,
  /// 执行结果
  #[graphql(name = "exec_result")]
  pub exec_result: Option<SmolStr>,
  /// 开始时间
  #[graphql(name = "begin_time")]
  pub begin_time: Option<chrono::NaiveDateTime>,
  /// 开始时间
  #[graphql(name = "begin_time_lbl")]
  pub begin_time_lbl: Option<SmolStr>,
  /// 开始时间
  #[graphql(name = "begin_time_save_null")]
  pub begin_time_save_null: Option<bool>,
  /// 结束时间
  #[graphql(name = "end_time")]
  pub end_time: Option<chrono::NaiveDateTime>,
  /// 结束时间
  #[graphql(name = "end_time_lbl")]
  pub end_time_lbl: Option<SmolStr>,
  /// 结束时间
  #[graphql(name = "end_time_save_null")]
  pub end_time_save_null: Option<bool>,
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

impl std::fmt::Debug for CronJobLogInput {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("CronJobLogInput");
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
    if let Some(ref cron_job_id) = self.cron_job_id {
      item = item.field("cron_job_id", cron_job_id);
    }
    if let Some(ref exec_state) = self.exec_state {
      item = item.field("exec_state", exec_state);
    }
    if let Some(ref exec_result) = self.exec_result {
      item = item.field("exec_result", exec_result);
    }
    if let Some(ref begin_time) = self.begin_time {
      item = item.field("begin_time", begin_time);
    }
    if let Some(ref end_time) = self.end_time {
      item = item.field("end_time", end_time);
    }
    if let Some(ref rem) = self.rem {
      item = item.field("rem", rem);
    }
    if let Some(ref create_time) = self.create_time {
      item = item.field("create_time", create_time);
    }
    if let Some(ref create_usr_id) = self.create_usr_id {
      item = item.field("create_usr_id", create_usr_id);
    }
    if let Some(ref create_usr_id_lbl) = self.create_usr_id_lbl {
      item = item.field("create_usr_id_lbl", create_usr_id_lbl);
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

impl_id!(CronJobLogId);

/// 定时任务日志执行状态
#[derive(Enum, Copy, Clone, Default, Eq, PartialEq, Serialize, Deserialize, Debug)]
pub enum CronJobLogExecState {
  /// 执行中
  #[default]
  #[graphql(name="running")]
  #[serde(rename = "running")]
  Running,
  /// 成功
  #[graphql(name="success")]
  #[serde(rename = "success")]
  Success,
  /// 失败
  #[graphql(name="fail")]
  #[serde(rename = "fail")]
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
      _ => Err(eyre!("{s} 无法转换到 执行状态")),
    }
  }
}

impl TryFrom<&str> for CronJobLogExecState {
  type Error = sqlx::Error;
  
  fn try_from(s: &str) -> Result<Self, sqlx::Error> {
    match s {
      "running" => Ok(Self::Running),
      "success" => Ok(Self::Success),
      "fail" => Ok(Self::Fail),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "exec_state".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "{s} 无法转换到 执行状态".to_owned(),
          )),
        }),
      )),
    }
  }
}

impl TryFrom<SmolStr> for CronJobLogExecState {
  type Error = sqlx::Error;
  
  fn try_from(s: SmolStr) -> Result<Self, sqlx::Error> {
    match s.as_str() {
      "running" => Ok(Self::Running),
      "success" => Ok(Self::Success),
      "fail" => Ok(Self::Fail),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "exec_state".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "{s} 无法转换到 执行状态".to_owned(),
          )),
        }),
      )),
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
            "{s} 无法转换到 执行状态".to_owned(),
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
  
  let sort = sort.unwrap_or_default();
  
  if sort.is_empty() {
    return Ok(());
  }
  
  let get_can_sort_in_api_cron_job_log = get_can_sort_in_api_cron_job_log();
  
  for item in sort {
    let prop = item.prop.as_str();
    if prop.is_empty() {
      continue;
    }
    if !get_can_sort_in_api_cron_job_log.contains(&prop) {
      return Err(eyre!(ServiceException {
        message: format!("check_sort_cron_job_log: {}", serde_json::to_string(item)?).into(),
        trace: true,
        ..Default::default()
      }));
    }
  }
  
  Ok(())
}

// MARK: get_page_path_cron_job_log
pub fn get_page_path_cron_job_log() -> &'static str {
  "/cron/cron_job_log"
}

// MARK: get_table_name_cron_job_log
pub fn get_table_name_cron_job_log() -> &'static str {
  "cron_cron_job_log"
}
