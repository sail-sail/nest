use color_eyre::eyre::Result;

use generated::common::context::Options;

use generated::base::menu::menu_dao::{
  find_one_menu,
};
use generated::base::menu::menu_model::MenuSearch;
use generated::base::role::role_dao::find_all_role;
use generated::base::role::role_model::RoleSearch;

use super::menu_dao;
use super::menu_model::{GetMenus, FindMenuAndRoles};

/// 首页获取菜单列表
pub async fn get_menus() -> Result<Vec<GetMenus>> {
  
  let res = menu_dao::get_menus().await?;
  
  Ok(res)
}

/// 查询菜单及其角色信息
pub async fn find_menu_and_roles(
  search: MenuSearch,
  options: Option<Options>,
) -> Result<FindMenuAndRoles> {
  
  // 1. 根据搜索条件查询菜单
  let menu_model = find_one_menu(
    Some(search),
    None,
    options.clone(),
  ).await?;
  
  // 3. 查询拥有此菜单权限的角色列表
  let role_models = if let Some(ref menu_model) = menu_model {
    find_all_role(
      Some(RoleSearch {
        menu_ids: Some(vec![menu_model.id]),
        ..Default::default()
      }),
      None,
      None,
      options.clone(),
    ).await?
  } else {
    vec![]
  };
  
  Ok(FindMenuAndRoles {
    menu_model,
    role_models,
  })
}
