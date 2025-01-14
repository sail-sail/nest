#[allow(unused_imports)]
use std::time::Instant;

use color_eyre::eyre::Result;

use crate::common::context::Options;
use crate::common::gql::model::{PageInput, SortInput};
use crate::src::base::permit::permit_service::use_permit;

use super::cron_job_model::*;
use super::cron_job_service;

use crate::r#gen::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找定时任务列表
pub async fn find_all(
  search: Option<CronJobSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<CronJobModel>> {
  
  check_sort_cron_job(sort.as_deref())?;
  
  let models = cron_job_service::find_all(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找定时任务总数
pub async fn find_count(
  search: Option<CronJobSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = cron_job_service::find_count(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个定时任务
pub async fn find_one(
  search: Option<CronJobSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<CronJobModel>> {
  
  check_sort_cron_job(sort.as_deref())?;
  
  let model = cron_job_service::find_one(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找定时任务
pub async fn find_by_id(
  id: CronJobId,
  options: Option<Options>,
) -> Result<Option<CronJobModel>> {
  
  let model = cron_job_service::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 创建定时任务
#[allow(dead_code)]
pub async fn creates(
  inputs: Vec<CronJobInput>,
  options: Option<Options>,
) -> Result<Vec<CronJobId>> {
  
  let mut inputs = inputs;
  for input in &mut inputs {
    input.id = None;
  }
  let inputs = inputs;
  
  let mut inputs2 = Vec::with_capacity(inputs.len());
  for input in inputs {
    let input = cron_job_service::set_id_by_lbl(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    get_route_path_cron_job(),
    "add".to_owned(),
  ).await?;
  
  let ids = cron_job_service::creates(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 定时任务根据id修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id(
  id: CronJobId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = cron_job_service::update_tenant_by_id(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改定时任务
#[allow(dead_code)]
pub async fn update_by_id(
  id: CronJobId,
  input: CronJobInput,
  options: Option<Options>,
) -> Result<CronJobId> {
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = cron_job_service::set_id_by_lbl(
    input,
  ).await?;
  
  use_permit(
    get_route_path_cron_job(),
    "edit".to_owned(),
  ).await?;
  
  let res = cron_job_service::update_by_id(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除定时任务
#[allow(dead_code)]
pub async fn delete_by_ids(
  ids: Vec<CronJobId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    get_route_path_cron_job(),
    "delete".to_owned(),
  ).await?;
  
  let num = cron_job_service::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找定时任务是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id(
  id: CronJobId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = cron_job_service::get_is_enabled_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用定时任务
#[allow(dead_code)]
pub async fn enable_by_ids(
  ids: Vec<CronJobId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    get_route_path_cron_job(),
    "edit".to_owned(),
  ).await?;
  
  let num = cron_job_service::enable_by_ids(
    ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找定时任务是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_locked_by_id(
  id: CronJobId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_locked = cron_job_service::get_is_locked_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 ids 锁定或者解锁定时任务
#[allow(dead_code)]
pub async fn lock_by_ids(
  ids: Vec<CronJobId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    get_route_path_cron_job(),
    "edit".to_owned(),
  ).await?;
  
  let num = cron_job_service::lock_by_ids(
    ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取定时任务字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<CronJobFieldComment> {
  
  let comments = cron_job_service::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原定时任务
#[allow(dead_code)]
pub async fn revert_by_ids(
  ids: Vec<CronJobId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    get_route_path_cron_job(),
    "delete".to_owned(),
  ).await?;
  
  let num = cron_job_service::revert_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除定时任务
#[allow(dead_code)]
pub async fn force_delete_by_ids(
  ids: Vec<CronJobId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    get_route_path_cron_job(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = cron_job_service::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 定时任务 order_by 字段的最大值
pub async fn find_last_order_by(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = cron_job_service::find_last_order_by(
    options,
  ).await?;
  
  Ok(res)
}
