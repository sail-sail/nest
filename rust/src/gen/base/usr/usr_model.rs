
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
use crate::gen::base::org::org_model::OrgId;
use crate::gen::base::dept::dept_model::DeptId;
use crate::gen::base::role::role_model::RoleId;

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct UsrModel {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: TenantId,
  /// 隐藏字段
  #[graphql(skip)]
  pub is_hidden: u8,
  /// ID
  pub id: UsrId,
  /// 头像
  pub img: String,
  /// 名称
  pub lbl: String,
  /// 用户名
  pub username: String,
  /// 密码
  pub password: String,
  /// 所属组织
  pub org_ids: Vec<OrgId>,
  /// 所属组织
  pub org_ids_lbl: Vec<String>,
  /// 默认组织
  pub default_org_id: OrgId,
  /// 默认组织
  pub default_org_id_lbl: String,
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
  /// 所属部门
  pub dept_ids: Vec<DeptId>,
  /// 所属部门
  pub dept_ids_lbl: Vec<String>,
  /// 拥有角色
  pub role_ids: Vec<RoleId>,
  /// 拥有角色
  pub role_ids_lbl: Vec<String>,
  /// 备注
  pub rem: String,
  /// 创建人
  pub create_usr_id: UsrId,
  /// 创建人
  pub create_usr_id_lbl: String,
  /// 创建时间
  pub create_time: Option<chrono::NaiveDateTime>,
  /// 创建时间
  pub create_time_lbl: String,
  /// 更新人
  pub update_usr_id: UsrId,
  /// 更新人
  pub update_usr_id_lbl: String,
  /// 更新时间
  pub update_time: Option<chrono::NaiveDateTime>,
  /// 更新时间
  pub update_time_lbl: String,
  /// 是否已删除
  pub is_deleted: u8,
}

