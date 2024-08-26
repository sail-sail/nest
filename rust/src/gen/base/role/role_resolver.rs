#[allow(unused_imports)]
use std::time::Instant;

use anyhow::Result;

use crate::common::context::Options;
use crate::common::gql::model::{PageInput, SortInput};
use crate::src::base::permit::permit_service::use_permit;

use super::role_model::*;
use super::role_service;

use crate::r#gen::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找角色列表
pub async fn find_all(
  search: Option<RoleSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<RoleModel>> {
  
  check_sort_role(sort.as_deref())?;
  
  let res = role_service::find_all(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找角色总数
pub async fn find_count(
  search: Option<RoleSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = role_service::find_count(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个角色
pub async fn find_one(
  search: Option<RoleSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<RoleModel>> {
  
  check_sort_role(sort.as_deref())?;
  
  let model = role_service::find_one(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找角色
pub async fn find_by_id(
  id: RoleId,
  options: Option<Options>,
) -> Result<Option<RoleModel>> {
  
  let model = role_service::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 创建角色
#[allow(dead_code)]
pub async fn creates(
  inputs: Vec<RoleInput>,
  options: Option<Options>,
) -> Result<Vec<RoleId>> {
  
  let mut inputs = inputs;
  for input in &mut inputs {
    input.id = None;
  }
  let inputs = inputs;
  
  let mut inputs2 = Vec::with_capacity(inputs.len());
  for input in inputs {
    let input = role_service::set_id_by_lbl(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    get_route_path_role(),
    "add".to_owned(),
  ).await?;
  
  let ids = role_service::creates(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 角色根据id修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id(
  id: RoleId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = role_service::update_tenant_by_id(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改角色
#[allow(dead_code)]
pub async fn update_by_id(
  id: RoleId,
  input: RoleInput,
  options: Option<Options>,
) -> Result<RoleId> {
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = role_service::set_id_by_lbl(
    input,
  ).await?;
  
  use_permit(
    get_route_path_role(),
    "edit".to_owned(),
  ).await?;
  
  let res = role_service::update_by_id(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除角色
#[allow(dead_code)]
pub async fn delete_by_ids(
  ids: Vec<RoleId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    get_route_path_role(),
    "delete".to_owned(),
  ).await?;
  
  let num = role_service::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找角色是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id(
  id: RoleId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = role_service::get_is_enabled_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用角色
#[allow(dead_code)]
pub async fn enable_by_ids(
  ids: Vec<RoleId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    get_route_path_role(),
    "edit".to_owned(),
  ).await?;
  
  let num = role_service::enable_by_ids(
    ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找角色是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_locked_by_id(
  id: RoleId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_locked = role_service::get_is_locked_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 ids 锁定或者解锁角色
#[allow(dead_code)]
pub async fn lock_by_ids(
  ids: Vec<RoleId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    get_route_path_role(),
    "edit".to_owned(),
  ).await?;
  
  let num = role_service::lock_by_ids(
    ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取角色字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<RoleFieldComment> {
  
  let comments = role_service::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原角色
#[allow(dead_code)]
pub async fn revert_by_ids(
  ids: Vec<RoleId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    get_route_path_role(),
    "delete".to_owned(),
  ).await?;
  
  let num = role_service::revert_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除角色
#[allow(dead_code)]
pub async fn force_delete_by_ids(
  ids: Vec<RoleId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    get_route_path_role(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = role_service::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 角色 order_by 字段的最大值
pub async fn find_last_order_by(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = role_service::find_last_order_by(
    options,
  ).await?;
  
  Ok(res)
}
