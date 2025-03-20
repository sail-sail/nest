#[allow(unused_imports)]
use std::time::Instant;

use color_eyre::eyre::Result;
use tracing::info;

use crate::common::context::{
  get_req_id,
  Options,
};

use crate::common::gql::model::{PageInput, SortInput};
use crate::src::base::permit::permit_service::use_permit;

use super::background_task_model::*;
use super::background_task_service;

use crate::r#gen::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找后台任务列表
#[function_name::named]
pub async fn find_all(
  search: Option<BackgroundTaskSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<BackgroundTaskModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_background_task(sort.as_deref())?;
  
  let models = background_task_service::find_all(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找后台任务总数
#[function_name::named]
pub async fn find_count(
  search: Option<BackgroundTaskSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = background_task_service::find_count(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个后台任务
#[function_name::named]
pub async fn find_one(
  search: Option<BackgroundTaskSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<BackgroundTaskModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_background_task(sort.as_deref())?;
  
  let model = background_task_service::find_one(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找后台任务
#[function_name::named]
pub async fn find_by_id(
  id: BackgroundTaskId,
  options: Option<Options>,
) -> Result<Option<BackgroundTaskModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = background_task_service::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 ids 查找后台任务
#[function_name::named]
pub async fn find_by_ids(
  ids: Vec<BackgroundTaskId>,
  options: Option<Options>,
) -> Result<Vec<BackgroundTaskModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = background_task_service::find_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 后台任务根据id修改租户id
#[allow(dead_code)]
#[function_name::named]
pub async fn update_tenant_by_id(
  id: BackgroundTaskId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} tenant_id: {tenant_id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = background_task_service::update_tenant_by_id(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 删除后台任务
#[allow(dead_code)]
#[function_name::named]
pub async fn delete_by_ids(
  ids: Vec<BackgroundTaskId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
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
#[function_name::named]
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<BackgroundTaskFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = background_task_service::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原后台任务
#[allow(dead_code)]
#[function_name::named]
pub async fn revert_by_ids(
  ids: Vec<BackgroundTaskId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
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
#[function_name::named]
pub async fn force_delete_by_ids(
  ids: Vec<BackgroundTaskId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
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
