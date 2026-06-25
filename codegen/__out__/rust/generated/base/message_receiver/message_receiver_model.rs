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
use crate::base::message::message_model::MessageId;
use crate::base::usr::usr_model::UsrId;
use crate::base::org::org_model::OrgId;

static CAN_SORT_IN_API_MESSAGE_RECEIVER: [&str; 2] = [
  "create_time",
  "update_time",
];

/// 消息接收人 前端允许排序的字段
fn get_can_sort_in_api_message_receiver() -> &'static [&'static str; 2] {
  &CAN_SORT_IN_API_MESSAGE_RECEIVER
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "MessageReceiverModel")]
#[allow(dead_code)]
pub struct MessageReceiverModel {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: TenantId,
  /// ID
  pub id: MessageReceiverId,
  /// 消息
  #[graphql(name = "message_id")]
  pub message_id: MessageId,
  /// 消息
  #[graphql(name = "message_id_content")]
  pub message_id_content: SmolStr,
  /// 接收人
  #[graphql(name = "receiver_usr_id")]
  pub receiver_usr_id: UsrId,
  /// 接收人
  #[graphql(name = "receiver_usr_id_lbl")]
  pub receiver_usr_id_lbl: SmolStr,
  /// 已读
  #[graphql(name = "is_read")]
  pub is_read: u8,
  /// 已读
  #[graphql(name = "is_read_lbl")]
  pub is_read_lbl: SmolStr,
  /// 阅读时间
  #[graphql(name = "read_time")]
  pub read_time: Option<chrono::NaiveDateTime>,
  /// 阅读时间
  #[graphql(name = "read_time_lbl")]
  pub read_time_lbl: SmolStr,
  /// 组织
  #[graphql(name = "org_id")]
  pub org_id: OrgId,
  /// 组织
  #[graphql(name = "org_id_lbl")]
  pub org_id_lbl: SmolStr,
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

impl FromRow<'_, MySqlRow> for MessageReceiverModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;
    // ID
    let id: MessageReceiverId = row.try_get("id")?;
    // 消息
    let message_id: MessageId = row.try_get("message_id")?;
    let message_id_content: Option<&str> = row.try_get("message_id_content")?;
    let message_id_content = SmolStr::new(message_id_content.unwrap_or_default());
    // 接收人
    let receiver_usr_id: UsrId = row.try_get("receiver_usr_id")?;
    let receiver_usr_id_lbl: Option<&str> = row.try_get("receiver_usr_id_lbl")?;
    let receiver_usr_id_lbl = SmolStr::new(receiver_usr_id_lbl.unwrap_or_default());
    // 已读
    let is_read: u8 = row.try_get("is_read")?;
    let is_read_lbl = SmolStr::new(is_read.to_string());
    // 阅读时间
    let read_time: Option<chrono::NaiveDateTime> = row.try_get("read_time")?;
    let read_time_lbl: SmolStr = match read_time {
      Some(item) => SmolStr::new(item.format("%Y-%m-%d %H:%M:%S").to_string()),
      None => SmolStr::new(""),
    };
    // 组织
    let org_id: OrgId = row.try_get("org_id")?;
    let org_id_lbl: Option<&str> = row.try_get("org_id_lbl")?;
    let org_id_lbl = SmolStr::new(org_id_lbl.unwrap_or_default());
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
      message_id,
      message_id_content,
      receiver_usr_id,
      receiver_usr_id_lbl,
      is_read,
      is_read_lbl,
      read_time,
      read_time_lbl,
      org_id,
      org_id_lbl,
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
#[graphql(rename_fields = "snake_case", name = "MessageReceiverFieldComment")]
#[allow(dead_code)]
pub struct MessageReceiverFieldComment {
  /// ID
  #[graphql(name = "id")]
  pub id: SmolStr,
  /// 消息
  #[graphql(name = "message_id")]
  pub message_id: SmolStr,
  /// 消息
  #[graphql(name = "message_id_lbl")]
  pub message_id_lbl: SmolStr,
  /// 接收人
  #[graphql(name = "receiver_usr_id")]
  pub receiver_usr_id: SmolStr,
  /// 接收人
  #[graphql(name = "receiver_usr_id_lbl")]
  pub receiver_usr_id_lbl: SmolStr,
  /// 已读
  #[graphql(name = "is_read")]
  pub is_read: SmolStr,
  /// 已读
  #[graphql(name = "is_read_lbl")]
  pub is_read_lbl: SmolStr,
  /// 阅读时间
  #[graphql(name = "read_time")]
  pub read_time: SmolStr,
  /// 阅读时间
  #[graphql(name = "read_time_lbl")]
  pub read_time_lbl: SmolStr,
  /// 组织
  #[graphql(name = "org_id")]
  pub org_id: SmolStr,
  /// 组织
  #[graphql(name = "org_id_lbl")]
  pub org_id_lbl: SmolStr,
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
#[graphql(rename_fields = "snake_case", name = "MessageReceiverSearch")]
#[allow(dead_code)]
pub struct MessageReceiverSearch {
  /// ID
  pub id: Option<MessageReceiverId>,
  /// ID列表
  pub ids: Option<Vec<MessageReceiverId>>,
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  pub is_deleted: Option<u8>,
  /// 消息
  #[graphql(name = "message_id")]
  pub message_id: Option<Vec<MessageId>>,
  /// 消息
  #[graphql(name = "message_id_is_null")]
  pub message_id_is_null: Option<bool>,
  /// 消息
  #[graphql(name = "message_id_content")]
  pub message_id_content: Option<Vec<SmolStr>>,
  /// 消息
  #[graphql(name = "message_id_content_like")]
  pub message_id_content_like: Option<SmolStr>,
  /// 接收人
  #[graphql(name = "receiver_usr_id")]
  pub receiver_usr_id: Option<Vec<UsrId>>,
  /// 接收人
  #[graphql(name = "receiver_usr_id_is_null")]
  pub receiver_usr_id_is_null: Option<bool>,
  /// 接收人
  #[graphql(name = "receiver_usr_id_lbl")]
  pub receiver_usr_id_lbl: Option<Vec<SmolStr>>,
  /// 接收人
  #[graphql(name = "receiver_usr_id_lbl_like")]
  pub receiver_usr_id_lbl_like: Option<SmolStr>,
  /// 已读
  #[graphql(name = "is_read")]
  pub is_read: Option<Vec<u8>>,
  /// 阅读时间
  #[graphql(name = "read_time")]
  pub read_time: Option<[Option<chrono::NaiveDateTime>; 2]>,
  /// 组织
  #[graphql(name = "org_id")]
  pub org_id: Option<Vec<OrgId>>,
  /// 组织
  #[graphql(name = "org_id_is_null")]
  pub org_id_is_null: Option<bool>,
  /// 组织
  #[graphql(name = "org_id_lbl")]
  pub org_id_lbl: Option<Vec<SmolStr>>,
  /// 组织
  #[graphql(name = "org_id_lbl_like")]
  pub org_id_lbl_like: Option<SmolStr>,
  /// 创建人
  #[graphql(name = "create_usr_id")]
  pub create_usr_id: Option<Vec<UsrId>>,
  /// 创建人
  #[graphql(name = "create_usr_id_is_null")]
  pub create_usr_id_is_null: Option<bool>,
  /// 创建人
  #[graphql(name = "create_usr_id_lbl")]
  pub create_usr_id_lbl: Option<Vec<SmolStr>>,
  /// 创建人
  #[graphql(name = "create_usr_id_lbl_like")]
  pub create_usr_id_lbl_like: Option<SmolStr>,
  /// 创建时间
  #[graphql(name = "create_time")]
  pub create_time: Option<[Option<chrono::NaiveDateTime>; 2]>,
  /// 更新人
  #[graphql(name = "update_usr_id")]
  pub update_usr_id: Option<Vec<UsrId>>,
  /// 更新人
  #[graphql(name = "update_usr_id_is_null")]
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

impl std::fmt::Debug for MessageReceiverSearch {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("MessageReceiverSearch");
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
    // 消息
    if let Some(ref message_id) = self.message_id {
      item = item.field("message_id", message_id);
    }
    if let Some(ref message_id_content) = self.message_id_content {
      item = item.field("message_id_content", message_id_content);
    }
    if let Some(ref message_id_content_like) = self.message_id_content_like {
      item = item.field("message_id_content_like", message_id_content_like);
    }
    if let Some(ref message_id_is_null) = self.message_id_is_null {
      item = item.field("message_id_is_null", message_id_is_null);
    }
    // 接收人
    if let Some(ref receiver_usr_id) = self.receiver_usr_id {
      item = item.field("receiver_usr_id", receiver_usr_id);
    }
    if let Some(ref receiver_usr_id_lbl) = self.receiver_usr_id_lbl {
      item = item.field("receiver_usr_id_lbl", receiver_usr_id_lbl);
    }
    if let Some(ref receiver_usr_id_lbl_like) = self.receiver_usr_id_lbl_like {
      item = item.field("receiver_usr_id_lbl_like", receiver_usr_id_lbl_like);
    }
    if let Some(ref receiver_usr_id_is_null) = self.receiver_usr_id_is_null {
      item = item.field("receiver_usr_id_is_null", receiver_usr_id_is_null);
    }
    // 已读
    if let Some(ref is_read) = self.is_read {
      item = item.field("is_read", is_read);
    }
    // 阅读时间
    if let Some(ref read_time) = self.read_time {
      item = item.field("read_time", read_time);
    }
    // 组织
    if let Some(ref org_id) = self.org_id {
      item = item.field("org_id", org_id);
    }
    if let Some(ref org_id_lbl) = self.org_id_lbl {
      item = item.field("org_id_lbl", org_id_lbl);
    }
    if let Some(ref org_id_lbl_like) = self.org_id_lbl_like {
      item = item.field("org_id_lbl_like", org_id_lbl_like);
    }
    if let Some(ref org_id_is_null) = self.org_id_is_null {
      item = item.field("org_id_is_null", org_id_is_null);
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
#[graphql(rename_fields = "snake_case", name = "MessageReceiverInput")]
#[allow(dead_code)]
pub struct MessageReceiverInput {
  /// ID
  pub id: Option<MessageReceiverId>,
  /// 已删除
  #[graphql(skip)]
  pub is_deleted: Option<u8>,
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  /// 消息
  #[graphql(name = "message_id")]
  pub message_id: Option<MessageId>,
  /// 消息
  #[graphql(name = "message_id_content")]
  pub message_id_content: Option<SmolStr>,
  /// 接收人
  #[graphql(name = "receiver_usr_id")]
  pub receiver_usr_id: Option<UsrId>,
  /// 接收人
  #[graphql(name = "receiver_usr_id_lbl")]
  pub receiver_usr_id_lbl: Option<SmolStr>,
  /// 已读
  #[graphql(name = "is_read")]
  pub is_read: Option<u8>,
  /// 已读
  #[graphql(name = "is_read_lbl")]
  pub is_read_lbl: Option<SmolStr>,
  /// 阅读时间
  #[graphql(name = "read_time")]
  pub read_time: Option<chrono::NaiveDateTime>,
  /// 阅读时间
  #[graphql(name = "read_time_lbl")]
  pub read_time_lbl: Option<SmolStr>,
  /// 阅读时间
  #[graphql(name = "read_time_save_null")]
  pub read_time_save_null: Option<bool>,
  /// 组织
  #[graphql(name = "org_id")]
  pub org_id: Option<OrgId>,
  /// 组织
  #[graphql(name = "org_id_lbl")]
  pub org_id_lbl: Option<SmolStr>,
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

impl std::fmt::Debug for MessageReceiverInput {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("MessageReceiverInput");
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
    if let Some(ref message_id) = self.message_id {
      item = item.field("message_id", message_id);
    }
    if let Some(ref receiver_usr_id) = self.receiver_usr_id {
      item = item.field("receiver_usr_id", receiver_usr_id);
    }
    if let Some(ref receiver_usr_id_lbl) = self.receiver_usr_id_lbl {
      item = item.field("receiver_usr_id_lbl", receiver_usr_id_lbl);
    }
    if let Some(ref is_read) = self.is_read {
      item = item.field("is_read", is_read);
    }
    if let Some(ref read_time) = self.read_time {
      item = item.field("read_time", read_time);
    }
    if let Some(ref org_id) = self.org_id {
      item = item.field("org_id", org_id);
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

impl From<MessageReceiverModel> for MessageReceiverInput {
  fn from(model: MessageReceiverModel) -> Self {
    Self {
      id: model.id.into(),
      is_deleted: model.is_deleted.into(),
      tenant_id: model.tenant_id.into(),
      // 消息
      message_id: model.message_id.into(),
      message_id_content: model.message_id_content.into(),
      // 接收人
      receiver_usr_id: model.receiver_usr_id.into(),
      receiver_usr_id_lbl: model.receiver_usr_id_lbl.into(),
      // 已读
      is_read: model.is_read.into(),
      is_read_lbl: model.is_read_lbl.into(),
      // 阅读时间
      read_time: model.read_time,
      read_time_lbl: model.read_time_lbl.into(),
      read_time_save_null: Some(true),
      // 组织
      org_id: model.org_id.into(),
      org_id_lbl: model.org_id_lbl.into(),
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

impl From<MessageReceiverInput> for MessageReceiverSearch {
  fn from(input: MessageReceiverInput) -> Self {
    Self {
      id: input.id,
      ids: None,
      // 租户ID
      tenant_id: input.tenant_id,
      is_deleted: None,
      // 消息
      message_id: input.message_id.map(|x| vec![x]),
      // 接收人
      receiver_usr_id: input.receiver_usr_id.map(|x| vec![x]),
      // 接收人
      receiver_usr_id_lbl: input.receiver_usr_id_lbl.map(|x| vec![x]),
      // 已读
      is_read: input.is_read.map(|x| vec![x]),
      // 阅读时间
      read_time: input.read_time.map(|x| [Some(x), Some(x)]),
      // 组织
      org_id: input.org_id.map(|x| vec![x]),
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

impl_id!(MessageReceiverId);

/// 消息接收人 检测字段是否允许前端排序
pub fn check_sort_message_receiver(
  sort: Option<&[SortInput]>,
) -> Result<()> {
  
  if sort.is_none() {
    return Ok(());
  }
  
  let sort = sort.unwrap_or_default();
  
  if sort.is_empty() {
    return Ok(());
  }
  
  let get_can_sort_in_api_message_receiver = get_can_sort_in_api_message_receiver();
  
  for item in sort {
    let prop = item.prop.as_str();
    if prop.is_empty() {
      continue;
    }
    if !get_can_sort_in_api_message_receiver.contains(&prop) {
      return Err(eyre!(ServiceException {
        message: format!("check_sort_message_receiver: {}", serde_json::to_string(item)?).into(),
        trace: true,
        ..Default::default()
      }));
    }
  }
  
  Ok(())
}

// MARK: get_page_path_message_receiver
pub fn get_page_path_message_receiver() -> &'static str {
  "/base/message_receiver"
}

// MARK: get_table_name_message_receiver
pub fn get_table_name_message_receiver() -> &'static str {
  "base_message_receiver"
}
