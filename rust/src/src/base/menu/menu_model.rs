use serde::{Serialize, Deserialize};
use sqlx::{FromRow, mysql::MySqlRow, Row};
use async_graphql::SimpleObject;

#[derive(SimpleObject, Clone, Default, Serialize, Deserialize, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct GetMenus {
  pub id: String,
  pub parent_id: String,
  pub lbl: String,
  pub route_path: Option<String>,
  pub route_query: Option<String>,
}

impl FromRow<'_, MySqlRow> for GetMenus {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // ID
    let id: String = row.try_get("id")?;
    // 父菜单
    let parent_id: String = row.try_get("parent_id")?;
    // 名称
    let lbl: String = row.try_get("lbl")?;
    let route_path: Option<String> = row.try_get("route_path")?;
    let route_query: Option<String> = row.try_get("route_query")?;
    
    let model = Self {
      id,
      parent_id,
      lbl,
      route_path,
      route_query,
    };
    
    Ok(model)
  }
}
