
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

use super::dyn_page_field_model::*;
use super::dyn_page_field_service;

use crate::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找动态页面字段列表
#[function_name::named]
pub async fn find_all_dyn_page_field(
  search: Option<DynPageFieldSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<DynPageFieldModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_dyn_page_field(sort.as_deref())?;
  
  let models = dyn_page_field_service::find_all_dyn_page_field(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找动态页面字段总数
#[function_name::named]
pub async fn find_count_dyn_page_field(
  search: Option<DynPageFieldSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = dyn_page_field_service::find_count_dyn_page_field(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个动态页面字段
#[function_name::named]
pub async fn find_one_dyn_page_field(
  search: Option<DynPageFieldSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<DynPageFieldModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_dyn_page_field(sort.as_deref())?;
  
  let model = dyn_page_field_service::find_one_dyn_page_field(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据条件查找第一个动态页面字段, 如果不存在则抛错
#[function_name::named]
pub async fn find_one_ok_dyn_page_field(
  search: Option<DynPageFieldSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<DynPageFieldModel> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_dyn_page_field(sort.as_deref())?;
  
  let model = dyn_page_field_service::find_one_ok_dyn_page_field(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找动态页面字段
#[function_name::named]
pub async fn find_by_id_dyn_page_field(
  id: DynPageFieldId,
  options: Option<Options>,
) -> Result<Option<DynPageFieldModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = dyn_page_field_service::find_by_id_dyn_page_field(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找动态页面字段, 如果不存在则抛错
#[function_name::named]
pub async fn find_by_id_ok_dyn_page_field(
  id: DynPageFieldId,
  options: Option<Options>,
) -> Result<DynPageFieldModel> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = dyn_page_field_service::find_by_id_ok_dyn_page_field(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 ids 查找动态页面字段
#[function_name::named]
pub async fn find_by_ids_dyn_page_field(
  ids: Vec<DynPageFieldId>,
  options: Option<Options>,
) -> Result<Vec<DynPageFieldModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = dyn_page_field_service::find_by_ids_dyn_page_field(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据 ids 查找动态页面字段, 出现查询不到的 id 则报错
#[function_name::named]
pub async fn find_by_ids_ok_dyn_page_field(
  ids: Vec<DynPageFieldId>,
  options: Option<Options>,
) -> Result<Vec<DynPageFieldModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = dyn_page_field_service::find_by_ids_ok_dyn_page_field(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 创建动态页面字段
#[allow(dead_code)]
#[function_name::named]
pub async fn creates_dyn_page_field(
  inputs: Vec<DynPageFieldInput>,
  options: Option<Options>,
) -> Result<Vec<DynPageFieldId>> {
  
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
    let input = dyn_page_field_service::set_id_by_lbl_dyn_page_field(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    get_route_path_dyn_page_field(),
    "add".to_owned(),
  ).await?;
  
  let ids = dyn_page_field_service::creates_dyn_page_field(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 动态页面字段根据id修改租户id
#[allow(dead_code)]
#[function_name::named]
pub async fn update_tenant_by_id_dyn_page_field(
  id: DynPageFieldId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} tenant_id: {tenant_id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = dyn_page_field_service::update_tenant_by_id_dyn_page_field(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改动态页面字段
#[allow(dead_code)]
#[function_name::named]
pub async fn update_by_id_dyn_page_field(
  id: DynPageFieldId,
  input: DynPageFieldInput,
  options: Option<Options>,
) -> Result<DynPageFieldId> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} input: {input:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = dyn_page_field_service::set_id_by_lbl_dyn_page_field(
    input,
  ).await?;
  
  use_permit(
    get_route_path_dyn_page_field(),
    "edit".to_owned(),
  ).await?;
  
  let res = dyn_page_field_service::update_by_id_dyn_page_field(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除动态页面字段
#[allow(dead_code)]
#[function_name::named]
pub async fn delete_by_ids_dyn_page_field(
  ids: Vec<DynPageFieldId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_dyn_page_field(),
    "delete".to_owned(),
  ).await?;
  
  let num = dyn_page_field_service::delete_by_ids_dyn_page_field(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找动态页面字段是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
#[function_name::named]
pub async fn get_is_enabled_by_id_dyn_page_field(
  id: DynPageFieldId,
  options: Option<Options>,
) -> Result<bool> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let is_enabled = dyn_page_field_service::get_is_enabled_by_id_dyn_page_field(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用动态页面字段
#[allow(dead_code)]
#[function_name::named]
pub async fn enable_by_ids_dyn_page_field(
  ids: Vec<DynPageFieldId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?} is_enabled: {is_enabled:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_dyn_page_field(),
    "edit".to_owned(),
  ).await?;
  
  let num = dyn_page_field_service::enable_by_ids_dyn_page_field(
    ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取动态页面字段字段注释
#[function_name::named]
pub async fn get_field_comments_dyn_page_field(
  options: Option<Options>,
) -> Result<DynPageFieldFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = dyn_page_field_service::get_field_comments_dyn_page_field(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原动态页面字段
#[allow(dead_code)]
#[function_name::named]
pub async fn revert_by_ids_dyn_page_field(
  ids: Vec<DynPageFieldId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_dyn_page_field(),
    "delete".to_owned(),
  ).await?;
  
  let num = dyn_page_field_service::revert_by_ids_dyn_page_field(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除动态页面字段
#[allow(dead_code)]
#[function_name::named]
pub async fn force_delete_by_ids_dyn_page_field(
  ids: Vec<DynPageFieldId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_dyn_page_field(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = dyn_page_field_service::force_delete_by_ids_dyn_page_field(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 动态页面字段 order_by 字段的最大值
#[function_name::named]
pub async fn find_last_order_by_dyn_page_field(
  options: Option<Options>,
) -> Result<u32> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let res = dyn_page_field_service::find_last_order_by_dyn_page_field(
    options,
  ).await?;
  
  Ok(res)
}
