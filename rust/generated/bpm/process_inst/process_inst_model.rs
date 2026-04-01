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
use crate::bpm::process_def::process_def_model::ProcessDefId;
use crate::bpm::process_revision::process_revision_model::ProcessRevisionId;
use crate::base::menu::menu_model::MenuId;
use crate::base::usr::usr_model::UsrId;
use crate::base::dept::dept_model::DeptId;

static CAN_SORT_IN_API_PROCESS_INST: [&str; 2] = [
  "create_time",
  "update_time",
];

/// 流程实例 前端允许排序的字段
fn get_can_sort_in_api_process_inst() -> &'static [&'static str; 2] {
  &CAN_SORT_IN_API_PROCESS_INST
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "ProcessInstModel")]
#[allow(dead_code)]
pub struct ProcessInstModel {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: TenantId,
  /// ID
  pub id: ProcessInstId,
  /// 实例标题
  #[graphql(name = "lbl")]
  pub lbl: SmolStr,
  /// 流程定义
  #[graphql(name = "process_def_id")]
  pub process_def_id: ProcessDefId,
  /// 流程定义
  #[graphql(name = "process_def_id_lbl")]
  pub process_def_id_lbl: SmolStr,
  /// 流程版本
  #[graphql(name = "process_revision_id")]
  pub process_revision_id: ProcessRevisionId,
  /// 流程版本
  #[graphql(name = "process_revision_id_lbl")]
  pub process_revision_id_lbl: SmolStr,
  /// 状态
  #[graphql(name = "status")]
  pub status: ProcessInstStatus,
  /// 状态
  #[graphql(name = "status_lbl")]
  pub status_lbl: SmolStr,
  /// 关联页面
  #[graphql(name = "menu_id")]
  pub menu_id: MenuId,
  /// 关联页面
  #[graphql(name = "menu_id_lbl")]
  pub menu_id_lbl: SmolStr,
  /// 业务数据ID
  #[graphql(name = "form_data_id")]
  pub form_data_id: SmolStr,
  /// 发起人
  #[graphql(name = "start_usr_id")]
  pub start_usr_id: UsrId,
  /// 发起人
  #[graphql(name = "start_usr_id_lbl")]
  pub start_usr_id_lbl: SmolStr,
  /// 发起人部门
  #[graphql(name = "start_dept_id")]
  pub start_dept_id: DeptId,
  /// 发起人部门
  #[graphql(name = "start_dept_id_lbl")]
  pub start_dept_id_lbl: SmolStr,
  /// 当前活跃节点
  #[graphql(name = "current_node_ids")]
  pub current_node_ids: Option<SmolStr>,
  /// 当前节点名称
  #[graphql(name = "current_node_lbls")]
  pub current_node_lbls: SmolStr,
  /// 总耗时(秒)
  #[graphql(name = "duration_seconds")]
  pub duration_seconds: u32,
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

impl FromRow<'_, MySqlRow> for ProcessInstModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;
    // ID
    let id: ProcessInstId = row.try_get("id")?;
    // 实例标题
    let lbl: &str = row.try_get("lbl")?;
    let lbl = SmolStr::new(lbl);
    // 流程定义
    let process_def_id: ProcessDefId = row.try_get("process_def_id")?;
    let process_def_id_lbl: Option<&str> = row.try_get("process_def_id_lbl")?;
    let process_def_id_lbl = SmolStr::new(process_def_id_lbl.unwrap_or_default());
    // 流程版本
    let process_revision_id: ProcessRevisionId = row.try_get("process_revision_id")?;
    let process_revision_id_lbl: Option<&str> = row.try_get("process_revision_id_lbl")?;
    let process_revision_id_lbl = SmolStr::new(process_revision_id_lbl.unwrap_or_default());
    // 状态
    let status_lbl: &str = row.try_get("status")?;
    let status: ProcessInstStatus = status_lbl.try_into()?;
    let status_lbl = SmolStr::new(status_lbl);
    // 关联页面
    let menu_id: MenuId = row.try_get("menu_id")?;
    let menu_id_lbl: Option<&str> = row.try_get("menu_id_lbl")?;
    let menu_id_lbl = SmolStr::new(menu_id_lbl.unwrap_or_default());
    // 业务数据ID
    let form_data_id: &str = row.try_get("form_data_id")?;
    let form_data_id = SmolStr::new(form_data_id);
    // 发起人
    let start_usr_id: UsrId = row.try_get("start_usr_id")?;
    let start_usr_id_lbl: Option<&str> = row.try_get("start_usr_id_lbl")?;
    let start_usr_id_lbl = SmolStr::new(start_usr_id_lbl.unwrap_or_default());
    // 发起人部门
    let start_dept_id: DeptId = row.try_get("start_dept_id")?;
    let start_dept_id_lbl: Option<&str> = row.try_get("start_dept_id_lbl")?;
    let start_dept_id_lbl = SmolStr::new(start_dept_id_lbl.unwrap_or_default());
    // 当前活跃节点
    let current_node_ids: Option<sqlx::types::Json<serde_json::Value>> = row.try_get("current_node_ids")?;
    let current_node_ids = current_node_ids.map(|v| SmolStr::new(v.to_string()));
    // 当前节点名称
    let current_node_lbls: &str = row.try_get("current_node_lbls")?;
    let current_node_lbls = SmolStr::new(current_node_lbls);
    // 总耗时(秒)
    let duration_seconds: u32 = row.try_get("duration_seconds")?;
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
      process_def_id,
      process_def_id_lbl,
      process_revision_id,
      process_revision_id_lbl,
      status,
      status_lbl,
      menu_id,
      menu_id_lbl,
      form_data_id,
      start_usr_id,
      start_usr_id_lbl,
      start_dept_id,
      start_dept_id_lbl,
      current_node_ids,
      current_node_lbls,
      duration_seconds,
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
#[graphql(rename_fields = "snake_case", name = "ProcessInstFieldComment")]
#[allow(dead_code)]
pub struct ProcessInstFieldComment {
  /// ID
  #[graphql(name = "id")]
  pub id: SmolStr,
  /// 实例标题
  #[graphql(name = "lbl")]
  pub lbl: SmolStr,
  /// 流程定义
  #[graphql(name = "process_def_id")]
  pub process_def_id: SmolStr,
  /// 流程定义
  #[graphql(name = "process_def_id_lbl")]
  pub process_def_id_lbl: SmolStr,
  /// 流程版本
  #[graphql(name = "process_revision_id")]
  pub process_revision_id: SmolStr,
  /// 流程版本
  #[graphql(name = "process_revision_id_lbl")]
  pub process_revision_id_lbl: SmolStr,
  /// 状态
  #[graphql(name = "status")]
  pub status: SmolStr,
  /// 状态
  #[graphql(name = "status_lbl")]
  pub status_lbl: SmolStr,
  /// 关联页面
  #[graphql(name = "menu_id")]
  pub menu_id: SmolStr,
  /// 关联页面
  #[graphql(name = "menu_id_lbl")]
  pub menu_id_lbl: SmolStr,
  /// 业务数据ID
  #[graphql(name = "form_data_id")]
  pub form_data_id: SmolStr,
  /// 发起人
  #[graphql(name = "start_usr_id")]
  pub start_usr_id: SmolStr,
  /// 发起人
  #[graphql(name = "start_usr_id_lbl")]
  pub start_usr_id_lbl: SmolStr,
  /// 发起人部门
  #[graphql(name = "start_dept_id")]
  pub start_dept_id: SmolStr,
  /// 发起人部门
  #[graphql(name = "start_dept_id_lbl")]
  pub start_dept_id_lbl: SmolStr,
  /// 当前活跃节点
  #[graphql(name = "current_node_ids")]
  pub current_node_ids: SmolStr,
  /// 当前节点名称
  #[graphql(name = "current_node_lbls")]
  pub current_node_lbls: SmolStr,
  /// 总耗时(秒)
  #[graphql(name = "duration_seconds")]
  pub duration_seconds: SmolStr,
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
#[graphql(rename_fields = "snake_case", name = "ProcessInstSearch")]
#[allow(dead_code)]
pub struct ProcessInstSearch {
  /// ID
  pub id: Option<ProcessInstId>,
  /// ID列表
  pub ids: Option<Vec<ProcessInstId>>,
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  pub is_deleted: Option<u8>,
  /// 实例标题
  #[graphql(name = "lbl")]
  pub lbl: Option<SmolStr>,
  /// 实例标题
  #[graphql(name = "lbl_like")]
  pub lbl_like: Option<SmolStr>,
  /// 流程定义
  #[graphql(name = "process_def_id")]
  pub process_def_id: Option<Vec<ProcessDefId>>,
  /// 流程定义
  #[graphql(name = "process_def_id_save_null")]
  pub process_def_id_is_null: Option<bool>,
  /// 流程定义
  #[graphql(name = "process_def_id_lbl")]
  pub process_def_id_lbl: Option<Vec<SmolStr>>,
  /// 流程定义
  #[graphql(name = "process_def_id_lbl_like")]
  pub process_def_id_lbl_like: Option<SmolStr>,
  /// 流程版本
  #[graphql(name = "process_revision_id")]
  pub process_revision_id: Option<Vec<ProcessRevisionId>>,
  /// 流程版本
  #[graphql(name = "process_revision_id_save_null")]
  pub process_revision_id_is_null: Option<bool>,
  /// 流程版本
  #[graphql(name = "process_revision_id_lbl")]
  pub process_revision_id_lbl: Option<Vec<SmolStr>>,
  /// 流程版本
  #[graphql(name = "process_revision_id_lbl_like")]
  pub process_revision_id_lbl_like: Option<SmolStr>,
  /// 状态
  #[graphql(name = "status")]
  pub status: Option<Vec<ProcessInstStatus>>,
  /// 关联页面
  #[graphql(name = "menu_id")]
  pub menu_id: Option<Vec<MenuId>>,
  /// 关联页面
  #[graphql(name = "menu_id_save_null")]
  pub menu_id_is_null: Option<bool>,
  /// 关联页面
  #[graphql(name = "menu_id_lbl")]
  pub menu_id_lbl: Option<Vec<SmolStr>>,
  /// 关联页面
  #[graphql(name = "menu_id_lbl_like")]
  pub menu_id_lbl_like: Option<SmolStr>,
  /// 业务数据ID
  #[graphql(skip)]
  pub form_data_id: Option<SmolStr>,
  /// 业务数据ID
  #[graphql(skip)]
  pub form_data_id_like: Option<SmolStr>,
  /// 发起人
  #[graphql(name = "start_usr_id")]
  pub start_usr_id: Option<Vec<UsrId>>,
  /// 发起人
  #[graphql(name = "start_usr_id_save_null")]
  pub start_usr_id_is_null: Option<bool>,
  /// 发起人
  #[graphql(name = "start_usr_id_lbl")]
  pub start_usr_id_lbl: Option<Vec<SmolStr>>,
  /// 发起人
  #[graphql(name = "start_usr_id_lbl_like")]
  pub start_usr_id_lbl_like: Option<SmolStr>,
  /// 发起人部门
  #[graphql(name = "start_dept_id")]
  pub start_dept_id: Option<Vec<DeptId>>,
  /// 发起人部门
  #[graphql(name = "start_dept_id_save_null")]
  pub start_dept_id_is_null: Option<bool>,
  /// 发起人部门
  #[graphql(name = "start_dept_id_lbl")]
  pub start_dept_id_lbl: Option<Vec<SmolStr>>,
  /// 发起人部门
  #[graphql(name = "start_dept_id_lbl_like")]
  pub start_dept_id_lbl_like: Option<SmolStr>,
  /// 当前活跃节点
  #[graphql(skip)]
  pub current_node_ids: Option<SmolStr>,
  /// 当前节点名称
  #[graphql(skip)]
  pub current_node_lbls: Option<SmolStr>,
  /// 当前节点名称
  #[graphql(skip)]
  pub current_node_lbls_like: Option<SmolStr>,
  /// 总耗时(秒)
  #[graphql(skip)]
  pub duration_seconds: Option<[Option<u32>; 2]>,
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

impl std::fmt::Debug for ProcessInstSearch {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("ProcessInstSearch");
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
    // 实例标题
    if let Some(ref lbl) = self.lbl {
      item = item.field("lbl", lbl);
    }
    if let Some(ref lbl_like) = self.lbl_like {
      item = item.field("lbl_like", lbl_like);
    }
    // 流程定义
    if let Some(ref process_def_id) = self.process_def_id {
      item = item.field("process_def_id", process_def_id);
    }
    if let Some(ref process_def_id_lbl) = self.process_def_id_lbl {
      item = item.field("process_def_id_lbl", process_def_id_lbl);
    }
    if let Some(ref process_def_id_lbl_like) = self.process_def_id_lbl_like {
      item = item.field("process_def_id_lbl_like", process_def_id_lbl_like);
    }
    if let Some(ref process_def_id_is_null) = self.process_def_id_is_null {
      item = item.field("process_def_id_is_null", process_def_id_is_null);
    }
    // 流程版本
    if let Some(ref process_revision_id) = self.process_revision_id {
      item = item.field("process_revision_id", process_revision_id);
    }
    if let Some(ref process_revision_id_lbl) = self.process_revision_id_lbl {
      item = item.field("process_revision_id_lbl", process_revision_id_lbl);
    }
    if let Some(ref process_revision_id_lbl_like) = self.process_revision_id_lbl_like {
      item = item.field("process_revision_id_lbl_like", process_revision_id_lbl_like);
    }
    if let Some(ref process_revision_id_is_null) = self.process_revision_id_is_null {
      item = item.field("process_revision_id_is_null", process_revision_id_is_null);
    }
    // 状态
    if let Some(ref status) = self.status {
      item = item.field("status", status);
    }
    // 关联页面
    if let Some(ref menu_id) = self.menu_id {
      item = item.field("menu_id", menu_id);
    }
    if let Some(ref menu_id_lbl) = self.menu_id_lbl {
      item = item.field("menu_id_lbl", menu_id_lbl);
    }
    if let Some(ref menu_id_lbl_like) = self.menu_id_lbl_like {
      item = item.field("menu_id_lbl_like", menu_id_lbl_like);
    }
    if let Some(ref menu_id_is_null) = self.menu_id_is_null {
      item = item.field("menu_id_is_null", menu_id_is_null);
    }
    // 业务数据ID
    if let Some(ref form_data_id) = self.form_data_id {
      item = item.field("form_data_id", form_data_id);
    }
    if let Some(ref form_data_id_like) = self.form_data_id_like {
      item = item.field("form_data_id_like", form_data_id_like);
    }
    // 发起人
    if let Some(ref start_usr_id) = self.start_usr_id {
      item = item.field("start_usr_id", start_usr_id);
    }
    if let Some(ref start_usr_id_lbl) = self.start_usr_id_lbl {
      item = item.field("start_usr_id_lbl", start_usr_id_lbl);
    }
    if let Some(ref start_usr_id_lbl_like) = self.start_usr_id_lbl_like {
      item = item.field("start_usr_id_lbl_like", start_usr_id_lbl_like);
    }
    if let Some(ref start_usr_id_is_null) = self.start_usr_id_is_null {
      item = item.field("start_usr_id_is_null", start_usr_id_is_null);
    }
    // 发起人部门
    if let Some(ref start_dept_id) = self.start_dept_id {
      item = item.field("start_dept_id", start_dept_id);
    }
    if let Some(ref start_dept_id_lbl) = self.start_dept_id_lbl {
      item = item.field("start_dept_id_lbl", start_dept_id_lbl);
    }
    if let Some(ref start_dept_id_lbl_like) = self.start_dept_id_lbl_like {
      item = item.field("start_dept_id_lbl_like", start_dept_id_lbl_like);
    }
    if let Some(ref start_dept_id_is_null) = self.start_dept_id_is_null {
      item = item.field("start_dept_id_is_null", start_dept_id_is_null);
    }
    // 当前活跃节点
    if let Some(ref current_node_ids) = self.current_node_ids {
      item = item.field("current_node_ids", current_node_ids);
    }
    // 当前节点名称
    if let Some(ref current_node_lbls) = self.current_node_lbls {
      item = item.field("current_node_lbls", current_node_lbls);
    }
    if let Some(ref current_node_lbls_like) = self.current_node_lbls_like {
      item = item.field("current_node_lbls_like", current_node_lbls_like);
    }
    // 总耗时(秒)
    if let Some(ref duration_seconds) = self.duration_seconds {
      item = item.field("duration_seconds", duration_seconds);
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
#[graphql(rename_fields = "snake_case", name = "ProcessInstInput")]
#[allow(dead_code)]
pub struct ProcessInstInput {
  /// ID
  pub id: Option<ProcessInstId>,
  /// 已删除
  #[graphql(skip)]
  pub is_deleted: Option<u8>,
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  /// 实例标题
  #[graphql(name = "lbl")]
  pub lbl: Option<SmolStr>,
  /// 流程定义
  #[graphql(name = "process_def_id")]
  pub process_def_id: Option<ProcessDefId>,
  /// 流程定义
  #[graphql(name = "process_def_id_lbl")]
  pub process_def_id_lbl: Option<SmolStr>,
  /// 流程版本
  #[graphql(name = "process_revision_id")]
  pub process_revision_id: Option<ProcessRevisionId>,
  /// 流程版本
  #[graphql(name = "process_revision_id_lbl")]
  pub process_revision_id_lbl: Option<SmolStr>,
  /// 状态
  #[graphql(name = "status")]
  pub status: Option<ProcessInstStatus>,
  /// 状态
  #[graphql(name = "status_lbl")]
  pub status_lbl: Option<SmolStr>,
  /// 关联页面
  #[graphql(name = "menu_id")]
  pub menu_id: Option<MenuId>,
  /// 关联页面
  #[graphql(name = "menu_id_lbl")]
  pub menu_id_lbl: Option<SmolStr>,
  /// 业务数据ID
  #[graphql(name = "form_data_id")]
  pub form_data_id: Option<SmolStr>,
  /// 发起人
  #[graphql(name = "start_usr_id")]
  pub start_usr_id: Option<UsrId>,
  /// 发起人
  #[graphql(name = "start_usr_id_lbl")]
  pub start_usr_id_lbl: Option<SmolStr>,
  /// 发起人部门
  #[graphql(name = "start_dept_id")]
  pub start_dept_id: Option<DeptId>,
  /// 发起人部门
  #[graphql(name = "start_dept_id_lbl")]
  pub start_dept_id_lbl: Option<SmolStr>,
  /// 当前活跃节点
  #[graphql(name = "current_node_ids")]
  pub current_node_ids: Option<SmolStr>,
  /// 当前节点名称
  #[graphql(name = "current_node_lbls")]
  pub current_node_lbls: Option<SmolStr>,
  /// 总耗时(秒)
  #[graphql(name = "duration_seconds")]
  pub duration_seconds: Option<u32>,
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

impl std::fmt::Debug for ProcessInstInput {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("ProcessInstInput");
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
    if let Some(ref process_def_id) = self.process_def_id {
      item = item.field("process_def_id", process_def_id);
    }
    if let Some(ref process_def_id_lbl) = self.process_def_id_lbl {
      item = item.field("process_def_id_lbl", process_def_id_lbl);
    }
    if let Some(ref process_revision_id) = self.process_revision_id {
      item = item.field("process_revision_id", process_revision_id);
    }
    if let Some(ref process_revision_id_lbl) = self.process_revision_id_lbl {
      item = item.field("process_revision_id_lbl", process_revision_id_lbl);
    }
    if let Some(ref status) = self.status {
      item = item.field("status", status);
    }
    if let Some(ref menu_id) = self.menu_id {
      item = item.field("menu_id", menu_id);
    }
    if let Some(ref menu_id_lbl) = self.menu_id_lbl {
      item = item.field("menu_id_lbl", menu_id_lbl);
    }
    if let Some(ref form_data_id) = self.form_data_id {
      item = item.field("form_data_id", form_data_id);
    }
    if let Some(ref start_usr_id) = self.start_usr_id {
      item = item.field("start_usr_id", start_usr_id);
    }
    if let Some(ref start_usr_id_lbl) = self.start_usr_id_lbl {
      item = item.field("start_usr_id_lbl", start_usr_id_lbl);
    }
    if let Some(ref start_dept_id) = self.start_dept_id {
      item = item.field("start_dept_id", start_dept_id);
    }
    if let Some(ref start_dept_id_lbl) = self.start_dept_id_lbl {
      item = item.field("start_dept_id_lbl", start_dept_id_lbl);
    }
    if let Some(ref current_node_ids) = self.current_node_ids {
      item = item.field("current_node_ids", current_node_ids);
    }
    if let Some(ref current_node_lbls) = self.current_node_lbls {
      item = item.field("current_node_lbls", current_node_lbls);
    }
    if let Some(ref duration_seconds) = self.duration_seconds {
      item = item.field("duration_seconds", duration_seconds);
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

impl From<ProcessInstModel> for ProcessInstInput {
  fn from(model: ProcessInstModel) -> Self {
    Self {
      id: model.id.into(),
      is_deleted: model.is_deleted.into(),
      tenant_id: model.tenant_id.into(),
      // 实例标题
      lbl: model.lbl.into(),
      // 流程定义
      process_def_id: model.process_def_id.into(),
      process_def_id_lbl: model.process_def_id_lbl.into(),
      // 流程版本
      process_revision_id: model.process_revision_id.into(),
      process_revision_id_lbl: model.process_revision_id_lbl.into(),
      // 状态
      status: model.status.into(),
      status_lbl: model.status_lbl.into(),
      // 关联页面
      menu_id: model.menu_id.into(),
      menu_id_lbl: model.menu_id_lbl.into(),
      // 业务数据ID
      form_data_id: model.form_data_id.into(),
      // 发起人
      start_usr_id: model.start_usr_id.into(),
      start_usr_id_lbl: model.start_usr_id_lbl.into(),
      // 发起人部门
      start_dept_id: model.start_dept_id.into(),
      start_dept_id_lbl: model.start_dept_id_lbl.into(),
      // 当前活跃节点
      current_node_ids: model.current_node_ids,
      // 当前节点名称
      current_node_lbls: model.current_node_lbls.into(),
      // 总耗时(秒)
      duration_seconds: model.duration_seconds.into(),
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

impl From<ProcessInstInput> for ProcessInstSearch {
  fn from(input: ProcessInstInput) -> Self {
    Self {
      id: input.id,
      ids: None,
      // 租户ID
      tenant_id: input.tenant_id,
      is_deleted: None,
      // 实例标题
      lbl: input.lbl,
      // 流程定义
      process_def_id: input.process_def_id.map(|x| vec![x]),
      // 流程定义
      process_def_id_lbl: input.process_def_id_lbl.map(|x| vec![x]),
      // 流程版本
      process_revision_id: input.process_revision_id.map(|x| vec![x]),
      // 流程版本
      process_revision_id_lbl: input.process_revision_id_lbl.map(|x| vec![x]),
      // 状态
      status: input.status.map(|x| vec![x]),
      // 关联页面
      menu_id: input.menu_id.map(|x| vec![x]),
      // 关联页面
      menu_id_lbl: input.menu_id_lbl.map(|x| vec![x]),
      // 业务数据ID
      form_data_id: input.form_data_id,
      // 发起人
      start_usr_id: input.start_usr_id.map(|x| vec![x]),
      // 发起人
      start_usr_id_lbl: input.start_usr_id_lbl.map(|x| vec![x]),
      // 发起人部门
      start_dept_id: input.start_dept_id.map(|x| vec![x]),
      // 发起人部门
      start_dept_id_lbl: input.start_dept_id_lbl.map(|x| vec![x]),
      // 当前活跃节点
      current_node_ids: input.current_node_ids,
      // 当前节点名称
      current_node_lbls: input.current_node_lbls,
      // 总耗时(秒)
      duration_seconds: input.duration_seconds.map(|x| [Some(x), Some(x)]),
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

impl_id!(ProcessInstId);

/// 流程实例状态
#[derive(Enum, Copy, Clone, Default, Eq, PartialEq, Serialize, Deserialize, Debug)]
pub enum ProcessInstStatus {
  /// 进行中
  #[default]
  #[graphql(name="running")]
  #[serde(rename = "running")]
  Running,
  /// 已通过
  #[graphql(name="approved")]
  #[serde(rename = "approved")]
  Approved,
  /// 已拒绝
  #[graphql(name="rejected")]
  #[serde(rename = "rejected")]
  Rejected,
  /// 已撤回
  #[graphql(name="revoked")]
  #[serde(rename = "revoked")]
  Revoked,
}

impl fmt::Display for ProcessInstStatus {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    match self {
      Self::Running => write!(f, "running"),
      Self::Approved => write!(f, "approved"),
      Self::Rejected => write!(f, "rejected"),
      Self::Revoked => write!(f, "revoked"),
    }
  }
}

impl From<ProcessInstStatus> for SmolStr {
  fn from(value: ProcessInstStatus) -> Self {
    match value {
      ProcessInstStatus::Running => "running".into(),
      ProcessInstStatus::Approved => "approved".into(),
      ProcessInstStatus::Rejected => "rejected".into(),
      ProcessInstStatus::Revoked => "revoked".into(),
    }
  }
}

impl From<ProcessInstStatus> for String {
  fn from(value: ProcessInstStatus) -> Self {
    match value {
      ProcessInstStatus::Running => "running".into(),
      ProcessInstStatus::Approved => "approved".into(),
      ProcessInstStatus::Rejected => "rejected".into(),
      ProcessInstStatus::Revoked => "revoked".into(),
    }
  }
}

impl From<ProcessInstStatus> for ArgType {
  fn from(value: ProcessInstStatus) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl FromStr for ProcessInstStatus {
  type Err = color_eyre::eyre::Error;
  
  fn from_str(s: &str) -> Result<Self, Self::Err> {
    match s {
      "running" => Ok(Self::Running),
      "approved" => Ok(Self::Approved),
      "rejected" => Ok(Self::Rejected),
      "revoked" => Ok(Self::Revoked),
      _ => Err(eyre!("{s} 无法转换到 状态")),
    }
  }
}

impl TryFrom<&str> for ProcessInstStatus {
  type Error = sqlx::Error;
  
  fn try_from(s: &str) -> Result<Self, sqlx::Error> {
    match s {
      "running" => Ok(Self::Running),
      "approved" => Ok(Self::Approved),
      "rejected" => Ok(Self::Rejected),
      "revoked" => Ok(Self::Revoked),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "status".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "{s} 无法转换到 状态".to_owned(),
          )),
        }),
      )),
    }
  }
}

impl TryFrom<SmolStr> for ProcessInstStatus {
  type Error = sqlx::Error;
  
  fn try_from(s: SmolStr) -> Result<Self, sqlx::Error> {
    match s.as_str() {
      "running" => Ok(Self::Running),
      "approved" => Ok(Self::Approved),
      "rejected" => Ok(Self::Rejected),
      "revoked" => Ok(Self::Revoked),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "status".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "{s} 无法转换到 状态".to_owned(),
          )),
        }),
      )),
    }
  }
}

impl ProcessInstStatus {
  pub fn as_str(&self) -> &str {
    match self {
      Self::Running => "running",
      Self::Approved => "approved",
      Self::Rejected => "rejected",
      Self::Revoked => "revoked",
    }
  }
}

impl TryFrom<String> for ProcessInstStatus {
  type Error = sqlx::Error;
  
