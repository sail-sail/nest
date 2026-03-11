#![allow(clippy::clone_on_copy)]
#![allow(clippy::redundant_clone)]
#![allow(clippy::collapsible_if)]

#[allow(unused_imports)]
use std::fmt;
#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use std::str::FromStr;

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

use crate::base::dyn_page_field::dyn_page_field_model::{
  DynPageFieldModel,
  DynPageFieldInput,
};

use crate::base::tenant::tenant_model::TenantId;
use crate::base::menu::menu_model::MenuId;
use crate::base::role::role_model::RoleId;
use crate::base::usr::usr_model::UsrId;

static CAN_SORT_IN_API_DYN_PAGE: [&str; 3] = [
  "order_by",
  "create_time",
  "update_time",
];

/// 动态页面 前端允许排序的字段
fn get_can_sort_in_api_dyn_page() -> &'static [&'static str; 3] {
  &CAN_SORT_IN_API_DYN_PAGE
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "DynPageModel")]
#[allow(dead_code)]
pub struct DynPageModel {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: TenantId,
  /// ID
  pub id: DynPageId,
  /// 编码-序列号
  #[graphql(skip)]
  pub code_seq: u32,
  /// 路由
  #[graphql(name = "code")]
  pub code: SmolStr,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: SmolStr,
  /// 父菜单
  #[graphql(name = "parent_menu_id")]
  pub parent_menu_id: MenuId,
  /// 父菜单
  #[graphql(name = "parent_menu_id_lbl")]
  pub parent_menu_id_lbl: SmolStr,
  /// 所属角色
  #[graphql(name = "role_ids")]
  pub role_ids: Vec<RoleId>,
  /// 所属角色
  #[graphql(name = "role_ids_lbl")]
  pub role_ids_lbl: Vec<SmolStr>,
  /// 排序
  #[graphql(name = "order_by")]
  pub order_by: u32,
  /// 启用
  #[graphql(name = "is_enabled")]
  pub is_enabled: u8,
  /// 启用
  #[graphql(name = "is_enabled_lbl")]
  pub is_enabled_lbl: SmolStr,
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
  /// 动态页面字段
  pub dyn_page_field: Vec<DynPageFieldModel>,
}

