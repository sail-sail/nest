
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

use crate::base::tenant::tenant_model::TenantId;
use crate::base::role::role_model::RoleId;
use crate::base::dept::dept_model::DeptId;
use crate::base::org::org_model::OrgId;

static CAN_SORT_IN_API_USR: OnceLock<[&'static str; 4]> = OnceLock::new();

/// 用户 前端允许排序的字段
fn get_can_sort_in_api_usr() -> &'static [&'static str; 4] {
  CAN_SORT_IN_API_USR.get_or_init(|| [
    "username",
    "order_by",
    "create_time",
    "update_time",
  ])
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "UsrModel")]
#[allow(dead_code)]
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
  #[graphql(name = "img")]
  pub img: String,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: String,
  /// 用户名
  #[graphql(name = "username")]
  pub username: String,
  /// 密码
  #[graphql(name = "password")]
  pub password: String,
  /// 所属角色
  #[graphql(name = "role_ids")]
  pub role_ids: Vec<RoleId>,
  /// 所属角色
  #[graphql(name = "role_ids_lbl")]
  pub role_ids_lbl: Vec<String>,
  /// 所属部门
  #[graphql(name = "dept_ids")]
  pub dept_ids: Vec<DeptId>,
  /// 所属部门
  #[graphql(name = "dept_ids_lbl")]
  pub dept_ids_lbl: Vec<String>,
  /// 所属组织
  #[graphql(name = "org_ids")]
  pub org_ids: Vec<OrgId>,
  /// 所属组织
  #[graphql(name = "org_ids_lbl")]
  pub org_ids_lbl: Vec<String>,
  /// 默认组织
  #[graphql(name = "default_org_id")]
  pub default_org_id: OrgId,
  /// 默认组织
  #[graphql(name = "default_org_id_lbl")]
  pub default_org_id_lbl: String,
  /// 类型
  #[graphql(name = "type")]
  pub r#type: UsrType,
  /// 类型
  #[graphql(name = "type_lbl")]
  pub type_lbl: String,
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
    // 所属角色
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
          x.parse::<u32>()
            .map_err(|_| sqlx::Error::Decode(
              Box::new(sqlx::error::Error::Protocol(
                "role_ids_lbl order_by Invalid u32".to_string()
              ))
            ))
        )
        .collect::<Result<_, _>>()?;
      keys.sort();
      keys
        .into_iter()
        .map(|x| 
          role_ids_lbl.get(&x.to_string())
            .map(|x| x.to_owned())
            .unwrap_or_default()
        )
        .collect::<Vec<String>>()
    };
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
          x.parse::<u32>()
            .map_err(|_| sqlx::Error::Decode(
              Box::new(sqlx::error::Error::Protocol(
                "dept_ids_lbl order_by Invalid u32".to_string()
              ))
            ))
        )
        .collect::<Result<_, _>>()?;
      keys.sort();
      keys
        .into_iter()
        .map(|x| 
          dept_ids_lbl.get(&x.to_string())
            .map(|x| x.to_owned())
            .unwrap_or_default()
        )
        .collect::<Vec<String>>()
    };
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
          x.parse::<u32>()
            .map_err(|_| sqlx::Error::Decode(
              Box::new(sqlx::error::Error::Protocol(
                "org_ids_lbl order_by Invalid u32".to_string()
              ))
            ))
        )
        .collect::<Result<_, _>>()?;
      keys.sort();
      keys
        .into_iter()
        .map(|x| 
          org_ids_lbl.get(&x.to_string())
            .map(|x| x.to_owned())
            .unwrap_or_default()
        )
        .collect::<Vec<String>>()
    };
    // 默认组织
    let default_org_id: OrgId = row.try_get("default_org_id")?;
    let default_org_id_lbl: Option<String> = row.try_get("default_org_id_lbl")?;
    let default_org_id_lbl = default_org_id_lbl.unwrap_or_default();
    // 类型
    let type_lbl: String = row.try_get("type")?;
    let r#type: UsrType = type_lbl.clone().try_into()?;
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
      is_hidden,
      is_deleted,
      id,
      img,
      lbl,
      username,
      password,
      role_ids,
      role_ids_lbl,
      dept_ids,
      dept_ids_lbl,
      org_ids,
      org_ids_lbl,
      default_org_id,
      default_org_id_lbl,
      r#type,
      type_lbl,
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
#[allow(dead_code)]
pub struct UsrFieldComment {
  /// ID
  #[graphql(name = "id")]
  pub id: String,
  /// 头像
  #[graphql(name = "img")]
  pub img: String,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: String,
  /// 用户名
  #[graphql(name = "username")]
  pub username: String,
  /// 所属角色
  #[graphql(name = "role_ids")]
  pub role_ids: String,
  /// 所属角色
  #[graphql(name = "role_ids_lbl")]
  pub role_ids_lbl: String,
  /// 所属部门
  #[graphql(name = "dept_ids")]
  pub dept_ids: String,
  /// 所属部门
  #[graphql(name = "dept_ids_lbl")]
  pub dept_ids_lbl: String,
  /// 所属组织
  #[graphql(name = "org_ids")]
  pub org_ids: String,
  /// 所属组织
  #[graphql(name = "org_ids_lbl")]
  pub org_ids_lbl: String,
  /// 默认组织
  #[graphql(name = "default_org_id")]
  pub default_org_id: String,
  /// 默认组织
  #[graphql(name = "default_org_id_lbl")]
  pub default_org_id_lbl: String,
  /// 类型
  #[graphql(name = "type")]
  pub r#type: String,
  /// 类型
  #[graphql(name = "type_lbl")]
  pub type_lbl: String,
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
#[graphql(rename_fields = "snake_case")]
#[allow(dead_code)]
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
  #[graphql(skip)]
  pub img: Option<String>,
  /// 头像
  #[graphql(skip)]
  pub img_like: Option<String>,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: Option<String>,
  /// 名称
  #[graphql(name = "lbl_like")]
  pub lbl_like: Option<String>,
  /// 用户名
  #[graphql(name = "username")]
  pub username: Option<String>,
  /// 用户名
  #[graphql(name = "username_like")]
  pub username_like: Option<String>,
  /// 密码
  #[graphql(skip)]
  pub password: Option<String>,
  /// 密码
  #[graphql(skip)]
  pub password_like: Option<String>,
  /// 所属角色
  #[graphql(name = "role_ids")]
  pub role_ids: Option<Vec<RoleId>>,
  /// 所属角色
  #[graphql(name = "role_ids_save_null")]
  pub role_ids_is_null: Option<bool>,
  /// 所属角色
  #[graphql(name = "role_codes")]
  pub role_codes: Option<Vec<String>>,
  /// 所属部门
  #[graphql(name = "dept_ids")]
  pub dept_ids: Option<Vec<DeptId>>,
  /// 所属部门
  #[graphql(name = "dept_ids_save_null")]
  pub dept_ids_is_null: Option<bool>,
  /// 所属组织
  #[graphql(name = "org_ids")]
  pub org_ids: Option<Vec<OrgId>>,
  /// 所属组织
  #[graphql(name = "org_ids_save_null")]
  pub org_ids_is_null: Option<bool>,
  /// 默认组织
  #[graphql(name = "default_org_id")]
  pub default_org_id: Option<Vec<OrgId>>,
  /// 默认组织
  #[graphql(name = "default_org_id_save_null")]
  pub default_org_id_is_null: Option<bool>,
  /// 默认组织
  #[graphql(name = "default_org_id_lbl")]
  pub default_org_id_lbl: Option<Vec<String>>,
  /// 默认组织
  #[graphql(name = "default_org_id_lbl_like")]
  pub default_org_id_lbl_like: Option<String>,
  /// 类型
  #[graphql(skip)]
  pub r#type: Option<Vec<UsrType>>,
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
  #[graphql(skip)]
  pub rem: Option<String>,
  /// 备注
  #[graphql(skip)]
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

impl std::fmt::Debug for UsrSearch {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("UsrSearch");
    if let Some(ref id) = self.id {
      item = item.field("id", id);
    }
    if let Some(ref ids) = self.ids {
      item = item.field("ids", ids);
    }
    if let Some(ref tenant_id) = self.tenant_id {
      item = item.field("tenant_id", tenant_id);
    }
    if let Some(ref is_hidden) = self.is_hidden {
      item = item.field("is_hidden", is_hidden);
    }
    if let Some(ref is_deleted) = self.is_deleted {
      if *is_deleted == 1 {
        item = item.field("is_deleted", is_deleted);
      }
    }
    // 头像
    if let Some(ref img) = self.img {
      item = item.field("img", img);
    }
    if let Some(ref img_like) = self.img_like {
      item = item.field("img_like", img_like);
    }
    // 名称
    if let Some(ref lbl) = self.lbl {
      item = item.field("lbl", lbl);
    }
    if let Some(ref lbl_like) = self.lbl_like {
      item = item.field("lbl_like", lbl_like);
    }
    // 用户名
    if let Some(ref username) = self.username {
      item = item.field("username", username);
    }
    if let Some(ref username_like) = self.username_like {
      item = item.field("username_like", username_like);
    }
    // 密码
    if let Some(ref password) = self.password {
      item = item.field("password", password);
    }
    if let Some(ref password_like) = self.password_like {
      item = item.field("password_like", password_like);
    }
    // 所属角色
    if let Some(ref role_ids) = self.role_ids {
      item = item.field("role_ids", role_ids);
    }
    // 所属部门
    if let Some(ref dept_ids) = self.dept_ids {
      item = item.field("dept_ids", dept_ids);
    }
    // 所属组织
    if let Some(ref org_ids) = self.org_ids {
      item = item.field("org_ids", org_ids);
    }
    // 默认组织
    if let Some(ref default_org_id) = self.default_org_id {
      item = item.field("default_org_id", default_org_id);
    }
    if let Some(ref default_org_id_is_null) = self.default_org_id_is_null {
      item = item.field("default_org_id_is_null", default_org_id_is_null);
    }
    // 类型
    if let Some(ref r#type) = self.r#type {
      item = item.field("r#type", r#type);
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
#[graphql(rename_fields = "snake_case", name = "UsrInput")]
#[allow(dead_code)]
pub struct UsrInput {
  /// ID
  pub id: Option<UsrId>,
  /// 已删除
  #[graphql(skip)]
  pub is_deleted: Option<u8>,
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  /// 隐藏字段
  #[graphql(skip)]
  pub is_hidden: Option<u8>,
  /// 头像
  #[graphql(name = "img")]
  pub img: Option<String>,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: Option<String>,
  /// 用户名
  #[graphql(name = "username")]
  pub username: Option<String>,
  /// 密码
  #[graphql(name = "password")]
  pub password: Option<String>,
  /// 所属角色
  #[graphql(name = "role_ids")]
  pub role_ids: Option<Vec<RoleId>>,
  /// 所属角色
  #[graphql(name = "role_ids_lbl")]
  pub role_ids_lbl: Option<Vec<String>>,
  /// 所属部门
  #[graphql(name = "dept_ids")]
  pub dept_ids: Option<Vec<DeptId>>,
  /// 所属部门
  #[graphql(name = "dept_ids_lbl")]
  pub dept_ids_lbl: Option<Vec<String>>,
  /// 所属组织
  #[graphql(name = "org_ids")]
  pub org_ids: Option<Vec<OrgId>>,
  /// 所属组织
  #[graphql(name = "org_ids_lbl")]
  pub org_ids_lbl: Option<Vec<String>>,
  /// 默认组织
  #[graphql(name = "default_org_id")]
  pub default_org_id: Option<OrgId>,
  /// 默认组织
  #[graphql(name = "default_org_id_lbl")]
  pub default_org_id_lbl: Option<String>,
  /// 类型
  #[graphql(name = "type")]
  pub r#type: Option<UsrType>,
  /// 类型
  #[graphql(name = "type_lbl")]
  pub type_lbl: Option<String>,
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
      // 所属角色
      role_ids: model.role_ids.into(),
      role_ids_lbl: model.role_ids_lbl.into(),
      // 所属部门
      dept_ids: model.dept_ids.into(),
      dept_ids_lbl: model.dept_ids_lbl.into(),
      // 所属组织
      org_ids: model.org_ids.into(),
      org_ids_lbl: model.org_ids_lbl.into(),
      // 默认组织
      default_org_id: model.default_org_id.into(),
      default_org_id_lbl: model.default_org_id_lbl.into(),
      // 类型
      r#type: model.r#type.into(),
      type_lbl: model.type_lbl.into(),
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
      // 所属角色
      role_ids: input.role_ids,
      // 所属部门
      dept_ids: input.dept_ids,
      // 所属组织
      org_ids: input.org_ids,
      // 默认组织
      default_org_id: input.default_org_id.map(|x| vec![x]),
      // 类型
      r#type: input.r#type.map(|x| vec![x]),
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
  fn encode_by_ref(&self, buf: &mut Vec<u8>) -> sqlx::Result<IsNull, BoxDynError> {
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
    value: MySqlValueRef<'r>,
  ) -> Result<Self, BoxDynError> {
    <&str as sqlx::Decode<MySql>>::decode(value).map(Self::from)
  }
}

impl PartialEq<str> for UsrId {
  fn eq(&self, other: &str) -> bool {
    self.0 == other
  }
}

/// 用户类型
#[derive(Enum, Copy, Clone, Default, Eq, PartialEq, Serialize, Deserialize, Debug)]
pub enum UsrType {
  /// 登录用户
  #[default]
  #[graphql(name="login")]
  Login,
  /// 第三方接口
  #[graphql(name="api")]
  Api,
}

impl fmt::Display for UsrType {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    match self {
      Self::Login => write!(f, "login"),
      Self::Api => write!(f, "api"),
    }
  }
}

impl From<UsrType> for SmolStr {
  fn from(value: UsrType) -> Self {
    match value {
      UsrType::Login => "login".into(),
      UsrType::Api => "api".into(),
    }
  }
}

impl From<UsrType> for String {
  fn from(value: UsrType) -> Self {
    match value {
      UsrType::Login => "login".into(),
      UsrType::Api => "api".into(),
    }
  }
}

impl From<UsrType> for ArgType {
  fn from(value: UsrType) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl FromStr for UsrType {
  type Err = color_eyre::eyre::Error;
  
  fn from_str(s: &str) -> Result<Self, Self::Err> {
    match s {
      "login" => Ok(Self::Login),
      "api" => Ok(Self::Api),
      _ => Err(eyre!("UsrType can't convert from {s}")),
    }
  }
}

impl UsrType {
  pub fn as_str(&self) -> &str {
    match self {
      Self::Login => "login",
      Self::Api => "api",
    }
  }
}

impl TryFrom<String> for UsrType {
  type Error = sqlx::Error;
  
  fn try_from(s: String) -> Result<Self, sqlx::Error> {
    match s.as_str() {
      "login" => Ok(Self::Login),
      "api" => Ok(Self::Api),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "type".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "UsrType can't convert from {s}".to_owned(),
          )),
        }),
      )),
    }
  }
}

/// 用户 检测字段是否允许前端排序
pub fn check_sort_usr(
  sort: Option<&[SortInput]>,
) -> Result<()> {
  
  if sort.is_none() {
    return Ok(());
  }
  let sort = sort.unwrap();
  
  let get_can_sort_in_api_usr = get_can_sort_in_api_usr();
  
  for item in sort {
    let prop = item.prop.as_str();
    if prop.is_empty() {
      continue;
    }
    if !get_can_sort_in_api_usr.contains(&prop) {
      return Err(eyre!("check_sort_usr: {}", serde_json::to_string(item)?));
    }
  }
  
  Ok(())
}

/// 获取路由地址
#[allow(dead_code)]
pub fn get_route_path_usr() -> String {
  "/base/usr".to_owned()
}
