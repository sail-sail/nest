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
use crate::src::base::permit::permit_service::use_permit;

use super::data_permit_model::*;
use super::data_permit_service;

use crate::r#gen::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找数据权限列表
#[function_name::named]
pub async fn find_all_data_permit(
  search: Option<DataPermitSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<DataPermitModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_data_permit(sort.as_deref())?;
  
  let models = data_permit_service::find_all_data_permit(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找数据权限总数
#[function_name::named]
pub async fn find_count_data_permit(
  search: Option<DataPermitSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = data_permit_service::find_count_data_permit(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个数据权限
#[function_name::named]
pub async fn find_one_data_permit(
  search: Option<DataPermitSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<DataPermitModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_data_permit(sort.as_deref())?;
  
  let model = data_permit_service::find_one_data_permit(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找数据权限
#[function_name::named]
pub async fn find_by_id_data_permit(
  id: DataPermitId,
  options: Option<Options>,
) -> Result<Option<DataPermitModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = data_permit_service::find_by_id_data_permit(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 ids 查找数据权限
#[function_name::named]
pub async fn find_by_ids_data_permit(
  ids: Vec<DataPermitId>,
  options: Option<Options>,
) -> Result<Vec<DataPermitModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = data_permit_service::find_by_ids_data_permit(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 创建数据权限
#[allow(dead_code)]
#[function_name::named]
pub async fn creates_data_permit(
  inputs: Vec<DataPermitInput>,
  options: Option<Options>,
) -> Result<Vec<DataPermitId>> {
  
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
    let input = data_permit_service::set_id_by_lbl_data_permit(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    get_route_path_data_permit(),
    "add".to_owned(),
  ).await?;
  
  let ids = data_permit_service::creates_data_permit(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 数据权限根据id修改租户id
#[allow(dead_code)]
#[function_name::named]
pub async fn update_tenant_by_id_data_permit(
  id: DataPermitId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} tenant_id: {tenant_id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = data_permit_service::update_tenant_by_id_data_permit(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改数据权限
#[allow(dead_code)]
#[function_name::named]
pub async fn update_by_id_data_permit(
  id: DataPermitId,
  input: DataPermitInput,
  options: Option<Options>,
) -> Result<DataPermitId> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} input: {input:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = data_permit_service::set_id_by_lbl_data_permit(
    input,
  ).await?;
  
  use_permit(
    get_route_path_data_permit(),
    "edit".to_owned(),
  ).await?;
  
  let res = data_permit_service::update_by_id_data_permit(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除数据权限
#[allow(dead_code)]
#[function_name::named]
pub async fn delete_by_ids_data_permit(
  ids: Vec<DataPermitId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_data_permit(),
    "delete".to_owned(),
  ).await?;
  
  let num = data_permit_service::delete_by_ids_data_permit(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取数据权限字段注释
#[function_name::named]
pub async fn get_field_comments_data_permit(
  options: Option<Options>,
) -> Result<DataPermitFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = data_permit_service::get_field_comments_data_permit(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原数据权限
#[allow(dead_code)]
#[function_name::named]
pub async fn revert_by_ids_data_permit(
  ids: Vec<DataPermitId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_data_permit(),
    "delete".to_owned(),
  ).await?;
  
  let num = data_permit_service::revert_by_ids_data_permit(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除数据权限
#[allow(dead_code)]
#[function_name::named]
pub async fn force_delete_by_ids_data_permit(
  ids: Vec<DataPermitId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_data_permit(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = data_permit_service::force_delete_by_ids_data_permit(
    ids,
    options,
  ).await?;
  
  Ok(num)
}
