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
use crate::base::usr::usr_model::UsrId;

static CAN_SORT_IN_API_NODE_INST: [&str; 2] = [
  "create_time",
  "update_time",
];

/// 节点实例 前端允许排序的字段
fn get_can_sort_in_api_node_inst() -> &'static [&'static str; 2] {
  &CAN_SORT_IN_API_NODE_INST
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "NodeInstModel")]
#[allow(dead_code)]
pub struct NodeInstModel {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: TenantId,
  /// ID
  pub id: NodeInstId,
  /// 流程实例
  #[graphql(name = "process_inst_id")]
  pub process_inst_id: ProcessInstId,
  /// 流程实例
  #[graphql(name = "process_inst_id_lbl")]
  pub process_inst_id_lbl: SmolStr,
  /// 节点ID
  #[graphql(name = "node_id")]
  pub node_id: SmolStr,
  /// 节点类型
  #[graphql(name = "node_type")]
  pub node_type: NodeInstNodeType,
  /// 节点类型
  #[graphql(name = "node_type_lbl")]
  pub node_type_lbl: SmolStr,
  /// 节点状态
  #[graphql(name = "status")]
  pub status: NodeInstStatus,
  /// 节点状态
  #[graphql(name = "status_lbl")]
  pub status_lbl: SmolStr,
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

impl FromRow<'_, MySqlRow> for NodeInstModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;
    // ID
    let id: NodeInstId = row.try_get("id")?;
    // 流程实例
    let process_inst_id: ProcessInstId = row.try_get("process_inst_id")?;
    let process_inst_id_lbl: Option<&str> = row.try_get("process_inst_id_lbl")?;
    let process_inst_id_lbl = SmolStr::new(process_inst_id_lbl.unwrap_or_default());
    // 节点ID
    let node_id: &str = row.try_get("node_id")?;
    let node_id = SmolStr::new(node_id);
    // 节点类型
    let node_type_lbl: &str = row.try_get("node_type")?;
    let node_type: NodeInstNodeType = node_type_lbl.try_into()?;
    let node_type_lbl = SmolStr::new(node_type_lbl);
    // 节点状态
    let status_lbl: &str = row.try_get("status")?;
    let status: NodeInstStatus = status_lbl.try_into()?;
    let status_lbl = SmolStr::new(status_lbl);
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
      node_id,
      node_type,
      node_type_lbl,
      status,
      status_lbl,
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
#[graphql(rename_fields = "snake_case", name = "NodeInstFieldComment")]
#[allow(dead_code)]
pub struct NodeInstFieldComment {
  /// ID
  #[graphql(name = "id")]
  pub id: SmolStr,
  /// 流程实例
  #[graphql(name = "process_inst_id")]
  pub process_inst_id: SmolStr,
  /// 流程实例
  #[graphql(name = "process_inst_id_lbl")]
  pub process_inst_id_lbl: SmolStr,
  /// 节点ID
  #[graphql(name = "node_id")]
  pub node_id: SmolStr,
  /// 节点类型
  #[graphql(name = "node_type")]
  pub node_type: SmolStr,
  /// 节点类型
  #[graphql(name = "node_type_lbl")]
  pub node_type_lbl: SmolStr,
  /// 节点状态
  #[graphql(name = "status")]
  pub status: SmolStr,
  /// 节点状态
  #[graphql(name = "status_lbl")]
  pub status_lbl: SmolStr,
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
#[graphql(rename_fields = "snake_case", name = "NodeInstSearch")]
#[allow(dead_code)]
pub struct NodeInstSearch {
  /// ID
  pub id: Option<NodeInstId>,
  /// ID列表
  pub ids: Option<Vec<NodeInstId>>,
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
  /// 节点ID
  #[graphql(skip)]
  pub node_id: Option<SmolStr>,
  /// 节点ID
  #[graphql(skip)]
  pub node_id_like: Option<SmolStr>,
  /// 节点类型
  #[graphql(skip)]
  pub node_type: Option<Vec<NodeInstNodeType>>,
  /// 节点状态
  #[graphql(name = "status")]
  pub status: Option<Vec<NodeInstStatus>>,
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

impl std::fmt::Debug for NodeInstSearch {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("NodeInstSearch");
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
    // 节点ID
    if let Some(ref node_id) = self.node_id {
      item = item.field("node_id", node_id);
    }
    if let Some(ref node_id_like) = self.node_id_like {
      item = item.field("node_id_like", node_id_like);
    }
    // 节点类型
    if let Some(ref node_type) = self.node_type {
      item = item.field("node_type", node_type);
    }
    // 节点状态
    if let Some(ref status) = self.status {
      item = item.field("status", status);
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
#[graphql(rename_fields = "snake_case", name = "NodeInstInput")]
#[allow(dead_code)]
pub struct NodeInstInput {
  /// ID
  pub id: Option<NodeInstId>,
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
  /// 节点ID
  #[graphql(name = "node_id")]
  pub node_id: Option<SmolStr>,
  /// 节点类型
  #[graphql(name = "node_type")]
  pub node_type: Option<NodeInstNodeType>,
  /// 节点类型
  #[graphql(name = "node_type_lbl")]
  pub node_type_lbl: Option<SmolStr>,
  /// 节点状态
  #[graphql(name = "status")]
  pub status: Option<NodeInstStatus>,
  /// 节点状态
  #[graphql(name = "status_lbl")]
  pub status_lbl: Option<SmolStr>,
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

impl std::fmt::Debug for NodeInstInput {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("NodeInstInput");
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
    if let Some(ref node_id) = self.node_id {
      item = item.field("node_id", node_id);
    }
    if let Some(ref node_type) = self.node_type {
      item = item.field("node_type", node_type);
    }
    if let Some(ref status) = self.status {
      item = item.field("status", status);
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

impl From<NodeInstModel> for NodeInstInput {
  fn from(model: NodeInstModel) -> Self {
    Self {
      id: model.id.into(),
      is_deleted: model.is_deleted.into(),
      tenant_id: model.tenant_id.into(),
      // 流程实例
      process_inst_id: model.process_inst_id.into(),
      process_inst_id_lbl: model.process_inst_id_lbl.into(),
      // 节点ID
      node_id: model.node_id.into(),
      // 节点类型
      node_type: model.node_type.into(),
      node_type_lbl: model.node_type_lbl.into(),
      // 节点状态
      status: model.status.into(),
      status_lbl: model.status_lbl.into(),
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

impl From<NodeInstInput> for NodeInstSearch {
  fn from(input: NodeInstInput) -> Self {
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
      // 节点ID
      node_id: input.node_id,
      // 节点类型
      node_type: input.node_type.map(|x| vec![x]),
      // 节点状态
      status: input.status.map(|x| vec![x]),
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

impl_id!(NodeInstId);

/// 节点实例节点类型
#[derive(Enum, Copy, Clone, Default, Eq, PartialEq, Serialize, Deserialize, Debug)]
pub enum NodeInstNodeType {
  /// 开始
  #[graphql(name="start")]
  #[serde(rename = "start")]
  Start,
  /// 审批
  #[default]
  #[graphql(name="approve")]
  #[serde(rename = "approve")]
  Approve,
  /// 条件分支
  #[graphql(name="condition")]
  #[serde(rename = "condition")]
  Condition,
  /// 并行网关
  #[graphql(name="parallel")]
  #[serde(rename = "parallel")]
  Parallel,
  /// 结束
  #[graphql(name="end")]
  #[serde(rename = "end")]
  End,
}

impl fmt::Display for NodeInstNodeType {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    match self {
      Self::Start => write!(f, "start"),
      Self::Approve => write!(f, "approve"),
      Self::Condition => write!(f, "condition"),
      Self::Parallel => write!(f, "parallel"),
      Self::End => write!(f, "end"),
    }
  }
}

impl From<NodeInstNodeType> for SmolStr {
  fn from(value: NodeInstNodeType) -> Self {
    match value {
      NodeInstNodeType::Start => "start".into(),
      NodeInstNodeType::Approve => "approve".into(),
      NodeInstNodeType::Condition => "condition".into(),
      NodeInstNodeType::Parallel => "parallel".into(),
      NodeInstNodeType::End => "end".into(),
    }
  }
}

impl From<NodeInstNodeType> for String {
  fn from(value: NodeInstNodeType) -> Self {
    match value {
      NodeInstNodeType::Start => "start".into(),
      NodeInstNodeType::Approve => "approve".into(),
      NodeInstNodeType::Condition => "condition".into(),
      NodeInstNodeType::Parallel => "parallel".into(),
      NodeInstNodeType::End => "end".into(),
    }
  }
}

impl From<NodeInstNodeType> for ArgType {
  fn from(value: NodeInstNodeType) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl FromStr for NodeInstNodeType {
  type Err = color_eyre::eyre::Error;
  
  fn from_str(s: &str) -> Result<Self, Self::Err> {
    match s {
      "start" => Ok(Self::Start),
      "approve" => Ok(Self::Approve),
      "condition" => Ok(Self::Condition),
      "parallel" => Ok(Self::Parallel),
      "end" => Ok(Self::End),
      _ => Err(eyre!("{s} 无法转换到 节点类型")),
    }
  }
}

impl TryFrom<&str> for NodeInstNodeType {
  type Error = sqlx::Error;
  
  fn try_from(s: &str) -> Result<Self, sqlx::Error> {
    match s {
      "start" => Ok(Self::Start),
      "approve" => Ok(Self::Approve),
      "condition" => Ok(Self::Condition),
      "parallel" => Ok(Self::Parallel),
      "end" => Ok(Self::End),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "node_type".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "{s} 无法转换到 节点类型".to_owned(),
          )),
        }),
      )),
    }
  }
}

impl TryFrom<SmolStr> for NodeInstNodeType {
  type Error = sqlx::Error;
  
  fn try_from(s: SmolStr) -> Result<Self, sqlx::Error> {
    match s.as_str() {
      "start" => Ok(Self::Start),
      "approve" => Ok(Self::Approve),
      "condition" => Ok(Self::Condition),
      "parallel" => Ok(Self::Parallel),
      "end" => Ok(Self::End),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "node_type".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "{s} 无法转换到 节点类型".to_owned(),
          )),
        }),
      )),
    }
  }
}

impl NodeInstNodeType {
  pub fn as_str(&self) -> &str {
    match self {
      Self::Start => "start",
      Self::Approve => "approve",
      Self::Condition => "condition",
      Self::Parallel => "parallel",
      Self::End => "end",
    }
  }
}

impl TryFrom<String> for NodeInstNodeType {
  type Error = sqlx::Error;
  
