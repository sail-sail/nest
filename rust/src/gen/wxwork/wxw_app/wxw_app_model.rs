use serde::{
  Serialize,
  Deserialize,
};

use sqlx::{
  FromRow,
  mysql::MySqlRow,
  Row,
};

use async_graphql::{
  SimpleObject,
  InputObject,
};
use crate::common::util::dao::decrypt;

#[derive(SimpleObject, Default, Serialize, Deserialize, Clone)]
#[graphql(rename_fields = "snake_case")]
pub struct WxwAppModel {
  /// 租户ID
  pub tenant_id: String,
  /// ID
  pub id: String,
  /// 名称
  pub lbl: String,
  /// 企业ID
  pub corpid: String,
  /// 应用ID
  pub agentid: String,
  /// 可信域名
  pub domain_id: String,
  /// 可信域名
  pub domain_id_lbl: String,
  /// 应用密钥
  pub corpsecret: String,
  /// 通讯录密钥
  pub contactsecret: String,
  /// 锁定
  pub is_locked: u8,
  /// 锁定
  pub is_locked_lbl: String,
  /// 启用
  pub is_enabled: u8,
  /// 启用
  pub is_enabled_lbl: String,
  /// 排序
  pub order_by: u32,
  /// 备注
  pub rem: String,
  /// 是否已删除
  pub is_deleted: u8,
}

impl FromRow<'_, MySqlRow> for WxwAppModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // 租户ID
    let tenant_id = row.try_get("tenant_id")?;
    // ID
    let id: String = row.try_get("id")?;
    // 名称
    let lbl: String = row.try_get("lbl")?;
    // 企业ID
    let corpid: String = row.try_get("corpid")?;
    // 应用ID
    let agentid: String = row.try_get("agentid")?;
    // 可信域名
    let domain_id: String = row.try_get("domain_id")?;
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
    // 是否已删除
    let is_deleted: u8 = row.try_get("is_deleted")?;
    
    let model = Self {
      tenant_id,
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
      is_deleted,
    };
    
    Ok(model)
  }
}

#[derive(SimpleObject, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct WxwAppFieldComment {
  /// ID
  pub id: String,
  /// 名称
  pub lbl: String,
  /// 企业ID
  pub corpid: String,
  /// 应用ID
  pub agentid: String,
  /// 可信域名
  pub domain_id: String,
  /// 可信域名
  pub domain_id_lbl: String,
  /// 应用密钥
  pub corpsecret: String,
  /// 通讯录密钥
  pub contactsecret: String,
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
}

#[derive(InputObject, Default)]
#[graphql(rename_fields = "snake_case")]
pub struct WxwAppSearch {
  pub id: Option<String>,
  pub ids: Option<Vec<String>>,
  #[graphql(skip)]
  pub tenant_id: Option<String>,
  pub is_deleted: Option<u8>,
  /// 名称
  pub lbl: Option<String>,
  /// 名称
  pub lbl_like: Option<String>,
  /// 企业ID
  pub corpid: Option<String>,
  /// 企业ID
  pub corpid_like: Option<String>,
  /// 应用ID
  pub agentid: Option<String>,
  /// 应用ID
  pub agentid_like: Option<String>,
  /// 可信域名
  pub domain_id: Option<Vec<String>>,
  /// 可信域名
  pub domain_id_is_null: Option<bool>,
  /// 应用密钥
  pub corpsecret: Option<String>,
  /// 应用密钥
  pub corpsecret_like: Option<String>,
  /// 通讯录密钥
  pub contactsecret: Option<String>,
  /// 通讯录密钥
  pub contactsecret_like: Option<String>,
  /// 锁定
  pub is_locked: Option<Vec<u8>>,
  /// 启用
  pub is_enabled: Option<Vec<u8>>,
  /// 排序
  pub order_by: Option<Vec<u32>>,
  /// 备注
  pub rem: Option<String>,
  /// 备注
  pub rem_like: Option<String>,
}

#[derive(FromModel, InputObject, Default, Clone)]
#[graphql(rename_fields = "snake_case")]
pub struct WxwAppInput {
  /// 租户ID
  #[graphql(skip)]
  pub tenant_id: Option<String>,
  /// ID
  pub id: Option<String>,
  /// 名称
  pub lbl: Option<String>,
  /// 企业ID
  pub corpid: Option<String>,
  /// 应用ID
  pub agentid: Option<String>,
  /// 可信域名
  pub domain_id: Option<String>,
  /// 可信域名
  pub domain_id_lbl: Option<String>,
  /// 应用密钥
  pub corpsecret: Option<String>,
  /// 通讯录密钥
  pub contactsecret: Option<String>,
  /// 锁定
  pub is_locked: Option<u8>,
  /// 锁定
  pub is_locked_lbl: Option<String>,
  /// 启用
  pub is_enabled: Option<u8>,
  /// 启用
  pub is_enabled_lbl: Option<String>,
  /// 排序
  pub order_by: Option<u32>,
  /// 备注
  pub rem: Option<String>,
}

impl From<WxwAppInput> for WxwAppSearch {
  fn from(input: WxwAppInput) -> Self {
    Self {
      id: input.id,
      ids: None,
      // 住户ID
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
      // 应用密钥
      corpsecret: input.corpsecret,
      // 通讯录密钥
      contactsecret: input.contactsecret,
      // 锁定
      is_locked: input.is_locked.map(|x| vec![x]),
      // 启用
      is_enabled: input.is_enabled.map(|x| vec![x]),
      // 排序
      order_by: input.order_by.map(|x| vec![x, x]),
      // 备注
      rem: input.rem,
      ..Default::default()
    }
  }
}
