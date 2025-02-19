use color_eyre::eyre::Result;
use tracing::info;

use crate::common::context::get_req_id;

use super::menu_service;
use super::menu_model::GetMenus;

/// 首页获取菜单列表
#[function_name::named]
pub async fn get_menus() -> Result<Vec<GetMenus>> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let res = menu_service::get_menus().await?;
  
  Ok(res)
}