impl FromRow<'_, MySqlRow> for UsrModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;
    // 隐藏字段
    let is_hidden = row.try_get("is_hidden")?;
    // ID
    let id: UsrId = row.try_get("id")?;
    // 头像
    let img: String = row.try_get("img")?;
    // 名称
    let lbl: String = row.try_get("lbl")?;
    // 用户名
    let username: String = row.try_get("username")?;
    // 密码
    let password: String = row.try_get("password")?;
    // 所属组织
    let org_ids: Option<sqlx::types::Json<HashMap<String, OrgId>>> = row.try_get("org_ids")?;
    let org_ids = org_ids.unwrap_or_default().0;
    let org_ids = {
      let mut keys: Vec<u32> = org_ids.keys()
        .map(|x| 
          x.parse::<u32>().unwrap_or_default()
        )
        .collect();
      keys.sort();
      keys.into_iter()
        .map(|x| 
          org_ids.get(&x.to_string())
            .unwrap_or(&OrgId::default())
            .to_owned()
        )
        .collect::<Vec<OrgId>>()
    };
    let org_ids_lbl: Option<sqlx::types::Json<HashMap<String, String>>> = row.try_get("org_ids_lbl")?;
    let org_ids_lbl = org_ids_lbl.unwrap_or_default().0;
    let org_ids_lbl = {
      let mut keys: Vec<u32> = org_ids_lbl.keys()
        .map(|x| 
          x.parse::<u32>().unwrap_or_default()
        )
        .collect();
      keys.sort();
      keys.into_iter()
        .map(|x| 
          org_ids_lbl.get(&x.to_string())
            .unwrap_or(&"".to_owned())
            .to_owned()
        )
        .collect::<Vec<String>>()
    };
    // 默认组织
    let default_org_id: OrgId = row.try_get("default_org_id")?;
    let default_org_id_lbl: Option<String> = row.try_get("default_org_id_lbl")?;
    let default_org_id_lbl = default_org_id_lbl.unwrap_or_default();
    // 锁定
    let is_locked: u8 = row.try_get("is_locked")?;
    let is_locked_lbl: String = is_locked.to_string();
    // 启用
    let is_enabled: u8 = row.try_get("is_enabled")?;
    let is_enabled_lbl: String = is_enabled.to_string();
    // 排序
    let order_by: u32 = row.try_get("order_by")?;
    // 所属部门
    let dept_ids: Option<sqlx::types::Json<HashMap<String, DeptId>>> = row.try_get("dept_ids")?;
    let dept_ids = dept_ids.unwrap_or_default().0;
    let dept_ids = {
      let mut keys: Vec<u32> = dept_ids.keys()
        .map(|x| 
          x.parse::<u32>().unwrap_or_default()
        )
        .collect();
      keys.sort();
      keys.into_iter()
        .map(|x| 
          dept_ids.get(&x.to_string())
            .unwrap_or(&DeptId::default())
            .to_owned()
        )
        .collect::<Vec<DeptId>>()
    };
    let dept_ids_lbl: Option<sqlx::types::Json<HashMap<String, String>>> = row.try_get("dept_ids_lbl")?;
    let dept_ids_lbl = dept_ids_lbl.unwrap_or_default().0;
    let dept_ids_lbl = {
      let mut keys: Vec<u32> = dept_ids_lbl.keys()
        .map(|x| 
          x.parse::<u32>().unwrap_or_default()
        )
        .collect();
      keys.sort();
      keys.into_iter()
        .map(|x| 
          dept_ids_lbl.get(&x.to_string())
            .unwrap_or(&"".to_owned())
            .to_owned()
        )
        .collect::<Vec<String>>()
    };
    // 拥有角色
    let role_ids: Option<sqlx::types::Json<HashMap<String, RoleId>>> = row.try_get("role_ids")?;
    let role_ids = role_ids.unwrap_or_default().0;
    let role_ids = {
      let mut keys: Vec<u32> = role_ids.keys()
        .map(|x| 
          x.parse::<u32>().unwrap_or_default()
        )
        .collect();
      keys.sort();
      keys.into_iter()
        .map(|x| 
          role_ids.get(&x.to_string())
            .unwrap_or(&RoleId::default())
            .to_owned()
        )
        .collect::<Vec<RoleId>>()
    };
    let role_ids_lbl: Option<sqlx::types::Json<HashMap<String, String>>> = row.try_get("role_ids_lbl")?;
    let role_ids_lbl = role_ids_lbl.unwrap_or_default().0;
    let role_ids_lbl = {
      let mut keys: Vec<u32> = role_ids_lbl.keys()
        .map(|x| 
          x.parse::<u32>().unwrap_or_default()
        )
        .collect();
      keys.sort();
      keys.into_iter()
        .map(|x| 
          role_ids_lbl.get(&x.to_string())
            .unwrap_or(&"".to_owned())
            .to_owned()
        )
        .collect::<Vec<String>>()
    };
    // 备注
    let rem: String = row.try_get("rem")?;
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
    // 更新人
    let update_usr_id: UsrId = row.try_get("update_usr_id")?;
    let update_usr_id_lbl: Option<String> = row.try_get("update_usr_id_lbl")?;
    let update_usr_id_lbl = update_usr_id_lbl.unwrap_or_default();
    // 更新时间
    let update_time: Option<chrono::NaiveDateTime> = row.try_get("update_time")?;
    let update_time_lbl: String = match update_time {
      Some(item) => item.format("%Y-%m-%d %H:%M:%S").to_string(),
      None => "".to_owned(),
    };
    // 是否已删除
    let is_deleted: u8 = row.try_get("is_deleted")?;
    
    let model = Self {
      tenant_id,
      is_hidden,
      is_deleted,
      id,
      img,
      lbl,
      username,
      password,
      org_ids,
      org_ids_lbl,
      default_org_id,
      default_org_id_lbl,
      is_locked,
      is_locked_lbl,
      is_enabled,
      is_enabled_lbl,
      order_by,
      dept_ids,
      dept_ids_lbl,
      role_ids,
      role_ids_lbl,
      rem,
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
pub struct UsrFieldComment {
  /// ID
  pub id: String,
  /// 头像
  pub img: String,
  /// 名称
  pub lbl: String,
  /// 用户名
  pub username: String,
  /// 所属组织
  pub org_ids: String,
  /// 所属组织
  pub org_ids_lbl: String,
  /// 默认组织
  pub default_org_id: String,
  /// 默认组织
  pub default_org_id_lbl: String,
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
  /// 所属部门
  pub dept_ids: String,
  /// 所属部门
  pub dept_ids_lbl: String,
  /// 拥有角色
  pub role_ids: String,
  /// 拥有角色
  pub role_ids_lbl: String,
  /// 备注
  pub rem: String,
  /// 创建人
  pub create_usr_id: String,
  /// 创建人
  pub create_usr_id_lbl: String,
  /// 创建时间
  pub create_time: String,
  /// 创建时间
  pub create_time_lbl: String,
  /// 更新人
  pub update_usr_id: String,
  /// 更新人
  pub update_usr_id_lbl: String,
  /// 更新时间
  pub update_time: String,
  /// 更新时间
  pub update_time_lbl: String,
}

#[derive(InputObject, Default, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct UsrSearch {
  /// ID
  pub id: Option<UsrId>,
  /// ID列表
  pub ids: Option<Vec<UsrId>>,
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  #[graphql(skip)]
  pub is_hidden: Option<Vec<u8>>,
  pub is_deleted: Option<u8>,
  /// 头像
  pub img: Option<String>,
  /// 头像
  pub img_like: Option<String>,
  /// 名称
  pub lbl: Option<String>,
  /// 名称
  pub lbl_like: Option<String>,
  /// 用户名
  pub username: Option<String>,
  /// 用户名
  pub username_like: Option<String>,
  /// 密码
  pub password: Option<String>,
  /// 密码
  pub password_like: Option<String>,
  /// 所属组织
  pub org_ids: Option<Vec<OrgId>>,
  /// 所属组织
  pub org_ids_is_null: Option<bool>,
  /// 默认组织
  pub default_org_id: Option<Vec<OrgId>>,
  /// 默认组织
  pub default_org_id_is_null: Option<bool>,
  /// 锁定
  pub is_locked: Option<Vec<u8>>,
  /// 启用
  pub is_enabled: Option<Vec<u8>>,
  /// 排序
  pub order_by: Option<Vec<u32>>,
  /// 所属部门
  pub dept_ids: Option<Vec<DeptId>>,
  /// 所属部门
  pub dept_ids_is_null: Option<bool>,
  /// 拥有角色
  pub role_ids: Option<Vec<RoleId>>,
  /// 拥有角色
  pub role_ids_is_null: Option<bool>,
  /// 备注
  pub rem: Option<String>,
  /// 备注
  pub rem_like: Option<String>,
  /// 创建人
  pub create_usr_id: Option<Vec<UsrId>>,
  /// 创建人
  pub create_usr_id_is_null: Option<bool>,
  /// 创建时间
  pub create_time: Option<Vec<chrono::NaiveDateTime>>,
  /// 更新人
  pub update_usr_id: Option<Vec<UsrId>>,
  /// 更新人
  pub update_usr_id_is_null: Option<bool>,
  /// 更新时间
  pub update_time: Option<Vec<chrono::NaiveDateTime>>,
}

