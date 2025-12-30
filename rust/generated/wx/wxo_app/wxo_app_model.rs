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
use crate::base::domain::domain_model::DomainId;
use crate::base::usr::usr_model::UsrId;
use crate::base::role::role_model::RoleId;

static CAN_SORT_IN_API_WXO_APP: OnceLock<[&'static str; 3]> = OnceLock::new();

/// 公众号设置 前端允许排序的字段
fn get_can_sort_in_api_wxo_app() -> &'static [&'static str; 3] {
  CAN_SORT_IN_API_WXO_APP.get_or_init(|| [
    "order_by",
    "create_time",
    "update_time",
  ])
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "WxoAppModel")]
#[allow(dead_code)]
pub struct WxoAppModel {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: TenantId,
  /// ID
  pub id: WxoAppId,
  /// 原始ID
  #[graphql(name = "code")]
  pub code: String,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: String,
  /// 开发者ID
  #[graphql(name = "appid")]
  pub appid: String,
  /// 开发者密码
  #[graphql(name = "appsecret")]
  pub appsecret: String,
  /// 令牌
  #[graphql(name = "token")]
  pub token: String,
  /// 消息加解密密钥
  #[graphql(name = "encoding_aes_key")]
  pub encoding_aes_key: String,
  /// 消息加解密方式
  #[graphql(name = "encoding_type")]
  pub encoding_type: WxoAppEncodingType,
  /// 消息加解密方式
  #[graphql(name = "encoding_type_lbl")]
  pub encoding_type_lbl: String,
  /// 授权作用域
  #[graphql(name = "scope")]
  pub scope: WxoAppScope,
  /// 授权作用域
  #[graphql(name = "scope_lbl")]
  pub scope_lbl: String,
  /// 网页授权域名
  #[graphql(name = "domain_id")]
  pub domain_id: DomainId,
  /// 网页授权域名
  #[graphql(name = "domain_id_lbl")]
  pub domain_id_lbl: String,
  /// 默认角色
  #[graphql(name = "default_role_codes")]
  pub default_role_codes: String,
  /// 默认角色
  #[graphql(name = "default_role_ids")]
  pub default_role_ids: Vec<RoleId>,
  /// 默认角色
  #[graphql(name = "default_role_ids_lbl")]
  pub default_role_ids_lbl: String,
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

impl FromRow<'_, MySqlRow> for WxoAppModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;
    // ID
    let id: WxoAppId = row.try_get("id")?;
    // 原始ID
    let code: String = row.try_get("code")?;
    // 名称
    let lbl: String = row.try_get("lbl")?;
    // 开发者ID
    let appid: String = row.try_get("appid")?;
    // 开发者密码
    let appsecret: String = row.try_get("appsecret")?;
    // 令牌
    let token: String = row.try_get("token")?;
    // 消息加解密密钥
    let encoding_aes_key: String = row.try_get("encoding_aes_key")?;
    // 消息加解密方式
    let encoding_type_lbl: String = row.try_get("encoding_type")?;
    let encoding_type: WxoAppEncodingType = encoding_type_lbl.clone().try_into()?;
    // 授权作用域
    let scope_lbl: String = row.try_get("scope")?;
    let scope: WxoAppScope = scope_lbl.clone().try_into()?;
    // 网页授权域名
    let domain_id: DomainId = row.try_get("domain_id")?;
    let domain_id_lbl: Option<String> = row.try_get("domain_id_lbl")?;
    let domain_id_lbl = domain_id_lbl.unwrap_or_default();
    // 默认角色
    let default_role_codes: String = row.try_get("default_role_codes")?;
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
      is_deleted,
      id,
      code,
      lbl,
      appid,
      appsecret,
      token,
      encoding_aes_key,
      encoding_type,
      encoding_type_lbl,
      scope,
      scope_lbl,
      domain_id,
      domain_id_lbl,
      default_role_codes,
      default_role_ids: vec![],
      default_role_ids_lbl: String::new(),
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
#[graphql(rename_fields = "snake_case", name = "WxoAppFieldComment")]
#[allow(dead_code)]
pub struct WxoAppFieldComment {
  /// ID
  #[graphql(name = "id")]
  pub id: String,
  /// 原始ID
  #[graphql(name = "code")]
  pub code: String,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: String,
  /// 开发者ID
  #[graphql(name = "appid")]
  pub appid: String,
  /// 开发者密码
  #[graphql(name = "appsecret")]
  pub appsecret: String,
  /// 令牌
  #[graphql(name = "token")]
  pub token: String,
  /// 消息加解密密钥
  #[graphql(name = "encoding_aes_key")]
  pub encoding_aes_key: String,
  /// 消息加解密方式
  #[graphql(name = "encoding_type")]
  pub encoding_type: String,
  /// 消息加解密方式
  #[graphql(name = "encoding_type_lbl")]
  pub encoding_type_lbl: String,
  /// 授权作用域
  #[graphql(name = "scope")]
  pub scope: String,
  /// 授权作用域
  #[graphql(name = "scope_lbl")]
  pub scope_lbl: String,
  /// 网页授权域名
  #[graphql(name = "domain_id")]
  pub domain_id: String,
  /// 网页授权域名
  #[graphql(name = "domain_id_lbl")]
  pub domain_id_lbl: String,
  /// 默认角色
  #[graphql(name = "default_role_codes")]
  pub default_role_codes: String,
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
#[graphql(rename_fields = "snake_case", name = "WxoAppSearch")]
#[allow(dead_code)]
pub struct WxoAppSearch {
  /// ID
  pub id: Option<WxoAppId>,
  /// ID列表
  pub ids: Option<Vec<WxoAppId>>,
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  pub is_deleted: Option<u8>,
  /// 原始ID
  #[graphql(name = "code")]
  pub code: Option<String>,
  /// 原始ID
  #[graphql(name = "code_like")]
  pub code_like: Option<String>,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: Option<String>,
  /// 名称
  #[graphql(name = "lbl_like")]
  pub lbl_like: Option<String>,
  /// 开发者ID
  #[graphql(name = "appid")]
  pub appid: Option<String>,
  /// 开发者ID
  #[graphql(name = "appid_like")]
  pub appid_like: Option<String>,
  /// 开发者密码
  #[graphql(skip)]
  pub appsecret: Option<String>,
  /// 开发者密码
  #[graphql(skip)]
  pub appsecret_like: Option<String>,
  /// 令牌
  #[graphql(skip)]
  pub token: Option<String>,
  /// 令牌
  #[graphql(skip)]
  pub token_like: Option<String>,
  /// 消息加解密密钥
  #[graphql(skip)]
  pub encoding_aes_key: Option<String>,
  /// 消息加解密密钥
  #[graphql(skip)]
  pub encoding_aes_key_like: Option<String>,
  /// 消息加解密方式
  #[graphql(skip)]
  pub encoding_type: Option<Vec<WxoAppEncodingType>>,
  /// 授权作用域
  #[graphql(skip)]
  pub scope: Option<Vec<WxoAppScope>>,
  /// 网页授权域名
  #[graphql(name = "domain_id")]
  pub domain_id: Option<Vec<DomainId>>,
  /// 网页授权域名
  #[graphql(name = "domain_id_save_null")]
  pub domain_id_is_null: Option<bool>,
  /// 网页授权域名
  #[graphql(name = "domain_id_lbl")]
  pub domain_id_lbl: Option<Vec<String>>,
  /// 网页授权域名
  #[graphql(name = "domain_id_lbl_like")]
  pub domain_id_lbl_like: Option<String>,
  /// 默认角色
  #[graphql(skip)]
  pub default_role_codes: Option<String>,
  /// 默认角色
  #[graphql(skip)]
  pub default_role_codes_like: Option<String>,
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

impl std::fmt::Debug for WxoAppSearch {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("WxoAppSearch");
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
    // 令牌
    if let Some(ref token) = self.token {
      item = item.field("token", token);
    }
    if let Some(ref token_like) = self.token_like {
      item = item.field("token_like", token_like);
    }
    // 消息加解密密钥
    if let Some(ref encoding_aes_key) = self.encoding_aes_key {
      item = item.field("encoding_aes_key", encoding_aes_key);
    }
    if let Some(ref encoding_aes_key_like) = self.encoding_aes_key_like {
      item = item.field("encoding_aes_key_like", encoding_aes_key_like);
    }
    // 消息加解密方式
    if let Some(ref encoding_type) = self.encoding_type {
      item = item.field("encoding_type", encoding_type);
    }
    // 授权作用域
    if let Some(ref scope) = self.scope {
      item = item.field("scope", scope);
    }
    // 网页授权域名
    if let Some(ref domain_id) = self.domain_id {
      item = item.field("domain_id", domain_id);
    }
    if let Some(ref domain_id_lbl) = self.domain_id_lbl {
      item = item.field("domain_id_lbl", domain_id_lbl);
    }
    if let Some(ref domain_id_lbl_like) = self.domain_id_lbl_like {
      item = item.field("domain_id_lbl_like", domain_id_lbl_like);
    }
    if let Some(ref domain_id_is_null) = self.domain_id_is_null {
      item = item.field("domain_id_is_null", domain_id_is_null);
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

#[derive(InputObject, Serialize, Deserialize, Default, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "WxoAppInput")]
#[allow(dead_code)]
pub struct WxoAppInput {
  /// ID
  pub id: Option<WxoAppId>,
  /// 已删除
  #[graphql(skip)]
  pub is_deleted: Option<u8>,
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  /// 原始ID
  #[graphql(name = "code")]
  pub code: Option<String>,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: Option<String>,
  /// 开发者ID
  #[graphql(name = "appid")]
  pub appid: Option<String>,
  /// 开发者密码
  #[graphql(name = "appsecret")]
  pub appsecret: Option<String>,
  /// 令牌
  #[graphql(name = "token")]
  pub token: Option<String>,
  /// 消息加解密密钥
  #[graphql(name = "encoding_aes_key")]
  pub encoding_aes_key: Option<String>,
  /// 消息加解密方式
  #[graphql(name = "encoding_type")]
  pub encoding_type: Option<WxoAppEncodingType>,
  /// 消息加解密方式
  #[graphql(name = "encoding_type_lbl")]
  pub encoding_type_lbl: Option<String>,
  /// 授权作用域
  #[graphql(name = "scope")]
  pub scope: Option<WxoAppScope>,
  /// 授权作用域
  #[graphql(name = "scope_lbl")]
  pub scope_lbl: Option<String>,
  /// 网页授权域名
  #[graphql(name = "domain_id")]
  pub domain_id: Option<DomainId>,
  /// 网页授权域名
  #[graphql(name = "domain_id_lbl")]
  pub domain_id_lbl: Option<String>,
  /// 默认角色
  #[graphql(name = "default_role_codes")]
  pub default_role_codes: Option<String>,
  /// 默认角色
  #[graphql(name = "default_role_ids")]
  pub default_role_ids: Option<Vec<RoleId>>,
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

impl From<WxoAppModel> for WxoAppInput {
  fn from(model: WxoAppModel) -> Self {
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
      // 令牌
      token: model.token.into(),
      // 消息加解密密钥
      encoding_aes_key: model.encoding_aes_key.into(),
      // 消息加解密方式
      encoding_type: model.encoding_type.into(),
      encoding_type_lbl: model.encoding_type_lbl.into(),
      // 授权作用域
      scope: model.scope.into(),
      scope_lbl: model.scope_lbl.into(),
      // 网页授权域名
      domain_id: model.domain_id.into(),
      domain_id_lbl: model.domain_id_lbl.into(),
      // 默认角色
      default_role_codes: model.default_role_codes.into(),
      default_role_ids: Some(Vec::<RoleId>::new()),
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

impl From<WxoAppInput> for WxoAppSearch {
  fn from(input: WxoAppInput) -> Self {
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
      // 令牌
      token: input.token,
      // 消息加解密密钥
      encoding_aes_key: input.encoding_aes_key,
      // 消息加解密方式
      encoding_type: input.encoding_type.map(|x| vec![x]),
      // 授权作用域
      scope: input.scope.map(|x| vec![x]),
      // 网页授权域名
      domain_id: input.domain_id.map(|x| vec![x]),
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

impl_id!(WxoAppId);

/// 公众号设置消息加解密方式
#[derive(Enum, Copy, Clone, Default, Eq, PartialEq, Serialize, Deserialize, Debug)]
pub enum WxoAppEncodingType {
  /// 明文模式
  #[default]
  #[graphql(name="plaintext")]
  Plaintext,
  /// 兼容模式
  #[graphql(name="compatible")]
  Compatible,
  /// 安全模式
  #[graphql(name="safe")]
  Safe,
}

impl fmt::Display for WxoAppEncodingType {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    match self {
      Self::Plaintext => write!(f, "plaintext"),
      Self::Compatible => write!(f, "compatible"),
      Self::Safe => write!(f, "safe"),
    }
  }
}

impl From<WxoAppEncodingType> for SmolStr {
  fn from(value: WxoAppEncodingType) -> Self {
    match value {
      WxoAppEncodingType::Plaintext => "plaintext".into(),
      WxoAppEncodingType::Compatible => "compatible".into(),
      WxoAppEncodingType::Safe => "safe".into(),
    }
  }
}

impl From<WxoAppEncodingType> for String {
  fn from(value: WxoAppEncodingType) -> Self {
    match value {
      WxoAppEncodingType::Plaintext => "plaintext".into(),
      WxoAppEncodingType::Compatible => "compatible".into(),
      WxoAppEncodingType::Safe => "safe".into(),
    }
  }
}

impl From<WxoAppEncodingType> for ArgType {
  fn from(value: WxoAppEncodingType) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl FromStr for WxoAppEncodingType {
  type Err = color_eyre::eyre::Error;
  
  fn from_str(s: &str) -> Result<Self, Self::Err> {
    match s {
      "plaintext" => Ok(Self::Plaintext),
      "compatible" => Ok(Self::Compatible),
      "safe" => Ok(Self::Safe),
      _ => Err(eyre!("WxoAppEncodingType can't convert from {s}")),
    }
  }
}

impl WxoAppEncodingType {
  pub fn as_str(&self) -> &str {
    match self {
      Self::Plaintext => "plaintext",
      Self::Compatible => "compatible",
      Self::Safe => "safe",
    }
  }
}

impl TryFrom<String> for WxoAppEncodingType {
  type Error = sqlx::Error;
  
  fn try_from(s: String) -> Result<Self, sqlx::Error> {
    match s.as_str() {
      "plaintext" => Ok(Self::Plaintext),
      "compatible" => Ok(Self::Compatible),
      "safe" => Ok(Self::Safe),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "encoding_type".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "WxoAppEncodingType can't convert from {s}".to_owned(),
          )),
        }),
      )),
    }
  }
}

/// 公众号设置授权作用域
#[derive(Enum, Copy, Clone, Default, Eq, PartialEq, Serialize, Deserialize, Debug)]
pub enum WxoAppScope {
  /// 静默模式
  #[default]
  #[graphql(name="snsapi_base")]
  SnsapiBase,
  /// 授权模式
  #[graphql(name="snsapi_userinfo")]
  SnsapiUserinfo,
}

impl fmt::Display for WxoAppScope {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    match self {
      Self::SnsapiBase => write!(f, "snsapi_base"),
      Self::SnsapiUserinfo => write!(f, "snsapi_userinfo"),
    }
  }
}

impl From<WxoAppScope> for SmolStr {
  fn from(value: WxoAppScope) -> Self {
    match value {
      WxoAppScope::SnsapiBase => "snsapi_base".into(),
      WxoAppScope::SnsapiUserinfo => "snsapi_userinfo".into(),
    }
  }
}

impl From<WxoAppScope> for String {
  fn from(value: WxoAppScope) -> Self {
    match value {
      WxoAppScope::SnsapiBase => "snsapi_base".into(),
      WxoAppScope::SnsapiUserinfo => "snsapi_userinfo".into(),
    }
  }
}

impl From<WxoAppScope> for ArgType {
  fn from(value: WxoAppScope) -> Self {
    ArgType::SmolStr(value.into())
  }
}

impl FromStr for WxoAppScope {
  type Err = color_eyre::eyre::Error;
  
