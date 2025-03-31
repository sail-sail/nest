
use std::fmt;
use std::ops::Deref;
#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use std::str::FromStr;
use std::sync::OnceLock;

use serde::{Serialize, Deserialize};

use color_eyre::eyre::{Result,eyre};

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

use crate::r#gen::base::tenant::tenant_model::TenantId;
use crate::r#gen::base::usr::usr_model::UsrId;

static CAN_SORT_IN_API_LOGIN_LOG: OnceLock<[&'static str; 2]> = OnceLock::new();

/// 登录日志 前端允许排序的字段
fn get_can_sort_in_api_login_log() -> &'static [&'static str; 2] {
  CAN_SORT_IN_API_LOGIN_LOG.get_or_init(|| [
    "create_time",
    "update_time",
  ])
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "LoginLogModel")]
#[allow(dead_code)]
pub struct LoginLogModel {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: TenantId,
  /// ID
  pub id: LoginLogId,
  /// 类型
  #[graphql(name = "type")]
  pub r#type: LoginLogType,
  /// 类型
  #[graphql(name = "type_lbl")]
  pub type_lbl: String,
  /// 用户名
  #[graphql(name = "username")]
  pub username: String,
  /// 登录成功
  #[graphql(name = "is_succ")]
  pub is_succ: u8,
  /// 登录成功
  #[graphql(name = "is_succ_lbl")]
  pub is_succ_lbl: String,
  /// IP
  #[graphql(name = "ip")]
  pub ip: String,
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

impl FromRow<'_, MySqlRow> for LoginLogModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;
    // ID
    let id: LoginLogId = row.try_get("id")?;
    // 类型
    let type_lbl: String = row.try_get("type")?;
    let r#type: LoginLogType = type_lbl.clone().try_into()?;
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
      r#type,
      type_lbl,
      username,
      is_succ,
      is_succ_lbl,
      ip,
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
#[allow(dead_code)]
pub struct LoginLogFieldComment {
  /// ID
  #[graphql(name = "id")]
  pub id: String,
  /// 类型
  #[graphql(name = "type")]
  pub r#type: String,
  /// 类型
  #[graphql(name = "type_lbl")]
  pub type_lbl: String,
  /// 用户名
  #[graphql(name = "username")]
  pub username: String,
  /// 登录成功
  #[graphql(name = "is_succ")]
  pub is_succ: String,
  /// 登录成功
  #[graphql(name = "is_succ_lbl")]
  pub is_succ_lbl: String,
  /// IP
  #[graphql(name = "ip")]
  pub ip: String,
  /// 登录时间
  #[graphql(name = "create_time")]
  pub create_time: String,
  /// 登录时间
  #[graphql(name = "create_time_lbl")]
  pub create_time_lbl: String,
}

#[derive(InputObject, Default)]
#[graphql(rename_fields = "snake_case")]
#[allow(dead_code)]
pub struct LoginLogSearch {
  /// ID
  pub id: Option<LoginLogId>,
  /// ID列表
  pub ids: Option<Vec<LoginLogId>>,
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  pub is_deleted: Option<u8>,
  /// 类型
  #[graphql(name = "type")]
  pub r#type: Option<Vec<LoginLogType>>,
  /// 用户名
  #[graphql(name = "username")]
  pub username: Option<String>,
  /// 用户名
  #[graphql(name = "username_like")]
  pub username_like: Option<String>,
  /// 登录成功
  #[graphql(name = "is_succ")]
  pub is_succ: Option<Vec<u8>>,
  /// IP
  #[graphql(name = "ip")]
  pub ip: Option<String>,
  /// IP
  #[graphql(name = "ip_like")]
  pub ip_like: Option<String>,
  /// 登录时间
  #[graphql(name = "create_time")]
  pub create_time: Option<[Option<chrono::NaiveDateTime>; 2]>,
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

impl std::fmt::Debug for LoginLogSearch {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("LoginLogSearch");
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
    // 类型
    if let Some(ref r#type) = self.r#type {
      item = item.field("r#type", r#type);
    }
    // 用户名
    if let Some(ref username) = self.username {
      item = item.field("username", username);
    }
    if let Some(ref username_like) = self.username_like {
      item = item.field("username_like", username_like);
    }
    // 登录成功
    if let Some(ref is_succ) = self.is_succ {
      item = item.field("is_succ", is_succ);
    }
    // IP
    if let Some(ref ip) = self.ip {
      item = item.field("ip", ip);
    }
    if let Some(ref ip_like) = self.ip_like {
      item = item.field("ip_like", ip_like);
    }
    // 登录时间
    if let Some(ref create_time) = self.create_time {
      item = item.field("create_time", create_time);
    }
    // 创建人
    if let Some(ref create_usr_id) = self.create_usr_id {
      item = item.field("create_usr_id", create_usr_id);
    }
    if let Some(ref create_usr_id_is_null) = self.create_usr_id_is_null {
      item = item.field("create_usr_id_is_null", create_usr_id_is_null);
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
#[graphql(rename_fields = "snake_case", name = "LoginLogInput")]
#[allow(dead_code)]
pub struct LoginLogInput {
  /// ID
  pub id: Option<LoginLogId>,
  /// 已删除
  #[graphql(skip)]
  pub is_deleted: Option<u8>,
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  /// 类型
  #[graphql(name = "type")]
  pub r#type: Option<LoginLogType>,
  /// 类型
  #[graphql(name = "type_lbl")]
  pub type_lbl: Option<String>,
  /// 用户名
  #[graphql(name = "username")]
  pub username: Option<String>,
  /// 登录成功
  #[graphql(name = "is_succ")]
  pub is_succ: Option<u8>,
  /// 登录成功
  #[graphql(name = "is_succ_lbl")]
  pub is_succ_lbl: Option<String>,
  /// IP
  #[graphql(name = "ip")]
  pub ip: Option<String>,
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

impl From<LoginLogModel> for LoginLogInput {
  fn from(model: LoginLogModel) -> Self {
    Self {
      id: model.id.into(),
      is_deleted: model.is_deleted.into(),
      tenant_id: model.tenant_id.into(),
      // 类型
      r#type: model.r#type.into(),
      type_lbl: model.type_lbl.into(),
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

impl From<LoginLogInput> for LoginLogSearch {
  fn from(input: LoginLogInput) -> Self {
    Self {
      id: input.id,
      ids: None,
      // 租户ID
      tenant_id: input.tenant_id,
      is_deleted: None,
      // 类型
      r#type: input.r#type.map(|x| vec![x]),
      // 用户名
      username: input.username,
      // 登录成功
      is_succ: input.is_succ.map(|x| vec![x]),
      // IP
      ip: input.ip,
      // 登录时间
      create_time: input.create_time.map(|x| [Some(x), Some(x)]),
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
  fn encode_by_ref(&self, buf: &mut Vec<u8>) -> sqlx::Result<IsNull, BoxDynError> {
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
    value: MySqlValueRef<'r>,
  ) -> Result<Self, BoxDynError> {
    <&str as sqlx::Decode<MySql>>::decode(value).map(Self::from)
  }
}

impl PartialEq<str> for LoginLogId {
  fn eq(&self, other: &str) -> bool {
    self.0 == other
  }
}

/// 登录日志类型
#[derive(Enum, Copy, Clone, Default, Eq, PartialEq, Serialize, Deserialize, Debug)]
pub enum LoginLogType {
  /// 账号
  #[default]
  #[graphql(name="account")]
  Account,
}

impl fmt::Display for LoginLogType {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    match self {
      Self::Account => write!(f, "account"),
    }
  }
}

impl From<LoginLogType> for SmolStr {
  fn from(value: LoginLogType) -> Self {
    match value {
      LoginLogType::Account => "account".into(),
    }
  }
}

impl From<LoginLogType> for String {
  fn from(value: LoginLogType) -> Self {
    match value {
      LoginLogType::Account => "account".into(),
    }
  }
}

impl From<LoginLogType> for ArgType {
  fn from(value: LoginLogType) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl FromStr for LoginLogType {
  type Err = color_eyre::eyre::Error;
  
  fn from_str(s: &str) -> Result<Self, Self::Err> {
    match s {
      "account" => Ok(Self::Account),
      _ => Err(eyre!("LoginLogType can't convert from {s}")),
    }
  }
}

impl LoginLogType {
  pub fn as_str(&self) -> &str {
    match self {
      Self::Account => "account",
    }
  }
}

impl TryFrom<String> for LoginLogType {
  type Error = sqlx::Error;
  
  fn try_from(s: String) -> Result<Self, sqlx::Error> {
    match s.as_str() {
      "account" => Ok(Self::Account),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "type".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "LoginLogType can't convert from {s}".to_owned(),
          )),
        }),
      )),
    }
  }
}

/// 登录日志 检测字段是否允许前端排序
pub fn check_sort_login_log(
  sort: Option<&[SortInput]>,
) -> Result<()> {
  
  if sort.is_none() {
    return Ok(());
  }
  let sort = sort.unwrap();
  
  let get_can_sort_in_api_login_log = get_can_sort_in_api_login_log();
  
  for item in sort {
    let prop = item.prop.as_str();
    if prop.is_empty() {
      continue;
    }
    if !get_can_sort_in_api_login_log.contains(&prop) {
      return Err(eyre!("check_sort_login_log: {}", serde_json::to_string(item)?));
    }
  }
  
  Ok(())
}

/// 获取路由地址
#[allow(dead_code)]
pub fn get_route_path_login_log() -> String {
  "/base/login_log".to_owned()
}
