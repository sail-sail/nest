#[allow(unused_imports)]
use std::time::Instant;

use anyhow::Result;

use crate::common::context::Options;
use crate::common::gql::model::{PageInput, SortInput};
use crate::src::base::permit::permit_service::use_permit;

use super::dict_model::*;
use super::dict_service;

/// 根据搜索条件和分页查找系统字典列表
pub async fn find_all(
  search: Option<DictSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<DictModel>> {
  
  let res = dict_service::find_all(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找系统字典总数
pub async fn find_count(
  search: Option<DictSearch>,
  options: Option<Options>,
) -> Result<i64> {
  
  let num = dict_service::find_count(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个系统字典
pub async fn find_one(
  search: Option<DictSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<DictModel>> {
  
  let model = dict_service::find_one(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找系统字典
pub async fn find_by_id(
  id: DictId,
  options: Option<Options>,
) -> Result<Option<DictModel>> {
  
  let model = dict_service::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 创建系统字典
#[allow(dead_code)]
pub async fn create(
  input: DictInput,
  options: Option<Options>,
) -> Result<DictId> {
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = dict_service::set_id_by_lbl(
    input,
  ).await?;
  
  use_permit(
    "/base/dict".to_owned(),
    "add".to_owned(),
  ).await?;
  
  let id = dict_service::create(
    input,
    options,
  ).await?;
  
  Ok(id)
}

/// 批量创建系统字典
#[allow(dead_code)]
pub async fn creates(
  inputs: Vec<DictInput>,
  options: Option<Options>,
) -> Result<Vec<DictId>> {
  
  let mut inputs = inputs;
  for input in &mut inputs {
    input.id = None;
  }
  let inputs = inputs;
  
  let mut inputs2 = Vec::with_capacity(inputs.len());
  for input in inputs {
    let input = dict_service::set_id_by_lbl(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    "/base/dict".to_owned(),
    "add".to_owned(),
  ).await?;
  
  let ids = dict_service::creates(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 根据 id 修改系统字典
#[allow(dead_code)]
pub async fn update_by_id(
  id: DictId,
  input: DictInput,
  options: Option<Options>,
) -> Result<DictId> {
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = dict_service::set_id_by_lbl(
    input,
  ).await?;
  
  use_permit(
    "/base/dict".to_owned(),
    "edit".to_owned(),
  ).await?;
  
  let res = dict_service::update_by_id(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除系统字典
#[allow(dead_code)]
pub async fn delete_by_ids(
  ids: Vec<DictId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    "/base/dict".to_owned(),
    "delete".to_owned(),
  ).await?;
  
  let num = dict_service::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找系统字典是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id(
  id: DictId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = dict_service::get_is_enabled_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用系统字典
#[allow(dead_code)]
pub async fn enable_by_ids(
  ids: Vec<DictId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    "/base/dict".to_owned(),
    "edit".to_owned(),
  ).await?;
  
  let num = dict_service::enable_by_ids(
    ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找系统字典是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_locked_by_id(
  id: DictId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_locked = dict_service::get_is_locked_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 ids 锁定或者解锁系统字典
#[allow(dead_code)]
pub async fn lock_by_ids(
  ids: Vec<DictId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    "/base/dict".to_owned(),
    "edit".to_owned(),
  ).await?;
  
  let num = dict_service::lock_by_ids(
    ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取系统字典字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<DictFieldComment> {
  
  let comments = dict_service::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原系统字典
#[allow(dead_code)]
pub async fn revert_by_ids(
  ids: Vec<DictId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    "/base/dict".to_owned(),
    "delete".to_owned(),
  ).await?;
  
  let num = dict_service::revert_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除系统字典
#[allow(dead_code)]
pub async fn force_delete_by_ids(
  ids: Vec<DictId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    "/base/dict".to_owned(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = dict_service::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 系统字典 order_by 字段的最大值
pub async fn find_last_order_by(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = dict_service::find_last_order_by(
    options,
  ).await?;
  
  Ok(res)
}
