
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
use crate::common::util::dao::decrypt;

use crate::gen::base::tenant::tenant_model::TenantId;
use crate::gen::base::domain::domain_model::DomainId;

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct WxwAppModel {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: TenantId,
  /// ID
  pub id: WxwAppId,
  /// 名称
  pub lbl: String,
  /// 企业ID
  pub corpid: String,
  /// 应用ID
  pub agentid: String,
  /// 可信域名
  pub domain_id: DomainId,
  /// 可信域名
  pub domain_id_lbl: String,
  /// 应用密钥
  pub corpsecret: String,
  /// 通讯录密钥
  pub contactsecret: String,
  /// 锁定
  pub is_locked: u8,
  /// 锁定
  pub is_locked_lbl: String,
  /// 启用
  pub is_enabled: u8,
  /// 启用
  pub is_enabled_lbl: String,
  /// 排序
  pub order_by: u32,
  /// 备注
  pub rem: String,
  /// 是否已删除
  pub is_deleted: u8,
}

impl FromRow<'_, MySqlRow> for WxwAppModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;
    // ID
    let id: WxwAppId = row.try_get("id")?;
    // 名称
    let lbl: String = row.try_get("lbl")?;
    // 企业ID
    let corpid: String = row.try_get("corpid")?;
    // 应用ID
    let agentid: String = row.try_get("agentid")?;
    // 可信域名
    let domain_id: DomainId = row.try_get("domain_id")?;
    let domain_id_lbl: Option<String> = row.try_get("domain_id_lbl")?;
    let domain_id_lbl = domain_id_lbl.unwrap_or_default();
    // 应用密钥
    let corpsecret: String = row.try_get("corpsecret")?;
    let corpsecret: String = decrypt(corpsecret.as_str());
    // 通讯录密钥
    let contactsecret: String = row.try_get("contactsecret")?;
    let contactsecret: String = decrypt(contactsecret.as_str());
    // 锁定
    let is_locked: u8 = row.try_get("is_locked")?;
    let is_locked_lbl: String = is_locked.to_string();
    // 启用
    let is_enabled: u8 = row.try_get("is_enabled")?;
    let is_enabled_lbl: String = is_enabled.to_string();
    // 排序
    let order_by: u32 = row.try_get("order_by")?;
    // 备注
    let rem: String = row.try_get("rem")?;
    // 是否已删除
    let is_deleted: u8 = row.try_get("is_deleted")?;
    
    let model = Self {
      tenant_id,
      is_deleted,
      id,
      lbl,
      corpid,
      agentid,
      domain_id,
      domain_id_lbl,
      corpsecret,
      contactsecret,
      is_locked,
      is_locked_lbl,
      is_enabled,
      is_enabled_lbl,
      order_by,
      rem,
    };
    
    Ok(model)
  }
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct WxwAppFieldComment {
  /// ID
  pub id: String,
  /// 名称
  pub lbl: String,
  /// 企业ID
  pub corpid: String,
  /// 应用ID
  pub agentid: String,
  /// 可信域名
  pub domain_id: String,
  /// 可信域名
  pub domain_id_lbl: String,
  /// 应用密钥
  pub corpsecret: String,
  /// 通讯录密钥
  pub contactsecret: String,
  /// 锁定
  pub is_locked: String,
  /// 锁定
  pub is_locked_lbl: String,
  /// 启用
  pub is_enabled: String,
  /// 启用
  pub is_enabled_lbl: String,
  /// 排序
  pub order_by: String,
  /// 备注
  pub rem: String,
}

#[derive(InputObject, Default, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct WxwAppSearch {
  /// ID
  pub id: Option<WxwAppId>,
  /// ID列表
  pub ids: Option<Vec<WxwAppId>>,
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  pub is_deleted: Option<u8>,
  /// 名称
  pub lbl: Option<String>,
  /// 名称
  pub lbl_like: Option<String>,
  /// 企业ID
  pub corpid: Option<String>,
  /// 企业ID
  pub corpid_like: Option<String>,
  /// 应用ID
  pub agentid: Option<String>,
  /// 应用ID
  pub agentid_like: Option<String>,
  /// 可信域名
  pub domain_id: Option<Vec<DomainId>>,
  /// 可信域名
  pub domain_id_is_null: Option<bool>,
  /// 应用密钥
  pub corpsecret: Option<String>,
  /// 应用密钥
  pub corpsecret_like: Option<String>,
  /// 通讯录密钥
  pub contactsecret: Option<String>,
  /// 通讯录密钥
  pub contactsecret_like: Option<String>,
  /// 锁定
  pub is_locked: Option<Vec<u8>>,
  /// 启用
  pub is_enabled: Option<Vec<u8>>,
  /// 排序
  pub order_by: Option<Vec<u32>>,
  /// 备注
  pub rem: Option<String>,
  /// 备注
  pub rem_like: Option<String>,
}

