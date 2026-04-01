
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

use super::process_revision_model::*;
use super::process_revision_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut ProcessRevisionSearch,
  options: Option<Options>,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找流程版本列表
pub async fn find_all_process_revision(
  search: Option<ProcessRevisionSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<ProcessRevisionModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let process_revision_models = process_revision_dao::find_all_process_revision(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(process_revision_models)
}

/// 根据条件查找流程版本总数
pub async fn find_count_process_revision(
  search: Option<ProcessRevisionSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let process_revision_num = process_revision_dao::find_count_process_revision(
    Some(search),
    options,
  ).await?;
  
  Ok(process_revision_num)
}

/// 根据条件查找第一个流程版本
pub async fn find_one_process_revision(
  search: Option<ProcessRevisionSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<ProcessRevisionModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let process_revision_model = process_revision_dao::find_one_process_revision(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(process_revision_model)
}

/// 根据条件查找第一个流程版本, 如果不存在则抛错
pub async fn find_one_ok_process_revision(
  search: Option<ProcessRevisionSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<ProcessRevisionModel> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let process_revision_model = process_revision_dao::find_one_ok_process_revision(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(process_revision_model)
}

/// 根据 id 查找流程版本
pub async fn find_by_id_process_revision(
  process_revision_id: ProcessRevisionId,
  options: Option<Options>,
) -> Result<Option<ProcessRevisionModel>> {
  
  let process_revision_model = process_revision_dao::find_by_id_process_revision(
    process_revision_id,
    options,
  ).await?;
  
  Ok(process_revision_model)
}

/// 根据 id 查找流程版本, 如果不存在则抛错
pub async fn find_by_id_ok_process_revision(
  process_revision_id: ProcessRevisionId,
  options: Option<Options>,
) -> Result<ProcessRevisionModel> {
  
  let process_revision_model = process_revision_dao::find_by_id_ok_process_revision(
    process_revision_id,
    options,
  ).await?;
  
  Ok(process_revision_model)
}

/// 根据 ids 查找流程版本
pub async fn find_by_ids_process_revision(
  process_revision_ids: Vec<ProcessRevisionId>,
  options: Option<Options>,
) -> Result<Vec<ProcessRevisionModel>> {
  
  let process_revision_models = process_revision_dao::find_by_ids_process_revision(
    process_revision_ids,
    options,
  ).await?;
  
  Ok(process_revision_models)
}

/// 根据 ids 查找流程版本, 出现查询不到的 id 则报错
pub async fn find_by_ids_ok_process_revision(
  process_revision_ids: Vec<ProcessRevisionId>,
  options: Option<Options>,
) -> Result<Vec<ProcessRevisionModel>> {
  
  let process_revision_models = process_revision_dao::find_by_ids_ok_process_revision(
    process_revision_ids,
    options,
  ).await?;
  
  Ok(process_revision_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_process_revision(
  process_revision_input: ProcessRevisionInput,
) -> Result<ProcessRevisionInput> {
  
  let process_revision_input = process_revision_dao::set_id_by_lbl_process_revision(
    process_revision_input,
  ).await?;
  
  Ok(process_revision_input)
}

/// 创建流程版本
#[allow(dead_code)]
pub async fn creates_process_revision(
  process_revision_inputs: Vec<ProcessRevisionInput>,
  options: Option<Options>,
) -> Result<Vec<ProcessRevisionId>> {
  
  let process_revision_ids = process_revision_dao::creates_process_revision(
    process_revision_inputs,
    options,
  ).await?;
  
  Ok(process_revision_ids)
}

/// 流程版本根据 process_revision_id 修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id_process_revision(
  process_revision_id: ProcessRevisionId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = process_revision_dao::update_tenant_by_id_process_revision(
    process_revision_id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 process_revision_id 修改流程版本
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_process_revision(
  process_revision_id: ProcessRevisionId,
  mut process_revision_input: ProcessRevisionInput,
  options: Option<Options>,
) -> Result<ProcessRevisionId> {
  
  let process_revision_id = process_revision_dao::update_by_id_process_revision(
    process_revision_id,
    process_revision_input,
    options,
  ).await?;
  
  Ok(process_revision_id)
}

/// 校验流程版本是否存在
#[allow(dead_code)]
pub async fn validate_option_process_revision(
  process_revision_model: Option<ProcessRevisionModel>,
) -> Result<ProcessRevisionModel> {
  
  let process_revision_model = process_revision_dao::validate_option_process_revision(process_revision_model).await?;
  
  Ok(process_revision_model)
}

/// 根据 process_revision_ids 删除流程版本
#[allow(dead_code)]
pub async fn delete_by_ids_process_revision(
  process_revision_ids: Vec<ProcessRevisionId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = process_revision_dao::delete_by_ids_process_revision(
    process_revision_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取流程版本字段注释
pub async fn get_field_comments_process_revision(
  options: Option<Options>,
) -> Result<ProcessRevisionFieldComment> {
  
  let comments = process_revision_dao::get_field_comments_process_revision(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 process_revision_ids 还原流程版本
#[allow(dead_code)]
pub async fn revert_by_ids_process_revision(
  process_revision_ids: Vec<ProcessRevisionId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = process_revision_dao::revert_by_ids_process_revision(
    process_revision_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 process_revision_ids 彻底删除流程版本
#[allow(dead_code)]
pub async fn force_delete_by_ids_process_revision(
  process_revision_ids: Vec<ProcessRevisionId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = process_revision_dao::force_delete_by_ids_process_revision(
    process_revision_ids,
    options,
  ).await?;
  
  Ok(num)
}
