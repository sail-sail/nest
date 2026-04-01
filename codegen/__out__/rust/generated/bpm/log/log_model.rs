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
use crate::bpm::task::task_model::TaskId;
use crate::base::usr::usr_model::UsrId;

static CAN_SORT_IN_API_LOG: [&str; 3] = [
  "create_time",
  "update_time",
  "log_time",
];

/// 流程日志 前端允许排序的字段
fn get_can_sort_in_api_log() -> &'static [&'static str; 3] {
  &CAN_SORT_IN_API_LOG
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "LogModel")]
#[allow(dead_code)]
pub struct LogModel {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: TenantId,
  /// ID
  pub id: LogId,
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
  /// 关联任务
  #[graphql(name = "task_id")]
  pub task_id: TaskId,
  /// 关联任务
  #[graphql(name = "task_id_lbl")]
  pub task_id_lbl: SmolStr,
  /// 动作
  #[graphql(name = "action")]
  pub action: LogAction,
  /// 动作
  #[graphql(name = "action_lbl")]
  pub action_lbl: SmolStr,
  /// 操作人
  #[graphql(name = "usr_id")]
  pub usr_id: UsrId,
  /// 操作人
  #[graphql(name = "usr_id_lbl")]
  pub usr_id_lbl: SmolStr,
  /// 意见
  #[graphql(name = "opinion")]
  pub opinion: SmolStr,
  /// 节点名称
  #[graphql(name = "node_label")]
  pub node_label: SmolStr,
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

impl FromRow<'_, MySqlRow> for LogModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;
    // ID
    let id: LogId = row.try_get("id")?;
    // 流程实例
    let process_inst_id: ProcessInstId = row.try_get("process_inst_id")?;
    let process_inst_id_lbl: Option<&str> = row.try_get("process_inst_id_lbl")?;
    let process_inst_id_lbl = SmolStr::new(process_inst_id_lbl.unwrap_or_default());
    // 节点实例
    let node_inst_id: NodeInstId = row.try_get("node_inst_id")?;
    let node_inst_id_lbl: Option<&str> = row.try_get("node_inst_id_lbl")?;
    let node_inst_id_lbl = SmolStr::new(node_inst_id_lbl.unwrap_or_default());
    // 关联任务
    let task_id: TaskId = row.try_get("task_id")?;
    let task_id_lbl: Option<&str> = row.try_get("task_id_lbl")?;
    let task_id_lbl = SmolStr::new(task_id_lbl.unwrap_or_default());
    // 动作
    let action_lbl: &str = row.try_get("action")?;
    let action: LogAction = action_lbl.try_into()?;
    let action_lbl = SmolStr::new(action_lbl);
    // 操作人
    let usr_id: UsrId = row.try_get("usr_id")?;
    let usr_id_lbl: Option<&str> = row.try_get("usr_id_lbl")?;
    let usr_id_lbl = SmolStr::new(usr_id_lbl.unwrap_or_default());
    // 意见
    let opinion: &str = row.try_get("opinion")?;
    let opinion = SmolStr::new(opinion);
    // 节点名称
    let node_label: &str = row.try_get("node_label")?;
    let node_label = SmolStr::new(node_label);
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
      process_inst_id,
      process_inst_id_lbl,
      node_inst_id,
      node_inst_id_lbl,
      task_id,
      task_id_lbl,
      action,
      action_lbl,
      usr_id,
      usr_id_lbl,
      opinion,
      node_label,
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
#[graphql(rename_fields = "snake_case", name = "LogFieldComment")]
#[allow(dead_code)]
pub struct LogFieldComment {
  /// ID
  #[graphql(name = "id")]
  pub id: SmolStr,
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
  /// 关联任务
  #[graphql(name = "task_id")]
  pub task_id: SmolStr,
  /// 关联任务
  #[graphql(name = "task_id_lbl")]
  pub task_id_lbl: SmolStr,
  /// 动作
  #[graphql(name = "action")]
  pub action: SmolStr,
  /// 动作
  #[graphql(name = "action_lbl")]
  pub action_lbl: SmolStr,
  /// 操作人
  #[graphql(name = "usr_id")]
  pub usr_id: SmolStr,
  /// 操作人
  #[graphql(name = "usr_id_lbl")]
  pub usr_id_lbl: SmolStr,
  /// 意见
  #[graphql(name = "opinion")]
  pub opinion: SmolStr,
  /// 节点名称
  #[graphql(name = "node_label")]
  pub node_label: SmolStr,
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
#[graphql(rename_fields = "snake_case", name = "LogSearch")]
#[allow(dead_code)]
pub struct LogSearch {
  /// ID
  pub id: Option<LogId>,
  /// ID列表
  pub ids: Option<Vec<LogId>>,
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  pub is_deleted: Option<u8>,
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
  /// 关联任务
  #[graphql(name = "task_id")]
  pub task_id: Option<Vec<TaskId>>,
  /// 关联任务
  #[graphql(name = "task_id_save_null")]
  pub task_id_is_null: Option<bool>,
  /// 关联任务
  #[graphql(name = "task_id_lbl")]
  pub task_id_lbl: Option<Vec<SmolStr>>,
  /// 关联任务
  #[graphql(name = "task_id_lbl_like")]
  pub task_id_lbl_like: Option<SmolStr>,
  /// 动作
  #[graphql(name = "action")]
  pub action: Option<Vec<LogAction>>,
  /// 操作人
  #[graphql(name = "usr_id")]
  pub usr_id: Option<Vec<UsrId>>,
  /// 操作人
  #[graphql(name = "usr_id_save_null")]
  pub usr_id_is_null: Option<bool>,
  /// 操作人
  #[graphql(name = "usr_id_lbl")]
  pub usr_id_lbl: Option<Vec<SmolStr>>,
  /// 操作人
  #[graphql(name = "usr_id_lbl_like")]
  pub usr_id_lbl_like: Option<SmolStr>,
  /// 意见
  #[graphql(skip)]
  pub opinion: Option<SmolStr>,
  /// 意见
  #[graphql(skip)]
  pub opinion_like: Option<SmolStr>,
  /// 节点名称
  #[graphql(skip)]
  pub node_label: Option<SmolStr>,
  /// 节点名称
  #[graphql(skip)]
  pub node_label_like: Option<SmolStr>,
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

impl std::fmt::Debug for LogSearch {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("LogSearch");
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
    // 关联任务
    if let Some(ref task_id) = self.task_id {
      item = item.field("task_id", task_id);
    }
    if let Some(ref task_id_lbl) = self.task_id_lbl {
      item = item.field("task_id_lbl", task_id_lbl);
    }
    if let Some(ref task_id_lbl_like) = self.task_id_lbl_like {
      item = item.field("task_id_lbl_like", task_id_lbl_like);
    }
    if let Some(ref task_id_is_null) = self.task_id_is_null {
      item = item.field("task_id_is_null", task_id_is_null);
    }
    // 动作
    if let Some(ref action) = self.action {
      item = item.field("action", action);
    }
    // 操作人
    if let Some(ref usr_id) = self.usr_id {
      item = item.field("usr_id", usr_id);
    }
    if let Some(ref usr_id_lbl) = self.usr_id_lbl {
      item = item.field("usr_id_lbl", usr_id_lbl);
    }
    if let Some(ref usr_id_lbl_like) = self.usr_id_lbl_like {
      item = item.field("usr_id_lbl_like", usr_id_lbl_like);
    }
    if let Some(ref usr_id_is_null) = self.usr_id_is_null {
      item = item.field("usr_id_is_null", usr_id_is_null);
    }
    // 意见
    if let Some(ref opinion) = self.opinion {
      item = item.field("opinion", opinion);
    }
    if let Some(ref opinion_like) = self.opinion_like {
      item = item.field("opinion_like", opinion_like);
    }
    // 节点名称
    if let Some(ref node_label) = self.node_label {
      item = item.field("node_label", node_label);
    }
    if let Some(ref node_label_like) = self.node_label_like {
      item = item.field("node_label_like", node_label_like);
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
#[graphql(rename_fields = "snake_case", name = "LogInput")]
#[allow(dead_code)]
pub struct LogInput {
  /// ID
  pub id: Option<LogId>,
  /// 已删除
  #[graphql(skip)]
  pub is_deleted: Option<u8>,
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
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
  /// 关联任务
  #[graphql(name = "task_id")]
  pub task_id: Option<TaskId>,
  /// 关联任务
  #[graphql(name = "task_id_lbl")]
  pub task_id_lbl: Option<SmolStr>,
  /// 动作
  #[graphql(name = "action")]
  pub action: Option<LogAction>,
  /// 动作
  #[graphql(name = "action_lbl")]
  pub action_lbl: Option<SmolStr>,
  /// 操作人
  #[graphql(name = "usr_id")]
  pub usr_id: Option<UsrId>,
  /// 操作人
  #[graphql(name = "usr_id_lbl")]
  pub usr_id_lbl: Option<SmolStr>,
  /// 意见
  #[graphql(name = "opinion")]
  pub opinion: Option<SmolStr>,
  /// 节点名称
  #[graphql(name = "node_label")]
  pub node_label: Option<SmolStr>,
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

impl std::fmt::Debug for LogInput {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("LogInput");
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
    if let Some(ref task_id) = self.task_id {
      item = item.field("task_id", task_id);
    }
    if let Some(ref task_id_lbl) = self.task_id_lbl {
      item = item.field("task_id_lbl", task_id_lbl);
    }
    if let Some(ref action) = self.action {
      item = item.field("action", action);
    }
    if let Some(ref usr_id) = self.usr_id {
      item = item.field("usr_id", usr_id);
    }
    if let Some(ref usr_id_lbl) = self.usr_id_lbl {
      item = item.field("usr_id_lbl", usr_id_lbl);
    }
    if let Some(ref opinion) = self.opinion {
      item = item.field("opinion", opinion);
    }
    if let Some(ref node_label) = self.node_label {
      item = item.field("node_label", node_label);
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

impl From<LogModel> for LogInput {
  fn from(model: LogModel) -> Self {
    Self {
      id: model.id.into(),
      is_deleted: model.is_deleted.into(),
      tenant_id: model.tenant_id.into(),
      // 流程实例
      process_inst_id: model.process_inst_id.into(),
      process_inst_id_lbl: model.process_inst_id_lbl.into(),
      // 节点实例
      node_inst_id: model.node_inst_id.into(),
      node_inst_id_lbl: model.node_inst_id_lbl.into(),
      // 关联任务
      task_id: model.task_id.into(),
      task_id_lbl: model.task_id_lbl.into(),
      // 动作
      action: model.action.into(),
      action_lbl: model.action_lbl.into(),
      // 操作人
      usr_id: model.usr_id.into(),
      usr_id_lbl: model.usr_id_lbl.into(),
      // 意见
      opinion: model.opinion.into(),
      // 节点名称
      node_label: model.node_label.into(),
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

impl From<LogInput> for LogSearch {
  fn from(input: LogInput) -> Self {
    Self {
      id: input.id,
      ids: None,
      // 租户ID
      tenant_id: input.tenant_id,
      is_deleted: None,
      // 流程实例
      process_inst_id: input.process_inst_id.map(|x| vec![x]),
      // 流程实例
      process_inst_id_lbl: input.process_inst_id_lbl.map(|x| vec![x]),
      // 节点实例
      node_inst_id: input.node_inst_id.map(|x| vec![x]),
      // 节点实例
      node_inst_id_lbl: input.node_inst_id_lbl.map(|x| vec![x]),
      // 关联任务
      task_id: input.task_id.map(|x| vec![x]),
      // 关联任务
      task_id_lbl: input.task_id_lbl.map(|x| vec![x]),
      // 动作
      action: input.action.map(|x| vec![x]),
      // 操作人
      usr_id: input.usr_id.map(|x| vec![x]),
      // 操作人
      usr_id_lbl: input.usr_id_lbl.map(|x| vec![x]),
      // 意见
      opinion: input.opinion,
      // 节点名称
      node_label: input.node_label,
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

impl_id!(LogId);

/// 流程日志动作
#[derive(Enum, Copy, Clone, Default, Eq, PartialEq, Serialize, Deserialize, Debug)]
pub enum LogAction {
  /// 发起
  #[default]
  #[graphql(name="start")]
  #[serde(rename = "start")]
  Start,
  /// 同意
  #[graphql(name="approve")]
  #[serde(rename = "approve")]
  Approve,
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
  /// 撤回
  #[graphql(name="revoke")]
  #[serde(rename = "revoke")]
  Revoke,
  /// 自动通过
  #[graphql(name="auto_approve")]
  #[serde(rename = "auto_approve")]
  AutoApprove,
  /// 抄送
  #[graphql(name="cc")]
  #[serde(rename = "cc")]
  Cc,
  /// 结束
  #[graphql(name="end")]
  #[serde(rename = "end")]
  End,
}

impl fmt::Display for LogAction {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    match self {
      Self::Start => write!(f, "start"),
      Self::Approve => write!(f, "approve"),
      Self::Reject => write!(f, "reject"),
      Self::Transfer => write!(f, "transfer"),
      Self::Return => write!(f, "return"),
      Self::AddSign => write!(f, "add_sign"),
      Self::Revoke => write!(f, "revoke"),
      Self::AutoApprove => write!(f, "auto_approve"),
      Self::Cc => write!(f, "cc"),
      Self::End => write!(f, "end"),
    }
  }
}

impl From<LogAction> for SmolStr {
  fn from(value: LogAction) -> Self {
    match value {
      LogAction::Start => "start".into(),
      LogAction::Approve => "approve".into(),
      LogAction::Reject => "reject".into(),
      LogAction::Transfer => "transfer".into(),
      LogAction::Return => "return".into(),
      LogAction::AddSign => "add_sign".into(),
      LogAction::Revoke => "revoke".into(),
      LogAction::AutoApprove => "auto_approve".into(),
      LogAction::Cc => "cc".into(),
      LogAction::End => "end".into(),
    }
  }
}

impl From<LogAction> for String {
  fn from(value: LogAction) -> Self {
    match value {
      LogAction::Start => "start".into(),
      LogAction::Approve => "approve".into(),
      LogAction::Reject => "reject".into(),
      LogAction::Transfer => "transfer".into(),
      LogAction::Return => "return".into(),
      LogAction::AddSign => "add_sign".into(),
      LogAction::Revoke => "revoke".into(),
      LogAction::AutoApprove => "auto_approve".into(),
      LogAction::Cc => "cc".into(),
      LogAction::End => "end".into(),
    }
  }
}

impl From<LogAction> for ArgType {
  fn from(value: LogAction) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl FromStr for LogAction {
  type Err = color_eyre::eyre::Error;
  
  fn from_str(s: &str) -> Result<Self, Self::Err> {
    match s {
      "start" => Ok(Self::Start),
      "approve" => Ok(Self::Approve),
      "reject" => Ok(Self::Reject),
      "transfer" => Ok(Self::Transfer),
      "return" => Ok(Self::Return),
      "add_sign" => Ok(Self::AddSign),
      "revoke" => Ok(Self::Revoke),
      "auto_approve" => Ok(Self::AutoApprove),
      "cc" => Ok(Self::Cc),
      "end" => Ok(Self::End),
      _ => Err(eyre!("{s} 无法转换到 动作")),
    }
  }
}

impl TryFrom<&str> for LogAction {
  type Error = sqlx::Error;
  
  fn try_from(s: &str) -> Result<Self, sqlx::Error> {
    match s {
      "start" => Ok(Self::Start),
      "approve" => Ok(Self::Approve),
      "reject" => Ok(Self::Reject),
      "transfer" => Ok(Self::Transfer),
      "return" => Ok(Self::Return),
      "add_sign" => Ok(Self::AddSign),
      "revoke" => Ok(Self::Revoke),
      "auto_approve" => Ok(Self::AutoApprove),
      "cc" => Ok(Self::Cc),
      "end" => Ok(Self::End),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "action".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "{s} 无法转换到 动作".to_owned(),
          )),
        }),
      )),
    }
  }
}

impl TryFrom<SmolStr> for LogAction {
  type Error = sqlx::Error;
  
  fn try_from(s: SmolStr) -> Result<Self, sqlx::Error> {
    match s.as_str() {
      "start" => Ok(Self::Start),
      "approve" => Ok(Self::Approve),
      "reject" => Ok(Self::Reject),
      "transfer" => Ok(Self::Transfer),
      "return" => Ok(Self::Return),
      "add_sign" => Ok(Self::AddSign),
      "revoke" => Ok(Self::Revoke),
      "auto_approve" => Ok(Self::AutoApprove),
      "cc" => Ok(Self::Cc),
      "end" => Ok(Self::End),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "action".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "{s} 无法转换到 动作".to_owned(),
          )),
        }),
      )),
    }
  }
}

impl LogAction {
  pub fn as_str(&self) -> &str {
    match self {
      Self::Start => "start",
      Self::Approve => "approve",
      Self::Reject => "reject",
      Self::Transfer => "transfer",
      Self::Return => "return",
      Self::AddSign => "add_sign",
      Self::Revoke => "revoke",
      Self::AutoApprove => "auto_approve",
      Self::Cc => "cc",
      Self::End => "end",
    }
  }
}

impl TryFrom<String> for LogAction {
  type Error = sqlx::Error;
  
