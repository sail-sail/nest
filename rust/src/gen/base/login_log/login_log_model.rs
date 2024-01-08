
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
use crate::gen::base::usr::usr_model::UsrId;

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct LoginLogModel {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: TenantId,
  /// ID
  pub id: LoginLogId,
  /// 用户名
  pub username: String,
  /// 登录成功
  pub is_succ: u8,
  /// 登录成功
  pub is_succ_lbl: String,
  /// IP
  pub ip: String,
  /// 创建人
  pub create_usr_id: UsrId,
  /// 创建人
  pub create_usr_id_lbl: String,
  /// 创建时间
  pub create_time: Option<chrono::NaiveDateTime>,
  /// 创建时间
  pub create_time_lbl: String,
  /// 是否已删除
  pub is_deleted: u8,
}

impl FromRow<'_, MySqlRow> for LoginLogModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;
    // ID
    let id: LoginLogId = row.try_get("id")?;
    // 用户名
    let username: String = row.try_get("username")?;
    // 登录成功
    let is_succ: u8 = row.try_get("is_succ")?;
    let is_succ_lbl: String = is_succ.to_string();
    // IP
    let ip: String = row.try_get("ip")?;
    // 创建人
    let create_usr_id: UsrId = row.try_get("create_usr_id")?;
    let create_usr_id_lbl: Option<String> = row.try_get("create_usr_id_lbl")?;
    let create_usr_id_lbl = create_usr_id_lbl.unwrap_or_default();
    // 创建时间
    let create_time: Option<chrono::NaiveDateTime> = row.try_get("create_time")?;
    let create_time_lbl: String = match create_time {
      Some(item) => item.format("%Y-%m-%d %H:%M:%S").to_string(),
      None => "".to_owned(),
    };
    // 是否已删除
    let is_deleted: u8 = row.try_get("is_deleted")?;
    
    let model = Self {
      tenant_id,
      is_deleted,
      id,
      username,
      is_succ,
      is_succ_lbl,
      ip,
      create_usr_id,
      create_usr_id_lbl,
      create_time,
      create_time_lbl,
    };
    
    Ok(model)
  }
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct LoginLogFieldComment {
  /// ID
  pub id: String,
  /// 用户名
  pub username: String,
  /// 登录成功
  pub is_succ: String,
  /// 登录成功
  pub is_succ_lbl: String,
  /// IP
  pub ip: String,
  /// 创建人
  pub create_usr_id: String,
  /// 创建人
  pub create_usr_id_lbl: String,
  /// 创建时间
  pub create_time: String,
  /// 创建时间
  pub create_time_lbl: String,
}

#[derive(InputObject, Default, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct LoginLogSearch {
  /// ID
  pub id: Option<LoginLogId>,
  /// ID列表
  pub ids: Option<Vec<LoginLogId>>,
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  pub is_deleted: Option<u8>,
  /// 用户名
  pub username: Option<String>,
  /// 用户名
  pub username_like: Option<String>,
  /// 登录成功
  pub is_succ: Option<Vec<u8>>,
  /// IP
  pub ip: Option<String>,
  /// IP
  pub ip_like: Option<String>,
  /// 创建人
  pub create_usr_id: Option<Vec<UsrId>>,
  /// 创建人
  pub create_usr_id_is_null: Option<bool>,
  /// 创建时间
  pub create_time: Option<Vec<chrono::NaiveDateTime>>,
}

#[derive(InputObject, Default, Clone, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct LoginLogInput {
  /// ID
  pub id: Option<LoginLogId>,
  #[graphql(skip)]
  pub is_deleted: Option<u8>,
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  /// 用户名
  pub username: Option<String>,
  /// 登录成功
  pub is_succ: Option<u8>,
  /// 登录成功
  pub is_succ_lbl: Option<String>,
  /// IP
  pub ip: Option<String>,
  /// 创建人
  pub create_usr_id: Option<UsrId>,
  /// 创建人
  pub create_usr_id_lbl: Option<String>,
  /// 创建时间
  pub create_time: Option<chrono::NaiveDateTime>,
  /// 创建时间
  pub create_time_lbl: Option<String>,
}

