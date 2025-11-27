
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

use super::cron_job_log_model::*;
use super::cron_job_log_service;

use crate::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找定时任务日志列表
#[function_name::named]
pub async fn find_all_cron_job_log(
  search: Option<CronJobLogSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<CronJobLogModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_cron_job_log(sort.as_deref())?;
  
  let models = cron_job_log_service::find_all_cron_job_log(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找定时任务日志总数
#[function_name::named]
pub async fn find_count_cron_job_log(
  search: Option<CronJobLogSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = cron_job_log_service::find_count_cron_job_log(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个定时任务日志
#[function_name::named]
pub async fn find_one_cron_job_log(
  search: Option<CronJobLogSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<CronJobLogModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_cron_job_log(sort.as_deref())?;
  
  let model = cron_job_log_service::find_one_cron_job_log(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据条件查找第一个定时任务日志, 如果不存在则抛错
#[function_name::named]
pub async fn find_one_ok_cron_job_log(
  search: Option<CronJobLogSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<CronJobLogModel> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_cron_job_log(sort.as_deref())?;
  
  let model = cron_job_log_service::find_one_ok_cron_job_log(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找定时任务日志
#[function_name::named]
pub async fn find_by_id_cron_job_log(
  id: CronJobLogId,
  options: Option<Options>,
) -> Result<Option<CronJobLogModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = cron_job_log_service::find_by_id_cron_job_log(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找定时任务日志, 如果不存在则抛错
#[function_name::named]
pub async fn find_by_id_ok_cron_job_log(
  id: CronJobLogId,
  options: Option<Options>,
) -> Result<CronJobLogModel> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = cron_job_log_service::find_by_id_ok_cron_job_log(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 ids 查找定时任务日志
#[function_name::named]
pub async fn find_by_ids_cron_job_log(
  ids: Vec<CronJobLogId>,
  options: Option<Options>,
) -> Result<Vec<CronJobLogModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = cron_job_log_service::find_by_ids_cron_job_log(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据 ids 查找定时任务日志, 出现查询不到的 id 则报错
#[function_name::named]
pub async fn find_by_ids_ok_cron_job_log(
  ids: Vec<CronJobLogId>,
  options: Option<Options>,
) -> Result<Vec<CronJobLogModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = cron_job_log_service::find_by_ids_ok_cron_job_log(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 定时任务日志根据id修改租户id
#[allow(dead_code)]
#[function_name::named]
pub async fn update_tenant_by_id_cron_job_log(
  id: CronJobLogId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} tenant_id: {tenant_id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = cron_job_log_service::update_tenant_by_id_cron_job_log(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 删除定时任务日志
#[allow(dead_code)]
#[function_name::named]
pub async fn delete_by_ids_cron_job_log(
  ids: Vec<CronJobLogId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_page_path_cron_job_log().to_string(),
    "delete".to_owned(),
  ).await?;
  
  let num = cron_job_log_service::delete_by_ids_cron_job_log(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取定时任务日志字段注释
#[function_name::named]
pub async fn get_field_comments_cron_job_log(
  options: Option<Options>,
) -> Result<CronJobLogFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = cron_job_log_service::get_field_comments_cron_job_log(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原定时任务日志
#[allow(dead_code)]
#[function_name::named]
pub async fn revert_by_ids_cron_job_log(
  ids: Vec<CronJobLogId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_page_path_cron_job_log().to_string(),
    "delete".to_owned(),
  ).await?;
  
  let num = cron_job_log_service::revert_by_ids_cron_job_log(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除定时任务日志
#[allow(dead_code)]
#[function_name::named]
pub async fn force_delete_by_ids_cron_job_log(
  ids: Vec<CronJobLogId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_page_path_cron_job_log().to_string(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = cron_job_log_service::force_delete_by_ids_cron_job_log(
    ids,
    options,
  ).await?;
  
  Ok(num)
}
