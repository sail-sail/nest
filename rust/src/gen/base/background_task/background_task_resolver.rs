#[allow(unused_imports)]
use std::time::Instant;

use anyhow::Result;

use crate::common::context::Options;
use crate::common::gql::model::{PageInput, SortInput};
use crate::src::base::permit::permit_service::use_permit;

use super::background_task_model::*;
use super::background_task_service;

use crate::gen::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找后台任务列表
pub async fn find_all(
  search: Option<BackgroundTaskSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<BackgroundTaskModel>> {
  
  check_sort_background_task(sort.as_deref())?;
  
  let res = background_task_service::find_all(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找后台任务总数
pub async fn find_count(
  search: Option<BackgroundTaskSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = background_task_service::find_count(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个后台任务
pub async fn find_one(
  search: Option<BackgroundTaskSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<BackgroundTaskModel>> {
  
  check_sort_background_task(sort.as_deref())?;
  
  let model = background_task_service::find_one(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找后台任务
pub async fn find_by_id(
  id: BackgroundTaskId,
  options: Option<Options>,
) -> Result<Option<BackgroundTaskModel>> {
  
  let model = background_task_service::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 创建后台任务
#[allow(dead_code)]
pub async fn creates(
  inputs: Vec<BackgroundTaskInput>,
  options: Option<Options>,
) -> Result<Vec<BackgroundTaskId>> {
  
  let mut inputs = inputs;
  for input in &mut inputs {
    input.id = None;
  }
  let inputs = inputs;
  
  let mut inputs2 = Vec::with_capacity(inputs.len());
  for input in inputs {
    let input = background_task_service::set_id_by_lbl(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    get_route_path_background_task(),
    "add".to_owned(),
  ).await?;
  
  let ids = background_task_service::creates(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 后台任务根据id修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id(
  id: BackgroundTaskId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = background_task_service::update_tenant_by_id(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改后台任务
#[allow(dead_code)]
pub async fn update_by_id(
  id: BackgroundTaskId,
  input: BackgroundTaskInput,
  options: Option<Options>,
) -> Result<BackgroundTaskId> {
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = background_task_service::set_id_by_lbl(
    input,
  ).await?;
  
  use_permit(
    get_route_path_background_task(),
    "edit".to_owned(),
  ).await?;
  
  let res = background_task_service::update_by_id(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除后台任务
#[allow(dead_code)]
pub async fn delete_by_ids(
  ids: Vec<BackgroundTaskId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    get_route_path_background_task(),
    "delete".to_owned(),
  ).await?;
  
  let num = background_task_service::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取后台任务字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<BackgroundTaskFieldComment> {
  
  let comments = background_task_service::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原后台任务
#[allow(dead_code)]
pub async fn revert_by_ids(
  ids: Vec<BackgroundTaskId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    get_route_path_background_task(),
    "delete".to_owned(),
  ).await?;
  
  let num = background_task_service::revert_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除后台任务
#[allow(dead_code)]
pub async fn force_delete_by_ids(
  ids: Vec<BackgroundTaskId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    get_route_path_background_task(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = background_task_service::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}
