#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use anyhow::{Result,anyhow};

use crate::common::context::Options;
use crate::common::gql::model::{PageInput, SortInput};

#[allow(unused_imports)]
use crate::src::base::i18n::i18n_dao;

use super::options_model::*;
use super::options_dao;

/// 根据搜索条件和分页查找系统选项列表
pub async fn find_all(
  search: Option<OptionsSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<OptionsModel>> {
  
  let res = options_dao::find_all(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找系统选项总数
pub async fn find_count(
  search: Option<OptionsSearch>,
  options: Option<Options>,
) -> Result<i64> {
  
  let res = options_dao::find_count(
    search,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找第一个系统选项
pub async fn find_one(
  search: Option<OptionsSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<OptionsModel>> {
  
  let model = options_dao::find_one(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找系统选项
pub async fn find_by_id(
  id: OptionsId,
  options: Option<Options>,
) -> Result<Option<OptionsModel>> {
  
  let model = options_dao::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
pub async fn set_id_by_lbl(
  input: OptionsInput,
) -> Result<OptionsInput> {
  
  let input = options_dao::set_id_by_lbl(
    input,
  ).await?;
  
  Ok(input)
}

/// 创建系统选项
#[allow(dead_code)]
pub async fn create(
  input: OptionsInput,
  options: Option<Options>,
) -> Result<OptionsId> {
  
  let id = options_dao::create(
    input,
    options,
  ).await?;
  
  Ok(id)
}

/// 批量创建系统选项
#[allow(dead_code)]
pub async fn creates(
  inputs: Vec<OptionsInput>,
  options: Option<Options>,
) -> Result<Vec<OptionsId>> {
  
  let ids = options_dao::creates(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 根据 id 修改系统选项
#[allow(dead_code)]
#[allow(unused_mut)]
pub async fn update_by_id(
  id: OptionsId,
  mut input: OptionsInput,
  options: Option<Options>,
) -> Result<OptionsId> {
  
  let is_locked = options_dao::get_is_locked_by_id(
    id.clone(),
    None,
  ).await?;
  
  if is_locked {
    let table_comment = i18n_dao::ns(
      "系统选项".to_owned(),
      None,
    ).await?;
    let map = HashMap::from([
      ("0".to_owned(), table_comment),
    ]);
    let err_msg = i18n_dao::ns(
      "不能修改已经锁定的 {0}".to_owned(),
      map.into(),
    ).await?;
    return Err(anyhow!(err_msg));
  }
  
  // 不能修改系统记录的系统字段
  let model = options_dao::find_by_id(
    id.clone(),
    None,
  ).await?;
  
  if let Some(model) = model {
    if model.is_sys == 1 {
      // 名称
      input.lbl = None;
      // 键
      input.ky = None;
    }
  }
  
  let res = options_dao::update_by_id(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除系统选项
#[allow(dead_code)]
pub async fn delete_by_ids(
  ids: Vec<OptionsId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let len = ids.len();
  let ids0 = ids.clone();
  let mut ids: Vec<OptionsId> = vec![];
  for id in ids0 {
    let is_locked = options_dao::get_is_locked_by_id(
      id.clone(),
      None,
    ).await?;
    
    if is_locked {
      continue;
    }
    
    ids.push(id);
  }
  if ids.is_empty() && len > 0 {
    let table_comment = i18n_dao::ns(
      "系统选项".to_owned(),
      None,
    ).await?;
    let map = HashMap::from([
      ("0".to_owned(), table_comment),
    ]);
    let err_msg = i18n_dao::ns(
      "不能删除已经锁定的 {0}",
      map.into(),
    ).await?;
    return Err(anyhow!(err_msg));
  }
  let ids = ids;
  
  let len = ids.len();
  let ids0 = ids.clone();
  let mut ids: Vec<OptionsId> = vec![];
  for id in ids0 {
    let model = options_dao::find_by_id(
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
  if ids.is_empty() && len > 0 {
    let err_msg = i18n_dao::ns("不能删除系统记录".to_owned(), None).await?;
    return Err(anyhow!(err_msg));
  }
  
  let num = options_dao::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找系统选项是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id(
  id: OptionsId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = options_dao::get_is_enabled_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用系统选项
#[allow(dead_code)]
pub async fn enable_by_ids(
  ids: Vec<OptionsId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = options_dao::enable_by_ids(
    ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找系统选项是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_locked_by_id(
  id: OptionsId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_locked = options_dao::get_is_locked_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 ids 锁定或者解锁系统选项
#[allow(dead_code)]
pub async fn lock_by_ids(
  ids: Vec<OptionsId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = options_dao::lock_by_ids(
    ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取系统选项字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<OptionsFieldComment> {
  
  let comments = options_dao::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原系统选项
#[allow(dead_code)]
pub async fn revert_by_ids(
  ids: Vec<OptionsId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = options_dao::revert_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除系统选项
#[allow(dead_code)]
pub async fn force_delete_by_ids(
  ids: Vec<OptionsId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = options_dao::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 系统选项 order_by 字段的最大值
pub async fn find_last_order_by(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = options_dao::find_last_order_by(
    options,
  ).await?;
  
  Ok(res)
}
