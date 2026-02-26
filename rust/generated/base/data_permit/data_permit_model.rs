#![allow(clippy::clone_on_copy)]
#![allow(clippy::redundant_clone)]
#![allow(clippy::collapsible_if)]

#[allow(unused_imports)]
use std::fmt;
#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use std::str::FromStr;
use std::sync::OnceLock;

use serde::{Serialize, Deserialize};
use color_eyre::eyre::{Result, eyre};

#[allow(unused_imports)]
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

#[allow(unused_imports)]
use crate::common::context::ArgType;
use crate::common::gql::model::SortInput;
use crate::common::id::{Id, impl_id};

use crate::base::tenant::tenant_model::TenantId;
use crate::base::menu::menu_model::MenuId;
use crate::base::usr::usr_model::UsrId;

static CAN_SORT_IN_API_DATA_PERMIT: OnceLock<[&'static str; 2]> = OnceLock::new();

/// 数据权限 前端允许排序的字段
fn get_can_sort_in_api_data_permit() -> &'static [&'static str; 2] {
  CAN_SORT_IN_API_DATA_PERMIT.get_or_init(|| [
    "create_time",
    "update_time",
  ])
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "DataPermitModel")]
#[allow(dead_code)]
pub struct DataPermitModel {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: TenantId,
  /// 系统字段
  pub is_sys: u8,
  /// ID
  pub id: DataPermitId,
  /// 菜单
  #[graphql(name = "menu_id")]
  pub menu_id: MenuId,
  /// 菜单
  #[graphql(name = "menu_id_lbl")]
  pub menu_id_lbl: SmolStr,
  /// 范围
  #[graphql(name = "scope")]
  pub scope: DataPermitScope,
  /// 范围
  #[graphql(name = "scope_lbl")]
  pub scope_lbl: SmolStr,
  /// 类型
  #[graphql(name = "type")]
  pub r#type: DataPermitType,
  /// 类型
  #[graphql(name = "type_lbl")]
  pub type_lbl: SmolStr,
  /// 备注
  #[graphql(name = "rem")]
  pub rem: SmolStr,
  /// 是否已删除
  pub is_deleted: u8,
  /// 创建人
  pub create_usr_id: UsrId,
  /// 创建人
  pub create_usr_id_lbl: SmolStr,
  /// 创建时间
  pub create_time: Option<chrono::NaiveDateTime>,
  /// 创建时间
  pub create_time_lbl: SmolStr,
  /// 更新人
  pub update_usr_id: UsrId,
  /// 更新人
  pub update_usr_id_lbl: SmolStr,
  /// 更新时间
  pub update_time: Option<chrono::NaiveDateTime>,
  /// 更新时间
  pub update_time_lbl: SmolStr,
}

