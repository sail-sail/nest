
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

use super::comp_cnf_model::*;
use super::comp_cnf_service;

use crate::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找组件配置列表
#[function_name::named]
pub async fn find_all_comp_cnf(
  search: Option<CompCnfSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<CompCnfModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_comp_cnf(sort.as_deref())?;
  
  let models = comp_cnf_service::find_all_comp_cnf(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找组件配置总数
#[function_name::named]
pub async fn find_count_comp_cnf(
  search: Option<CompCnfSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = comp_cnf_service::find_count_comp_cnf(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个组件配置
#[function_name::named]
pub async fn find_one_comp_cnf(
  search: Option<CompCnfSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<CompCnfModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_comp_cnf(sort.as_deref())?;
  
  let model = comp_cnf_service::find_one_comp_cnf(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据条件查找第一个组件配置, 如果不存在则抛错
#[function_name::named]
pub async fn find_one_ok_comp_cnf(
  search: Option<CompCnfSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<CompCnfModel> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_comp_cnf(sort.as_deref())?;
  
  let model = comp_cnf_service::find_one_ok_comp_cnf(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找组件配置
#[function_name::named]
pub async fn find_by_id_comp_cnf(
  id: CompCnfId,
  options: Option<Options>,
) -> Result<Option<CompCnfModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = comp_cnf_service::find_by_id_comp_cnf(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找组件配置, 如果不存在则抛错
#[function_name::named]
pub async fn find_by_id_ok_comp_cnf(
  id: CompCnfId,
  options: Option<Options>,
) -> Result<CompCnfModel> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = comp_cnf_service::find_by_id_ok_comp_cnf(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 ids 查找组件配置
#[function_name::named]
pub async fn find_by_ids_comp_cnf(
  ids: Vec<CompCnfId>,
  options: Option<Options>,
) -> Result<Vec<CompCnfModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = comp_cnf_service::find_by_ids_comp_cnf(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据 ids 查找组件配置, 出现查询不到的 id 则报错
#[function_name::named]
pub async fn find_by_ids_ok_comp_cnf(
  ids: Vec<CompCnfId>,
  options: Option<Options>,
) -> Result<Vec<CompCnfModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = comp_cnf_service::find_by_ids_ok_comp_cnf(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 创建组件配置
#[allow(dead_code, unused_mut)]
#[function_name::named]
pub async fn creates_comp_cnf(
  inputs: Vec<CompCnfInput>,
  options: Option<Options>,
) -> Result<Vec<CompCnfId>> {
  
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
    let mut input = comp_cnf_service::set_id_by_lbl_comp_cnf(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  let ids = comp_cnf_service::creates_comp_cnf(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 组件配置根据id修改租户id
#[allow(dead_code)]
#[function_name::named]
pub async fn update_tenant_by_id_comp_cnf(
  id: CompCnfId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} tenant_id: {tenant_id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = comp_cnf_service::update_tenant_by_id_comp_cnf(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改组件配置
#[allow(dead_code)]
#[function_name::named]
pub async fn update_by_id_comp_cnf(
  id: CompCnfId,
  input: CompCnfInput,
  options: Option<Options>,
) -> Result<CompCnfId> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} input: {input:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = comp_cnf_service::set_id_by_lbl_comp_cnf(
    input,
  ).await?;
  
  let res = comp_cnf_service::update_by_id_comp_cnf(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除组件配置
#[allow(dead_code)]
#[function_name::named]
pub async fn delete_by_ids_comp_cnf(
  ids: Vec<CompCnfId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = comp_cnf_service::delete_by_ids_comp_cnf(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取组件配置字段注释
#[function_name::named]
pub async fn get_field_comments_comp_cnf(
  options: Option<Options>,
) -> Result<CompCnfFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = comp_cnf_service::get_field_comments_comp_cnf(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原组件配置
#[allow(dead_code)]
#[function_name::named]
pub async fn revert_by_ids_comp_cnf(
  ids: Vec<CompCnfId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = comp_cnf_service::revert_by_ids_comp_cnf(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除组件配置
#[allow(dead_code)]
#[function_name::named]
pub async fn force_delete_by_ids_comp_cnf(
  ids: Vec<CompCnfId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = comp_cnf_service::force_delete_by_ids_comp_cnf(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 组件配置 order_by 字段的最大值
#[function_name::named]
pub async fn find_last_order_by_comp_cnf(
  search: Option<CompCnfSearch>,
  options: Option<Options>,
) -> Result<u32> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let order_by = comp_cnf_service::find_last_order_by_comp_cnf(
    search,
    options,
  ).await?;
  
  Ok(order_by)
}
