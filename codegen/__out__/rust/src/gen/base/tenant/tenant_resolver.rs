#[allow(unused_imports)]
use std::time::Instant;

use color_eyre::eyre::Result;

use crate::common::context::Options;
use crate::common::gql::model::{PageInput, SortInput};
use crate::src::base::permit::permit_service::use_permit;

use super::tenant_model::*;
use super::tenant_service;

/// 根据搜索条件和分页查找租户列表
pub async fn find_all(
  search: Option<TenantSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<TenantModel>> {
  
  check_sort_tenant(sort.as_deref())?;
  
  let models = tenant_service::find_all(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找租户总数
pub async fn find_count(
  search: Option<TenantSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = tenant_service::find_count(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个租户
pub async fn find_one(
  search: Option<TenantSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<TenantModel>> {
  
  check_sort_tenant(sort.as_deref())?;
  
  let model = tenant_service::find_one(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找租户
pub async fn find_by_id(
  id: TenantId,
  options: Option<Options>,
) -> Result<Option<TenantModel>> {
  
  let model = tenant_service::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 创建租户
#[allow(dead_code)]
pub async fn creates(
  inputs: Vec<TenantInput>,
  options: Option<Options>,
) -> Result<Vec<TenantId>> {
  
  let mut inputs = inputs;
  for input in &mut inputs {
    input.id = None;
  }
  let inputs = inputs;
  
  let mut inputs2 = Vec::with_capacity(inputs.len());
  for input in inputs {
    let input = tenant_service::set_id_by_lbl(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    get_route_path_tenant(),
    "add".to_owned(),
  ).await?;
  
  let ids = tenant_service::creates(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 根据 id 修改租户
#[allow(dead_code)]
pub async fn update_by_id(
  id: TenantId,
  input: TenantInput,
  options: Option<Options>,
) -> Result<TenantId> {
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = tenant_service::set_id_by_lbl(
    input,
  ).await?;
  
  use_permit(
    get_route_path_tenant(),
    "edit".to_owned(),
  ).await?;
  
  let res = tenant_service::update_by_id(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除租户
#[allow(dead_code)]
pub async fn delete_by_ids(
  ids: Vec<TenantId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    get_route_path_tenant(),
    "delete".to_owned(),
  ).await?;
  
  let num = tenant_service::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找租户是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id(
  id: TenantId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = tenant_service::get_is_enabled_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用租户
#[allow(dead_code)]
pub async fn enable_by_ids(
  ids: Vec<TenantId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    get_route_path_tenant(),
    "edit".to_owned(),
  ).await?;
  
  let num = tenant_service::enable_by_ids(
    ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找租户是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_locked_by_id(
  id: TenantId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_locked = tenant_service::get_is_locked_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 ids 锁定或者解锁租户
#[allow(dead_code)]
pub async fn lock_by_ids(
  ids: Vec<TenantId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    get_route_path_tenant(),
    "edit".to_owned(),
  ).await?;
  
  let num = tenant_service::lock_by_ids(
    ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取租户字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<TenantFieldComment> {
  
  let comments = tenant_service::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原租户
#[allow(dead_code)]
pub async fn revert_by_ids(
  ids: Vec<TenantId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    get_route_path_tenant(),
    "delete".to_owned(),
  ).await?;
  
  let num = tenant_service::revert_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除租户
#[allow(dead_code)]
pub async fn force_delete_by_ids(
  ids: Vec<TenantId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    get_route_path_tenant(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = tenant_service::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 租户 order_by 字段的最大值
pub async fn find_last_order_by(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = tenant_service::find_last_order_by(
    options,
  ).await?;
  
  Ok(res)
}
