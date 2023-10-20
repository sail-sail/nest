use anyhow::Result;
use crate::common::context::Ctx;

use super::menu_service;
use super::menu_model::GetMenus;

/// 首页获取菜单列表
pub async fn get_menus<'a>(
  ctx: &Ctx<'a>,
  r#type: Option<String>,
) -> Result<Vec<GetMenus>> {
  
  let res = menu_service::get_menus(
    ctx,
    r#type,
  ).await?;
  
  Ok(res)
}
