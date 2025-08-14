
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

use super::domain_model::*;
use super::domain_service;

/// 根据搜索条件和分页查找域名列表
#[function_name::named]
pub async fn find_all_domain(
  search: Option<DomainSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<DomainModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_domain(sort.as_deref())?;
  
  let models = domain_service::find_all_domain(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找域名总数
#[function_name::named]
pub async fn find_count_domain(
  search: Option<DomainSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = domain_service::find_count_domain(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个域名
#[function_name::named]
pub async fn find_one_domain(
  search: Option<DomainSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<DomainModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_domain(sort.as_deref())?;
  
  let model = domain_service::find_one_domain(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据条件查找第一个域名, 如果不存在则抛错
#[function_name::named]
pub async fn find_one_ok_domain(
  search: Option<DomainSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<DomainModel> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_domain(sort.as_deref())?;
  
  let model = domain_service::find_one_ok_domain(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找域名
#[function_name::named]
pub async fn find_by_id_domain(
  id: DomainId,
  options: Option<Options>,
) -> Result<Option<DomainModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = domain_service::find_by_id_domain(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找域名, 如果不存在则抛错
#[function_name::named]
pub async fn find_by_id_ok_domain(
  id: DomainId,
  options: Option<Options>,
) -> Result<DomainModel> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = domain_service::find_by_id_ok_domain(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 ids 查找域名
#[function_name::named]
pub async fn find_by_ids_domain(
  ids: Vec<DomainId>,
  options: Option<Options>,
) -> Result<Vec<DomainModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = domain_service::find_by_ids_domain(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据 ids 查找域名, 出现查询不到的 id 则报错
#[function_name::named]
pub async fn find_by_ids_ok_domain(
  ids: Vec<DomainId>,
  options: Option<Options>,
) -> Result<Vec<DomainModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = domain_service::find_by_ids_ok_domain(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 创建域名
#[allow(dead_code)]
#[function_name::named]
pub async fn creates_domain(
  inputs: Vec<DomainInput>,
  options: Option<Options>,
) -> Result<Vec<DomainId>> {
  
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
    let input = domain_service::set_id_by_lbl_domain(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    get_route_path_domain(),
    "add".to_owned(),
  ).await?;
  
  let ids = domain_service::creates_domain(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 根据 id 修改域名
#[allow(dead_code)]
#[function_name::named]
pub async fn update_by_id_domain(
  id: DomainId,
  input: DomainInput,
  options: Option<Options>,
) -> Result<DomainId> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} input: {input:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = domain_service::set_id_by_lbl_domain(
    input,
  ).await?;
  
  use_permit(
    get_route_path_domain(),
    "edit".to_owned(),
  ).await?;
  
  let res = domain_service::update_by_id_domain(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除域名
#[allow(dead_code)]
#[function_name::named]
pub async fn delete_by_ids_domain(
  ids: Vec<DomainId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_domain(),
    "delete".to_owned(),
  ).await?;
  
  let num = domain_service::delete_by_ids_domain(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找域名是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
#[function_name::named]
pub async fn get_is_enabled_by_id_domain(
  id: DomainId,
  options: Option<Options>,
) -> Result<bool> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let is_enabled = domain_service::get_is_enabled_by_id_domain(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用域名
#[allow(dead_code)]
#[function_name::named]
pub async fn enable_by_ids_domain(
  ids: Vec<DomainId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?} is_enabled: {is_enabled:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_domain(),
    "edit".to_owned(),
  ).await?;
  
  let num = domain_service::enable_by_ids_domain(
    ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找域名是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[allow(dead_code)]
#[function_name::named]
pub async fn get_is_locked_by_id_domain(
  id: DomainId,
  options: Option<Options>,
) -> Result<bool> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let is_locked = domain_service::get_is_locked_by_id_domain(
    id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 ids 锁定或者解锁域名
#[allow(dead_code)]
#[function_name::named]
pub async fn lock_by_ids_domain(
  ids: Vec<DomainId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?} is_locked: {is_locked:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_domain(),
    "edit".to_owned(),
  ).await?;
  
  let num = domain_service::lock_by_ids_domain(
    ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取域名字段注释
#[function_name::named]
pub async fn get_field_comments_domain(
  options: Option<Options>,
) -> Result<DomainFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = domain_service::get_field_comments_domain(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原域名
#[allow(dead_code)]
#[function_name::named]
pub async fn revert_by_ids_domain(
  ids: Vec<DomainId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_domain(),
    "delete".to_owned(),
  ).await?;
  
  let num = domain_service::revert_by_ids_domain(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除域名
#[allow(dead_code)]
#[function_name::named]
pub async fn force_delete_by_ids_domain(
  ids: Vec<DomainId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_domain(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = domain_service::force_delete_by_ids_domain(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 域名 order_by 字段的最大值
#[function_name::named]
pub async fn find_last_order_by_domain(
  options: Option<Options>,
) -> Result<u32> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let res = domain_service::find_last_order_by_domain(
    options,
  ).await?;
  
  Ok(res)
}
