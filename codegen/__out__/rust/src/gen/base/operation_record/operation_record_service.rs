use anyhow::Result;

use crate::common::context::{Ctx, Options};
use crate::common::gql::model::{PageInput, SortInput};

use super::operation_record_model::*;
use super::operation_record_dao;

/// 根据搜索条件和分页查找数据
pub async fn find_all<'a>(
  ctx: &mut impl Ctx<'a>,
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
pub async fn find_count<'a>(
  ctx: &mut impl Ctx<'a>,
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
pub async fn find_one<'a>(
  ctx: &mut impl Ctx<'a>,
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
pub async fn find_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
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

/// 创建数据
pub async fn create<'a>(
  ctx: &mut impl Ctx<'a>,
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
