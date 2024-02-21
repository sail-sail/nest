#[allow(unused_imports)]
use std::collections::HashMap;

use anyhow::Result;

#[allow(unused_imports)]
use crate::common::context::{
  SrvErr,
  Options,
};

use crate::common::gql::model::{PageInput, SortInput};

#[allow(unused_imports)]
use crate::src::base::i18n::i18n_dao;

use super::domain_model::*;
use super::domain_dao;

/// 根据搜索条件和分页查找域名列表
pub async fn find_all(
  search: Option<DomainSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<DomainModel>> {
  
  let res = domain_dao::find_all(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找域名总数
pub async fn find_count(
  search: Option<DomainSearch>,
  options: Option<Options>,
) -> Result<i64> {
  
  let res = domain_dao::find_count(
    search,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找第一个域名
pub async fn find_one(
  search: Option<DomainSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<DomainModel>> {
  
  let model = domain_dao::find_one(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找域名
pub async fn find_by_id(
  id: DomainId,
  options: Option<Options>,
) -> Result<Option<DomainModel>> {
  
  let model = domain_dao::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
pub async fn set_id_by_lbl(
  input: DomainInput,
) -> Result<DomainInput> {
  
  let input = domain_dao::set_id_by_lbl(
    input,
  ).await?;
  
  Ok(input)
}

/// 创建域名
#[allow(dead_code)]
pub async fn create(
  input: DomainInput,
  options: Option<Options>,
) -> Result<DomainId> {
  
  let id = domain_dao::create(
    input,
    options,
  ).await?;
  
  Ok(id)
}

/// 根据 id 修改域名
#[allow(dead_code)]
#[allow(unused_mut)]
pub async fn update_by_id(
  id: DomainId,
  mut input: DomainInput,
  options: Option<Options>,
) -> Result<DomainId> {
  
  let is_locked = domain_dao::get_is_locked_by_id(
    id.clone(),
    None,
  ).await?;
  
  if is_locked {
    let map = HashMap::from([
      ("0".to_owned(), "域名".to_owned()),
    ]);
    let err_msg = i18n_dao::ns(
      "不能修改已经锁定的 {0}".to_owned(),
      map.into(),
    ).await?;
    return Err(SrvErr::msg(err_msg).into());
  }
  
  let res = domain_dao::update_by_id(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除域名
#[allow(dead_code)]
pub async fn delete_by_ids(
  ids: Vec<DomainId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let len = ids.len();
  let ids0 = ids.clone();
  let mut ids: Vec<DomainId> = vec![];
  for id in ids0 {
    let is_locked = domain_dao::get_is_locked_by_id(
      id.clone(),
      None,
    ).await?;
    
    if is_locked {
      continue;
    }
    
    ids.push(id);
  }
  if ids.is_empty() && len > 0 {
    let map = HashMap::from([
      ("0".to_owned(), "域名".to_owned()),
    ]);
    let err_msg = i18n_dao::ns(
      "不能删除已经锁定的 {0}",
      map.into(),
    ).await?;
    return Err(SrvErr::msg(err_msg).into());
  }
  let ids = ids;
  
  let num = domain_dao::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 设置默认域名
#[allow(dead_code)]
pub async fn default_by_id(
  id: DomainId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = domain_dao::default_by_id(
    id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找域名是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id(
  id: DomainId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = domain_dao::get_is_enabled_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用域名
#[allow(dead_code)]
pub async fn enable_by_ids(
  ids: Vec<DomainId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = domain_dao::enable_by_ids(
    ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找域名是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_locked_by_id(
  id: DomainId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_locked = domain_dao::get_is_locked_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 ids 锁定或者解锁域名
#[allow(dead_code)]
pub async fn lock_by_ids(
  ids: Vec<DomainId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = domain_dao::lock_by_ids(
    ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取域名字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<DomainFieldComment> {
  
  let comments = domain_dao::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原域名
#[allow(dead_code)]
pub async fn revert_by_ids(
  ids: Vec<DomainId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = domain_dao::revert_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除域名
#[allow(dead_code)]
pub async fn force_delete_by_ids(
  ids: Vec<DomainId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = domain_dao::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 域名 order_by 字段的最大值
pub async fn find_last_order_by(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = domain_dao::find_last_order_by(
    options,
  ).await?;
  
  Ok(res)
}