#[derive(InputObject, Default, Clone, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct UsrInput {
  /// ID
  pub id: Option<UsrId>,
  #[graphql(skip)]
  pub is_deleted: Option<u8>,
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  /// 隐藏字段
  #[graphql(skip)]
  pub is_hidden: Option<u8>,
  /// 头像
  pub img: Option<String>,
  /// 名称
  pub lbl: Option<String>,
  /// 用户名
  pub username: Option<String>,
  /// 密码
  pub password: Option<String>,
  /// 所属组织
  pub org_ids: Option<Vec<OrgId>>,
  /// 所属组织
  pub org_ids_lbl: Option<Vec<String>>,
  /// 默认组织
  pub default_org_id: Option<OrgId>,
  /// 默认组织
  pub default_org_id_lbl: Option<String>,
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
  /// 所属部门
  pub dept_ids: Option<Vec<DeptId>>,
  /// 所属部门
  pub dept_ids_lbl: Option<Vec<String>>,
  /// 拥有角色
  pub role_ids: Option<Vec<RoleId>>,
  /// 拥有角色
  pub role_ids_lbl: Option<Vec<String>>,
  /// 备注
  pub rem: Option<String>,
  /// 创建人
  pub create_usr_id: Option<UsrId>,
  /// 创建人
  pub create_usr_id_lbl: Option<String>,
  /// 创建时间
  pub create_time: Option<chrono::NaiveDateTime>,
  /// 创建时间
  pub create_time_lbl: Option<String>,
  /// 更新人
  pub update_usr_id: Option<UsrId>,
  /// 更新人
  pub update_usr_id_lbl: Option<String>,
  /// 更新时间
  pub update_time: Option<chrono::NaiveDateTime>,
  /// 更新时间
  pub update_time_lbl: Option<String>,
}

