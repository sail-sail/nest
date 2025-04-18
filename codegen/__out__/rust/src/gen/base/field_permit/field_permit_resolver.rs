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

use super::field_permit_model::*;
use super::field_permit_service;

/// 根据搜索条件和分页查找字段权限列表
#[function_name::named]
pub async fn find_all_field_permit(
  search: Option<FieldPermitSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<FieldPermitModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_field_permit(sort.as_deref())?;
  
  let models = field_permit_service::find_all_field_permit(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找字段权限总数
#[function_name::named]
pub async fn find_count_field_permit(
  search: Option<FieldPermitSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = field_permit_service::find_count_field_permit(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个字段权限
#[function_name::named]
pub async fn find_one_field_permit(
  search: Option<FieldPermitSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<FieldPermitModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_field_permit(sort.as_deref())?;
  
  let model = field_permit_service::find_one_field_permit(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找字段权限
#[function_name::named]
pub async fn find_by_id_field_permit(
  id: FieldPermitId,
  options: Option<Options>,
) -> Result<Option<FieldPermitModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = field_permit_service::find_by_id_field_permit(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 ids 查找字段权限
#[function_name::named]
pub async fn find_by_ids_field_permit(
  ids: Vec<FieldPermitId>,
  options: Option<Options>,
) -> Result<Vec<FieldPermitModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = field_permit_service::find_by_ids_field_permit(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据 id 修改字段权限
#[allow(dead_code)]
#[function_name::named]
pub async fn update_by_id_field_permit(
  id: FieldPermitId,
  input: FieldPermitInput,
  options: Option<Options>,
) -> Result<FieldPermitId> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} input: {input:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = field_permit_service::set_id_by_lbl_field_permit(
    input,
  ).await?;
  
  use_permit(
    get_route_path_field_permit(),
    "edit".to_owned(),
  ).await?;
  
  let res = field_permit_service::update_by_id_field_permit(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 获取字段权限字段注释
#[function_name::named]
pub async fn get_field_comments_field_permit(
  options: Option<Options>,
) -> Result<FieldPermitFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = field_permit_service::get_field_comments_field_permit(
    options,
  ).await?;
  
  Ok(comments)
}

/// 查找 字段权限 order_by 字段的最大值
#[function_name::named]
pub async fn find_last_order_by_field_permit(
  options: Option<Options>,
) -> Result<u32> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let res = field_permit_service::find_last_order_by_field_permit(
    options,
  ).await?;
  
  Ok(res)
}
