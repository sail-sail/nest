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
) -> Result<i64> {
  
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
pub async fn create(
  input: BackgroundTaskInput,
  options: Option<Options>,
) -> Result<BackgroundTaskId> {
  
  let input = background_task_service::set_id_by_lbl(
    input,
  ).await?;
  
  use_permit(
    "/base/background_task".to_owned(),
    "add".to_owned(),
  ).await?;
  
  let id = background_task_service::create(
    input,
    options,
  ).await?;
  
  Ok(id)
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
  
  let input = background_task_service::set_id_by_lbl(
    input,
  ).await?;
  
  use_permit(
    "/base/background_task".to_owned(),
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
    "/base/background_task".to_owned(),
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
    "/base/background_task".to_owned(),
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
    "/base/background_task".to_owned(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = background_task_service::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}