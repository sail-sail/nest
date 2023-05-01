use serde::{Serialize, Deserialize};
use sqlx::{FromRow, mysql::MySqlRow, Row};
use async_graphql::{SimpleObject, InputObject, ID};

#[derive(SimpleObject, Debug, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct RoleModel {
  /// ID
  pub id: ID,
  /// 名称
  pub lbl: String,
  /// 备注
  pub rem: String,
  /// 启用
  pub is_enabled: u8,
  pub is_enabled_lbl: String,
  /// 菜单
  pub menu_ids: Vec<String>,
  pub menu_ids_lbl: Vec<String>,
}

impl FromRow<'_, MySqlRow> for RoleModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // ID
    let id: String = row.try_get("id")?;
    let id: ID = id.into();
    // 名称
    let lbl: String = row.try_get("lbl")?;
    // 备注
    let rem: String = row.try_get("rem")?;
    // 启用
    let is_enabled: u8 = row.try_get("is_enabled")?;
    let is_enabled_lbl: String = is_enabled.to_string();
    // 菜单
    let menu_ids: sqlx::types::Json<Vec<String>> = row.try_get("menu_ids")?;
    let menu_ids = menu_ids.0;
    let menu_ids_lbl: sqlx::types::Json<Vec<String>> = row.try_get("menu_ids_lbl")?;
    let menu_ids_lbl = menu_ids_lbl.0;
    
    let model = Self {
      id,
      lbl,
      rem,
      is_enabled,
      is_enabled_lbl,
      menu_ids,
      menu_ids_lbl,
    };
    
    Ok(model)
  }
}

#[derive(SimpleObject, Debug, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct RoleFieldComment {
  /// 名称
  pub lbl: String,
  /// 备注
  pub rem: String,
  /// 启用
  pub is_enabled: String,
  pub is_enabled_lbl: String,
  /// 菜单
  pub menu_ids: String,
  pub menu_ids_lbl: String,
}

#[derive(InputObject, Debug, Default)]
#[graphql(rename_fields = "snake_case")]
pub struct RoleSearch {
  pub id: Option<String>,
  pub ids: Option<Vec<String>>,
  #[graphql(skip)]
  pub tenant_id: Option<String>,
  pub is_deleted: Option<u8>,
  /// 名称
  pub lbl: Option<String>,
  /// 备注
  pub rem: Option<String>,
  /// 启用
  pub is_enabled: Option<Vec<u8>>,
  /// 菜单
  pub menu_ids: Option<Vec<String>>,
  pub menu_ids_is_null: Option<bool>,
}

#[derive(FromModel, InputObject, Debug, Default, Clone)]
#[graphql(rename_fields = "snake_case")]
pub struct RoleInput {
  pub id: Option<ID>,
  /// 名称
  pub lbl: Option<String>,
  /// 备注
  pub rem: Option<String>,
  /// 启用
  pub is_enabled: Option<u8>,
  pub is_enabled_lbl: Option<String>,
  /// 菜单
  pub menu_ids: Option<Vec<String>>,
  pub menu_ids_lbl: Option<Vec<String>>,
}

impl From<RoleInput> for RoleSearch {
  fn from(input: RoleInput) -> Self {
    Self {
      id: input.id.map(|x| x.into()),
      ids: None,
      tenant_id: None,
      is_deleted: None,
      // 名称
      lbl: input.lbl,
      // 备注
      rem: input.rem,
      // 启用
      is_enabled: input.is_enabled.map(|x| vec![x.into()]),
      // 菜单
      menu_ids: input.menu_ids,
      ..Default::default()
    }
  }
}
