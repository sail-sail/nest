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
use crate::bpm::process_inst::process_inst_model::ProcessInstId;
use crate::bpm::node_inst::node_inst_model::NodeInstId;
use crate::base::usr::usr_model::UsrId;

static CAN_SORT_IN_API_TASK: [&str; 2] = [
  "create_time",
  "update_time",
];

/// 审批任务 前端允许排序的字段
fn get_can_sort_in_api_task() -> &'static [&'static str; 2] {
  &CAN_SORT_IN_API_TASK
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "TaskModel")]
#[allow(dead_code)]
pub struct TaskModel {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: TenantId,
  /// ID
  pub id: TaskId,
  /// 任务标题
  #[graphql(name = "lbl")]
  pub lbl: SmolStr,
  /// 流程实例
  #[graphql(name = "process_inst_id")]
  pub process_inst_id: ProcessInstId,
  /// 流程实例
  #[graphql(name = "process_inst_id_lbl")]
  pub process_inst_id_lbl: SmolStr,
  /// 节点实例
  #[graphql(name = "node_inst_id")]
  pub node_inst_id: NodeInstId,
  /// 节点实例
  #[graphql(name = "node_inst_id_lbl")]
  pub node_inst_id_lbl: SmolStr,
  /// 处理人
  #[graphql(name = "assignee_usr_id")]
  pub assignee_usr_id: UsrId,
  /// 处理人
  #[graphql(name = "assignee_usr_id_lbl")]
  pub assignee_usr_id_lbl: SmolStr,
  /// 任务状态
  #[graphql(name = "status")]
  pub status: TaskStatus,
  /// 任务状态
  #[graphql(name = "status_lbl")]
  pub status_lbl: SmolStr,
  /// 审批动作
  #[graphql(name = "action")]
  pub action: TaskAction,
  /// 审批动作
  #[graphql(name = "action_lbl")]
  pub action_lbl: SmolStr,
  /// 审批意见
  #[graphql(name = "opinion")]
  pub opinion: SmolStr,
  /// 是否已删除
  pub is_deleted: u8,
  /// 创建人
  pub create_usr_id: UsrId,
  /// 创建人
  pub create_usr_id_lbl: SmolStr,
  /// 创建时间
  pub create_time: Option<chrono::NaiveDateTime>,
  /// 创建时间
  pub create_time_lbl: SmolStr,
  /// 更新人
  pub update_usr_id: UsrId,
  /// 更新人
  pub update_usr_id_lbl: SmolStr,
  /// 更新时间
  pub update_time: Option<chrono::NaiveDateTime>,
  /// 更新时间
  pub update_time_lbl: SmolStr,
}

