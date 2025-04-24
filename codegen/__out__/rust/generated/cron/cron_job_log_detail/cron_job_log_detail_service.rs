#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use color_eyre::eyre::{Result, eyre};

#[allow(unused_imports)]
use crate::common::context::{
  Options,
  get_auth_id_ok,
  get_auth_org_id,
};

use crate::common::gql::model::{PageInput, SortInput};

use crate::base::tenant::tenant_model::TenantId;

use super::cron_job_log_detail_model::*;
use super::cron_job_log_detail_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut CronJobLogDetailSearch,
  options: Option<Options>,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找定时任务日志明细列表
pub async fn find_all_cron_job_log_detail(
  search: Option<CronJobLogDetailSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<CronJobLogDetailModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let cron_job_log_detail_models = cron_job_log_detail_dao::find_all_cron_job_log_detail(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(cron_job_log_detail_models)
}

/// 根据条件查找定时任务日志明细总数
pub async fn find_count_cron_job_log_detail(
  search: Option<CronJobLogDetailSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let cron_job_log_detail_num = cron_job_log_detail_dao::find_count_cron_job_log_detail(
    Some(search),
    options,
  ).await?;
  
  Ok(cron_job_log_detail_num)
}

/// 根据条件查找第一个定时任务日志明细
pub async fn find_one_cron_job_log_detail(
  search: Option<CronJobLogDetailSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<CronJobLogDetailModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let cron_job_log_detail_model = cron_job_log_detail_dao::find_one_cron_job_log_detail(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(cron_job_log_detail_model)
}

/// 根据 id 查找定时任务日志明细
pub async fn find_by_id_cron_job_log_detail(
  cron_job_log_detail_id: CronJobLogDetailId,
  options: Option<Options>,
) -> Result<Option<CronJobLogDetailModel>> {
  
  let cron_job_log_detail_model = cron_job_log_detail_dao::find_by_id_cron_job_log_detail(
    cron_job_log_detail_id,
    options,
  ).await?;
  
  Ok(cron_job_log_detail_model)
}

/// 根据 cron_job_log_detail_ids 查找定时任务日志明细
pub async fn find_by_ids_cron_job_log_detail(
  cron_job_log_detail_ids: Vec<CronJobLogDetailId>,
  options: Option<Options>,
) -> Result<Vec<CronJobLogDetailModel>> {
  
  let cron_job_log_detail_models = cron_job_log_detail_dao::find_by_ids_cron_job_log_detail(
    cron_job_log_detail_ids,
    options,
  ).await?;
  
  Ok(cron_job_log_detail_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_cron_job_log_detail(
  cron_job_log_detail_input: CronJobLogDetailInput,
) -> Result<CronJobLogDetailInput> {
  
  let cron_job_log_detail_input = cron_job_log_detail_dao::set_id_by_lbl_cron_job_log_detail(
    cron_job_log_detail_input,
  ).await?;
  
  Ok(cron_job_log_detail_input)
}

/// 创建定时任务日志明细
#[allow(dead_code)]
pub async fn creates_cron_job_log_detail(
  cron_job_log_detail_inputs: Vec<CronJobLogDetailInput>,
  options: Option<Options>,
) -> Result<Vec<CronJobLogDetailId>> {
  
  let cron_job_log_detail_ids = cron_job_log_detail_dao::creates_cron_job_log_detail(
    cron_job_log_detail_inputs,
    options,
  ).await?;
  
  Ok(cron_job_log_detail_ids)
}

/// 定时任务日志明细根据 cron_job_log_detail_id 修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id_cron_job_log_detail(
  cron_job_log_detail_id: CronJobLogDetailId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = cron_job_log_detail_dao::update_tenant_by_id_cron_job_log_detail(
    cron_job_log_detail_id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 cron_job_log_detail_id 修改定时任务日志明细
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_cron_job_log_detail(
  cron_job_log_detail_id: CronJobLogDetailId,
  mut cron_job_log_detail_input: CronJobLogDetailInput,
  options: Option<Options>,
) -> Result<CronJobLogDetailId> {
  
  let cron_job_log_detail_id = cron_job_log_detail_dao::update_by_id_cron_job_log_detail(
    cron_job_log_detail_id,
    cron_job_log_detail_input,
    options.clone(),
  ).await?;
  
  Ok(cron_job_log_detail_id)
}

/// 校验定时任务日志明细是否存在
#[allow(dead_code)]
pub async fn validate_option_cron_job_log_detail(
  cron_job_log_detail_model: Option<CronJobLogDetailModel>,
) -> Result<CronJobLogDetailModel> {
  
  let cron_job_log_detail_model = cron_job_log_detail_dao::validate_option_cron_job_log_detail(cron_job_log_detail_model).await?;
  
  Ok(cron_job_log_detail_model)
}

/// 根据 cron_job_log_detail_ids 删除定时任务日志明细
#[allow(dead_code)]
pub async fn delete_by_ids_cron_job_log_detail(
  cron_job_log_detail_ids: Vec<CronJobLogDetailId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = cron_job_log_detail_dao::delete_by_ids_cron_job_log_detail(
    cron_job_log_detail_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取定时任务日志明细字段注释
pub async fn get_field_comments_cron_job_log_detail(
  options: Option<Options>,
) -> Result<CronJobLogDetailFieldComment> {
  
  let comments = cron_job_log_detail_dao::get_field_comments_cron_job_log_detail(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 cron_job_log_detail_ids 还原定时任务日志明细
#[allow(dead_code)]
pub async fn revert_by_ids_cron_job_log_detail(
  cron_job_log_detail_ids: Vec<CronJobLogDetailId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = cron_job_log_detail_dao::revert_by_ids_cron_job_log_detail(
    cron_job_log_detail_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 cron_job_log_detail_ids 彻底删除定时任务日志明细
#[allow(dead_code)]
pub async fn force_delete_by_ids_cron_job_log_detail(
  cron_job_log_detail_ids: Vec<CronJobLogDetailId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = cron_job_log_detail_dao::force_delete_by_ids_cron_job_log_detail(
    cron_job_log_detail_ids,
    options,
  ).await?;
  
  Ok(num)
}
