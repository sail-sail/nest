#[allow(unused_imports)]
use std::time::Instant;

use anyhow::Result;

use crate::common::context::Options;
use crate::common::gql::model::{PageInput, SortInput};
use crate::src::base::permit::permit_service::use_permit;

use super::job_model::*;
use super::job_service;

use crate::r#gen::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找任务列表
pub async fn find_all(
  search: Option<JobSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<JobModel>> {
  
  check_sort_job(sort.as_deref())?;
  
  let models = job_service::find_all(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找任务总数
pub async fn find_count(
  search: Option<JobSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = job_service::find_count(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个任务
pub async fn find_one(
  search: Option<JobSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<JobModel>> {
  
  check_sort_job(sort.as_deref())?;
  
  let model = job_service::find_one(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找任务
pub async fn find_by_id(
  id: JobId,
  options: Option<Options>,
) -> Result<Option<JobModel>> {
  
  let model = job_service::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 创建任务
#[allow(dead_code)]
pub async fn creates(
  inputs: Vec<JobInput>,
  options: Option<Options>,
) -> Result<Vec<JobId>> {
  
  let mut inputs = inputs;
  for input in &mut inputs {
    input.id = None;
  }
  let inputs = inputs;
  
  let mut inputs2 = Vec::with_capacity(inputs.len());
  for input in inputs {
    let input = job_service::set_id_by_lbl(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    get_route_path_job(),
    "add".to_owned(),
  ).await?;
  
  let ids = job_service::creates(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 任务根据id修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id(
  id: JobId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = job_service::update_tenant_by_id(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改任务
#[allow(dead_code)]
pub async fn update_by_id(
  id: JobId,
  input: JobInput,
  options: Option<Options>,
) -> Result<JobId> {
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = job_service::set_id_by_lbl(
    input,
  ).await?;
  
  use_permit(
    get_route_path_job(),
    "edit".to_owned(),
  ).await?;
  
  let res = job_service::update_by_id(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除任务
#[allow(dead_code)]
pub async fn delete_by_ids(
  ids: Vec<JobId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    get_route_path_job(),
    "delete".to_owned(),
  ).await?;
  
  let num = job_service::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找任务是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id(
  id: JobId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = job_service::get_is_enabled_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用任务
#[allow(dead_code)]
pub async fn enable_by_ids(
  ids: Vec<JobId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    get_route_path_job(),
    "edit".to_owned(),
  ).await?;
  
  let num = job_service::enable_by_ids(
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
pub async fn get_is_locked_by_id(
  id: JobId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_locked = job_service::get_is_locked_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 ids 锁定或者解锁任务
#[allow(dead_code)]
pub async fn lock_by_ids(
  ids: Vec<JobId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    get_route_path_job(),
    "edit".to_owned(),
  ).await?;
  
  let num = job_service::lock_by_ids(
    ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取任务字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<JobFieldComment> {
  
  let comments = job_service::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原任务
#[allow(dead_code)]
pub async fn revert_by_ids(
  ids: Vec<JobId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    get_route_path_job(),
    "delete".to_owned(),
  ).await?;
  
  let num = job_service::revert_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除任务
#[allow(dead_code)]
pub async fn force_delete_by_ids(
  ids: Vec<JobId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    get_route_path_job(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = job_service::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 任务 order_by 字段的最大值
pub async fn find_last_order_by(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = job_service::find_last_order_by(
    options,
  ).await?;
  
  Ok(res)
}