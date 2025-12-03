
#![allow(clippy::clone_on_copy)]
#![allow(clippy::redundant_clone)]

#[allow(unused_imports)]
use std::time::Instant;

use color_eyre::eyre::Result;
use tracing::info;

use crate::common::context::{
  get_req_id,
  Options,
};

use crate::common::gql::model::{PageInput, SortInput};
#[allow(unused_imports)]
use crate::common::permit::permit_service::use_permit;

use super::role_model::*;
use super::role_service;

use crate::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找角色列表
#[function_name::named]
pub async fn find_all_role(
  search: Option<RoleSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<RoleModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_role(sort.as_deref())?;
  
  let models = role_service::find_all_role(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找角色总数
#[function_name::named]
pub async fn find_count_role(
  search: Option<RoleSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = role_service::find_count_role(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个角色
#[function_name::named]
pub async fn find_one_role(
  search: Option<RoleSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<RoleModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_role(sort.as_deref())?;
  
  let model = role_service::find_one_role(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据条件查找第一个角色, 如果不存在则抛错
#[function_name::named]
pub async fn find_one_ok_role(
  search: Option<RoleSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<RoleModel> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_role(sort.as_deref())?;
  
  let model = role_service::find_one_ok_role(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找角色
#[function_name::named]
pub async fn find_by_id_role(
  id: RoleId,
  options: Option<Options>,
) -> Result<Option<RoleModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = role_service::find_by_id_role(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找角色, 如果不存在则抛错
#[function_name::named]
pub async fn find_by_id_ok_role(
  id: RoleId,
  options: Option<Options>,
) -> Result<RoleModel> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = role_service::find_by_id_ok_role(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 ids 查找角色
#[function_name::named]
pub async fn find_by_ids_role(
  ids: Vec<RoleId>,
  options: Option<Options>,
) -> Result<Vec<RoleModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = role_service::find_by_ids_role(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据 ids 查找角色, 出现查询不到的 id 则报错
#[function_name::named]
pub async fn find_by_ids_ok_role(
  ids: Vec<RoleId>,
  options: Option<Options>,
) -> Result<Vec<RoleModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = role_service::find_by_ids_ok_role(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 创建角色
#[allow(dead_code)]
#[function_name::named]
pub async fn creates_role(
  inputs: Vec<RoleInput>,
  options: Option<Options>,
) -> Result<Vec<RoleId>> {
  
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
    let input = role_service::set_id_by_lbl_role(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    get_page_path_role().to_string(),
    "add".to_owned(),
  ).await?;
  
  let ids = role_service::creates_role(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 角色根据id修改租户id
#[allow(dead_code)]
#[function_name::named]
pub async fn update_tenant_by_id_role(
  id: RoleId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} tenant_id: {tenant_id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = role_service::update_tenant_by_id_role(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改角色
#[allow(dead_code)]
#[function_name::named]
pub async fn update_by_id_role(
  id: RoleId,
  input: RoleInput,
  options: Option<Options>,
) -> Result<RoleId> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} input: {input:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = role_service::set_id_by_lbl_role(
    input,
  ).await?;
  
  use_permit(
    get_page_path_role().to_string(),
    "edit".to_owned(),
  ).await?;
  
  let res = role_service::update_by_id_role(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除角色
#[allow(dead_code)]
#[function_name::named]
pub async fn delete_by_ids_role(
  ids: Vec<RoleId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_page_path_role().to_string(),
    "delete".to_owned(),
  ).await?;
  
  let num = role_service::delete_by_ids_role(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找角色是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
#[function_name::named]
pub async fn get_is_enabled_by_id_role(
  id: RoleId,
  options: Option<Options>,
) -> Result<bool> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let is_enabled = role_service::get_is_enabled_by_id_role(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用角色
#[allow(dead_code)]
#[function_name::named]
pub async fn enable_by_ids_role(
  ids: Vec<RoleId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?} is_enabled: {is_enabled:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_page_path_role().to_string(),
    "edit".to_owned(),
  ).await?;
  
  let num = role_service::enable_by_ids_role(
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
#[function_name::named]
pub async fn get_is_locked_by_id_role(
  id: RoleId,
  options: Option<Options>,
) -> Result<bool> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let is_locked = role_service::get_is_locked_by_id_role(
    id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 ids 锁定或者解锁角色
#[allow(dead_code)]
#[function_name::named]
pub async fn lock_by_ids_role(
  ids: Vec<RoleId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?} is_locked: {is_locked:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_page_path_role().to_string(),
    "edit".to_owned(),
  ).await?;
  
  let num = role_service::lock_by_ids_role(
    ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取角色字段注释
#[function_name::named]
pub async fn get_field_comments_role(
  options: Option<Options>,
) -> Result<RoleFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = role_service::get_field_comments_role(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原角色
#[allow(dead_code)]
#[function_name::named]
pub async fn revert_by_ids_role(
  ids: Vec<RoleId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_page_path_role().to_string(),
    "delete".to_owned(),
  ).await?;
  
  let num = role_service::revert_by_ids_role(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除角色
#[allow(dead_code)]
#[function_name::named]
pub async fn force_delete_by_ids_role(
  ids: Vec<RoleId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_page_path_role().to_string(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = role_service::force_delete_by_ids_role(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 角色 order_by 字段的最大值
#[function_name::named]
pub async fn find_last_order_by_role(
  search: Option<RoleSearch>,
  options: Option<Options>,
) -> Result<u32> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let order_by = role_service::find_last_order_by_role(
    search,
    options,
  ).await?;
  
  Ok(order_by)
}
