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

use super::cron_job_model::*;
use super::cron_job_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut CronJobSearch,
  options: Option<Options>,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找定时任务列表
pub async fn find_all_cron_job(
  search: Option<CronJobSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<CronJobModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let cron_job_models = cron_job_dao::find_all_cron_job(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(cron_job_models)
}

/// 根据条件查找定时任务总数
pub async fn find_count_cron_job(
  search: Option<CronJobSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let cron_job_num = cron_job_dao::find_count_cron_job(
    Some(search),
    options,
  ).await?;
  
  Ok(cron_job_num)
}

/// 根据条件查找第一个定时任务
pub async fn find_one_cron_job(
  search: Option<CronJobSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<CronJobModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let cron_job_model = cron_job_dao::find_one_cron_job(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(cron_job_model)
}

/// 根据条件查找第一个定时任务, 如果不存在则抛错
pub async fn find_one_ok_cron_job(
  search: Option<CronJobSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<CronJobModel> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let cron_job_model = cron_job_dao::find_one_ok_cron_job(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(cron_job_model)
}

/// 根据 id 查找定时任务
pub async fn find_by_id_cron_job(
  cron_job_id: CronJobId,
  options: Option<Options>,
) -> Result<Option<CronJobModel>> {
  
  let cron_job_model = cron_job_dao::find_by_id_cron_job(
    cron_job_id,
    options,
  ).await?;
  
  Ok(cron_job_model)
}

/// 根据 id 查找定时任务, 如果不存在则抛错
pub async fn find_by_id_ok_cron_job(
  cron_job_id: CronJobId,
  options: Option<Options>,
) -> Result<CronJobModel> {
  
  let cron_job_model = cron_job_dao::find_by_id_ok_cron_job(
    cron_job_id,
    options,
  ).await?;
  
  Ok(cron_job_model)
}

/// 根据 ids 查找定时任务
pub async fn find_by_ids_cron_job(
  cron_job_ids: Vec<CronJobId>,
  options: Option<Options>,
) -> Result<Vec<CronJobModel>> {
  
  let cron_job_models = cron_job_dao::find_by_ids_cron_job(
    cron_job_ids,
    options,
  ).await?;
  
  Ok(cron_job_models)
}

/// 根据 ids 查找定时任务, 出现查询不到的 id 则报错
pub async fn find_by_ids_ok_cron_job(
  cron_job_ids: Vec<CronJobId>,
  options: Option<Options>,
) -> Result<Vec<CronJobModel>> {
  
  let cron_job_models = cron_job_dao::find_by_ids_ok_cron_job(
    cron_job_ids,
    options,
  ).await?;
  
  Ok(cron_job_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_cron_job(
  cron_job_input: CronJobInput,
) -> Result<CronJobInput> {
  
  let cron_job_input = cron_job_dao::set_id_by_lbl_cron_job(
    cron_job_input,
  ).await?;
  
  Ok(cron_job_input)
}

/// 创建定时任务
#[allow(dead_code)]
pub async fn creates_cron_job(
  cron_job_inputs: Vec<CronJobInput>,
  options: Option<Options>,
) -> Result<Vec<CronJobId>> {
  
  let cron_job_ids = cron_job_dao::creates_cron_job(
    cron_job_inputs,
    options,
  ).await?;
  
  Ok(cron_job_ids)
}

/// 定时任务根据 cron_job_id 修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id_cron_job(
  cron_job_id: CronJobId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = cron_job_dao::update_tenant_by_id_cron_job(
    cron_job_id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 cron_job_id 修改定时任务
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_cron_job(
  cron_job_id: CronJobId,
  mut cron_job_input: CronJobInput,
  options: Option<Options>,
) -> Result<CronJobId> {
  
  let is_locked = cron_job_dao::get_is_locked_by_id_cron_job(
    cron_job_id.clone(),
    None,
  ).await?;
  
  if is_locked {
    let err_msg = "不能修改已经锁定的 定时任务";
    return Err(eyre!(err_msg));
  }
  
  let cron_job_id = cron_job_dao::update_by_id_cron_job(
    cron_job_id,
    cron_job_input,
    options.clone(),
  ).await?;
  
  Ok(cron_job_id)
}

/// 校验定时任务是否存在
#[allow(dead_code)]
pub async fn validate_option_cron_job(
  cron_job_model: Option<CronJobModel>,
) -> Result<CronJobModel> {
  
  let cron_job_model = cron_job_dao::validate_option_cron_job(cron_job_model).await?;
  
  Ok(cron_job_model)
}

/// 根据 cron_job_ids 删除定时任务
#[allow(dead_code)]
pub async fn delete_by_ids_cron_job(
  cron_job_ids: Vec<CronJobId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let old_models = cron_job_dao::find_all_cron_job(
    Some(CronJobSearch {
      ids: Some(cron_job_ids.clone()),
      ..Default::default()
    }),
    None,
    None,
    options.clone(),
  ).await?;
  
  for old_model in &old_models {
    if old_model.is_locked == 1 {
      let err_msg = "不能删除已经锁定的 定时任务";
      return Err(eyre!(err_msg));
    }
  }
  
  let num = cron_job_dao::delete_by_ids_cron_job(
    cron_job_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 cron_job_id 查找定时任务是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id_cron_job(
  cron_job_id: CronJobId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = cron_job_dao::get_is_enabled_by_id_cron_job(
    cron_job_id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 cron_job_ids 启用或者禁用定时任务
#[allow(dead_code)]
pub async fn enable_by_ids_cron_job(
  cron_job_ids: Vec<CronJobId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = cron_job_dao::enable_by_ids_cron_job(
    cron_job_ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 cron_job_id 查找定时任务是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_locked_by_id_cron_job(
  cron_job_id: CronJobId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_locked = cron_job_dao::get_is_locked_by_id_cron_job(
    cron_job_id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 cron_job_ids 锁定或者解锁定时任务
#[allow(dead_code)]
pub async fn lock_by_ids_cron_job(
  cron_job_ids: Vec<CronJobId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = cron_job_dao::lock_by_ids_cron_job(
    cron_job_ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取定时任务字段注释
pub async fn get_field_comments_cron_job(
  options: Option<Options>,
) -> Result<CronJobFieldComment> {
  
  let comments = cron_job_dao::get_field_comments_cron_job(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 cron_job_ids 还原定时任务
#[allow(dead_code)]
pub async fn revert_by_ids_cron_job(
  cron_job_ids: Vec<CronJobId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = cron_job_dao::revert_by_ids_cron_job(
    cron_job_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 cron_job_ids 彻底删除定时任务
#[allow(dead_code)]
pub async fn force_delete_by_ids_cron_job(
  cron_job_ids: Vec<CronJobId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = cron_job_dao::force_delete_by_ids_cron_job(
    cron_job_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 定时任务 order_by 字段的最大值
pub async fn find_last_order_by_cron_job(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = cron_job_dao::find_last_order_by_cron_job(
    options,
  ).await?;
  
  Ok(res)
}
