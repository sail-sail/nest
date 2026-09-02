
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

use super::tsdb_app_model::*;
use super::tsdb_app_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut TsdbAppSearch,
  options: Option<Options>,
) -> Result<()> {
  
  Ok(())
}

/// 根据搜索条件和分页查找时序数据库列表
pub async fn find_all_tsdb_app(
  search: Option<TsdbAppSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<TsdbAppModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let tsdb_app_models = tsdb_app_dao::find_all_tsdb_app(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(tsdb_app_models)
}

/// 根据条件查找时序数据库总数
pub async fn find_count_tsdb_app(
  search: Option<TsdbAppSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let tsdb_app_num = tsdb_app_dao::find_count_tsdb_app(
    Some(search),
    options,
  ).await?;
  
  Ok(tsdb_app_num)
}

/// 根据条件查找第一个时序数据库
pub async fn find_one_tsdb_app(
  search: Option<TsdbAppSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<TsdbAppModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let tsdb_app_model = tsdb_app_dao::find_one_tsdb_app(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(tsdb_app_model)
}

/// 根据条件查找第一个时序数据库, 如果不存在则抛错
pub async fn find_one_ok_tsdb_app(
  search: Option<TsdbAppSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<TsdbAppModel> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let tsdb_app_model = tsdb_app_dao::find_one_ok_tsdb_app(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(tsdb_app_model)
}

/// 根据 id 查找时序数据库
pub async fn find_by_id_tsdb_app(
  tsdb_app_id: TsdbAppId,
  options: Option<Options>,
) -> Result<Option<TsdbAppModel>> {
  
  let tsdb_app_model = tsdb_app_dao::find_by_id_tsdb_app(
    tsdb_app_id,
    options,
  ).await?;
  
  Ok(tsdb_app_model)
}

/// 根据 id 查找时序数据库, 如果不存在则抛错
pub async fn find_by_id_ok_tsdb_app(
  tsdb_app_id: TsdbAppId,
  options: Option<Options>,
) -> Result<TsdbAppModel> {
  
  let tsdb_app_model = tsdb_app_dao::find_by_id_ok_tsdb_app(
    tsdb_app_id,
    options,
  ).await?;
  
  Ok(tsdb_app_model)
}

/// 根据 ids 查找时序数据库
pub async fn find_by_ids_tsdb_app(
  tsdb_app_ids: Vec<TsdbAppId>,
  options: Option<Options>,
) -> Result<Vec<TsdbAppModel>> {
  
  let tsdb_app_models = tsdb_app_dao::find_by_ids_tsdb_app(
    tsdb_app_ids,
    options,
  ).await?;
  
  Ok(tsdb_app_models)
}

/// 根据搜索条件判断时序数据库是否存在
pub async fn exists_tsdb_app(
  search: Option<TsdbAppSearch>,
  options: Option<Options>,
) -> Result<bool> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let exists_res = tsdb_app_dao::exists_tsdb_app(
    Some(search),
    options,
  ).await?;
  
  Ok(exists_res)
}

/// 根据 ids 查找时序数据库, 出现查询不到的 id 则报错
pub async fn find_by_ids_ok_tsdb_app(
  tsdb_app_ids: Vec<TsdbAppId>,
  options: Option<Options>,
) -> Result<Vec<TsdbAppModel>> {
  
  let tsdb_app_models = tsdb_app_dao::find_by_ids_ok_tsdb_app(
    tsdb_app_ids,
    options,
  ).await?;
  
  Ok(tsdb_app_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_tsdb_app(
  tsdb_app_input: TsdbAppInput,
) -> Result<TsdbAppInput> {
  
  let tsdb_app_input = tsdb_app_dao::set_id_by_lbl_tsdb_app(
    tsdb_app_input,
  ).await?;
  
  Ok(tsdb_app_input)
}

/// 创建时序数据库
#[allow(dead_code)]
pub async fn creates_tsdb_app(
  tsdb_app_inputs: Vec<TsdbAppInput>,
  options: Option<Options>,
) -> Result<Vec<TsdbAppId>> {
  
  let tsdb_app_ids = tsdb_app_dao::creates_tsdb_app(
    tsdb_app_inputs,
    options,
  ).await?;
  
  Ok(tsdb_app_ids)
}

/// 时序数据库根据 tsdb_app_id 修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id_tsdb_app(
  tsdb_app_id: TsdbAppId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = tsdb_app_dao::update_tenant_by_id_tsdb_app(
    tsdb_app_id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 tsdb_app_id 修改时序数据库
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_tsdb_app(
  tsdb_app_id: TsdbAppId,
  mut tsdb_app_input: TsdbAppInput,
  options: Option<Options>,
) -> Result<TsdbAppId> {
  
  let tsdb_app_id = tsdb_app_dao::update_by_id_tsdb_app(
    tsdb_app_id,
    tsdb_app_input,
    options,
  ).await?;
  
  Ok(tsdb_app_id)
}

/// 校验时序数据库是否存在
#[allow(dead_code)]
pub async fn validate_option_tsdb_app(
  tsdb_app_model: Option<TsdbAppModel>,
) -> Result<TsdbAppModel> {
  
  let tsdb_app_model = tsdb_app_dao::validate_option_tsdb_app(tsdb_app_model).await?;
  
  Ok(tsdb_app_model)
}

/// 根据 tsdb_app_ids 删除时序数据库
#[allow(dead_code)]
pub async fn delete_by_ids_tsdb_app(
  tsdb_app_ids: Vec<TsdbAppId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = tsdb_app_dao::delete_by_ids_tsdb_app(
    tsdb_app_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 tsdb_app_id 查找时序数据库是否已启用
/// 记录不存在则返回 false
#[allow(dead_code)]
pub async fn get_is_enabled_by_id_tsdb_app(
  tsdb_app_id: TsdbAppId,
  options: Option<Options>,
) -> Result<bool> {
  
  let is_enabled = tsdb_app_dao::get_is_enabled_by_id_tsdb_app(
    tsdb_app_id,
    options,
  ).await?;
  
  Ok(is_enabled)
}

/// 根据 tsdb_app_ids 启用或者禁用时序数据库
#[allow(dead_code)]
pub async fn enable_by_ids_tsdb_app(
  tsdb_app_ids: Vec<TsdbAppId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = tsdb_app_dao::enable_by_ids_tsdb_app(
    tsdb_app_ids,
    is_enabled,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取时序数据库字段注释
pub async fn get_field_comments_tsdb_app(
  options: Option<Options>,
) -> Result<TsdbAppFieldComment> {
  
  let comments = tsdb_app_dao::get_field_comments_tsdb_app(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 tsdb_app_ids 还原时序数据库
#[allow(dead_code)]
pub async fn revert_by_ids_tsdb_app(
  tsdb_app_ids: Vec<TsdbAppId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = tsdb_app_dao::revert_by_ids_tsdb_app(
    tsdb_app_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 tsdb_app_ids 彻底删除时序数据库
#[allow(dead_code)]
pub async fn force_delete_by_ids_tsdb_app(
  tsdb_app_ids: Vec<TsdbAppId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = tsdb_app_dao::force_delete_by_ids_tsdb_app(
    tsdb_app_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 查找 时序数据库 order_by 字段的最大值
pub async fn find_last_order_by_tsdb_app(
  search: Option<TsdbAppSearch>,
  options: Option<Options>,
) -> Result<u32> {
  
  let order_by = tsdb_app_dao::find_last_order_by_tsdb_app(
    search,
    options,
  ).await?;
  
  Ok(order_by)
}
