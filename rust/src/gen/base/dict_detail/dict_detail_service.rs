use anyhow::Result;

#[allow(unused_imports)]
use crate::common::context::{
  SrvErr,
  Options,
};

use crate::common::gql::model::{PageInput, SortInput};

#[allow(unused_imports)]
use crate::src::base::i18n::i18n_dao;

use super::dict_detail_model::*;
use super::dict_detail_dao;

/// 根据搜索条件和分页查找系统字典明细列表
pub async fn find_all(
  search: Option<DictDetailSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<DictDetailModel>> {
  
  let res = dict_detail_dao::find_all(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找系统字典明细总数
pub async fn find_count(
  search: Option<DictDetailSearch>,
  options: Option<Options>,
) -> Result<i64> {
  
  let res = dict_detail_dao::find_count(
    search,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找第一个系统字典明细
pub async fn find_one(
  search: Option<DictDetailSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<DictDetailModel>> {
  
  let model = dict_detail_dao::find_one(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找系统字典明细
pub async fn find_by_id(
  id: DictDetailId,
  options: Option<Options>,
) -> Result<Option<DictDetailModel>> {
  
  let model = dict_detail_dao::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
pub async fn set_id_by_lbl(
  input: DictDetailInput,
) -> Result<DictDetailInput> {
  
  let input = dict_detail_dao::set_id_by_lbl(
    input,
  ).await?;
  
  Ok(input)
}

/// 创建系统字典明细
#[allow(dead_code)]
pub async fn create(
  input: DictDetailInput,
  options: Option<Options>,
) -> Result<DictDetailId> {
  
  let id = dict_detail_dao::create(
    input,
    options,
  ).await?;
  
  Ok(id)
}

/// 根据 id 修改系统字典明细
#[allow(dead_code)]
#[allow(unused_mut)]
pub async fn update_by_id(
  id: DictDetailId,
  mut input: DictDetailInput,
  options: Option<Options>,
) -> Result<DictDetailId> {
  
  let is_locked = dict_detail_dao::get_is_locked_by_id(
    id.clone(),
    None,
  ).await?;
  
  if is_locked {
    let err_msg = i18n_dao::ns("不能修改已经锁定的数据".to_owned(), None).await?;
    return Err(SrvErr::msg(err_msg).into());
  }
  
  let res = dict_detail_dao::update_by_id(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除系统字典明细
#[allow(dead_code)]
pub async fn delete_by_ids(
  ids: Vec<DictDetailId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let len = ids.len();
  let ids0 = ids.clone();
  let mut ids: Vec<DictDetailId> = vec![];
  for id in ids0 {
    let is_locked = dict_detail_dao::get_is_locked_by_id(
      id.clone(),
      None,
    ).await?;
    
    if is_locked {
      continue;
    }
    
    ids.push(id);
  }
  if ids.is_empty() && len > 0 {
    let err_msg = i18n_dao::ns(
      "不能删除已经锁定的数据".to_owned(),
      None,
    ).await?;
    return Err(SrvErr::msg(err_msg).into());
  }
  let ids = ids;
  
  let len = ids.len();
  let ids0 = ids.clone();
  let mut ids: Vec<DictDetailId> = vec![];
  for id in ids0 {
    let model = dict_detail_dao::find_by_id(
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
    return Err(SrvErr::msg(err_msg).into());
  }
  
  let num = dict_detail_dao::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找系统字典明细是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id(
  id: DictDetailId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = dict_detail_dao::get_is_enabled_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用系统字典明细
#[allow(dead_code)]
pub async fn enable_by_ids(
  ids: Vec<DictDetailId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dict_detail_dao::enable_by_ids(
    ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找系统字典明细是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_locked_by_id(
  id: DictDetailId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_locked = dict_detail_dao::get_is_locked_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 ids 锁定或者解锁系统字典明细
#[allow(dead_code)]
pub async fn lock_by_ids(
  ids: Vec<DictDetailId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dict_detail_dao::lock_by_ids(
    ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取系统字典明细字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<DictDetailFieldComment> {
  
  let comments = dict_detail_dao::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原系统字典明细
#[allow(dead_code)]
pub async fn revert_by_ids(
  ids: Vec<DictDetailId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dict_detail_dao::revert_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除系统字典明细
#[allow(dead_code)]
pub async fn force_delete_by_ids(
  ids: Vec<DictDetailId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dict_detail_dao::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 系统字典明细 order_by 字段的最大值
pub async fn find_last_order_by(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = dict_detail_dao::find_last_order_by(
    options,
  ).await?;
  
  Ok(res)
}
