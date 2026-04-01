
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

use super::process_def_model::*;
use super::process_def_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut ProcessDefSearch,
  options: Option<Options>,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找流程定义列表
pub async fn find_all_process_def(
  search: Option<ProcessDefSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<ProcessDefModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let process_def_models = process_def_dao::find_all_process_def(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(process_def_models)
}

/// 根据条件查找流程定义总数
pub async fn find_count_process_def(
  search: Option<ProcessDefSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let process_def_num = process_def_dao::find_count_process_def(
    Some(search),
    options,
  ).await?;
  
  Ok(process_def_num)
}

/// 根据条件查找第一个流程定义
pub async fn find_one_process_def(
  search: Option<ProcessDefSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<ProcessDefModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let process_def_model = process_def_dao::find_one_process_def(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(process_def_model)
}

/// 根据条件查找第一个流程定义, 如果不存在则抛错
pub async fn find_one_ok_process_def(
  search: Option<ProcessDefSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<ProcessDefModel> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let process_def_model = process_def_dao::find_one_ok_process_def(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(process_def_model)
}

/// 根据 id 查找流程定义
pub async fn find_by_id_process_def(
  process_def_id: ProcessDefId,
  options: Option<Options>,
) -> Result<Option<ProcessDefModel>> {
  
  let process_def_model = process_def_dao::find_by_id_process_def(
    process_def_id,
    options,
  ).await?;
  
  Ok(process_def_model)
}

/// 根据 id 查找流程定义, 如果不存在则抛错
pub async fn find_by_id_ok_process_def(
  process_def_id: ProcessDefId,
  options: Option<Options>,
) -> Result<ProcessDefModel> {
  
  let process_def_model = process_def_dao::find_by_id_ok_process_def(
    process_def_id,
    options,
  ).await?;
  
  Ok(process_def_model)
}

/// 根据 ids 查找流程定义
pub async fn find_by_ids_process_def(
  process_def_ids: Vec<ProcessDefId>,
  options: Option<Options>,
) -> Result<Vec<ProcessDefModel>> {
  
  let process_def_models = process_def_dao::find_by_ids_process_def(
    process_def_ids,
    options,
  ).await?;
  
  Ok(process_def_models)
}

/// 根据 ids 查找流程定义, 出现查询不到的 id 则报错
pub async fn find_by_ids_ok_process_def(
  process_def_ids: Vec<ProcessDefId>,
  options: Option<Options>,
) -> Result<Vec<ProcessDefModel>> {
  
  let process_def_models = process_def_dao::find_by_ids_ok_process_def(
    process_def_ids,
    options,
  ).await?;
  
  Ok(process_def_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_process_def(
  process_def_input: ProcessDefInput,
) -> Result<ProcessDefInput> {
  
  let process_def_input = process_def_dao::set_id_by_lbl_process_def(
    process_def_input,
  ).await?;
  
  Ok(process_def_input)
}

/// 创建流程定义
#[allow(dead_code)]
pub async fn creates_process_def(
  process_def_inputs: Vec<ProcessDefInput>,
  options: Option<Options>,
) -> Result<Vec<ProcessDefId>> {
  
  let process_def_ids = process_def_dao::creates_process_def(
    process_def_inputs,
    options,
  ).await?;
  
  Ok(process_def_ids)
}

/// 流程定义根据 process_def_id 修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id_process_def(
  process_def_id: ProcessDefId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = process_def_dao::update_tenant_by_id_process_def(
    process_def_id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 process_def_id 修改流程定义
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_process_def(
  process_def_id: ProcessDefId,
  mut process_def_input: ProcessDefInput,
  options: Option<Options>,
) -> Result<ProcessDefId> {
  
  let process_def_id = process_def_dao::update_by_id_process_def(
    process_def_id,
    process_def_input,
    options,
  ).await?;
  
  Ok(process_def_id)
}

/// 校验流程定义是否存在
#[allow(dead_code)]
pub async fn validate_option_process_def(
  process_def_model: Option<ProcessDefModel>,
) -> Result<ProcessDefModel> {
  
  let process_def_model = process_def_dao::validate_option_process_def(process_def_model).await?;
  
  Ok(process_def_model)
}

/// 根据 process_def_ids 删除流程定义
#[allow(dead_code)]
pub async fn delete_by_ids_process_def(
  process_def_ids: Vec<ProcessDefId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = process_def_dao::delete_by_ids_process_def(
    process_def_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 process_def_id 查找流程定义是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id_process_def(
  process_def_id: ProcessDefId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = process_def_dao::get_is_enabled_by_id_process_def(
    process_def_id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 process_def_ids 启用或者禁用流程定义
#[allow(dead_code)]
pub async fn enable_by_ids_process_def(
  process_def_ids: Vec<ProcessDefId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = process_def_dao::enable_by_ids_process_def(
    process_def_ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取流程定义字段注释
pub async fn get_field_comments_process_def(
  options: Option<Options>,
) -> Result<ProcessDefFieldComment> {
  
  let comments = process_def_dao::get_field_comments_process_def(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 process_def_ids 还原流程定义
#[allow(dead_code)]
pub async fn revert_by_ids_process_def(
  process_def_ids: Vec<ProcessDefId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = process_def_dao::revert_by_ids_process_def(
    process_def_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 process_def_ids 彻底删除流程定义
#[allow(dead_code)]
pub async fn force_delete_by_ids_process_def(
  process_def_ids: Vec<ProcessDefId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = process_def_dao::force_delete_by_ids_process_def(
    process_def_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 流程定义 order_by 字段的最大值
pub async fn find_last_order_by_process_def(
  search: Option<ProcessDefSearch>,
  options: Option<Options>,
) -> Result<u32> {
  
  let order_by = process_def_dao::find_last_order_by_process_def(
    search,
    options,
  ).await?;
  
  Ok(order_by)
}
