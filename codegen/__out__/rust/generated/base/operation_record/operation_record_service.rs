
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

use crate::common::gql::model::{PageInput, SortInput};

use crate::base::tenant::tenant_model::TenantId;

use super::operation_record_model::*;
use super::operation_record_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut OperationRecordSearch,
  options: Option<Options>,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找操作记录列表
pub async fn find_all_operation_record(
  search: Option<OperationRecordSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<OperationRecordModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let operation_record_models = operation_record_dao::find_all_operation_record(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(operation_record_models)
}

/// 根据条件查找操作记录总数
pub async fn find_count_operation_record(
  search: Option<OperationRecordSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let operation_record_num = operation_record_dao::find_count_operation_record(
    Some(search),
    options,
  ).await?;
  
  Ok(operation_record_num)
}

/// 根据条件查找第一个操作记录
pub async fn find_one_operation_record(
  search: Option<OperationRecordSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<OperationRecordModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let operation_record_model = operation_record_dao::find_one_operation_record(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(operation_record_model)
}

/// 根据条件查找第一个操作记录, 如果不存在则抛错
pub async fn find_one_ok_operation_record(
  search: Option<OperationRecordSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<OperationRecordModel> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let operation_record_model = operation_record_dao::find_one_ok_operation_record(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(operation_record_model)
}

/// 根据 id 查找操作记录
pub async fn find_by_id_operation_record(
  operation_record_id: OperationRecordId,
  options: Option<Options>,
) -> Result<Option<OperationRecordModel>> {
  
  let operation_record_model = operation_record_dao::find_by_id_operation_record(
    operation_record_id,
    options,
  ).await?;
  
  Ok(operation_record_model)
}

/// 根据 id 查找操作记录, 如果不存在则抛错
pub async fn find_by_id_ok_operation_record(
  operation_record_id: OperationRecordId,
  options: Option<Options>,
) -> Result<OperationRecordModel> {
  
  let operation_record_model = operation_record_dao::find_by_id_ok_operation_record(
    operation_record_id,
    options,
  ).await?;
  
  Ok(operation_record_model)
}

/// 根据 ids 查找操作记录
pub async fn find_by_ids_operation_record(
  operation_record_ids: Vec<OperationRecordId>,
  options: Option<Options>,
) -> Result<Vec<OperationRecordModel>> {
  
  let operation_record_models = operation_record_dao::find_by_ids_operation_record(
    operation_record_ids,
    options,
  ).await?;
  
  Ok(operation_record_models)
}

/// 根据 ids 查找操作记录, 出现查询不到的 id 则报错
pub async fn find_by_ids_ok_operation_record(
  operation_record_ids: Vec<OperationRecordId>,
  options: Option<Options>,
) -> Result<Vec<OperationRecordModel>> {
  
  let operation_record_models = operation_record_dao::find_by_ids_ok_operation_record(
    operation_record_ids,
    options,
  ).await?;
  
  Ok(operation_record_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_operation_record(
  operation_record_input: OperationRecordInput,
) -> Result<OperationRecordInput> {
  
  let operation_record_input = operation_record_dao::set_id_by_lbl_operation_record(
    operation_record_input,
  ).await?;
  
  Ok(operation_record_input)
}

/// 创建操作记录
#[allow(dead_code)]
pub async fn creates_operation_record(
  operation_record_inputs: Vec<OperationRecordInput>,
  options: Option<Options>,
) -> Result<Vec<OperationRecordId>> {
  
  let operation_record_ids = operation_record_dao::creates_operation_record(
    operation_record_inputs,
    options,
  ).await?;
  
  Ok(operation_record_ids)
}

/// 操作记录根据 operation_record_id 修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id_operation_record(
  operation_record_id: OperationRecordId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = operation_record_dao::update_tenant_by_id_operation_record(
    operation_record_id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 operation_record_id 修改操作记录
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_operation_record(
  operation_record_id: OperationRecordId,
  mut operation_record_input: OperationRecordInput,
  options: Option<Options>,
) -> Result<OperationRecordId> {
  
  let operation_record_id = operation_record_dao::update_by_id_operation_record(
    operation_record_id,
    operation_record_input,
    options.clone(),
  ).await?;
  
  Ok(operation_record_id)
}

/// 校验操作记录是否存在
#[allow(dead_code)]
pub async fn validate_option_operation_record(
  operation_record_model: Option<OperationRecordModel>,
) -> Result<OperationRecordModel> {
  
  let operation_record_model = operation_record_dao::validate_option_operation_record(operation_record_model).await?;
  
  Ok(operation_record_model)
}

/// 根据 operation_record_ids 删除操作记录
#[allow(dead_code)]
pub async fn delete_by_ids_operation_record(
  operation_record_ids: Vec<OperationRecordId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = operation_record_dao::delete_by_ids_operation_record(
    operation_record_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取操作记录字段注释
pub async fn get_field_comments_operation_record(
  options: Option<Options>,
) -> Result<OperationRecordFieldComment> {
  
  let comments = operation_record_dao::get_field_comments_operation_record(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 operation_record_ids 还原操作记录
#[allow(dead_code)]
pub async fn revert_by_ids_operation_record(
  operation_record_ids: Vec<OperationRecordId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = operation_record_dao::revert_by_ids_operation_record(
    operation_record_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 operation_record_ids 彻底删除操作记录
#[allow(dead_code)]
pub async fn force_delete_by_ids_operation_record(
  operation_record_ids: Vec<OperationRecordId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = operation_record_dao::force_delete_by_ids_operation_record(
    operation_record_ids,
    options,
  ).await?;
  
  Ok(num)
}