impl From<UsrModel> for UsrInput {
  fn from(model: UsrModel) -> Self {
    Self {
      id: model.id.into(),
      is_deleted: model.is_deleted.into(),
      tenant_id: model.tenant_id.into(),
      is_hidden: model.is_hidden.into(),
      // 头像
      img: model.img.into(),
      // 名称
      lbl: model.lbl.into(),
      // 用户名
      username: model.username.into(),
      // 密码
      password: model.password.into(),
      // 所属组织
      org_ids: model.org_ids.into(),
      org_ids_lbl: model.org_ids_lbl.into(),
      // 默认组织
      default_org_id: model.default_org_id.into(),
      default_org_id_lbl: model.default_org_id_lbl.into(),
      // 锁定
      is_locked: model.is_locked.into(),
      is_locked_lbl: model.is_locked_lbl.into(),
      // 启用
      is_enabled: model.is_enabled.into(),
      is_enabled_lbl: model.is_enabled_lbl.into(),
      // 排序
      order_by: model.order_by.into(),
      // 所属部门
      dept_ids: model.dept_ids.into(),
      dept_ids_lbl: model.dept_ids_lbl.into(),
      // 拥有角色
      role_ids: model.role_ids.into(),
      role_ids_lbl: model.role_ids_lbl.into(),
      // 备注
      rem: model.rem.into(),
      // 创建人
      create_usr_id: model.create_usr_id.into(),
      create_usr_id_lbl: model.create_usr_id_lbl.into(),
      // 创建时间
      create_time: model.create_time,
      create_time_lbl: model.create_time_lbl.into(),
      // 更新人
      update_usr_id: model.update_usr_id.into(),
      update_usr_id_lbl: model.update_usr_id_lbl.into(),
      // 更新时间
      update_time: model.update_time,
      update_time_lbl: model.update_time_lbl.into(),
    }
  }
}

impl From<UsrInput> for UsrSearch {
  fn from(input: UsrInput) -> Self {
    Self {
      id: input.id,
      ids: None,
      // 租户ID
      tenant_id: input.tenant_id,
      // 隐藏字段
      is_hidden: input.is_hidden.map(|x| vec![x]),
      is_deleted: None,
      // 头像
      img: input.img,
      // 名称
      lbl: input.lbl,
      // 用户名
      username: input.username,
      // 密码
      password: input.password,
      // 所属组织
      org_ids: input.org_ids,
      // 默认组织
      default_org_id: input.default_org_id.map(|x| vec![x]),
      // 锁定
      is_locked: input.is_locked.map(|x| vec![x]),
      // 启用
      is_enabled: input.is_enabled.map(|x| vec![x]),
      // 排序
      order_by: input.order_by.map(|x| vec![x, x]),
      // 所属部门
      dept_ids: input.dept_ids,
      // 拥有角色
      role_ids: input.role_ids,
      // 备注
      rem: input.rem,
      // 创建人
      create_usr_id: input.create_usr_id.map(|x| vec![x]),
      // 创建时间
      create_time: input.create_time.map(|x| vec![x, x]),
      // 更新人
      update_usr_id: input.update_usr_id.map(|x| vec![x]),
      // 更新时间
      update_time: input.update_time.map(|x| vec![x, x]),
      ..Default::default()
    }
  }
}

#[derive(Default, Serialize, Deserialize, Clone, Debug, PartialEq, Eq, Hash)]
pub struct UsrId(SmolStr);

impl fmt::Display for UsrId {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(f, "{}", self.0)
  }
}

#[async_graphql::Scalar(name = "UsrId")]
impl async_graphql::ScalarType for UsrId {
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

impl From<UsrId> for ArgType {
  fn from(value: UsrId) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl From<&UsrId> for ArgType {
  fn from(value: &UsrId) -> Self {
    ArgType::SmolStr(value.clone().into())
  }
}

impl From<UsrId> for SmolStr {
  fn from(id: UsrId) -> Self {
    id.0
  }
}

impl From<SmolStr> for UsrId {
  fn from(s: SmolStr) -> Self {
    Self(s)
  }
}

impl From<&SmolStr> for UsrId {
  fn from(s: &SmolStr) -> Self {
    Self(s.clone())
  }
}

impl From<String> for UsrId {
  fn from(s: String) -> Self {
    Self(s.into())
  }
}

impl From<&str> for UsrId {
  fn from(s: &str) -> Self {
    Self(s.into())
  }
}

impl Deref for UsrId {
  type Target = SmolStr;
  
  fn deref(&self) -> &SmolStr {
    &self.0
  }
}

impl Encode<'_, MySql> for UsrId {
  fn encode_by_ref(&self, buf: &mut Vec<u8>) -> IsNull {
    <&str as Encode<MySql>>::encode(self.as_str(), buf)
  }
  
  fn size_hint(&self) -> usize {
    self.len()
  }
}

impl sqlx::Type<MySql> for UsrId {
  fn type_info() -> <MySql as sqlx::Database>::TypeInfo {
    <&str as sqlx::Type<MySql>>::type_info()
  }
  
  fn compatible(ty: &<MySql as sqlx::Database>::TypeInfo) -> bool {
    <&str as sqlx::Type<MySql>>::compatible(ty)
  }
}

impl<'r> sqlx::Decode<'r, MySql> for UsrId {
  fn decode(
    value: <MySql as sqlx::database::HasValueRef>::ValueRef,
  ) -> Result<Self, sqlx::error::BoxDynError> {
    <&str as sqlx::Decode<MySql>>::decode(value).map(Self::from)
  }
}