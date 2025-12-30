
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

use super::optbiz_model::*;
use super::optbiz_service;

use crate::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找业务选项列表
#[function_name::named]
pub async fn find_all_optbiz(
  search: Option<OptbizSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<OptbizModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_optbiz(sort.as_deref())?;
  
  let models = optbiz_service::find_all_optbiz(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找业务选项总数
#[function_name::named]
pub async fn find_count_optbiz(
  search: Option<OptbizSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = optbiz_service::find_count_optbiz(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个业务选项
#[function_name::named]
pub async fn find_one_optbiz(
  search: Option<OptbizSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<OptbizModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_optbiz(sort.as_deref())?;
  
  let model = optbiz_service::find_one_optbiz(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据条件查找第一个业务选项, 如果不存在则抛错
#[function_name::named]
pub async fn find_one_ok_optbiz(
  search: Option<OptbizSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<OptbizModel> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_optbiz(sort.as_deref())?;
  
  let model = optbiz_service::find_one_ok_optbiz(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找业务选项
#[function_name::named]
pub async fn find_by_id_optbiz(
  id: OptbizId,
  options: Option<Options>,
) -> Result<Option<OptbizModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = optbiz_service::find_by_id_optbiz(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找业务选项, 如果不存在则抛错
#[function_name::named]
pub async fn find_by_id_ok_optbiz(
  id: OptbizId,
  options: Option<Options>,
) -> Result<OptbizModel> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = optbiz_service::find_by_id_ok_optbiz(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 ids 查找业务选项
#[function_name::named]
pub async fn find_by_ids_optbiz(
  ids: Vec<OptbizId>,
  options: Option<Options>,
) -> Result<Vec<OptbizModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = optbiz_service::find_by_ids_optbiz(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据 ids 查找业务选项, 出现查询不到的 id 则报错
#[function_name::named]
pub async fn find_by_ids_ok_optbiz(
  ids: Vec<OptbizId>,
  options: Option<Options>,
) -> Result<Vec<OptbizModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = optbiz_service::find_by_ids_ok_optbiz(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 创建业务选项
#[allow(dead_code)]
#[function_name::named]
pub async fn creates_optbiz(
  inputs: Vec<OptbizInput>,
  options: Option<Options>,
) -> Result<Vec<OptbizId>> {
  
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
    let input = optbiz_service::set_id_by_lbl_optbiz(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    get_page_path_optbiz().to_string(),
    "add".to_owned(),
  ).await?;
  
  let ids = optbiz_service::creates_optbiz(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 业务选项根据id修改租户id
#[allow(dead_code)]
#[function_name::named]
pub async fn update_tenant_by_id_optbiz(
  id: OptbizId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} tenant_id: {tenant_id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = optbiz_service::update_tenant_by_id_optbiz(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改业务选项
#[allow(dead_code)]
#[function_name::named]
pub async fn update_by_id_optbiz(
  id: OptbizId,
  input: OptbizInput,
  options: Option<Options>,
) -> Result<OptbizId> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} input: {input:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = optbiz_service::set_id_by_lbl_optbiz(
    input,
  ).await?;
  
  use_permit(
    get_page_path_optbiz().to_string(),
    "edit".to_owned(),
  ).await?;
  
  let res = optbiz_service::update_by_id_optbiz(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除业务选项
#[allow(dead_code)]
#[function_name::named]
pub async fn delete_by_ids_optbiz(
  ids: Vec<OptbizId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_page_path_optbiz().to_string(),
    "delete".to_owned(),
  ).await?;
  
  let num = optbiz_service::delete_by_ids_optbiz(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找业务选项是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
#[function_name::named]
pub async fn get_is_enabled_by_id_optbiz(
  id: OptbizId,
  options: Option<Options>,
) -> Result<bool> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let is_enabled = optbiz_service::get_is_enabled_by_id_optbiz(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用业务选项
#[allow(dead_code)]
#[function_name::named]
pub async fn enable_by_ids_optbiz(
  ids: Vec<OptbizId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?} is_enabled: {is_enabled:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_page_path_optbiz().to_string(),
    "edit".to_owned(),
  ).await?;
  
  let num = optbiz_service::enable_by_ids_optbiz(
    ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找业务选项是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
#[allow(dead_code)]
#[function_name::named]
pub async fn get_is_locked_by_id_optbiz(
  id: OptbizId,
  options: Option<Options>,
) -> Result<bool> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let is_locked = optbiz_service::get_is_locked_by_id_optbiz(
    id,
    options,
  ).await?;
  
  Ok(is_locked)
}

/// 根据 ids 锁定或者解锁业务选项
#[allow(dead_code)]
#[function_name::named]
pub async fn lock_by_ids_optbiz(
  ids: Vec<OptbizId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?} is_locked: {is_locked:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_page_path_optbiz().to_string(),
    "edit".to_owned(),
  ).await?;
  
  let num = optbiz_service::lock_by_ids_optbiz(
    ids,
    is_locked,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取业务选项字段注释
#[function_name::named]
pub async fn get_field_comments_optbiz(
  options: Option<Options>,
) -> Result<OptbizFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = optbiz_service::get_field_comments_optbiz(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原业务选项
#[allow(dead_code)]
#[function_name::named]
pub async fn revert_by_ids_optbiz(
  ids: Vec<OptbizId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_page_path_optbiz().to_string(),
    "delete".to_owned(),
  ).await?;
  
  let num = optbiz_service::revert_by_ids_optbiz(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除业务选项
#[allow(dead_code)]
#[function_name::named]
pub async fn force_delete_by_ids_optbiz(
  ids: Vec<OptbizId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_page_path_optbiz().to_string(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = optbiz_service::force_delete_by_ids_optbiz(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 业务选项 order_by 字段的最大值
#[function_name::named]
pub async fn find_last_order_by_optbiz(
  search: Option<OptbizSearch>,
  options: Option<Options>,
) -> Result<u32> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let order_by = optbiz_service::find_last_order_by_optbiz(
    search,
    options,
  ).await?;
  
  Ok(order_by)
}
