use anyhow::Result;

#[allow(unused_imports)]
use crate::common::context::{
  Ctx,
  SrvErr,
  Options,
};

use crate::common::gql::model::{PageInput, SortInput};

#[allow(unused_imports)]
use crate::src::base::i18n::i18n_dao;

use super::operation_record_model::*;
use super::operation_record_dao;

/// 根据搜索条件和分页查找数据
pub async fn find_all(
  ctx: &Ctx,
  search: Option<OperationRecordSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<OperationRecordModel>> {
  
  let res = operation_record_dao::find_all(
    ctx,
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据搜索条件查找总数
pub async fn find_count(
  ctx: &Ctx,
  search: Option<OperationRecordSearch>,
  options: Option<Options>,
) -> Result<i64> {
  
  let res = operation_record_dao::find_count(
    ctx,
    search,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找第一条数据
pub async fn find_one(
  ctx: &Ctx,
  search: Option<OperationRecordSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<OperationRecordModel>> {
  
  let model = operation_record_dao::find_one(
    ctx,
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据ID查找第一条数据
pub async fn find_by_id(
  ctx: &Ctx,
  id: String,
  options: Option<Options>,
) -> Result<Option<OperationRecordModel>> {
  
  let model = operation_record_dao::find_by_id(
    ctx,
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
pub async fn set_id_by_lbl(
  ctx: &Ctx,
  input: OperationRecordInput,
) -> Result<OperationRecordInput> {
  
  let input = operation_record_dao::set_id_by_lbl(
    ctx,
    input,
  ).await?;
  
  Ok(input)
}

/// 创建数据
#[allow(dead_code)]
pub async fn create(
  ctx: &Ctx,
  input: OperationRecordInput,
  options: Option<Options>,
) -> Result<String> {
  
  let id = operation_record_dao::create(
    ctx,
    input,
    options,
  ).await?;
  
  Ok(id)
}

/// 根据id修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id(
  ctx: &Ctx,
  id: String,
  tenant_id: String,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = operation_record_dao::update_tenant_by_id(
    ctx,
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据id修改数据
#[allow(dead_code)]
#[allow(unused_mut)]
pub async fn update_by_id(
  ctx: &Ctx,
  id: String,
  mut input: OperationRecordInput,
  options: Option<Options>,
) -> Result<String> {
  
  let res = operation_record_dao::update_by_id(
    ctx,
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除数据
#[allow(dead_code)]
pub async fn delete_by_ids(
  ctx: &Ctx,
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = operation_record_dao::delete_by_ids(
    ctx,
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取字段对应的名称
pub async fn get_field_comments(
  ctx: &Ctx,
  options: Option<Options>,
) -> Result<OperationRecordFieldComment> {
  
  let comments = operation_record_dao::get_field_comments(
    ctx,
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原数据
#[allow(dead_code)]
pub async fn revert_by_ids(
  ctx: &Ctx,
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = operation_record_dao::revert_by_ids(
    ctx,
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除数据
#[allow(dead_code)]
pub async fn force_delete_by_ids(
  ctx: &Ctx,
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = operation_record_dao::force_delete_by_ids(
    ctx,
    ids,
    options,
  ).await?;
  
  Ok(num)
}
