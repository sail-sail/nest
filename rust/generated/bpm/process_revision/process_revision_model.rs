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
use crate::base::usr::usr_model::UsrId;

static CAN_SORT_IN_API_PROCESS_REVISION: [&str; 3] = [
  "process_version",
  "create_time",
  "update_time",
];

/// 流程版本 前端允许排序的字段
fn get_can_sort_in_api_process_revision() -> &'static [&'static str; 3] {
  &CAN_SORT_IN_API_PROCESS_REVISION
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "ProcessRevisionModel")]
#[allow(dead_code)]
pub struct ProcessRevisionModel {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: TenantId,
  /// ID
  pub id: ProcessRevisionId,
  /// 流程定义
  #[graphql(name = "process_def_id")]
  pub process_def_id: ProcessDefId,
  /// 流程定义
  #[graphql(name = "process_def_id_lbl")]
  pub process_def_id_lbl: SmolStr,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: SmolStr,
  /// 版本号
  #[graphql(name = "process_version")]
  pub process_version: u32,
  /// 流程图
  #[graphql(name = "graph_json")]
  pub graph_json: Option<SmolStr>,
  /// 发布时间
  #[graphql(name = "publish_time")]
  pub publish_time: Option<chrono::NaiveDateTime>,
  /// 发布时间
  #[graphql(name = "publish_time_lbl")]
  pub publish_time_lbl: SmolStr,
  /// 发布人
  #[graphql(name = "publish_usr_id")]
  pub publish_usr_id: UsrId,
  /// 发布人
  #[graphql(name = "publish_usr_id_lbl")]
  pub publish_usr_id_lbl: SmolStr,
  /// 是否已删除
  pub is_deleted: u8,
  /// 创建人
  #[graphql(skip)]
  pub create_usr_id: UsrId,
  /// 创建人
  #[graphql(skip)]
  pub create_usr_id_lbl: SmolStr,
  /// 创建时间
  #[graphql(skip)]
  pub create_time: Option<chrono::NaiveDateTime>,
  /// 创建时间
  #[graphql(skip)]
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

impl FromRow<'_, MySqlRow> for ProcessRevisionModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;
    // ID
    let id: ProcessRevisionId = row.try_get("id")?;
    // 流程定义
    let process_def_id: ProcessDefId = row.try_get("process_def_id")?;
    let process_def_id_lbl: Option<&str> = row.try_get("process_def_id_lbl")?;
    let process_def_id_lbl = SmolStr::new(process_def_id_lbl.unwrap_or_default());
    // 名称
    let lbl: &str = row.try_get("lbl")?;
    let lbl = SmolStr::new(lbl);
    // 版本号
    let process_version: u32 = row.try_get("process_version")?;
    // 流程图
    let graph_json: Option<sqlx::types::Json<serde_json::Value>> = row.try_get("graph_json")?;
    let graph_json = graph_json.map(|v| SmolStr::new(v.to_string()));
    // 发布时间
    let publish_time: Option<chrono::NaiveDateTime> = row.try_get("publish_time")?;
    let publish_time_lbl: SmolStr = match publish_time {
      Some(item) => SmolStr::new(item.format("%Y-%m-%d %H:%M:%S").to_string()),
      None => SmolStr::new(""),
    };
    // 发布人
    let publish_usr_id: UsrId = row.try_get("publish_usr_id")?;
    let publish_usr_id_lbl: Option<&str> = row.try_get("publish_usr_id_lbl")?;
    let publish_usr_id_lbl = SmolStr::new(publish_usr_id_lbl.unwrap_or_default());
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
      process_def_id,
      process_def_id_lbl,
      lbl,
      process_version,
      graph_json,
      publish_time,
      publish_time_lbl,
      publish_usr_id,
      publish_usr_id_lbl,
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
#[graphql(rename_fields = "snake_case", name = "ProcessRevisionFieldComment")]
#[allow(dead_code)]
pub struct ProcessRevisionFieldComment {
  /// ID
  #[graphql(name = "id")]
  pub id: SmolStr,
  /// 流程定义
  #[graphql(name = "process_def_id")]
  pub process_def_id: SmolStr,
  /// 流程定义
  #[graphql(name = "process_def_id_lbl")]
  pub process_def_id_lbl: SmolStr,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: SmolStr,
  /// 版本号
  #[graphql(name = "process_version")]
  pub process_version: SmolStr,
  /// 流程图
  #[graphql(name = "graph_json")]
  pub graph_json: SmolStr,
  /// 发布时间
  #[graphql(name = "publish_time")]
  pub publish_time: SmolStr,
  /// 发布时间
  #[graphql(name = "publish_time_lbl")]
  pub publish_time_lbl: SmolStr,
  /// 发布人
  #[graphql(name = "publish_usr_id")]
  pub publish_usr_id: SmolStr,
  /// 发布人
  #[graphql(name = "publish_usr_id_lbl")]
  pub publish_usr_id_lbl: SmolStr,
}

#[derive(InputObject, Serialize, Deserialize, Default, Clone)]
#[graphql(rename_fields = "snake_case", name = "ProcessRevisionSearch")]
#[allow(dead_code)]
pub struct ProcessRevisionSearch {
  /// ID
  pub id: Option<ProcessRevisionId>,
  /// ID列表
  pub ids: Option<Vec<ProcessRevisionId>>,
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  pub is_deleted: Option<u8>,
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
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: Option<SmolStr>,
  /// 名称
  #[graphql(name = "lbl_like")]
  pub lbl_like: Option<SmolStr>,
  /// 版本号
  #[graphql(skip)]
  pub process_version: Option<[Option<u32>; 2]>,
  /// 流程图
  #[graphql(skip)]
  pub graph_json: Option<SmolStr>,
  /// 发布时间
  #[graphql(name = "publish_time")]
  pub publish_time: Option<[Option<chrono::NaiveDateTime>; 2]>,
  /// 发布人
  #[graphql(name = "publish_usr_id")]
  pub publish_usr_id: Option<Vec<UsrId>>,
  /// 发布人
  #[graphql(name = "publish_usr_id_save_null")]
  pub publish_usr_id_is_null: Option<bool>,
  /// 发布人
  #[graphql(name = "publish_usr_id_lbl")]
  pub publish_usr_id_lbl: Option<Vec<SmolStr>>,
  /// 发布人
  #[graphql(name = "publish_usr_id_lbl_like")]
  pub publish_usr_id_lbl_like: Option<SmolStr>,
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
  /// 创建时间
  #[graphql(skip)]
  pub create_time: Option<[Option<chrono::NaiveDateTime>; 2]>,
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

impl std::fmt::Debug for ProcessRevisionSearch {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("ProcessRevisionSearch");
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
    // 名称
    if let Some(ref lbl) = self.lbl {
      item = item.field("lbl", lbl);
    }
    if let Some(ref lbl_like) = self.lbl_like {
      item = item.field("lbl_like", lbl_like);
    }
    // 版本号
    if let Some(ref process_version) = self.process_version {
      item = item.field("process_version", process_version);
    }
    // 流程图
    if let Some(ref graph_json) = self.graph_json {
      item = item.field("graph_json", graph_json);
    }
    // 发布时间
    if let Some(ref publish_time) = self.publish_time {
      item = item.field("publish_time", publish_time);
    }
    // 发布人
    if let Some(ref publish_usr_id) = self.publish_usr_id {
      item = item.field("publish_usr_id", publish_usr_id);
    }
    if let Some(ref publish_usr_id_lbl) = self.publish_usr_id_lbl {
      item = item.field("publish_usr_id_lbl", publish_usr_id_lbl);
    }
    if let Some(ref publish_usr_id_lbl_like) = self.publish_usr_id_lbl_like {
      item = item.field("publish_usr_id_lbl_like", publish_usr_id_lbl_like);
    }
    if let Some(ref publish_usr_id_is_null) = self.publish_usr_id_is_null {
      item = item.field("publish_usr_id_is_null", publish_usr_id_is_null);
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
#[graphql(rename_fields = "snake_case", name = "ProcessRevisionInput")]
#[allow(dead_code)]
pub struct ProcessRevisionInput {
  /// ID
  pub id: Option<ProcessRevisionId>,
  /// 已删除
  #[graphql(skip)]
  pub is_deleted: Option<u8>,
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  /// 流程定义
  #[graphql(name = "process_def_id")]
  pub process_def_id: Option<ProcessDefId>,
  /// 流程定义
  #[graphql(name = "process_def_id_lbl")]
  pub process_def_id_lbl: Option<SmolStr>,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: Option<SmolStr>,
  /// 版本号
  #[graphql(name = "process_version")]
  pub process_version: Option<u32>,
  /// 流程图
  #[graphql(name = "graph_json")]
  pub graph_json: Option<SmolStr>,
  /// 发布时间
  #[graphql(name = "publish_time")]
  pub publish_time: Option<chrono::NaiveDateTime>,
  /// 发布时间
  #[graphql(name = "publish_time_lbl")]
  pub publish_time_lbl: Option<SmolStr>,
  /// 发布时间
  #[graphql(name = "publish_time_save_null")]
  pub publish_time_save_null: Option<bool>,
  /// 发布人
  #[graphql(name = "publish_usr_id")]
  pub publish_usr_id: Option<UsrId>,
  /// 发布人
  #[graphql(name = "publish_usr_id_lbl")]
  pub publish_usr_id_lbl: Option<SmolStr>,
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

impl std::fmt::Debug for ProcessRevisionInput {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("ProcessRevisionInput");
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
    if let Some(ref process_def_id) = self.process_def_id {
      item = item.field("process_def_id", process_def_id);
    }
    if let Some(ref process_def_id_lbl) = self.process_def_id_lbl {
      item = item.field("process_def_id_lbl", process_def_id_lbl);
    }
    if let Some(ref lbl) = self.lbl {
      item = item.field("lbl", lbl);
    }
    if let Some(ref process_version) = self.process_version {
      item = item.field("process_version", process_version);
    }
    if let Some(ref graph_json) = self.graph_json {
      item = item.field("graph_json", graph_json);
    }
    if let Some(ref publish_time) = self.publish_time {
      item = item.field("publish_time", publish_time);
    }
    if let Some(ref publish_usr_id) = self.publish_usr_id {
      item = item.field("publish_usr_id", publish_usr_id);
    }
    if let Some(ref publish_usr_id_lbl) = self.publish_usr_id_lbl {
      item = item.field("publish_usr_id_lbl", publish_usr_id_lbl);
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

impl From<ProcessRevisionModel> for ProcessRevisionInput {
  fn from(model: ProcessRevisionModel) -> Self {
    Self {
      id: model.id.into(),
      is_deleted: model.is_deleted.into(),
      tenant_id: model.tenant_id.into(),
      // 流程定义
      process_def_id: model.process_def_id.into(),
      process_def_id_lbl: model.process_def_id_lbl.into(),
      // 名称
      lbl: model.lbl.into(),
      // 版本号
      process_version: model.process_version.into(),
      // 流程图
      graph_json: model.graph_json,
      // 发布时间
      publish_time: model.publish_time,
      publish_time_lbl: model.publish_time_lbl.into(),
      publish_time_save_null: Some(true),
      // 发布人
      publish_usr_id: model.publish_usr_id.into(),
      publish_usr_id_lbl: model.publish_usr_id_lbl.into(),
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

impl From<ProcessRevisionInput> for ProcessRevisionSearch {
  fn from(input: ProcessRevisionInput) -> Self {
    Self {
      id: input.id,
      ids: None,
      // 租户ID
      tenant_id: input.tenant_id,
      is_deleted: None,
      // 流程定义
      process_def_id: input.process_def_id.map(|x| vec![x]),
      // 流程定义
      process_def_id_lbl: input.process_def_id_lbl.map(|x| vec![x]),
      // 名称
      lbl: input.lbl,
      // 版本号
      process_version: input.process_version.map(|x| [Some(x), Some(x)]),
      // 流程图
      graph_json: input.graph_json,
      // 发布时间
      publish_time: input.publish_time.map(|x| [Some(x), Some(x)]),
      // 发布人
      publish_usr_id: input.publish_usr_id.map(|x| vec![x]),
      // 发布人
      publish_usr_id_lbl: input.publish_usr_id_lbl.map(|x| vec![x]),
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

impl_id!(ProcessRevisionId);

/// 流程版本 检测字段是否允许前端排序
pub fn check_sort_process_revision(
  sort: Option<&[SortInput]>,
) -> Result<()> {
  
  if sort.is_none() {
    return Ok(());
  }
  
  let sort = sort.unwrap_or_default();
  
  if sort.is_empty() {
    return Ok(());
  }
  
  let get_can_sort_in_api_process_revision = get_can_sort_in_api_process_revision();
  
  for item in sort {
    let prop = item.prop.as_str();
    if prop.is_empty() {
      continue;
    }
    if !get_can_sort_in_api_process_revision.contains(&prop) {
      return Err(eyre!(ServiceException {
        message: format!("check_sort_process_revision: {}", serde_json::to_string(item)?).into(),
        trace: true,
        ..Default::default()
      }));
    }
  }
  
  Ok(())
}

// MARK: get_page_path_process_revision
pub fn get_page_path_process_revision() -> &'static str {
  "/bpm/process_revision"
}

// MARK: get_table_name_process_revision
pub fn get_table_name_process_revision() -> &'static str {
  "bpm_process_revision"
}
