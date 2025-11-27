
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

use super::dyn_page_data_model::*;
use super::dyn_page_data_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut DynPageDataSearch,
  options: Option<Options>,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找动态页面数据列表
pub async fn find_all_dyn_page_data(
  search: Option<DynPageDataSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<DynPageDataModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let dyn_page_data_models = dyn_page_data_dao::find_all_dyn_page_data(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(dyn_page_data_models)
}

/// 根据条件查找动态页面数据总数
pub async fn find_count_dyn_page_data(
  search: Option<DynPageDataSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let dyn_page_data_num = dyn_page_data_dao::find_count_dyn_page_data(
    Some(search),
    options,
  ).await?;
  
  Ok(dyn_page_data_num)
}

/// 根据条件查找第一个动态页面数据
pub async fn find_one_dyn_page_data(
  search: Option<DynPageDataSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<DynPageDataModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let dyn_page_data_model = dyn_page_data_dao::find_one_dyn_page_data(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(dyn_page_data_model)
}

/// 根据条件查找第一个动态页面数据, 如果不存在则抛错
pub async fn find_one_ok_dyn_page_data(
  search: Option<DynPageDataSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<DynPageDataModel> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let dyn_page_data_model = dyn_page_data_dao::find_one_ok_dyn_page_data(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(dyn_page_data_model)
}

/// 根据 id 查找动态页面数据
pub async fn find_by_id_dyn_page_data(
  dyn_page_data_id: DynPageDataId,
  options: Option<Options>,
) -> Result<Option<DynPageDataModel>> {
  
  let dyn_page_data_model = dyn_page_data_dao::find_by_id_dyn_page_data(
    dyn_page_data_id,
    options,
  ).await?;
  
  Ok(dyn_page_data_model)
}

/// 根据 id 查找动态页面数据, 如果不存在则抛错
pub async fn find_by_id_ok_dyn_page_data(
  dyn_page_data_id: DynPageDataId,
  options: Option<Options>,
) -> Result<DynPageDataModel> {
  
  let dyn_page_data_model = dyn_page_data_dao::find_by_id_ok_dyn_page_data(
    dyn_page_data_id,
    options,
  ).await?;
  
  Ok(dyn_page_data_model)
}

/// 根据 ids 查找动态页面数据
pub async fn find_by_ids_dyn_page_data(
  dyn_page_data_ids: Vec<DynPageDataId>,
  options: Option<Options>,
) -> Result<Vec<DynPageDataModel>> {
  
  let dyn_page_data_models = dyn_page_data_dao::find_by_ids_dyn_page_data(
    dyn_page_data_ids,
    options,
  ).await?;
  
  Ok(dyn_page_data_models)
}

/// 根据 ids 查找动态页面数据, 出现查询不到的 id 则报错
pub async fn find_by_ids_ok_dyn_page_data(
  dyn_page_data_ids: Vec<DynPageDataId>,
  options: Option<Options>,
) -> Result<Vec<DynPageDataModel>> {
  
  let dyn_page_data_models = dyn_page_data_dao::find_by_ids_ok_dyn_page_data(
    dyn_page_data_ids,
    options,
  ).await?;
  
  Ok(dyn_page_data_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_dyn_page_data(
  dyn_page_data_input: DynPageDataInput,
) -> Result<DynPageDataInput> {
  
  let dyn_page_data_input = dyn_page_data_dao::set_id_by_lbl_dyn_page_data(
    dyn_page_data_input,
  ).await?;
  
  Ok(dyn_page_data_input)
}

/// 创建动态页面数据
#[allow(dead_code)]
pub async fn creates_dyn_page_data(
  dyn_page_data_inputs: Vec<DynPageDataInput>,
  options: Option<Options>,
) -> Result<Vec<DynPageDataId>> {
  
  let dyn_page_data_ids = dyn_page_data_dao::creates_dyn_page_data(
    dyn_page_data_inputs,
    options,
  ).await?;
  
  Ok(dyn_page_data_ids)
}

/// 动态页面数据根据 dyn_page_data_id 修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id_dyn_page_data(
  dyn_page_data_id: DynPageDataId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dyn_page_data_dao::update_tenant_by_id_dyn_page_data(
    dyn_page_data_id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 dyn_page_data_id 修改动态页面数据
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_dyn_page_data(
  dyn_page_data_id: DynPageDataId,
  mut dyn_page_data_input: DynPageDataInput,
  options: Option<Options>,
) -> Result<DynPageDataId> {
  
  let dyn_page_data_id = dyn_page_data_dao::update_by_id_dyn_page_data(
    dyn_page_data_id,
    dyn_page_data_input,
    options.clone(),
  ).await?;
  
  Ok(dyn_page_data_id)
}

/// 校验动态页面数据是否存在
#[allow(dead_code)]
pub async fn validate_option_dyn_page_data(
  dyn_page_data_model: Option<DynPageDataModel>,
) -> Result<DynPageDataModel> {
  
  let dyn_page_data_model = dyn_page_data_dao::validate_option_dyn_page_data(dyn_page_data_model).await?;
  
  Ok(dyn_page_data_model)
}

/// 根据 dyn_page_data_ids 删除动态页面数据
#[allow(dead_code)]
pub async fn delete_by_ids_dyn_page_data(
  dyn_page_data_ids: Vec<DynPageDataId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dyn_page_data_dao::delete_by_ids_dyn_page_data(
    dyn_page_data_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取动态页面数据字段注释
pub async fn get_field_comments_dyn_page_data(
  options: Option<Options>,
) -> Result<DynPageDataFieldComment> {
  
  let comments = dyn_page_data_dao::get_field_comments_dyn_page_data(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 dyn_page_data_ids 还原动态页面数据
#[allow(dead_code)]
pub async fn revert_by_ids_dyn_page_data(
  dyn_page_data_ids: Vec<DynPageDataId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dyn_page_data_dao::revert_by_ids_dyn_page_data(
    dyn_page_data_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 dyn_page_data_ids 彻底删除动态页面数据
#[allow(dead_code)]
pub async fn force_delete_by_ids_dyn_page_data(
  dyn_page_data_ids: Vec<DynPageDataId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dyn_page_data_dao::force_delete_by_ids_dyn_page_data(
    dyn_page_data_ids,
    options,
  ).await?;
  
  Ok(num)
}
