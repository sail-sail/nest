use serde::{Serialize, Deserialize};
use async_graphql::SimpleObject;

#[derive(SimpleObject, Clone, Default, Serialize, Deserialize, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct GetUsrPermits {
  /// ID
  pub id: String,
  /// 菜单
  pub menu_id: String,
  /// 路由
  pub route_path: String,
  /// 编码
  pub code: String,
  /// 名称
  pub lbl: String,
}