  fn try_from(s: String) -> Result<Self, sqlx::Error> {
    match s.as_str() {
      "running" => Ok(Self::Running),
      "approved" => Ok(Self::Approved),
      "rejected" => Ok(Self::Rejected),
      "revoked" => Ok(Self::Revoked),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "status".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "{s} 无法转换到 状态".to_owned(),
          )),
        }),
      )),
    }
  }
}

/// 流程实例 检测字段是否允许前端排序
pub fn check_sort_process_inst(
  sort: Option<&[SortInput]>,
) -> Result<()> {
  
  if sort.is_none() {
    return Ok(());
  }
  
  let sort = sort.unwrap_or_default();
  
  if sort.is_empty() {
    return Ok(());
  }
  
  let get_can_sort_in_api_process_inst = get_can_sort_in_api_process_inst();
  
  for item in sort {
    let prop = item.prop.as_str();
    if prop.is_empty() {
      continue;
    }
    if !get_can_sort_in_api_process_inst.contains(&prop) {
      return Err(eyre!(ServiceException {
        message: format!("check_sort_process_inst: {}", serde_json::to_string(item)?).into(),
        trace: true,
        ..Default::default()
      }));
    }
  }
  
  Ok(())
}

// MARK: get_page_path_process_inst
pub fn get_page_path_process_inst() -> &'static str {
  "/bpm/process_inst"
}

// MARK: get_table_name_process_inst
pub fn get_table_name_process_inst() -> &'static str {
  "bpm_process_inst"
}
