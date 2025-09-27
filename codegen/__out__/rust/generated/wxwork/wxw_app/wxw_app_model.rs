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

use crate::common::util::dao::decrypt;

use crate::base::tenant::tenant_model::TenantId;
use crate::base::domain::domain_model::DomainId;
use crate::base::usr::usr_model::UsrId;

static CAN_SORT_IN_API_WXW_APP: OnceLock<[&'static str; 3]> = OnceLock::new();

/// 企微应用 前端允许排序的字段
fn get_can_sort_in_api_wxw_app() -> &'static [&'static str; 3] {
  CAN_SORT_IN_API_WXW_APP.get_or_init(|| [
    "order_by",
    "create_time",
    "update_time",
  ])
}

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone, Debug)]
#[graphql(rename_fields = "snake_case", name = "WxwAppModel")]
#[allow(dead_code)]
pub struct WxwAppModel {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: TenantId,
  /// ID
  pub id: WxwAppId,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: String,
  /// 企业ID
  #[graphql(name = "corpid")]
  pub corpid: String,
  /// 应用ID
  #[graphql(name = "agentid")]
  pub agentid: String,
  /// 可信域名
  #[graphql(name = "domain_id")]
  pub domain_id: DomainId,
  /// 可信域名
  #[graphql(name = "domain_id_lbl")]
  pub domain_id_lbl: String,
  /// 应用密钥
  #[graphql(name = "corpsecret")]
  pub corpsecret: String,
  /// 通讯录密钥
  #[graphql(name = "contactsecret")]
  pub contactsecret: String,
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

impl FromRow<'_, MySqlRow> for WxwAppModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;
    // ID
    let id: WxwAppId = row.try_get("id")?;
    // 名称
    let lbl: String = row.try_get("lbl")?;
    // 企业ID
    let corpid: String = row.try_get("corpid")?;
    // 应用ID
    let agentid: String = row.try_get("agentid")?;
    // 可信域名
    let domain_id: DomainId = row.try_get("domain_id")?;
    let domain_id_lbl: Option<String> = row.try_get("domain_id_lbl")?;
    let domain_id_lbl = domain_id_lbl.unwrap_or_default();
    // 应用密钥
    let corpsecret: String = row.try_get("corpsecret")?;
    let corpsecret: String = decrypt(corpsecret.as_str());
    // 通讯录密钥
    let contactsecret: String = row.try_get("contactsecret")?;
    let contactsecret: String = decrypt(contactsecret.as_str());
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
      lbl,
      corpid,
      agentid,
      domain_id,
      domain_id_lbl,
      corpsecret,
      contactsecret,
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
#[graphql(rename_fields = "snake_case", name = "WxwAppFieldComment")]
#[allow(dead_code)]
pub struct WxwAppFieldComment {
  /// ID
  #[graphql(name = "id")]
  pub id: String,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: String,
  /// 企业ID
  #[graphql(name = "corpid")]
  pub corpid: String,
  /// 应用ID
  #[graphql(name = "agentid")]
  pub agentid: String,
  /// 可信域名
  #[graphql(name = "domain_id")]
  pub domain_id: String,
  /// 可信域名
  #[graphql(name = "domain_id_lbl")]
  pub domain_id_lbl: String,
  /// 应用密钥
  #[graphql(name = "corpsecret")]
  pub corpsecret: String,
  /// 通讯录密钥
  #[graphql(name = "contactsecret")]
  pub contactsecret: String,
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
}

#[derive(InputObject, Default)]
#[graphql(rename_fields = "snake_case", name = "WxwAppSearch")]
#[allow(dead_code)]
pub struct WxwAppSearch {
  /// ID
  pub id: Option<WxwAppId>,
  /// ID列表
  pub ids: Option<Vec<WxwAppId>>,
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  pub is_deleted: Option<u8>,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: Option<String>,
  /// 名称
  #[graphql(name = "lbl_like")]
  pub lbl_like: Option<String>,
  /// 企业ID
  #[graphql(name = "corpid")]
  pub corpid: Option<String>,
  /// 企业ID
  #[graphql(name = "corpid_like")]
  pub corpid_like: Option<String>,
  /// 应用ID
  #[graphql(name = "agentid")]
  pub agentid: Option<String>,
  /// 应用ID
  #[graphql(name = "agentid_like")]
  pub agentid_like: Option<String>,
  /// 可信域名
  #[graphql(name = "domain_id")]
  pub domain_id: Option<Vec<DomainId>>,
  /// 可信域名
  #[graphql(name = "domain_id_save_null")]
  pub domain_id_is_null: Option<bool>,
  /// 可信域名
  #[graphql(name = "domain_id_lbl")]
  pub domain_id_lbl: Option<Vec<String>>,
  /// 可信域名
  #[graphql(name = "domain_id_lbl_like")]
  pub domain_id_lbl_like: Option<String>,
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

impl std::fmt::Debug for WxwAppSearch {
  fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
    let mut item = &mut f.debug_struct("WxwAppSearch");
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
    // 名称
    if let Some(ref lbl) = self.lbl {
      item = item.field("lbl", lbl);
    }
    if let Some(ref lbl_like) = self.lbl_like {
      item = item.field("lbl_like", lbl_like);
    }
    // 企业ID
    if let Some(ref corpid) = self.corpid {
      item = item.field("corpid", corpid);
    }
    if let Some(ref corpid_like) = self.corpid_like {
      item = item.field("corpid_like", corpid_like);
    }
    // 应用ID
    if let Some(ref agentid) = self.agentid {
      item = item.field("agentid", agentid);
    }
    if let Some(ref agentid_like) = self.agentid_like {
      item = item.field("agentid_like", agentid_like);
    }
    // 可信域名
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
#[graphql(rename_fields = "snake_case", name = "WxwAppInput")]
#[allow(dead_code)]
pub struct WxwAppInput {
  /// ID
  pub id: Option<WxwAppId>,
  /// 已删除
  #[graphql(skip)]
  pub is_deleted: Option<u8>,
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: Option<TenantId>,
  /// 名称
  #[graphql(name = "lbl")]
  pub lbl: Option<String>,
  /// 企业ID
  #[graphql(name = "corpid")]
  pub corpid: Option<String>,
  /// 应用ID
  #[graphql(name = "agentid")]
  pub agentid: Option<String>,
  /// 可信域名
  #[graphql(name = "domain_id")]
  pub domain_id: Option<DomainId>,
  /// 可信域名
  #[graphql(name = "domain_id_lbl")]
  pub domain_id_lbl: Option<String>,
  /// 应用密钥
  #[graphql(name = "corpsecret")]
  pub corpsecret: Option<String>,
  /// 通讯录密钥
  #[graphql(name = "contactsecret")]
  pub contactsecret: Option<String>,
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

impl From<WxwAppModel> for WxwAppInput {
  fn from(model: WxwAppModel) -> Self {
    Self {
      id: model.id.into(),
      is_deleted: model.is_deleted.into(),
      tenant_id: model.tenant_id.into(),
      // 名称
      lbl: model.lbl.into(),
      // 企业ID
      corpid: model.corpid.into(),
      // 应用ID
      agentid: model.agentid.into(),
      // 可信域名
      domain_id: model.domain_id.into(),
      domain_id_lbl: model.domain_id_lbl.into(),
      // 应用密钥
      corpsecret: model.corpsecret.into(),
      // 通讯录密钥
      contactsecret: model.contactsecret.into(),
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

impl From<WxwAppInput> for WxwAppSearch {
  fn from(input: WxwAppInput) -> Self {
    Self {
      id: input.id,
      ids: None,
      // 租户ID
      tenant_id: input.tenant_id,
      is_deleted: None,
      // 名称
      lbl: input.lbl,
      // 企业ID
      corpid: input.corpid,
      // 应用ID
      agentid: input.agentid,
      // 可信域名
      domain_id: input.domain_id.map(|x| vec![x]),
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

impl_id!(WxwAppId);

/// 企微应用 检测字段是否允许前端排序
pub fn check_sort_wxw_app(
  sort: Option<&[SortInput]>,
) -> Result<()> {
  
  if sort.is_none() {
    return Ok(());
  }
  let sort = sort.unwrap();
  
  let get_can_sort_in_api_wxw_app = get_can_sort_in_api_wxw_app();
  
  for item in sort {
    let prop = item.prop.as_str();
    if prop.is_empty() {
      continue;
    }
    if !get_can_sort_in_api_wxw_app.contains(&prop) {
      return Err(eyre!("check_sort_wxw_app: {}", serde_json::to_string(item)?));
    }
  }
  
  Ok(())
}

/// 获取路由地址
#[allow(dead_code)]
pub fn get_route_path_wxw_app() -> String {
  "/wxwork/wxw_app".to_owned()
}