impl FromRow<'_, MySqlRow> for TaskModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;
    // ID
    let id: TaskId = row.try_get("id")?;
    // 任务标题
    let lbl: &str = row.try_get("lbl")?;
    let lbl = SmolStr::new(lbl);
    // 流程实例
    let process_inst_id: ProcessInstId = row.try_get("process_inst_id")?;
    let process_inst_id_lbl: Option<&str> = row.try_get("process_inst_id_lbl")?;
    let process_inst_id_lbl = SmolStr::new(process_inst_id_lbl.unwrap_or_default());
    // 节点实例
    let node_inst_id: NodeInstId = row.try_get("node_inst_id")?;
    let node_inst_id_lbl: Option<&str> = row.try_get("node_inst_id_lbl")?;
    let node_inst_id_lbl = SmolStr::new(node_inst_id_lbl.unwrap_or_default());
    // 处理人
    let assignee_usr_id: UsrId = row.try_get("assignee_usr_id")?;
    let assignee_usr_id_lbl: Option<&str> = row.try_get("assignee_usr_id_lbl")?;
    let assignee_usr_id_lbl = SmolStr::new(assignee_usr_id_lbl.unwrap_or_default());
    // 任务状态
    let status_lbl: &str = row.try_get("status")?;
    let status: TaskStatus = status_lbl.try_into()?;
    let status_lbl = SmolStr::new(status_lbl);
    // 审批动作
    let action_lbl: &str = row.try_get("action")?;
    let action: TaskAction = action_lbl.try_into()?;
    let action_lbl = SmolStr::new(action_lbl);
    // 审批意见
    let opinion: &str = row.try_get("opinion")?;
    let opinion = SmolStr::new(opinion);
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
      lbl,
      process_inst_id,
      process_inst_id_lbl,
      node_inst_id,
      node_inst_id_lbl,
      assignee_usr_id,
      assignee_usr_id_lbl,
      status,
      status_lbl,
      action,
      action_lbl,
      opinion,
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
#[graphql(rename_fields = "snake_case", name = "TaskFieldComment")]
#[allow(dead_code)]
pub struct TaskFieldComment {
  /// ID
  #[graphql(name = "id")]
  pub id: SmolStr,
  /// 任务标题
  #[graphql(name = "lbl")]
  pub lbl: SmolStr,
  /// 流程实例
  #[graphql(name = "process_inst_id")]
  pub process_inst_id: SmolStr,
  /// 流程实例
  #[graphql(name = "process_inst_id_lbl")]
  pub process_inst_id_lbl: SmolStr,
  /// 节点实例
  #[graphql(name = "node_inst_id")]
  pub node_inst_id: SmolStr,
  /// 节点实例
  #[graphql(name = "node_inst_id_lbl")]
  pub node_inst_id_lbl: SmolStr,
  /// 处理人
  #[graphql(name = "assignee_usr_id")]
  pub assignee_usr_id: SmolStr,
  /// 处理人
  #[graphql(name = "assignee_usr_id_lbl")]
  pub assignee_usr_id_lbl: SmolStr,
  /// 任务状态
  #[graphql(name = "status")]
  pub status: SmolStr,
  /// 任务状态
  #[graphql(name = "status_lbl")]
  pub status_lbl: SmolStr,
  /// 审批动作
  #[graphql(name = "action")]
  pub action: SmolStr,
  /// 审批动作
  #[graphql(name = "action_lbl")]
  pub action_lbl: SmolStr,
  /// 审批意见
  #[graphql(name = "opinion")]
  pub opinion: SmolStr,
  /// 创建人
  #[graphql(name = "create_usr_id")]
  pub create_usr_id: SmolStr,
  /// 创建人
  #[graphql(name = "create_usr_id_lbl")]
  pub create_usr_id_lbl: SmolStr,
  /// 创建时间
  #[graphql(name = "create_time")]
  pub create_time: SmolStr,
  /// 创建时间
  #[graphql(name = "create_time_lbl")]
  pub create_time_lbl: SmolStr,
  /// 更新人
  #[graphql(name = "update_usr_id")]
  pub update_usr_id: SmolStr,
  /// 更新人
  #[graphql(name = "update_usr_id_lbl")]
  pub update_usr_id_lbl: SmolStr,
  /// 更新时间
  #[graphql(name = "update_time")]
  pub update_time: SmolStr,
  /// 更新时间
  #[graphql(name = "update_time_lbl")]
  pub update_time_lbl: SmolStr,
}