  fn try_from(s: String) -> Result<Self, sqlx::Error> {
    match s.as_str() {
      "start" => Ok(Self::Start),
      "approve" => Ok(Self::Approve),
      "condition" => Ok(Self::Condition),
      "parallel" => Ok(Self::Parallel),
      "end" => Ok(Self::End),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "node_type".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "{s} 无法转换到 节点类型".to_owned(),
          )),
        }),
      )),
    }
  }
}

/// 节点实例节点状态
#[derive(Enum, Copy, Clone, Default, Eq, PartialEq, Serialize, Deserialize, Debug)]
pub enum NodeInstStatus {
  /// 待处理
  #[default]
  #[graphql(name="pending")]
  #[serde(rename = "pending")]
  Pending,
  /// 进行中
  #[graphql(name="running")]
  #[serde(rename = "running")]
  Running,
  /// 已完成
  #[graphql(name="completed")]
  #[serde(rename = "completed")]
  Completed,
  /// 已跳过
  #[graphql(name="skipped")]
  #[serde(rename = "skipped")]
  Skipped,
  /// 已拒绝
  #[graphql(name="rejected")]
  #[serde(rename = "rejected")]
  Rejected,
}

impl fmt::Display for NodeInstStatus {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    match self {
      Self::Pending => write!(f, "pending"),
      Self::Running => write!(f, "running"),
      Self::Completed => write!(f, "completed"),
      Self::Skipped => write!(f, "skipped"),
      Self::Rejected => write!(f, "rejected"),
    }
  }
}

