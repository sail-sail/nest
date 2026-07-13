use color_eyre::eyre::Result;
use tracing::info;

use generated::common::context::{
  Options,
  get_req_id,
};
use generated::base::menu::menu_model::MenuSearch;
use generated::common::gql::model::{PageInput, SortInput};
use generated::scrm::uni_menu::uni_menu_model::{UniMenuModel, UniMenuSearch};

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

/// 根据当前用户权限获取手机端首页菜单列表
#[function_name::named]
pub async fn get_uni_menus(
  search: Option<UniMenuSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<UniMenuModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let res = menu_service::get_uni_menus(
    search,
    page,
    sort,
    options,
  ).await?;
  
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