  fn try_from(s: String) -> Result<Self, sqlx::Error> {
    match s.as_str() {
      "start" => Ok(Self::Start),
      "approve" => Ok(Self::Approve),
      "reject" => Ok(Self::Reject),
      "transfer" => Ok(Self::Transfer),
      "return" => Ok(Self::Return),
      "add_sign" => Ok(Self::AddSign),
      "revoke" => Ok(Self::Revoke),
      "auto_approve" => Ok(Self::AutoApprove),
      "cc" => Ok(Self::Cc),
      "end" => Ok(Self::End),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "action".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "{s} 无法转换到 动作".to_owned(),
          )),
        }),
      )),
    }
  }
}

/// 流程日志 检测字段是否允许前端排序
pub fn check_sort_log(
  sort: Option<&[SortInput]>,
) -> Result<()> {
  
  if sort.is_none() {
    return Ok(());
  }
  
  let sort = sort.unwrap_or_default();
  
  if sort.is_empty() {
    return Ok(());
  }
  
  let get_can_sort_in_api_log = get_can_sort_in_api_log();
  
  for item in sort {
    let prop = item.prop.as_str();
    if prop.is_empty() {
      continue;
    }
    if !get_can_sort_in_api_log.contains(&prop) {
      return Err(eyre!(ServiceException {
        message: format!("check_sort_log: {}", serde_json::to_string(item)?).into(),
        trace: true,
        ..Default::default()
      }));
    }
  }
  
  Ok(())
}

// MARK: get_page_path_log
pub fn get_page_path_log() -> &'static str {
  "/bpm/log"
}

// MARK: get_table_name_log
pub fn get_table_name_log() -> &'static str {
  "bpm_log"
}
