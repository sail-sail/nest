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

use super::cron_job_model::*;
use super::cron_job_service;

use crate::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找定时任务列表
#[function_name::named]
pub async fn find_all_cron_job(
  search: Option<CronJobSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<CronJobModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_cron_job(sort.as_deref())?;
  
  let models = cron_job_service::find_all_cron_job(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找定时任务总数
#[function_name::named]
pub async fn find_count_cron_job(
  search: Option<CronJobSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = cron_job_service::find_count_cron_job(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个定时任务
#[function_name::named]
pub async fn find_one_cron_job(
  search: Option<CronJobSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<CronJobModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_cron_job(sort.as_deref())?;
  
  let model = cron_job_service::find_one_cron_job(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找定时任务
#[function_name::named]
pub async fn find_by_id_cron_job(
  id: CronJobId,
  options: Option<Options>,
) -> Result<Option<CronJobModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = cron_job_service::find_by_id_cron_job(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 ids 查找定时任务
#[function_name::named]
pub async fn find_by_ids_cron_job(
  ids: Vec<CronJobId>,
  options: Option<Options>,
) -> Result<Vec<CronJobModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = cron_job_service::find_by_ids_cron_job(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 创建定时任务
#[allow(dead_code)]
#[function_name::named]
pub async fn creates_cron_job(
  inputs: Vec<CronJobInput>,
  options: Option<Options>,
) -> Result<Vec<CronJobId>> {
  
  info!(
    "{req_id} {function_name}: inputs: {inputs:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let mut inputs = inputs;
  for input in &mut inputs {
    input.id = None;
  }
  let inputs = inputs;
  
  let mut inputs2 = Vec::with_capacity(inputs.len());
  for input in inputs {
    let input = cron_job_service::set_id_by_lbl_cron_job(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    get_route_path_cron_job(),
    "add".to_owned(),
  ).await?;
  
  let ids = cron_job_service::creates_cron_job(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 定时任务根据id修改租户id
#[allow(dead_code)]
#[function_name::named]
pub async fn update_tenant_by_id_cron_job(
  id: CronJobId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} tenant_id: {tenant_id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = cron_job_service::update_tenant_by_id_cron_job(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改定时任务
#[allow(dead_code)]
#[function_name::named]
pub async fn update_by_id_cron_job(
  id: CronJobId,
  input: CronJobInput,
  options: Option<Options>,
) -> Result<CronJobId> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} input: {input:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = cron_job_service::set_id_by_lbl_cron_job(
    input,
  ).await?;
  
  use_permit(
    get_route_path_cron_job(),
    "edit".to_owned(),
  ).await?;
  
  let res = cron_job_service::update_by_id_cron_job(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除定时任务
#[allow(dead_code)]
#[function_name::named]
pub async fn delete_by_ids_cron_job(
  ids: Vec<CronJobId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_cron_job(),
    "delete".to_owned(),
  ).await?;
  
  let num = cron_job_service::delete_by_ids_cron_job(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找定时任务是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
#[function_name::named]
pub async fn get_is_enabled_by_id_cron_job(
  id: CronJobId,
  options: Option<Options>,
) -> Result<bool> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let is_enabled = cron_job_service::get_is_enabled_by_id_cron_job(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用定时任务
#[allow(dead_code)]
#[function_name::named]
pub async fn enable_by_ids_cron_job(
  ids: Vec<CronJobId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?} is_enabled: {is_enabled:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_cron_job(),
    "edit".to_owned(),
  ).await?;
  
  let num = cron_job_service::enable_by_ids_cron_job(
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
#[function_name::named]
pub async fn get_is_locked_by_id_cron_job(
  id: CronJobId,
  options: Option<Options>,
) -> Result<bool> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let is_locked = cron_job_service::get_is_locked_by_id_cron_job(
    id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 ids 锁定或者解锁定时任务
#[allow(dead_code)]
#[function_name::named]
pub async fn lock_by_ids_cron_job(
  ids: Vec<CronJobId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?} is_locked: {is_locked:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_cron_job(),
    "edit".to_owned(),
  ).await?;
  
  let num = cron_job_service::lock_by_ids_cron_job(
    ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取定时任务字段注释
#[function_name::named]
pub async fn get_field_comments_cron_job(
  options: Option<Options>,
) -> Result<CronJobFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = cron_job_service::get_field_comments_cron_job(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原定时任务
#[allow(dead_code)]
#[function_name::named]
pub async fn revert_by_ids_cron_job(
  ids: Vec<CronJobId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_cron_job(),
    "delete".to_owned(),
  ).await?;
  
  let num = cron_job_service::revert_by_ids_cron_job(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除定时任务
#[allow(dead_code)]
#[function_name::named]
pub async fn force_delete_by_ids_cron_job(
  ids: Vec<CronJobId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_cron_job(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = cron_job_service::force_delete_by_ids_cron_job(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 定时任务 order_by 字段的最大值
#[function_name::named]
pub async fn find_last_order_by_cron_job(
  options: Option<Options>,
) -> Result<u32> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let res = cron_job_service::find_last_order_by_cron_job(
    options,
  ).await?;
  
  Ok(res)
}
