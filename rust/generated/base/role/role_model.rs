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
use crate::base::permit::permit_model::PermitId;
use crate::base::data_permit::data_permit_model::DataPermitId;
use crate::base::field_permit::field_permit_model::FieldPermitId;
use crate::base::usr::usr_model::UsrId;

static CAN_SORT_IN_API_ROLE: OnceLock<[&'static str; 3]> = OnceLock::new();

/// 角色 前端允许排序的字段
fn get_can_sort_in_api_role() -> &'static [&'static str; 3] {
  CAN_SORT_IN_API_ROLE.get_or_init(|| [
    "order_by",
    "create_time",
    "update_time",
  ])
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "RoleModel")]
#[allow(dead_code)]
pub struct RoleModel {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: TenantId,
  /// 系统字段
  pub is_sys: u8,
  /// ID
  pub id: RoleId,
  /// 编码-序列号
  #[graphql(skip)]
  pub code_seq: u32,
  /// 编码
  #[graphql(name = "code")]
  pub code: String,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: String,
  /// 首页
  #[graphql(name = "home_url")]
  pub home_url: String,
  /// 菜单权限
  #[graphql(name = "menu_ids")]
  pub menu_ids: Vec<MenuId>,
  /// 菜单权限
  #[graphql(name = "menu_ids_lbl")]
  pub menu_ids_lbl: Vec<String>,
  /// 按钮权限
  #[graphql(name = "permit_ids")]
  pub permit_ids: Vec<PermitId>,
  /// 按钮权限
  #[graphql(name = "permit_ids_lbl")]
  pub permit_ids_lbl: Vec<String>,
  /// 数据权限
  #[graphql(name = "data_permit_ids")]
  pub data_permit_ids: Vec<DataPermitId>,
  /// 字段权限
  #[graphql(name = "field_permit_ids")]
  pub field_permit_ids: Vec<FieldPermitId>,
  /// 字段权限
  #[graphql(name = "field_permit_ids_lbl")]
  pub field_permit_ids_lbl: Vec<String>,
  /// 锁定
  #[graphql(name = "is_locked")]
  pub is_locked: u8,
  /// 锁定
  #[graphql(name = "is_locked_lbl")]
  pub is_locked_lbl: String,
  /// 启用
  #[graphql(name = "is_enabled")]
  pub is_enabled: u8,
  /// 启用
  #[graphql(name = "is_enabled_lbl")]
  pub is_enabled_lbl: String,
  /// 排序
  #[graphql(name = "order_by")]
  pub order_by: u32,
  /// 备注
  #[graphql(name = "rem")]
  pub rem: String,
  /// 是否已删除
  pub is_deleted: u8,
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
}

