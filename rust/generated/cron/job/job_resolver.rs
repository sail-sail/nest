
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

use super::job_model::*;
use super::job_service;

use crate::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找任务列表
#[function_name::named]
pub async fn find_all_job(
  search: Option<JobSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<JobModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_job(sort.as_deref())?;
  
  let models = job_service::find_all_job(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找任务总数
#[function_name::named]
pub async fn find_count_job(
  search: Option<JobSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = job_service::find_count_job(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个任务
#[function_name::named]
pub async fn find_one_job(
  search: Option<JobSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<JobModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_job(sort.as_deref())?;
  
  let model = job_service::find_one_job(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据条件查找第一个任务, 如果不存在则抛错
#[function_name::named]
pub async fn find_one_ok_job(
  search: Option<JobSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<JobModel> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_job(sort.as_deref())?;
  
  let model = job_service::find_one_ok_job(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找任务
#[function_name::named]
pub async fn find_by_id_job(
  id: JobId,
  options: Option<Options>,
) -> Result<Option<JobModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = job_service::find_by_id_job(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找任务, 如果不存在则抛错
#[function_name::named]
pub async fn find_by_id_ok_job(
  id: JobId,
  options: Option<Options>,
) -> Result<JobModel> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = job_service::find_by_id_ok_job(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 ids 查找任务
#[function_name::named]
pub async fn find_by_ids_job(
  ids: Vec<JobId>,
  options: Option<Options>,
) -> Result<Vec<JobModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = job_service::find_by_ids_job(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据 ids 查找任务, 出现查询不到的 id 则报错
#[function_name::named]
pub async fn find_by_ids_ok_job(
  ids: Vec<JobId>,
  options: Option<Options>,
) -> Result<Vec<JobModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = job_service::find_by_ids_ok_job(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 创建任务
#[allow(dead_code)]
#[function_name::named]
pub async fn creates_job(
  inputs: Vec<JobInput>,
  options: Option<Options>,
) -> Result<Vec<JobId>> {
  
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
    let input = job_service::set_id_by_lbl_job(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    get_page_path_job().to_string(),
    "add".to_owned(),
  ).await?;
  
  let ids = job_service::creates_job(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 任务根据id修改租户id
#[allow(dead_code)]
#[function_name::named]
pub async fn update_tenant_by_id_job(
  id: JobId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} tenant_id: {tenant_id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = job_service::update_tenant_by_id_job(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改任务
#[allow(dead_code)]
#[function_name::named]
pub async fn update_by_id_job(
  id: JobId,
  input: JobInput,
  options: Option<Options>,
) -> Result<JobId> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} input: {input:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = job_service::set_id_by_lbl_job(
    input,
  ).await?;
  
  use_permit(
    get_page_path_job().to_string(),
    "edit".to_owned(),
  ).await?;
  
  let res = job_service::update_by_id_job(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除任务
#[allow(dead_code)]
#[function_name::named]
pub async fn delete_by_ids_job(
  ids: Vec<JobId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_page_path_job().to_string(),
    "delete".to_owned(),
  ).await?;
  
  let num = job_service::delete_by_ids_job(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找任务是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
#[function_name::named]
pub async fn get_is_enabled_by_id_job(
  id: JobId,
  options: Option<Options>,
) -> Result<bool> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let is_enabled = job_service::get_is_enabled_by_id_job(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用任务
#[allow(dead_code)]
#[function_name::named]
pub async fn enable_by_ids_job(
  ids: Vec<JobId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?} is_enabled: {is_enabled:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_page_path_job().to_string(),
    "edit".to_owned(),
  ).await?;
  
  let num = job_service::enable_by_ids_job(
    ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找任务是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[allow(dead_code)]
#[function_name::named]
pub async fn get_is_locked_by_id_job(
  id: JobId,
  options: Option<Options>,
) -> Result<bool> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let is_locked = job_service::get_is_locked_by_id_job(
    id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 ids 锁定或者解锁任务
#[allow(dead_code)]
#[function_name::named]
pub async fn lock_by_ids_job(
  ids: Vec<JobId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?} is_locked: {is_locked:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_page_path_job().to_string(),
    "edit".to_owned(),
  ).await?;
  
  let num = job_service::lock_by_ids_job(
    ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取任务字段注释
#[function_name::named]
pub async fn get_field_comments_job(
  options: Option<Options>,
) -> Result<JobFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = job_service::get_field_comments_job(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原任务
#[allow(dead_code)]
#[function_name::named]
pub async fn revert_by_ids_job(
  ids: Vec<JobId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_page_path_job().to_string(),
    "delete".to_owned(),
  ).await?;
  
  let num = job_service::revert_by_ids_job(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除任务
#[allow(dead_code)]
#[function_name::named]
pub async fn force_delete_by_ids_job(
  ids: Vec<JobId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_page_path_job().to_string(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = job_service::force_delete_by_ids_job(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 任务 order_by 字段的最大值
#[function_name::named]
pub async fn find_last_order_by_job(
  options: Option<Options>,
) -> Result<u32> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let res = job_service::find_last_order_by_job(
    options,
  ).await?;
  
  Ok(res)
}
