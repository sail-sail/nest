
use std::fmt;
use std::ops::Deref;
#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use std::str::FromStr;
use serde::{Serialize, Deserialize};

use sqlx::encode::{Encode, IsNull};
use sqlx::MySql;
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

use crate::common::context::ArgType;

use crate::gen::base::tenant::tenant_model::TenantId;
use crate::gen::wxwork::wxw_app::wxw_app_model::WxwAppId;

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct WxwMsgModel {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: TenantId,
  /// ID
  pub id: WxwMsgId,
  /// 企微应用
  pub wxw_app_id: WxwAppId,
  /// 企微应用
  pub wxw_app_id_lbl: String,
  /// 发送状态
  pub errcode: WxwMsgErrcode,
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
  pub is_deleted: u8,
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
    let errcode: WxwMsgErrcode = errcode_lbl.clone().try_into()?;
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
      create_time,
      create_time_lbl,
      errmsg,
      msgid,
    };
    
    Ok(model)
  }
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Debug)]
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
  #[graphql(skip)]
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
  #[graphql(skip)]
  pub msgid: String,
}

#[derive(InputObject, Default, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct WxwMsgSearch {
  /// ID
  pub id: Option<WxwMsgId>,
  /// ID列表
  pub ids: Option<Vec<WxwMsgId>>,
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  pub is_deleted: Option<u8>,
  /// 企微应用
  pub wxw_app_id: Option<Vec<WxwAppId>>,
  /// 企微应用
  pub wxw_app_id_is_null: Option<bool>,
  /// 发送状态
  pub errcode: Option<Vec<WxwMsgErrcode>>,
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
  #[graphql(skip)]
  pub url: Option<String>,
  /// 链接
  #[graphql(skip)]
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
  #[graphql(skip)]
  pub msgid: Option<String>,
  /// 消息ID
  #[graphql(skip)]
  pub msgid_like: Option<String>,
}

#[derive(InputObject, Default, Clone, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct WxwMsgInput {
  /// ID
  pub id: Option<WxwMsgId>,
  #[graphql(skip)]
  pub is_deleted: Option<u8>,
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  /// 企微应用
  pub wxw_app_id: Option<WxwAppId>,
  /// 企微应用
  pub wxw_app_id_lbl: Option<String>,
  /// 发送状态
  pub errcode: Option<WxwMsgErrcode>,
  /// 发送状态
  pub errcode_lbl: Option<String>,
  /// 成员ID
  pub touser: Option<String>,
  /// 标题
  pub title: Option<String>,
  /// 描述
  pub description: Option<String>,
  /// 链接
  #[graphql(skip)]
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
  #[graphql(skip)]
  pub msgid: Option<String>,
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
      // 发送时间
      create_time: model.create_time,
      create_time_lbl: model.create_time_lbl.into(),
      // 错误信息
      errmsg: model.errmsg.into(),
      // 消息ID
      msgid: model.msgid.into(),
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
      create_time: input.create_time.map(|x| vec![x, x]),
      // 错误信息
      errmsg: input.errmsg,
      // 消息ID
      msgid: input.msgid,
      ..Default::default()
    }
  }
}

#[derive(Default, Serialize, Deserialize, Clone, Debug, PartialEq, Eq, Hash)]
pub struct WxwMsgId(SmolStr);

impl fmt::Display for WxwMsgId {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(f, "{}", self.0)
  }
}

#[async_graphql::Scalar(name = "WxwMsgId")]
impl async_graphql::ScalarType for WxwMsgId {
  fn parse(value: async_graphql::Value) -> async_graphql::InputValueResult<Self> {
    match value {
      async_graphql::Value::String(s) => Ok(Self(s.into())),
      _ => Err(async_graphql::InputValueError::expected_type(value)),
    }
  }
  
  fn to_value(&self) -> async_graphql::Value {
    async_graphql::Value::String(self.0.clone().into())
  }
}

