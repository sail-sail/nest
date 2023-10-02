use serde::{
  Serialize,
  Deserialize,
};

use sqlx::{
  FromRow,
  mysql::MySqlRow,
  Row,
};

use async_graphql::{
  SimpleObject,
  InputObject,
};

#[derive(SimpleObject, Debug, Default, Serialize, Deserialize, Clone)]
#[graphql(rename_fields = "snake_case")]
pub struct WxwMsgModel {
  /// ID
  pub id: String,
  /// 企微应用
  pub wxw_app_id: String,
  /// 企微应用
  pub wxw_app_id_lbl: String,
  /// 发送状态
  pub errcode: String,
  /// 发送状态
  pub errcode_lbl: String,
  /// 成员ID
  pub touser: String,
  /// 标题
  pub title: String,
  /// 描述
  pub description: String,
  /// 链接
  pub url: String,
  /// 按钮文字
  pub btntxt: String,
  /// 发送时间
  pub create_time: Option<chrono::NaiveDateTime>,
  /// 发送时间
  pub create_time_lbl: String,
  /// 错误信息
  pub errmsg: String,
  /// 消息ID
  pub msgid: String,
  /// 是否已删除
  is_deleted: u8,
}

impl FromRow<'_, MySqlRow> for WxwMsgModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // ID
    let id: String = row.try_get("id")?;
    // 企微应用
    let wxw_app_id: String = row.try_get("wxw_app_id")?;
    let wxw_app_id_lbl: Option<String> = row.try_get("wxw_app_id_lbl")?;
    let wxw_app_id_lbl = wxw_app_id_lbl.unwrap_or_default();
    // 发送状态
    let errcode: String = row.try_get("errcode")?;
    let errcode_lbl: String = errcode.to_string();
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
    // 发送时间
    let create_time: Option<chrono::NaiveDateTime> = row.try_get("create_time")?;
    let create_time_lbl: String = match create_time {
      Some(item) => item.format("%Y-%m-%d %H:%M:%S").to_string(),
      None => "".to_owned(),
    };
    // 错误信息
    let errmsg: String = row.try_get("errmsg")?;
    // 消息ID
    let msgid: String = row.try_get("msgid")?;
    // 是否已删除
    let is_deleted: u8 = row.try_get("is_deleted")?;
    
    let model = Self {
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
      create_time,
      create_time_lbl,
      errmsg,
      msgid,
      is_deleted,
    };
    
    Ok(model)
  }
}

#[derive(SimpleObject, Debug, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct WxwMsgFieldComment {
  /// ID
  pub id: String,
  /// 企微应用
  pub wxw_app_id: String,
  /// 企微应用
  pub wxw_app_id_lbl: String,
  /// 发送状态
  pub errcode: String,
  /// 发送状态
  pub errcode_lbl: String,
  /// 成员ID
  pub touser: String,
  /// 标题
  pub title: String,
  /// 描述
  pub description: String,
  /// 链接
  pub url: String,
  /// 按钮文字
  pub btntxt: String,
  /// 发送时间
  pub create_time: String,
  /// 发送时间
  pub create_time_lbl: String,
  /// 错误信息
  pub errmsg: String,
  /// 消息ID
  pub msgid: String,
}

#[derive(InputObject, Debug, Default)]
#[graphql(rename_fields = "snake_case")]
pub struct WxwMsgSearch {
  pub id: Option<String>,
  pub ids: Option<Vec<String>>,
  #[graphql(skip)]
  pub tenant_id: Option<String>,
  pub is_deleted: Option<u8>,
  /// 企微应用
  pub wxw_app_id: Option<Vec<String>>,
  /// 企微应用
  pub wxw_app_id_is_null: Option<bool>,
  /// 发送状态
  pub errcode: Option<Vec<String>>,
  /// 成员ID
  pub touser: Option<String>,
  /// 成员ID
  pub touser_like: Option<String>,
  /// 标题
  pub title: Option<String>,
  /// 标题
  pub title_like: Option<String>,
  /// 描述
  pub description: Option<String>,
  /// 描述
  pub description_like: Option<String>,
  /// 链接
  pub url: Option<String>,
  /// 链接
  pub url_like: Option<String>,
  /// 按钮文字
  pub btntxt: Option<String>,
  /// 按钮文字
  pub btntxt_like: Option<String>,
  /// 发送时间
  pub create_time: Option<Vec<chrono::NaiveDateTime>>,
  /// 错误信息
  pub errmsg: Option<String>,
  /// 错误信息
  pub errmsg_like: Option<String>,
  /// 消息ID
  pub msgid: Option<String>,
  /// 消息ID
  pub msgid_like: Option<String>,
}

#[derive(FromModel, InputObject, Debug, Default, Clone)]
#[graphql(rename_fields = "snake_case")]
pub struct WxwMsgInput {
  /// ID
  pub id: Option<String>,
  /// 企微应用
  pub wxw_app_id: Option<String>,
  /// 企微应用
  pub wxw_app_id_lbl: Option<String>,
  /// 发送状态
  pub errcode: Option<String>,
  /// 发送状态
  pub errcode_lbl: Option<String>,
  /// 成员ID
  pub touser: Option<String>,
  /// 标题
  pub title: Option<String>,
  /// 描述
  pub description: Option<String>,
  /// 链接
  pub url: Option<String>,
  /// 按钮文字
  pub btntxt: Option<String>,
  /// 发送时间
  pub create_time: Option<chrono::NaiveDateTime>,
  /// 发送时间
  pub create_time_lbl: Option<String>,
  /// 错误信息
  pub errmsg: Option<String>,
  /// 消息ID
  pub msgid: Option<String>,
}

impl From<WxwMsgInput> for WxwMsgSearch {
  fn from(input: WxwMsgInput) -> Self {
    Self {
      id: input.id.map(|x| x.into()),
      ids: None,
      tenant_id: None,
      is_deleted: None,
      // 企微应用
      wxw_app_id: input.wxw_app_id.map(|x| vec![x.into()]),
      // 发送状态
      errcode: input.errcode.map(|x| vec![x.into()]),
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
      create_time: input.create_time.map(|x| vec![x.clone().into(), x.clone().into()]),
      // 错误信息
      errmsg: input.errmsg,
      // 消息ID
      msgid: input.msgid,
      ..Default::default()
    }
  }
}
