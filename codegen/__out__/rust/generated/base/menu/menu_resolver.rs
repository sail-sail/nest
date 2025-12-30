
#![allow(clippy::clone_on_copy)]
#![allow(clippy::redundant_clone)]

#[allow(unused_imports)]
use std::time::Instant;

use color_eyre::eyre::Result;
use tracing::info;

use crate::common::context::{
  get_req_id,
  Options,
};

use crate::common::gql::model::{PageInput, SortInput};
#[allow(unused_imports)]
use crate::common::permit::permit_service::use_permit;

use super::menu_model::*;
use super::menu_service;

/// 根据搜索条件和分页查找菜单列表
#[function_name::named]
pub async fn find_all_menu(
  search: Option<MenuSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<MenuModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let search = Some({
    let mut search = search.unwrap_or_default();
    search.is_hidden = Some(vec![0]);
    search
  });
  
  check_sort_menu(sort.as_deref())?;
  
  let models = menu_service::find_all_menu(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找菜单总数
#[function_name::named]
pub async fn find_count_menu(
  search: Option<MenuSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let search = Some({
    let mut search = search.unwrap_or_default();
    search.is_hidden = Some(vec![0]);
    search
  });
  
  let num = menu_service::find_count_menu(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个菜单
#[function_name::named]
pub async fn find_one_menu(
  search: Option<MenuSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<MenuModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let search = Some({
    let mut search = search.unwrap_or_default();
    search.is_hidden = Some(vec![0]);
    search
  });
  
  check_sort_menu(sort.as_deref())?;
  
  let model = menu_service::find_one_menu(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据条件查找第一个菜单, 如果不存在则抛错
#[function_name::named]
pub async fn find_one_ok_menu(
  search: Option<MenuSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<MenuModel> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let search = Some({
    let mut search = search.unwrap_or_default();
    search.is_hidden = Some(vec![0]);
    search
  });
  
  check_sort_menu(sort.as_deref())?;
  
  let model = menu_service::find_one_ok_menu(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找菜单
#[function_name::named]
pub async fn find_by_id_menu(
  id: MenuId,
  options: Option<Options>,
) -> Result<Option<MenuModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = menu_service::find_by_id_menu(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找菜单, 如果不存在则抛错
#[function_name::named]
pub async fn find_by_id_ok_menu(
  id: MenuId,
  options: Option<Options>,
) -> Result<MenuModel> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = menu_service::find_by_id_ok_menu(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 ids 查找菜单
#[function_name::named]
pub async fn find_by_ids_menu(
  ids: Vec<MenuId>,
  options: Option<Options>,
) -> Result<Vec<MenuModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = menu_service::find_by_ids_menu(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据 ids 查找菜单, 出现查询不到的 id 则报错
#[function_name::named]
pub async fn find_by_ids_ok_menu(
  ids: Vec<MenuId>,
  options: Option<Options>,
) -> Result<Vec<MenuModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = menu_service::find_by_ids_ok_menu(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 创建菜单
#[allow(dead_code)]
#[function_name::named]
pub async fn creates_menu(
  inputs: Vec<MenuInput>,
  options: Option<Options>,
) -> Result<Vec<MenuId>> {
  
  info!(
    "{req_id} {function_name}: inputs: {inputs:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let mut inputs = inputs;
  for input in &mut inputs {
    input.id = None;
  }
  let inputs = inputs;
  
  let mut inputs2 = Vec::with_capacity(inputs.len());
  for input in inputs {
    let input = menu_service::set_id_by_lbl_menu(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    get_page_path_menu().to_string(),
    "add".to_owned(),
  ).await?;
  
  let ids = menu_service::creates_menu(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 根据 id 修改菜单
#[allow(dead_code)]
#[function_name::named]
pub async fn update_by_id_menu(
  id: MenuId,
  input: MenuInput,
  options: Option<Options>,
) -> Result<MenuId> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} input: {input:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = menu_service::set_id_by_lbl_menu(
    input,
  ).await?;
  
  use_permit(
    get_page_path_menu().to_string(),
    "edit".to_owned(),
  ).await?;
  
  let res = menu_service::update_by_id_menu(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除菜单
#[allow(dead_code)]
#[function_name::named]
pub async fn delete_by_ids_menu(
  ids: Vec<MenuId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_page_path_menu().to_string(),
    "delete".to_owned(),
  ).await?;
  
  let num = menu_service::delete_by_ids_menu(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找菜单是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
#[function_name::named]
pub async fn get_is_enabled_by_id_menu(
  id: MenuId,
  options: Option<Options>,
) -> Result<bool> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let is_enabled = menu_service::get_is_enabled_by_id_menu(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用菜单
#[allow(dead_code)]
#[function_name::named]
pub async fn enable_by_ids_menu(
  ids: Vec<MenuId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?} is_enabled: {is_enabled:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_page_path_menu().to_string(),
    "edit".to_owned(),
  ).await?;
  
  let num = menu_service::enable_by_ids_menu(
    ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取菜单字段注释
#[function_name::named]
pub async fn get_field_comments_menu(
  options: Option<Options>,
) -> Result<MenuFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = menu_service::get_field_comments_menu(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原菜单
#[allow(dead_code)]
#[function_name::named]
pub async fn revert_by_ids_menu(
  ids: Vec<MenuId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_page_path_menu().to_string(),
    "delete".to_owned(),
  ).await?;
  
  let num = menu_service::revert_by_ids_menu(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除菜单
#[allow(dead_code)]
#[function_name::named]
pub async fn force_delete_by_ids_menu(
  ids: Vec<MenuId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_page_path_menu().to_string(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = menu_service::force_delete_by_ids_menu(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 菜单 order_by 字段的最大值
#[function_name::named]
pub async fn find_last_order_by_menu(
  search: Option<MenuSearch>,
  options: Option<Options>,
) -> Result<u32> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let order_by = menu_service::find_last_order_by_menu(
    search,
    options,
  ).await?;
  
  Ok(order_by)
}
