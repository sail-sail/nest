#![allow(clippy::clone_on_copy)]
#![allow(clippy::redundant_clone)]
#![allow(clippy::collapsible_if)]

#[allow(unused_imports)]
use std::fmt;
#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use std::str::FromStr;
use std::sync::OnceLock;

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

use crate::base::tenant::tenant_model::TenantId;
use crate::wxwork::wxw_app::wxw_app_model::WxwAppId;
use crate::base::usr::usr_model::UsrId;

static CAN_SORT_IN_API_WXW_MSG: OnceLock<[&'static str; 2]> = OnceLock::new();

/// 企微消息 前端允许排序的字段
fn get_can_sort_in_api_wxw_msg() -> &'static [&'static str; 2] {
  CAN_SORT_IN_API_WXW_MSG.get_or_init(|| [
    "create_time",
    "update_time",
  ])
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "WxwMsgModel")]
#[allow(dead_code)]
pub struct WxwMsgModel {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: TenantId,
  /// ID
  pub id: WxwMsgId,
  /// 企微应用
  #[graphql(name = "wxw_app_id")]
  pub wxw_app_id: WxwAppId,
  /// 企微应用
  #[graphql(name = "wxw_app_id_lbl")]
  pub wxw_app_id_lbl: String,
  /// 发送状态
  #[graphql(name = "errcode")]
  pub errcode: String,
  /// 发送状态
  #[graphql(name = "errcode_lbl")]
  pub errcode_lbl: String,
  /// 成员ID
  #[graphql(name = "touser")]
  pub touser: String,
  /// 标题
  #[graphql(name = "title")]
  pub title: String,
  /// 描述
  #[graphql(name = "description")]
  pub description: String,
  /// 链接
  #[graphql(skip)]
  pub url: String,
  /// 按钮文字
  #[graphql(name = "btntxt")]
  pub btntxt: String,
  /// 错误信息
  #[graphql(name = "errmsg")]
  pub errmsg: String,
  /// 消息ID
  #[graphql(skip)]
  pub msgid: String,
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

impl FromRow<'_, MySqlRow> for WxwMsgModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;
    // ID
    let id: WxwMsgId = row.try_get("id")?;
    // 企微应用
    let wxw_app_id: WxwAppId = row.try_get("wxw_app_id")?;
    let wxw_app_id_lbl: Option<String> = row.try_get("wxw_app_id_lbl")?;
    let wxw_app_id_lbl = wxw_app_id_lbl.unwrap_or_default();
    // 发送状态
    let errcode_lbl: String = row.try_get("errcode")?;
    let errcode: String = errcode_lbl.clone();
    // 成员ID
    let touser: String = row.try_get("touser")?;
    // 标题
    let title: String = row.try_get("title")?;
    // 描述
    let description: String = row.try_get("description")?;
    // 链接
    let url: String = row.try_get("url")?;
    // 按钮文字
    let btntxt: String = row.try_get("btntxt")?;
    // 错误信息
    let errmsg: String = row.try_get("errmsg")?;
    // 消息ID
    let msgid: String = row.try_get("msgid")?;
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
      wxw_app_id,
      wxw_app_id_lbl,
      errcode,
      errcode_lbl,
      touser,
      title,
      description,
      url,
      btntxt,
      errmsg,
      msgid,
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
#[graphql(rename_fields = "snake_case", name = "WxwMsgFieldComment")]
#[allow(dead_code)]
pub struct WxwMsgFieldComment {
  /// ID
  #[graphql(name = "id")]
  pub id: String,
  /// 企微应用
  #[graphql(name = "wxw_app_id")]
  pub wxw_app_id: String,
  /// 企微应用
  #[graphql(name = "wxw_app_id_lbl")]
  pub wxw_app_id_lbl: String,
  /// 发送状态
  #[graphql(name = "errcode")]
  pub errcode: String,
  /// 发送状态
  #[graphql(name = "errcode_lbl")]
  pub errcode_lbl: String,
  /// 成员ID
  #[graphql(name = "touser")]
  pub touser: String,
  /// 标题
  #[graphql(name = "title")]
  pub title: String,
  /// 描述
  #[graphql(name = "description")]
  pub description: String,
  /// 按钮文字
  #[graphql(name = "btntxt")]
  pub btntxt: String,
  /// 发送时间
  #[graphql(name = "create_time")]
  pub create_time: String,
  /// 发送时间
  #[graphql(name = "create_time_lbl")]
  pub create_time_lbl: String,
  /// 错误信息
  #[graphql(name = "errmsg")]
  pub errmsg: String,
}

#[derive(InputObject, Default)]
#[graphql(rename_fields = "snake_case", name = "WxwMsgSearch")]
#[allow(dead_code)]
pub struct WxwMsgSearch {
  /// ID
  pub id: Option<WxwMsgId>,
  /// ID列表
  pub ids: Option<Vec<WxwMsgId>>,
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  pub is_deleted: Option<u8>,
  /// 企微应用
  #[graphql(name = "wxw_app_id")]
  pub wxw_app_id: Option<Vec<WxwAppId>>,
  /// 企微应用
  #[graphql(name = "wxw_app_id_save_null")]
  pub wxw_app_id_is_null: Option<bool>,
  /// 企微应用
  #[graphql(name = "wxw_app_id_lbl")]
  pub wxw_app_id_lbl: Option<Vec<String>>,
  /// 企微应用
  #[graphql(name = "wxw_app_id_lbl_like")]
  pub wxw_app_id_lbl_like: Option<String>,
  /// 发送状态
  #[graphql(name = "errcode")]
  pub errcode: Option<Vec<String>>,
  /// 成员ID
  #[graphql(skip)]
  pub touser: Option<String>,
  /// 成员ID
  #[graphql(skip)]
  pub touser_like: Option<String>,
  /// 标题
  #[graphql(skip)]
  pub title: Option<String>,
  /// 标题
  #[graphql(skip)]
  pub title_like: Option<String>,
  /// 描述
  #[graphql(skip)]
  pub description: Option<String>,
  /// 描述
  #[graphql(skip)]
  pub description_like: Option<String>,
  /// 链接
  #[graphql(skip)]
  pub url: Option<String>,
  /// 链接
  #[graphql(skip)]
  pub url_like: Option<String>,
  /// 按钮文字
  #[graphql(skip)]
  pub btntxt: Option<String>,
  /// 按钮文字
  #[graphql(skip)]
  pub btntxt_like: Option<String>,
  /// 发送时间
  #[graphql(name = "create_time")]
  pub create_time: Option<[Option<chrono::NaiveDateTime>; 2]>,
  /// 错误信息
  #[graphql(skip)]
  pub errmsg: Option<String>,
  /// 错误信息
  #[graphql(skip)]
  pub errmsg_like: Option<String>,
  /// 消息ID
  #[graphql(skip)]
  pub msgid: Option<String>,
  /// 消息ID
  #[graphql(skip)]
  pub msgid_like: Option<String>,
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

impl std::fmt::Debug for WxwMsgSearch {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("WxwMsgSearch");
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
    // 企微应用
    if let Some(ref wxw_app_id) = self.wxw_app_id {
      item = item.field("wxw_app_id", wxw_app_id);
    }
    if let Some(ref wxw_app_id_lbl) = self.wxw_app_id_lbl {
      item = item.field("wxw_app_id_lbl", wxw_app_id_lbl);
    }
    if let Some(ref wxw_app_id_lbl_like) = self.wxw_app_id_lbl_like {
      item = item.field("wxw_app_id_lbl_like", wxw_app_id_lbl_like);
    }
    if let Some(ref wxw_app_id_is_null) = self.wxw_app_id_is_null {
      item = item.field("wxw_app_id_is_null", wxw_app_id_is_null);
    }
    // 发送状态
    if let Some(ref errcode) = self.errcode {
      item = item.field("errcode", errcode);
    }
    // 成员ID
    if let Some(ref touser) = self.touser {
      item = item.field("touser", touser);
    }
    if let Some(ref touser_like) = self.touser_like {
      item = item.field("touser_like", touser_like);
    }
    // 标题
    if let Some(ref title) = self.title {
      item = item.field("title", title);
    }
    if let Some(ref title_like) = self.title_like {
      item = item.field("title_like", title_like);
    }
    // 描述
    if let Some(ref description) = self.description {
      item = item.field("description", description);
    }
    if let Some(ref description_like) = self.description_like {
      item = item.field("description_like", description_like);
    }
    // 链接
    if let Some(ref url) = self.url {
      item = item.field("url", url);
    }
    if let Some(ref url_like) = self.url_like {
      item = item.field("url_like", url_like);
    }
    // 按钮文字
    if let Some(ref btntxt) = self.btntxt {
      item = item.field("btntxt", btntxt);
    }
    if let Some(ref btntxt_like) = self.btntxt_like {
      item = item.field("btntxt_like", btntxt_like);
    }
    // 发送时间
    if let Some(ref create_time) = self.create_time {
      item = item.field("create_time", create_time);
    }
    // 错误信息
    if let Some(ref errmsg) = self.errmsg {
      item = item.field("errmsg", errmsg);
    }
    if let Some(ref errmsg_like) = self.errmsg_like {
      item = item.field("errmsg_like", errmsg_like);
    }
    // 消息ID
    if let Some(ref msgid) = self.msgid {
      item = item.field("msgid", msgid);
    }
    if let Some(ref msgid_like) = self.msgid_like {
      item = item.field("msgid_like", msgid_like);
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

#[derive(InputObject, Default, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "WxwMsgInput")]
#[allow(dead_code)]
pub struct WxwMsgInput {
  /// ID
  pub id: Option<WxwMsgId>,
  /// 已删除
  #[graphql(skip)]
  pub is_deleted: Option<u8>,
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  /// 企微应用
  #[graphql(name = "wxw_app_id")]
  pub wxw_app_id: Option<WxwAppId>,
  /// 企微应用
  #[graphql(name = "wxw_app_id_lbl")]
  pub wxw_app_id_lbl: Option<String>,
  /// 发送状态
  #[graphql(name = "errcode")]
  pub errcode: Option<String>,
  /// 发送状态
  #[graphql(name = "errcode_lbl")]
  pub errcode_lbl: Option<String>,
  /// 成员ID
  #[graphql(name = "touser")]
  pub touser: Option<String>,
  /// 标题
  #[graphql(name = "title")]
  pub title: Option<String>,
  /// 描述
  #[graphql(name = "description")]
  pub description: Option<String>,
  /// 链接
  #[graphql(skip)]
  pub url: Option<String>,
  /// 按钮文字
  #[graphql(name = "btntxt")]
  pub btntxt: Option<String>,
  /// 错误信息
  #[graphql(name = "errmsg")]
  pub errmsg: Option<String>,
  /// 消息ID
  #[graphql(skip)]
  pub msgid: Option<String>,
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

impl From<WxwMsgModel> for WxwMsgInput {
  fn from(model: WxwMsgModel) -> Self {
    Self {
      id: model.id.into(),
      is_deleted: model.is_deleted.into(),
      tenant_id: model.tenant_id.into(),
      // 企微应用
      wxw_app_id: model.wxw_app_id.into(),
      wxw_app_id_lbl: model.wxw_app_id_lbl.into(),
      // 发送状态
      errcode: model.errcode.into(),
      errcode_lbl: model.errcode_lbl.into(),
      // 成员ID
      touser: model.touser.into(),
      // 标题
      title: model.title.into(),
      // 描述
      description: model.description.into(),
      // 链接
      url: model.url.into(),
      // 按钮文字
      btntxt: model.btntxt.into(),
      // 错误信息
      errmsg: model.errmsg.into(),
      // 消息ID
      msgid: model.msgid.into(),
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

impl From<WxwMsgInput> for WxwMsgSearch {
  fn from(input: WxwMsgInput) -> Self {
    Self {
      id: input.id,
      ids: None,
      // 租户ID
      tenant_id: input.tenant_id,
      is_deleted: None,
      // 企微应用
      wxw_app_id: input.wxw_app_id.map(|x| vec![x]),
      // 发送状态
      errcode: input.errcode.map(|x| vec![x]),
      // 成员ID
      touser: input.touser,
      // 标题
      title: input.title,
      // 描述
      description: input.description,
      // 链接
      url: input.url,
      // 按钮文字
      btntxt: input.btntxt,
      // 发送时间
      create_time: input.create_time.map(|x| [Some(x), Some(x)]),
      // 错误信息
      errmsg: input.errmsg,
      // 消息ID
      msgid: input.msgid,
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

impl_id!(WxwMsgId);

/// 企微消息 检测字段是否允许前端排序
pub fn check_sort_wxw_msg(
  sort: Option<&[SortInput]>,
) -> Result<()> {
  
  if sort.is_none() {
    return Ok(());
  }
  let sort = sort.unwrap();
  
  let get_can_sort_in_api_wxw_msg = get_can_sort_in_api_wxw_msg();
  
  for item in sort {
    let prop = item.prop.as_str();
    if prop.is_empty() {
      continue;
    }
    if !get_can_sort_in_api_wxw_msg.contains(&prop) {
      return Err(eyre!("check_sort_wxw_msg: {}", serde_json::to_string(item)?));
    }
  }
  
  Ok(())
}

/// 获取路由地址
#[allow(dead_code)]
pub fn get_route_path_wxw_msg() -> String {
  "/wxwork/wxw_msg".to_owned()
}