#[derive(InputObject, Serialize, Deserialize, Default, Clone)]
#[graphql(rename_fields = "snake_case", name = "TaskSearch")]
#[allow(dead_code)]
pub struct TaskSearch {
  /// ID
  pub id: Option<TaskId>,
  /// ID列表
  pub ids: Option<Vec<TaskId>>,
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  pub is_deleted: Option<u8>,
  /// 任务标题
  #[graphql(name = "lbl")]
  pub lbl: Option<SmolStr>,
  /// 任务标题
  #[graphql(name = "lbl_like")]
  pub lbl_like: Option<SmolStr>,
  /// 流程实例
  #[graphql(name = "process_inst_id")]
  pub process_inst_id: Option<Vec<ProcessInstId>>,
  /// 流程实例
  #[graphql(name = "process_inst_id_save_null")]
  pub process_inst_id_is_null: Option<bool>,
  /// 流程实例
  #[graphql(name = "process_inst_id_lbl")]
  pub process_inst_id_lbl: Option<Vec<SmolStr>>,
  /// 流程实例
  #[graphql(name = "process_inst_id_lbl_like")]
  pub process_inst_id_lbl_like: Option<SmolStr>,
  /// 节点实例
  #[graphql(name = "node_inst_id")]
  pub node_inst_id: Option<Vec<NodeInstId>>,
  /// 节点实例
  #[graphql(name = "node_inst_id_save_null")]
  pub node_inst_id_is_null: Option<bool>,
  /// 节点实例
  #[graphql(name = "node_inst_id_lbl")]
  pub node_inst_id_lbl: Option<Vec<SmolStr>>,
  /// 节点实例
  #[graphql(name = "node_inst_id_lbl_like")]
  pub node_inst_id_lbl_like: Option<SmolStr>,
  /// 处理人
  #[graphql(name = "assignee_usr_id")]
  pub assignee_usr_id: Option<Vec<UsrId>>,
  /// 处理人
  #[graphql(name = "assignee_usr_id_save_null")]
  pub assignee_usr_id_is_null: Option<bool>,
  /// 处理人
  #[graphql(name = "assignee_usr_id_lbl")]
  pub assignee_usr_id_lbl: Option<Vec<SmolStr>>,
  /// 处理人
  #[graphql(name = "assignee_usr_id_lbl_like")]
  pub assignee_usr_id_lbl_like: Option<SmolStr>,
  /// 任务状态
  #[graphql(name = "status")]
  pub status: Option<Vec<TaskStatus>>,
  /// 审批动作
  #[graphql(skip)]
  pub action: Option<Vec<TaskAction>>,
  /// 审批意见
  #[graphql(skip)]
  pub opinion: Option<SmolStr>,
  /// 审批意见
  #[graphql(skip)]
  pub opinion_like: Option<SmolStr>,
  /// 创建人
  #[graphql(name = "create_usr_id")]
  pub create_usr_id: Option<Vec<UsrId>>,
  /// 创建人
  #[graphql(name = "create_usr_id_save_null")]
  pub create_usr_id_is_null: Option<bool>,
  /// 创建人
  #[graphql(name = "create_usr_id_lbl")]
  pub create_usr_id_lbl: Option<Vec<SmolStr>>,
  /// 创建人
  #[graphql(name = "create_usr_id_lbl_like")]
  pub create_usr_id_lbl_like: Option<SmolStr>,
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
  pub update_usr_id_lbl: Option<Vec<SmolStr>>,
  /// 更新人
  #[graphql(name = "update_usr_id_lbl_like")]
  pub update_usr_id_lbl_like: Option<SmolStr>,
  /// 更新时间
  #[graphql(skip)]
  pub update_time: Option<[Option<chrono::NaiveDateTime>; 2]>,
}

