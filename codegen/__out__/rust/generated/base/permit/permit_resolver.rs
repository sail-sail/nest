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

use super::permit_model::*;
use super::permit_service;

/// 根据搜索条件和分页查找按钮权限列表
#[function_name::named]
pub async fn find_all_permit(
  search: Option<PermitSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<PermitModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_permit(sort.as_deref())?;
  
  let models = permit_service::find_all_permit(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找按钮权限总数
#[function_name::named]
pub async fn find_count_permit(
  search: Option<PermitSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = permit_service::find_count_permit(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个按钮权限
#[function_name::named]
pub async fn find_one_permit(
  search: Option<PermitSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<PermitModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_permit(sort.as_deref())?;
  
  let model = permit_service::find_one_permit(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据条件查找第一个按钮权限, 如果不存在则抛错
#[function_name::named]
pub async fn find_one_ok_permit(
  search: Option<PermitSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<PermitModel> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_permit(sort.as_deref())?;
  
  let model = permit_service::find_one_ok_permit(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找按钮权限
#[function_name::named]
pub async fn find_by_id_permit(
  id: PermitId,
  options: Option<Options>,
) -> Result<Option<PermitModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = permit_service::find_by_id_permit(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找按钮权限, 如果不存在则抛错
#[function_name::named]
pub async fn find_by_id_ok_permit(
  id: PermitId,
  options: Option<Options>,
) -> Result<PermitModel> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = permit_service::find_by_id_ok_permit(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 ids 查找按钮权限
#[function_name::named]
pub async fn find_by_ids_permit(
  ids: Vec<PermitId>,
  options: Option<Options>,
) -> Result<Vec<PermitModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = permit_service::find_by_ids_permit(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据 ids 查找按钮权限, 出现查询不到的 id 则报错
#[function_name::named]
pub async fn find_by_ids_ok_permit(
  ids: Vec<PermitId>,
  options: Option<Options>,
) -> Result<Vec<PermitModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = permit_service::find_by_ids_ok_permit(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据 id 修改按钮权限
#[allow(dead_code)]
#[function_name::named]
pub async fn update_by_id_permit(
  id: PermitId,
  input: PermitInput,
  options: Option<Options>,
) -> Result<PermitId> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} input: {input:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = permit_service::set_id_by_lbl_permit(
    input,
  ).await?;
  
  use_permit(
    get_route_path_permit(),
    "edit".to_owned(),
  ).await?;
  
  let res = permit_service::update_by_id_permit(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 获取按钮权限字段注释
#[function_name::named]
pub async fn get_field_comments_permit(
  options: Option<Options>,
) -> Result<PermitFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = permit_service::get_field_comments_permit(
    options,
  ).await?;
  
  Ok(comments)
}

/// 查找 按钮权限 order_by 字段的最大值
#[function_name::named]
pub async fn find_last_order_by_permit(
  options: Option<Options>,
) -> Result<u32> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let res = permit_service::find_last_order_by_permit(
    options,
  ).await?;
  
  Ok(res)
}
