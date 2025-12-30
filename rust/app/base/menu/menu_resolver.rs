use color_eyre::eyre::Result;
use tracing::info;

use generated::common::context::{
  Options,
  get_req_id,
};
use generated::base::menu::menu_model::MenuSearch;

use super::menu_service;
use super::menu_model::{GetMenus, FindMenuAndRoles};

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

/// 查询菜单及其角色信息
#[function_name::named]
pub async fn find_menu_and_roles(
  search: MenuSearch,
  options: Option<Options>,
) -> Result<FindMenuAndRoles> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let res = menu_service::find_menu_and_roles(
    search,
    options,
  ).await?;
  
  Ok(res)
}
