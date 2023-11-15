use serde::{Serialize, Deserialize};
use async_graphql::SimpleObject;

use crate::common::id::ID;

#[derive(SimpleObject, Clone, Default, Serialize, Deserialize, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct GetUsrPermits {
  /// ID
  pub id: ID,
  /// 菜单
  pub menu_id: ID,
  /// 路由
  pub route_path: String,
  /// 编码
  pub code: String,
  /// 名称
  pub lbl: String,
}
