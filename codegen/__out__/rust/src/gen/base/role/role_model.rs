
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
use crate::gen::base::menu::menu_model::MenuId;
use crate::gen::base::permit::permit_model::PermitId;
use crate::gen::base::data_permit::data_permit_model::DataPermitId;
use crate::gen::base::usr::usr_model::UsrId;

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct RoleModel {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: TenantId,
  /// ID
  pub id: RoleId,
  /// 名称
  pub lbl: String,
  /// 首页
  pub home_url: String,
  /// 菜单权限
  pub menu_ids: Vec<MenuId>,
  /// 菜单权限
  pub menu_ids_lbl: Vec<String>,
  /// 按钮权限
  pub permit_ids: Vec<PermitId>,
  /// 按钮权限
  pub permit_ids_lbl: Vec<String>,
  /// 数据权限
  pub data_permit_ids: Vec<DataPermitId>,
  /// 数据权限
  pub data_permit_ids_lbl: Vec<String>,
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

impl FromRow<'_, MySqlRow> for RoleModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;
    // ID
    let id: RoleId = row.try_get("id")?;
    // 名称
    let lbl: String = row.try_get("lbl")?;
    // 首页
    let home_url: String = row.try_get("home_url")?;
    // 菜单权限
    let menu_ids: Option<sqlx::types::Json<HashMap<String, MenuId>>> = row.try_get("menu_ids")?;
    let menu_ids = menu_ids.unwrap_or_default().0;
    let menu_ids = {
      let mut keys: Vec<u32> = menu_ids.keys()
        .map(|x| 
          x.parse::<u32>().unwrap_or_default()
        )
        .collect();
      keys.sort();
      keys.into_iter()
        .map(|x| 
          menu_ids.get(&x.to_string())
            .unwrap_or(&MenuId::default())
            .to_owned()
        )
        .collect::<Vec<MenuId>>()
    };
    let menu_ids_lbl: Option<sqlx::types::Json<HashMap<String, String>>> = row.try_get("menu_ids_lbl")?;
    let menu_ids_lbl = menu_ids_lbl.unwrap_or_default().0;
    let menu_ids_lbl = {
      let mut keys: Vec<u32> = menu_ids_lbl.keys()
        .map(|x| 
          x.parse::<u32>().unwrap_or_default()
        )
        .collect();
      keys.sort();
      keys.into_iter()
        .map(|x| 
          menu_ids_lbl.get(&x.to_string())
            .unwrap_or(&"".to_owned())
            .to_owned()
        )
        .collect::<Vec<String>>()
    };
    // 按钮权限
    let permit_ids: Option<sqlx::types::Json<HashMap<String, PermitId>>> = row.try_get("permit_ids")?;
    let permit_ids = permit_ids.unwrap_or_default().0;
    let permit_ids = {
      let mut keys: Vec<u32> = permit_ids.keys()
        .map(|x| 
          x.parse::<u32>().unwrap_or_default()
        )
        .collect();
      keys.sort();
      keys.into_iter()
        .map(|x| 
          permit_ids.get(&x.to_string())
            .unwrap_or(&PermitId::default())
            .to_owned()
        )
        .collect::<Vec<PermitId>>()
    };
    let permit_ids_lbl: Option<sqlx::types::Json<HashMap<String, String>>> = row.try_get("permit_ids_lbl")?;
    let permit_ids_lbl = permit_ids_lbl.unwrap_or_default().0;
    let permit_ids_lbl = {
      let mut keys: Vec<u32> = permit_ids_lbl.keys()
        .map(|x| 
          x.parse::<u32>().unwrap_or_default()
        )
        .collect();
      keys.sort();
      keys.into_iter()
        .map(|x| 
          permit_ids_lbl.get(&x.to_string())
            .unwrap_or(&"".to_owned())
            .to_owned()
        )
        .collect::<Vec<String>>()
    };
    // 数据权限
    let data_permit_ids: Option<sqlx::types::Json<HashMap<String, DataPermitId>>> = row.try_get("data_permit_ids")?;
    let data_permit_ids = data_permit_ids.unwrap_or_default().0;
    let data_permit_ids = {
      let mut keys: Vec<u32> = data_permit_ids.keys()
        .map(|x| 
          x.parse::<u32>().unwrap_or_default()
        )
        .collect();
      keys.sort();
      keys.into_iter()
        .map(|x| 
          data_permit_ids.get(&x.to_string())
            .unwrap_or(&DataPermitId::default())
            .to_owned()
        )
        .collect::<Vec<DataPermitId>>()
    };
    let data_permit_ids_lbl: Option<sqlx::types::Json<HashMap<String, String>>> = row.try_get("data_permit_ids_lbl")?;
    let data_permit_ids_lbl = data_permit_ids_lbl.unwrap_or_default().0;
    let data_permit_ids_lbl = {
      let mut keys: Vec<u32> = data_permit_ids_lbl.keys()
        .map(|x| 
          x.parse::<u32>().unwrap_or_default()
        )
        .collect();
      keys.sort();
      keys.into_iter()
        .map(|x| 
          data_permit_ids_lbl.get(&x.to_string())
            .unwrap_or(&"".to_owned())
            .to_owned()
        )
        .collect::<Vec<String>>()
    };
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
      is_deleted,
      id,
      lbl,
      home_url,
      menu_ids,
      menu_ids_lbl,
      permit_ids,
      permit_ids_lbl,
      data_permit_ids,
      data_permit_ids_lbl,
      is_locked,
      is_locked_lbl,
      is_enabled,
      is_enabled_lbl,
      order_by,
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
pub struct RoleFieldComment {
  /// ID
  pub id: String,
  /// 名称
  pub lbl: String,
  /// 首页
  pub home_url: String,
  /// 菜单权限
  pub menu_ids: String,
  /// 菜单权限
  pub menu_ids_lbl: String,
  /// 按钮权限
  pub permit_ids: String,
  /// 按钮权限
  pub permit_ids_lbl: String,
  /// 数据权限
  pub data_permit_ids: String,
  /// 数据权限
  pub data_permit_ids_lbl: String,
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
pub struct RoleSearch {
  /// ID
  pub id: Option<RoleId>,
  /// ID列表
  pub ids: Option<Vec<RoleId>>,
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  pub is_deleted: Option<u8>,
  /// 名称
  pub lbl: Option<String>,
  /// 名称
  pub lbl_like: Option<String>,
  /// 首页
  pub home_url: Option<String>,
  /// 首页
  pub home_url_like: Option<String>,
  /// 菜单权限
  pub menu_ids: Option<Vec<MenuId>>,
  /// 菜单权限
  pub menu_ids_is_null: Option<bool>,
  /// 按钮权限
  pub permit_ids: Option<Vec<PermitId>>,
  /// 按钮权限
  pub permit_ids_is_null: Option<bool>,
  /// 数据权限
  pub data_permit_ids: Option<Vec<DataPermitId>>,
  /// 数据权限
  pub data_permit_ids_is_null: Option<bool>,
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
pub struct RoleInput {
  /// ID
  pub id: Option<RoleId>,
  #[graphql(skip)]
  pub is_deleted: Option<u8>,
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  /// 名称
  pub lbl: Option<String>,
  /// 首页
  pub home_url: Option<String>,
  /// 菜单权限
  pub menu_ids: Option<Vec<MenuId>>,
  /// 菜单权限
  pub menu_ids_lbl: Option<Vec<String>>,
  /// 按钮权限
  pub permit_ids: Option<Vec<PermitId>>,
  /// 按钮权限
  pub permit_ids_lbl: Option<Vec<String>>,
  /// 数据权限
  pub data_permit_ids: Option<Vec<DataPermitId>>,
  /// 数据权限
  pub data_permit_ids_lbl: Option<Vec<String>>,
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

impl From<RoleModel> for RoleInput {
  fn from(model: RoleModel) -> Self {
    Self {
      id: model.id.into(),
      is_deleted: model.is_deleted.into(),
      tenant_id: model.tenant_id.into(),
      // 名称
      lbl: model.lbl.into(),
      // 首页
      home_url: model.home_url.into(),
      // 菜单权限
      menu_ids: model.menu_ids.into(),
      menu_ids_lbl: model.menu_ids_lbl.into(),
      // 按钮权限
      permit_ids: model.permit_ids.into(),
      permit_ids_lbl: model.permit_ids_lbl.into(),
      // 数据权限
      data_permit_ids: model.data_permit_ids.into(),
      data_permit_ids_lbl: model.data_permit_ids_lbl.into(),
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

impl From<RoleInput> for RoleSearch {
  fn from(input: RoleInput) -> Self {
    Self {
      id: input.id,
      ids: None,
      // 租户ID
      tenant_id: input.tenant_id,
      is_deleted: None,
      // 名称
      lbl: input.lbl,
      // 首页
      home_url: input.home_url,
      // 菜单权限
      menu_ids: input.menu_ids,
      // 按钮权限
      permit_ids: input.permit_ids,
      // 数据权限
      data_permit_ids: input.data_permit_ids,
      // 锁定
      is_locked: input.is_locked.map(|x| vec![x]),
      // 启用
      is_enabled: input.is_enabled.map(|x| vec![x]),
      // 排序
      order_by: input.order_by.map(|x| vec![x, x]),
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
pub struct RoleId(SmolStr);

impl fmt::Display for RoleId {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(f, "{}", self.0)
  }
}

#[async_graphql::Scalar(name = "RoleId")]
impl async_graphql::ScalarType for RoleId {
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

impl From<RoleId> for ArgType {
  fn from(value: RoleId) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl From<&RoleId> for ArgType {
  fn from(value: &RoleId) -> Self {
    ArgType::SmolStr(value.clone().into())
  }
}

impl From<RoleId> for SmolStr {
  fn from(id: RoleId) -> Self {
    id.0
  }
}

impl From<SmolStr> for RoleId {
  fn from(s: SmolStr) -> Self {
    Self(s)
  }
}

impl From<&SmolStr> for RoleId {
  fn from(s: &SmolStr) -> Self {
    Self(s.clone())
  }
}

impl From<String> for RoleId {
  fn from(s: String) -> Self {
    Self(s.into())
  }
}

impl From<&str> for RoleId {
  fn from(s: &str) -> Self {
    Self(s.into())
  }
}

impl Deref for RoleId {
  type Target = SmolStr;
  
  fn deref(&self) -> &SmolStr {
    &self.0
  }
}

impl Encode<'_, MySql> for RoleId {
  fn encode_by_ref(&self, buf: &mut Vec<u8>) -> IsNull {
    <&str as Encode<MySql>>::encode(self.as_str(), buf)
  }
  
  fn size_hint(&self) -> usize {
    self.len()
  }
}

impl sqlx::Type<MySql> for RoleId {
  fn type_info() -> <MySql as sqlx::Database>::TypeInfo {
    <&str as sqlx::Type<MySql>>::type_info()
  }
  
  fn compatible(ty: &<MySql as sqlx::Database>::TypeInfo) -> bool {
    <&str as sqlx::Type<MySql>>::compatible(ty)
  }
}

impl<'r> sqlx::Decode<'r, MySql> for RoleId {
  fn decode(
    value: <MySql as sqlx::database::HasValueRef>::ValueRef,
  ) -> Result<Self, sqlx::error::BoxDynError> {
    <&str as sqlx::Decode<MySql>>::decode(value).map(Self::from)
  }
}