impl From<LoginLogModel> for LoginLogInput {
  fn from(model: LoginLogModel) -> Self {
    Self {
      id: model.id.into(),
      is_deleted: model.is_deleted.into(),
      tenant_id: model.tenant_id.into(),
      // 用户名
      username: model.username.into(),
      // 登录成功
      is_succ: model.is_succ.into(),
      is_succ_lbl: model.is_succ_lbl.into(),
      // IP
      ip: model.ip.into(),
      // 创建人
      create_usr_id: model.create_usr_id.into(),
      create_usr_id_lbl: model.create_usr_id_lbl.into(),
      // 创建时间
      create_time: model.create_time,
      create_time_lbl: model.create_time_lbl.into(),
    }
  }
}

impl From<LoginLogInput> for LoginLogSearch {
  fn from(input: LoginLogInput) -> Self {
    Self {
      id: input.id,
      ids: None,
      // 租户ID
      tenant_id: input.tenant_id,
      is_deleted: None,
      // 用户名
      username: input.username,
      // 登录成功
      is_succ: input.is_succ.map(|x| vec![x]),
      // IP
      ip: input.ip,
      // 创建人
      create_usr_id: input.create_usr_id.map(|x| vec![x]),
      // 创建时间
      create_time: input.create_time.map(|x| vec![x, x]),
      ..Default::default()
    }
  }
}

#[derive(Default, Serialize, Deserialize, Clone, Debug, PartialEq, Eq, Hash)]
pub struct LoginLogId(SmolStr);

impl fmt::Display for LoginLogId {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(f, "{}", self.0)
  }
}

#[async_graphql::Scalar(name = "LoginLogId")]
impl async_graphql::ScalarType for LoginLogId {
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

impl From<LoginLogId> for ArgType {
  fn from(value: LoginLogId) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl From<&LoginLogId> for ArgType {
  fn from(value: &LoginLogId) -> Self {
    ArgType::SmolStr(value.clone().into())
  }
}

impl From<LoginLogId> for SmolStr {
  fn from(id: LoginLogId) -> Self {
    id.0
  }
}

impl From<SmolStr> for LoginLogId {
  fn from(s: SmolStr) -> Self {
    Self(s)
  }
}

impl From<&SmolStr> for LoginLogId {
  fn from(s: &SmolStr) -> Self {
    Self(s.clone())
  }
}

impl From<String> for LoginLogId {
  fn from(s: String) -> Self {
    Self(s.into())
  }
}

impl From<&str> for LoginLogId {
  fn from(s: &str) -> Self {
    Self(s.into())
  }
}

impl Deref for LoginLogId {
  type Target = SmolStr;
  
  fn deref(&self) -> &SmolStr {
    &self.0
  }
}

impl Encode<'_, MySql> for LoginLogId {
  fn encode_by_ref(&self, buf: &mut Vec<u8>) -> IsNull {
    <&str as Encode<MySql>>::encode(self.as_str(), buf)
  }
  
  fn size_hint(&self) -> usize {
    self.len()
  }
}

impl sqlx::Type<MySql> for LoginLogId {
  fn type_info() -> <MySql as sqlx::Database>::TypeInfo {
    <&str as sqlx::Type<MySql>>::type_info()
  }
  
  fn compatible(ty: &<MySql as sqlx::Database>::TypeInfo) -> bool {
    <&str as sqlx::Type<MySql>>::compatible(ty)
  }
}

impl<'r> sqlx::Decode<'r, MySql> for LoginLogId {
  fn decode(
    value: <MySql as sqlx::database::HasValueRef>::ValueRef,
  ) -> Result<Self, sqlx::error::BoxDynError> {
    <&str as sqlx::Decode<MySql>>::decode(value).map(Self::from)
  }
}
