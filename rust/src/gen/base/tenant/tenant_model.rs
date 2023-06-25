use serde::{Serialize, Deserialize};
use sqlx::{FromRow, mysql::MySqlRow, Row};
use async_graphql::{SimpleObject, InputObject};

#[derive(SimpleObject, Debug, Default, Serialize, Deserialize, Clone)]
#[graphql(rename_fields = "snake_case")]
pub struct TenantModel {
  /// ID
  pub id: String,
  /// 名称
  pub lbl: String,
  /// 域名绑定
  pub domain: String,
  /// 租户管理员
  pub usr_id: String,
  /// 租户管理员
  pub usr_id_lbl: String,
  /// 到期日
  pub expiration: Option<chrono::NaiveDate>,
  /// 到期日
  pub expiration_lbl: String,
  /// 最大用户数
  pub max_usr_num: u32,
  /// 锁定
  pub is_locked: u8,
  /// 锁定
  pub is_locked_lbl: String,
  /// 菜单
  pub menu_ids: Vec<String>,
  /// 菜单
  pub menu_ids_lbl: Vec<String>,
  /// 启用
  pub is_enabled: u8,
  /// 启用
  pub is_enabled_lbl: String,
  /// 排序
  pub order_by: u32,
  /// 备注
  pub rem: String,
  /// 创建人
  pub create_usr_id: String,
  /// 创建人
  pub create_usr_id_lbl: String,
  /// 创建时间
  pub create_time: Option<chrono::NaiveDateTime>,
  /// 创建时间
  pub create_time_lbl: String,
  /// 更新人
  pub update_usr_id: String,
  /// 更新人
  pub update_usr_id_lbl: String,
  /// 更新时间
  pub update_time: Option<chrono::NaiveDateTime>,
  /// 更新时间
  pub update_time_lbl: String,
}

