#[allow(unused_imports)]
use std::time::Instant;

use color_eyre::eyre::Result;
use tracing::info;

use crate::common::context::{
  get_req_id,
  Options,
};

use crate::common::gql::model::{PageInput, SortInput};
use crate::src::base::permit::permit_service::use_permit;

use super::dept_model::*;
use super::dept_service;

use crate::r#gen::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找部门列表
#[function_name::named]
pub async fn find_all(
  search: Option<DeptSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<DeptModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_dept(sort.as_deref())?;
  
  let models = dept_service::find_all(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找部门总数
#[function_name::named]
pub async fn find_count(
  search: Option<DeptSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = dept_service::find_count(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个部门
#[function_name::named]
pub async fn find_one(
  search: Option<DeptSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<DeptModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_dept(sort.as_deref())?;
  
  let model = dept_service::find_one(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找部门
#[function_name::named]
pub async fn find_by_id(
  id: DeptId,
  options: Option<Options>,
) -> Result<Option<DeptModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = dept_service::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 创建部门
#[allow(dead_code)]
#[function_name::named]
pub async fn creates(
  inputs: Vec<DeptInput>,
  options: Option<Options>,
) -> Result<Vec<DeptId>> {
  
  info!(
    "{req_id} {function_name}: inputs: {inputs:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let mut inputs = inputs;
  for input in &mut inputs {
    input.id = None;
  }
  let inputs = inputs;
  
  let mut inputs2 = Vec::with_capacity(inputs.len());
  for input in inputs {
    let input = dept_service::set_id_by_lbl(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    get_route_path_dept(),
    "add".to_owned(),
  ).await?;
  
  let ids = dept_service::creates(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 部门根据id修改租户id
#[allow(dead_code)]
#[function_name::named]
pub async fn update_tenant_by_id(
  id: DeptId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} tenant_id: {tenant_id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = dept_service::update_tenant_by_id(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改部门
#[allow(dead_code)]
#[function_name::named]
pub async fn update_by_id(
  id: DeptId,
  input: DeptInput,
  options: Option<Options>,
) -> Result<DeptId> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} input: {input:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = dept_service::set_id_by_lbl(
    input,
  ).await?;
  
  use_permit(
    get_route_path_dept(),
    "edit".to_owned(),
  ).await?;
  
  let res = dept_service::update_by_id(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除部门
#[allow(dead_code)]
#[function_name::named]
pub async fn delete_by_ids(
  ids: Vec<DeptId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_dept(),
    "delete".to_owned(),
  ).await?;
  
  let num = dept_service::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找部门是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
#[function_name::named]
pub async fn get_is_enabled_by_id(
  id: DeptId,
  options: Option<Options>,
) -> Result<bool> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let is_enabled = dept_service::get_is_enabled_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用部门
#[allow(dead_code)]
#[function_name::named]
pub async fn enable_by_ids(
  ids: Vec<DeptId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?} is_enabled: {is_enabled:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_dept(),
    "edit".to_owned(),
  ).await?;
  
  let num = dept_service::enable_by_ids(
    ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找部门是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[allow(dead_code)]
#[function_name::named]
pub async fn get_is_locked_by_id(
  id: DeptId,
  options: Option<Options>,
) -> Result<bool> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let is_locked = dept_service::get_is_locked_by_id(
    id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 ids 锁定或者解锁部门
#[allow(dead_code)]
#[function_name::named]
pub async fn lock_by_ids(
  ids: Vec<DeptId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?} is_locked: {is_locked:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_dept(),
    "edit".to_owned(),
  ).await?;
  
  let num = dept_service::lock_by_ids(
    ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取部门字段注释
#[function_name::named]
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<DeptFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = dept_service::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原部门
#[allow(dead_code)]
#[function_name::named]
pub async fn revert_by_ids(
  ids: Vec<DeptId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_dept(),
    "delete".to_owned(),
  ).await?;
  
  let num = dept_service::revert_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除部门
#[allow(dead_code)]
#[function_name::named]
pub async fn force_delete_by_ids(
  ids: Vec<DeptId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_dept(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = dept_service::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 部门 order_by 字段的最大值
#[function_name::named]
pub async fn find_last_order_by(
  options: Option<Options>,
) -> Result<u32> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let res = dept_service::find_last_order_by(
    options,
  ).await?;
  
  Ok(res)
}
