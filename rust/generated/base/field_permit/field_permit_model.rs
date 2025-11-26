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
use crate::base::menu::menu_model::MenuId;

static CAN_SORT_IN_API_FIELD_PERMIT: OnceLock<[&'static str; 1]> = OnceLock::new();

/// 字段权限 前端允许排序的字段
fn get_can_sort_in_api_field_permit() -> &'static [&'static str; 1] {
  CAN_SORT_IN_API_FIELD_PERMIT.get_or_init(|| [
    "order_by",
  ])
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "FieldPermitModel")]
#[allow(dead_code)]
pub struct FieldPermitModel {
  /// 系统字段
  pub is_sys: u8,
  /// ID
  pub id: FieldPermitId,
  /// 菜单
  #[graphql(name = "menu_id")]
  pub menu_id: MenuId,
  /// 菜单
  #[graphql(name = "menu_id_lbl")]
  pub menu_id_lbl: String,
  /// 编码
  #[graphql(name = "code")]
  pub code: String,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: String,
  /// 排序
  #[graphql(name = "order_by")]
  pub order_by: u32,
  /// 备注
  #[graphql(name = "rem")]
  pub rem: String,
}

impl FromRow<'_, MySqlRow> for FieldPermitModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 系统记录
    let is_sys = row.try_get("is_sys")?;
    // ID
    let id: FieldPermitId = row.try_get("id")?;
    // 菜单
    let menu_id: MenuId = row.try_get("menu_id")?;
    let menu_id_lbl: Option<String> = row.try_get("menu_id_lbl")?;
    let menu_id_lbl = menu_id_lbl.unwrap_or_default();
    // 编码
    let code: String = row.try_get("code")?;
    // 名称
    let lbl: String = row.try_get("lbl")?;
    // 排序
    let order_by: u32 = row.try_get("order_by")?;
    // 备注
    let rem: String = row.try_get("rem")?;
    
    let model = Self {
      is_sys,
      id,
      menu_id,
      menu_id_lbl,
      code,
      lbl,
      order_by,
      rem,
    };
    
    Ok(model)
  }
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Debug)]
#[graphql(rename_fields = "snake_case", name = "FieldPermitFieldComment")]
#[allow(dead_code)]
pub struct FieldPermitFieldComment {
  /// ID
  #[graphql(name = "id")]
  pub id: String,
  /// 菜单
  #[graphql(name = "menu_id")]
  pub menu_id: String,
  /// 菜单
  #[graphql(name = "menu_id_lbl")]
  pub menu_id_lbl: String,
  /// 编码
  #[graphql(name = "code")]
  pub code: String,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: String,
  /// 排序
  #[graphql(name = "order_by")]
  pub order_by: String,
  /// 备注
  #[graphql(name = "rem")]
  pub rem: String,
}

#[derive(InputObject, Default)]
#[graphql(rename_fields = "snake_case", name = "FieldPermitSearch")]
#[allow(dead_code)]
pub struct FieldPermitSearch {
  /// ID
  pub id: Option<FieldPermitId>,
  /// ID列表
  pub ids: Option<Vec<FieldPermitId>>,
  /// 菜单
  #[graphql(name = "menu_id")]
  pub menu_id: Option<Vec<MenuId>>,
  /// 菜单
  #[graphql(name = "menu_id_save_null")]
  pub menu_id_is_null: Option<bool>,
  /// 菜单
  #[graphql(name = "menu_id_lbl")]
  pub menu_id_lbl: Option<Vec<String>>,
  /// 菜单
  #[graphql(name = "menu_id_lbl_like")]
  pub menu_id_lbl_like: Option<String>,
  /// 编码
  #[graphql(name = "code")]
  pub code: Option<String>,
  /// 编码
  #[graphql(name = "code_like")]
  pub code_like: Option<String>,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: Option<String>,
  /// 名称
  #[graphql(name = "lbl_like")]
  pub lbl_like: Option<String>,
  /// 排序
  #[graphql(skip)]
  pub order_by: Option<[Option<u32>; 2]>,
  /// 备注
  #[graphql(skip)]
  pub rem: Option<String>,
  /// 备注
  #[graphql(skip)]
  pub rem_like: Option<String>,
}

impl std::fmt::Debug for FieldPermitSearch {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("FieldPermitSearch");
    if let Some(ref id) = self.id {
      item = item.field("id", id);
    }
    if let Some(ref ids) = self.ids {
      item = item.field("ids", ids);
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
    // 编码
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
    // 备注
    if let Some(ref rem) = self.rem {
      item = item.field("rem", rem);
    }
    if let Some(ref rem_like) = self.rem_like {
      item = item.field("rem_like", rem_like);
    }
    item.finish()
  }
}

#[derive(InputObject, Default, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "FieldPermitInput")]
#[allow(dead_code)]
pub struct FieldPermitInput {
  /// ID
  pub id: Option<FieldPermitId>,
  /// 系统记录
  pub is_sys: Option<u8>,
  /// 菜单
  #[graphql(name = "menu_id")]
  pub menu_id: Option<MenuId>,
  /// 菜单
  #[graphql(name = "menu_id_lbl")]
  pub menu_id_lbl: Option<String>,
  /// 编码
  #[graphql(name = "code")]
  pub code: Option<String>,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: Option<String>,
  /// 排序
  #[graphql(name = "order_by")]
  pub order_by: Option<u32>,
  /// 备注
  #[graphql(name = "rem")]
  pub rem: Option<String>,
}

impl From<FieldPermitModel> for FieldPermitInput {
  fn from(model: FieldPermitModel) -> Self {
    Self {
      id: model.id.into(),
      is_sys: model.is_sys.into(),
      // 菜单
      menu_id: model.menu_id.into(),
      menu_id_lbl: model.menu_id_lbl.into(),
      // 编码
      code: model.code.into(),
      // 名称
      lbl: model.lbl.into(),
      // 排序
      order_by: model.order_by.into(),
      // 备注
      rem: model.rem.into(),
    }
  }
}

impl From<FieldPermitInput> for FieldPermitSearch {
  fn from(input: FieldPermitInput) -> Self {
    Self {
      id: input.id,
      ids: None,
      // 菜单
      menu_id: input.menu_id.map(|x| vec![x]),
      // 编码
      code: input.code,
      // 名称
      lbl: input.lbl,
      // 排序
      order_by: input.order_by.map(|x| [Some(x), Some(x)]),
      // 备注
      rem: input.rem,
      ..Default::default()
    }
  }
}

impl_id!(FieldPermitId);

/// 字段权限 检测字段是否允许前端排序
pub fn check_sort_field_permit(
  sort: Option<&[SortInput]>,
) -> Result<()> {
  
  if sort.is_none() {
    return Ok(());
  }
  let sort = sort.unwrap();
  
  let get_can_sort_in_api_field_permit = get_can_sort_in_api_field_permit();
  
  for item in sort {
    let prop = item.prop.as_str();
    if prop.is_empty() {
      continue;
    }
    if !get_can_sort_in_api_field_permit.contains(&prop) {
      return Err(eyre!("check_sort_field_permit: {}", serde_json::to_string(item)?));
    }
  }
  
  Ok(())
}

// MARK: get_page_path_field_permit
pub fn get_page_path_field_permit() -> &'static str {
  "/base/field_permit"
}

// MARK: get_table_name_field_permit
pub fn get_table_name_field_permit() -> &'static str {
  "base_field_permit"
}
