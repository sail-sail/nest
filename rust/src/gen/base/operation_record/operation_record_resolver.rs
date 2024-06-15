#[allow(unused_imports)]
use std::time::Instant;

use anyhow::Result;

use crate::common::context::Options;
use crate::common::gql::model::{PageInput, SortInput};
use crate::src::base::permit::permit_service::use_permit;

use super::operation_record_model::*;
use super::operation_record_service;

use crate::gen::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找操作记录列表
pub async fn find_all(
  search: Option<OperationRecordSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<OperationRecordModel>> {
  
  check_sort_operation_record(sort.as_deref())?;
  
  let res = operation_record_service::find_all(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找操作记录总数
pub async fn find_count(
  search: Option<OperationRecordSearch>,
  options: Option<Options>,
) -> Result<i64> {
  
  let num = operation_record_service::find_count(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个操作记录
pub async fn find_one(
  search: Option<OperationRecordSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<OperationRecordModel>> {
  
  check_sort_operation_record(sort.as_deref())?;
  
  let model = operation_record_service::find_one(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找操作记录
pub async fn find_by_id(
  id: OperationRecordId,
  options: Option<Options>,
) -> Result<Option<OperationRecordModel>> {
  
  let model = operation_record_service::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 创建操作记录
#[allow(dead_code)]
pub async fn creates(
  inputs: Vec<OperationRecordInput>,
  options: Option<Options>,
) -> Result<Vec<OperationRecordId>> {
  
  let mut inputs = inputs;
  for input in &mut inputs {
    input.id = None;
  }
  let inputs = inputs;
  
  let mut inputs2 = Vec::with_capacity(inputs.len());
  for input in inputs {
    let input = operation_record_service::set_id_by_lbl(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    "/base/operation_record".to_owned(),
    "add".to_owned(),
  ).await?;
  
  let ids = operation_record_service::creates(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 操作记录根据id修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id(
  id: OperationRecordId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = operation_record_service::update_tenant_by_id(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改操作记录
#[allow(dead_code)]
pub async fn update_by_id(
  id: OperationRecordId,
  input: OperationRecordInput,
  options: Option<Options>,
) -> Result<OperationRecordId> {
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = operation_record_service::set_id_by_lbl(
    input,
  ).await?;
  
  use_permit(
    "/base/operation_record".to_owned(),
    "edit".to_owned(),
  ).await?;
  
  let res = operation_record_service::update_by_id(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除操作记录
#[allow(dead_code)]
pub async fn delete_by_ids(
  ids: Vec<OperationRecordId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    "/base/operation_record".to_owned(),
    "delete".to_owned(),
  ).await?;
  
  let num = operation_record_service::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取操作记录字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<OperationRecordFieldComment> {
  
  let comments = operation_record_service::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原操作记录
#[allow(dead_code)]
pub async fn revert_by_ids(
  ids: Vec<OperationRecordId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    "/base/operation_record".to_owned(),
    "delete".to_owned(),
  ).await?;
  
  let num = operation_record_service::revert_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除操作记录
#[allow(dead_code)]
pub async fn force_delete_by_ids(
  ids: Vec<OperationRecordId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    "/base/operation_record".to_owned(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = operation_record_service::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}
