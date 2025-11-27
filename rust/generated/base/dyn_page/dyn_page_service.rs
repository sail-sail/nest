
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

use super::dyn_page_model::*;
use super::dyn_page_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut DynPageSearch,
  options: Option<Options>,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找动态页面列表
pub async fn find_all_dyn_page(
  search: Option<DynPageSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<DynPageModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let dyn_page_models = dyn_page_dao::find_all_dyn_page(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(dyn_page_models)
}

/// 根据条件查找动态页面总数
pub async fn find_count_dyn_page(
  search: Option<DynPageSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let dyn_page_num = dyn_page_dao::find_count_dyn_page(
    Some(search),
    options,
  ).await?;
  
  Ok(dyn_page_num)
}

/// 根据条件查找第一个动态页面
pub async fn find_one_dyn_page(
  search: Option<DynPageSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<DynPageModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let dyn_page_model = dyn_page_dao::find_one_dyn_page(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(dyn_page_model)
}

/// 根据条件查找第一个动态页面, 如果不存在则抛错
pub async fn find_one_ok_dyn_page(
  search: Option<DynPageSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<DynPageModel> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let dyn_page_model = dyn_page_dao::find_one_ok_dyn_page(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(dyn_page_model)
}

/// 根据 id 查找动态页面
pub async fn find_by_id_dyn_page(
  dyn_page_id: DynPageId,
  options: Option<Options>,
) -> Result<Option<DynPageModel>> {
  
  let dyn_page_model = dyn_page_dao::find_by_id_dyn_page(
    dyn_page_id,
    options,
  ).await?;
  
  Ok(dyn_page_model)
}

/// 根据 id 查找动态页面, 如果不存在则抛错
pub async fn find_by_id_ok_dyn_page(
  dyn_page_id: DynPageId,
  options: Option<Options>,
) -> Result<DynPageModel> {
  
  let dyn_page_model = dyn_page_dao::find_by_id_ok_dyn_page(
    dyn_page_id,
    options,
  ).await?;
  
  Ok(dyn_page_model)
}

/// 根据 ids 查找动态页面
pub async fn find_by_ids_dyn_page(
  dyn_page_ids: Vec<DynPageId>,
  options: Option<Options>,
) -> Result<Vec<DynPageModel>> {
  
  let dyn_page_models = dyn_page_dao::find_by_ids_dyn_page(
    dyn_page_ids,
    options,
  ).await?;
  
  Ok(dyn_page_models)
}

/// 根据 ids 查找动态页面, 出现查询不到的 id 则报错
pub async fn find_by_ids_ok_dyn_page(
  dyn_page_ids: Vec<DynPageId>,
  options: Option<Options>,
) -> Result<Vec<DynPageModel>> {
  
  let dyn_page_models = dyn_page_dao::find_by_ids_ok_dyn_page(
    dyn_page_ids,
    options,
  ).await?;
  
  Ok(dyn_page_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_dyn_page(
  dyn_page_input: DynPageInput,
) -> Result<DynPageInput> {
  
  let dyn_page_input = dyn_page_dao::set_id_by_lbl_dyn_page(
    dyn_page_input,
  ).await?;
  
  Ok(dyn_page_input)
}

/// 创建动态页面
#[allow(dead_code)]
pub async fn creates_dyn_page(
  dyn_page_inputs: Vec<DynPageInput>,
  options: Option<Options>,
) -> Result<Vec<DynPageId>> {
  
  let dyn_page_ids = dyn_page_dao::creates_dyn_page(
    dyn_page_inputs,
    options,
  ).await?;
  
  Ok(dyn_page_ids)
}

/// 动态页面根据 dyn_page_id 修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id_dyn_page(
  dyn_page_id: DynPageId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dyn_page_dao::update_tenant_by_id_dyn_page(
    dyn_page_id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 dyn_page_id 修改动态页面
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_dyn_page(
  dyn_page_id: DynPageId,
  mut dyn_page_input: DynPageInput,
  options: Option<Options>,
) -> Result<DynPageId> {
  
  let dyn_page_id = dyn_page_dao::update_by_id_dyn_page(
    dyn_page_id,
    dyn_page_input,
    options.clone(),
  ).await?;
  
  Ok(dyn_page_id)
}

/// 校验动态页面是否存在
#[allow(dead_code)]
pub async fn validate_option_dyn_page(
  dyn_page_model: Option<DynPageModel>,
) -> Result<DynPageModel> {
  
  let dyn_page_model = dyn_page_dao::validate_option_dyn_page(dyn_page_model).await?;
  
  Ok(dyn_page_model)
}

/// 根据 dyn_page_ids 删除动态页面
#[allow(dead_code)]
pub async fn delete_by_ids_dyn_page(
  dyn_page_ids: Vec<DynPageId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dyn_page_dao::delete_by_ids_dyn_page(
    dyn_page_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 dyn_page_id 查找动态页面是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id_dyn_page(
  dyn_page_id: DynPageId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = dyn_page_dao::get_is_enabled_by_id_dyn_page(
    dyn_page_id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 dyn_page_ids 启用或者禁用动态页面
#[allow(dead_code)]
pub async fn enable_by_ids_dyn_page(
  dyn_page_ids: Vec<DynPageId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dyn_page_dao::enable_by_ids_dyn_page(
    dyn_page_ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取动态页面字段注释
pub async fn get_field_comments_dyn_page(
  options: Option<Options>,
) -> Result<DynPageFieldComment> {
  
  let comments = dyn_page_dao::get_field_comments_dyn_page(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 dyn_page_ids 还原动态页面
#[allow(dead_code)]
pub async fn revert_by_ids_dyn_page(
  dyn_page_ids: Vec<DynPageId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dyn_page_dao::revert_by_ids_dyn_page(
    dyn_page_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 dyn_page_ids 彻底删除动态页面
#[allow(dead_code)]
pub async fn force_delete_by_ids_dyn_page(
  dyn_page_ids: Vec<DynPageId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = dyn_page_dao::force_delete_by_ids_dyn_page(
    dyn_page_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 动态页面 order_by 字段的最大值
pub async fn find_last_order_by_dyn_page(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = dyn_page_dao::find_last_order_by_dyn_page(
    options,
  ).await?;
  
  Ok(res)
}
