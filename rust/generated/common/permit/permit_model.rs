use serde::{Serialize, Deserialize};
use async_graphql::SimpleObject;

use smol_str::SmolStr;

use crate::base::permit::permit_model::PermitId;
use crate::base::menu::menu_model::MenuId;

#[derive(SimpleObject, Clone, Default, Serialize, Deserialize, Debug)]
#[graphql(rename_fields = "snake_case")]
pub struct GetUsrPermits {
  /// ID
  pub id: PermitId,
  /// 菜单
  pub menu_id: MenuId,
  /// 路由
  pub route_path: SmolStr,
  /// 编码
  pub code: SmolStr,
  /// 名称
  pub lbl: SmolStr,
}
