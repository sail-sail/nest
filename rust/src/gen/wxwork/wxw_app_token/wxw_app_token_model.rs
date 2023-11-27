
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
pub struct WxwAppTokenModel {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: TenantId,
  /// ID
  pub id: WxwAppTokenId,
  /// 企微应用
  pub wxw_app_id: WxwAppId,
  /// 企微应用
  pub wxw_app_id_lbl: String,
  /// 类型corp和contact
  pub r#type: String,
  /// 令牌
  pub access_token: String,
  /// 令牌创建时间
  pub token_time: Option<chrono::NaiveDateTime>,
  /// 令牌创建时间
  pub token_time_lbl: String,
  /// 令牌超时时间
  pub expires_in: u32,
  /// 是否已删除
  pub is_deleted: u8,
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
      None => "".to_owned(),
    };
    // 令牌超时时间
    let expires_in: u32 = row.try_get("expires_in")?;
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
}

#[derive(InputObject, Default, Debug)]
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
  pub wxw_app_id: Option<Vec<WxwAppId>>,
  /// 企微应用
  pub wxw_app_id_is_null: Option<bool>,
  /// 类型corp和contact
  pub r#type: Option<String>,
  /// 类型corp和contact
  pub type_like: Option<String>,
  /// 令牌
  pub access_token: Option<String>,
  /// 令牌
  pub access_token_like: Option<String>,
  /// 令牌创建时间
  pub token_time: Option<Vec<chrono::NaiveDateTime>>,
  /// 令牌超时时间
  pub expires_in: Option<Vec<u32>>,
}

#[derive(InputObject, Default, Clone, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct WxwAppTokenInput {
  /// ID
  pub id: Option<WxwAppTokenId>,
  #[graphql(skip)]
  pub is_deleted: Option<u8>,
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  /// 企微应用
  pub wxw_app_id: Option<WxwAppId>,
  /// 企微应用
  pub wxw_app_id_lbl: Option<String>,
  /// 类型corp和contact
  pub r#type: Option<String>,
  /// 令牌
  pub access_token: Option<String>,
  /// 令牌创建时间
  pub token_time: Option<chrono::NaiveDateTime>,
  /// 令牌创建时间
  pub token_time_lbl: Option<String>,
  /// 令牌超时时间
  pub expires_in: Option<u32>,
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
      // 令牌超时时间
      expires_in: model.expires_in.into(),
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
      token_time: input.token_time.map(|x| vec![x, x]),
      // 令牌超时时间
      expires_in: input.expires_in.map(|x| vec![x, x]),
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
