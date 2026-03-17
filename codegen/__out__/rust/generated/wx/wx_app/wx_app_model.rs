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
use crate::common::exceptions::service_exception::ServiceException;

use crate::base::tenant::tenant_model::TenantId;
use crate::base::usr::usr_model::UsrId;

static CAN_SORT_IN_API_WX_APP: [&str; 3] = [
  "order_by",
  "create_time",
  "update_time",
];

/// 小程序设置 前端允许排序的字段
fn get_can_sort_in_api_wx_app() -> &'static [&'static str; 3] {
  &CAN_SORT_IN_API_WX_APP
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "WxAppModel")]
#[allow(dead_code)]
pub struct WxAppModel {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: TenantId,
  /// ID
  pub id: WxAppId,
  /// 原始ID
  #[graphql(name = "code")]
  pub code: SmolStr,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: SmolStr,
  /// 开发者ID
  #[graphql(name = "appid")]
  pub appid: SmolStr,
  /// 开发者密码
  #[graphql(name = "appsecret")]
  pub appsecret: SmolStr,
  /// 默认角色
  #[graphql(name = "default_role_codes")]
  pub default_role_codes: SmolStr,
  /// 锁定
  #[graphql(name = "is_locked")]
  pub is_locked: u8,
  /// 锁定
  #[graphql(name = "is_locked_lbl")]
  pub is_locked_lbl: SmolStr,
  /// 启用
  #[graphql(name = "is_enabled")]
  pub is_enabled: u8,
  /// 启用
  #[graphql(name = "is_enabled_lbl")]
  pub is_enabled_lbl: SmolStr,
  /// 排序
  #[graphql(name = "order_by")]
  pub order_by: u32,
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

impl FromRow<'_, MySqlRow> for WxAppModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;
    // ID
    let id: WxAppId = row.try_get("id")?;
    // 原始ID
    let code: &str = row.try_get("code")?;
    let code = SmolStr::new(code);
    // 名称
    let lbl: &str = row.try_get("lbl")?;
    let lbl = SmolStr::new(lbl);
    // 开发者ID
    let appid: &str = row.try_get("appid")?;
    let appid = SmolStr::new(appid);
    // 开发者密码
    let appsecret: &str = row.try_get("appsecret")?;
    let appsecret = SmolStr::new(appsecret);
    // 默认角色
    let default_role_codes: &str = row.try_get("default_role_codes")?;
    let default_role_codes = SmolStr::new(default_role_codes);
    // 锁定
    let is_locked: u8 = row.try_get("is_locked")?;
    let is_locked_lbl = SmolStr::new(is_locked.to_string());
    // 启用
    let is_enabled: u8 = row.try_get("is_enabled")?;
    let is_enabled_lbl = SmolStr::new(is_enabled.to_string());
    // 排序
    let order_by: u32 = row.try_get("order_by")?;
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
      code,
      lbl,
      appid,
      appsecret,
      default_role_codes,
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
#[graphql(rename_fields = "snake_case", name = "WxAppFieldComment")]
#[allow(dead_code)]
pub struct WxAppFieldComment {
  /// ID
  #[graphql(name = "id")]
  pub id: SmolStr,
  /// 原始ID
  #[graphql(name = "code")]
  pub code: SmolStr,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: SmolStr,
  /// 开发者ID
  #[graphql(name = "appid")]
  pub appid: SmolStr,
  /// 开发者密码
  #[graphql(name = "appsecret")]
  pub appsecret: SmolStr,
  /// 默认角色
  #[graphql(name = "default_role_codes")]
  pub default_role_codes: SmolStr,
  /// 锁定
  #[graphql(name = "is_locked")]
  pub is_locked: SmolStr,
  /// 锁定
  #[graphql(name = "is_locked_lbl")]
  pub is_locked_lbl: SmolStr,
  /// 启用
  #[graphql(name = "is_enabled")]
  pub is_enabled: SmolStr,
  /// 启用
  #[graphql(name = "is_enabled_lbl")]
  pub is_enabled_lbl: SmolStr,
  /// 排序
  #[graphql(name = "order_by")]
  pub order_by: SmolStr,
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
#[graphql(rename_fields = "snake_case", name = "WxAppSearch")]
#[allow(dead_code)]
pub struct WxAppSearch {
  /// ID
  pub id: Option<WxAppId>,
  /// ID列表
  pub ids: Option<Vec<WxAppId>>,
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  pub is_deleted: Option<u8>,
  /// 原始ID
  #[graphql(name = "code")]
  pub code: Option<SmolStr>,
  /// 原始ID
  #[graphql(name = "code_like")]
  pub code_like: Option<SmolStr>,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: Option<SmolStr>,
  /// 名称
  #[graphql(name = "lbl_like")]
  pub lbl_like: Option<SmolStr>,
  /// 开发者ID
  #[graphql(name = "appid")]
  pub appid: Option<SmolStr>,
  /// 开发者ID
  #[graphql(name = "appid_like")]
  pub appid_like: Option<SmolStr>,
  /// 开发者密码
  #[graphql(skip)]
  pub appsecret: Option<SmolStr>,
  /// 开发者密码
  #[graphql(skip)]
  pub appsecret_like: Option<SmolStr>,
  /// 默认角色
  #[graphql(skip)]
  pub default_role_codes: Option<SmolStr>,
  /// 默认角色
  #[graphql(skip)]
  pub default_role_codes_like: Option<SmolStr>,
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

impl std::fmt::Debug for WxAppSearch {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("WxAppSearch");
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
    // 原始ID
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
    // 开发者ID
    if let Some(ref appid) = self.appid {
      item = item.field("appid", appid);
    }
    if let Some(ref appid_like) = self.appid_like {
      item = item.field("appid_like", appid_like);
    }
    // 开发者密码
    if let Some(ref appsecret) = self.appsecret {
      item = item.field("appsecret", appsecret);
    }
    if let Some(ref appsecret_like) = self.appsecret_like {
      item = item.field("appsecret_like", appsecret_like);
    }
    // 默认角色
    if let Some(ref default_role_codes) = self.default_role_codes {
      item = item.field("default_role_codes", default_role_codes);
    }
    if let Some(ref default_role_codes_like) = self.default_role_codes_like {
      item = item.field("default_role_codes_like", default_role_codes_like);
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

#[derive(InputObject, Serialize, Deserialize, Default, Clone)]
#[graphql(rename_fields = "snake_case", name = "WxAppInput")]
#[allow(dead_code)]
pub struct WxAppInput {
  /// ID
  pub id: Option<WxAppId>,
  /// 已删除
  #[graphql(skip)]
  pub is_deleted: Option<u8>,
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  /// 原始ID
  #[graphql(name = "code")]
  pub code: Option<SmolStr>,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: Option<SmolStr>,
  /// 开发者ID
  #[graphql(name = "appid")]
  pub appid: Option<SmolStr>,
  /// 开发者密码
  #[graphql(name = "appsecret")]
  pub appsecret: Option<SmolStr>,
  /// 默认角色
  #[graphql(name = "default_role_codes")]
  pub default_role_codes: Option<SmolStr>,
  /// 锁定
  #[graphql(name = "is_locked")]
  pub is_locked: Option<u8>,
  /// 锁定
  #[graphql(name = "is_locked_lbl")]
  pub is_locked_lbl: Option<SmolStr>,
  /// 启用
  #[graphql(name = "is_enabled")]
  pub is_enabled: Option<u8>,
  /// 启用
  #[graphql(name = "is_enabled_lbl")]
  pub is_enabled_lbl: Option<SmolStr>,
  /// 排序
  #[graphql(name = "order_by")]
  pub order_by: Option<u32>,
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

impl std::fmt::Debug for WxAppInput {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("WxAppInput");
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
    if let Some(ref code) = self.code {
      item = item.field("code", code);
    }
    if let Some(ref lbl) = self.lbl {
      item = item.field("lbl", lbl);
    }
    if let Some(ref appid) = self.appid {
      item = item.field("appid", appid);
    }
    if let Some(ref appsecret) = self.appsecret {
      item = item.field("appsecret", appsecret);
    }
    if let Some(ref default_role_codes) = self.default_role_codes {
      item = item.field("default_role_codes", default_role_codes);
    }
    if let Some(ref is_locked) = self.is_locked {
      item = item.field("is_locked", is_locked);
    }
    if let Some(ref is_enabled) = self.is_enabled {
      item = item.field("is_enabled", is_enabled);
    }
    if let Some(ref order_by) = self.order_by {
      item = item.field("order_by", order_by);
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

impl From<WxAppModel> for WxAppInput {
  fn from(model: WxAppModel) -> Self {
    Self {
      id: model.id.into(),
      is_deleted: model.is_deleted.into(),
      tenant_id: model.tenant_id.into(),
      // 原始ID
      code: model.code.into(),
      // 名称
      lbl: model.lbl.into(),
      // 开发者ID
      appid: model.appid.into(),
      // 开发者密码
      appsecret: model.appsecret.into(),
      // 默认角色
      default_role_codes: model.default_role_codes.into(),
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

impl From<WxAppInput> for WxAppSearch {
  fn from(input: WxAppInput) -> Self {
    Self {
      id: input.id,
      ids: None,
      // 租户ID
      tenant_id: input.tenant_id,
      is_deleted: None,
      // 原始ID
      code: input.code,
      // 名称
      lbl: input.lbl,
      // 开发者ID
      appid: input.appid,
      // 开发者密码
      appsecret: input.appsecret,
      // 默认角色
      default_role_codes: input.default_role_codes,
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

impl_id!(WxAppId);

/// 小程序设置 检测字段是否允许前端排序
pub fn check_sort_wx_app(
  sort: Option<&[SortInput]>,
) -> Result<()> {
  
  if sort.is_none() {
    return Ok(());
  }
  
  let sort = sort.unwrap_or_default();
  
  if sort.is_empty() {
    return Ok(());
  }
  
  let get_can_sort_in_api_wx_app = get_can_sort_in_api_wx_app();
  
  for item in sort {
    let prop = item.prop.as_str();
    if prop.is_empty() {
      continue;
    }
    if !get_can_sort_in_api_wx_app.contains(&prop) {
      return Err(eyre!(ServiceException {
        message: format!("check_sort_wx_app: {}", serde_json::to_string(item)?).into(),
        trace: true,
        ..Default::default()
      }));
    }
  }
  
  Ok(())
}

// MARK: get_page_path_wx_app
pub fn get_page_path_wx_app() -> &'static str {
  "/wx/wx_app"
}

// MARK: get_table_name_wx_app
pub fn get_table_name_wx_app() -> &'static str {
  "wx_wx_app"
}
