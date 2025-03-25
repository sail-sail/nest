#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use color_eyre::eyre::{Result,eyre};

#[allow(unused_imports)]
use crate::common::context::{
  Options,
  get_auth_id_err,
  get_auth_org_id,
};

use crate::common::gql::model::{PageInput, SortInput};

use super::menu_model::*;
use super::menu_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut MenuSearch,
  options: Option<Options>,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找菜单列表
pub async fn find_all_menu(
  search: Option<MenuSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<MenuModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let menu_models = menu_dao::find_all_menu(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(menu_models)
}

/// 根据条件查找菜单总数
pub async fn find_count_menu(
  search: Option<MenuSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let menu_num = menu_dao::find_count_menu(
    Some(search),
    options,
  ).await?;
  
  Ok(menu_num)
}

/// 根据条件查找第一个菜单
pub async fn find_one_menu(
  search: Option<MenuSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<MenuModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let menu_model = menu_dao::find_one_menu(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(menu_model)
}

/// 根据 id 查找菜单
pub async fn find_by_id_menu(
  menu_id: MenuId,
  options: Option<Options>,
) -> Result<Option<MenuModel>> {
  
  let menu_model = menu_dao::find_by_id_menu(
    menu_id,
    options,
  ).await?;
  
  Ok(menu_model)
}

/// 根据 menu_ids 查找菜单
pub async fn find_by_ids_menu(
  menu_ids: Vec<MenuId>,
  options: Option<Options>,
) -> Result<Vec<MenuModel>> {
  
  let menu_models = menu_dao::find_by_ids_menu(
    menu_ids,
    options,
  ).await?;
  
  Ok(menu_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_menu(
  menu_input: MenuInput,
) -> Result<MenuInput> {
  
  let menu_input = menu_dao::set_id_by_lbl_menu(
    menu_input,
  ).await?;
  
  Ok(menu_input)
}

/// 创建菜单
#[allow(dead_code)]
pub async fn creates_menu(
  menu_inputs: Vec<MenuInput>,
  options: Option<Options>,
) -> Result<Vec<MenuId>> {
  
  let menu_ids = menu_dao::creates_menu(
    menu_inputs,
    options,
  ).await?;
  
  Ok(menu_ids)
}

/// 根据 menu_id 修改菜单
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_menu(
  menu_id: MenuId,
  mut menu_input: MenuInput,
  options: Option<Options>,
) -> Result<MenuId> {
  
  let is_locked = menu_dao::get_is_locked_by_id_menu(
    menu_id.clone(),
    None,
  ).await?;
  
  if is_locked {
    let err_msg = "不能修改已经锁定的 菜单";
    return Err(eyre!(err_msg));
  }
  
  let menu_id = menu_dao::update_by_id_menu(
    menu_id,
    menu_input,
    options.clone(),
  ).await?;
  
  Ok(menu_id)
}

/// 校验菜单是否存在
#[allow(dead_code)]
pub async fn validate_option_menu(
  menu_model: Option<MenuModel>,
) -> Result<MenuModel> {
  
  let menu_model = menu_dao::validate_option_menu(menu_model).await?;
  
  Ok(menu_model)
}

/// 根据 menu_ids 删除菜单
#[allow(dead_code)]
pub async fn delete_by_ids_menu(
  menu_ids: Vec<MenuId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let old_models = menu_dao::find_all_menu(
    Some(MenuSearch {
      ids: Some(menu_ids.clone()),
      ..Default::default()
    }),
    None,
    None,
    options.clone(),
  ).await?;
  
  for old_model in &old_models {
    if old_model.is_locked == 1 {
      let err_msg = "不能删除已经锁定的 菜单";
      return Err(eyre!(err_msg));
    }
  }
  
  let num = menu_dao::delete_by_ids_menu(
    menu_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 menu_id 查找菜单是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id_menu(
  menu_id: MenuId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = menu_dao::get_is_enabled_by_id_menu(
    menu_id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 menu_ids 启用或者禁用菜单
#[allow(dead_code)]
pub async fn enable_by_ids_menu(
  menu_ids: Vec<MenuId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = menu_dao::enable_by_ids_menu(
    menu_ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 menu_id 查找菜单是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_locked_by_id_menu(
  menu_id: MenuId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_locked = menu_dao::get_is_locked_by_id_menu(
    menu_id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 menu_ids 锁定或者解锁菜单
#[allow(dead_code)]
pub async fn lock_by_ids_menu(
  menu_ids: Vec<MenuId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = menu_dao::lock_by_ids_menu(
    menu_ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取菜单字段注释
pub async fn get_field_comments_menu(
  options: Option<Options>,
) -> Result<MenuFieldComment> {
  
  let comments = menu_dao::get_field_comments_menu(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 menu_ids 还原菜单
#[allow(dead_code)]
pub async fn revert_by_ids_menu(
  menu_ids: Vec<MenuId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = menu_dao::revert_by_ids_menu(
    menu_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 menu_ids 彻底删除菜单
#[allow(dead_code)]
pub async fn force_delete_by_ids_menu(
  menu_ids: Vec<MenuId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = menu_dao::force_delete_by_ids_menu(
    menu_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 菜单 order_by 字段的最大值
pub async fn find_last_order_by_menu(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = menu_dao::find_last_order_by_menu(
    options,
  ).await?;
  
  Ok(res)
}