impl std::fmt::Debug for TaskSearch {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("TaskSearch");
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
    // 任务标题
    if let Some(ref lbl) = self.lbl {
      item = item.field("lbl", lbl);
    }
    if let Some(ref lbl_like) = self.lbl_like {
      item = item.field("lbl_like", lbl_like);
    }
    // 流程实例
    if let Some(ref process_inst_id) = self.process_inst_id {
      item = item.field("process_inst_id", process_inst_id);
    }
    if let Some(ref process_inst_id_lbl) = self.process_inst_id_lbl {
      item = item.field("process_inst_id_lbl", process_inst_id_lbl);
    }
    if let Some(ref process_inst_id_lbl_like) = self.process_inst_id_lbl_like {
      item = item.field("process_inst_id_lbl_like", process_inst_id_lbl_like);
    }
    if let Some(ref process_inst_id_is_null) = self.process_inst_id_is_null {
      item = item.field("process_inst_id_is_null", process_inst_id_is_null);
    }
    // 节点实例
    if let Some(ref node_inst_id) = self.node_inst_id {
      item = item.field("node_inst_id", node_inst_id);
    }
    if let Some(ref node_inst_id_lbl) = self.node_inst_id_lbl {
      item = item.field("node_inst_id_lbl", node_inst_id_lbl);
    }
    if let Some(ref node_inst_id_lbl_like) = self.node_inst_id_lbl_like {
      item = item.field("node_inst_id_lbl_like", node_inst_id_lbl_like);
    }
    if let Some(ref node_inst_id_is_null) = self.node_inst_id_is_null {
      item = item.field("node_inst_id_is_null", node_inst_id_is_null);
    }
    // 处理人
    if let Some(ref assignee_usr_id) = self.assignee_usr_id {
      item = item.field("assignee_usr_id", assignee_usr_id);
    }
    if let Some(ref assignee_usr_id_lbl) = self.assignee_usr_id_lbl {
      item = item.field("assignee_usr_id_lbl", assignee_usr_id_lbl);
    }
    if let Some(ref assignee_usr_id_lbl_like) = self.assignee_usr_id_lbl_like {
      item = item.field("assignee_usr_id_lbl_like", assignee_usr_id_lbl_like);
    }
    if let Some(ref assignee_usr_id_is_null) = self.assignee_usr_id_is_null {
      item = item.field("assignee_usr_id_is_null", assignee_usr_id_is_null);
    }
    // 任务状态
    if let Some(ref status) = self.status {
      item = item.field("status", status);
    }
    // 审批动作
    if let Some(ref action) = self.action {
      item = item.field("action", action);
    }
    // 审批意见
    if let Some(ref opinion) = self.opinion {
      item = item.field("opinion", opinion);
    }
    if let Some(ref opinion_like) = self.opinion_like {
      item = item.field("opinion_like", opinion_like);
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
#[graphql(rename_fields = "snake_case", name = "TaskInput")]
#[allow(dead_code)]
pub struct TaskInput {
  /// ID
  pub id: Option<TaskId>,
  /// 已删除
  #[graphql(skip)]
  pub is_deleted: Option<u8>,
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  /// 任务标题
  #[graphql(name = "lbl")]
  pub lbl: Option<SmolStr>,
  /// 流程实例
  #[graphql(name = "process_inst_id")]
  pub process_inst_id: Option<ProcessInstId>,
  /// 流程实例
  #[graphql(name = "process_inst_id_lbl")]
  pub process_inst_id_lbl: Option<SmolStr>,
  /// 节点实例
  #[graphql(name = "node_inst_id")]
  pub node_inst_id: Option<NodeInstId>,
  /// 节点实例
  #[graphql(name = "node_inst_id_lbl")]
  pub node_inst_id_lbl: Option<SmolStr>,
  /// 处理人
  #[graphql(name = "assignee_usr_id")]
  pub assignee_usr_id: Option<UsrId>,
  /// 处理人
  #[graphql(name = "assignee_usr_id_lbl")]
  pub assignee_usr_id_lbl: Option<SmolStr>,
  /// 任务状态
  #[graphql(name = "status")]
  pub status: Option<TaskStatus>,
  /// 任务状态
  #[graphql(name = "status_lbl")]
  pub status_lbl: Option<SmolStr>,
  /// 审批动作
  #[graphql(name = "action")]
  pub action: Option<TaskAction>,
  /// 审批动作
  #[graphql(name = "action_lbl")]
  pub action_lbl: Option<SmolStr>,
  /// 审批意见
  #[graphql(name = "opinion")]
  pub opinion: Option<SmolStr>,
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

impl std::fmt::Debug for TaskInput {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("TaskInput");
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
    if let Some(ref process_inst_id) = self.process_inst_id {
      item = item.field("process_inst_id", process_inst_id);
    }
    if let Some(ref process_inst_id_lbl) = self.process_inst_id_lbl {
      item = item.field("process_inst_id_lbl", process_inst_id_lbl);
    }
    if let Some(ref node_inst_id) = self.node_inst_id {
      item = item.field("node_inst_id", node_inst_id);
    }
    if let Some(ref node_inst_id_lbl) = self.node_inst_id_lbl {
      item = item.field("node_inst_id_lbl", node_inst_id_lbl);
    }
    if let Some(ref assignee_usr_id) = self.assignee_usr_id {
      item = item.field("assignee_usr_id", assignee_usr_id);
    }
    if let Some(ref assignee_usr_id_lbl) = self.assignee_usr_id_lbl {
      item = item.field("assignee_usr_id_lbl", assignee_usr_id_lbl);
    }
    if let Some(ref status) = self.status {
      item = item.field("status", status);
    }
    if let Some(ref action) = self.action {
      item = item.field("action", action);
    }
    if let Some(ref opinion) = self.opinion {
      item = item.field("opinion", opinion);
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

impl From<TaskModel> for TaskInput {
  fn from(model: TaskModel) -> Self {
    Self {
      id: model.id.into(),
      is_deleted: model.is_deleted.into(),
      tenant_id: model.tenant_id.into(),
      // 任务标题
      lbl: model.lbl.into(),
      // 流程实例
      process_inst_id: model.process_inst_id.into(),
      process_inst_id_lbl: model.process_inst_id_lbl.into(),
      // 节点实例
      node_inst_id: model.node_inst_id.into(),
      node_inst_id_lbl: model.node_inst_id_lbl.into(),
      // 处理人
      assignee_usr_id: model.assignee_usr_id.into(),
      assignee_usr_id_lbl: model.assignee_usr_id_lbl.into(),
      // 任务状态
      status: model.status.into(),
      status_lbl: model.status_lbl.into(),
      // 审批动作
      action: model.action.into(),
      action_lbl: model.action_lbl.into(),
      // 审批意见
      opinion: model.opinion.into(),
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

impl From<TaskInput> for TaskSearch {
  fn from(input: TaskInput) -> Self {
    Self {
      id: input.id,
      ids: None,
      // 租户ID
      tenant_id: input.tenant_id,
      is_deleted: None,
      // 任务标题
      lbl: input.lbl,
      // 流程实例
      process_inst_id: input.process_inst_id.map(|x| vec![x]),
      // 流程实例
      process_inst_id_lbl: input.process_inst_id_lbl.map(|x| vec![x]),
      // 节点实例
      node_inst_id: input.node_inst_id.map(|x| vec![x]),
      // 节点实例
      node_inst_id_lbl: input.node_inst_id_lbl.map(|x| vec![x]),
      // 处理人
      assignee_usr_id: input.assignee_usr_id.map(|x| vec![x]),
      // 处理人
      assignee_usr_id_lbl: input.assignee_usr_id_lbl.map(|x| vec![x]),
      // 任务状态
      status: input.status.map(|x| vec![x]),
      // 审批动作
      action: input.action.map(|x| vec![x]),
      // 审批意见
      opinion: input.opinion,
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

impl_id!(TaskId);

/// 审批任务任务状态
#[derive(Enum, Copy, Clone, Default, Eq, PartialEq, Serialize, Deserialize, Debug)]
pub enum TaskStatus {
  /// 待处理
  #[default]
  #[graphql(name="pending")]
  #[serde(rename = "pending")]
  Pending,
  /// 已同意
  #[graphql(name="approved")]
  #[serde(rename = "approved")]
  Approved,
  /// 已拒绝
  #[graphql(name="rejected")]
  #[serde(rename = "rejected")]
  Rejected,
  /// 已转交
  #[graphql(name="transferred")]
  #[serde(rename = "transferred")]
  Transferred,
  /// 已撤回
  #[graphql(name="revoked")]
  #[serde(rename = "revoked")]
  Revoked,
}

impl fmt::Display for TaskStatus {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    match self {
      Self::Pending => write!(f, "pending"),
      Self::Approved => write!(f, "approved"),
      Self::Rejected => write!(f, "rejected"),
      Self::Transferred => write!(f, "transferred"),
      Self::Revoked => write!(f, "revoked"),
    }
  }
}

impl From<TaskStatus> for SmolStr {
  fn from(value: TaskStatus) -> Self {
    match value {
      TaskStatus::Pending => "pending".into(),
      TaskStatus::Approved => "approved".into(),
      TaskStatus::Rejected => "rejected".into(),
      TaskStatus::Transferred => "transferred".into(),
      TaskStatus::Revoked => "revoked".into(),
    }
  }
}

impl From<TaskStatus> for String {
  fn from(value: TaskStatus) -> Self {
    match value {
      TaskStatus::Pending => "pending".into(),
      TaskStatus::Approved => "approved".into(),
      TaskStatus::Rejected => "rejected".into(),
      TaskStatus::Transferred => "transferred".into(),
      TaskStatus::Revoked => "revoked".into(),
    }
  }
}

impl From<TaskStatus> for ArgType {
  fn from(value: TaskStatus) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl FromStr for TaskStatus {
  type Err = color_eyre::eyre::Error;
  
  fn from_str(s: &str) -> Result<Self, Self::Err> {
    match s {
      "pending" => Ok(Self::Pending),
      "approved" => Ok(Self::Approved),
      "rejected" => Ok(Self::Rejected),
      "transferred" => Ok(Self::Transferred),
      "revoked" => Ok(Self::Revoked),
      _ => Err(eyre!("{s} 无法转换到 任务状态")),
    }
  }
}

impl TryFrom<&str> for TaskStatus {
  type Error = sqlx::Error;
  
  fn try_from(s: &str) -> Result<Self, sqlx::Error> {
    match s {
      "pending" => Ok(Self::Pending),
      "approved" => Ok(Self::Approved),
      "rejected" => Ok(Self::Rejected),
      "transferred" => Ok(Self::Transferred),
      "revoked" => Ok(Self::Revoked),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "status".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "{s} 无法转换到 任务状态".to_owned(),
          )),
        }),
      )),
    }
  }
}

impl TryFrom<SmolStr> for TaskStatus {
  type Error = sqlx::Error;
  
  fn try_from(s: SmolStr) -> Result<Self, sqlx::Error> {
    match s.as_str() {
      "pending" => Ok(Self::Pending),
      "approved" => Ok(Self::Approved),
      "rejected" => Ok(Self::Rejected),
      "transferred" => Ok(Self::Transferred),
      "revoked" => Ok(Self::Revoked),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "status".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "{s} 无法转换到 任务状态".to_owned(),
          )),
        }),
      )),
    }
  }
}

