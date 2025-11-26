
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

use super::dyn_page_val_model::*;
use super::dyn_page_val_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut DynPageValSearch,
  options: Option<Options>,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找动态页面值列表
pub async fn find_all_dyn_page_val(
  search: Option<DynPageValSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<DynPageValModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let dyn_page_val_models = dyn_page_val_dao::find_all_dyn_page_val(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(dyn_page_val_models)
}

/// 根据条件查找动态页面值总数
pub async fn find_count_dyn_page_val(
  search: Option<DynPageValSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let dyn_page_val_num = dyn_page_val_dao::find_count_dyn_page_val(
    Some(search),
    options,
  ).await?;
  
  Ok(dyn_page_val_num)
}

/// 根据条件查找第一个动态页面值
pub async fn find_one_dyn_page_val(
  search: Option<DynPageValSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<DynPageValModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let dyn_page_val_model = dyn_page_val_dao::find_one_dyn_page_val(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(dyn_page_val_model)
}

/// 根据条件查找第一个动态页面值, 如果不存在则抛错
pub async fn find_one_ok_dyn_page_val(
  search: Option<DynPageValSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<DynPageValModel> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let dyn_page_val_model = dyn_page_val_dao::find_one_ok_dyn_page_val(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(dyn_page_val_model)
}

/// 根据 id 查找动态页面值
pub async fn find_by_id_dyn_page_val(
  dyn_page_val_id: DynPageValId,
  options: Option<Options>,
) -> Result<Option<DynPageValModel>> {
  
  let dyn_page_val_model = dyn_page_val_dao::find_by_id_dyn_page_val(
    dyn_page_val_id,
    options,
  ).await?;
  
  Ok(dyn_page_val_model)
}

/// 根据 id 查找动态页面值, 如果不存在则抛错
pub async fn find_by_id_ok_dyn_page_val(
  dyn_page_val_id: DynPageValId,
  options: Option<Options>,
) -> Result<DynPageValModel> {
  
  let dyn_page_val_model = dyn_page_val_dao::find_by_id_ok_dyn_page_val(
    dyn_page_val_id,
    options,
  ).await?;
  
  Ok(dyn_page_val_model)
}

/// 根据 ids 查找动态页面值
pub async fn find_by_ids_dyn_page_val(
  dyn_page_val_ids: Vec<DynPageValId>,
  options: Option<Options>,
) -> Result<Vec<DynPageValModel>> {
  
  let dyn_page_val_models = dyn_page_val_dao::find_by_ids_dyn_page_val(
    dyn_page_val_ids,
    options,
  ).await?;
  
  Ok(dyn_page_val_models)
}

/// 根据 ids 查找动态页面值, 出现查询不到的 id 则报错
pub async fn find_by_ids_ok_dyn_page_val(
  dyn_page_val_ids: Vec<DynPageValId>,
  options: Option<Options>,
) -> Result<Vec<DynPageValModel>> {
  
  let dyn_page_val_models = dyn_page_val_dao::find_by_ids_ok_dyn_page_val(
    dyn_page_val_ids,
    options,
  ).await?;
  
  Ok(dyn_page_val_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_dyn_page_val(
  dyn_page_val_input: DynPageValInput,
) -> Result<DynPageValInput> {
  
  let dyn_page_val_input = dyn_page_val_dao::set_id_by_lbl_dyn_page_val(
    dyn_page_val_input,
  ).await?;
  
  Ok(dyn_page_val_input)
}

/// 创建动态页面值
#[allow(dead_code)]
pub async fn creates_dyn_page_val(
  dyn_page_val_inputs: Vec<DynPageValInput>,
  options: Option<Options>,
) -> Result<Vec<DynPageValId>> {
  
  let dyn_page_val_ids = dyn_page_val_dao::creates_dyn_page_val(
    dyn_page_val_inputs,
    options,
  ).await?;
  
  Ok(dyn_page_val_ids)
}

/// 动态页面值根据 dyn_page_val_id 修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id_dyn_page_val(
  dyn_page_val_id: DynPageValId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dyn_page_val_dao::update_tenant_by_id_dyn_page_val(
    dyn_page_val_id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 dyn_page_val_id 修改动态页面值
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_dyn_page_val(
  dyn_page_val_id: DynPageValId,
  mut dyn_page_val_input: DynPageValInput,
  options: Option<Options>,
) -> Result<DynPageValId> {
  
  let dyn_page_val_id = dyn_page_val_dao::update_by_id_dyn_page_val(
    dyn_page_val_id,
    dyn_page_val_input,
    options.clone(),
  ).await?;
  
  Ok(dyn_page_val_id)
}

/// 校验动态页面值是否存在
#[allow(dead_code)]
pub async fn validate_option_dyn_page_val(
  dyn_page_val_model: Option<DynPageValModel>,
) -> Result<DynPageValModel> {
  
  let dyn_page_val_model = dyn_page_val_dao::validate_option_dyn_page_val(dyn_page_val_model).await?;
  
  Ok(dyn_page_val_model)
}

/// 根据 dyn_page_val_ids 删除动态页面值
#[allow(dead_code)]
pub async fn delete_by_ids_dyn_page_val(
  dyn_page_val_ids: Vec<DynPageValId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dyn_page_val_dao::delete_by_ids_dyn_page_val(
    dyn_page_val_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取动态页面值字段注释
pub async fn get_field_comments_dyn_page_val(
  options: Option<Options>,
) -> Result<DynPageValFieldComment> {
  
  let comments = dyn_page_val_dao::get_field_comments_dyn_page_val(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 dyn_page_val_ids 还原动态页面值
#[allow(dead_code)]
pub async fn revert_by_ids_dyn_page_val(
  dyn_page_val_ids: Vec<DynPageValId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dyn_page_val_dao::revert_by_ids_dyn_page_val(
    dyn_page_val_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 dyn_page_val_ids 彻底删除动态页面值
#[allow(dead_code)]
pub async fn force_delete_by_ids_dyn_page_val(
  dyn_page_val_ids: Vec<DynPageValId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dyn_page_val_dao::force_delete_by_ids_dyn_page_val(
    dyn_page_val_ids,
    options,
  ).await?;
  
  Ok(num)
}
