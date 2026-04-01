
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

use super::process_inst_model::*;
use super::process_inst_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut ProcessInstSearch,
  options: Option<Options>,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找流程实例列表
pub async fn find_all_process_inst(
  search: Option<ProcessInstSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<ProcessInstModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let process_inst_models = process_inst_dao::find_all_process_inst(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(process_inst_models)
}

/// 根据条件查找流程实例总数
pub async fn find_count_process_inst(
  search: Option<ProcessInstSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let process_inst_num = process_inst_dao::find_count_process_inst(
    Some(search),
    options,
  ).await?;
  
  Ok(process_inst_num)
}

/// 根据条件查找第一个流程实例
pub async fn find_one_process_inst(
  search: Option<ProcessInstSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<ProcessInstModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let process_inst_model = process_inst_dao::find_one_process_inst(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(process_inst_model)
}

/// 根据条件查找第一个流程实例, 如果不存在则抛错
pub async fn find_one_ok_process_inst(
  search: Option<ProcessInstSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<ProcessInstModel> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let process_inst_model = process_inst_dao::find_one_ok_process_inst(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(process_inst_model)
}

/// 根据 id 查找流程实例
pub async fn find_by_id_process_inst(
  process_inst_id: ProcessInstId,
  options: Option<Options>,
) -> Result<Option<ProcessInstModel>> {
  
  let process_inst_model = process_inst_dao::find_by_id_process_inst(
    process_inst_id,
    options,
  ).await?;
  
  Ok(process_inst_model)
}

/// 根据 id 查找流程实例, 如果不存在则抛错
pub async fn find_by_id_ok_process_inst(
  process_inst_id: ProcessInstId,
  options: Option<Options>,
) -> Result<ProcessInstModel> {
  
  let process_inst_model = process_inst_dao::find_by_id_ok_process_inst(
    process_inst_id,
    options,
  ).await?;
  
  Ok(process_inst_model)
}

/// 根据 ids 查找流程实例
pub async fn find_by_ids_process_inst(
  process_inst_ids: Vec<ProcessInstId>,
  options: Option<Options>,
) -> Result<Vec<ProcessInstModel>> {
  
  let process_inst_models = process_inst_dao::find_by_ids_process_inst(
    process_inst_ids,
    options,
  ).await?;
  
  Ok(process_inst_models)
}

/// 根据 ids 查找流程实例, 出现查询不到的 id 则报错
pub async fn find_by_ids_ok_process_inst(
  process_inst_ids: Vec<ProcessInstId>,
  options: Option<Options>,
) -> Result<Vec<ProcessInstModel>> {
  
  let process_inst_models = process_inst_dao::find_by_ids_ok_process_inst(
    process_inst_ids,
    options,
  ).await?;
  
  Ok(process_inst_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_process_inst(
  process_inst_input: ProcessInstInput,
) -> Result<ProcessInstInput> {
  
  let process_inst_input = process_inst_dao::set_id_by_lbl_process_inst(
    process_inst_input,
  ).await?;
  
  Ok(process_inst_input)
}

/// 创建流程实例
#[allow(dead_code)]
pub async fn creates_process_inst(
  process_inst_inputs: Vec<ProcessInstInput>,
  options: Option<Options>,
) -> Result<Vec<ProcessInstId>> {
  
  let process_inst_ids = process_inst_dao::creates_process_inst(
    process_inst_inputs,
    options,
  ).await?;
  
  Ok(process_inst_ids)
}

/// 流程实例根据 process_inst_id 修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id_process_inst(
  process_inst_id: ProcessInstId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = process_inst_dao::update_tenant_by_id_process_inst(
    process_inst_id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 process_inst_id 修改流程实例
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_process_inst(
  process_inst_id: ProcessInstId,
  mut process_inst_input: ProcessInstInput,
  options: Option<Options>,
) -> Result<ProcessInstId> {
  
  let process_inst_id = process_inst_dao::update_by_id_process_inst(
    process_inst_id,
    process_inst_input,
    options,
  ).await?;
  
  Ok(process_inst_id)
}

/// 校验流程实例是否存在
#[allow(dead_code)]
pub async fn validate_option_process_inst(
  process_inst_model: Option<ProcessInstModel>,
) -> Result<ProcessInstModel> {
  
  let process_inst_model = process_inst_dao::validate_option_process_inst(process_inst_model).await?;
  
  Ok(process_inst_model)
}

/// 根据 process_inst_ids 删除流程实例
#[allow(dead_code)]
pub async fn delete_by_ids_process_inst(
  process_inst_ids: Vec<ProcessInstId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = process_inst_dao::delete_by_ids_process_inst(
    process_inst_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取流程实例字段注释
pub async fn get_field_comments_process_inst(
  options: Option<Options>,
) -> Result<ProcessInstFieldComment> {
  
  let comments = process_inst_dao::get_field_comments_process_inst(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 process_inst_ids 还原流程实例
#[allow(dead_code)]
pub async fn revert_by_ids_process_inst(
  process_inst_ids: Vec<ProcessInstId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = process_inst_dao::revert_by_ids_process_inst(
    process_inst_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 process_inst_ids 彻底删除流程实例
#[allow(dead_code)]
pub async fn force_delete_by_ids_process_inst(
  process_inst_ids: Vec<ProcessInstId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = process_inst_dao::force_delete_by_ids_process_inst(
    process_inst_ids,
    options,
  ).await?;
  
  Ok(num)
}