impl FromRow<'_, MySqlRow> for DynPageModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;
    // ID
    let id: DynPageId = row.try_get("id")?;
    // 编码-序列号
    let code_seq: u32 = row.try_get("code_seq")?;
    // 路由
    let code: &str = row.try_get("code")?;
    let code = SmolStr::new(code);
    // 名称
    let lbl: &str = row.try_get("lbl")?;
    let lbl = SmolStr::new(lbl);
    // 父菜单
    let parent_menu_id: MenuId = MenuId::default();
    let parent_menu_id_lbl = SmolStr::new("");
    // 所属角色
    let role_ids: Vec<RoleId> = vec![];
    let role_ids_lbl: Vec<SmolStr> = vec![];
    // 排序
    let order_by: u32 = row.try_get("order_by")?;
    // 启用
    let is_enabled: u8 = row.try_get("is_enabled")?;
    let is_enabled_lbl = SmolStr::new(is_enabled.to_string());
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
      is_deleted,
      id,
      code_seq,
      code,
      lbl,
      parent_menu_id,
      parent_menu_id_lbl,
      role_ids,
      role_ids_lbl,
      order_by,
      is_enabled,
      is_enabled_lbl,
      rem,
      create_usr_id,
      create_usr_id_lbl,
      create_time,
      create_time_lbl,
      update_usr_id,
      update_usr_id_lbl,
      update_time,
      update_time_lbl,
      // 动态页面字段
      dyn_page_field: vec![],
    };
    
    Ok(model)
  }
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Debug)]
#[graphql(rename_fields = "snake_case", name = "DynPageFieldComment")]
#[allow(dead_code)]
pub struct DynPageFieldComment {
  /// ID
  #[graphql(name = "id")]
  pub id: SmolStr,
  /// 路由
  #[graphql(name = "code")]
  pub code: SmolStr,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: SmolStr,
  /// 父菜单
  #[graphql(name = "parent_menu_id")]
  pub parent_menu_id: SmolStr,
  /// 父菜单
  #[graphql(name = "parent_menu_id_lbl")]
  pub parent_menu_id_lbl: SmolStr,
  /// 所属角色
  #[graphql(name = "role_ids")]
  pub role_ids: SmolStr,
  /// 所属角色
  #[graphql(name = "role_ids_lbl")]
  pub role_ids_lbl: SmolStr,
  /// 排序
  #[graphql(name = "order_by")]
  pub order_by: SmolStr,
  /// 启用
  #[graphql(name = "is_enabled")]
  pub is_enabled: SmolStr,
  /// 启用
  #[graphql(name = "is_enabled_lbl")]
  pub is_enabled_lbl: SmolStr,
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
#[graphql(rename_fields = "snake_case", name = "DynPageSearch")]
#[allow(dead_code)]
pub struct DynPageSearch {
  /// ID
  pub id: Option<DynPageId>,
  /// ID列表
  pub ids: Option<Vec<DynPageId>>,
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  pub is_deleted: Option<u8>,
  /// 编码-序列号
  #[graphql(skip)]
  pub code_seq: Option<[Option<u32>; 2]>,
  /// 路由
  #[graphql(name = "code")]
  pub code: Option<SmolStr>,
  /// 路由
  #[graphql(name = "code_like")]
  pub code_like: Option<SmolStr>,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: Option<SmolStr>,
  /// 名称
  #[graphql(name = "lbl_like")]
  pub lbl_like: Option<SmolStr>,
  /// 父菜单
  #[graphql(name = "parent_menu_id")]
  pub parent_menu_id: Option<Vec<MenuId>>,
  /// 父菜单
  #[graphql(name = "parent_menu_id_save_null")]
  pub parent_menu_id_is_null: Option<bool>,
  /// 父菜单
  #[graphql(name = "parent_menu_id_lbl")]
  pub parent_menu_id_lbl: Option<Vec<SmolStr>>,
  /// 父菜单
  #[graphql(name = "parent_menu_id_lbl_like")]
  pub parent_menu_id_lbl_like: Option<SmolStr>,
  /// 所属角色
  #[graphql(name = "role_ids")]
  pub role_ids: Option<Vec<RoleId>>,
  /// 所属角色
  #[graphql(name = "role_ids_save_null")]
  pub role_ids_is_null: Option<bool>,
  /// 所属角色
  #[graphql(name = "role_ids_lbl_like")]
  pub role_ids_lbl_like: Option<SmolStr>,
  /// 排序
  #[graphql(skip)]
  pub order_by: Option<[Option<u32>; 2]>,
  /// 启用
  #[graphql(name = "is_enabled")]
  pub is_enabled: Option<Vec<u8>>,
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

impl std::fmt::Debug for DynPageSearch {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("DynPageSearch");
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
    // 编码-序列号
    if let Some(ref code_seq) = self.code_seq {
      item = item.field("code_seq", code_seq);
    }
    // 路由
    if let Some(ref code) = self.code {
      item = item.field("code", code);
    }
    if let Some(ref code_like) = self.code_like {
      item = item.field("code_like", code_like);
    }
    // 名称
    if let Some(ref lbl) = self.lbl {
      item = item.field("lbl", lbl);
    }
    if let Some(ref lbl_like) = self.lbl_like {
      item = item.field("lbl_like", lbl_like);
    }
    // 排序
    if let Some(ref order_by) = self.order_by {
      item = item.field("order_by", order_by);
    }
    // 启用
    if let Some(ref is_enabled) = self.is_enabled {
      item = item.field("is_enabled", is_enabled);
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
#[graphql(rename_fields = "snake_case", name = "DynPageInput")]
#[allow(dead_code)]
pub struct DynPageInput {
  /// ID
  pub id: Option<DynPageId>,
  /// 已删除
  #[graphql(skip)]
  pub is_deleted: Option<u8>,
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  /// 编码-序列号
  #[graphql(skip)]
  pub code_seq: Option<u32>,
  /// 路由
  #[graphql(name = "code")]
  pub code: Option<SmolStr>,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: Option<SmolStr>,
  /// 父菜单
  #[graphql(name = "parent_menu_id")]
  pub parent_menu_id: Option<MenuId>,
  /// 父菜单
  #[graphql(name = "parent_menu_id_lbl")]
  pub parent_menu_id_lbl: Option<SmolStr>,
  /// 所属角色
  #[graphql(name = "role_ids")]
  pub role_ids: Option<Vec<RoleId>>,
  /// 所属角色
  #[graphql(name = "role_ids_lbl")]
  pub role_ids_lbl: Option<Vec<SmolStr>>,
  /// 排序
  #[graphql(name = "order_by")]
  pub order_by: Option<u32>,
  /// 启用
  #[graphql(name = "is_enabled")]
  pub is_enabled: Option<u8>,
  /// 启用
  #[graphql(name = "is_enabled_lbl")]
  pub is_enabled_lbl: Option<SmolStr>,
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
  /// 动态页面字段
  #[graphql(name = "dyn_page_field")]
  pub dyn_page_field: Option<Vec<DynPageFieldInput>>,
}

impl std::fmt::Debug for DynPageInput {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("DynPageInput");
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
    if let Some(ref code_seq) = self.code_seq {
      item = item.field("code_seq", code_seq);
    }
    if let Some(ref code) = self.code {
      item = item.field("code", code);
    }
    if let Some(ref lbl) = self.lbl {
      item = item.field("lbl", lbl);
    }
    if let Some(ref parent_menu_id) = self.parent_menu_id {
      item = item.field("parent_menu_id", parent_menu_id);
    }
    if let Some(ref role_ids_lbl) = self.role_ids_lbl {
      item = item.field("role_ids_lbl", role_ids_lbl);
    }
    if let Some(ref order_by) = self.order_by {
      item = item.field("order_by", order_by);
    }
    if let Some(ref is_enabled) = self.is_enabled {
      item = item.field("is_enabled", is_enabled);
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

impl From<DynPageModel> for DynPageInput {
  fn from(model: DynPageModel) -> Self {
    Self {
      id: model.id.into(),
      is_deleted: model.is_deleted.into(),
      tenant_id: model.tenant_id.into(),
      // 编码-序列号
      code_seq: model.code_seq.into(),
      // 路由
      code: model.code.into(),
      // 名称
      lbl: model.lbl.into(),
      // 父菜单
      parent_menu_id: model.parent_menu_id.into(),
      parent_menu_id_lbl: model.parent_menu_id_lbl.into(),
      // 所属角色
      role_ids: model.role_ids.into(),
      role_ids_lbl: model.role_ids_lbl.into(),
      // 排序
      order_by: model.order_by.into(),
      // 启用
      is_enabled: model.is_enabled.into(),
      is_enabled_lbl: model.is_enabled_lbl.into(),
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
      // 动态页面字段
      dyn_page_field: model.dyn_page_field
        .into_iter()
        .map(|x| x.into())
        .collect::<Vec<DynPageFieldInput>>()
        .into(),
    }
  }
}

impl From<DynPageInput> for DynPageSearch {
  fn from(input: DynPageInput) -> Self {
    Self {
      id: input.id,
      ids: None,
      // 租户ID
      tenant_id: input.tenant_id,
      is_deleted: None,
      // 编码-序列号
      code_seq: input.code_seq.map(|x| [Some(x), Some(x)]),
      // 路由
      code: input.code,
      // 名称
      lbl: input.lbl,
      // 父菜单
      parent_menu_id: input.parent_menu_id.map(|x| vec![x]),
      // 所属角色
      role_ids: input.role_ids,
      // 排序
      order_by: input.order_by.map(|x| [Some(x), Some(x)]),
      // 启用
      is_enabled: input.is_enabled.map(|x| vec![x]),
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

impl_id!(DynPageId);

/// 动态页面 检测字段是否允许前端排序
pub fn check_sort_dyn_page(
  sort: Option<&[SortInput]>,
) -> Result<()> {
  
  if sort.is_none() {
    return Ok(());
  }
  let sort = sort.unwrap();
  
  let get_can_sort_in_api_dyn_page = get_can_sort_in_api_dyn_page();
  
  for item in sort {
    let prop = item.prop.as_str();
    if prop.is_empty() {
      continue;
    }
    if !get_can_sort_in_api_dyn_page.contains(&prop) {
      return Err(eyre!("check_sort_dyn_page: {}", serde_json::to_string(item)?));
    }
  }
  
  Ok(())
}

// MARK: get_page_path_dyn_page
pub fn get_page_path_dyn_page() -> &'static str {
  "/base/dyn_page"
}

// MARK: get_table_name_dyn_page
pub fn get_table_name_dyn_page() -> &'static str {
  "base_dyn_page"
}