  fn from_str(s: &str) -> Result<Self, Self::Err> {
    match s {
      "snsapi_base" => Ok(Self::SnsapiBase),
      "snsapi_userinfo" => Ok(Self::SnsapiUserinfo),
      _ => Err(eyre!("WxoAppScope can't convert from {s}")),
    }
  }
}

impl WxoAppScope {
  pub fn as_str(&self) -> &str {
    match self {
      Self::SnsapiBase => "snsapi_base",
      Self::SnsapiUserinfo => "snsapi_userinfo",
    }
  }
}

impl TryFrom<String> for WxoAppScope {
  type Error = sqlx::Error;
  
  fn try_from(s: String) -> Result<Self, sqlx::Error> {
    match s.as_str() {
      "snsapi_base" => Ok(Self::SnsapiBase),
      "snsapi_userinfo" => Ok(Self::SnsapiUserinfo),
      _ => Err(sqlx::Error::Decode(
        Box::new(sqlx::Error::ColumnDecode {
          index: "scope".to_owned(),
          source: Box::new(sqlx::Error::Protocol(
            "WxoAppScope can't convert from {s}".to_owned(),
          )),
        }),
      )),
    }
  }
}

/// 公众号设置 检测字段是否允许前端排序
pub fn check_sort_wxo_app(
  sort: Option<&[SortInput]>,
) -> Result<()> {
  
  if sort.is_none() {
    return Ok(());
  }
  let sort = sort.unwrap();
  
  let get_can_sort_in_api_wxo_app = get_can_sort_in_api_wxo_app();
  
  for item in sort {
    let prop = item.prop.as_str();
    if prop.is_empty() {
      continue;
    }
    if !get_can_sort_in_api_wxo_app.contains(&prop) {
      return Err(eyre!("check_sort_wxo_app: {}", serde_json::to_string(item)?));
    }
  }
  
  Ok(())
}

// MARK: get_page_path_wxo_app
pub fn get_page_path_wxo_app() -> &'static str {
  "/wx/wxo_app"
}

// MARK: get_table_name_wxo_app
pub fn get_table_name_wxo_app() -> &'static str {
  "wx_wxo_app"
}
