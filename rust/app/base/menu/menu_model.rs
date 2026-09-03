use serde::{Serialize, Deserialize};
use sqlx::{FromRow, mysql::MySqlRow, Row};
use async_graphql::SimpleObject;

use generated::base::menu::menu_model::MenuModel;
use generated::base::role::role_model::RoleModel;

#[derive(SimpleObject, Clone, Default, Serialize, Deserialize, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct GetMenus {
  pub id: String,
  pub parent_id: String,
  pub lbl: String,
  pub lbl_lang: String,
  pub route_path: String,
  pub route_query: String,
  pub is_dyn_page: u8,
  pub order_by: u32,
}

#[derive(SimpleObject, Clone, Default, Serialize, Deserialize, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct FindMenuAndRoles {
  pub menu_model: Option<MenuModel>,
  pub role_models: Vec<RoleModel>,
}

impl FromRow<'_, MySqlRow> for GetMenus {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // ID
    let id: String = row.try_get("id")?;
    // 父菜单
    let parent_id: String = row.try_get("parent_id")?;
    // 名称
    let lbl: String = row.try_get("lbl")?;
    let lbl_lang: Option<String> = row.try_get("lbl_lang")?;
    let lbl_lang = lbl_lang.unwrap_or_default();
    let route_path: String = row.try_get("route_path")?;
    let route_query: String = row.try_get("route_query")?;
    let is_dyn_page: u8 = row.try_get("is_dyn_page")?;
    let order_by: u32 = row.try_get("order_by")?;
    
    let model = Self {
      id,
      parent_id,
      lbl,
      lbl_lang,
      route_path,
      route_query,
      is_dyn_page,
      order_by,
    };
    
    Ok(model)
  }
}
