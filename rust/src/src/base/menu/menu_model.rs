use serde::{Serialize, Deserialize};
use sqlx::{FromRow, mysql::MySqlRow, Row};
use async_graphql::SimpleObject;

#[derive(SimpleObject, Clone, Debug, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct GetMenus {
  pub id: String,
  pub r#type: String,
  pub menu_id: String,
  pub lbl: String,
  pub route_path: Option<String>,
  pub route_query: Option<String>,
  pub children: Vec<GetMenus>,
}

impl FromRow<'_, MySqlRow> for GetMenus {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // ID
    let id: String = row.try_get("id")?;
    // 类型
    let r#type: String = row.try_get("type")?;
    // 菜单ID
    let menu_id: String = row.try_get("menu_id")?;
    // 名称
    let lbl: String = row.try_get("lbl")?;
    let route_path: Option<String> = row.try_get("route_path")?;
    let route_query: Option<String> = row.try_get("route_query")?;
    let children: Vec<GetMenus> = Vec::new();
    
    let model = Self {
      id,
      r#type,
      menu_id,
      lbl,
      route_path,
      route_query,
      children,
    };
    
    Ok(model)
  }
}
