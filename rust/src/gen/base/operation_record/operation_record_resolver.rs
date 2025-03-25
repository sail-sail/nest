#[allow(unused_imports)]
use std::time::Instant;

use color_eyre::eyre::Result;
use tracing::info;

use crate::common::context::{
  get_req_id,
  Options,
};

use crate::common::gql::model::{PageInput, SortInput};
use crate::src::base::permit::permit_service::use_permit;

use super::operation_record_model::*;
use super::operation_record_service;

use crate::r#gen::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找操作记录列表
#[function_name::named]
pub async fn find_all_operation_record(
  search: Option<OperationRecordSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<OperationRecordModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_operation_record(sort.as_deref())?;
  
  let models = operation_record_service::find_all_operation_record(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找操作记录总数
#[function_name::named]
pub async fn find_count_operation_record(
  search: Option<OperationRecordSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = operation_record_service::find_count_operation_record(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个操作记录
#[function_name::named]
pub async fn find_one_operation_record(
  search: Option<OperationRecordSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<OperationRecordModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_operation_record(sort.as_deref())?;
  
  let model = operation_record_service::find_one_operation_record(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找操作记录
#[function_name::named]
pub async fn find_by_id_operation_record(
  id: OperationRecordId,
  options: Option<Options>,
) -> Result<Option<OperationRecordModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = operation_record_service::find_by_id_operation_record(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 ids 查找操作记录
#[function_name::named]
pub async fn find_by_ids_operation_record(
  ids: Vec<OperationRecordId>,
  options: Option<Options>,
) -> Result<Vec<OperationRecordModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = operation_record_service::find_by_ids_operation_record(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 操作记录根据id修改租户id
#[allow(dead_code)]
#[function_name::named]
pub async fn update_tenant_by_id_operation_record(
  id: OperationRecordId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} tenant_id: {tenant_id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = operation_record_service::update_tenant_by_id_operation_record(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 删除操作记录
#[allow(dead_code)]
#[function_name::named]
pub async fn delete_by_ids_operation_record(
  ids: Vec<OperationRecordId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_operation_record(),
    "delete".to_owned(),
  ).await?;
  
  let num = operation_record_service::delete_by_ids_operation_record(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取操作记录字段注释
#[function_name::named]
pub async fn get_field_comments_operation_record(
  options: Option<Options>,
) -> Result<OperationRecordFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = operation_record_service::get_field_comments_operation_record(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原操作记录
#[allow(dead_code)]
#[function_name::named]
pub async fn revert_by_ids_operation_record(
  ids: Vec<OperationRecordId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_operation_record(),
    "delete".to_owned(),
  ).await?;
  
  let num = operation_record_service::revert_by_ids_operation_record(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除操作记录
#[allow(dead_code)]
#[function_name::named]
pub async fn force_delete_by_ids_operation_record(
  ids: Vec<OperationRecordId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_operation_record(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = operation_record_service::force_delete_by_ids_operation_record(
    ids,
    options,
  ).await?;
  
  Ok(num)
}
