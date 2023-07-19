use tracing::instrument;
use anyhow::Result;

use crate::common::context::{
  Ctx,
  SrvErr,
  Options,
};

use crate::common::gql::model::{PageInput, SortInput};

use crate::src::base::i18n::i18n_dao;

use super::lang_model::*;
use super::lang_dao;

/// 根据搜索条件和分页查找数据
#[instrument(skip(ctx))]
pub async fn find_all<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<LangSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<LangModel>> {
  
  let res = lang_dao::find_all(
    ctx,
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据搜索条件查找总数
#[instrument(skip(ctx))]
pub async fn find_count<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<LangSearch>,
  options: Option<Options>,
) -> Result<i64> {
  
  let res = lang_dao::find_count(
    ctx,
    search,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找第一条数据
#[instrument(skip(ctx))]
pub async fn find_one<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<LangSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<LangModel>> {
  
  let model = lang_dao::find_one(
    ctx,
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据ID查找第一条数据
#[instrument(skip(ctx))]
pub async fn find_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  options: Option<Options>,
) -> Result<Option<LangModel>> {
  
  let model = lang_dao::find_by_id(
    ctx,
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 创建数据
#[instrument(skip(ctx))]
#[allow(dead_code)]
pub async fn create<'a>(
  ctx: &mut impl Ctx<'a>,
  input: LangInput,
  options: Option<Options>,
) -> Result<String> {
  
  let id = lang_dao::create(
    ctx,
    input,
    options,
  ).await?;
  
  Ok(id)
}

/// 根据id修改数据
#[instrument(skip(ctx))]
#[allow(dead_code)]
pub async fn update_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  input: LangInput,
  options: Option<Options>,
) -> Result<String> {
  
  let res = lang_dao::update_by_id(
    ctx,
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除数据
#[instrument(skip(ctx))]
#[allow(dead_code)]
pub async fn delete_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = lang_dao::delete_by_ids(
    ctx,
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ID 查找是否已启用
/// 记录不存在则返回 false
#[instrument(skip(ctx))]
#[allow(dead_code)]
pub async fn get_is_enabled_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = lang_dao::get_is_enabled_by_id(
    ctx,
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用数据
#[instrument(skip(ctx))]
#[allow(dead_code)]
pub async fn enable_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = lang_dao::enable_by_ids(
    ctx,
    ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取字段对应的名称
pub async fn get_field_comments<'a>(
  ctx: &mut impl Ctx<'a>,
  options: Option<Options>,
) -> Result<LangFieldComment> {
  
  let comments = lang_dao::get_field_comments(
    ctx,
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原数据
#[instrument(skip(ctx))]
#[allow(dead_code)]
pub async fn revert_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = lang_dao::revert_by_ids(
    ctx,
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除数据
#[instrument(skip(ctx))]
#[allow(dead_code)]
pub async fn force_delete_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = lang_dao::force_delete_by_ids(
    ctx,
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 order_by 字段的最大值
#[instrument(skip(ctx))]
pub async fn find_last_order_by<'a>(
  ctx: &mut impl Ctx<'a>,
  options: Option<Options>,
) -> Result<u32> {
  
  let res = lang_dao::find_last_order_by(
    ctx,
    options,
  ).await?;
  
  Ok(res)
}
