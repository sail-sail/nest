
#![allow(clippy::clone_on_copy)]
#![allow(clippy::redundant_clone)]

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

#[allow(unused_imports)]
use smol_str::SmolStr;

use crate::common::gql::model::{PageInput, SortInput};

use crate::base::tenant::tenant_model::TenantId;

use super::log_model::*;
use super::log_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut LogSearch,
  options: Option<Options>,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找流程日志列表
pub async fn find_all_log(
  search: Option<LogSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<LogModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let log_models = log_dao::find_all_log(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(log_models)
}

/// 根据条件查找流程日志总数
pub async fn find_count_log(
  search: Option<LogSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let log_num = log_dao::find_count_log(
    Some(search),
    options,
  ).await?;
  
  Ok(log_num)
}

/// 根据条件查找第一个流程日志
pub async fn find_one_log(
  search: Option<LogSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<LogModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let log_model = log_dao::find_one_log(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(log_model)
}

/// 根据条件查找第一个流程日志, 如果不存在则抛错
pub async fn find_one_ok_log(
  search: Option<LogSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<LogModel> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let log_model = log_dao::find_one_ok_log(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(log_model)
}

/// 根据 id 查找流程日志
pub async fn find_by_id_log(
  log_id: LogId,
  options: Option<Options>,
) -> Result<Option<LogModel>> {
  
  let log_model = log_dao::find_by_id_log(
    log_id,
    options,
  ).await?;
  
  Ok(log_model)
}

/// 根据 id 查找流程日志, 如果不存在则抛错
pub async fn find_by_id_ok_log(
  log_id: LogId,
  options: Option<Options>,
) -> Result<LogModel> {
  
  let log_model = log_dao::find_by_id_ok_log(
    log_id,
    options,
  ).await?;
  
  Ok(log_model)
}

/// 根据 ids 查找流程日志
pub async fn find_by_ids_log(
  log_ids: Vec<LogId>,
  options: Option<Options>,
) -> Result<Vec<LogModel>> {
  
  let log_models = log_dao::find_by_ids_log(
    log_ids,
    options,
  ).await?;
  
  Ok(log_models)
}

/// 根据 ids 查找流程日志, 出现查询不到的 id 则报错
pub async fn find_by_ids_ok_log(
  log_ids: Vec<LogId>,
  options: Option<Options>,
) -> Result<Vec<LogModel>> {
  
  let log_models = log_dao::find_by_ids_ok_log(
    log_ids,
    options,
  ).await?;
  
  Ok(log_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_log(
  log_input: LogInput,
) -> Result<LogInput> {
  
  let log_input = log_dao::set_id_by_lbl_log(
    log_input,
  ).await?;
  
  Ok(log_input)
}

/// 创建流程日志
#[allow(dead_code)]
pub async fn creates_log(
  log_inputs: Vec<LogInput>,
  options: Option<Options>,
) -> Result<Vec<LogId>> {
  
  let log_ids = log_dao::creates_log(
    log_inputs,
    options,
  ).await?;
  
  Ok(log_ids)
}

/// 流程日志根据 log_id 修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id_log(
  log_id: LogId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = log_dao::update_tenant_by_id_log(
    log_id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 log_id 修改流程日志
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_log(
  log_id: LogId,
  mut log_input: LogInput,
  options: Option<Options>,
) -> Result<LogId> {
  
  let log_id = log_dao::update_by_id_log(
    log_id,
    log_input,
    options,
  ).await?;
  
  Ok(log_id)
}

/// 校验流程日志是否存在
#[allow(dead_code)]
pub async fn validate_option_log(
  log_model: Option<LogModel>,
) -> Result<LogModel> {
  
  let log_model = log_dao::validate_option_log(log_model).await?;
  
  Ok(log_model)
}

/// 根据 log_ids 删除流程日志
#[allow(dead_code)]
pub async fn delete_by_ids_log(
  log_ids: Vec<LogId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = log_dao::delete_by_ids_log(
    log_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取流程日志字段注释
pub async fn get_field_comments_log(
  options: Option<Options>,
) -> Result<LogFieldComment> {
  
  let comments = log_dao::get_field_comments_log(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 log_ids 还原流程日志
#[allow(dead_code)]
pub async fn revert_by_ids_log(
  log_ids: Vec<LogId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = log_dao::revert_by_ids_log(
    log_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 log_ids 彻底删除流程日志
#[allow(dead_code)]
pub async fn force_delete_by_ids_log(
  log_ids: Vec<LogId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = log_dao::force_delete_by_ids_log(
    log_ids,
    options,
  ).await?;
  
  Ok(num)
}
