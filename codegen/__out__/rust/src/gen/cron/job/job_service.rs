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

use super::job_model::*;
use super::job_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut JobSearch,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找任务列表
pub async fn find_all(
  search: Option<JobSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<JobModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(&mut search).await?;
  
  let res = job_dao::find_all(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找任务总数
pub async fn find_count(
  search: Option<JobSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(&mut search).await?;
  
  let res = job_dao::find_count(
    Some(search),
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找第一个任务
pub async fn find_one(
  search: Option<JobSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<JobModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(&mut search).await?;
  
  let model = job_dao::find_one(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找任务
pub async fn find_by_id(
  id: JobId,
  options: Option<Options>,
) -> Result<Option<JobModel>> {
  
  let model = job_dao::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl(
  input: JobInput,
) -> Result<JobInput> {
  
  let input = job_dao::set_id_by_lbl(
    input,
  ).await?;
  
  Ok(input)
}

/// 创建任务
#[allow(dead_code)]
pub async fn creates(
  inputs: Vec<JobInput>,
  options: Option<Options>,
) -> Result<Vec<JobId>> {
  
  let job_ids = job_dao::creates(
    inputs,
    options,
  ).await?;
  
  Ok(job_ids)
}

/// 任务根据id修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id(
  id: JobId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = job_dao::update_tenant_by_id(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改任务
#[allow(dead_code, unused_mut)]
pub async fn update_by_id(
  id: JobId,
  mut input: JobInput,
  options: Option<Options>,
) -> Result<JobId> {
  
  let old_model = job_dao::validate_option(
    job_dao::find_by_id(
      id.clone(),
      options.clone(),
    ).await?,
  ).await?;
  
  let is_locked = job_dao::get_is_locked_by_id(
    id.clone(),
    None,
  ).await?;
  
  if is_locked {
    let err_msg = "不能修改已经锁定的 任务";
    return Err(eyre!(err_msg));
  }
  
  // 不能修改系统记录的系统字段
  if old_model.is_sys == 1 {
    // 编码
    input.code = None;
  }
  
  let job_id = job_dao::update_by_id(
    id,
    input,
    options,
  ).await?;
  
  Ok(job_id)
}

/// 根据 ids 删除任务
#[allow(dead_code)]
pub async fn delete_by_ids(
  ids: Vec<JobId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let models = job_dao::find_all(
    Some(JobSearch {
      ids: Some(ids.clone()),
      ..Default::default()
    }),
    None,
    None,
    options.clone(),
  ).await?;
  for model in models {
    if model.is_locked == 1 {
      let err_msg = "不能删除已经锁定的 任务";
      return Err(eyre!(err_msg));
    }
  }
  
  let models = job_dao::find_all(
    Some(JobSearch {
      ids: Some(ids.clone()),
      ..Default::default()
    }),
    None,
    None,
    options.clone(),
  ).await?;
  for model in models {
    if model.is_sys == 1 {
      let err_msg = "不能删除系统记录";
      return Err(eyre!(err_msg));
    }
  }
  
  let num = job_dao::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找任务是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id(
  id: JobId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = job_dao::get_is_enabled_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用任务
#[allow(dead_code)]
pub async fn enable_by_ids(
  ids: Vec<JobId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = job_dao::enable_by_ids(
    ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找任务是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_locked_by_id(
  id: JobId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_locked = job_dao::get_is_locked_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 ids 锁定或者解锁任务
#[allow(dead_code)]
pub async fn lock_by_ids(
  ids: Vec<JobId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = job_dao::lock_by_ids(
    ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取任务字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<JobFieldComment> {
  
  let comments = job_dao::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原任务
#[allow(dead_code)]
pub async fn revert_by_ids(
  ids: Vec<JobId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = job_dao::revert_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除任务
#[allow(dead_code)]
pub async fn force_delete_by_ids(
  ids: Vec<JobId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = job_dao::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 任务 order_by 字段的最大值
pub async fn find_last_order_by(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = job_dao::find_last_order_by(
    options,
  ).await?;
  
  Ok(res)
}
