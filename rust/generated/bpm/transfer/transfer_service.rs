
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

use super::transfer_model::*;
use super::transfer_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut TransferSearch,
  options: Option<Options>,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找转交记录列表
pub async fn find_all_transfer(
  search: Option<TransferSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<TransferModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let transfer_models = transfer_dao::find_all_transfer(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(transfer_models)
}

/// 根据条件查找转交记录总数
pub async fn find_count_transfer(
  search: Option<TransferSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let transfer_num = transfer_dao::find_count_transfer(
    Some(search),
    options,
  ).await?;
  
  Ok(transfer_num)
}

/// 根据条件查找第一个转交记录
pub async fn find_one_transfer(
  search: Option<TransferSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<TransferModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let transfer_model = transfer_dao::find_one_transfer(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(transfer_model)
}

/// 根据条件查找第一个转交记录, 如果不存在则抛错
pub async fn find_one_ok_transfer(
  search: Option<TransferSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<TransferModel> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let transfer_model = transfer_dao::find_one_ok_transfer(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(transfer_model)
}

/// 根据 id 查找转交记录
pub async fn find_by_id_transfer(
  transfer_id: TransferId,
  options: Option<Options>,
) -> Result<Option<TransferModel>> {
  
  let transfer_model = transfer_dao::find_by_id_transfer(
    transfer_id,
    options,
  ).await?;
  
  Ok(transfer_model)
}

/// 根据 id 查找转交记录, 如果不存在则抛错
pub async fn find_by_id_ok_transfer(
  transfer_id: TransferId,
  options: Option<Options>,
) -> Result<TransferModel> {
  
  let transfer_model = transfer_dao::find_by_id_ok_transfer(
    transfer_id,
    options,
  ).await?;
  
  Ok(transfer_model)
}

/// 根据 ids 查找转交记录
pub async fn find_by_ids_transfer(
  transfer_ids: Vec<TransferId>,
  options: Option<Options>,
) -> Result<Vec<TransferModel>> {
  
  let transfer_models = transfer_dao::find_by_ids_transfer(
    transfer_ids,
    options,
  ).await?;
  
  Ok(transfer_models)
}

/// 根据 ids 查找转交记录, 出现查询不到的 id 则报错
pub async fn find_by_ids_ok_transfer(
  transfer_ids: Vec<TransferId>,
  options: Option<Options>,
) -> Result<Vec<TransferModel>> {
  
  let transfer_models = transfer_dao::find_by_ids_ok_transfer(
    transfer_ids,
    options,
  ).await?;
  
  Ok(transfer_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_transfer(
  transfer_input: TransferInput,
) -> Result<TransferInput> {
  
  let transfer_input = transfer_dao::set_id_by_lbl_transfer(
    transfer_input,
  ).await?;
  
  Ok(transfer_input)
}

/// 创建转交记录
#[allow(dead_code)]
pub async fn creates_transfer(
  transfer_inputs: Vec<TransferInput>,
  options: Option<Options>,
) -> Result<Vec<TransferId>> {
  
  let transfer_ids = transfer_dao::creates_transfer(
    transfer_inputs,
    options,
  ).await?;
  
  Ok(transfer_ids)
}

/// 转交记录根据 transfer_id 修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id_transfer(
  transfer_id: TransferId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = transfer_dao::update_tenant_by_id_transfer(
    transfer_id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 transfer_id 修改转交记录
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_transfer(
  transfer_id: TransferId,
  mut transfer_input: TransferInput,
  options: Option<Options>,
) -> Result<TransferId> {
  
  let transfer_id = transfer_dao::update_by_id_transfer(
    transfer_id,
    transfer_input,
    options,
  ).await?;
  
  Ok(transfer_id)
}

/// 校验转交记录是否存在
#[allow(dead_code)]
pub async fn validate_option_transfer(
  transfer_model: Option<TransferModel>,
) -> Result<TransferModel> {
  
  let transfer_model = transfer_dao::validate_option_transfer(transfer_model).await?;
  
  Ok(transfer_model)
}

/// 根据 transfer_ids 删除转交记录
#[allow(dead_code)]
pub async fn delete_by_ids_transfer(
  transfer_ids: Vec<TransferId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = transfer_dao::delete_by_ids_transfer(
    transfer_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取转交记录字段注释
pub async fn get_field_comments_transfer(
  options: Option<Options>,
) -> Result<TransferFieldComment> {
  
  let comments = transfer_dao::get_field_comments_transfer(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 transfer_ids 还原转交记录
#[allow(dead_code)]
pub async fn revert_by_ids_transfer(
  transfer_ids: Vec<TransferId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = transfer_dao::revert_by_ids_transfer(
    transfer_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 transfer_ids 彻底删除转交记录
#[allow(dead_code)]
pub async fn force_delete_by_ids_transfer(
  transfer_ids: Vec<TransferId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = transfer_dao::force_delete_by_ids_transfer(
    transfer_ids,
    options,
  ).await?;
  
  Ok(num)
}