#[derive(InputObject, Default, Clone, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct WxwAppInput {
  /// ID
  pub id: Option<WxwAppId>,
  #[graphql(skip)]
  pub is_deleted: Option<u8>,
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  /// 名称
  pub lbl: Option<String>,
  /// 企业ID
  pub corpid: Option<String>,
  /// 应用ID
  pub agentid: Option<String>,
  /// 可信域名
  pub domain_id: Option<DomainId>,
  /// 可信域名
  pub domain_id_lbl: Option<String>,
  /// 应用密钥
  pub corpsecret: Option<String>,
  /// 通讯录密钥
  pub contactsecret: Option<String>,
  /// 锁定
  pub is_locked: Option<u8>,
  /// 锁定
  pub is_locked_lbl: Option<String>,
  /// 启用
  pub is_enabled: Option<u8>,
  /// 启用
  pub is_enabled_lbl: Option<String>,
  /// 排序
  pub order_by: Option<u32>,
  /// 备注
  pub rem: Option<String>,
}

impl From<WxwAppModel> for WxwAppInput {
  fn from(model: WxwAppModel) -> Self {
    Self {
      id: model.id.into(),
      is_deleted: model.is_deleted.into(),
      tenant_id: model.tenant_id.into(),
      // 名称
      lbl: model.lbl.into(),
      // 企业ID
      corpid: model.corpid.into(),
      // 应用ID
      agentid: model.agentid.into(),
      // 可信域名
      domain_id: model.domain_id.into(),
      domain_id_lbl: model.domain_id_lbl.into(),
      // 应用密钥
      corpsecret: model.corpsecret.into(),
      // 通讯录密钥
      contactsecret: model.contactsecret.into(),
      // 锁定
      is_locked: model.is_locked.into(),
      is_locked_lbl: model.is_locked_lbl.into(),
      // 启用
      is_enabled: model.is_enabled.into(),
      is_enabled_lbl: model.is_enabled_lbl.into(),
      // 排序
      order_by: model.order_by.into(),
      // 备注
      rem: model.rem.into(),
    }
  }
}

impl From<WxwAppInput> for WxwAppSearch {
  fn from(input: WxwAppInput) -> Self {
    Self {
      id: input.id,
      ids: None,
      // 租户ID
      tenant_id: input.tenant_id,
      is_deleted: None,
      // 名称
      lbl: input.lbl,
      // 企业ID
      corpid: input.corpid,
      // 应用ID
      agentid: input.agentid,
      // 可信域名
      domain_id: input.domain_id.map(|x| vec![x]),
      // 应用密钥
      corpsecret: input.corpsecret,
      // 通讯录密钥
      contactsecret: input.contactsecret,
      // 锁定
      is_locked: input.is_locked.map(|x| vec![x]),
      // 启用
      is_enabled: input.is_enabled.map(|x| vec![x]),
      // 排序
      order_by: input.order_by.map(|x| vec![x, x]),
      // 备注
      rem: input.rem,
      ..Default::default()
    }
  }
}

#[derive(Default, Serialize, Deserialize, Clone, Debug, PartialEq, Eq, Hash)]
pub struct WxwAppId(SmolStr);

impl fmt::Display for WxwAppId {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(f, "{}", self.0)
  }
}

#[async_graphql::Scalar(name = "WxwAppId")]
impl async_graphql::ScalarType for WxwAppId {
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

impl From<WxwAppId> for ArgType {
  fn from(value: WxwAppId) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl From<&WxwAppId> for ArgType {
  fn from(value: &WxwAppId) -> Self {
    ArgType::SmolStr(value.clone().into())
  }
}

impl From<WxwAppId> for SmolStr {
  fn from(id: WxwAppId) -> Self {
    id.0
  }
}

impl From<SmolStr> for WxwAppId {
  fn from(s: SmolStr) -> Self {
    Self(s)
  }
}

impl From<&SmolStr> for WxwAppId {
  fn from(s: &SmolStr) -> Self {
    Self(s.clone())
  }
}

impl From<String> for WxwAppId {
  fn from(s: String) -> Self {
    Self(s.into())
  }
}

impl From<&str> for WxwAppId {
  fn from(s: &str) -> Self {
    Self(s.into())
  }
}

impl Deref for WxwAppId {
  type Target = SmolStr;
  
  fn deref(&self) -> &SmolStr {
    &self.0
  }
}

impl Encode<'_, MySql> for WxwAppId {
  fn encode_by_ref(&self, buf: &mut Vec<u8>) -> IsNull {
    <&str as Encode<MySql>>::encode(self.as_str(), buf)
  }
  
  fn size_hint(&self) -> usize {
    self.len()
  }
}

impl sqlx::Type<MySql> for WxwAppId {
  fn type_info() -> <MySql as sqlx::Database>::TypeInfo {
    <&str as sqlx::Type<MySql>>::type_info()
  }
  
  fn compatible(ty: &<MySql as sqlx::Database>::TypeInfo) -> bool {
    <&str as sqlx::Type<MySql>>::compatible(ty)
  }
}

impl<'r> sqlx::Decode<'r, MySql> for WxwAppId {
  fn decode(
    value: <MySql as sqlx::database::HasValueRef>::ValueRef,
  ) -> Result<Self, sqlx::error::BoxDynError> {
    <&str as sqlx::Decode<MySql>>::decode(value).map(Self::from)
  }
}
