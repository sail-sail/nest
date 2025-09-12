
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

use super::dictbiz_detail_model::*;
use super::dictbiz_detail_service;

use crate::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找业务字典明细列表
#[function_name::named]
pub async fn find_all_dictbiz_detail(
  search: Option<DictbizDetailSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<DictbizDetailModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_dictbiz_detail(sort.as_deref())?;
  
  let models = dictbiz_detail_service::find_all_dictbiz_detail(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找业务字典明细总数
#[function_name::named]
pub async fn find_count_dictbiz_detail(
  search: Option<DictbizDetailSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = dictbiz_detail_service::find_count_dictbiz_detail(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个业务字典明细
#[function_name::named]
pub async fn find_one_dictbiz_detail(
  search: Option<DictbizDetailSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<DictbizDetailModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_dictbiz_detail(sort.as_deref())?;
  
  let model = dictbiz_detail_service::find_one_dictbiz_detail(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据条件查找第一个业务字典明细, 如果不存在则抛错
#[function_name::named]
pub async fn find_one_ok_dictbiz_detail(
  search: Option<DictbizDetailSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<DictbizDetailModel> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_dictbiz_detail(sort.as_deref())?;
  
  let model = dictbiz_detail_service::find_one_ok_dictbiz_detail(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找业务字典明细
#[function_name::named]
pub async fn find_by_id_dictbiz_detail(
  id: DictbizDetailId,
  options: Option<Options>,
) -> Result<Option<DictbizDetailModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = dictbiz_detail_service::find_by_id_dictbiz_detail(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找业务字典明细, 如果不存在则抛错
#[function_name::named]
pub async fn find_by_id_ok_dictbiz_detail(
  id: DictbizDetailId,
  options: Option<Options>,
) -> Result<DictbizDetailModel> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = dictbiz_detail_service::find_by_id_ok_dictbiz_detail(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 ids 查找业务字典明细
#[function_name::named]
pub async fn find_by_ids_dictbiz_detail(
  ids: Vec<DictbizDetailId>,
  options: Option<Options>,
) -> Result<Vec<DictbizDetailModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = dictbiz_detail_service::find_by_ids_dictbiz_detail(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据 ids 查找业务字典明细, 出现查询不到的 id 则报错
#[function_name::named]
pub async fn find_by_ids_ok_dictbiz_detail(
  ids: Vec<DictbizDetailId>,
  options: Option<Options>,
) -> Result<Vec<DictbizDetailModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = dictbiz_detail_service::find_by_ids_ok_dictbiz_detail(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 创建业务字典明细
#[allow(dead_code)]
#[function_name::named]
pub async fn creates_dictbiz_detail(
  inputs: Vec<DictbizDetailInput>,
  options: Option<Options>,
) -> Result<Vec<DictbizDetailId>> {
  
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
    let input = dictbiz_detail_service::set_id_by_lbl_dictbiz_detail(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    get_route_path_dictbiz_detail(),
    "add".to_owned(),
  ).await?;
  
  let ids = dictbiz_detail_service::creates_dictbiz_detail(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 业务字典明细根据id修改租户id
#[allow(dead_code)]
#[function_name::named]
pub async fn update_tenant_by_id_dictbiz_detail(
  id: DictbizDetailId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} tenant_id: {tenant_id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = dictbiz_detail_service::update_tenant_by_id_dictbiz_detail(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改业务字典明细
#[allow(dead_code)]
#[function_name::named]
pub async fn update_by_id_dictbiz_detail(
  id: DictbizDetailId,
  input: DictbizDetailInput,
  options: Option<Options>,
) -> Result<DictbizDetailId> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} input: {input:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = dictbiz_detail_service::set_id_by_lbl_dictbiz_detail(
    input,
  ).await?;
  
  use_permit(
    get_route_path_dictbiz_detail(),
    "edit".to_owned(),
  ).await?;
  
  let res = dictbiz_detail_service::update_by_id_dictbiz_detail(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除业务字典明细
#[allow(dead_code)]
#[function_name::named]
pub async fn delete_by_ids_dictbiz_detail(
  ids: Vec<DictbizDetailId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_dictbiz_detail(),
    "delete".to_owned(),
  ).await?;
  
  let num = dictbiz_detail_service::delete_by_ids_dictbiz_detail(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 查找业务字典明细是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
#[function_name::named]
pub async fn get_is_enabled_by_id_dictbiz_detail(
  id: DictbizDetailId,
  options: Option<Options>,
) -> Result<bool> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let is_enabled = dictbiz_detail_service::get_is_enabled_by_id_dictbiz_detail(
    id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用业务字典明细
#[allow(dead_code)]
#[function_name::named]
pub async fn enable_by_ids_dictbiz_detail(
  ids: Vec<DictbizDetailId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?} is_enabled: {is_enabled:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_dictbiz_detail(),
    "edit".to_owned(),
  ).await?;
  
  let num = dictbiz_detail_service::enable_by_ids_dictbiz_detail(
    ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取业务字典明细字段注释
#[function_name::named]
pub async fn get_field_comments_dictbiz_detail(
  options: Option<Options>,
) -> Result<DictbizDetailFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = dictbiz_detail_service::get_field_comments_dictbiz_detail(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原业务字典明细
#[allow(dead_code)]
#[function_name::named]
pub async fn revert_by_ids_dictbiz_detail(
  ids: Vec<DictbizDetailId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_dictbiz_detail(),
    "delete".to_owned(),
  ).await?;
  
  let num = dictbiz_detail_service::revert_by_ids_dictbiz_detail(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除业务字典明细
#[allow(dead_code)]
#[function_name::named]
pub async fn force_delete_by_ids_dictbiz_detail(
  ids: Vec<DictbizDetailId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_dictbiz_detail(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = dictbiz_detail_service::force_delete_by_ids_dictbiz_detail(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 业务字典明细 order_by 字段的最大值
#[function_name::named]
pub async fn find_last_order_by_dictbiz_detail(
  options: Option<Options>,
) -> Result<u32> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let res = dictbiz_detail_service::find_last_order_by_dictbiz_detail(
    options,
  ).await?;
  
  Ok(res)
}
