#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use color_eyre::eyre::{Result,eyre};

#[allow(unused_imports)]
use crate::common::context::{
  Options,
  get_auth_id_err,
  get_auth_org_id,
};

use crate::common::gql::model::{PageInput, SortInput};

use crate::r#gen::base::tenant::tenant_model::TenantId;

use super::cron_job_log_detail_model::*;
use super::cron_job_log_detail_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut CronJobLogDetailSearch,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找定时任务日志明细列表
pub async fn find_all(
  search: Option<CronJobLogDetailSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<CronJobLogDetailModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(&mut search).await?;
  
  let res = cron_job_log_detail_dao::find_all(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找定时任务日志明细总数
pub async fn find_count(
  search: Option<CronJobLogDetailSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(&mut search).await?;
  
  let res = cron_job_log_detail_dao::find_count(
    Some(search),
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找第一个定时任务日志明细
pub async fn find_one(
  search: Option<CronJobLogDetailSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<CronJobLogDetailModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(&mut search).await?;
  
  let model = cron_job_log_detail_dao::find_one(
    Some(search),
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
  
  let model = cron_job_log_detail_dao::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl(
  input: CronJobLogDetailInput,
) -> Result<CronJobLogDetailInput> {
  
  let input = cron_job_log_detail_dao::set_id_by_lbl(
    input,
  ).await?;
  
  Ok(input)
}

/// 创建定时任务日志明细
#[allow(dead_code)]
pub async fn creates(
  inputs: Vec<CronJobLogDetailInput>,
  options: Option<Options>,
) -> Result<Vec<CronJobLogDetailId>> {
  
  let cron_job_log_detail_ids = cron_job_log_detail_dao::creates(
    inputs,
    options,
  ).await?;
  
  Ok(cron_job_log_detail_ids)
}

/// 定时任务日志明细根据id修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id(
  id: CronJobLogDetailId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = cron_job_log_detail_dao::update_tenant_by_id(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改定时任务日志明细
#[allow(dead_code, unused_mut)]
pub async fn update_by_id(
  id: CronJobLogDetailId,
  mut input: CronJobLogDetailInput,
  options: Option<Options>,
) -> Result<CronJobLogDetailId> {
  
  let cron_job_log_detail_id = cron_job_log_detail_dao::update_by_id(
    id,
    input,
    options,
  ).await?;
  
  Ok(cron_job_log_detail_id)
}

/// 根据 ids 删除定时任务日志明细
#[allow(dead_code)]
pub async fn delete_by_ids(
  ids: Vec<CronJobLogDetailId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = cron_job_log_detail_dao::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取定时任务日志明细字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<CronJobLogDetailFieldComment> {
  
  let comments = cron_job_log_detail_dao::get_field_comments(
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
  
  let num = cron_job_log_detail_dao::revert_by_ids(
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
  
  let num = cron_job_log_detail_dao::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}
