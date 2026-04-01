
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

use super::node_inst_model::*;
use super::node_inst_service;

use crate::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找节点实例列表
#[function_name::named]
pub async fn find_all_node_inst(
  search: Option<NodeInstSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<NodeInstModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_node_inst(sort.as_deref())?;
  
  let models = node_inst_service::find_all_node_inst(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找节点实例总数
#[function_name::named]
pub async fn find_count_node_inst(
  search: Option<NodeInstSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = node_inst_service::find_count_node_inst(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个节点实例
#[function_name::named]
pub async fn find_one_node_inst(
  search: Option<NodeInstSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<NodeInstModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_node_inst(sort.as_deref())?;
  
  let model = node_inst_service::find_one_node_inst(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据条件查找第一个节点实例, 如果不存在则抛错
#[function_name::named]
pub async fn find_one_ok_node_inst(
  search: Option<NodeInstSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<NodeInstModel> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_node_inst(sort.as_deref())?;
  
  let model = node_inst_service::find_one_ok_node_inst(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找节点实例
#[function_name::named]
pub async fn find_by_id_node_inst(
  id: NodeInstId,
  options: Option<Options>,
) -> Result<Option<NodeInstModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = node_inst_service::find_by_id_node_inst(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找节点实例, 如果不存在则抛错
#[function_name::named]
pub async fn find_by_id_ok_node_inst(
  id: NodeInstId,
  options: Option<Options>,
) -> Result<NodeInstModel> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = node_inst_service::find_by_id_ok_node_inst(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 ids 查找节点实例
#[function_name::named]
pub async fn find_by_ids_node_inst(
  ids: Vec<NodeInstId>,
  options: Option<Options>,
) -> Result<Vec<NodeInstModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = node_inst_service::find_by_ids_node_inst(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据 ids 查找节点实例, 出现查询不到的 id 则报错
#[function_name::named]
pub async fn find_by_ids_ok_node_inst(
  ids: Vec<NodeInstId>,
  options: Option<Options>,
) -> Result<Vec<NodeInstModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = node_inst_service::find_by_ids_ok_node_inst(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 创建节点实例
#[allow(dead_code)]
#[function_name::named]
pub async fn creates_node_inst(
  inputs: Vec<NodeInstInput>,
  options: Option<Options>,
) -> Result<Vec<NodeInstId>> {
  
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
    let input = node_inst_service::set_id_by_lbl_node_inst(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    SmolStr::new(get_page_path_node_inst()),
    SmolStr::new("add"),
  ).await?;
  
  let ids = node_inst_service::creates_node_inst(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 节点实例根据id修改租户id
#[allow(dead_code)]
#[function_name::named]
pub async fn update_tenant_by_id_node_inst(
  id: NodeInstId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} tenant_id: {tenant_id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = node_inst_service::update_tenant_by_id_node_inst(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改节点实例
#[allow(dead_code)]
#[function_name::named]
pub async fn update_by_id_node_inst(
  id: NodeInstId,
  input: NodeInstInput,
  options: Option<Options>,
) -> Result<NodeInstId> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} input: {input:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = node_inst_service::set_id_by_lbl_node_inst(
    input,
  ).await?;
  
  use_permit(
    SmolStr::new(get_page_path_node_inst()),
    SmolStr::new("edit"),
  ).await?;
  
  let res = node_inst_service::update_by_id_node_inst(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除节点实例
#[allow(dead_code)]
#[function_name::named]
pub async fn delete_by_ids_node_inst(
  ids: Vec<NodeInstId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    SmolStr::new(get_page_path_node_inst()),
    SmolStr::new("delete"),
  ).await?;
  
  let num = node_inst_service::delete_by_ids_node_inst(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取节点实例字段注释
#[function_name::named]
pub async fn get_field_comments_node_inst(
  options: Option<Options>,
) -> Result<NodeInstFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = node_inst_service::get_field_comments_node_inst(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原节点实例
#[allow(dead_code)]
#[function_name::named]
pub async fn revert_by_ids_node_inst(
  ids: Vec<NodeInstId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    SmolStr::new(get_page_path_node_inst()),
    SmolStr::new("delete"),
  ).await?;
  
  let num = node_inst_service::revert_by_ids_node_inst(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除节点实例
#[allow(dead_code)]
#[function_name::named]
pub async fn force_delete_by_ids_node_inst(
  ids: Vec<NodeInstId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    SmolStr::new(get_page_path_node_inst()),
    SmolStr::new("force_delete"),
  ).await?;
  
  let num = node_inst_service::force_delete_by_ids_node_inst(
    ids,
    options,
  ).await?;
  
  Ok(num)
}
