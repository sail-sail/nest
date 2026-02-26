use serde::{Serialize, Deserialize};
use sqlx::{FromRow, mysql::MySqlRow, Row};
use async_graphql::SimpleObject;

use smol_str::SmolStr;

use generated::base::menu::menu_model::MenuModel;
use generated::base::role::role_model::RoleModel;

#[derive(SimpleObject, Clone, Default, Serialize, Deserialize, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct GetMenus {
  pub id: SmolStr,
  pub parent_id: SmolStr,
  pub lbl: SmolStr,
  pub lbl_lang: SmolStr,
  pub route_path: SmolStr,
  pub route_query: SmolStr,
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
    let id: &str = row.try_get("id")?;
    let id = SmolStr::new(id);
    // 父菜单
    let parent_id: &str = row.try_get("parent_id")?;
    let parent_id = SmolStr::new(parent_id);
    // 名称
    let lbl: &str = row.try_get("lbl")?;
    let lbl = SmolStr::new(lbl);
    let lbl_lang: Option<&str> = row.try_get("lbl_lang")?;
    let lbl_lang = SmolStr::new(lbl_lang.unwrap_or_default());
    let route_path: &str = row.try_get("route_path")?;
    let route_path = SmolStr::new(route_path);
    let route_query: &str = row.try_get("route_query")?;
    let route_query = SmolStr::new(route_query);
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
