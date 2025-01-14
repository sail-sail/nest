use color_eyre::eyre::Result;

use super::menu_service;
use super::menu_model::GetMenus;

/// 首页获取菜单列表
pub async fn get_menus() -> Result<Vec<GetMenus>> {
  
  let res = menu_service::get_menus().await?;
  
  Ok(res)
}