impl From<NodeInstStatus> for SmolStr {
  fn from(value: NodeInstStatus) -> Self {
    match value {
      NodeInstStatus::Pending => "pending".into(),
      NodeInstStatus::Running => "running".into(),
      NodeInstStatus::Completed => "completed".into(),
      NodeInstStatus::Skipped => "skipped".into(),
      NodeInstStatus::Rejected => "rejected".into(),
    }
  }
}

impl From<NodeInstStatus> for String {
  fn from(value: NodeInstStatus) -> Self {
    match value {
      NodeInstStatus::Pending => "pending".into(),
      NodeInstStatus::Running => "running".into(),
      NodeInstStatus::Completed => "completed".into(),
      NodeInstStatus::Skipped => "skipped".into(),
      NodeInstStatus::Rejected => "rejected".into(),
    }
  }
}

impl From<NodeInstStatus> for ArgType {
  fn from(value: NodeInstStatus) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl FromStr for NodeInstStatus {
  type Err = color_eyre::eyre::Error;
  
  fn from_str(s: &str) -> Result<Self, Self::Err> {
    match s {
      "pending" => Ok(Self::Pending),
      "running" => Ok(Self::Running),
      "completed" => Ok(Self::Completed),
      "skipped" => Ok(Self::Skipped),
      "rejected" => Ok(Self::Rejected),
      _ => Err(eyre!("{s} 无法转换到 节点状态")),
    }
  }
}

impl TryFrom<&str> for NodeInstStatus {
  type Error = sqlx::Error;
  
