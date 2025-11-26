
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

use super::dyn_page_val_model::*;
use super::dyn_page_val_service;

use crate::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找动态页面值列表
#[function_name::named]
pub async fn find_all_dyn_page_val(
  search: Option<DynPageValSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<DynPageValModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_dyn_page_val(sort.as_deref())?;
  
  let models = dyn_page_val_service::find_all_dyn_page_val(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找动态页面值总数
#[function_name::named]
pub async fn find_count_dyn_page_val(
  search: Option<DynPageValSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = dyn_page_val_service::find_count_dyn_page_val(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个动态页面值
#[function_name::named]
pub async fn find_one_dyn_page_val(
  search: Option<DynPageValSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<DynPageValModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_dyn_page_val(sort.as_deref())?;
  
  let model = dyn_page_val_service::find_one_dyn_page_val(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据条件查找第一个动态页面值, 如果不存在则抛错
#[function_name::named]
pub async fn find_one_ok_dyn_page_val(
  search: Option<DynPageValSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<DynPageValModel> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_dyn_page_val(sort.as_deref())?;
  
  let model = dyn_page_val_service::find_one_ok_dyn_page_val(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找动态页面值
#[function_name::named]
pub async fn find_by_id_dyn_page_val(
  id: DynPageValId,
  options: Option<Options>,
) -> Result<Option<DynPageValModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = dyn_page_val_service::find_by_id_dyn_page_val(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找动态页面值, 如果不存在则抛错
#[function_name::named]
pub async fn find_by_id_ok_dyn_page_val(
  id: DynPageValId,
  options: Option<Options>,
) -> Result<DynPageValModel> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = dyn_page_val_service::find_by_id_ok_dyn_page_val(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 ids 查找动态页面值
#[function_name::named]
pub async fn find_by_ids_dyn_page_val(
  ids: Vec<DynPageValId>,
  options: Option<Options>,
) -> Result<Vec<DynPageValModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = dyn_page_val_service::find_by_ids_dyn_page_val(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据 ids 查找动态页面值, 出现查询不到的 id 则报错
#[function_name::named]
pub async fn find_by_ids_ok_dyn_page_val(
  ids: Vec<DynPageValId>,
  options: Option<Options>,
) -> Result<Vec<DynPageValModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = dyn_page_val_service::find_by_ids_ok_dyn_page_val(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 创建动态页面值
#[allow(dead_code)]
#[function_name::named]
pub async fn creates_dyn_page_val(
  inputs: Vec<DynPageValInput>,
  options: Option<Options>,
) -> Result<Vec<DynPageValId>> {
  
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
    let input = dyn_page_val_service::set_id_by_lbl_dyn_page_val(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    get_page_path_dyn_page_val().to_string(),
    "add".to_owned(),
  ).await?;
  
  let ids = dyn_page_val_service::creates_dyn_page_val(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 动态页面值根据id修改租户id
#[allow(dead_code)]
#[function_name::named]
pub async fn update_tenant_by_id_dyn_page_val(
  id: DynPageValId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} tenant_id: {tenant_id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = dyn_page_val_service::update_tenant_by_id_dyn_page_val(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改动态页面值
#[allow(dead_code)]
#[function_name::named]
pub async fn update_by_id_dyn_page_val(
  id: DynPageValId,
  input: DynPageValInput,
  options: Option<Options>,
) -> Result<DynPageValId> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} input: {input:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = dyn_page_val_service::set_id_by_lbl_dyn_page_val(
    input,
  ).await?;
  
  use_permit(
    get_page_path_dyn_page_val().to_string(),
    "edit".to_owned(),
  ).await?;
  
  let res = dyn_page_val_service::update_by_id_dyn_page_val(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除动态页面值
#[allow(dead_code)]
#[function_name::named]
pub async fn delete_by_ids_dyn_page_val(
  ids: Vec<DynPageValId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_page_path_dyn_page_val().to_string(),
    "delete".to_owned(),
  ).await?;
  
  let num = dyn_page_val_service::delete_by_ids_dyn_page_val(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取动态页面值字段注释
#[function_name::named]
pub async fn get_field_comments_dyn_page_val(
  options: Option<Options>,
) -> Result<DynPageValFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = dyn_page_val_service::get_field_comments_dyn_page_val(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原动态页面值
#[allow(dead_code)]
#[function_name::named]
pub async fn revert_by_ids_dyn_page_val(
  ids: Vec<DynPageValId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_page_path_dyn_page_val().to_string(),
    "delete".to_owned(),
  ).await?;
  
  let num = dyn_page_val_service::revert_by_ids_dyn_page_val(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除动态页面值
#[allow(dead_code)]
#[function_name::named]
pub async fn force_delete_by_ids_dyn_page_val(
  ids: Vec<DynPageValId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_page_path_dyn_page_val().to_string(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = dyn_page_val_service::force_delete_by_ids_dyn_page_val(
    ids,
    options,
  ).await?;
  
  Ok(num)
}
