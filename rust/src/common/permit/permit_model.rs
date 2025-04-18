use serde::{Serialize, Deserialize};
use async_graphql::SimpleObject;

use crate::r#gen::base::permit::permit_model::PermitId;
use crate::r#gen::base::menu::menu_model::MenuId;

#[derive(SimpleObject, Clone, Default, Serialize, Deserialize, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct GetUsrPermits {
  /// ID
  pub id: PermitId,
  /// 菜单
  pub menu_id: MenuId,
  /// 路由
  pub route_path: String,
  /// 编码
  pub code: String,
  /// 名称
  pub lbl: String,
}