impl FromRow<'_, MySqlRow> for TenantModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // ID
    let id: String = row.try_get("id")?;
    // 名称
    let lbl: String = row.try_get("lbl")?;
    // 域名绑定
    let domain: String = row.try_get("domain")?;
    // 租户管理员
    let usr_id: String = row.try_get("usr_id")?;
    let usr_id_lbl: Option<String> = row.try_get("usr_id_lbl")?;
    let usr_id_lbl = usr_id_lbl.unwrap_or_default();
    // 到期日
    let expiration: Option<chrono::NaiveDate> = row.try_get("expiration")?;
    let expiration_lbl: String = match expiration {
      Some(expiration) => expiration.format("%Y-%m-%d").to_string(),
      None => "".to_owned(),
    };
    // 最大用户数
    let max_usr_num: u32 = row.try_get("max_usr_num")?;
    // 锁定
    let is_locked: u8 = row.try_get("is_locked")?;
    let is_locked_lbl: String = is_locked.to_string();
    // 菜单
    let menu_ids: Option<sqlx::types::Json<Vec<String>>> = row.try_get("menu_ids")?;
    let menu_ids = menu_ids.unwrap_or_default().0;
    let menu_ids_lbl: Option<sqlx::types::Json<Vec<String>>> = row.try_get("menu_ids_lbl")?;
    let menu_ids_lbl = menu_ids_lbl.unwrap_or_default().0;
    // 启用
    let is_enabled: u8 = row.try_get("is_enabled")?;
    let is_enabled_lbl: String = is_enabled.to_string();
    // 排序
    let order_by: u32 = row.try_get("order_by")?;
    // 备注
    let rem: String = row.try_get("rem")?;
    // 创建人
    let create_usr_id: String = row.try_get("create_usr_id")?;
    let create_usr_id_lbl: Option<String> = row.try_get("create_usr_id_lbl")?;
    let create_usr_id_lbl = create_usr_id_lbl.unwrap_or_default();
    // 创建时间
    let create_time: Option<chrono::NaiveDateTime> = row.try_get("create_time")?;
    let create_time_lbl: String = match create_time {
      Some(create_time) => create_time.format("%Y-%m-%d %H:%M:%S").to_string(),
      None => "".to_owned(),
    };
    // 更新人
    let update_usr_id: String = row.try_get("update_usr_id")?;
    let update_usr_id_lbl: Option<String> = row.try_get("update_usr_id_lbl")?;
    let update_usr_id_lbl = update_usr_id_lbl.unwrap_or_default();
    // 更新时间
    let update_time: Option<chrono::NaiveDateTime> = row.try_get("update_time")?;
    let update_time_lbl: String = match update_time {
      Some(update_time) => update_time.format("%Y-%m-%d %H:%M:%S").to_string(),
      None => "".to_owned(),
    };
    
    let model = Self {
      id,
      lbl,
      domain,
      usr_id,
      usr_id_lbl,
      expiration,
      expiration_lbl,
      max_usr_num,
      is_locked,
      is_locked_lbl,
      menu_ids,
      menu_ids_lbl,
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

#[derive(SimpleObject, Debug, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct TenantFieldComment {
  /// 名称
  pub lbl: String,
  /// 域名绑定
  pub domain: String,
  /// 租户管理员
  pub usr_id: String,
  /// 租户管理员
  pub usr_id_lbl: String,
  /// 到期日
  pub expiration: String,
  /// 到期日
  pub expiration_lbl: String,
  /// 最大用户数
  pub max_usr_num: String,
  /// 锁定
  pub is_locked: String,
  /// 锁定
  pub is_locked_lbl: String,
  /// 菜单
  pub menu_ids: String,
  /// 菜单
  pub menu_ids_lbl: String,
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

#[derive(InputObject, Debug, Default)]
#[graphql(rename_fields = "snake_case")]
pub struct TenantSearch {
  pub id: Option<String>,
  pub ids: Option<Vec<String>>,
  pub is_deleted: Option<u8>,
  /// 名称
  pub lbl: Option<String>,
  /// 名称
  pub lbl_like: Option<String>,
  /// 域名绑定
  pub domain: Option<String>,
  /// 域名绑定
  pub domain_like: Option<String>,
  /// 租户管理员
  pub usr_id: Option<Vec<String>>,
  /// 租户管理员
  pub usr_id_is_null: Option<bool>,
  /// 到期日
  pub expiration: Option<Vec<chrono::NaiveDate>>,
  /// 最大用户数
  pub max_usr_num: Option<Vec<u32>>,
  /// 锁定
  pub is_locked: Option<Vec<u8>>,
  /// 菜单
  pub menu_ids: Option<Vec<String>>,
  /// 菜单
  pub menu_ids_is_null: Option<bool>,
  /// 启用
  pub is_enabled: Option<Vec<u8>>,
  /// 排序
  pub order_by: Option<Vec<u32>>,
  /// 备注
  pub rem: Option<String>,
  /// 备注
  pub rem_like: Option<String>,
  /// 创建人
  pub create_usr_id: Option<Vec<String>>,
  /// 创建人
  pub create_usr_id_is_null: Option<bool>,
  /// 创建时间
  pub create_time: Option<Vec<chrono::NaiveDateTime>>,
  /// 更新人
  pub update_usr_id: Option<Vec<String>>,
  /// 更新人
  pub update_usr_id_is_null: Option<bool>,
  /// 更新时间
  pub update_time: Option<Vec<chrono::NaiveDateTime>>,
}

#[derive(FromModel, InputObject, Debug, Default, Clone)]
#[graphql(rename_fields = "snake_case")]
pub struct TenantInput {
  pub id: Option<String>,
  /// 名称
  pub lbl: Option<String>,
  /// 域名绑定
  pub domain: Option<String>,
  /// 租户管理员
  pub usr_id: Option<String>,
  /// 租户管理员
  pub usr_id_lbl: Option<String>,
  /// 到期日
  pub expiration: Option<chrono::NaiveDate>,
  /// 到期日
  pub expiration_lbl: Option<String>,
  /// 最大用户数
  pub max_usr_num: Option<u32>,
  /// 锁定
  pub is_locked: Option<u8>,
  /// 锁定
  pub is_locked_lbl: Option<String>,
  /// 菜单
  pub menu_ids: Option<Vec<String>>,
  /// 菜单
  pub menu_ids_lbl: Option<Vec<String>>,
  /// 启用
  pub is_enabled: Option<u8>,
  /// 启用
  pub is_enabled_lbl: Option<String>,
  /// 排序
  pub order_by: Option<u32>,
  /// 备注
  pub rem: Option<String>,
  /// 创建人
  pub create_usr_id: Option<String>,
  /// 创建人
  pub create_usr_id_lbl: Option<String>,
  /// 创建时间
  pub create_time: Option<chrono::NaiveDateTime>,
  /// 创建时间
  pub create_time_lbl: Option<String>,
  /// 更新人
  pub update_usr_id: Option<String>,
  /// 更新人
  pub update_usr_id_lbl: Option<String>,
  /// 更新时间
  pub update_time: Option<chrono::NaiveDateTime>,
  /// 更新时间
  pub update_time_lbl: Option<String>,
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
      domain: input.domain,
      // 租户管理员
      usr_id: input.usr_id.map(|x| vec![x.into()]),
      // 到期日
      expiration: input.expiration.map(|x| vec![x.clone().into(), x.clone().into()]),
      // 最大用户数
      max_usr_num: input.max_usr_num.map(|x| vec![x.clone().into(), x.clone().into()]),
      // 锁定
      is_locked: input.is_locked.map(|x| vec![x.into()]),
      // 菜单
      menu_ids: input.menu_ids,
      // 启用
      is_enabled: input.is_enabled.map(|x| vec![x.into()]),
      // 排序
      order_by: input.order_by.map(|x| vec![x.clone().into(), x.clone().into()]),
      // 备注
      rem: input.rem,
      // 创建人
      create_usr_id: input.create_usr_id.map(|x| vec![x.into()]),
      // 创建时间
      create_time: input.create_time.map(|x| vec![x.clone().into(), x.clone().into()]),
      // 更新人
      update_usr_id: input.update_usr_id.map(|x| vec![x.into()]),
      // 更新时间
      update_time: input.update_time.map(|x| vec![x.clone().into(), x.clone().into()]),
      ..Default::default()
    }
  }
}