  fn try_from(s: &str) -> Result<Self, sqlx::Error> {
    match s {
      "pending" => Ok(Self::Pending),
      "running" => Ok(Self::Running),
      "completed" => Ok(Self::Completed),
      "skipped" => Ok(Self::Skipped),
      "rejected" => Ok(Self::Rejected),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "status".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "{s} 无法转换到 节点状态".to_owned(),
          )),
        }),
      )),
    }
  }
}

impl TryFrom<SmolStr> for NodeInstStatus {
  type Error = sqlx::Error;
  
  fn try_from(s: SmolStr) -> Result<Self, sqlx::Error> {
    match s.as_str() {
      "pending" => Ok(Self::Pending),
      "running" => Ok(Self::Running),
      "completed" => Ok(Self::Completed),
      "skipped" => Ok(Self::Skipped),
      "rejected" => Ok(Self::Rejected),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "status".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "{s} 无法转换到 节点状态".to_owned(),
          )),
        }),
      )),
    }
  }
}

impl NodeInstStatus {
  pub fn as_str(&self) -> &str {
    match self {
      Self::Pending => "pending",
      Self::Running => "running",
      Self::Completed => "completed",
      Self::Skipped => "skipped",
      Self::Rejected => "rejected",
    }
  }
}

impl TryFrom<String> for NodeInstStatus {
  type Error = sqlx::Error;
  
  fn try_from(s: String) -> Result<Self, sqlx::Error> {
    match s.as_str() {
      "pending" => Ok(Self::Pending),
      "running" => Ok(Self::Running),
      "completed" => Ok(Self::Completed),
      "skipped" => Ok(Self::Skipped),
      "rejected" => Ok(Self::Rejected),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "status".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "{s} 无法转换到 节点状态".to_owned(),
          )),
        }),
      )),
    }
  }
}

/// 节点实例 检测字段是否允许前端排序
pub fn check_sort_node_inst(
  sort: Option<&[SortInput]>,
) -> Result<()> {
  
  if sort.is_none() {
    return Ok(());
  }
  
  let sort = sort.unwrap_or_default();
  
  if sort.is_empty() {
    return Ok(());
  }
  
  let get_can_sort_in_api_node_inst = get_can_sort_in_api_node_inst();
  
  for item in sort {
    let prop = item.prop.as_str();
    if prop.is_empty() {
      continue;
    }
    if !get_can_sort_in_api_node_inst.contains(&prop) {
      return Err(eyre!(ServiceException {
        message: format!("check_sort_node_inst: {}", serde_json::to_string(item)?).into(),
        trace: true,
        ..Default::default()
      }));
    }
  }
  
  Ok(())
}

// MARK: get_page_path_node_inst
pub fn get_page_path_node_inst() -> &'static str {
  "/bpm/node_inst"
}

// MARK: get_table_name_node_inst
pub fn get_table_name_node_inst() -> &'static str {
  "bpm_node_inst"
}
