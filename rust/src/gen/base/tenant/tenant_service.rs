use anyhow::Result;

use crate::common::context::{Ctx, Options};
use crate::common::gql::model::{PageInput, SortInput};

use super::tenant_model::*;
use super::tenant_dao;

/// 根据搜索条件和分页查找数据
pub async fn find_all<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<TenantSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<TenantModel>> {
  
  let res = tenant_dao::find_all(
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
  search: Option<TenantSearch>,
  options: Option<Options>,
) -> Result<i64> {
  
  let res = tenant_dao::find_count(
    ctx,
    search,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找第一条数据
pub async fn find_one<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<TenantSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<TenantModel>> {
    
  let model = tenant_dao::find_one(
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
) -> Result<Option<TenantModel>> {
  
  let model = tenant_dao::find_by_id(
    ctx,
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 创建数据
pub async fn create<'a>(
  ctx: &mut impl Ctx<'a>,
  input: TenantInput,
  options: Option<Options>,
) -> Result<String> {
  
  let id = tenant_dao::create(
    ctx,
    input,
    options,
  ).await?;
  
  Ok(id)
}

/// 根据id修改数据
pub async fn update_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  input: TenantInput,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = tenant_dao::update_by_id(
    ctx,
    id,
    input,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 删除数据
pub async fn delete_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = tenant_dao::delete_by_ids(
    ctx,
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取字段对应的名称
pub async fn get_field_comments<'a>(
  ctx: &mut impl Ctx<'a>,
  options: Option<Options>,
) -> Result<TenantFieldComment> {
  
  let comments = tenant_dao::get_field_comments(
    ctx,
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原数据
pub async fn revert_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = tenant_dao::revert_by_ids(
    ctx,
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除数据
pub async fn force_delete_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = tenant_dao::force_delete_by_ids(
    ctx,
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 order_by 字段的最大值
pub async fn find_last_order_by<'a>(
  ctx: &mut impl Ctx<'a>,
  options: Option<Options>,
) -> Result<i64> {
  
  let res = tenant_dao::find_last_order_by(
    ctx,
    options,
  ).await?;
  
  Ok(res)
}
