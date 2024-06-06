
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
use crate::gen::base::role::role_model::RoleId;
use crate::gen::base::dept::dept_model::DeptId;
use crate::gen::base::org::org_model::OrgId;

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "UsrModel")]
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
pub struct UsrFieldComment {
  /// ID
  pub id: String,
  /// 头像
  pub img: String,
  /// 名称
  pub lbl: String,
  /// 用户名
  pub username: String,
  /// 所属角色
  pub role_ids: String,
  /// 所属角色
  pub role_ids_lbl: String,
  /// 所属部门
  pub dept_ids: String,
  /// 所属部门
  pub dept_ids_lbl: String,
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

#[derive(InputObject, Default)]
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
pub struct UsrInput {
  /// ID
  pub id: Option<UsrId>,
  /// 删除
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

impl PartialEq<str> for UsrId {
  fn eq(&self, other: &str) -> bool {
    self.0 == other
  }
}
