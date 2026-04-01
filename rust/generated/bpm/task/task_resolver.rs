
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

use super::task_model::*;
use super::task_service;

use crate::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找审批任务列表
#[function_name::named]
pub async fn find_all_task(
  search: Option<TaskSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<TaskModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_task(sort.as_deref())?;
  
  let models = task_service::find_all_task(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找审批任务总数
#[function_name::named]
pub async fn find_count_task(
  search: Option<TaskSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = task_service::find_count_task(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个审批任务
#[function_name::named]
pub async fn find_one_task(
  search: Option<TaskSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<TaskModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_task(sort.as_deref())?;
  
  let model = task_service::find_one_task(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据条件查找第一个审批任务, 如果不存在则抛错
#[function_name::named]
pub async fn find_one_ok_task(
  search: Option<TaskSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<TaskModel> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_task(sort.as_deref())?;
  
  let model = task_service::find_one_ok_task(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找审批任务
#[function_name::named]
pub async fn find_by_id_task(
  id: TaskId,
  options: Option<Options>,
) -> Result<Option<TaskModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = task_service::find_by_id_task(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找审批任务, 如果不存在则抛错
#[function_name::named]
pub async fn find_by_id_ok_task(
  id: TaskId,
  options: Option<Options>,
) -> Result<TaskModel> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = task_service::find_by_id_ok_task(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 ids 查找审批任务
#[function_name::named]
pub async fn find_by_ids_task(
  ids: Vec<TaskId>,
  options: Option<Options>,
) -> Result<Vec<TaskModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = task_service::find_by_ids_task(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据 ids 查找审批任务, 出现查询不到的 id 则报错
#[function_name::named]
pub async fn find_by_ids_ok_task(
  ids: Vec<TaskId>,
  options: Option<Options>,
) -> Result<Vec<TaskModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = task_service::find_by_ids_ok_task(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 创建审批任务
#[allow(dead_code)]
#[function_name::named]
pub async fn creates_task(
  inputs: Vec<TaskInput>,
  options: Option<Options>,
) -> Result<Vec<TaskId>> {
  
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
    let input = task_service::set_id_by_lbl_task(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    SmolStr::new(get_page_path_task()),
    SmolStr::new("add"),
  ).await?;
  
  let ids = task_service::creates_task(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 审批任务根据id修改租户id
#[allow(dead_code)]
#[function_name::named]
pub async fn update_tenant_by_id_task(
  id: TaskId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} tenant_id: {tenant_id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = task_service::update_tenant_by_id_task(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改审批任务
#[allow(dead_code)]
#[function_name::named]
pub async fn update_by_id_task(
  id: TaskId,
  input: TaskInput,
  options: Option<Options>,
) -> Result<TaskId> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} input: {input:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = task_service::set_id_by_lbl_task(
    input,
  ).await?;
  
  use_permit(
    SmolStr::new(get_page_path_task()),
    SmolStr::new("edit"),
  ).await?;
  
  let res = task_service::update_by_id_task(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除审批任务
#[allow(dead_code)]
#[function_name::named]
pub async fn delete_by_ids_task(
  ids: Vec<TaskId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    SmolStr::new(get_page_path_task()),
    SmolStr::new("delete"),
  ).await?;
  
  let num = task_service::delete_by_ids_task(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取审批任务字段注释
#[function_name::named]
pub async fn get_field_comments_task(
  options: Option<Options>,
) -> Result<TaskFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = task_service::get_field_comments_task(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原审批任务
#[allow(dead_code)]
#[function_name::named]
pub async fn revert_by_ids_task(
  ids: Vec<TaskId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    SmolStr::new(get_page_path_task()),
    SmolStr::new("delete"),
  ).await?;
  
  let num = task_service::revert_by_ids_task(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除审批任务
#[allow(dead_code)]
#[function_name::named]
pub async fn force_delete_by_ids_task(
  ids: Vec<TaskId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    SmolStr::new(get_page_path_task()),
    SmolStr::new("force_delete"),
  ).await?;
  
  let num = task_service::force_delete_by_ids_task(
    ids,
    options,
  ).await?;
  
  Ok(num)
}
