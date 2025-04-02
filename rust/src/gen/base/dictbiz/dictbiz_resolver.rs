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

use super::dictbiz_model::*;
use super::dictbiz_service;

use crate::r#gen::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找业务字典列表
#[function_name::named]
pub async fn find_all_dictbiz(
  search: Option<DictbizSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<DictbizModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_dictbiz(sort.as_deref())?;
  
  let models = dictbiz_service::find_all_dictbiz(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找业务字典总数
#[function_name::named]
pub async fn find_count_dictbiz(
  search: Option<DictbizSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = dictbiz_service::find_count_dictbiz(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个业务字典
#[function_name::named]
pub async fn find_one_dictbiz(
  search: Option<DictbizSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<DictbizModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_dictbiz(sort.as_deref())?;
  
  let model = dictbiz_service::find_one_dictbiz(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找业务字典
#[function_name::named]
pub async fn find_by_id_dictbiz(
  id: DictbizId,
  options: Option<Options>,
) -> Result<Option<DictbizModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = dictbiz_service::find_by_id_dictbiz(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 ids 查找业务字典
#[function_name::named]
pub async fn find_by_ids_dictbiz(
  ids: Vec<DictbizId>,
  options: Option<Options>,
) -> Result<Vec<DictbizModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = dictbiz_service::find_by_ids_dictbiz(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 创建业务字典
#[allow(dead_code)]
#[function_name::named]
pub async fn creates_dictbiz(
  inputs: Vec<DictbizInput>,
  options: Option<Options>,
) -> Result<Vec<DictbizId>> {
  
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
    let input = dictbiz_service::set_id_by_lbl_dictbiz(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    get_route_path_dictbiz(),
    "add".to_owned(),
  ).await?;
  
  let ids = dictbiz_service::creates_dictbiz(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 业务字典根据id修改租户id
#[allow(dead_code)]
#[function_name::named]
pub async fn update_tenant_by_id_dictbiz(
  id: DictbizId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} tenant_id: {tenant_id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = dictbiz_service::update_tenant_by_id_dictbiz(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改业务字典
#[allow(dead_code)]
#[function_name::named]
pub async fn update_by_id_dictbiz(
  id: DictbizId,
  input: DictbizInput,
  options: Option<Options>,
) -> Result<DictbizId> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} input: {input:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = dictbiz_service::set_id_by_lbl_dictbiz(
    input,
  ).await?;
  
  use_permit(
    get_route_path_dictbiz(),
    "edit".to_owned(),
  ).await?;
  
  let res = dictbiz_service::update_by_id_dictbiz(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除业务字典
#[allow(dead_code)]
#[function_name::named]
pub async fn delete_by_ids_dictbiz(
  ids: Vec<DictbizId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_dictbiz(),
    "delete".to_owned(),
  ).await?;
  
  let num = dictbiz_service::delete_by_ids_dictbiz(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找业务字典是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
#[function_name::named]
pub async fn get_is_enabled_by_id_dictbiz(
  id: DictbizId,
  options: Option<Options>,
) -> Result<bool> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let is_enabled = dictbiz_service::get_is_enabled_by_id_dictbiz(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用业务字典
#[allow(dead_code)]
#[function_name::named]
pub async fn enable_by_ids_dictbiz(
  ids: Vec<DictbizId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?} is_enabled: {is_enabled:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_dictbiz(),
    "edit".to_owned(),
  ).await?;
  
  let num = dictbiz_service::enable_by_ids_dictbiz(
    ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取业务字典字段注释
#[function_name::named]
pub async fn get_field_comments_dictbiz(
  options: Option<Options>,
) -> Result<DictbizFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = dictbiz_service::get_field_comments_dictbiz(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原业务字典
#[allow(dead_code)]
#[function_name::named]
pub async fn revert_by_ids_dictbiz(
  ids: Vec<DictbizId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_dictbiz(),
    "delete".to_owned(),
  ).await?;
  
  let num = dictbiz_service::revert_by_ids_dictbiz(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除业务字典
#[allow(dead_code)]
#[function_name::named]
pub async fn force_delete_by_ids_dictbiz(
  ids: Vec<DictbizId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_dictbiz(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = dictbiz_service::force_delete_by_ids_dictbiz(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 业务字典 order_by 字段的最大值
#[function_name::named]
pub async fn find_last_order_by_dictbiz(
  options: Option<Options>,
) -> Result<u32> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let res = dictbiz_service::find_last_order_by_dictbiz(
    options,
  ).await?;
  
  Ok(res)
}