impl FromRow<'_, MySqlRow> for DataPermitModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;
    // 系统记录
    let is_sys = row.try_get("is_sys")?;
    // ID
    let id: DataPermitId = row.try_get("id")?;
    // 菜单
    let menu_id: MenuId = row.try_get("menu_id")?;
    let menu_id_lbl: Option<&str> = row.try_get("menu_id_lbl")?;
    let menu_id_lbl = SmolStr::new(menu_id_lbl.unwrap_or_default());
    // 范围
    let scope_lbl: &str = row.try_get("scope")?;
    let scope: DataPermitScope = scope_lbl.try_into()?;
    let scope_lbl = SmolStr::new(scope_lbl);
    // 类型
    let type_lbl: &str = row.try_get("type")?;
    let r#type: DataPermitType = type_lbl.try_into()?;
    let type_lbl = SmolStr::new(type_lbl);
    // 备注
    let rem: &str = row.try_get("rem")?;
    let rem = SmolStr::new(rem);
    // 创建人
    let create_usr_id: UsrId = row.try_get("create_usr_id")?;
    let create_usr_id_lbl: Option<&str> = row.try_get("create_usr_id_lbl")?;
    let create_usr_id_lbl = SmolStr::new(create_usr_id_lbl.unwrap_or_default());
    // 创建时间
    let create_time: Option<chrono::NaiveDateTime> = row.try_get("create_time")?;
    let create_time_lbl: SmolStr = match create_time {
      Some(item) => SmolStr::new(item.format("%Y-%m-%d %H:%M:%S").to_string()),
      None => SmolStr::new(""),
    };
    // 更新人
    let update_usr_id: UsrId = row.try_get("update_usr_id")?;
    let update_usr_id_lbl: Option<&str> = row.try_get("update_usr_id_lbl")?;
    let update_usr_id_lbl = SmolStr::new(update_usr_id_lbl.unwrap_or_default());
    // 更新时间
    let update_time: Option<chrono::NaiveDateTime> = row.try_get("update_time")?;
    let update_time_lbl: SmolStr = match update_time {
      Some(item) => SmolStr::new(item.format("%Y-%m-%d %H:%M:%S").to_string()),
      None => SmolStr::new(""),
    };
    // 是否已删除
    let is_deleted: u8 = row.try_get("is_deleted")?;
    
    let model = Self {
      tenant_id,
      is_sys,
      is_deleted,
      id,
      menu_id,
      menu_id_lbl,
      scope,
      scope_lbl,
      r#type,
      type_lbl,
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
#[graphql(rename_fields = "snake_case", name = "DataPermitFieldComment")]
#[allow(dead_code)]
pub struct DataPermitFieldComment {
  /// ID
  #[graphql(name = "id")]
  pub id: SmolStr,
  /// 菜单
  #[graphql(name = "menu_id")]
  pub menu_id: SmolStr,
  /// 菜单
  #[graphql(name = "menu_id_lbl")]
  pub menu_id_lbl: SmolStr,
  /// 范围
  #[graphql(name = "scope")]
  pub scope: SmolStr,
  /// 范围
  #[graphql(name = "scope_lbl")]
  pub scope_lbl: SmolStr,
  /// 类型
  #[graphql(name = "type")]
  pub r#type: SmolStr,
  /// 类型
  #[graphql(name = "type_lbl")]
  pub type_lbl: SmolStr,
  /// 备注
  #[graphql(name = "rem")]
  pub rem: SmolStr,
  /// 创建人
  #[graphql(name = "create_usr_id")]
  pub create_usr_id: SmolStr,
  /// 创建人
  #[graphql(name = "create_usr_id_lbl")]
  pub create_usr_id_lbl: SmolStr,
  /// 创建时间
  #[graphql(name = "create_time")]
  pub create_time: SmolStr,
  /// 创建时间
  #[graphql(name = "create_time_lbl")]
  pub create_time_lbl: SmolStr,
  /// 更新人
  #[graphql(name = "update_usr_id")]
  pub update_usr_id: SmolStr,
  /// 更新人
  #[graphql(name = "update_usr_id_lbl")]
  pub update_usr_id_lbl: SmolStr,
  /// 更新时间
  #[graphql(name = "update_time")]
  pub update_time: SmolStr,
  /// 更新时间
  #[graphql(name = "update_time_lbl")]
  pub update_time_lbl: SmolStr,
}

#[derive(InputObject, Serialize, Deserialize, Default, Clone)]
#[graphql(rename_fields = "snake_case", name = "DataPermitSearch")]
#[allow(dead_code)]
pub struct DataPermitSearch {
  /// ID
  pub id: Option<DataPermitId>,
  /// ID列表
  pub ids: Option<Vec<DataPermitId>>,
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  pub is_deleted: Option<u8>,
  /// 菜单
  #[graphql(name = "menu_id")]
  pub menu_id: Option<Vec<MenuId>>,
  /// 菜单
  #[graphql(name = "menu_id_save_null")]
  pub menu_id_is_null: Option<bool>,
  /// 菜单
  #[graphql(name = "menu_id_lbl")]
  pub menu_id_lbl: Option<Vec<SmolStr>>,
  /// 菜单
  #[graphql(name = "menu_id_lbl_like")]
  pub menu_id_lbl_like: Option<SmolStr>,
  /// 范围
  #[graphql(name = "scope")]
  pub scope: Option<Vec<DataPermitScope>>,
  /// 类型
  #[graphql(skip)]
  pub r#type: Option<Vec<DataPermitType>>,
  /// 备注
  #[graphql(skip)]
  pub rem: Option<SmolStr>,
  /// 备注
  #[graphql(skip)]
  pub rem_like: Option<SmolStr>,
  /// 创建人
  #[graphql(name = "create_usr_id")]
  pub create_usr_id: Option<Vec<UsrId>>,
  /// 创建人
  #[graphql(name = "create_usr_id_save_null")]
  pub create_usr_id_is_null: Option<bool>,
  /// 创建人
  #[graphql(name = "create_usr_id_lbl")]
  pub create_usr_id_lbl: Option<Vec<SmolStr>>,
  /// 创建人
  #[graphql(name = "create_usr_id_lbl_like")]
  pub create_usr_id_lbl_like: Option<SmolStr>,
  /// 创建时间
  #[graphql(skip)]
  pub create_time: Option<[Option<chrono::NaiveDateTime>; 2]>,
  /// 更新人
  #[graphql(name = "update_usr_id")]
  pub update_usr_id: Option<Vec<UsrId>>,
  /// 更新人
  #[graphql(name = "update_usr_id_save_null")]
  pub update_usr_id_is_null: Option<bool>,
  /// 更新人
  #[graphql(name = "update_usr_id_lbl")]
  pub update_usr_id_lbl: Option<Vec<SmolStr>>,
  /// 更新人
  #[graphql(name = "update_usr_id_lbl_like")]
  pub update_usr_id_lbl_like: Option<SmolStr>,
  /// 更新时间
  #[graphql(skip)]
  pub update_time: Option<[Option<chrono::NaiveDateTime>; 2]>,
}

impl std::fmt::Debug for DataPermitSearch {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("DataPermitSearch");
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
    // 菜单
    if let Some(ref menu_id) = self.menu_id {
      item = item.field("menu_id", menu_id);
    }
    if let Some(ref menu_id_lbl) = self.menu_id_lbl {
      item = item.field("menu_id_lbl", menu_id_lbl);
    }
    if let Some(ref menu_id_lbl_like) = self.menu_id_lbl_like {
      item = item.field("menu_id_lbl_like", menu_id_lbl_like);
    }
    if let Some(ref menu_id_is_null) = self.menu_id_is_null {
      item = item.field("menu_id_is_null", menu_id_is_null);
    }
    // 范围
    if let Some(ref scope) = self.scope {
      item = item.field("scope", scope);
    }
    // 类型
    if let Some(ref r#type) = self.r#type {
      item = item.field("r#type", r#type);
    }
    // 备注
    if let Some(ref rem) = self.rem {
      item = item.field("rem", rem);
    }
    if let Some(ref rem_like) = self.rem_like {
      item = item.field("rem_like", rem_like);
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

#[derive(InputObject, Serialize, Deserialize, Default, Clone)]
#[graphql(rename_fields = "snake_case", name = "DataPermitInput")]
#[allow(dead_code)]
pub struct DataPermitInput {
  /// ID
  pub id: Option<DataPermitId>,
  /// 已删除
  #[graphql(skip)]
  pub is_deleted: Option<u8>,
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  /// 系统记录
  pub is_sys: Option<u8>,
  /// 菜单
  #[graphql(name = "menu_id")]
  pub menu_id: Option<MenuId>,
  /// 菜单
  #[graphql(name = "menu_id_lbl")]
  pub menu_id_lbl: Option<SmolStr>,
  /// 范围
  #[graphql(name = "scope")]
  pub scope: Option<DataPermitScope>,
  /// 范围
  #[graphql(name = "scope_lbl")]
  pub scope_lbl: Option<SmolStr>,
  /// 类型
  #[graphql(name = "type")]
  pub r#type: Option<DataPermitType>,
  /// 类型
  #[graphql(name = "type_lbl")]
  pub type_lbl: Option<SmolStr>,
  /// 备注
  #[graphql(name = "rem")]
  pub rem: Option<SmolStr>,
  /// 创建人
  #[graphql(skip)]
  pub create_usr_id: Option<UsrId>,
  /// 创建人
  #[graphql(skip)]
  pub create_usr_id_lbl: Option<SmolStr>,
  /// 创建时间
  #[graphql(skip)]
  pub create_time: Option<chrono::NaiveDateTime>,
  /// 创建时间
  #[graphql(skip)]
  pub create_time_lbl: Option<SmolStr>,
  /// 创建时间
  #[graphql(skip)]
  pub create_time_save_null: Option<bool>,
  /// 更新人
  #[graphql(skip)]
  pub update_usr_id: Option<UsrId>,
  /// 更新人
  #[graphql(skip)]
  pub update_usr_id_lbl: Option<SmolStr>,
  /// 更新时间
  #[graphql(skip)]
  pub update_time: Option<chrono::NaiveDateTime>,
  /// 更新时间
  #[graphql(skip)]
  pub update_time_lbl: Option<SmolStr>,
  /// 更新时间
  #[graphql(skip)]
  pub update_time_save_null: Option<bool>,
}

impl std::fmt::Debug for DataPermitInput {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("DataPermitInput");
    if let Some(ref id) = self.id {
      item = item.field("id", id);
    }
    if let Some(ref is_deleted) = self.is_deleted {
      if *is_deleted == 1 {
        item = item.field("is_deleted", is_deleted);
      }
    }
    if let Some(ref tenant_id) = self.tenant_id {
      item = item.field("tenant_id", tenant_id);
    }
    if let Some(ref is_sys) = self.is_sys {
      item = item.field("is_sys", is_sys);
    }
    if let Some(ref menu_id) = self.menu_id {
      item = item.field("menu_id", menu_id);
    }
    if let Some(ref scope) = self.scope {
      item = item.field("scope", scope);
    }
    if let Some(ref r#type) = self.r#type {
      item = item.field("r#type", r#type);
    }
    if let Some(ref rem) = self.rem {
      item = item.field("rem", rem);
    }
    if let Some(ref create_usr_id) = self.create_usr_id {
      item = item.field("create_usr_id", create_usr_id);
    }
    if let Some(ref create_usr_id_lbl) = self.create_usr_id_lbl {
      item = item.field("create_usr_id_lbl", create_usr_id_lbl);
    }
    if let Some(ref create_time) = self.create_time {
      item = item.field("create_time", create_time);
    }
    if let Some(ref update_usr_id) = self.update_usr_id {
      item = item.field("update_usr_id", update_usr_id);
    }
    if let Some(ref update_usr_id_lbl) = self.update_usr_id_lbl {
      item = item.field("update_usr_id_lbl", update_usr_id_lbl);
    }
    if let Some(ref update_time) = self.update_time {
      item = item.field("update_time", update_time);
    }
    item.finish()
  }
}

impl From<DataPermitModel> for DataPermitInput {
  fn from(model: DataPermitModel) -> Self {
    Self {
      id: model.id.into(),
      is_deleted: model.is_deleted.into(),
      tenant_id: model.tenant_id.into(),
      is_sys: model.is_sys.into(),
      // 菜单
      menu_id: model.menu_id.into(),
      menu_id_lbl: model.menu_id_lbl.into(),
      // 范围
      scope: model.scope.into(),
      scope_lbl: model.scope_lbl.into(),
      // 类型
      r#type: model.r#type.into(),
      type_lbl: model.type_lbl.into(),
      // 备注
      rem: model.rem.into(),
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

impl From<DataPermitInput> for DataPermitSearch {
  fn from(input: DataPermitInput) -> Self {
    Self {
      id: input.id,
      ids: None,
      // 租户ID
      tenant_id: input.tenant_id,
      is_deleted: None,
      // 菜单
      menu_id: input.menu_id.map(|x| vec![x]),
      // 范围
      scope: input.scope.map(|x| vec![x]),
      // 类型
      r#type: input.r#type.map(|x| vec![x]),
      // 备注
      rem: input.rem,
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

impl_id!(DataPermitId);

/// 数据权限范围
#[derive(Enum, Copy, Clone, Default, Eq, PartialEq, Serialize, Deserialize, Debug)]
pub enum DataPermitScope {
  /// 创建人
  #[graphql(name="create")]
  #[serde(rename = "create")]
  Create,
  /// 本部门
  #[graphql(name="dept")]
  #[serde(rename = "dept")]
  Dept,
  /// 本部门及其所有上级
  #[graphql(name="dept_parent")]
  #[serde(rename = "dept_parent")]
  DeptParent,
  /// 本角色
  #[graphql(name="role")]
  #[serde(rename = "role")]
  Role,
  /// 本租户
  #[default]
  #[graphql(name="tenant")]
  #[serde(rename = "tenant")]
  Tenant,
}

impl fmt::Display for DataPermitScope {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    match self {
      Self::Create => write!(f, "create"),
      Self::Dept => write!(f, "dept"),
      Self::DeptParent => write!(f, "dept_parent"),
      Self::Role => write!(f, "role"),
      Self::Tenant => write!(f, "tenant"),
    }
  }
}

impl From<DataPermitScope> for SmolStr {
  fn from(value: DataPermitScope) -> Self {
    match value {
      DataPermitScope::Create => "create".into(),
      DataPermitScope::Dept => "dept".into(),
      DataPermitScope::DeptParent => "dept_parent".into(),
      DataPermitScope::Role => "role".into(),
      DataPermitScope::Tenant => "tenant".into(),
    }
  }
}

impl From<DataPermitScope> for String {
  fn from(value: DataPermitScope) -> Self {
    match value {
      DataPermitScope::Create => "create".into(),
      DataPermitScope::Dept => "dept".into(),
      DataPermitScope::DeptParent => "dept_parent".into(),
      DataPermitScope::Role => "role".into(),
      DataPermitScope::Tenant => "tenant".into(),
    }
  }
}

impl From<DataPermitScope> for ArgType {
  fn from(value: DataPermitScope) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl FromStr for DataPermitScope {
  type Err = color_eyre::eyre::Error;
  
  fn from_str(s: &str) -> Result<Self, Self::Err> {
    match s {
      "create" => Ok(Self::Create),
      "dept" => Ok(Self::Dept),
      "dept_parent" => Ok(Self::DeptParent),
      "role" => Ok(Self::Role),
      "tenant" => Ok(Self::Tenant),
      _ => Err(eyre!("{s} 无法转换到 范围")),
    }
  }
}

impl TryFrom<&str> for DataPermitScope {
  type Error = sqlx::Error;
  
  fn try_from(s: &str) -> Result<Self, sqlx::Error> {
    match s {
      "create" => Ok(Self::Create),
      "dept" => Ok(Self::Dept),
      "dept_parent" => Ok(Self::DeptParent),
      "role" => Ok(Self::Role),
      "tenant" => Ok(Self::Tenant),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "scope".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "{s} 无法转换到 范围".to_owned(),
          )),
        }),
      )),
    }
  }
}

impl TryFrom<SmolStr> for DataPermitScope {
  type Error = sqlx::Error;
  
  fn try_from(s: SmolStr) -> Result<Self, sqlx::Error> {
    match s.as_str() {
      "create" => Ok(Self::Create),
      "dept" => Ok(Self::Dept),
      "dept_parent" => Ok(Self::DeptParent),
      "role" => Ok(Self::Role),
      "tenant" => Ok(Self::Tenant),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "scope".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "{s} 无法转换到 范围".to_owned(),
          )),
        }),
      )),
    }
  }
}

