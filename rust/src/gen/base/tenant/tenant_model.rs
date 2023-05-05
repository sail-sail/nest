use serde::{Serialize, Deserialize};
use sqlx::{FromRow, mysql::MySqlRow, Row};
use async_graphql::{SimpleObject, InputObject, ID};

#[derive(SimpleObject, Debug, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct TenantModel {
  /// ID
  pub id: ID,
  /// 名称
  pub lbl: String,
  /// 域名绑定
  pub host: String,
  /// 到期日
  pub expiration: Option<String>,
  /// 最大用户数
  pub max_usr_num: u32,
  /// 启用
  pub is_enabled: u8,
  pub is_enabled_lbl: String,
  /// 菜单
  pub menu_ids: Vec<String>,
  pub menu_ids_lbl: Vec<String>,
  /// 排序
  pub order_by: u32,
  /// 备注
  pub rem: String,
}

impl FromRow<'_, MySqlRow> for TenantModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // ID
    let id: String = row.try_get("id")?;
    let id: ID = id.into();
    // 名称
    let lbl: String = row.try_get("lbl")?;
    // 域名绑定
    let host: String = row.try_get("host")?;
    // 到期日
    let expiration: Option<String> = row.try_get("expiration")?;
    // 最大用户数
    let max_usr_num: u32 = row.try_get("max_usr_num")?;
    // 启用
    let is_enabled: u8 = row.try_get("is_enabled")?;
    let is_enabled_lbl: String = is_enabled.to_string();
    // 菜单
    let menu_ids: sqlx::types::Json<Option<Vec<String>>> = row.try_get("menu_ids")?;
    let menu_ids = menu_ids.0.unwrap_or_default();
    let menu_ids_lbl: sqlx::types::Json<Option<Vec<String>>> = row.try_get("menu_ids_lbl")?;
    let menu_ids_lbl = menu_ids_lbl.0.unwrap_or_default();
    // 排序
    let order_by: u32 = row.try_get("order_by")?;
    // 备注
    let rem: String = row.try_get("rem")?;
    
    let model = Self {
      id,
      lbl,
      host,
      expiration,
      max_usr_num,
      is_enabled,
      is_enabled_lbl,
      menu_ids,
      menu_ids_lbl,
      order_by,
      rem,
    };
    
    Ok(model)
  }
}

#[derive(SimpleObject, Debug, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct TenantFieldComment {
  /// 名称
  pub lbl: String,
  /// 域名绑定
  pub host: String,
  /// 到期日
  pub expiration: String,
  /// 最大用户数
  pub max_usr_num: String,
  /// 启用
  pub is_enabled: String,
  pub is_enabled_lbl: String,
  /// 菜单
  pub menu_ids: String,
  pub menu_ids_lbl: String,
  /// 排序
  pub order_by: String,
  /// 备注
  pub rem: String,
}

#[derive(InputObject, Debug, Default)]
#[graphql(rename_fields = "snake_case")]
pub struct TenantSearch {
  pub id: Option<String>,
  pub ids: Option<Vec<String>>,
  pub is_deleted: Option<u8>,
  /// 名称
  pub lbl: Option<String>,
  pub lbl_like: Option<String>,
  /// 域名绑定
  pub host: Option<String>,
  pub host_like: Option<String>,
  /// 到期日
  pub expiration: Option<Vec<String>>,
  /// 最大用户数
  pub max_usr_num: Option<Vec<u32>>,
  /// 启用
  pub is_enabled: Option<Vec<u8>>,
  /// 菜单
  pub menu_ids: Option<Vec<String>>,
  pub menu_ids_is_null: Option<bool>,
  /// 排序
  pub order_by: Option<Vec<u32>>,
  /// 备注
  pub rem: Option<String>,
  pub rem_like: Option<String>,
}

#[derive(FromModel, InputObject, Debug, Default, Clone)]
#[graphql(rename_fields = "snake_case")]
pub struct TenantInput {
  pub id: Option<ID>,
  /// 名称
  pub lbl: Option<String>,
  /// 域名绑定
  pub host: Option<String>,
  /// 到期日
  pub expiration: Option<String>,
  /// 最大用户数
  pub max_usr_num: Option<u32>,
  /// 启用
  pub is_enabled: Option<u8>,
  pub is_enabled_lbl: Option<String>,
  /// 菜单
  pub menu_ids: Option<Vec<String>>,
  pub menu_ids_lbl: Option<Vec<String>>,
  /// 排序
  pub order_by: Option<u32>,
  /// 备注
  pub rem: Option<String>,
}

impl From<TenantInput> for TenantSearch {
  fn from(input: TenantInput) -> Self {
    Self {
      id: input.id.map(|x| x.into()),
      ids: None,
      is_deleted: None,
      // 名称
      lbl: input.lbl,
      // 域名绑定
      host: input.host,
      // 到期日
      expiration: input.expiration.map(|x| vec![x.clone().into(), x.clone().into()]),
      // 最大用户数
      max_usr_num: input.max_usr_num.map(|x| vec![x.clone().into(), x.clone().into()]),
      // 启用
      is_enabled: input.is_enabled.map(|x| vec![x.into()]),
      // 菜单
      menu_ids: input.menu_ids,
      // 排序
      order_by: input.order_by.map(|x| vec![x.clone().into(), x.clone().into()]),
      // 备注
      rem: input.rem,
      ..Default::default()
    }
  }
}
