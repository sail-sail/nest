use color_eyre::eyre::Result;

use crate::common::context::{
  Options,
  get_auth_id_err,
};

use crate::gen::base::usr::usr_dao::{
  find_by_id as find_by_id_usr,
  validate_option as validate_option_usr,
  validate_is_enabled as validate_is_enabled_usr,
};

use crate::gen::base::role::role_dao::find_all as find_all_role;
use crate::gen::base::role::role_model::RoleSearch;

use crate::gen::base::field_permit::field_permit_dao::find_all as find_all_field_permit;
use crate::gen::base::field_permit::field_permit_model::FieldPermitSearch;

use crate::gen::base::menu::menu_dao::find_one as find_one_menu;
use crate::gen::base::menu::menu_model::MenuSearch;

/// 字段权限
pub async fn get_field_permit(
  route_path: String,
) -> Result<Option<Vec<String>>> {
  
  if route_path.is_empty() {
    return Ok(None);
  }
  
  let options = Options::new()
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let usr_id = get_auth_id_err()?;
  
  let usr_model = validate_option_usr(
    find_by_id_usr(
      usr_id,
      options.clone(),
    ).await?,
  ).await?;
  validate_is_enabled_usr(&usr_model).await?;
  
  let role_ids = usr_model.role_ids;
  
  // let username = usr_model.username;
  // if username == "admin" {
  //   return Ok(None);
  // }
  
  let menu_model = find_one_menu(
    MenuSearch {
      route_path: Some(route_path),
      ..Default::default()
    }.into(),
    None,
    options.clone(),
  ).await?;
  
  if menu_model.is_none() {
    return Ok(None);
  }
  let menu_model = menu_model.unwrap();
  
  let menu_id = menu_model.id;
  
  let role_models = find_all_role(
    RoleSearch {
      ids: Some(role_ids),
      ..Default::default()
    }.into(),
    None,
    None,
    options.clone(),
  ).await?;
  
  let field_permit_ids = role_models
    .into_iter()
    .flat_map(|x| x.field_permit_ids)
    .collect::<Vec<_>>();
  
  // 去重
  let field_permit_ids = field_permit_ids
    .into_iter()
    .collect::<std::collections::HashSet<_>>()
    .into_iter()
    .collect::<Vec<_>>();
  
  let field_permit_models = find_all_field_permit(
    FieldPermitSearch {
      ids: Some(field_permit_ids),
      menu_id: Some(vec![menu_id]),
      ..Default::default()
    }.into(),
    None,
    None,
    options,
  ).await?;
  
  let codes = field_permit_models
    .into_iter()
    .map(|x| x.code)
    .collect::<Vec<_>>();
  
  Ok(Some(codes))
}
