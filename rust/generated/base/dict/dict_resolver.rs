
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

use super::dict_model::*;
use super::dict_service;

/// 根据搜索条件和分页查找系统字典列表
#[function_name::named]
pub async fn find_all_dict(
  search: Option<DictSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<DictModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_dict(sort.as_deref())?;
  
  let models = dict_service::find_all_dict(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找系统字典总数
#[function_name::named]
pub async fn find_count_dict(
  search: Option<DictSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = dict_service::find_count_dict(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个系统字典
#[function_name::named]
pub async fn find_one_dict(
  search: Option<DictSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<DictModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_dict(sort.as_deref())?;
  
  let model = dict_service::find_one_dict(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据条件查找第一个系统字典, 如果不存在则抛错
#[function_name::named]
pub async fn find_one_ok_dict(
  search: Option<DictSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<DictModel> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_dict(sort.as_deref())?;
  
  let model = dict_service::find_one_ok_dict(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找系统字典
#[function_name::named]
pub async fn find_by_id_dict(
  id: DictId,
  options: Option<Options>,
) -> Result<Option<DictModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = dict_service::find_by_id_dict(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找系统字典, 如果不存在则抛错
#[function_name::named]
pub async fn find_by_id_ok_dict(
  id: DictId,
  options: Option<Options>,
) -> Result<DictModel> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = dict_service::find_by_id_ok_dict(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 ids 查找系统字典
#[function_name::named]
pub async fn find_by_ids_dict(
  ids: Vec<DictId>,
  options: Option<Options>,
) -> Result<Vec<DictModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = dict_service::find_by_ids_dict(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据 ids 查找系统字典, 出现查询不到的 id 则报错
#[function_name::named]
pub async fn find_by_ids_ok_dict(
  ids: Vec<DictId>,
  options: Option<Options>,
) -> Result<Vec<DictModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = dict_service::find_by_ids_ok_dict(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 创建系统字典
#[allow(dead_code)]
#[function_name::named]
pub async fn creates_dict(
  inputs: Vec<DictInput>,
  options: Option<Options>,
) -> Result<Vec<DictId>> {
  
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
    let input = dict_service::set_id_by_lbl_dict(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    get_page_path_dict().to_string(),
    "add".to_owned(),
  ).await?;
  
  let ids = dict_service::creates_dict(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 根据 id 修改系统字典
#[allow(dead_code)]
#[function_name::named]
pub async fn update_by_id_dict(
  id: DictId,
  input: DictInput,
  options: Option<Options>,
) -> Result<DictId> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} input: {input:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = dict_service::set_id_by_lbl_dict(
    input,
  ).await?;
  
  use_permit(
    get_page_path_dict().to_string(),
    "edit".to_owned(),
  ).await?;
  
  let res = dict_service::update_by_id_dict(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除系统字典
#[allow(dead_code)]
#[function_name::named]
pub async fn delete_by_ids_dict(
  ids: Vec<DictId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_page_path_dict().to_string(),
    "delete".to_owned(),
  ).await?;
  
  let num = dict_service::delete_by_ids_dict(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找系统字典是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
#[function_name::named]
pub async fn get_is_enabled_by_id_dict(
  id: DictId,
  options: Option<Options>,
) -> Result<bool> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let is_enabled = dict_service::get_is_enabled_by_id_dict(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用系统字典
#[allow(dead_code)]
#[function_name::named]
pub async fn enable_by_ids_dict(
  ids: Vec<DictId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?} is_enabled: {is_enabled:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_page_path_dict().to_string(),
    "edit".to_owned(),
  ).await?;
  
  let num = dict_service::enable_by_ids_dict(
    ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取系统字典字段注释
#[function_name::named]
pub async fn get_field_comments_dict(
  options: Option<Options>,
) -> Result<DictFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = dict_service::get_field_comments_dict(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原系统字典
#[allow(dead_code)]
#[function_name::named]
pub async fn revert_by_ids_dict(
  ids: Vec<DictId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_page_path_dict().to_string(),
    "delete".to_owned(),
  ).await?;
  
  let num = dict_service::revert_by_ids_dict(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除系统字典
#[allow(dead_code)]
#[function_name::named]
pub async fn force_delete_by_ids_dict(
  ids: Vec<DictId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_page_path_dict().to_string(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = dict_service::force_delete_by_ids_dict(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 系统字典 order_by 字段的最大值
#[function_name::named]
pub async fn find_last_order_by_dict(
  search: Option<DictSearch>,
  options: Option<Options>,
) -> Result<u32> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let order_by = dict_service::find_last_order_by_dict(
    search,
    options,
  ).await?;
  
  Ok(order_by)
}
