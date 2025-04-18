use color_eyre::eyre::Result;

use crate::common::context::get_auth_tenant_id;

use crate::r#gen::base::tenant::tenant_dao;

use crate::r#gen::base::menu::menu_model::MenuId;

/// 当前租户拥有的菜单
pub async fn get_menu_ids_by_tenant() -> Result<Vec<MenuId>> {
  
  let tenant_id = get_auth_tenant_id();
  if tenant_id.is_none() {
    return Ok(vec![]);
  }
  let tenant_id = tenant_id.unwrap();
  let tenant_model = tenant_dao::find_by_id_tenant(
    tenant_id,
    None,
  ).await?;
  if tenant_model.is_none() {
    return Ok(vec![]);
  }
  let tenant_model = tenant_model.unwrap();
  let menu_ids = tenant_model.menu_ids;
  Ok(menu_ids)
}

pub async fn filter_menu_ids_by_tenant(
  menu_ids: Vec<MenuId>,
) -> Result<Vec<MenuId>> {
  let tenant_menu_ids = get_menu_ids_by_tenant().await?;
  let mut menu_ids2 = vec![];
  for menu_id in menu_ids {
    if tenant_menu_ids.contains(&menu_id) {
      menu_ids2.push(menu_id);
    }
  }
  Ok(menu_ids2)
}
