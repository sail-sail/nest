#[allow(unused_imports)]
use std::time::Instant;

use anyhow::Result;

use crate::common::context::Options;
use crate::common::gql::model::{PageInput, SortInput};
use crate::src::base::permit::permit_service::use_permit;

use super::cron_job_log_detail_model::*;
use super::cron_job_log_detail_service;

use crate::r#gen::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找定时任务日志明细列表
pub async fn find_all(
  search: Option<CronJobLogDetailSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<CronJobLogDetailModel>> {
  
  check_sort_cron_job_log_detail(sort.as_deref())?;
  
  let models = cron_job_log_detail_service::find_all(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找定时任务日志明细总数
pub async fn find_count(
  search: Option<CronJobLogDetailSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = cron_job_log_detail_service::find_count(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个定时任务日志明细
pub async fn find_one(
  search: Option<CronJobLogDetailSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<CronJobLogDetailModel>> {
  
  check_sort_cron_job_log_detail(sort.as_deref())?;
  
  let model = cron_job_log_detail_service::find_one(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找定时任务日志明细
pub async fn find_by_id(
  id: CronJobLogDetailId,
  options: Option<Options>,
) -> Result<Option<CronJobLogDetailModel>> {
  
  let model = cron_job_log_detail_service::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 定时任务日志明细根据id修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id(
  id: CronJobLogDetailId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = cron_job_log_detail_service::update_tenant_by_id(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 删除定时任务日志明细
#[allow(dead_code)]
pub async fn delete_by_ids(
  ids: Vec<CronJobLogDetailId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    get_route_path_cron_job_log_detail(),
    "delete".to_owned(),
  ).await?;
  
  let num = cron_job_log_detail_service::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取定时任务日志明细字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<CronJobLogDetailFieldComment> {
  
  let comments = cron_job_log_detail_service::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原定时任务日志明细
#[allow(dead_code)]
pub async fn revert_by_ids(
  ids: Vec<CronJobLogDetailId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    get_route_path_cron_job_log_detail(),
    "delete".to_owned(),
  ).await?;
  
  let num = cron_job_log_detail_service::revert_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除定时任务日志明细
#[allow(dead_code)]
pub async fn force_delete_by_ids(
  ids: Vec<CronJobLogDetailId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    get_route_path_cron_job_log_detail(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = cron_job_log_detail_service::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}
