#[allow(unused_imports)]
use std::time::Instant;

use anyhow::Result;

use crate::common::context::Options;
use crate::common::gql::model::{PageInput, SortInput};
use crate::src::base::permit::permit_service::use_permit;

use super::domain_model::*;
use super::domain_service;

/// 根据搜索条件和分页查找域名列表
pub async fn find_all(
  search: Option<DomainSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<DomainModel>> {
  
  let res = domain_service::find_all(
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
  
  let num = domain_service::find_count(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个域名
pub async fn find_one(
  search: Option<DomainSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<DomainModel>> {
  
  let model = domain_service::find_one(
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
  
  let model = domain_service::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 创建域名
#[allow(dead_code)]
pub async fn create(
  input: DomainInput,
  options: Option<Options>,
) -> Result<DomainId> {
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = domain_service::set_id_by_lbl(
    input,
  ).await?;
  
  use_permit(
    "/base/domain".to_owned(),
    "add".to_owned(),
  ).await?;
  
  let id = domain_service::create(
    input,
    options,
  ).await?;
  
  Ok(id)
}

/// 根据 id 修改域名
#[allow(dead_code)]
pub async fn update_by_id(
  id: DomainId,
  input: DomainInput,
  options: Option<Options>,
) -> Result<DomainId> {
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = domain_service::set_id_by_lbl(
    input,
  ).await?;
  
  use_permit(
    "/base/domain".to_owned(),
    "edit".to_owned(),
  ).await?;
  
  let res = domain_service::update_by_id(
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
  
  use_permit(
    "/base/domain".to_owned(),
    "delete".to_owned(),
  ).await?;
  
  let num = domain_service::delete_by_ids(
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
  
  use_permit(
    "/base/domain".to_owned(),
    "edit".to_owned(),
  ).await?;
  
  let num = domain_service::default_by_id(
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
  
  let is_enabled = domain_service::get_is_enabled_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用域名
#[allow(dead_code)]
pub async fn enable_by_ids(
  ids: Vec<DomainId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    "/base/domain".to_owned(),
    "edit".to_owned(),
  ).await?;
  
  let num = domain_service::enable_by_ids(
    ids,
    is_enabled,
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
  
  let is_locked = domain_service::get_is_locked_by_id(
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
  
  use_permit(
    "/base/domain".to_owned(),
    "edit".to_owned(),
  ).await?;
  
  let num = domain_service::lock_by_ids(
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
  
  let comments = domain_service::get_field_comments(
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
  
  use_permit(
    "/base/domain".to_owned(),
    "delete".to_owned(),
  ).await?;
  
  let num = domain_service::revert_by_ids(
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
  
  use_permit(
    "/base/domain".to_owned(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = domain_service::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 域名 order_by 字段的最大值
pub async fn find_last_order_by(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = domain_service::find_last_order_by(
    options,
  ).await?;
  
  Ok(res)
}
