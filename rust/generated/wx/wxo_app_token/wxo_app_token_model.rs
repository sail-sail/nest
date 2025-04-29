
use std::fmt;
use std::ops::Deref;
#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use std::str::FromStr;
use std::sync::OnceLock;

use serde::{Serialize, Deserialize};

use color_eyre::eyre::{Result, eyre};

use sqlx::encode::{Encode, IsNull};
use sqlx::error::BoxDynError;
use sqlx::MySql;
use sqlx::mysql::MySqlValueRef;
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
use crate::common::gql::model::SortInput;
use crate::wx::wxo_app::wxo_app_model::WxoAppId;
use crate::base::usr::usr_model::UsrId;

static CAN_SORT_IN_API_WXO_APP_TOKEN: OnceLock<[&'static str; 2]> = OnceLock::new();

/// 小程序接口凭据 前端允许排序的字段
fn get_can_sort_in_api_wxo_app_token() -> &'static [&'static str; 2] {
  CAN_SORT_IN_API_WXO_APP_TOKEN.get_or_init(|| [
    "create_time",
    "update_time",
  ])
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "WxoAppTokenModel")]
#[allow(dead_code)]
pub struct WxoAppTokenModel {
  /// ID
  pub id: WxoAppTokenId,
  /// 小程序设置
  #[graphql(name = "wxo_app_id")]
  pub wxo_app_id: WxoAppId,
  /// 小程序设置
  #[graphql(name = "wxo_app_id_lbl")]
  pub wxo_app_id_lbl: String,
  /// 开发者ID
  #[graphql(name = "appid")]
  pub appid: String,
  /// 开发者密码
  #[graphql(name = "appsecret")]
  pub appsecret: String,
  /// 令牌
  #[graphql(name = "access_token")]
  pub access_token: String,
  /// 令牌创建时间
  #[graphql(name = "token_time")]
  pub token_time: Option<chrono::NaiveDateTime>,
  /// 令牌创建时间
  #[graphql(name = "token_time_lbl")]
  pub token_time_lbl: String,
  /// 令牌超时时间
  #[graphql(name = "expires_in")]
  pub expires_in: u32,
  /// 是否已删除
  pub is_deleted: u8,
  /// 创建人
  #[graphql(skip)]
  pub create_usr_id: UsrId,
  /// 创建人
  #[graphql(skip)]
  pub create_usr_id_lbl: String,
  /// 创建时间
  #[graphql(skip)]
  pub create_time: Option<chrono::NaiveDateTime>,
  /// 创建时间
  #[graphql(skip)]
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

impl FromRow<'_, MySqlRow> for WxoAppTokenModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // ID
    let id: WxoAppTokenId = row.try_get("id")?;
    // 小程序设置
    let wxo_app_id: WxoAppId = row.try_get("wxo_app_id")?;
    let wxo_app_id_lbl: Option<String> = row.try_get("wxo_app_id_lbl")?;
    let wxo_app_id_lbl = wxo_app_id_lbl.unwrap_or_default();
    // 开发者ID
    let appid: String = row.try_get("appid")?;
    // 开发者密码
    let appsecret: String = row.try_get("appsecret")?;
    // 令牌
    let access_token: String = row.try_get("access_token")?;
    // 令牌创建时间
    let token_time: Option<chrono::NaiveDateTime> = row.try_get("token_time")?;
    let token_time_lbl: String = match token_time {
      Some(item) => item.format("%Y-%m-%d %H:%M:%S").to_string(),
      None => String::new(),
    };
    // 令牌超时时间
    let expires_in: u32 = row.try_get("expires_in")?;
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
      is_deleted,
      id,
      wxo_app_id,
      wxo_app_id_lbl,
      appid,
      appsecret,
      access_token,
      token_time,
      token_time_lbl,
      expires_in,
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
#[graphql(rename_fields = "snake_case", name = "WxoAppTokenFieldComment")]
#[allow(dead_code)]
pub struct WxoAppTokenFieldComment {
  /// ID
  #[graphql(name = "id")]
  pub id: String,
  /// 小程序设置
  #[graphql(name = "wxo_app_id")]
  pub wxo_app_id: String,
  /// 小程序设置
  #[graphql(name = "wxo_app_id_lbl")]
  pub wxo_app_id_lbl: String,
  /// 开发者ID
  #[graphql(name = "appid")]
  pub appid: String,
  /// 开发者密码
  #[graphql(name = "appsecret")]
  pub appsecret: String,
  /// 令牌
  #[graphql(name = "access_token")]
  pub access_token: String,
  /// 令牌创建时间
  #[graphql(name = "token_time")]
  pub token_time: String,
  /// 令牌创建时间
  #[graphql(name = "token_time_lbl")]
  pub token_time_lbl: String,
  /// 令牌超时时间
  #[graphql(name = "expires_in")]
  pub expires_in: String,
}

#[derive(InputObject, Default)]
#[graphql(rename_fields = "snake_case", name = "WxoAppTokenSearch")]
#[allow(dead_code)]
pub struct WxoAppTokenSearch {
  /// ID
  pub id: Option<WxoAppTokenId>,
  /// ID列表
  pub ids: Option<Vec<WxoAppTokenId>>,
  pub is_deleted: Option<u8>,
  /// 小程序设置
  #[graphql(name = "wxo_app_id")]
  pub wxo_app_id: Option<Vec<WxoAppId>>,
  /// 小程序设置
  #[graphql(name = "wxo_app_id_save_null")]
  pub wxo_app_id_is_null: Option<bool>,
  /// 小程序设置
  #[graphql(name = "wxo_app_id_lbl")]
  pub wxo_app_id_lbl: Option<Vec<String>>,
  /// 小程序设置
  #[graphql(name = "wxo_app_id_lbl_like")]
  pub wxo_app_id_lbl_like: Option<String>,
  /// 开发者ID
  #[graphql(skip)]
  pub appid: Option<String>,
  /// 开发者ID
  #[graphql(skip)]
  pub appid_like: Option<String>,
  /// 开发者密码
  #[graphql(skip)]
  pub appsecret: Option<String>,
  /// 开发者密码
  #[graphql(skip)]
  pub appsecret_like: Option<String>,
  /// 令牌
  #[graphql(skip)]
  pub access_token: Option<String>,
  /// 令牌
  #[graphql(skip)]
  pub access_token_like: Option<String>,
  /// 令牌创建时间
  #[graphql(skip)]
  pub token_time: Option<[Option<chrono::NaiveDateTime>; 2]>,
  /// 令牌超时时间
  #[graphql(skip)]
  pub expires_in: Option<[Option<u32>; 2]>,
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
  pub update_usr_id_lbl: Option<Vec<String>>,
  /// 更新人
  #[graphql(skip)]
  pub update_usr_id_lbl_like: Option<String>,
  /// 更新时间
  #[graphql(skip)]
  pub update_time: Option<[Option<chrono::NaiveDateTime>; 2]>,
}

impl std::fmt::Debug for WxoAppTokenSearch {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("WxoAppTokenSearch");
    if let Some(ref id) = self.id {
      item = item.field("id", id);
    }
    if let Some(ref ids) = self.ids {
      item = item.field("ids", ids);
    }
    if let Some(ref is_deleted) = self.is_deleted {
      if *is_deleted == 1 {
        item = item.field("is_deleted", is_deleted);
      }
    }
    // 小程序设置
    if let Some(ref wxo_app_id) = self.wxo_app_id {
      item = item.field("wxo_app_id", wxo_app_id);
    }
    if let Some(ref wxo_app_id_lbl) = self.wxo_app_id_lbl {
      item = item.field("wxo_app_id_lbl", wxo_app_id_lbl);
    }
    if let Some(ref wxo_app_id_lbl_like) = self.wxo_app_id_lbl_like {
      item = item.field("wxo_app_id_lbl_like", wxo_app_id_lbl_like);
    }
    if let Some(ref wxo_app_id_is_null) = self.wxo_app_id_is_null {
      item = item.field("wxo_app_id_is_null", wxo_app_id_is_null);
    }
    // 开发者ID
    if let Some(ref appid) = self.appid {
      item = item.field("appid", appid);
    }
    if let Some(ref appid_like) = self.appid_like {
      item = item.field("appid_like", appid_like);
    }
    // 开发者密码
    if let Some(ref appsecret) = self.appsecret {
      item = item.field("appsecret", appsecret);
    }
    if let Some(ref appsecret_like) = self.appsecret_like {
      item = item.field("appsecret_like", appsecret_like);
    }
    // 令牌
    if let Some(ref access_token) = self.access_token {
      item = item.field("access_token", access_token);
    }
    if let Some(ref access_token_like) = self.access_token_like {
      item = item.field("access_token_like", access_token_like);
    }
    // 令牌创建时间
    if let Some(ref token_time) = self.token_time {
      item = item.field("token_time", token_time);
    }
    // 令牌超时时间
    if let Some(ref expires_in) = self.expires_in {
      item = item.field("expires_in", expires_in);
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

#[derive(InputObject, Default, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "WxoAppTokenInput")]
#[allow(dead_code)]
pub struct WxoAppTokenInput {
  /// ID
  pub id: Option<WxoAppTokenId>,
  /// 已删除
  #[graphql(skip)]
  pub is_deleted: Option<u8>,
  /// 小程序设置
  #[graphql(name = "wxo_app_id")]
  pub wxo_app_id: Option<WxoAppId>,
  /// 小程序设置
  #[graphql(name = "wxo_app_id_lbl")]
  pub wxo_app_id_lbl: Option<String>,
  /// 开发者ID
  #[graphql(name = "appid")]
  pub appid: Option<String>,
  /// 开发者密码
  #[graphql(name = "appsecret")]
  pub appsecret: Option<String>,
  /// 令牌
  #[graphql(name = "access_token")]
  pub access_token: Option<String>,
  /// 令牌创建时间
  #[graphql(name = "token_time")]
  pub token_time: Option<chrono::NaiveDateTime>,
  /// 令牌创建时间
  #[graphql(name = "token_time_lbl")]
  pub token_time_lbl: Option<String>,
  /// 令牌创建时间
  #[graphql(name = "token_time_save_null")]
  pub token_time_save_null: Option<bool>,
  /// 令牌超时时间
  #[graphql(name = "expires_in")]
  pub expires_in: Option<u32>,
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

impl From<WxoAppTokenModel> for WxoAppTokenInput {
  fn from(model: WxoAppTokenModel) -> Self {
    Self {
      id: model.id.into(),
      is_deleted: model.is_deleted.into(),
      // 小程序设置
      wxo_app_id: model.wxo_app_id.into(),
      wxo_app_id_lbl: model.wxo_app_id_lbl.into(),
      // 开发者ID
      appid: model.appid.into(),
      // 开发者密码
      appsecret: model.appsecret.into(),
      // 令牌
      access_token: model.access_token.into(),
      // 令牌创建时间
      token_time: model.token_time,
      token_time_lbl: model.token_time_lbl.into(),
      token_time_save_null: Some(true),
      // 令牌超时时间
      expires_in: model.expires_in.into(),
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

impl From<WxoAppTokenInput> for WxoAppTokenSearch {
  fn from(input: WxoAppTokenInput) -> Self {
    Self {
      id: input.id,
      ids: None,
      is_deleted: None,
      // 小程序设置
      wxo_app_id: input.wxo_app_id.map(|x| vec![x]),
      // 开发者ID
      appid: input.appid,
      // 开发者密码
      appsecret: input.appsecret,
      // 令牌
      access_token: input.access_token,
      // 令牌创建时间
      token_time: input.token_time.map(|x| [Some(x), Some(x)]),
      // 令牌超时时间
      expires_in: input.expires_in.map(|x| [Some(x), Some(x)]),
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

#[derive(Default, Serialize, Deserialize, Clone, Debug, PartialEq, Eq, Hash)]
pub struct WxoAppTokenId(SmolStr);

impl fmt::Display for WxoAppTokenId {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(f, "{}", self.0)
  }
}

#[async_graphql::Scalar(name = "WxoAppTokenId")]
impl async_graphql::ScalarType for WxoAppTokenId {
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

impl From<WxoAppTokenId> for ArgType {
  fn from(value: WxoAppTokenId) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl From<&WxoAppTokenId> for ArgType {
  fn from(value: &WxoAppTokenId) -> Self {
    ArgType::SmolStr(value.clone().into())
  }
}

impl From<WxoAppTokenId> for SmolStr {
  fn from(id: WxoAppTokenId) -> Self {
    id.0
  }
}

impl From<SmolStr> for WxoAppTokenId {
  fn from(s: SmolStr) -> Self {
    Self(s)
  }
}

impl From<&SmolStr> for WxoAppTokenId {
  fn from(s: &SmolStr) -> Self {
    Self(s.clone())
  }
}

impl From<String> for WxoAppTokenId {
  fn from(s: String) -> Self {
    Self(s.into())
  }
}

impl From<&str> for WxoAppTokenId {
  fn from(s: &str) -> Self {
    Self(s.into())
  }
}

impl Deref for WxoAppTokenId {
  type Target = SmolStr;
  
  fn deref(&self) -> &SmolStr {
    &self.0
  }
}

impl Encode<'_, MySql> for WxoAppTokenId {
  fn encode_by_ref(&self, buf: &mut Vec<u8>) -> sqlx::Result<IsNull, BoxDynError> {
    <&str as Encode<MySql>>::encode(self.as_str(), buf)
  }
  
  fn size_hint(&self) -> usize {
    self.len()
  }
}

impl sqlx::Type<MySql> for WxoAppTokenId {
  fn type_info() -> <MySql as sqlx::Database>::TypeInfo {
    <&str as sqlx::Type<MySql>>::type_info()
  }
  
  fn compatible(ty: &<MySql as sqlx::Database>::TypeInfo) -> bool {
    <&str as sqlx::Type<MySql>>::compatible(ty)
  }
}

impl<'r> sqlx::Decode<'r, MySql> for WxoAppTokenId {
  fn decode(
    value: MySqlValueRef<'r>,
  ) -> Result<Self, BoxDynError> {
    <&str as sqlx::Decode<MySql>>::decode(value).map(Self::from)
  }
}

impl PartialEq<str> for WxoAppTokenId {
  fn eq(&self, other: &str) -> bool {
    self.0 == other
  }
}

/// 小程序接口凭据 检测字段是否允许前端排序
pub fn check_sort_wxo_app_token(
  sort: Option<&[SortInput]>,
) -> Result<()> {
  
  if sort.is_none() {
    return Ok(());
  }
  let sort = sort.unwrap();
  
  let get_can_sort_in_api_wxo_app_token = get_can_sort_in_api_wxo_app_token();
  
  for item in sort {
    let prop = item.prop.as_str();
    if prop.is_empty() {
      continue;
    }
    if !get_can_sort_in_api_wxo_app_token.contains(&prop) {
      return Err(eyre!("check_sort_wxo_app_token: {}", serde_json::to_string(item)?));
    }
  }
  
  Ok(())
}

/// 获取路由地址
#[allow(dead_code)]
pub fn get_route_path_wxo_app_token() -> String {
  "/wx/wxo_app_token".to_owned()
}
