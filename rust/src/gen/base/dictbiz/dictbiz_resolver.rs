#[allow(unused_imports)]
use std::time::Instant;

use anyhow::Result;

use crate::common::context::Options;
use crate::common::gql::model::{PageInput, SortInput};
use crate::src::base::permit::permit_service::use_permit;

use super::dictbiz_model::*;
use super::dictbiz_service;

use crate::gen::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找业务字典列表
pub async fn find_all(
  search: Option<DictbizSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<DictbizModel>> {
  
  let res = dictbiz_service::find_all(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找业务字典总数
pub async fn find_count(
  search: Option<DictbizSearch>,
  options: Option<Options>,
) -> Result<i64> {
  
  let num = dictbiz_service::find_count(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个业务字典
pub async fn find_one(
  search: Option<DictbizSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<DictbizModel>> {
  
  let model = dictbiz_service::find_one(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找业务字典
pub async fn find_by_id(
  id: DictbizId,
  options: Option<Options>,
) -> Result<Option<DictbizModel>> {
  
  let model = dictbiz_service::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 创建业务字典
#[allow(dead_code)]
pub async fn creates(
  inputs: Vec<DictbizInput>,
  options: Option<Options>,
) -> Result<Vec<DictbizId>> {
  
  let mut inputs = inputs;
  for input in &mut inputs {
    input.id = None;
  }
  let inputs = inputs;
  
  let mut inputs2 = Vec::with_capacity(inputs.len());
  for input in inputs {
    let input = dictbiz_service::set_id_by_lbl(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    "/base/dictbiz".to_owned(),
    "add".to_owned(),
  ).await?;
  
  let ids = dictbiz_service::creates(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 业务字典根据id修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id(
  id: DictbizId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dictbiz_service::update_tenant_by_id(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改业务字典
#[allow(dead_code)]
pub async fn update_by_id(
  id: DictbizId,
  input: DictbizInput,
  options: Option<Options>,
) -> Result<DictbizId> {
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = dictbiz_service::set_id_by_lbl(
    input,
  ).await?;
  
  use_permit(
    "/base/dictbiz".to_owned(),
    "edit".to_owned(),
  ).await?;
  
  let res = dictbiz_service::update_by_id(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除业务字典
#[allow(dead_code)]
pub async fn delete_by_ids(
  ids: Vec<DictbizId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    "/base/dictbiz".to_owned(),
    "delete".to_owned(),
  ).await?;
  
  let num = dictbiz_service::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找业务字典是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id(
  id: DictbizId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = dictbiz_service::get_is_enabled_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用业务字典
#[allow(dead_code)]
pub async fn enable_by_ids(
  ids: Vec<DictbizId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    "/base/dictbiz".to_owned(),
    "edit".to_owned(),
  ).await?;
  
  let num = dictbiz_service::enable_by_ids(
    ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找业务字典是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_locked_by_id(
  id: DictbizId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_locked = dictbiz_service::get_is_locked_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 ids 锁定或者解锁业务字典
#[allow(dead_code)]
pub async fn lock_by_ids(
  ids: Vec<DictbizId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    "/base/dictbiz".to_owned(),
    "edit".to_owned(),
  ).await?;
  
  let num = dictbiz_service::lock_by_ids(
    ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取业务字典字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<DictbizFieldComment> {
  
  let comments = dictbiz_service::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原业务字典
#[allow(dead_code)]
pub async fn revert_by_ids(
  ids: Vec<DictbizId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    "/base/dictbiz".to_owned(),
    "delete".to_owned(),
  ).await?;
  
  let num = dictbiz_service::revert_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除业务字典
#[allow(dead_code)]
pub async fn force_delete_by_ids(
  ids: Vec<DictbizId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    "/base/dictbiz".to_owned(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = dictbiz_service::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 业务字典 order_by 字段的最大值
pub async fn find_last_order_by(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = dictbiz_service::find_last_order_by(
    options,
  ).await?;
  
  Ok(res)
}