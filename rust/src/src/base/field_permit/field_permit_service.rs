use anyhow::Result;

use crate::common::context::Options;

use crate::gen::base::field_permit::field_permit_dao::find_all as find_all_field_permit;
use crate::gen::base::field_permit::field_permit_model::FieldPermitSearch;

use crate::gen::base::menu::menu_dao::find_one as find_one_menu;
use crate::gen::base::menu::menu_model::MenuSearch;

/// 字段权限
pub async fn get_field_permit(
  route_path: String,
) -> Result<Vec<String>> {
  
  if route_path.is_empty() {
    return Ok(vec![]);
  }
  
  let options = Options::new()
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let menu_model = find_one_menu(
    MenuSearch {
      route_path: Some(route_path),
      ..Default::default()
    }.into(),
    None,
    options.clone(),
  ).await?;
  
  if menu_model.is_none() {
    return Ok(vec![]);
  }
  let menu_model = menu_model.unwrap();
  
  let menu_id = menu_model.id;
  
  let field_permit_models = find_all_field_permit(
    FieldPermitSearch {
      menu_id: Some(vec![menu_id]),
      ..Default::default()
    }.into(),
    None,
    None,
    options.clone(),
  ).await?;
  
  let codes = field_permit_models
    .into_iter()
    .map(|x| x.code)
    .collect::<Vec<_>>();
  
  Ok(codes)
}