impl DataPermitScope {
  pub fn as_str(&self) -> &str {
    match self {
      Self::Create => "create",
      Self::Dept => "dept",
      Self::DeptParent => "dept_parent",
      Self::Role => "role",
      Self::Tenant => "tenant",
    }
  }
}

impl TryFrom<String> for DataPermitScope {
  type Error = sqlx::Error;
  
  fn try_from(s: String) -> Result<Self, sqlx::Error> {
    match s.as_str() {
      "create" => Ok(Self::Create),
      "dept" => Ok(Self::Dept),
      "dept_parent" => Ok(Self::DeptParent),
      "role" => Ok(Self::Role),
      "tenant" => Ok(Self::Tenant),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "scope".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "{s} 无法转换到 范围".to_owned(),
          )),
        }),
      )),
    }
  }
}

/// 数据权限类型
#[derive(Enum, Copy, Clone, Default, Eq, PartialEq, Serialize, Deserialize, Debug)]
pub enum DataPermitType {
  /// 可见不可改且不可删
  #[graphql(name="readonly")]
  #[serde(rename = "readonly")]
  Readonly,
  /// 可见可改且可删
  #[default]
  #[graphql(name="editable")]
  #[serde(rename = "editable")]
  Editable,
}

impl fmt::Display for DataPermitType {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    match self {
      Self::Readonly => write!(f, "readonly"),
      Self::Editable => write!(f, "editable"),
    }
  }
}