impl TaskStatus {
  pub fn as_str(&self) -> &str {
    match self {
      Self::Pending => "pending",
      Self::Approved => "approved",
      Self::Rejected => "rejected",
      Self::Transferred => "transferred",
      Self::Revoked => "revoked",
    }
  }
}

impl TryFrom<String> for TaskStatus {
  type Error = sqlx::Error;
  
  fn try_from(s: String) -> Result<Self, sqlx::Error> {
    match s.as_str() {
      "pending" => Ok(Self::Pending),
      "approved" => Ok(Self::Approved),
      "rejected" => Ok(Self::Rejected),
      "transferred" => Ok(Self::Transferred),
      "revoked" => Ok(Self::Revoked),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "status".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "{s} 无法转换到 任务状态".to_owned(),
          )),
        }),
      )),
    }
  }
}

/// 审批任务审批动作
#[derive(Enum, Copy, Clone, Default, Eq, PartialEq, Serialize, Deserialize, Debug)]
pub enum TaskAction {
  /// 同意
  #[graphql(name="approve")]
  #[serde(rename = "approve")]
  Approve,
  /// 待审批
  #[default]
  #[graphql(name="pending")]
  #[serde(rename = "pending")]
  Pending,
  /// 拒绝
  #[graphql(name="reject")]
  #[serde(rename = "reject")]
  Reject,
  /// 转交
  #[graphql(name="transfer")]
  #[serde(rename = "transfer")]
  Transfer,
  /// 退回
  #[graphql(name="return")]
  #[serde(rename = "return")]
  Return,
  /// 加签
  #[graphql(name="add_sign")]
  #[serde(rename = "add_sign")]
  AddSign,
}