impl From<WxwMsgId> for ArgType {
  fn from(value: WxwMsgId) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl From<&WxwMsgId> for ArgType {
  fn from(value: &WxwMsgId) -> Self {
    ArgType::SmolStr(value.clone().into())
  }
}

impl From<WxwMsgId> for SmolStr {
  fn from(id: WxwMsgId) -> Self {
    id.0
  }
}

impl From<SmolStr> for WxwMsgId {
  fn from(s: SmolStr) -> Self {
    Self(s)
  }
}

impl From<&SmolStr> for WxwMsgId {
  fn from(s: &SmolStr) -> Self {
    Self(s.clone())
  }
}

impl From<String> for WxwMsgId {
  fn from(s: String) -> Self {
    Self(s.into())
  }
}

impl From<&str> for WxwMsgId {
  fn from(s: &str) -> Self {
    Self(s.into())
  }
}

impl Deref for WxwMsgId {
  type Target = SmolStr;
  
  fn deref(&self) -> &SmolStr {
    &self.0
  }
}

impl Encode<'_, MySql> for WxwMsgId {
  fn encode_by_ref(&self, buf: &mut Vec<u8>) -> IsNull {
    <&str as Encode<MySql>>::encode(self.as_str(), buf)
  }
  
  fn size_hint(&self) -> usize {
    self.len()
  }
}

impl sqlx::Type<MySql> for WxwMsgId {
  fn type_info() -> <MySql as sqlx::Database>::TypeInfo {
    <&str as sqlx::Type<MySql>>::type_info()
  }
  
  fn compatible(ty: &<MySql as sqlx::Database>::TypeInfo) -> bool {
    <&str as sqlx::Type<MySql>>::compatible(ty)
  }
}

impl<'r> sqlx::Decode<'r, MySql> for WxwMsgId {
  fn decode(
    value: <MySql as sqlx::database::HasValueRef>::ValueRef,
  ) -> Result<Self, sqlx::error::BoxDynError> {
    <&str as sqlx::Decode<MySql>>::decode(value).map(Self::from)
  }
}

/// 企微消息发送状态
#[derive(Enum, Copy, Clone, Eq, PartialEq, Serialize, Deserialize, Debug)]
pub enum WxwMsgErrcode {
  /// Empty
  Empty,
  /// 成功
  #[graphql(name="0")]
  0,
  /// 失败
  #[graphql(name="81013")]
  81013,
}

impl fmt::Display for WxwMsgErrcode {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    match self {
      Self::Empty => write!(f, ""),
      Self::0 => write!(f, "0"),
      Self::81013 => write!(f, "81013"),
    }
  }
}

impl From<WxwMsgErrcode> for SmolStr {
  fn from(value: WxwMsgErrcode) -> Self {
    match value {
      WxwMsgErrcode::Empty => "".into(),
      WxwMsgErrcode::0 => "0".into(),
      WxwMsgErrcode::81013 => "81013".into(),
    }
  }
}

impl From<WxwMsgErrcode> for String {
  fn from(value: WxwMsgErrcode) -> Self {
    match value {
      WxwMsgErrcode::Empty => "".into(),
      WxwMsgErrcode::0 => "0".into(),
      WxwMsgErrcode::81013 => "81013".into(),
    }
  }
}

impl From<WxwMsgErrcode> for ArgType {
  fn from(value: WxwMsgErrcode) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl Default for WxwMsgErrcode {
  fn default() -> Self {
    Self::Empty,
  }
}

impl FromStr for WxwMsgErrcode {
  type Err = anyhow::Error;
  
  fn from_str(s: &str) -> Result<Self, Self::Err> {
    match s {
      "empty" => Ok(Self::Empty),
      "0" => Ok(Self::0),
      "81013" => Ok(Self::81013),
      _ => Err(anyhow::anyhow!("WxwMsgErrcode can't convert from {s}")),
    }
  }
}

impl WxwMsgErrcode {
  pub fn as_str(&self) -> &str {
    match self {
      Self::Empty => "",
      Self::0 => "0",
      Self::81013 => "81013",
    }
  }
}

impl TryFrom<String> for WxwMsgErrcode {
  type Error = sqlx::Error;
  
  fn try_from(s: String) -> Result<Self, Self::Error> {
    match s.as_str() {
      "" => Ok(Self::Empty),
      "0" => Ok(Self::0),
      "81013" => Ok(Self::81013),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "errcode".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "WxwMsgErrcode can't convert from {s}".to_owned(),
          )),
        }),
      )),
    }
  }
}
