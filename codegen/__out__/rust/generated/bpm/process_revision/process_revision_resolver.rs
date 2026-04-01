
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

use super::process_revision_model::*;
use super::process_revision_service;

use crate::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找流程版本列表
#[function_name::named]
pub async fn find_all_process_revision(
  search: Option<ProcessRevisionSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<ProcessRevisionModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_process_revision(sort.as_deref())?;
  
  let models = process_revision_service::find_all_process_revision(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找流程版本总数
#[function_name::named]
pub async fn find_count_process_revision(
  search: Option<ProcessRevisionSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = process_revision_service::find_count_process_revision(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个流程版本
#[function_name::named]
pub async fn find_one_process_revision(
  search: Option<ProcessRevisionSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<ProcessRevisionModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_process_revision(sort.as_deref())?;
  
  let model = process_revision_service::find_one_process_revision(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据条件查找第一个流程版本, 如果不存在则抛错
#[function_name::named]
pub async fn find_one_ok_process_revision(
  search: Option<ProcessRevisionSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<ProcessRevisionModel> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_process_revision(sort.as_deref())?;
  
  let model = process_revision_service::find_one_ok_process_revision(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找流程版本
#[function_name::named]
pub async fn find_by_id_process_revision(
  id: ProcessRevisionId,
  options: Option<Options>,
) -> Result<Option<ProcessRevisionModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = process_revision_service::find_by_id_process_revision(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找流程版本, 如果不存在则抛错
#[function_name::named]
pub async fn find_by_id_ok_process_revision(
  id: ProcessRevisionId,
  options: Option<Options>,
) -> Result<ProcessRevisionModel> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = process_revision_service::find_by_id_ok_process_revision(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 ids 查找流程版本
#[function_name::named]
pub async fn find_by_ids_process_revision(
  ids: Vec<ProcessRevisionId>,
  options: Option<Options>,
) -> Result<Vec<ProcessRevisionModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = process_revision_service::find_by_ids_process_revision(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据 ids 查找流程版本, 出现查询不到的 id 则报错
#[function_name::named]
pub async fn find_by_ids_ok_process_revision(
  ids: Vec<ProcessRevisionId>,
  options: Option<Options>,
) -> Result<Vec<ProcessRevisionModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = process_revision_service::find_by_ids_ok_process_revision(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 创建流程版本
#[allow(dead_code)]
#[function_name::named]
pub async fn creates_process_revision(
  inputs: Vec<ProcessRevisionInput>,
  options: Option<Options>,
) -> Result<Vec<ProcessRevisionId>> {
  
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
    let input = process_revision_service::set_id_by_lbl_process_revision(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    SmolStr::new(get_page_path_process_revision()),
    SmolStr::new("add"),
  ).await?;
  
  let ids = process_revision_service::creates_process_revision(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 流程版本根据id修改租户id
#[allow(dead_code)]
#[function_name::named]
pub async fn update_tenant_by_id_process_revision(
  id: ProcessRevisionId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} tenant_id: {tenant_id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = process_revision_service::update_tenant_by_id_process_revision(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改流程版本
#[allow(dead_code)]
#[function_name::named]
pub async fn update_by_id_process_revision(
  id: ProcessRevisionId,
  input: ProcessRevisionInput,
  options: Option<Options>,
) -> Result<ProcessRevisionId> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} input: {input:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = process_revision_service::set_id_by_lbl_process_revision(
    input,
  ).await?;
  
  use_permit(
    SmolStr::new(get_page_path_process_revision()),
    SmolStr::new("edit"),
  ).await?;
  
  let res = process_revision_service::update_by_id_process_revision(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除流程版本
#[allow(dead_code)]
#[function_name::named]
pub async fn delete_by_ids_process_revision(
  ids: Vec<ProcessRevisionId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    SmolStr::new(get_page_path_process_revision()),
    SmolStr::new("delete"),
  ).await?;
  
  let num = process_revision_service::delete_by_ids_process_revision(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取流程版本字段注释
#[function_name::named]
pub async fn get_field_comments_process_revision(
  options: Option<Options>,
) -> Result<ProcessRevisionFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = process_revision_service::get_field_comments_process_revision(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原流程版本
#[allow(dead_code)]
#[function_name::named]
pub async fn revert_by_ids_process_revision(
  ids: Vec<ProcessRevisionId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    SmolStr::new(get_page_path_process_revision()),
    SmolStr::new("delete"),
  ).await?;
  
  let num = process_revision_service::revert_by_ids_process_revision(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除流程版本
#[allow(dead_code)]
#[function_name::named]
pub async fn force_delete_by_ids_process_revision(
  ids: Vec<ProcessRevisionId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    SmolStr::new(get_page_path_process_revision()),
    SmolStr::new("force_delete"),
  ).await?;
  
  let num = process_revision_service::force_delete_by_ids_process_revision(
    ids,
    options,
  ).await?;
  
  Ok(num)
}
