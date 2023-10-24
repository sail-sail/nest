use anyhow::Result;
use crate::common::context::Ctx;

use crate::gen::base::tenant::tenant_dao;

/// 当前租户拥有的菜单
pub async fn get_menu_ids_by_tenant(
  ctx: &Ctx,
) -> Result<Vec<String>> {
  let tenant_id = ctx.get_auth_tenant_id();
  if tenant_id.is_none() {
    return Ok(vec![]);
  }
  let tenant_id = tenant_id.unwrap();
  let tenant_model = tenant_dao::find_by_id(
    ctx,
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
  ctx: &Ctx,
  menu_ids: Vec<String>,
) -> Result<Vec<String>> {
  let tenant_menu_ids = get_menu_ids_by_tenant(ctx).await?;
  let mut menu_ids2 = vec![];
  for menu_id in menu_ids {
    if tenant_menu_ids.contains(&menu_id) {
      menu_ids2.push(menu_id);
    }
  }
  Ok(menu_ids2)
}
