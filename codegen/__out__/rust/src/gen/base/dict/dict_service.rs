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

use super::dict_model::*;
use super::dict_dao;

/// 根据搜索条件和分页查找数据
pub async fn find_all<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<DictSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<DictModel>> {
  
  let res = dict_dao::find_all(
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
  search: Option<DictSearch>,
  options: Option<Options>,
) -> Result<i64> {
  
  let res = dict_dao::find_count(
    ctx,
    search,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找第一条数据
pub async fn find_one<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<DictSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<DictModel>> {
  
  let model = dict_dao::find_one(
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
) -> Result<Option<DictModel>> {
  
  let model = dict_dao::find_by_id(
    ctx,
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 创建数据
#[allow(dead_code)]
pub async fn create<'a>(
  ctx: &mut impl Ctx<'a>,
  input: DictInput,
  options: Option<Options>,
) -> Result<String> {
  
  let id = dict_dao::create(
    ctx,
    input,
    options,
  ).await?;
  
  Ok(id)
}

/// 根据id修改数据
#[allow(dead_code)]
#[allow(unused_mut)]
pub async fn update_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  mut input: DictInput,
  options: Option<Options>,
) -> Result<String> {
  
  let is_locked = dict_dao::get_is_locked_by_id(
    ctx,
    id.clone(),
    None,
  ).await?;
  
  if is_locked {
    let err_msg = i18n_dao::ns(ctx, "不能修改已经锁定的数据".to_owned(), None).await?;
    return Err(SrvErr::msg(err_msg).into());
  }
  
  // 不能修改系统记录的系统字段
  let model = dict_dao::find_by_id(
    ctx,
    id.clone(),
    None,
  ).await?;
  
  if let Some(model) = model {
    if model.is_sys == 1 {
      // 编码
      input.code = None;
      // 数据类型
      input.r#type = None;
      input.type_lbl = None;
      // 启用
      input.is_enabled = None;
      input.is_enabled_lbl = None;
    }
  }
  
  let res = dict_dao::update_by_id(
    ctx,
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除数据
#[allow(dead_code)]
pub async fn delete_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  let len = ids.len();
  let ids0 = ids.clone();
  let mut ids: Vec<String> = vec![];
  for id in ids0 {
    let is_locked = dict_dao::get_is_locked_by_id(
      ctx,
      id.clone(),
      None,
    ).await?;
    
    if is_locked {
      continue;
    }
    
    ids.push(id);
  }
  if ids.len() == 0 && len > 0 {
    let err_msg = i18n_dao::ns(ctx, "不能删除已经锁定的数据".to_owned(), None).await?;
    return Err(SrvErr::msg(err_msg).into());
  }
  let ids = ids;
  
  let len = ids.len();
  let ids0 = ids.clone();
  let mut ids: Vec<String> = vec![];
  for id in ids0 {
    let model = dict_dao::find_by_id(
      ctx,
      id.clone(),
      None,
    ).await?;
    if model.is_none() {
      continue;
    }
    let model = model.unwrap();
    if model.is_sys == 1 {
      continue;
    }
    ids.push(id);
  }
  if ids.len() == 0 && len > 0 {
    let err_msg = i18n_dao::ns(ctx, "不能删除系统记录".to_owned(), None).await?;
    return Err(SrvErr::msg(err_msg).into());
  }
  
  let num = dict_dao::delete_by_ids(
    ctx,
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ID 查找是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = dict_dao::get_is_enabled_by_id(
    ctx,
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用数据
#[allow(dead_code)]
pub async fn enable_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dict_dao::enable_by_ids(
    ctx,
    ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ID 查找是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_locked_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_locked = dict_dao::get_is_locked_by_id(
    ctx,
    id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 ids 锁定或者解锁数据
#[allow(dead_code)]
pub async fn lock_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dict_dao::lock_by_ids(
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
) -> Result<DictFieldComment> {
  
  let comments = dict_dao::get_field_comments(
    ctx,
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原数据
#[allow(dead_code)]
pub async fn revert_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dict_dao::revert_by_ids(
    ctx,
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除数据
#[allow(dead_code)]
pub async fn force_delete_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dict_dao::force_delete_by_ids(
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
) -> Result<u32> {
  
  let res = dict_dao::find_last_order_by(
    ctx,
    options,
  ).await?;
  
  Ok(res)
}
