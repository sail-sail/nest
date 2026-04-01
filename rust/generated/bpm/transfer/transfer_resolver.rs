
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

#[allow(unused_imports)]
use smol_str::SmolStr;

use crate::common::gql::model::{PageInput, SortInput};
#[allow(unused_imports)]
use crate::common::permit::permit_service::use_permit;

use super::transfer_model::*;
use super::transfer_service;

use crate::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找转交记录列表
#[function_name::named]
pub async fn find_all_transfer(
  search: Option<TransferSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<TransferModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_transfer(sort.as_deref())?;
  
  let models = transfer_service::find_all_transfer(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找转交记录总数
#[function_name::named]
pub async fn find_count_transfer(
  search: Option<TransferSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = transfer_service::find_count_transfer(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个转交记录
#[function_name::named]
pub async fn find_one_transfer(
  search: Option<TransferSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<TransferModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_transfer(sort.as_deref())?;
  
  let model = transfer_service::find_one_transfer(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据条件查找第一个转交记录, 如果不存在则抛错
#[function_name::named]
pub async fn find_one_ok_transfer(
  search: Option<TransferSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<TransferModel> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_transfer(sort.as_deref())?;
  
  let model = transfer_service::find_one_ok_transfer(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找转交记录
#[function_name::named]
pub async fn find_by_id_transfer(
  id: TransferId,
  options: Option<Options>,
) -> Result<Option<TransferModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = transfer_service::find_by_id_transfer(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找转交记录, 如果不存在则抛错
#[function_name::named]
pub async fn find_by_id_ok_transfer(
  id: TransferId,
  options: Option<Options>,
) -> Result<TransferModel> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = transfer_service::find_by_id_ok_transfer(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 ids 查找转交记录
#[function_name::named]
pub async fn find_by_ids_transfer(
  ids: Vec<TransferId>,
  options: Option<Options>,
) -> Result<Vec<TransferModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = transfer_service::find_by_ids_transfer(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据 ids 查找转交记录, 出现查询不到的 id 则报错
#[function_name::named]
pub async fn find_by_ids_ok_transfer(
  ids: Vec<TransferId>,
  options: Option<Options>,
) -> Result<Vec<TransferModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = transfer_service::find_by_ids_ok_transfer(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 创建转交记录
#[allow(dead_code)]
#[function_name::named]
pub async fn creates_transfer(
  inputs: Vec<TransferInput>,
  options: Option<Options>,
) -> Result<Vec<TransferId>> {
  
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
    let input = transfer_service::set_id_by_lbl_transfer(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    SmolStr::new(get_page_path_transfer()),
    SmolStr::new("add"),
  ).await?;
  
  let ids = transfer_service::creates_transfer(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 转交记录根据id修改租户id
#[allow(dead_code)]
#[function_name::named]
pub async fn update_tenant_by_id_transfer(
  id: TransferId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} tenant_id: {tenant_id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = transfer_service::update_tenant_by_id_transfer(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改转交记录
#[allow(dead_code)]
#[function_name::named]
pub async fn update_by_id_transfer(
  id: TransferId,
  input: TransferInput,
  options: Option<Options>,
) -> Result<TransferId> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} input: {input:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = transfer_service::set_id_by_lbl_transfer(
    input,
  ).await?;
  
  use_permit(
    SmolStr::new(get_page_path_transfer()),
    SmolStr::new("edit"),
  ).await?;
  
  let res = transfer_service::update_by_id_transfer(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除转交记录
#[allow(dead_code)]
#[function_name::named]
pub async fn delete_by_ids_transfer(
  ids: Vec<TransferId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    SmolStr::new(get_page_path_transfer()),
    SmolStr::new("delete"),
  ).await?;
  
  let num = transfer_service::delete_by_ids_transfer(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取转交记录字段注释
#[function_name::named]
pub async fn get_field_comments_transfer(
  options: Option<Options>,
) -> Result<TransferFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = transfer_service::get_field_comments_transfer(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原转交记录
#[allow(dead_code)]
#[function_name::named]
pub async fn revert_by_ids_transfer(
  ids: Vec<TransferId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    SmolStr::new(get_page_path_transfer()),
    SmolStr::new("delete"),
  ).await?;
  
  let num = transfer_service::revert_by_ids_transfer(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除转交记录
#[allow(dead_code)]
#[function_name::named]
pub async fn force_delete_by_ids_transfer(
  ids: Vec<TransferId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    SmolStr::new(get_page_path_transfer()),
    SmolStr::new("force_delete"),
  ).await?;
  
  let num = transfer_service::force_delete_by_ids_transfer(
    ids,
    options,
  ).await?;
  
  Ok(num)
}
