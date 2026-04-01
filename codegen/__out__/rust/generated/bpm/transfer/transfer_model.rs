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
use crate::bpm::task::task_model::TaskId;
use crate::base::usr::usr_model::UsrId;

static CAN_SORT_IN_API_TRANSFER: [&str; 2] = [
  "create_time",
  "update_time",
];

/// 转交记录 前端允许排序的字段
fn get_can_sort_in_api_transfer() -> &'static [&'static str; 2] {
  &CAN_SORT_IN_API_TRANSFER
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "TransferModel")]
#[allow(dead_code)]
pub struct TransferModel {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: TenantId,
  /// ID
  pub id: TransferId,
  /// 原任务
  #[graphql(name = "task_id")]
  pub task_id: TaskId,
  /// 原任务
  #[graphql(name = "task_id_lbl")]
  pub task_id_lbl: SmolStr,
  /// 转出人
  #[graphql(name = "from_usr_id")]
  pub from_usr_id: UsrId,
  /// 转出人
  #[graphql(name = "from_usr_id_lbl")]
  pub from_usr_id_lbl: SmolStr,
  /// 接收人
  #[graphql(name = "to_usr_id")]
  pub to_usr_id: UsrId,
  /// 接收人
  #[graphql(name = "to_usr_id_lbl")]
  pub to_usr_id_lbl: SmolStr,
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

impl FromRow<'_, MySqlRow> for TransferModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;
    // ID
    let id: TransferId = row.try_get("id")?;
    // 原任务
    let task_id: TaskId = row.try_get("task_id")?;
    let task_id_lbl: Option<&str> = row.try_get("task_id_lbl")?;
    let task_id_lbl = SmolStr::new(task_id_lbl.unwrap_or_default());
    // 转出人
    let from_usr_id: UsrId = row.try_get("from_usr_id")?;
    let from_usr_id_lbl: Option<&str> = row.try_get("from_usr_id_lbl")?;
    let from_usr_id_lbl = SmolStr::new(from_usr_id_lbl.unwrap_or_default());
    // 接收人
    let to_usr_id: UsrId = row.try_get("to_usr_id")?;
    let to_usr_id_lbl: Option<&str> = row.try_get("to_usr_id_lbl")?;
    let to_usr_id_lbl = SmolStr::new(to_usr_id_lbl.unwrap_or_default());
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
      task_id,
      task_id_lbl,
      from_usr_id,
      from_usr_id_lbl,
      to_usr_id,
      to_usr_id_lbl,
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
#[graphql(rename_fields = "snake_case", name = "TransferFieldComment")]
#[allow(dead_code)]
pub struct TransferFieldComment {
  /// ID
  #[graphql(name = "id")]
  pub id: SmolStr,
  /// 原任务
  #[graphql(name = "task_id")]
  pub task_id: SmolStr,
  /// 原任务
  #[graphql(name = "task_id_lbl")]
  pub task_id_lbl: SmolStr,
  /// 转出人
  #[graphql(name = "from_usr_id")]
  pub from_usr_id: SmolStr,
  /// 转出人
  #[graphql(name = "from_usr_id_lbl")]
  pub from_usr_id_lbl: SmolStr,
  /// 接收人
  #[graphql(name = "to_usr_id")]
  pub to_usr_id: SmolStr,
  /// 接收人
  #[graphql(name = "to_usr_id_lbl")]
  pub to_usr_id_lbl: SmolStr,
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
#[graphql(rename_fields = "snake_case", name = "TransferSearch")]
#[allow(dead_code)]
pub struct TransferSearch {
  /// ID
  pub id: Option<TransferId>,
  /// ID列表
  pub ids: Option<Vec<TransferId>>,
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  pub is_deleted: Option<u8>,
  /// 原任务
  #[graphql(name = "task_id")]
  pub task_id: Option<Vec<TaskId>>,
  /// 原任务
  #[graphql(name = "task_id_save_null")]
  pub task_id_is_null: Option<bool>,
  /// 原任务
  #[graphql(name = "task_id_lbl")]
  pub task_id_lbl: Option<Vec<SmolStr>>,
  /// 原任务
  #[graphql(name = "task_id_lbl_like")]
  pub task_id_lbl_like: Option<SmolStr>,
  /// 转出人
  #[graphql(name = "from_usr_id")]
  pub from_usr_id: Option<Vec<UsrId>>,
  /// 转出人
  #[graphql(name = "from_usr_id_save_null")]
  pub from_usr_id_is_null: Option<bool>,
  /// 转出人
  #[graphql(name = "from_usr_id_lbl")]
  pub from_usr_id_lbl: Option<Vec<SmolStr>>,
  /// 转出人
  #[graphql(name = "from_usr_id_lbl_like")]
  pub from_usr_id_lbl_like: Option<SmolStr>,
  /// 接收人
  #[graphql(name = "to_usr_id")]
  pub to_usr_id: Option<Vec<UsrId>>,
  /// 接收人
  #[graphql(name = "to_usr_id_save_null")]
  pub to_usr_id_is_null: Option<bool>,
  /// 接收人
  #[graphql(name = "to_usr_id_lbl")]
  pub to_usr_id_lbl: Option<Vec<SmolStr>>,
  /// 接收人
  #[graphql(name = "to_usr_id_lbl_like")]
  pub to_usr_id_lbl_like: Option<SmolStr>,
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

impl std::fmt::Debug for TransferSearch {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("TransferSearch");
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
    // 原任务
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
    // 转出人
    if let Some(ref from_usr_id) = self.from_usr_id {
      item = item.field("from_usr_id", from_usr_id);
    }
    if let Some(ref from_usr_id_lbl) = self.from_usr_id_lbl {
      item = item.field("from_usr_id_lbl", from_usr_id_lbl);
    }
    if let Some(ref from_usr_id_lbl_like) = self.from_usr_id_lbl_like {
      item = item.field("from_usr_id_lbl_like", from_usr_id_lbl_like);
    }
    if let Some(ref from_usr_id_is_null) = self.from_usr_id_is_null {
      item = item.field("from_usr_id_is_null", from_usr_id_is_null);
    }
    // 接收人
    if let Some(ref to_usr_id) = self.to_usr_id {
      item = item.field("to_usr_id", to_usr_id);
    }
    if let Some(ref to_usr_id_lbl) = self.to_usr_id_lbl {
      item = item.field("to_usr_id_lbl", to_usr_id_lbl);
    }
    if let Some(ref to_usr_id_lbl_like) = self.to_usr_id_lbl_like {
      item = item.field("to_usr_id_lbl_like", to_usr_id_lbl_like);
    }
    if let Some(ref to_usr_id_is_null) = self.to_usr_id_is_null {
      item = item.field("to_usr_id_is_null", to_usr_id_is_null);
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
#[graphql(rename_fields = "snake_case", name = "TransferInput")]
#[allow(dead_code)]
pub struct TransferInput {
  /// ID
  pub id: Option<TransferId>,
  /// 已删除
  #[graphql(skip)]
  pub is_deleted: Option<u8>,
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  /// 原任务
  #[graphql(name = "task_id")]
  pub task_id: Option<TaskId>,
  /// 原任务
  #[graphql(name = "task_id_lbl")]
  pub task_id_lbl: Option<SmolStr>,
  /// 转出人
  #[graphql(name = "from_usr_id")]
  pub from_usr_id: Option<UsrId>,
  /// 转出人
  #[graphql(name = "from_usr_id_lbl")]
  pub from_usr_id_lbl: Option<SmolStr>,
  /// 接收人
  #[graphql(name = "to_usr_id")]
  pub to_usr_id: Option<UsrId>,
  /// 接收人
  #[graphql(name = "to_usr_id_lbl")]
  pub to_usr_id_lbl: Option<SmolStr>,
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

impl std::fmt::Debug for TransferInput {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("TransferInput");
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
    if let Some(ref task_id) = self.task_id {
      item = item.field("task_id", task_id);
    }
    if let Some(ref task_id_lbl) = self.task_id_lbl {
      item = item.field("task_id_lbl", task_id_lbl);
    }
    if let Some(ref from_usr_id) = self.from_usr_id {
      item = item.field("from_usr_id", from_usr_id);
    }
    if let Some(ref from_usr_id_lbl) = self.from_usr_id_lbl {
      item = item.field("from_usr_id_lbl", from_usr_id_lbl);
    }
    if let Some(ref to_usr_id) = self.to_usr_id {
      item = item.field("to_usr_id", to_usr_id);
    }
    if let Some(ref to_usr_id_lbl) = self.to_usr_id_lbl {
      item = item.field("to_usr_id_lbl", to_usr_id_lbl);
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

impl From<TransferModel> for TransferInput {
  fn from(model: TransferModel) -> Self {
    Self {
      id: model.id.into(),
      is_deleted: model.is_deleted.into(),
      tenant_id: model.tenant_id.into(),
      // 原任务
      task_id: model.task_id.into(),
      task_id_lbl: model.task_id_lbl.into(),
      // 转出人
      from_usr_id: model.from_usr_id.into(),
      from_usr_id_lbl: model.from_usr_id_lbl.into(),
      // 接收人
      to_usr_id: model.to_usr_id.into(),
      to_usr_id_lbl: model.to_usr_id_lbl.into(),
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

impl From<TransferInput> for TransferSearch {
  fn from(input: TransferInput) -> Self {
    Self {
      id: input.id,
      ids: None,
      // 租户ID
      tenant_id: input.tenant_id,
      is_deleted: None,
      // 原任务
      task_id: input.task_id.map(|x| vec![x]),
      // 原任务
      task_id_lbl: input.task_id_lbl.map(|x| vec![x]),
      // 转出人
      from_usr_id: input.from_usr_id.map(|x| vec![x]),
      // 转出人
      from_usr_id_lbl: input.from_usr_id_lbl.map(|x| vec![x]),
      // 接收人
      to_usr_id: input.to_usr_id.map(|x| vec![x]),
      // 接收人
      to_usr_id_lbl: input.to_usr_id_lbl.map(|x| vec![x]),
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

impl_id!(TransferId);

/// 转交记录 检测字段是否允许前端排序
pub fn check_sort_transfer(
  sort: Option<&[SortInput]>,
) -> Result<()> {
  
  if sort.is_none() {
    return Ok(());
  }
  
  let sort = sort.unwrap_or_default();
  
  if sort.is_empty() {
    return Ok(());
  }
  
  let get_can_sort_in_api_transfer = get_can_sort_in_api_transfer();
  
  for item in sort {
    let prop = item.prop.as_str();
    if prop.is_empty() {
      continue;
    }
    if !get_can_sort_in_api_transfer.contains(&prop) {
      return Err(eyre!(ServiceException {
        message: format!("check_sort_transfer: {}", serde_json::to_string(item)?).into(),
        trace: true,
        ..Default::default()
      }));
    }
  }
  
  Ok(())
}

// MARK: get_page_path_transfer
pub fn get_page_path_transfer() -> &'static str {
  "/bpm/transfer"
}

// MARK: get_table_name_transfer
pub fn get_table_name_transfer() -> &'static str {
  "bpm_transfer"
}
