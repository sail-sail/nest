
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

use crate::common::gql::model::{PageInput, SortInput};

use crate::base::tenant::tenant_model::TenantId;

use super::comp_cnf_model::*;
use super::comp_cnf_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut CompCnfSearch,
  options: Option<Options>,
) -> Result<()> {
  
  Ok(())
}

/// 根据搜索条件和分页查找组件配置列表
pub async fn find_all_comp_cnf(
  search: Option<CompCnfSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<CompCnfModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let comp_cnf_models = comp_cnf_dao::find_all_comp_cnf(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(comp_cnf_models)
}

/// 根据条件查找组件配置总数
pub async fn find_count_comp_cnf(
  search: Option<CompCnfSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let comp_cnf_num = comp_cnf_dao::find_count_comp_cnf(
    Some(search),
    options,
  ).await?;
  
  Ok(comp_cnf_num)
}

/// 根据条件查找第一个组件配置
pub async fn find_one_comp_cnf(
  search: Option<CompCnfSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<CompCnfModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let comp_cnf_model = comp_cnf_dao::find_one_comp_cnf(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(comp_cnf_model)
}

/// 根据条件查找第一个组件配置, 如果不存在则抛错
pub async fn find_one_ok_comp_cnf(
  search: Option<CompCnfSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<CompCnfModel> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let comp_cnf_model = comp_cnf_dao::find_one_ok_comp_cnf(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(comp_cnf_model)
}

/// 根据 id 查找组件配置
pub async fn find_by_id_comp_cnf(
  comp_cnf_id: CompCnfId,
  options: Option<Options>,
) -> Result<Option<CompCnfModel>> {
  
  let comp_cnf_model = comp_cnf_dao::find_by_id_comp_cnf(
    comp_cnf_id,
    options,
  ).await?;
  
  Ok(comp_cnf_model)
}

/// 根据 id 查找组件配置, 如果不存在则抛错
pub async fn find_by_id_ok_comp_cnf(
  comp_cnf_id: CompCnfId,
  options: Option<Options>,
) -> Result<CompCnfModel> {
  
  let comp_cnf_model = comp_cnf_dao::find_by_id_ok_comp_cnf(
    comp_cnf_id,
    options,
  ).await?;
  
  Ok(comp_cnf_model)
}

/// 根据 ids 查找组件配置
pub async fn find_by_ids_comp_cnf(
  comp_cnf_ids: Vec<CompCnfId>,
  options: Option<Options>,
) -> Result<Vec<CompCnfModel>> {
  
  let comp_cnf_models = comp_cnf_dao::find_by_ids_comp_cnf(
    comp_cnf_ids,
    options,
  ).await?;
  
  Ok(comp_cnf_models)
}

/// 根据搜索条件判断组件配置是否存在
pub async fn exists_comp_cnf(
  search: Option<CompCnfSearch>,
  options: Option<Options>,
) -> Result<bool> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let exists_res = comp_cnf_dao::exists_comp_cnf(
    Some(search),
    options,
  ).await?;
  
  Ok(exists_res)
}

/// 根据 ids 查找组件配置, 出现查询不到的 id 则报错
pub async fn find_by_ids_ok_comp_cnf(
  comp_cnf_ids: Vec<CompCnfId>,
  options: Option<Options>,
) -> Result<Vec<CompCnfModel>> {
  
  let comp_cnf_models = comp_cnf_dao::find_by_ids_ok_comp_cnf(
    comp_cnf_ids,
    options,
  ).await?;
  
  Ok(comp_cnf_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_comp_cnf(
  comp_cnf_input: CompCnfInput,
) -> Result<CompCnfInput> {
  
  let comp_cnf_input = comp_cnf_dao::set_id_by_lbl_comp_cnf(
    comp_cnf_input,
  ).await?;
  
  Ok(comp_cnf_input)
}

/// 创建组件配置
#[allow(dead_code)]
pub async fn creates_comp_cnf(
  comp_cnf_inputs: Vec<CompCnfInput>,
  options: Option<Options>,
) -> Result<Vec<CompCnfId>> {
  
  let comp_cnf_ids = comp_cnf_dao::creates_comp_cnf(
    comp_cnf_inputs,
    options,
  ).await?;
  
  Ok(comp_cnf_ids)
}

/// 组件配置根据 comp_cnf_id 修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id_comp_cnf(
  comp_cnf_id: CompCnfId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = comp_cnf_dao::update_tenant_by_id_comp_cnf(
    comp_cnf_id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 comp_cnf_id 修改组件配置
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_comp_cnf(
  comp_cnf_id: CompCnfId,
  mut comp_cnf_input: CompCnfInput,
  options: Option<Options>,
) -> Result<CompCnfId> {
  
  let comp_cnf_id = comp_cnf_dao::update_by_id_comp_cnf(
    comp_cnf_id,
    comp_cnf_input,
    options,
  ).await?;
  
  Ok(comp_cnf_id)
}

/// 校验组件配置是否存在
#[allow(dead_code)]
pub async fn validate_option_comp_cnf(
  comp_cnf_model: Option<CompCnfModel>,
) -> Result<CompCnfModel> {
  
  let comp_cnf_model = comp_cnf_dao::validate_option_comp_cnf(comp_cnf_model).await?;
  
  Ok(comp_cnf_model)
}

/// 根据 comp_cnf_ids 删除组件配置
#[allow(dead_code)]
pub async fn delete_by_ids_comp_cnf(
  comp_cnf_ids: Vec<CompCnfId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = comp_cnf_dao::delete_by_ids_comp_cnf(
    comp_cnf_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取组件配置字段注释
pub async fn get_field_comments_comp_cnf(
  options: Option<Options>,
) -> Result<CompCnfFieldComment> {
  
  let comments = comp_cnf_dao::get_field_comments_comp_cnf(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 comp_cnf_ids 还原组件配置
#[allow(dead_code)]
pub async fn revert_by_ids_comp_cnf(
  comp_cnf_ids: Vec<CompCnfId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = comp_cnf_dao::revert_by_ids_comp_cnf(
    comp_cnf_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 comp_cnf_ids 彻底删除组件配置
#[allow(dead_code)]
pub async fn force_delete_by_ids_comp_cnf(
  comp_cnf_ids: Vec<CompCnfId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = comp_cnf_dao::force_delete_by_ids_comp_cnf(
    comp_cnf_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 组件配置 order_by 字段的最大值
pub async fn find_last_order_by_comp_cnf(
  search: Option<CompCnfSearch>,
  options: Option<Options>,
) -> Result<u32> {
  
  let order_by = comp_cnf_dao::find_last_order_by_comp_cnf(
    search,
    options,
  ).await?;
  
  Ok(order_by)
}
