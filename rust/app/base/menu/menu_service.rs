use std::collections::HashSet;

use color_eyre::eyre::Result;

use generated::common::context::Options;
use generated::common::gql::model::{PageInput, SortInput};
use generated::base::menu::menu_dao::{
  find_one_menu,
};
use generated::base::menu::menu_model::MenuSearch;
use generated::base::role::role_dao::find_all_role;
use generated::base::role::role_model::RoleSearch;
use generated::scrm::uni_menu::uni_menu_model::{UniMenuModel, UniMenuSearch};
use generated::scrm::uni_menu::uni_menu_service as uni_menu_service;

use super::menu_dao;
use super::menu_model::{GetMenus, FindMenuAndRoles};

/// 首页获取菜单列表
pub async fn get_menus() -> Result<Vec<GetMenus>> {
  
  let res = menu_dao::get_menus().await?;
  
  Ok(res)
}

fn filter_uni_menu_models_by_accessible_menu_ids(
  models: Vec<UniMenuModel>,
  accessible_menu_ids: &HashSet<String>,
) -> Vec<UniMenuModel> {
  models.into_iter().filter(|model| {
    accessible_menu_ids.contains(&model.menu_id.to_string())
  }).collect()
}

/// 根据当前用户权限获取手机端首页菜单列表
pub async fn get_uni_menus(
  search: Option<UniMenuSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<UniMenuModel>> {
  let mut search = search.unwrap_or_default();
  if search.is_enabled.is_none() {
    search.is_enabled = Some(vec![1]);
  }

  let accessible_menus = get_menus().await?;
  let accessible_menu_ids: HashSet<String> = accessible_menus
    .into_iter()
    .map(|item| item.id.to_string())
    .collect();

  let uni_menu_models = uni_menu_service::find_all_uni_menu(
    Some(search),
    page,
    sort,
    options,
  ).await?;

  Ok(filter_uni_menu_models_by_accessible_menu_ids(
    uni_menu_models,
    &accessible_menu_ids,
  ))
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
    options,
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
      options,
    ).await?
  } else {
    vec![]
  };
  
  Ok(FindMenuAndRoles {
    menu_model,
    role_models,
  })
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn filter_uni_menu_models_by_accessible_menu_ids_keeps_only_allowed() {
    let mut allowed_model = UniMenuModel::default();
    allowed_model.id = "0123456789012345678901".into();
    allowed_model.menu_id = "0123456789012345678902".into();

    let mut denied_model = UniMenuModel::default();
    denied_model.id = "0123456789012345678903".into();
    denied_model.menu_id = "0123456789012345678904".into();

    let mut accessible_menu_ids = HashSet::new();
    accessible_menu_ids.insert("0123456789012345678902".to_string());

    let filtered = filter_uni_menu_models_by_accessible_menu_ids(
      vec![allowed_model, denied_model],
      &accessible_menu_ids,
    );

    assert_eq!(filtered.len(), 1);
    assert_eq!(filtered[0].id.to_string(), "0123456789012345678901");
  }
}