impl fmt::Display for TaskAction {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    match self {
      Self::Approve => write!(f, "approve"),
      Self::Pending => write!(f, "pending"),
      Self::Reject => write!(f, "reject"),
      Self::Transfer => write!(f, "transfer"),
      Self::Return => write!(f, "return"),
      Self::AddSign => write!(f, "add_sign"),
    }
  }
}

impl From<TaskAction> for SmolStr {
  fn from(value: TaskAction) -> Self {
    match value {
      TaskAction::Approve => "approve".into(),
      TaskAction::Pending => "pending".into(),
      TaskAction::Reject => "reject".into(),
      TaskAction::Transfer => "transfer".into(),
      TaskAction::Return => "return".into(),
      TaskAction::AddSign => "add_sign".into(),
    }
  }
}

impl From<TaskAction> for String {
  fn from(value: TaskAction) -> Self {
    match value {
      TaskAction::Approve => "approve".into(),
      TaskAction::Pending => "pending".into(),
      TaskAction::Reject => "reject".into(),
      TaskAction::Transfer => "transfer".into(),
      TaskAction::Return => "return".into(),
      TaskAction::AddSign => "add_sign".into(),
    }
  }
}

impl From<TaskAction> for ArgType {
  fn from(value: TaskAction) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl FromStr for TaskAction {
  type Err = color_eyre::eyre::Error;
  
  fn from_str(s: &str) -> Result<Self, Self::Err> {
    match s {
      "approve" => Ok(Self::Approve),
      "pending" => Ok(Self::Pending),
      "reject" => Ok(Self::Reject),
      "transfer" => Ok(Self::Transfer),
      "return" => Ok(Self::Return),
      "add_sign" => Ok(Self::AddSign),
      _ => Err(eyre!("{s} 无法转换到 审批动作")),
    }
  }
}

impl TryFrom<&str> for TaskAction {
  type Error = sqlx::Error;
  
