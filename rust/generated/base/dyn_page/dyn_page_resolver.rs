
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

use super::dyn_page_model::*;
use super::dyn_page_service;

use crate::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找动态页面列表
#[function_name::named]
pub async fn find_all_dyn_page(
  search: Option<DynPageSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<DynPageModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_dyn_page(sort.as_deref())?;
  
  let models = dyn_page_service::find_all_dyn_page(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找动态页面总数
#[function_name::named]
pub async fn find_count_dyn_page(
  search: Option<DynPageSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = dyn_page_service::find_count_dyn_page(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个动态页面
#[function_name::named]
pub async fn find_one_dyn_page(
  search: Option<DynPageSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<DynPageModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_dyn_page(sort.as_deref())?;
  
  let model = dyn_page_service::find_one_dyn_page(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据条件查找第一个动态页面, 如果不存在则抛错
#[function_name::named]
pub async fn find_one_ok_dyn_page(
  search: Option<DynPageSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<DynPageModel> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_dyn_page(sort.as_deref())?;
  
  let model = dyn_page_service::find_one_ok_dyn_page(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找动态页面
#[function_name::named]
pub async fn find_by_id_dyn_page(
  id: DynPageId,
  options: Option<Options>,
) -> Result<Option<DynPageModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = dyn_page_service::find_by_id_dyn_page(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找动态页面, 如果不存在则抛错
#[function_name::named]
pub async fn find_by_id_ok_dyn_page(
  id: DynPageId,
  options: Option<Options>,
) -> Result<DynPageModel> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = dyn_page_service::find_by_id_ok_dyn_page(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 ids 查找动态页面
#[function_name::named]
pub async fn find_by_ids_dyn_page(
  ids: Vec<DynPageId>,
  options: Option<Options>,
) -> Result<Vec<DynPageModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = dyn_page_service::find_by_ids_dyn_page(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据 ids 查找动态页面, 出现查询不到的 id 则报错
#[function_name::named]
pub async fn find_by_ids_ok_dyn_page(
  ids: Vec<DynPageId>,
  options: Option<Options>,
) -> Result<Vec<DynPageModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = dyn_page_service::find_by_ids_ok_dyn_page(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 创建动态页面
#[allow(dead_code)]
#[function_name::named]
pub async fn creates_dyn_page(
  inputs: Vec<DynPageInput>,
  options: Option<Options>,
) -> Result<Vec<DynPageId>> {
  
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
    let input = dyn_page_service::set_id_by_lbl_dyn_page(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    get_route_path_dyn_page(),
    "add".to_owned(),
  ).await?;
  
  let ids = dyn_page_service::creates_dyn_page(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 动态页面根据id修改租户id
#[allow(dead_code)]
#[function_name::named]
pub async fn update_tenant_by_id_dyn_page(
  id: DynPageId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} tenant_id: {tenant_id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = dyn_page_service::update_tenant_by_id_dyn_page(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改动态页面
#[allow(dead_code)]
#[function_name::named]
pub async fn update_by_id_dyn_page(
  id: DynPageId,
  input: DynPageInput,
  options: Option<Options>,
) -> Result<DynPageId> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} input: {input:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = dyn_page_service::set_id_by_lbl_dyn_page(
    input,
  ).await?;
  
  use_permit(
    get_route_path_dyn_page(),
    "edit".to_owned(),
  ).await?;
  
  let res = dyn_page_service::update_by_id_dyn_page(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除动态页面
#[allow(dead_code)]
#[function_name::named]
pub async fn delete_by_ids_dyn_page(
  ids: Vec<DynPageId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_dyn_page(),
    "delete".to_owned(),
  ).await?;
  
  let num = dyn_page_service::delete_by_ids_dyn_page(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找动态页面是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
#[function_name::named]
pub async fn get_is_enabled_by_id_dyn_page(
  id: DynPageId,
  options: Option<Options>,
) -> Result<bool> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let is_enabled = dyn_page_service::get_is_enabled_by_id_dyn_page(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用动态页面
#[allow(dead_code)]
#[function_name::named]
pub async fn enable_by_ids_dyn_page(
  ids: Vec<DynPageId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?} is_enabled: {is_enabled:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_dyn_page(),
    "edit".to_owned(),
  ).await?;
  
  let num = dyn_page_service::enable_by_ids_dyn_page(
    ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取动态页面字段注释
#[function_name::named]
pub async fn get_field_comments_dyn_page(
  options: Option<Options>,
) -> Result<DynPageFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = dyn_page_service::get_field_comments_dyn_page(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原动态页面
#[allow(dead_code)]
#[function_name::named]
pub async fn revert_by_ids_dyn_page(
  ids: Vec<DynPageId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_dyn_page(),
    "delete".to_owned(),
  ).await?;
  
  let num = dyn_page_service::revert_by_ids_dyn_page(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除动态页面
#[allow(dead_code)]
#[function_name::named]
pub async fn force_delete_by_ids_dyn_page(
  ids: Vec<DynPageId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_dyn_page(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = dyn_page_service::force_delete_by_ids_dyn_page(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 动态页面 order_by 字段的最大值
#[function_name::named]
pub async fn find_last_order_by_dyn_page(
  options: Option<Options>,
) -> Result<u32> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let res = dyn_page_service::find_last_order_by_dyn_page(
    options,
  ).await?;
  
  Ok(res)
}