impl From<DataPermitType> for SmolStr {
  fn from(value: DataPermitType) -> Self {
    match value {
      DataPermitType::Readonly => "readonly".into(),
      DataPermitType::Editable => "editable".into(),
    }
  }
}

impl From<DataPermitType> for String {
  fn from(value: DataPermitType) -> Self {
    match value {
      DataPermitType::Readonly => "readonly".into(),
      DataPermitType::Editable => "editable".into(),
    }
  }
}

impl From<DataPermitType> for ArgType {
  fn from(value: DataPermitType) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl FromStr for DataPermitType {
  type Err = color_eyre::eyre::Error;
  
  fn from_str(s: &str) -> Result<Self, Self::Err> {
    match s {
      "readonly" => Ok(Self::Readonly),
      "editable" => Ok(Self::Editable),
      _ => Err(eyre!("{s} 无法转换到 类型")),
    }
  }
}

impl TryFrom<&str> for DataPermitType {
  type Error = sqlx::Error;
  
  fn try_from(s: &str) -> Result<Self, sqlx::Error> {
    match s {
      "readonly" => Ok(Self::Readonly),
      "editable" => Ok(Self::Editable),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "type".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "{s} 无法转换到 类型".to_owned(),
          )),
        }),
      )),
    }
  }
}

