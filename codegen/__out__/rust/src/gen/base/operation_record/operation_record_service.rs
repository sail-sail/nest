#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use anyhow::{Result,anyhow};

use crate::common::context::Options;
use crate::common::gql::model::{PageInput, SortInput};

#[allow(unused_imports)]
use crate::src::base::i18n::i18n_dao;

use crate::gen::base::tenant::tenant_model::TenantId;

use super::operation_record_model::*;
use super::operation_record_dao;

/// 根据搜索条件和分页查找操作记录列表
pub async fn find_all(
  search: Option<OperationRecordSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<OperationRecordModel>> {
  
  let res = operation_record_dao::find_all(
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
  
  let res = operation_record_dao::find_count(
    search,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找第一个操作记录
pub async fn find_one(
  search: Option<OperationRecordSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<OperationRecordModel>> {
  
  let model = operation_record_dao::find_one(
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
  
  let model = operation_record_dao::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
pub async fn set_id_by_lbl(
  input: OperationRecordInput,
) -> Result<OperationRecordInput> {
  
  let input = operation_record_dao::set_id_by_lbl(
    input,
  ).await?;
  
  Ok(input)
}

/// 创建操作记录
#[allow(dead_code)]
pub async fn create(
  input: OperationRecordInput,
  options: Option<Options>,
) -> Result<OperationRecordId> {
  
  let id = operation_record_dao::create(
    input,
    options,
  ).await?;
  
  Ok(id)
}

/// 批量创建操作记录
#[allow(dead_code)]
pub async fn creates(
  inputs: Vec<OperationRecordInput>,
  options: Option<Options>,
) -> Result<Vec<OperationRecordId>> {
  
  let ids = operation_record_dao::creates(
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
  
  let num = operation_record_dao::update_tenant_by_id(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改操作记录
#[allow(dead_code)]
#[allow(unused_mut)]
pub async fn update_by_id(
  id: OperationRecordId,
  mut input: OperationRecordInput,
  options: Option<Options>,
) -> Result<OperationRecordId> {
  
  let res = operation_record_dao::update_by_id(
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
  
  let num = operation_record_dao::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取操作记录字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<OperationRecordFieldComment> {
  
  let comments = operation_record_dao::get_field_comments(
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
  
  let num = operation_record_dao::revert_by_ids(
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
  
  let num = operation_record_dao::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}