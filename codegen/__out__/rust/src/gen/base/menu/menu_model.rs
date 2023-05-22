use serde::{Serialize, Deserialize};
use sqlx::{FromRow, mysql::MySqlRow, Row};
use async_graphql::{SimpleObject, InputObject};

#[derive(SimpleObject, Debug, Default, Serialize, Deserialize, Clone)]
#[graphql(rename_fields = "snake_case")]
pub struct MenuModel {
  /// ID
  pub id: String,
  /// 类型
  pub r#type: String,
  /// 类型
  pub r#type_lbl: String,
  /// 父菜单
  pub menu_id: String,
  /// 父菜单
  pub menu_id_lbl: String,
  /// 名称
  pub lbl: String,
  /// 路由
  pub route_path: String,
  /// 参数
  pub route_query: Option<String>,
  /// 启用
  pub is_enabled: u8,
  /// 启用
  pub is_enabled_lbl: String,
  /// 排序
  pub order_by: u32,
  /// 备注
  pub rem: String,
}

impl FromRow<'_, MySqlRow> for MenuModel {
  fn from_row(row: &MySqlRow) -> sqlx::Result<Self> {
    // ID
    let id: String = row.try_get("id")?;
    // 类型
    let r#type: String = row.try_get("type")?;
    let type_lbl: String = r#type.to_string();
    // 父菜单
    let menu_id: String = row.try_get("menu_id")?;
    let menu_id_lbl: Option<String> = row.try_get("menu_id_lbl")?;
    let menu_id_lbl = menu_id_lbl.unwrap_or_default();
    // 名称
    let lbl: String = row.try_get("lbl")?;
    // 路由
    let route_path: String = row.try_get("route_path")?;
    // 参数
    let route_query: Option<String> = row.try_get("route_query")?;
    // 启用
    let is_enabled: u8 = row.try_get("is_enabled")?;
    let is_enabled_lbl: String = is_enabled.to_string();
    // 排序
    let order_by: u32 = row.try_get("order_by")?;
    // 备注
    let rem: String = row.try_get("rem")?;
    
    let model = Self {
      id,
      r#type,
      type_lbl,
      menu_id,
      menu_id_lbl,
      lbl,
      route_path,
      route_query,
      is_enabled,
      is_enabled_lbl,
      order_by,
      rem,
    };
    
    Ok(model)
  }
}

#[derive(SimpleObject, Debug, Default, Serialize, Deserialize)]
#[graphql(rename_fields = "snake_case")]
pub struct MenuFieldComment {
  /// 类型
  pub r#type: String,
  /// 类型
  pub r#type_lbl: String,
  /// 父菜单
  pub menu_id: String,
  /// 父菜单
  pub menu_id_lbl: String,
  /// 名称
  pub lbl: String,
  /// 路由
  pub route_path: String,
  /// 参数
  pub route_query: String,
  /// 启用
  pub is_enabled: String,
  /// 启用
  pub is_enabled_lbl: String,
  /// 排序
  pub order_by: String,
  /// 备注
  pub rem: String,
}

#[derive(InputObject, Debug, Default)]
#[graphql(rename_fields = "snake_case")]
pub struct MenuSearch {
  pub id: Option<String>,
  pub ids: Option<Vec<String>>,
  pub is_deleted: Option<u8>,
  /// 类型
  pub r#type: Option<Vec<String>>,
  /// 父菜单
  pub menu_id: Option<Vec<String>>,
  /// 父菜单
  pub menu_id_is_null: Option<bool>,
  /// 名称
  pub lbl: Option<String>,
  /// 名称
  pub lbl_like: Option<String>,
  /// 路由
  pub route_path: Option<String>,
  /// 路由
  pub route_path_like: Option<String>,
  /// 参数
  pub route_query: Option<String>,
  /// 启用
  pub is_enabled: Option<Vec<u8>>,
  /// 排序
  pub order_by: Option<Vec<u32>>,
  /// 备注
  pub rem: Option<String>,
  /// 备注
  pub rem_like: Option<String>,
}

#[derive(FromModel, InputObject, Debug, Default, Clone)]
#[graphql(rename_fields = "snake_case")]
pub struct MenuInput {
  pub id: Option<String>,
  /// 类型
  pub r#type: Option<String>,
  /// 类型
  pub type_lbl: Option<String>,
  /// 父菜单
  pub menu_id: Option<String>,
  /// 父菜单
  pub menu_id_lbl: Option<String>,
  /// 名称
  pub lbl: Option<String>,
  /// 路由
  pub route_path: Option<String>,
  /// 参数
  pub route_query: Option<String>,
  /// 启用
  pub is_enabled: Option<u8>,
  /// 启用
  pub is_enabled_lbl: Option<String>,
  /// 排序
  pub order_by: Option<u32>,
  /// 备注
  pub rem: Option<String>,
}

impl From<MenuInput> for MenuSearch {
  fn from(input: MenuInput) -> Self {
    Self {
      id: input.id.map(|x| x.into()),
      ids: None,
      is_deleted: None,
      // 类型
      r#type: input.r#type.map(|x| vec![x.into()]),
      // 父菜单
      menu_id: input.menu_id.map(|x| vec![x.into()]),
      // 名称
      lbl: input.lbl,
      // 路由
      route_path: input.route_path,
      // 参数
      route_query: input.route_query,
      // 启用
      is_enabled: input.is_enabled.map(|x| vec![x.into()]),
      // 排序
      order_by: input.order_by.map(|x| vec![x.clone().into(), x.clone().into()]),
      // 备注
      rem: input.rem,
      ..Default::default()
    }
  }
}
