
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
use crate::gen::base::usr::usr_model::UsrId;

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "WxwAppTokenModel")]
pub struct WxwAppTokenModel {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: TenantId,
  /// ID
  pub id: WxwAppTokenId,
  /// 企微应用
  #[graphql(name = "wxw_app_id")]
  pub wxw_app_id: WxwAppId,
  /// 企微应用
  #[graphql(name = "wxw_app_id_lbl")]
  pub wxw_app_id_lbl: String,
  /// 类型corp和contact
  #[graphql(name = "type")]
  pub r#type: String,
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

impl FromRow<'_, MySqlRow> for WxwAppTokenModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;
    // ID
    let id: WxwAppTokenId = row.try_get("id")?;
    // 企微应用
    let wxw_app_id: WxwAppId = row.try_get("wxw_app_id")?;
    let wxw_app_id_lbl: Option<String> = row.try_get("wxw_app_id_lbl")?;
    let wxw_app_id_lbl = wxw_app_id_lbl.unwrap_or_default();
    // 类型corp和contact
    let r#type: String = row.try_get("type")?;
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
      tenant_id,
      is_deleted,
      id,
      wxw_app_id,
      wxw_app_id_lbl,
      r#type,
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
#[graphql(rename_fields = "snake_case")]
pub struct WxwAppTokenFieldComment {
  /// ID
  pub id: String,
  /// 企微应用
  pub wxw_app_id: String,
  /// 企微应用
  pub wxw_app_id_lbl: String,
  /// 类型corp和contact
  pub r#type: String,
  /// 令牌
  pub access_token: String,
  /// 令牌创建时间
  pub token_time: String,
  /// 令牌创建时间
  pub token_time_lbl: String,
  /// 令牌超时时间
  pub expires_in: String,
  /// 创建人
  #[graphql(skip)]
  pub create_usr_id: String,
  /// 创建人
  #[graphql(skip)]
  pub create_usr_id_lbl: String,
  /// 创建时间
  #[graphql(skip)]
  pub create_time: String,
  /// 创建时间
  #[graphql(skip)]
  pub create_time_lbl: String,
  /// 更新人
  #[graphql(skip)]
  pub update_usr_id: String,
  /// 更新人
  #[graphql(skip)]
  pub update_usr_id_lbl: String,
  /// 更新时间
  #[graphql(skip)]
  pub update_time: String,
  /// 更新时间
  #[graphql(skip)]
  pub update_time_lbl: String,
}

#[derive(InputObject, Default)]
#[graphql(rename_fields = "snake_case")]
pub struct WxwAppTokenSearch {
  /// ID
  pub id: Option<WxwAppTokenId>,
  /// ID列表
  pub ids: Option<Vec<WxwAppTokenId>>,
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
  /// 类型corp和contact
  #[graphql(skip)]
  pub r#type: Option<String>,
  /// 类型corp和contact
  #[graphql(skip)]
  pub type_like: Option<String>,
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
  /// 更新时间
  #[graphql(skip)]
  pub update_time: Option<[Option<chrono::NaiveDateTime>; 2]>,
}

impl std::fmt::Debug for WxwAppTokenSearch {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("WxwAppTokenSearch");
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
    if let Some(ref wxw_app_id_is_null) = self.wxw_app_id_is_null {
      item = item.field("wxw_app_id_is_null", wxw_app_id_is_null);
    }
    // 类型corp和contact
    if let Some(ref r#type) = self.r#type {
      item = item.field("r#type", r#type);
    }
    if let Some(ref r#type_like) = self.r#type_like {
      item = item.field("r#type_like", r#type_like);
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
#[graphql(rename_fields = "snake_case", name = "WxwAppTokenInput")]
pub struct WxwAppTokenInput {
  /// ID
  pub id: Option<WxwAppTokenId>,
  /// 删除
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
  /// 类型corp和contact
  #[graphql(name = "type")]
  pub r#type: Option<String>,
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

impl From<WxwAppTokenModel> for WxwAppTokenInput {
  fn from(model: WxwAppTokenModel) -> Self {
    Self {
      id: model.id.into(),
      is_deleted: model.is_deleted.into(),
      tenant_id: model.tenant_id.into(),
      // 企微应用
      wxw_app_id: model.wxw_app_id.into(),
      wxw_app_id_lbl: model.wxw_app_id_lbl.into(),
      // 类型corp和contact
      r#type: model.r#type.into(),
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

impl From<WxwAppTokenInput> for WxwAppTokenSearch {
  fn from(input: WxwAppTokenInput) -> Self {
    Self {
      id: input.id,
      ids: None,
      // 租户ID
      tenant_id: input.tenant_id,
      is_deleted: None,
      // 企微应用
      wxw_app_id: input.wxw_app_id.map(|x| vec![x]),
      // 类型corp和contact
      r#type: input.r#type,
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
pub struct WxwAppTokenId(SmolStr);

impl fmt::Display for WxwAppTokenId {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(f, "{}", self.0)
  }
}

#[async_graphql::Scalar(name = "WxwAppTokenId")]
impl async_graphql::ScalarType for WxwAppTokenId {
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

impl From<WxwAppTokenId> for ArgType {
  fn from(value: WxwAppTokenId) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl From<&WxwAppTokenId> for ArgType {
  fn from(value: &WxwAppTokenId) -> Self {
    ArgType::SmolStr(value.clone().into())
  }
}

impl From<WxwAppTokenId> for SmolStr {
  fn from(id: WxwAppTokenId) -> Self {
    id.0
  }
}

impl From<SmolStr> for WxwAppTokenId {
  fn from(s: SmolStr) -> Self {
    Self(s)
  }
}

impl From<&SmolStr> for WxwAppTokenId {
  fn from(s: &SmolStr) -> Self {
    Self(s.clone())
  }
}

impl From<String> for WxwAppTokenId {
  fn from(s: String) -> Self {
    Self(s.into())
  }
}

impl From<&str> for WxwAppTokenId {
  fn from(s: &str) -> Self {
    Self(s.into())
  }
}

impl Deref for WxwAppTokenId {
  type Target = SmolStr;
  
  fn deref(&self) -> &SmolStr {
    &self.0
  }
}

impl Encode<'_, MySql> for WxwAppTokenId {
  fn encode_by_ref(&self, buf: &mut Vec<u8>) -> IsNull {
    <&str as Encode<MySql>>::encode(self.as_str(), buf)
  }
  
  fn size_hint(&self) -> usize {
    self.len()
  }
}

impl sqlx::Type<MySql> for WxwAppTokenId {
  fn type_info() -> <MySql as sqlx::Database>::TypeInfo {
    <&str as sqlx::Type<MySql>>::type_info()
  }
  
  fn compatible(ty: &<MySql as sqlx::Database>::TypeInfo) -> bool {
    <&str as sqlx::Type<MySql>>::compatible(ty)
  }
}

impl<'r> sqlx::Decode<'r, MySql> for WxwAppTokenId {
  fn decode(
    value: <MySql as sqlx::database::HasValueRef>::ValueRef,
  ) -> Result<Self, sqlx::error::BoxDynError> {
    <&str as sqlx::Decode<MySql>>::decode(value).map(Self::from)
  }
}

impl PartialEq<str> for WxwAppTokenId {
  fn eq(&self, other: &str) -> bool {
    self.0 == other
  }
}