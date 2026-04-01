
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

#[allow(unused_imports)]
use smol_str::SmolStr;

use crate::common::gql::model::{PageInput, SortInput};
#[allow(unused_imports)]
use crate::common::permit::permit_service::use_permit;

use super::process_def_model::*;
use super::process_def_service;

use crate::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找流程定义列表
#[function_name::named]
pub async fn find_all_process_def(
  search: Option<ProcessDefSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<ProcessDefModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_process_def(sort.as_deref())?;
  
  let models = process_def_service::find_all_process_def(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找流程定义总数
#[function_name::named]
pub async fn find_count_process_def(
  search: Option<ProcessDefSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = process_def_service::find_count_process_def(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个流程定义
#[function_name::named]
pub async fn find_one_process_def(
  search: Option<ProcessDefSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<ProcessDefModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_process_def(sort.as_deref())?;
  
  let model = process_def_service::find_one_process_def(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据条件查找第一个流程定义, 如果不存在则抛错
#[function_name::named]
pub async fn find_one_ok_process_def(
  search: Option<ProcessDefSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<ProcessDefModel> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_process_def(sort.as_deref())?;
  
  let model = process_def_service::find_one_ok_process_def(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找流程定义
#[function_name::named]
pub async fn find_by_id_process_def(
  id: ProcessDefId,
  options: Option<Options>,
) -> Result<Option<ProcessDefModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = process_def_service::find_by_id_process_def(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找流程定义, 如果不存在则抛错
#[function_name::named]
pub async fn find_by_id_ok_process_def(
  id: ProcessDefId,
  options: Option<Options>,
) -> Result<ProcessDefModel> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = process_def_service::find_by_id_ok_process_def(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 ids 查找流程定义
#[function_name::named]
pub async fn find_by_ids_process_def(
  ids: Vec<ProcessDefId>,
  options: Option<Options>,
) -> Result<Vec<ProcessDefModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = process_def_service::find_by_ids_process_def(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据 ids 查找流程定义, 出现查询不到的 id 则报错
#[function_name::named]
pub async fn find_by_ids_ok_process_def(
  ids: Vec<ProcessDefId>,
  options: Option<Options>,
) -> Result<Vec<ProcessDefModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = process_def_service::find_by_ids_ok_process_def(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 创建流程定义
#[allow(dead_code)]
#[function_name::named]
pub async fn creates_process_def(
  inputs: Vec<ProcessDefInput>,
  options: Option<Options>,
) -> Result<Vec<ProcessDefId>> {
  
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
    let input = process_def_service::set_id_by_lbl_process_def(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    SmolStr::new(get_page_path_process_def()),
    SmolStr::new("add"),
  ).await?;
  
  let ids = process_def_service::creates_process_def(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 流程定义根据id修改租户id
#[allow(dead_code)]
#[function_name::named]
pub async fn update_tenant_by_id_process_def(
  id: ProcessDefId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} tenant_id: {tenant_id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = process_def_service::update_tenant_by_id_process_def(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改流程定义
#[allow(dead_code)]
#[function_name::named]
pub async fn update_by_id_process_def(
  id: ProcessDefId,
  input: ProcessDefInput,
  options: Option<Options>,
) -> Result<ProcessDefId> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} input: {input:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = process_def_service::set_id_by_lbl_process_def(
    input,
  ).await?;
  
  use_permit(
    SmolStr::new(get_page_path_process_def()),
    SmolStr::new("edit"),
  ).await?;
  
  let res = process_def_service::update_by_id_process_def(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除流程定义
#[allow(dead_code)]
#[function_name::named]
pub async fn delete_by_ids_process_def(
  ids: Vec<ProcessDefId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    SmolStr::new(get_page_path_process_def()),
    SmolStr::new("delete"),
  ).await?;
  
  let num = process_def_service::delete_by_ids_process_def(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找流程定义是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
#[function_name::named]
pub async fn get_is_enabled_by_id_process_def(
  id: ProcessDefId,
  options: Option<Options>,
) -> Result<bool> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let is_enabled = process_def_service::get_is_enabled_by_id_process_def(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用流程定义
#[allow(dead_code)]
#[function_name::named]
pub async fn enable_by_ids_process_def(
  ids: Vec<ProcessDefId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?} is_enabled: {is_enabled:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    SmolStr::new(get_page_path_process_def()),
    SmolStr::new("edit"),
  ).await?;
  
  let num = process_def_service::enable_by_ids_process_def(
    ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取流程定义字段注释
#[function_name::named]
pub async fn get_field_comments_process_def(
  options: Option<Options>,
) -> Result<ProcessDefFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = process_def_service::get_field_comments_process_def(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原流程定义
#[allow(dead_code)]
#[function_name::named]
pub async fn revert_by_ids_process_def(
  ids: Vec<ProcessDefId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    SmolStr::new(get_page_path_process_def()),
    SmolStr::new("delete"),
  ).await?;
  
  let num = process_def_service::revert_by_ids_process_def(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除流程定义
#[allow(dead_code)]
#[function_name::named]
pub async fn force_delete_by_ids_process_def(
  ids: Vec<ProcessDefId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    SmolStr::new(get_page_path_process_def()),
    SmolStr::new("force_delete"),
  ).await?;
  
  let num = process_def_service::force_delete_by_ids_process_def(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 流程定义 order_by 字段的最大值
#[function_name::named]
pub async fn find_last_order_by_process_def(
  search: Option<ProcessDefSearch>,
  options: Option<Options>,
) -> Result<u32> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let order_by = process_def_service::find_last_order_by_process_def(
    search,
    options,
  ).await?;
  
  Ok(order_by)
}
