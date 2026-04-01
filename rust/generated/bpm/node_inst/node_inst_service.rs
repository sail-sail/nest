
#![allow(clippy::clone_on_copy)]
#![allow(clippy::redundant_clone)]

#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use color_eyre::eyre::{Result, eyre};

#[allow(unused_imports)]
use crate::common::context::{
  Options,
  get_auth_id_ok,
  get_auth_org_id,
};

#[allow(unused_imports)]
use smol_str::SmolStr;

use crate::common::gql::model::{PageInput, SortInput};

use crate::base::tenant::tenant_model::TenantId;

use super::node_inst_model::*;
use super::node_inst_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut NodeInstSearch,
  options: Option<Options>,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找节点实例列表
pub async fn find_all_node_inst(
  search: Option<NodeInstSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<NodeInstModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let node_inst_models = node_inst_dao::find_all_node_inst(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(node_inst_models)
}

/// 根据条件查找节点实例总数
pub async fn find_count_node_inst(
  search: Option<NodeInstSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let node_inst_num = node_inst_dao::find_count_node_inst(
    Some(search),
    options,
  ).await?;
  
  Ok(node_inst_num)
}

/// 根据条件查找第一个节点实例
pub async fn find_one_node_inst(
  search: Option<NodeInstSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<NodeInstModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let node_inst_model = node_inst_dao::find_one_node_inst(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(node_inst_model)
}

/// 根据条件查找第一个节点实例, 如果不存在则抛错
pub async fn find_one_ok_node_inst(
  search: Option<NodeInstSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<NodeInstModel> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let node_inst_model = node_inst_dao::find_one_ok_node_inst(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(node_inst_model)
}

/// 根据 id 查找节点实例
pub async fn find_by_id_node_inst(
  node_inst_id: NodeInstId,
  options: Option<Options>,
) -> Result<Option<NodeInstModel>> {
  
  let node_inst_model = node_inst_dao::find_by_id_node_inst(
    node_inst_id,
    options,
  ).await?;
  
  Ok(node_inst_model)
}

/// 根据 id 查找节点实例, 如果不存在则抛错
pub async fn find_by_id_ok_node_inst(
  node_inst_id: NodeInstId,
  options: Option<Options>,
) -> Result<NodeInstModel> {
  
  let node_inst_model = node_inst_dao::find_by_id_ok_node_inst(
    node_inst_id,
    options,
  ).await?;
  
  Ok(node_inst_model)
}

/// 根据 ids 查找节点实例
pub async fn find_by_ids_node_inst(
  node_inst_ids: Vec<NodeInstId>,
  options: Option<Options>,
) -> Result<Vec<NodeInstModel>> {
  
  let node_inst_models = node_inst_dao::find_by_ids_node_inst(
    node_inst_ids,
    options,
  ).await?;
  
  Ok(node_inst_models)
}

/// 根据 ids 查找节点实例, 出现查询不到的 id 则报错
pub async fn find_by_ids_ok_node_inst(
  node_inst_ids: Vec<NodeInstId>,
  options: Option<Options>,
) -> Result<Vec<NodeInstModel>> {
  
  let node_inst_models = node_inst_dao::find_by_ids_ok_node_inst(
    node_inst_ids,
    options,
  ).await?;
  
  Ok(node_inst_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_node_inst(
  node_inst_input: NodeInstInput,
) -> Result<NodeInstInput> {
  
  let node_inst_input = node_inst_dao::set_id_by_lbl_node_inst(
    node_inst_input,
  ).await?;
  
  Ok(node_inst_input)
}

/// 创建节点实例
#[allow(dead_code)]
pub async fn creates_node_inst(
  node_inst_inputs: Vec<NodeInstInput>,
  options: Option<Options>,
) -> Result<Vec<NodeInstId>> {
  
  let node_inst_ids = node_inst_dao::creates_node_inst(
    node_inst_inputs,
    options,
  ).await?;
  
  Ok(node_inst_ids)
}

/// 节点实例根据 node_inst_id 修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id_node_inst(
  node_inst_id: NodeInstId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = node_inst_dao::update_tenant_by_id_node_inst(
    node_inst_id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 node_inst_id 修改节点实例
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_node_inst(
  node_inst_id: NodeInstId,
  mut node_inst_input: NodeInstInput,
  options: Option<Options>,
) -> Result<NodeInstId> {
  
  let node_inst_id = node_inst_dao::update_by_id_node_inst(
    node_inst_id,
    node_inst_input,
    options,
  ).await?;
  
  Ok(node_inst_id)
}

/// 校验节点实例是否存在
#[allow(dead_code)]
pub async fn validate_option_node_inst(
  node_inst_model: Option<NodeInstModel>,
) -> Result<NodeInstModel> {
  
  let node_inst_model = node_inst_dao::validate_option_node_inst(node_inst_model).await?;
  
  Ok(node_inst_model)
}

/// 根据 node_inst_ids 删除节点实例
#[allow(dead_code)]
pub async fn delete_by_ids_node_inst(
  node_inst_ids: Vec<NodeInstId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = node_inst_dao::delete_by_ids_node_inst(
    node_inst_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取节点实例字段注释
pub async fn get_field_comments_node_inst(
  options: Option<Options>,
) -> Result<NodeInstFieldComment> {
  
  let comments = node_inst_dao::get_field_comments_node_inst(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 node_inst_ids 还原节点实例
#[allow(dead_code)]
pub async fn revert_by_ids_node_inst(
  node_inst_ids: Vec<NodeInstId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = node_inst_dao::revert_by_ids_node_inst(
    node_inst_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 node_inst_ids 彻底删除节点实例
#[allow(dead_code)]
pub async fn force_delete_by_ids_node_inst(
  node_inst_ids: Vec<NodeInstId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = node_inst_dao::force_delete_by_ids_node_inst(
    node_inst_ids,
    options,
  ).await?;
  
  Ok(num)
}
