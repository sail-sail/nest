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

use super::cron_job_log_model::*;
use super::cron_job_log_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut CronJobLogSearch,
  options: Option<Options>,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找定时任务日志列表
pub async fn find_all_cron_job_log(
  search: Option<CronJobLogSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<CronJobLogModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let cron_job_log_models = cron_job_log_dao::find_all_cron_job_log(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(cron_job_log_models)
}

/// 根据条件查找定时任务日志总数
pub async fn find_count_cron_job_log(
  search: Option<CronJobLogSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let cron_job_log_num = cron_job_log_dao::find_count_cron_job_log(
    Some(search),
    options,
  ).await?;
  
  Ok(cron_job_log_num)
}

/// 根据条件查找第一个定时任务日志
pub async fn find_one_cron_job_log(
  search: Option<CronJobLogSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<CronJobLogModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let cron_job_log_model = cron_job_log_dao::find_one_cron_job_log(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(cron_job_log_model)
}

/// 根据条件查找第一个定时任务日志, 如果不存在则抛错
pub async fn find_one_ok_cron_job_log(
  search: Option<CronJobLogSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<CronJobLogModel> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let cron_job_log_model = cron_job_log_dao::find_one_ok_cron_job_log(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(cron_job_log_model)
}

/// 根据 id 查找定时任务日志
pub async fn find_by_id_cron_job_log(
  cron_job_log_id: CronJobLogId,
  options: Option<Options>,
) -> Result<Option<CronJobLogModel>> {
  
  let cron_job_log_model = cron_job_log_dao::find_by_id_cron_job_log(
    cron_job_log_id,
    options,
  ).await?;
  
  Ok(cron_job_log_model)
}

/// 根据 id 查找定时任务日志, 如果不存在则抛错
pub async fn find_by_id_ok_cron_job_log(
  cron_job_log_id: CronJobLogId,
  options: Option<Options>,
) -> Result<CronJobLogModel> {
  
  let cron_job_log_model = cron_job_log_dao::find_by_id_ok_cron_job_log(
    cron_job_log_id,
    options,
  ).await?;
  
  Ok(cron_job_log_model)
}

/// 根据 ids 查找定时任务日志
pub async fn find_by_ids_cron_job_log(
  cron_job_log_ids: Vec<CronJobLogId>,
  options: Option<Options>,
) -> Result<Vec<CronJobLogModel>> {
  
  let cron_job_log_models = cron_job_log_dao::find_by_ids_cron_job_log(
    cron_job_log_ids,
    options,
  ).await?;
  
  Ok(cron_job_log_models)
}

/// 根据 ids 查找定时任务日志, 出现查询不到的 id 则报错
pub async fn find_by_ids_ok_cron_job_log(
  cron_job_log_ids: Vec<CronJobLogId>,
  options: Option<Options>,
) -> Result<Vec<CronJobLogModel>> {
  
  let cron_job_log_models = cron_job_log_dao::find_by_ids_ok_cron_job_log(
    cron_job_log_ids,
    options,
  ).await?;
  
  Ok(cron_job_log_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_cron_job_log(
  cron_job_log_input: CronJobLogInput,
) -> Result<CronJobLogInput> {
  
  let cron_job_log_input = cron_job_log_dao::set_id_by_lbl_cron_job_log(
    cron_job_log_input,
  ).await?;
  
  Ok(cron_job_log_input)
}

/// 创建定时任务日志
#[allow(dead_code)]
pub async fn creates_cron_job_log(
  cron_job_log_inputs: Vec<CronJobLogInput>,
  options: Option<Options>,
) -> Result<Vec<CronJobLogId>> {
  
  let cron_job_log_ids = cron_job_log_dao::creates_cron_job_log(
    cron_job_log_inputs,
    options,
  ).await?;
  
  Ok(cron_job_log_ids)
}

/// 定时任务日志根据 cron_job_log_id 修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id_cron_job_log(
  cron_job_log_id: CronJobLogId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = cron_job_log_dao::update_tenant_by_id_cron_job_log(
    cron_job_log_id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 cron_job_log_id 修改定时任务日志
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_cron_job_log(
  cron_job_log_id: CronJobLogId,
  mut cron_job_log_input: CronJobLogInput,
  options: Option<Options>,
) -> Result<CronJobLogId> {
  
  let cron_job_log_id = cron_job_log_dao::update_by_id_cron_job_log(
    cron_job_log_id,
    cron_job_log_input,
    options.clone(),
  ).await?;
  
  Ok(cron_job_log_id)
}

/// 校验定时任务日志是否存在
#[allow(dead_code)]
pub async fn validate_option_cron_job_log(
  cron_job_log_model: Option<CronJobLogModel>,
) -> Result<CronJobLogModel> {
  
  let cron_job_log_model = cron_job_log_dao::validate_option_cron_job_log(cron_job_log_model).await?;
  
  Ok(cron_job_log_model)
}

/// 根据 cron_job_log_ids 删除定时任务日志
#[allow(dead_code)]
pub async fn delete_by_ids_cron_job_log(
  cron_job_log_ids: Vec<CronJobLogId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = cron_job_log_dao::delete_by_ids_cron_job_log(
    cron_job_log_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取定时任务日志字段注释
pub async fn get_field_comments_cron_job_log(
  options: Option<Options>,
) -> Result<CronJobLogFieldComment> {
  
  let comments = cron_job_log_dao::get_field_comments_cron_job_log(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 cron_job_log_ids 还原定时任务日志
#[allow(dead_code)]
pub async fn revert_by_ids_cron_job_log(
  cron_job_log_ids: Vec<CronJobLogId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = cron_job_log_dao::revert_by_ids_cron_job_log(
    cron_job_log_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 cron_job_log_ids 彻底删除定时任务日志
#[allow(dead_code)]
pub async fn force_delete_by_ids_cron_job_log(
  cron_job_log_ids: Vec<CronJobLogId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = cron_job_log_dao::force_delete_by_ids_cron_job_log(
    cron_job_log_ids,
    options,
  ).await?;
  
  Ok(num)
}