impl TryFrom<SmolStr> for DataPermitType {
  type Error = sqlx::Error;
  
  fn try_from(s: SmolStr) -> Result<Self, sqlx::Error> {
    match s.as_str() {
      "readonly" => Ok(Self::Readonly),
      "editable" => Ok(Self::Editable),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "type".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "{s} 无法转换到 类型".to_owned(),
          )),
        }),
      )),
    }
  }
}

impl DataPermitType {
  pub fn as_str(&self) -> &str {
    match self {
      Self::Readonly => "readonly",
      Self::Editable => "editable",
    }
  }
}

impl TryFrom<String> for DataPermitType {
  type Error = sqlx::Error;
  
  fn try_from(s: String) -> Result<Self, sqlx::Error> {
    match s.as_str() {
      "readonly" => Ok(Self::Readonly),
      "editable" => Ok(Self::Editable),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "type".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "{s} 无法转换到 类型".to_owned(),
          )),
        }),
      )),
    }
  }
}

/// 数据权限 检测字段是否允许前端排序
pub fn check_sort_data_permit(
  sort: Option<&[SortInput]>,
) -> Result<()> {
  
  if sort.is_none() {
    return Ok(());
  }
  let sort = sort.unwrap();
  
  let get_can_sort_in_api_data_permit = get_can_sort_in_api_data_permit();
  
  for item in sort {
    let prop = item.prop.as_str();
    if prop.is_empty() {
      continue;
    }
    if !get_can_sort_in_api_data_permit.contains(&prop) {
      return Err(eyre!("check_sort_data_permit: {}", serde_json::to_string(item)?));
    }
  }
  
  Ok(())
}

// MARK: get_page_path_data_permit
pub fn get_page_path_data_permit() -> &'static str {
  "/base/data_permit"
}

// MARK: get_table_name_data_permit
pub fn get_table_name_data_permit() -> &'static str {
  "base_data_permit"
}
