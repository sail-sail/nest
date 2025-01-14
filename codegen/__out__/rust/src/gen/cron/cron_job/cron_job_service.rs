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

#[allow(unused_imports)]
use crate::src::base::i18n::i18n_dao::ns;

use crate::r#gen::base::tenant::tenant_model::TenantId;

use super::cron_job_model::*;
use super::cron_job_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut CronJobSearch,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找定时任务列表
pub async fn find_all(
  search: Option<CronJobSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<CronJobModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(&mut search).await?;
  
  let res = cron_job_dao::find_all(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找定时任务总数
pub async fn find_count(
  search: Option<CronJobSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(&mut search).await?;
  
  let res = cron_job_dao::find_count(
    Some(search),
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找第一个定时任务
pub async fn find_one(
  search: Option<CronJobSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<CronJobModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(&mut search).await?;
  
  let model = cron_job_dao::find_one(
    Some(search),
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
  
  let model = cron_job_dao::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl(
  input: CronJobInput,
) -> Result<CronJobInput> {
  
  let input = cron_job_dao::set_id_by_lbl(
    input,
  ).await?;
  
  Ok(input)
}

/// 创建定时任务
#[allow(dead_code)]
pub async fn creates(
  inputs: Vec<CronJobInput>,
  options: Option<Options>,
) -> Result<Vec<CronJobId>> {
  
  let cron_job_ids = cron_job_dao::creates(
    inputs,
    options,
  ).await?;
  
  Ok(cron_job_ids)
}

/// 定时任务根据id修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id(
  id: CronJobId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = cron_job_dao::update_tenant_by_id(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改定时任务
#[allow(dead_code)]
#[allow(unused_mut)]
pub async fn update_by_id(
  id: CronJobId,
  mut input: CronJobInput,
  options: Option<Options>,
) -> Result<CronJobId> {
  
  let is_locked = cron_job_dao::get_is_locked_by_id(
    id.clone(),
    None,
  ).await?;
  
  if is_locked {
    let table_comment = ns(
      "定时任务".to_owned(),
      None,
    ).await?;
    let map = HashMap::from([
      ("0".to_owned(), table_comment),
    ]);
    let err_msg = ns(
      "不能修改已经锁定的 {0}".to_owned(),
      map.into(),
    ).await?;
    return Err(eyre!(err_msg));
  }
  
  let cron_job_id = cron_job_dao::update_by_id(
    id,
    input,
    options,
  ).await?;
  
  Ok(cron_job_id)
}

/// 根据 ids 删除定时任务
#[allow(dead_code)]
pub async fn delete_by_ids(
  ids: Vec<CronJobId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let models = cron_job_dao::find_all(
    Some(CronJobSearch {
      ids: Some(ids.clone()),
      ..Default::default()
    }),
    None,
    None,
    options.clone(),
  ).await?;
  for model in models {
    if model.is_locked == 1 {
      let table_comment = ns(
        "定时任务".to_owned(),
        None,
      ).await?;
      let map = HashMap::from([
        ("0".to_owned(), table_comment),
      ]);
      let err_msg = ns(
        "不能删除已经锁定的 {0}",
        map.into(),
      ).await?;
      return Err(eyre!(err_msg));
    }
  }
  
  let num = cron_job_dao::delete_by_ids(
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
  
  let is_enabled = cron_job_dao::get_is_enabled_by_id(
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
  
  let num = cron_job_dao::enable_by_ids(
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
  
  let is_locked = cron_job_dao::get_is_locked_by_id(
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
  
  let num = cron_job_dao::lock_by_ids(
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
  
  let comments = cron_job_dao::get_field_comments(
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
  
  let num = cron_job_dao::revert_by_ids(
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
  
  let num = cron_job_dao::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 定时任务 order_by 字段的最大值
pub async fn find_last_order_by(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = cron_job_dao::find_last_order_by(
    options,
  ).await?;
  
  Ok(res)
}
