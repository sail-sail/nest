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

use super::options_model::*;
use super::options_service;

/// 根据搜索条件和分页查找系统选项列表
#[function_name::named]
pub async fn find_all_options(
  search: Option<OptionsSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<OptionsModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_options(sort.as_deref())?;
  
  let models = options_service::find_all_options(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找系统选项总数
#[function_name::named]
pub async fn find_count_options(
  search: Option<OptionsSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = options_service::find_count_options(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个系统选项
#[function_name::named]
pub async fn find_one_options(
  search: Option<OptionsSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<OptionsModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_options(sort.as_deref())?;
  
  let model = options_service::find_one_options(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找系统选项
#[function_name::named]
pub async fn find_by_id_options(
  id: OptionsId,
  options: Option<Options>,
) -> Result<Option<OptionsModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = options_service::find_by_id_options(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 ids 查找系统选项
#[function_name::named]
pub async fn find_by_ids_options(
  ids: Vec<OptionsId>,
  options: Option<Options>,
) -> Result<Vec<OptionsModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = options_service::find_by_ids_options(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 创建系统选项
#[allow(dead_code)]
#[function_name::named]
pub async fn creates_options(
  inputs: Vec<OptionsInput>,
  options: Option<Options>,
) -> Result<Vec<OptionsId>> {
  
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
    let input = options_service::set_id_by_lbl_options(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    get_route_path_options(),
    "add".to_owned(),
  ).await?;
  
  let ids = options_service::creates_options(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 根据 id 修改系统选项
#[allow(dead_code)]
#[function_name::named]
pub async fn update_by_id_options(
  id: OptionsId,
  input: OptionsInput,
  options: Option<Options>,
) -> Result<OptionsId> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} input: {input:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = options_service::set_id_by_lbl_options(
    input,
  ).await?;
  
  use_permit(
    get_route_path_options(),
    "edit".to_owned(),
  ).await?;
  
  let res = options_service::update_by_id_options(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除系统选项
#[allow(dead_code)]
#[function_name::named]
pub async fn delete_by_ids_options(
  ids: Vec<OptionsId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_options(),
    "delete".to_owned(),
  ).await?;
  
  let num = options_service::delete_by_ids_options(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找系统选项是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
#[function_name::named]
pub async fn get_is_enabled_by_id_options(
  id: OptionsId,
  options: Option<Options>,
) -> Result<bool> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let is_enabled = options_service::get_is_enabled_by_id_options(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用系统选项
#[allow(dead_code)]
#[function_name::named]
pub async fn enable_by_ids_options(
  ids: Vec<OptionsId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?} is_enabled: {is_enabled:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_options(),
    "edit".to_owned(),
  ).await?;
  
  let num = options_service::enable_by_ids_options(
    ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找系统选项是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[allow(dead_code)]
#[function_name::named]
pub async fn get_is_locked_by_id_options(
  id: OptionsId,
  options: Option<Options>,
) -> Result<bool> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let is_locked = options_service::get_is_locked_by_id_options(
    id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 ids 锁定或者解锁系统选项
#[allow(dead_code)]
#[function_name::named]
pub async fn lock_by_ids_options(
  ids: Vec<OptionsId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?} is_locked: {is_locked:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_options(),
    "edit".to_owned(),
  ).await?;
  
  let num = options_service::lock_by_ids_options(
    ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取系统选项字段注释
#[function_name::named]
pub async fn get_field_comments_options(
  options: Option<Options>,
) -> Result<OptionsFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = options_service::get_field_comments_options(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原系统选项
#[allow(dead_code)]
#[function_name::named]
pub async fn revert_by_ids_options(
  ids: Vec<OptionsId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_options(),
    "delete".to_owned(),
  ).await?;
  
  let num = options_service::revert_by_ids_options(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除系统选项
#[allow(dead_code)]
#[function_name::named]
pub async fn force_delete_by_ids_options(
  ids: Vec<OptionsId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_options(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = options_service::force_delete_by_ids_options(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 系统选项 order_by 字段的最大值
#[function_name::named]
pub async fn find_last_order_by_options(
  options: Option<Options>,
) -> Result<u32> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let res = options_service::find_last_order_by_options(
    options,
  ).await?;
  
  Ok(res)
}
