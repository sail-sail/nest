
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

use super::log_model::*;
use super::log_service;

use crate::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找流程日志列表
#[function_name::named]
pub async fn find_all_log(
  search: Option<LogSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<LogModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_log(sort.as_deref())?;
  
  let models = log_service::find_all_log(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找流程日志总数
#[function_name::named]
pub async fn find_count_log(
  search: Option<LogSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = log_service::find_count_log(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个流程日志
#[function_name::named]
pub async fn find_one_log(
  search: Option<LogSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<LogModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_log(sort.as_deref())?;
  
  let model = log_service::find_one_log(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据条件查找第一个流程日志, 如果不存在则抛错
#[function_name::named]
pub async fn find_one_ok_log(
  search: Option<LogSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<LogModel> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_log(sort.as_deref())?;
  
  let model = log_service::find_one_ok_log(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找流程日志
#[function_name::named]
pub async fn find_by_id_log(
  id: LogId,
  options: Option<Options>,
) -> Result<Option<LogModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = log_service::find_by_id_log(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找流程日志, 如果不存在则抛错
#[function_name::named]
pub async fn find_by_id_ok_log(
  id: LogId,
  options: Option<Options>,
) -> Result<LogModel> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = log_service::find_by_id_ok_log(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 ids 查找流程日志
#[function_name::named]
pub async fn find_by_ids_log(
  ids: Vec<LogId>,
  options: Option<Options>,
) -> Result<Vec<LogModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = log_service::find_by_ids_log(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据 ids 查找流程日志, 出现查询不到的 id 则报错
#[function_name::named]
pub async fn find_by_ids_ok_log(
  ids: Vec<LogId>,
  options: Option<Options>,
) -> Result<Vec<LogModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = log_service::find_by_ids_ok_log(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 创建流程日志
#[allow(dead_code)]
#[function_name::named]
pub async fn creates_log(
  inputs: Vec<LogInput>,
  options: Option<Options>,
) -> Result<Vec<LogId>> {
  
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
    let input = log_service::set_id_by_lbl_log(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    SmolStr::new(get_page_path_log()),
    SmolStr::new("add"),
  ).await?;
  
  let ids = log_service::creates_log(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 流程日志根据id修改租户id
#[allow(dead_code)]
#[function_name::named]
pub async fn update_tenant_by_id_log(
  id: LogId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} tenant_id: {tenant_id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = log_service::update_tenant_by_id_log(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改流程日志
#[allow(dead_code)]
#[function_name::named]
pub async fn update_by_id_log(
  id: LogId,
  input: LogInput,
  options: Option<Options>,
) -> Result<LogId> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} input: {input:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = log_service::set_id_by_lbl_log(
    input,
  ).await?;
  
  use_permit(
    SmolStr::new(get_page_path_log()),
    SmolStr::new("edit"),
  ).await?;
  
  let res = log_service::update_by_id_log(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除流程日志
#[allow(dead_code)]
#[function_name::named]
pub async fn delete_by_ids_log(
  ids: Vec<LogId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    SmolStr::new(get_page_path_log()),
    SmolStr::new("delete"),
  ).await?;
  
  let num = log_service::delete_by_ids_log(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取流程日志字段注释
#[function_name::named]
pub async fn get_field_comments_log(
  options: Option<Options>,
) -> Result<LogFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = log_service::get_field_comments_log(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原流程日志
#[allow(dead_code)]
#[function_name::named]
pub async fn revert_by_ids_log(
  ids: Vec<LogId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    SmolStr::new(get_page_path_log()),
    SmolStr::new("delete"),
  ).await?;
  
  let num = log_service::revert_by_ids_log(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除流程日志
#[allow(dead_code)]
#[function_name::named]
pub async fn force_delete_by_ids_log(
  ids: Vec<LogId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    SmolStr::new(get_page_path_log()),
    SmolStr::new("force_delete"),
  ).await?;
  
  let num = log_service::force_delete_by_ids_log(
    ids,
    options,
  ).await?;
  
  Ok(num)
}
