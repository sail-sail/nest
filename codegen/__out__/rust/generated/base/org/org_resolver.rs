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

use super::org_model::*;
use super::org_service;

use crate::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找组织列表
#[function_name::named]
pub async fn find_all_org(
  search: Option<OrgSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<OrgModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_org(sort.as_deref())?;
  
  let models = org_service::find_all_org(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找组织总数
#[function_name::named]
pub async fn find_count_org(
  search: Option<OrgSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = org_service::find_count_org(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个组织
#[function_name::named]
pub async fn find_one_org(
  search: Option<OrgSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<OrgModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_org(sort.as_deref())?;
  
  let model = org_service::find_one_org(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据条件查找第一个组织, 如果不存在则抛错
#[function_name::named]
pub async fn find_one_ok_org(
  search: Option<OrgSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<OrgModel> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_org(sort.as_deref())?;
  
  let model = org_service::find_one_ok_org(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找组织
#[function_name::named]
pub async fn find_by_id_org(
  id: OrgId,
  options: Option<Options>,
) -> Result<Option<OrgModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = org_service::find_by_id_org(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找组织, 如果不存在则抛错
#[function_name::named]
pub async fn find_by_id_ok_org(
  id: OrgId,
  options: Option<Options>,
) -> Result<OrgModel> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = org_service::find_by_id_ok_org(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 ids 查找组织
#[function_name::named]
pub async fn find_by_ids_org(
  ids: Vec<OrgId>,
  options: Option<Options>,
) -> Result<Vec<OrgModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = org_service::find_by_ids_org(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据 ids 查找组织, 出现查询不到的 id 则报错
#[function_name::named]
pub async fn find_by_ids_ok_org(
  ids: Vec<OrgId>,
  options: Option<Options>,
) -> Result<Vec<OrgModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = org_service::find_by_ids_ok_org(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 创建组织
#[allow(dead_code)]
#[function_name::named]
pub async fn creates_org(
  inputs: Vec<OrgInput>,
  options: Option<Options>,
) -> Result<Vec<OrgId>> {
  
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
    let input = org_service::set_id_by_lbl_org(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    get_route_path_org(),
    "add".to_owned(),
  ).await?;
  
  let ids = org_service::creates_org(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 组织根据id修改租户id
#[allow(dead_code)]
#[function_name::named]
pub async fn update_tenant_by_id_org(
  id: OrgId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} tenant_id: {tenant_id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = org_service::update_tenant_by_id_org(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改组织
#[allow(dead_code)]
#[function_name::named]
pub async fn update_by_id_org(
  id: OrgId,
  input: OrgInput,
  options: Option<Options>,
) -> Result<OrgId> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} input: {input:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = org_service::set_id_by_lbl_org(
    input,
  ).await?;
  
  use_permit(
    get_route_path_org(),
    "edit".to_owned(),
  ).await?;
  
  let res = org_service::update_by_id_org(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除组织
#[allow(dead_code)]
#[function_name::named]
pub async fn delete_by_ids_org(
  ids: Vec<OrgId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_org(),
    "delete".to_owned(),
  ).await?;
  
  let num = org_service::delete_by_ids_org(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找组织是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
#[function_name::named]
pub async fn get_is_enabled_by_id_org(
  id: OrgId,
  options: Option<Options>,
) -> Result<bool> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let is_enabled = org_service::get_is_enabled_by_id_org(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用组织
#[allow(dead_code)]
#[function_name::named]
pub async fn enable_by_ids_org(
  ids: Vec<OrgId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?} is_enabled: {is_enabled:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_org(),
    "edit".to_owned(),
  ).await?;
  
  let num = org_service::enable_by_ids_org(
    ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找组织是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[allow(dead_code)]
#[function_name::named]
pub async fn get_is_locked_by_id_org(
  id: OrgId,
  options: Option<Options>,
) -> Result<bool> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let is_locked = org_service::get_is_locked_by_id_org(
    id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 ids 锁定或者解锁组织
#[allow(dead_code)]
#[function_name::named]
pub async fn lock_by_ids_org(
  ids: Vec<OrgId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?} is_locked: {is_locked:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_org(),
    "edit".to_owned(),
  ).await?;
  
  let num = org_service::lock_by_ids_org(
    ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取组织字段注释
#[function_name::named]
pub async fn get_field_comments_org(
  options: Option<Options>,
) -> Result<OrgFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = org_service::get_field_comments_org(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原组织
#[allow(dead_code)]
#[function_name::named]
pub async fn revert_by_ids_org(
  ids: Vec<OrgId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_org(),
    "delete".to_owned(),
  ).await?;
  
  let num = org_service::revert_by_ids_org(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除组织
#[allow(dead_code)]
#[function_name::named]
pub async fn force_delete_by_ids_org(
  ids: Vec<OrgId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_org(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = org_service::force_delete_by_ids_org(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 组织 order_by 字段的最大值
#[function_name::named]
pub async fn find_last_order_by_org(
  options: Option<Options>,
) -> Result<u32> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let res = org_service::find_last_order_by_org(
    options,
  ).await?;
  
  Ok(res)
}
