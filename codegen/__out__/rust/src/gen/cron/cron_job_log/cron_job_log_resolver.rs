#[allow(unused_imports)]
use std::time::Instant;

use anyhow::Result;

use crate::common::context::Options;
use crate::common::gql::model::{PageInput, SortInput};
use crate::src::base::permit::permit_service::use_permit;

use super::cron_job_log_model::*;
use super::cron_job_log_service;

use crate::r#gen::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找定时任务日志列表
pub async fn find_all(
  search: Option<CronJobLogSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<CronJobLogModel>> {
  
  check_sort_cron_job_log(sort.as_deref())?;
  
  let models = cron_job_log_service::find_all(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找定时任务日志总数
pub async fn find_count(
  search: Option<CronJobLogSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = cron_job_log_service::find_count(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个定时任务日志
pub async fn find_one(
  search: Option<CronJobLogSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<CronJobLogModel>> {
  
  check_sort_cron_job_log(sort.as_deref())?;
  
  let model = cron_job_log_service::find_one(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找定时任务日志
pub async fn find_by_id(
  id: CronJobLogId,
  options: Option<Options>,
) -> Result<Option<CronJobLogModel>> {
  
  let model = cron_job_log_service::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 定时任务日志根据id修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id(
  id: CronJobLogId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = cron_job_log_service::update_tenant_by_id(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 删除定时任务日志
#[allow(dead_code)]
pub async fn delete_by_ids(
  ids: Vec<CronJobLogId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    get_route_path_cron_job_log(),
    "delete".to_owned(),
  ).await?;
  
  let num = cron_job_log_service::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取定时任务日志字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<CronJobLogFieldComment> {
  
  let comments = cron_job_log_service::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原定时任务日志
#[allow(dead_code)]
pub async fn revert_by_ids(
  ids: Vec<CronJobLogId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    get_route_path_cron_job_log(),
    "delete".to_owned(),
  ).await?;
  
  let num = cron_job_log_service::revert_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除定时任务日志
#[allow(dead_code)]
pub async fn force_delete_by_ids(
  ids: Vec<CronJobLogId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    get_route_path_cron_job_log(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = cron_job_log_service::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}