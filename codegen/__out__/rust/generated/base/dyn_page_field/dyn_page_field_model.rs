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
use crate::base::dyn_page::dyn_page_model::DynPageId;
use crate::base::usr::usr_model::UsrId;

static CAN_SORT_IN_API_DYN_PAGE_FIELD: OnceLock<[&'static str; 3]> = OnceLock::new();

/// 动态页面字段 前端允许排序的字段
fn get_can_sort_in_api_dyn_page_field() -> &'static [&'static str; 3] {
  CAN_SORT_IN_API_DYN_PAGE_FIELD.get_or_init(|| [
    "order_by",
    "create_time",
    "update_time",
  ])
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "DynPageFieldModel")]
#[allow(dead_code)]
pub struct DynPageFieldModel {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: TenantId,
  /// ID
  pub id: DynPageFieldId,
  /// 动态页面
  #[graphql(name = "dyn_page_id")]
  pub dyn_page_id: DynPageId,
  /// 动态页面
  #[graphql(name = "dyn_page_id_lbl")]
  pub dyn_page_id_lbl: String,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: String,
  /// 类型
  #[graphql(name = "type")]
  pub r#type: String,
  /// 属性
  #[graphql(name = "attrs")]
  pub attrs: Option<String>,
  /// 必填
  #[graphql(name = "is_required")]
  pub is_required: u8,
  /// 必填
  #[graphql(name = "is_required_lbl")]
  pub is_required_lbl: String,
  /// 启用
  #[graphql(name = "is_enabled")]
  pub is_enabled: u8,
  /// 启用
  #[graphql(name = "is_enabled_lbl")]
  pub is_enabled_lbl: String,
  /// 排序
  #[graphql(name = "order_by")]
  pub order_by: u32,
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

impl FromRow<'_, MySqlRow> for DynPageFieldModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;
    // ID
    let id: DynPageFieldId = row.try_get("id")?;
    // 动态页面
    let dyn_page_id: DynPageId = row.try_get("dyn_page_id")?;
    let dyn_page_id_lbl: Option<String> = row.try_get("dyn_page_id_lbl")?;
    let dyn_page_id_lbl = dyn_page_id_lbl.unwrap_or_default();
    // 名称
    let lbl: String = row.try_get("lbl")?;
    // 类型
    let r#type: String = row.try_get("type")?;
    // 属性
    let attrs: Option<String> = row.try_get("attrs")?;
    // 必填
    let is_required: u8 = row.try_get("is_required")?;
    let is_required_lbl: String = is_required.to_string();
    // 启用
    let is_enabled: u8 = row.try_get("is_enabled")?;
    let is_enabled_lbl: String = is_enabled.to_string();
    // 排序
    let order_by: u32 = row.try_get("order_by")?;
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
      dyn_page_id,
      dyn_page_id_lbl,
      lbl,
      r#type,
      attrs,
      is_required,
      is_required_lbl,
      is_enabled,
      is_enabled_lbl,
      order_by,
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
#[graphql(rename_fields = "snake_case", name = "DynPageFieldFieldComment")]
#[allow(dead_code)]
pub struct DynPageFieldFieldComment {
  /// ID
  #[graphql(name = "id")]
  pub id: String,
  /// 动态页面
  #[graphql(name = "dyn_page_id")]
  pub dyn_page_id: String,
  /// 动态页面
  #[graphql(name = "dyn_page_id_lbl")]
  pub dyn_page_id_lbl: String,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: String,
  /// 类型
  #[graphql(name = "type")]
  pub r#type: String,
  /// 属性
  #[graphql(name = "attrs")]
  pub attrs: String,
  /// 必填
  #[graphql(name = "is_required")]
  pub is_required: String,
  /// 必填
  #[graphql(name = "is_required_lbl")]
  pub is_required_lbl: String,
  /// 启用
  #[graphql(name = "is_enabled")]
  pub is_enabled: String,
  /// 启用
  #[graphql(name = "is_enabled_lbl")]
  pub is_enabled_lbl: String,
  /// 排序
  #[graphql(name = "order_by")]
  pub order_by: String,
}

#[derive(InputObject, Default)]
#[graphql(rename_fields = "snake_case", name = "DynPageFieldSearch")]
#[allow(dead_code)]
pub struct DynPageFieldSearch {
  /// ID
  pub id: Option<DynPageFieldId>,
  /// ID列表
  pub ids: Option<Vec<DynPageFieldId>>,
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  pub is_deleted: Option<u8>,
  /// 动态页面
  #[graphql(name = "dyn_page_id")]
  pub dyn_page_id: Option<Vec<DynPageId>>,
  /// 动态页面
  #[graphql(name = "dyn_page_id_save_null")]
  pub dyn_page_id_is_null: Option<bool>,
  /// 动态页面
  #[graphql(name = "dyn_page_id_lbl")]
  pub dyn_page_id_lbl: Option<Vec<String>>,
  /// 动态页面
  #[graphql(name = "dyn_page_id_lbl_like")]
  pub dyn_page_id_lbl_like: Option<String>,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: Option<String>,
  /// 名称
  #[graphql(name = "lbl_like")]
  pub lbl_like: Option<String>,
  /// 类型
  #[graphql(skip)]
  pub r#type: Option<String>,
  /// 类型
  #[graphql(skip)]
  pub type_like: Option<String>,
  /// 属性
  #[graphql(skip)]
  pub attrs: Option<String>,
  /// 属性
  #[graphql(skip)]
  pub attrs_like: Option<String>,
  /// 必填
  #[graphql(skip)]
  pub is_required: Option<Vec<u8>>,
  /// 启用
  #[graphql(name = "is_enabled")]
  pub is_enabled: Option<Vec<u8>>,
  /// 排序
  #[graphql(skip)]
  pub order_by: Option<[Option<u32>; 2]>,
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
  /// 更新人
  #[graphql(skip)]
  pub update_usr_id_lbl_like: Option<String>,
  /// 更新时间
  #[graphql(skip)]
  pub update_time: Option<[Option<chrono::NaiveDateTime>; 2]>,
}

impl std::fmt::Debug for DynPageFieldSearch {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("DynPageFieldSearch");
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
    // 动态页面
    if let Some(ref dyn_page_id) = self.dyn_page_id {
      item = item.field("dyn_page_id", dyn_page_id);
    }
    if let Some(ref dyn_page_id_lbl) = self.dyn_page_id_lbl {
      item = item.field("dyn_page_id_lbl", dyn_page_id_lbl);
    }
    if let Some(ref dyn_page_id_lbl_like) = self.dyn_page_id_lbl_like {
      item = item.field("dyn_page_id_lbl_like", dyn_page_id_lbl_like);
    }
    if let Some(ref dyn_page_id_is_null) = self.dyn_page_id_is_null {
      item = item.field("dyn_page_id_is_null", dyn_page_id_is_null);
    }
    // 名称
    if let Some(ref lbl) = self.lbl {
      item = item.field("lbl", lbl);
    }
    if let Some(ref lbl_like) = self.lbl_like {
      item = item.field("lbl_like", lbl_like);
    }
    // 类型
    if let Some(ref r#type) = self.r#type {
      item = item.field("r#type", r#type);
    }
    if let Some(ref r#type_like) = self.r#type_like {
      item = item.field("r#type_like", r#type_like);
    }
    // 属性
    if let Some(ref attrs) = self.attrs {
      item = item.field("attrs", attrs);
    }
    if let Some(ref attrs_like) = self.attrs_like {
      item = item.field("attrs_like", attrs_like);
    }
    // 必填
    if let Some(ref is_required) = self.is_required {
      item = item.field("is_required", is_required);
    }
    // 启用
    if let Some(ref is_enabled) = self.is_enabled {
      item = item.field("is_enabled", is_enabled);
    }
    // 排序
    if let Some(ref order_by) = self.order_by {
      item = item.field("order_by", order_by);
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

#[derive(InputObject, Default, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "DynPageFieldInput")]
#[allow(dead_code)]
pub struct DynPageFieldInput {
  /// ID
  pub id: Option<DynPageFieldId>,
  /// 已删除
  #[graphql(skip)]
  pub is_deleted: Option<u8>,
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  /// 动态页面
  #[graphql(name = "dyn_page_id")]
  pub dyn_page_id: Option<DynPageId>,
  /// 动态页面
  #[graphql(name = "dyn_page_id_lbl")]
  pub dyn_page_id_lbl: Option<String>,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: Option<String>,
  /// 类型
  #[graphql(name = "type")]
  pub r#type: Option<String>,
  /// 属性
  #[graphql(name = "attrs")]
  pub attrs: Option<String>,
  /// 必填
  #[graphql(name = "is_required")]
  pub is_required: Option<u8>,
  /// 必填
  #[graphql(name = "is_required_lbl")]
  pub is_required_lbl: Option<String>,
  /// 启用
  #[graphql(name = "is_enabled")]
  pub is_enabled: Option<u8>,
  /// 启用
  #[graphql(name = "is_enabled_lbl")]
  pub is_enabled_lbl: Option<String>,
  /// 排序
  #[graphql(name = "order_by")]
  pub order_by: Option<u32>,
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

impl From<DynPageFieldModel> for DynPageFieldInput {
  fn from(model: DynPageFieldModel) -> Self {
    Self {
      id: model.id.into(),
      is_deleted: model.is_deleted.into(),
      tenant_id: model.tenant_id.into(),
      // 动态页面
      dyn_page_id: model.dyn_page_id.into(),
      dyn_page_id_lbl: model.dyn_page_id_lbl.into(),
      // 名称
      lbl: model.lbl.into(),
      // 类型
      r#type: model.r#type.into(),
      // 属性
      attrs: model.attrs,
      // 必填
      is_required: model.is_required.into(),
      is_required_lbl: model.is_required_lbl.into(),
      // 启用
      is_enabled: model.is_enabled.into(),
      is_enabled_lbl: model.is_enabled_lbl.into(),
      // 排序
      order_by: model.order_by.into(),
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

impl From<DynPageFieldInput> for DynPageFieldSearch {
  fn from(input: DynPageFieldInput) -> Self {
    Self {
      id: input.id,
      ids: None,
      // 租户ID
      tenant_id: input.tenant_id,
      is_deleted: None,
      // 动态页面
      dyn_page_id: input.dyn_page_id.map(|x| vec![x]),
      // 名称
      lbl: input.lbl,
      // 类型
      r#type: input.r#type,
      // 属性
      attrs: input.attrs,
      // 必填
      is_required: input.is_required.map(|x| vec![x]),
      // 启用
      is_enabled: input.is_enabled.map(|x| vec![x]),
      // 排序
      order_by: input.order_by.map(|x| [Some(x), Some(x)]),
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

impl_id!(DynPageFieldId);

/// 动态页面字段 检测字段是否允许前端排序
pub fn check_sort_dyn_page_field(
  sort: Option<&[SortInput]>,
) -> Result<()> {
  
  if sort.is_none() {
    return Ok(());
  }
  let sort = sort.unwrap();
  
  let get_can_sort_in_api_dyn_page_field = get_can_sort_in_api_dyn_page_field();
  
  for item in sort {
    let prop = item.prop.as_str();
    if prop.is_empty() {
      continue;
    }
    if !get_can_sort_in_api_dyn_page_field.contains(&prop) {
      return Err(eyre!("check_sort_dyn_page_field: {}", serde_json::to_string(item)?));
    }
  }
  
  Ok(())
}

/// 获取路由地址
#[allow(dead_code)]
pub fn get_route_path_dyn_page_field() -> String {
  "/base/dyn_page_field".to_owned()
}
