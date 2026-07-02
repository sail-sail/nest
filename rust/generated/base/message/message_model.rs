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
use crate::base::usr::usr_model::UsrId;
use crate::base::org::org_model::OrgId;

static CAN_SORT_IN_API_MESSAGE: [&str; 2] = [
  "create_time",
  "update_time",
];

/// 消息 前端允许排序的字段
fn get_can_sort_in_api_message() -> &'static [&'static str; 2] {
  &CAN_SORT_IN_API_MESSAGE
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "MessageModel")]
#[allow(dead_code)]
pub struct MessageModel {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: TenantId,
  /// ID
  pub id: MessageId,
  /// 分类
  #[graphql(name = "category")]
  pub category: SmolStr,
  /// 分类
  #[graphql(name = "category_lbl")]
  pub category_lbl: SmolStr,
  /// 发送通道
  #[graphql(name = "channel")]
  pub channel: SmolStr,
  /// 发送通道
  #[graphql(name = "channel_lbl")]
  pub channel_lbl: SmolStr,
  /// 标题
  #[graphql(name = "title")]
  pub title: SmolStr,
  /// 内容
  #[graphql(name = "content")]
  pub content: SmolStr,
  /// 跳转路由
  #[graphql(name = "route_path")]
  pub route_path: SmolStr,
  /// 跳转参数
  #[graphql(name = "route_query")]
  pub route_query: SmolStr,
  /// 发送人
  #[graphql(name = "sender_usr_id")]
  pub sender_usr_id: UsrId,
  /// 发送人
  #[graphql(name = "sender_usr_id_lbl")]
  pub sender_usr_id_lbl: SmolStr,
  /// 系统消息
  #[graphql(name = "is_sys_msg")]
  pub is_sys_msg: u8,
  /// 系统消息
  #[graphql(name = "is_sys_msg_lbl")]
  pub is_sys_msg_lbl: SmolStr,
  /// 置顶
  #[graphql(name = "is_pinned")]
  pub is_pinned: u8,
  /// 置顶
  #[graphql(name = "is_pinned_lbl")]
  pub is_pinned_lbl: SmolStr,
  /// 所属组织
  #[graphql(name = "org_id")]
  pub org_id: OrgId,
  /// 所属组织
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

impl FromRow<'_, MySqlRow> for MessageModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;
    // ID
    let id: MessageId = row.try_get("id")?;
    // 分类
    let category: &str = row.try_get("category")?;
    let category = SmolStr::new(category);
    let category_lbl = category.clone();
    // 发送通道
    let channel: &str = row.try_get("channel")?;
    let channel = SmolStr::new(channel);
    let channel_lbl = channel.clone();
    // 标题
    let title: &str = row.try_get("title")?;
    let title = SmolStr::new(title);
    // 内容
    let content: &str = row.try_get("content")?;
    let content = SmolStr::new(content);
    // 跳转路由
    let route_path: &str = row.try_get("route_path")?;
    let route_path = SmolStr::new(route_path);
    // 跳转参数
    let route_query: &str = row.try_get("route_query")?;
    let route_query = SmolStr::new(route_query);
    // 发送人
    let sender_usr_id: UsrId = row.try_get("sender_usr_id")?;
    let sender_usr_id_lbl: Option<&str> = row.try_get("sender_usr_id_lbl")?;
    let sender_usr_id_lbl = SmolStr::new(sender_usr_id_lbl.unwrap_or_default());
    // 系统消息
    let is_sys_msg: u8 = row.try_get("is_sys_msg")?;
    let is_sys_msg_lbl = SmolStr::new(is_sys_msg.to_string());
    // 置顶
    let is_pinned: u8 = row.try_get("is_pinned")?;
    let is_pinned_lbl = SmolStr::new(is_pinned.to_string());
    // 所属组织
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
      category,
      category_lbl,
      channel,
      channel_lbl,
      title,
      content,
      route_path,
      route_query,
      sender_usr_id,
      sender_usr_id_lbl,
      is_sys_msg,
      is_sys_msg_lbl,
      is_pinned,
      is_pinned_lbl,
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
#[graphql(rename_fields = "snake_case", name = "MessageFieldComment")]
#[allow(dead_code)]
pub struct MessageFieldComment {
  /// ID
  #[graphql(name = "id")]
  pub id: SmolStr,
  /// 分类
  #[graphql(name = "category")]
  pub category: SmolStr,
  /// 分类
  #[graphql(name = "category_lbl")]
  pub category_lbl: SmolStr,
  /// 发送通道
  #[graphql(name = "channel")]
  pub channel: SmolStr,
  /// 发送通道
  #[graphql(name = "channel_lbl")]
  pub channel_lbl: SmolStr,
  /// 标题
  #[graphql(name = "title")]
  pub title: SmolStr,
  /// 内容
  #[graphql(name = "content")]
  pub content: SmolStr,
  /// 跳转路由
  #[graphql(name = "route_path")]
  pub route_path: SmolStr,
  /// 跳转参数
  #[graphql(name = "route_query")]
  pub route_query: SmolStr,
  /// 发送人
  #[graphql(name = "sender_usr_id")]
  pub sender_usr_id: SmolStr,
  /// 发送人
  #[graphql(name = "sender_usr_id_lbl")]
  pub sender_usr_id_lbl: SmolStr,
  /// 系统消息
  #[graphql(name = "is_sys_msg")]
  pub is_sys_msg: SmolStr,
  /// 系统消息
  #[graphql(name = "is_sys_msg_lbl")]
  pub is_sys_msg_lbl: SmolStr,
  /// 置顶
  #[graphql(name = "is_pinned")]
  pub is_pinned: SmolStr,
  /// 置顶
  #[graphql(name = "is_pinned_lbl")]
  pub is_pinned_lbl: SmolStr,
  /// 所属组织
  #[graphql(name = "org_id")]
  pub org_id: SmolStr,
  /// 所属组织
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
#[graphql(rename_fields = "snake_case", name = "MessageSearch")]
#[allow(dead_code)]
pub struct MessageSearch {
  /// ID
  pub id: Option<MessageId>,
  /// ID列表
  pub ids: Option<Vec<MessageId>>,
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  pub is_deleted: Option<u8>,
  /// 分类
  #[graphql(name = "category")]
  pub category: Option<Vec<SmolStr>>,
  /// 发送通道
  #[graphql(skip)]
  pub channel: Option<Vec<SmolStr>>,
  /// 标题
  #[graphql(name = "title")]
  pub title: Option<SmolStr>,
  /// 标题
  #[graphql(name = "title_like")]
  pub title_like: Option<SmolStr>,
  /// 内容
  #[graphql(skip)]
  pub content: Option<SmolStr>,
  /// 内容
  #[graphql(skip)]
  pub content_like: Option<SmolStr>,
  /// 跳转路由
  #[graphql(name = "route_path")]
  pub route_path: Option<SmolStr>,
  /// 跳转路由
  #[graphql(name = "route_path_like")]
  pub route_path_like: Option<SmolStr>,
  /// 跳转参数
  #[graphql(skip)]
  pub route_query: Option<SmolStr>,
  /// 跳转参数
  #[graphql(skip)]
  pub route_query_like: Option<SmolStr>,
  /// 发送人
  #[graphql(name = "sender_usr_id")]
  pub sender_usr_id: Option<Vec<UsrId>>,
  /// 发送人
  #[graphql(name = "sender_usr_id_is_null")]
  pub sender_usr_id_is_null: Option<bool>,
  /// 发送人
  #[graphql(name = "sender_usr_id_lbl")]
  pub sender_usr_id_lbl: Option<Vec<SmolStr>>,
  /// 发送人
  #[graphql(name = "sender_usr_id_lbl_like")]
  pub sender_usr_id_lbl_like: Option<SmolStr>,
  /// 系统消息
  #[graphql(skip)]
  pub is_sys_msg: Option<Vec<u8>>,
  /// 置顶
  #[graphql(skip)]
  pub is_pinned: Option<Vec<u8>>,
  /// 所属组织
  #[graphql(name = "org_id")]
  pub org_id: Option<Vec<OrgId>>,
  /// 所属组织
  #[graphql(name = "org_id_is_null")]
  pub org_id_is_null: Option<bool>,
  /// 所属组织
  #[graphql(name = "org_id_lbl")]
  pub org_id_lbl: Option<Vec<SmolStr>>,
  /// 所属组织
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

impl std::fmt::Debug for MessageSearch {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("MessageSearch");
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
    // 分类
    if let Some(ref category) = self.category {
      item = item.field("category", category);
    }
    // 发送通道
    if let Some(ref channel) = self.channel {
      item = item.field("channel", channel);
    }
    // 标题
    if let Some(ref title) = self.title {
      item = item.field("title", title);
    }
    if let Some(ref title_like) = self.title_like {
      item = item.field("title_like", title_like);
    }
    // 内容
    if let Some(ref content) = self.content {
      item = item.field("content", content);
    }
    if let Some(ref content_like) = self.content_like {
      item = item.field("content_like", content_like);
    }
    // 跳转路由
    if let Some(ref route_path) = self.route_path {
      item = item.field("route_path", route_path);
    }
    if let Some(ref route_path_like) = self.route_path_like {
      item = item.field("route_path_like", route_path_like);
    }
    // 跳转参数
    if let Some(ref route_query) = self.route_query {
      item = item.field("route_query", route_query);
    }
    if let Some(ref route_query_like) = self.route_query_like {
      item = item.field("route_query_like", route_query_like);
    }
    // 发送人
    if let Some(ref sender_usr_id) = self.sender_usr_id {
      item = item.field("sender_usr_id", sender_usr_id);
    }
    if let Some(ref sender_usr_id_lbl) = self.sender_usr_id_lbl {
      item = item.field("sender_usr_id_lbl", sender_usr_id_lbl);
    }
    if let Some(ref sender_usr_id_lbl_like) = self.sender_usr_id_lbl_like {
      item = item.field("sender_usr_id_lbl_like", sender_usr_id_lbl_like);
    }
    if let Some(ref sender_usr_id_is_null) = self.sender_usr_id_is_null {
      item = item.field("sender_usr_id_is_null", sender_usr_id_is_null);
    }
    // 系统消息
    if let Some(ref is_sys_msg) = self.is_sys_msg {
      item = item.field("is_sys_msg", is_sys_msg);
    }
    // 置顶
    if let Some(ref is_pinned) = self.is_pinned {
      item = item.field("is_pinned", is_pinned);
    }
    // 所属组织
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
#[graphql(rename_fields = "snake_case", name = "MessageInput")]
#[allow(dead_code)]
pub struct MessageInput {
  /// ID
  pub id: Option<MessageId>,
  /// 已删除
  #[graphql(skip)]
  pub is_deleted: Option<u8>,
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  /// 分类
  #[graphql(name = "category")]
  pub category: Option<SmolStr>,
  /// 分类
  #[graphql(name = "category_lbl")]
  pub category_lbl: Option<SmolStr>,
  /// 发送通道
  #[graphql(name = "channel")]
  pub channel: Option<SmolStr>,
  /// 发送通道
  #[graphql(name = "channel_lbl")]
  pub channel_lbl: Option<SmolStr>,
  /// 标题
  #[graphql(name = "title")]
  pub title: Option<SmolStr>,
  /// 内容
  #[graphql(name = "content")]
  pub content: Option<SmolStr>,
  /// 跳转路由
  #[graphql(name = "route_path")]
  pub route_path: Option<SmolStr>,
  /// 跳转参数
  #[graphql(name = "route_query")]
  pub route_query: Option<SmolStr>,
  /// 发送人
  #[graphql(name = "sender_usr_id")]
  pub sender_usr_id: Option<UsrId>,
  /// 发送人
  #[graphql(name = "sender_usr_id_lbl")]
  pub sender_usr_id_lbl: Option<SmolStr>,
  /// 系统消息
  #[graphql(name = "is_sys_msg")]
  pub is_sys_msg: Option<u8>,
  /// 系统消息
  #[graphql(name = "is_sys_msg_lbl")]
  pub is_sys_msg_lbl: Option<SmolStr>,
  /// 置顶
  #[graphql(name = "is_pinned")]
  pub is_pinned: Option<u8>,
  /// 置顶
  #[graphql(name = "is_pinned_lbl")]
  pub is_pinned_lbl: Option<SmolStr>,
  /// 所属组织
  #[graphql(name = "org_id")]
  pub org_id: Option<OrgId>,
  /// 所属组织
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

impl std::fmt::Debug for MessageInput {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("MessageInput");
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
    if let Some(ref category) = self.category {
      item = item.field("category", category);
    }
    if let Some(ref channel) = self.channel {
      item = item.field("channel", channel);
    }
    if let Some(ref title) = self.title {
      item = item.field("title", title);
    }
    if let Some(ref content) = self.content {
      item = item.field("content", content);
    }
    if let Some(ref route_path) = self.route_path {
      item = item.field("route_path", route_path);
    }
    if let Some(ref route_query) = self.route_query {
      item = item.field("route_query", route_query);
    }
    if let Some(ref sender_usr_id) = self.sender_usr_id {
      item = item.field("sender_usr_id", sender_usr_id);
    }
    if let Some(ref sender_usr_id_lbl) = self.sender_usr_id_lbl {
      item = item.field("sender_usr_id_lbl", sender_usr_id_lbl);
    }
    if let Some(ref is_sys_msg) = self.is_sys_msg {
      item = item.field("is_sys_msg", is_sys_msg);
    }
    if let Some(ref is_pinned) = self.is_pinned {
      item = item.field("is_pinned", is_pinned);
    }
    if let Some(ref org_id) = self.org_id {
      item = item.field("org_id", org_id);
    }
    if let Some(ref org_id_lbl) = self.org_id_lbl {
      item = item.field("org_id_lbl", org_id_lbl);
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

impl From<MessageModel> for MessageInput {
  fn from(model: MessageModel) -> Self {
    Self {
      id: model.id.into(),
      is_deleted: model.is_deleted.into(),
      tenant_id: model.tenant_id.into(),
      // 分类
      category: model.category.into(),
      category_lbl: model.category_lbl.into(),
      // 发送通道
      channel: model.channel.into(),
      channel_lbl: model.channel_lbl.into(),
      // 标题
      title: model.title.into(),
      // 内容
      content: model.content.into(),
      // 跳转路由
      route_path: model.route_path.into(),
      // 跳转参数
      route_query: model.route_query.into(),
      // 发送人
      sender_usr_id: model.sender_usr_id.into(),
      sender_usr_id_lbl: model.sender_usr_id_lbl.into(),
      // 系统消息
      is_sys_msg: model.is_sys_msg.into(),
      is_sys_msg_lbl: model.is_sys_msg_lbl.into(),
      // 置顶
      is_pinned: model.is_pinned.into(),
      is_pinned_lbl: model.is_pinned_lbl.into(),
      // 所属组织
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

impl From<MessageInput> for MessageSearch {
  fn from(input: MessageInput) -> Self {
    Self {
      id: input.id,
      ids: None,
      // 租户ID
      tenant_id: input.tenant_id,
      is_deleted: None,
      // 分类
      category: input.category.map(|x| vec![x]),
      // 发送通道
      channel: input.channel.map(|x| vec![x]),
      // 标题
      title: input.title,
      // 内容
      content: input.content,
      // 跳转路由
      route_path: input.route_path,
      // 跳转参数
      route_query: input.route_query,
      // 发送人
      sender_usr_id: input.sender_usr_id.map(|x| vec![x]),
      // 发送人
      sender_usr_id_lbl: input.sender_usr_id_lbl.map(|x| vec![x]),
      // 系统消息
      is_sys_msg: input.is_sys_msg.map(|x| vec![x]),
      // 置顶
      is_pinned: input.is_pinned.map(|x| vec![x]),
      // 所属组织
      org_id: input.org_id.map(|x| vec![x]),
      // 所属组织
      org_id_lbl: input.org_id_lbl.map(|x| vec![x]),
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

impl_id!(MessageId);

/// 消息 检测字段是否允许前端排序
pub fn check_sort_message(
  sort: Option<&[SortInput]>,
) -> Result<()> {
  
  if sort.is_none() {
    return Ok(());
  }
  
  let sort = sort.unwrap_or_default();
  
  if sort.is_empty() {
    return Ok(());
  }
  
  let get_can_sort_in_api_message = get_can_sort_in_api_message();
  
  for item in sort {
    let prop = item.prop.as_str();
    if prop.is_empty() {
      continue;
    }
    if !get_can_sort_in_api_message.contains(&prop) {
      return Err(eyre!(ServiceException {
        message: format!("check_sort_message: {}", serde_json::to_string(item)?).into(),
        trace: true,
        ..Default::default()
      }));
    }
  }
  
  Ok(())
}

// MARK: get_page_path_message
pub fn get_page_path_message() -> &'static str {
  "/base/message"
}

// MARK: get_table_name_message
pub fn get_table_name_message() -> &'static str {
  "base_message"
}