impl FromRow<'_, MySqlRow> for RoleModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;
    // 系统记录
    let is_sys = row.try_get("is_sys")?;
    // ID
    let id: RoleId = row.try_get("id")?;
    // 编码-序列号
    let code_seq: u32 = row.try_get("code_seq")?;
    // 编码
    let code: String = row.try_get("code")?;
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
          x.parse::<u32>()
            .map_err(|_| sqlx::Error::Decode(
              Box::new(sqlx::error::Error::Protocol(
                "menu_ids_lbl order_by Invalid u32".to_string()
              ))
            ))
        )
        .collect::<Result<_, _>>()?;
      keys.sort();
      keys
        .into_iter()
        .map(|x| 
          menu_ids_lbl.get(&x.to_string())
            .map(|x| x.to_owned())
            .unwrap_or_default()
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
          x.parse::<u32>()
            .map_err(|_| sqlx::Error::Decode(
              Box::new(sqlx::error::Error::Protocol(
                "permit_ids_lbl order_by Invalid u32".to_string()
              ))
            ))
        )
        .collect::<Result<_, _>>()?;
      keys.sort();
      keys
        .into_iter()
        .map(|x| 
          permit_ids_lbl.get(&x.to_string())
            .map(|x| x.to_owned())
            .unwrap_or_default()
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
    // 字段权限
    let field_permit_ids: Option<sqlx::types::Json<HashMap<String, FieldPermitId>>> = row.try_get("field_permit_ids")?;
    let field_permit_ids = field_permit_ids.unwrap_or_default().0;
    let field_permit_ids = {
      let mut keys: Vec<u32> = field_permit_ids.keys()
        .map(|x| 
          x.parse::<u32>().unwrap_or_default()
        )
        .collect();
      keys.sort();
      keys.into_iter()
        .map(|x| 
          field_permit_ids.get(&x.to_string())
            .unwrap_or(&FieldPermitId::default())
            .to_owned()
        )
        .collect::<Vec<FieldPermitId>>()
    };
    let field_permit_ids_lbl: Option<sqlx::types::Json<HashMap<String, String>>> = row.try_get("field_permit_ids_lbl")?;
    let field_permit_ids_lbl = field_permit_ids_lbl.unwrap_or_default().0;
    let field_permit_ids_lbl = {
      let mut keys: Vec<u32> = field_permit_ids_lbl.keys()
        .map(|x| 
          x.parse::<u32>()
            .map_err(|_| sqlx::Error::Decode(
              Box::new(sqlx::error::Error::Protocol(
                "field_permit_ids_lbl order_by Invalid u32".to_string()
              ))
            ))
        )
        .collect::<Result<_, _>>()?;
      keys.sort();
      keys
        .into_iter()
        .map(|x| 
          field_permit_ids_lbl.get(&x.to_string())
            .map(|x| x.to_owned())
            .unwrap_or_default()
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
      is_sys,
      is_deleted,
      id,
      code_seq,
      code,
      lbl,
      home_url,
      menu_ids,
      menu_ids_lbl,
      permit_ids,
      permit_ids_lbl,
      data_permit_ids,
      field_permit_ids,
      field_permit_ids_lbl,
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
#[graphql(rename_fields = "snake_case", name = "RoleFieldComment")]
#[allow(dead_code)]
pub struct RoleFieldComment {
  /// ID
  #[graphql(name = "id")]
  pub id: String,
  /// 编码
  #[graphql(name = "code")]
  pub code: String,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: String,
  /// 首页
  #[graphql(name = "home_url")]
  pub home_url: String,
  /// 菜单权限
  #[graphql(name = "menu_ids")]
  pub menu_ids: String,
  /// 菜单权限
  #[graphql(name = "menu_ids_lbl")]
  pub menu_ids_lbl: String,
  /// 按钮权限
  #[graphql(name = "permit_ids")]
  pub permit_ids: String,
  /// 按钮权限
  #[graphql(name = "permit_ids_lbl")]
  pub permit_ids_lbl: String,
  /// 数据权限
  #[graphql(name = "data_permit_ids")]
  pub data_permit_ids: String,
  /// 数据权限
  #[graphql(name = "data_permit_ids_lbl")]
  pub data_permit_ids_lbl: String,
  /// 字段权限
  #[graphql(name = "field_permit_ids")]
  pub field_permit_ids: String,
  /// 字段权限
  #[graphql(name = "field_permit_ids_lbl")]
  pub field_permit_ids_lbl: String,
  /// 锁定
  #[graphql(name = "is_locked")]
  pub is_locked: String,
  /// 锁定
  #[graphql(name = "is_locked_lbl")]
  pub is_locked_lbl: String,
  /// 启用
  #[graphql(name = "is_enabled")]
  pub is_enabled: String,
  /// 启用
  #[graphql(name = "is_enabled_lbl")]
  pub is_enabled_lbl: String,
  /// 排序
  #[graphql(name = "order_by")]
  pub order_by: String,
  /// 备注
  #[graphql(name = "rem")]
  pub rem: String,
  /// 创建人
  #[graphql(name = "create_usr_id")]
  pub create_usr_id: String,
  /// 创建人
  #[graphql(name = "create_usr_id_lbl")]
  pub create_usr_id_lbl: String,
  /// 创建时间
  #[graphql(name = "create_time")]
  pub create_time: String,
  /// 创建时间
  #[graphql(name = "create_time_lbl")]
  pub create_time_lbl: String,
  /// 更新人
  #[graphql(name = "update_usr_id")]
  pub update_usr_id: String,
  /// 更新人
  #[graphql(name = "update_usr_id_lbl")]
  pub update_usr_id_lbl: String,
  /// 更新时间
  #[graphql(name = "update_time")]
  pub update_time: String,
  /// 更新时间
  #[graphql(name = "update_time_lbl")]
  pub update_time_lbl: String,
}

#[derive(InputObject, Default)]
#[graphql(rename_fields = "snake_case", name = "RoleSearch")]
#[allow(dead_code)]
pub struct RoleSearch {
  /// ID
  pub id: Option<RoleId>,
  /// ID列表
  pub ids: Option<Vec<RoleId>>,
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  pub is_deleted: Option<u8>,
  #[graphql(name = "keyword")]
  pub keyword: Option<String>,
  /// 编码-序列号
  #[graphql(skip)]
  pub code_seq: Option<[Option<u32>; 2]>,
  /// 编码
  #[graphql(name = "code")]
  pub code: Option<String>,
  /// 编码
  #[graphql(name = "code_like")]
  pub code_like: Option<String>,
  /// 编码
  #[graphql(name = "codes")]
  pub codes: Option<Vec<String>>,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: Option<String>,
  /// 名称
  #[graphql(name = "lbl_like")]
  pub lbl_like: Option<String>,
  /// 首页
  #[graphql(skip)]
  pub home_url: Option<String>,
  /// 首页
  #[graphql(skip)]
  pub home_url_like: Option<String>,
  /// 菜单权限
  #[graphql(name = "menu_ids")]
  pub menu_ids: Option<Vec<MenuId>>,
  /// 菜单权限
  #[graphql(name = "menu_ids_save_null")]
  pub menu_ids_is_null: Option<bool>,
  /// 菜单权限
  #[graphql(name = "menu_ids_lbl_like")]
  pub menu_ids_lbl_like: Option<String>,
  /// 按钮权限
  #[graphql(name = "permit_ids")]
  pub permit_ids: Option<Vec<PermitId>>,
  /// 按钮权限
  #[graphql(name = "permit_ids_save_null")]
  pub permit_ids_is_null: Option<bool>,
  /// 按钮权限
  #[graphql(name = "permit_ids_lbl_like")]
  pub permit_ids_lbl_like: Option<String>,
  /// 数据权限
  #[graphql(name = "data_permit_ids")]
  pub data_permit_ids: Option<Vec<DataPermitId>>,
  /// 数据权限
  #[graphql(name = "data_permit_ids_save_null")]
  pub data_permit_ids_is_null: Option<bool>,
  /// 字段权限
  #[graphql(name = "field_permit_ids")]
  pub field_permit_ids: Option<Vec<FieldPermitId>>,
  /// 字段权限
  #[graphql(name = "field_permit_ids_save_null")]
  pub field_permit_ids_is_null: Option<bool>,
  /// 字段权限
  #[graphql(name = "field_permit_ids_lbl_like")]
  pub field_permit_ids_lbl_like: Option<String>,
  /// 锁定
  #[graphql(skip)]
  pub is_locked: Option<Vec<u8>>,
  /// 启用
  #[graphql(name = "is_enabled")]
  pub is_enabled: Option<Vec<u8>>,
  /// 排序
  #[graphql(skip)]
  pub order_by: Option<[Option<u32>; 2]>,
  /// 备注
  #[graphql(name = "rem")]
  pub rem: Option<String>,
  /// 备注
  #[graphql(name = "rem_like")]
  pub rem_like: Option<String>,
  /// 创建人
  #[graphql(name = "create_usr_id")]
  pub create_usr_id: Option<Vec<UsrId>>,
  /// 创建人
  #[graphql(name = "create_usr_id_save_null")]
  pub create_usr_id_is_null: Option<bool>,
  /// 创建人
  #[graphql(name = "create_usr_id_lbl")]
  pub create_usr_id_lbl: Option<Vec<String>>,
  /// 创建人
  #[graphql(name = "create_usr_id_lbl_like")]
  pub create_usr_id_lbl_like: Option<String>,
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
  pub update_usr_id_lbl: Option<Vec<String>>,
  /// 更新人
  #[graphql(name = "update_usr_id_lbl_like")]
  pub update_usr_id_lbl_like: Option<String>,
  /// 更新时间
  #[graphql(skip)]
  pub update_time: Option<[Option<chrono::NaiveDateTime>; 2]>,
}

impl std::fmt::Debug for RoleSearch {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("RoleSearch");
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
    // 首页
    if let Some(ref home_url) = self.home_url {
      item = item.field("home_url", home_url);
    }
    if let Some(ref home_url_like) = self.home_url_like {
      item = item.field("home_url_like", home_url_like);
    }
    // 菜单权限
    if let Some(ref menu_ids) = self.menu_ids {
      item = item.field("menu_ids", menu_ids);
    }
    // 按钮权限
    if let Some(ref permit_ids) = self.permit_ids {
      item = item.field("permit_ids", permit_ids);
    }
    // 数据权限
    if let Some(ref data_permit_ids) = self.data_permit_ids {
      item = item.field("data_permit_ids", data_permit_ids);
    }
    // 字段权限
    if let Some(ref field_permit_ids) = self.field_permit_ids {
      item = item.field("field_permit_ids", field_permit_ids);
    }
    // 锁定
    if let Some(ref is_locked) = self.is_locked {
      item = item.field("is_locked", is_locked);
    }
    // 启用
    if let Some(ref is_enabled) = self.is_enabled {
      item = item.field("is_enabled", is_enabled);
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
#[graphql(rename_fields = "snake_case", name = "RoleInput")]
#[allow(dead_code)]
pub struct RoleInput {
  /// ID
  pub id: Option<RoleId>,
  /// 已删除
  #[graphql(skip)]
  pub is_deleted: Option<u8>,
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  /// 系统记录
  pub is_sys: Option<u8>,
  /// 编码-序列号
  #[graphql(skip)]
  pub code_seq: Option<u32>,
  /// 编码
  #[graphql(name = "code")]
  pub code: Option<String>,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: Option<String>,
  /// 首页
  #[graphql(name = "home_url")]
  pub home_url: Option<String>,
  /// 菜单权限
  #[graphql(name = "menu_ids")]
  pub menu_ids: Option<Vec<MenuId>>,
  /// 菜单权限
  #[graphql(name = "menu_ids_lbl")]
  pub menu_ids_lbl: Option<Vec<String>>,
  /// 按钮权限
  #[graphql(name = "permit_ids")]
  pub permit_ids: Option<Vec<PermitId>>,
  /// 按钮权限
  #[graphql(name = "permit_ids_lbl")]
  pub permit_ids_lbl: Option<Vec<String>>,
  /// 数据权限
  #[graphql(name = "data_permit_ids")]
  pub data_permit_ids: Option<Vec<DataPermitId>>,
  /// 字段权限
  #[graphql(name = "field_permit_ids")]
  pub field_permit_ids: Option<Vec<FieldPermitId>>,
  /// 字段权限
  #[graphql(name = "field_permit_ids_lbl")]
  pub field_permit_ids_lbl: Option<Vec<String>>,
  /// 锁定
  #[graphql(name = "is_locked")]
  pub is_locked: Option<u8>,
  /// 锁定
  #[graphql(name = "is_locked_lbl")]
  pub is_locked_lbl: Option<String>,
  /// 启用
  #[graphql(name = "is_enabled")]
  pub is_enabled: Option<u8>,
  /// 启用
  #[graphql(name = "is_enabled_lbl")]
  pub is_enabled_lbl: Option<String>,
  /// 排序
  #[graphql(name = "order_by")]
  pub order_by: Option<u32>,
  /// 备注
  #[graphql(name = "rem")]
  pub rem: Option<String>,
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

impl From<RoleModel> for RoleInput {
  fn from(model: RoleModel) -> Self {
    Self {
      id: model.id.into(),
      is_deleted: model.is_deleted.into(),
      tenant_id: model.tenant_id.into(),
      is_sys: model.is_sys.into(),
      // 编码-序列号
      code_seq: model.code_seq.into(),
      // 编码
      code: model.code.into(),
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
      // 字段权限
      field_permit_ids: model.field_permit_ids.into(),
      field_permit_ids_lbl: model.field_permit_ids_lbl.into(),
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

impl From<RoleInput> for RoleSearch {
  fn from(input: RoleInput) -> Self {
    Self {
      id: input.id,
      ids: None,
      // 租户ID
      tenant_id: input.tenant_id,
      is_deleted: None,
      // 编码-序列号
      code_seq: input.code_seq.map(|x| [Some(x), Some(x)]),
      // 编码
      code: input.code,
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
      // 字段权限
      field_permit_ids: input.field_permit_ids,
      // 锁定
      is_locked: input.is_locked.map(|x| vec![x]),
      // 启用
      is_enabled: input.is_enabled.map(|x| vec![x]),
      // 排序
      order_by: input.order_by.map(|x| [Some(x), Some(x)]),
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

impl_id!(RoleId);

/// 角色 检测字段是否允许前端排序
pub fn check_sort_role(
  sort: Option<&[SortInput]>,
) -> Result<()> {
  
  if sort.is_none() {
    return Ok(());
  }
  let sort = sort.unwrap();
  
  let get_can_sort_in_api_role = get_can_sort_in_api_role();
  
  for item in sort {
    let prop = item.prop.as_str();
    if prop.is_empty() {
      continue;
    }
    if !get_can_sort_in_api_role.contains(&prop) {
      return Err(eyre!("check_sort_role: {}", serde_json::to_string(item)?));
    }
  }
  
  Ok(())
}

/// 获取路由地址
#[allow(dead_code)]
pub fn get_route_path_role() -> String {
  "/base/role".to_owned()
}
