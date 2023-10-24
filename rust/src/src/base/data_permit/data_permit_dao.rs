use anyhow::Result;

use crate::common::context::Ctx;

use crate::gen::base::menu::menu_dao::find_one as find_one_menu;
use crate::gen::base::menu::menu_model::MenuSearch;

use crate::gen::base::data_permit::data_permit_dao::find_all as find_all_permit;
use crate::gen::base::data_permit::data_permit_model::{
  DataPermitModel,
  DataPermitSearch,
};

/// 获取数据权限列表
#[allow(dead_code)]
pub async fn get_data_permits(
  ctx: &Ctx,
  route_path: String,
) -> Result<Vec<DataPermitModel>> {
  
  let menu_model = find_one_menu(
    ctx,
    MenuSearch {
      route_path: Some(route_path),
      ..Default::default()
    }.into(),
    None,
    None,
  ).await?;
  
  if menu_model.is_none() {
    return Ok(vec![]);
  }
  let menu_model = menu_model.unwrap();
  
  let data_permit_models = find_all_permit(
    ctx,
    DataPermitSearch {
      menu_id: vec![menu_model.id].into(),
      ..Default::default()
    }.into(),
    None,
    None,
    None,
  ).await?;
  
  Ok(data_permit_models)
}