  fn try_from(s: &str) -> Result<Self, sqlx::Error> {
    match s {
      "approve" => Ok(Self::Approve),
      "pending" => Ok(Self::Pending),
      "reject" => Ok(Self::Reject),
      "transfer" => Ok(Self::Transfer),
      "return" => Ok(Self::Return),
      "add_sign" => Ok(Self::AddSign),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "action".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "{s} 无法转换到 审批动作".to_owned(),
          )),
        }),
      )),
    }
  }
}

impl TryFrom<SmolStr> for TaskAction {
  type Error = sqlx::Error;
  
  fn try_from(s: SmolStr) -> Result<Self, sqlx::Error> {
    match s.as_str() {
      "approve" => Ok(Self::Approve),
      "pending" => Ok(Self::Pending),
      "reject" => Ok(Self::Reject),
      "transfer" => Ok(Self::Transfer),
      "return" => Ok(Self::Return),
      "add_sign" => Ok(Self::AddSign),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "action".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "{s} 无法转换到 审批动作".to_owned(),
          )),
        }),
      )),
    }
  }
}

impl TaskAction {
  pub fn as_str(&self) -> &str {
    match self {
      Self::Approve => "approve",
      Self::Pending => "pending",
      Self::Reject => "reject",
      Self::Transfer => "transfer",
      Self::Return => "return",
      Self::AddSign => "add_sign",
    }
  }
}

impl TryFrom<String> for TaskAction {
  type Error = sqlx::Error;
  
  fn try_from(s: String) -> Result<Self, sqlx::Error> {
    match s.as_str() {
      "approve" => Ok(Self::Approve),
      "pending" => Ok(Self::Pending),
      "reject" => Ok(Self::Reject),
      "transfer" => Ok(Self::Transfer),
      "return" => Ok(Self::Return),
      "add_sign" => Ok(Self::AddSign),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "action".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "{s} 无法转换到 审批动作".to_owned(),
          )),
        }),
      )),
    }
  }
}

/// 审批任务 检测字段是否允许前端排序
pub fn check_sort_task(
  sort: Option<&[SortInput]>,
) -> Result<()> {
  
  if sort.is_none() {
    return Ok(());
  }
  
  let sort = sort.unwrap_or_default();
  
  if sort.is_empty() {
    return Ok(());
  }
  
  let get_can_sort_in_api_task = get_can_sort_in_api_task();
  
  for item in sort {
    let prop = item.prop.as_str();
    if prop.is_empty() {
      continue;
    }
    if !get_can_sort_in_api_task.contains(&prop) {
      return Err(eyre!(ServiceException {
        message: format!("check_sort_task: {}", serde_json::to_string(item)?).into(),
        trace: true,
        ..Default::default()
      }));
    }
  }
  
  Ok(())
}

// MARK: get_page_path_task
pub fn get_page_path_task() -> &'static str {
  "/bpm/task"
}

// MARK: get_table_name_task
pub fn get_table_name_task() -> &'static str {
  "bpm_task"
}
