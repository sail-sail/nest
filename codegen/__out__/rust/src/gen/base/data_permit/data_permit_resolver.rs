#[allow(unused_imports)]
use std::time::Instant;

use anyhow::Result;

use crate::common::context::Options;
use crate::common::gql::model::{PageInput, SortInput};
use crate::src::base::permit::permit_service::use_permit;

use super::data_permit_model::*;
use super::data_permit_service;

/// 根据搜索条件和分页查找数据权限列表
pub async fn find_all(
  search: Option<DataPermitSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<DataPermitModel>> {
  
  let res = data_permit_service::find_all(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找数据权限总数
pub async fn find_count(
  search: Option<DataPermitSearch>,
  options: Option<Options>,
) -> Result<i64> {
  
  let num = data_permit_service::find_count(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个数据权限
pub async fn find_one(
  search: Option<DataPermitSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<DataPermitModel>> {
  
  let model = data_permit_service::find_one(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找数据权限
pub async fn find_by_id(
  id: DataPermitId,
  options: Option<Options>,
) -> Result<Option<DataPermitModel>> {
  
  let model = data_permit_service::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 创建数据权限
#[allow(dead_code)]
pub async fn create(
  input: DataPermitInput,
  options: Option<Options>,
) -> Result<DataPermitId> {
  
  let input = data_permit_service::set_id_by_lbl(
    input,
  ).await?;
  
  use_permit(
    "/base/data_permit".to_owned(),
    "add".to_owned(),
  ).await?;
  
  let id = data_permit_service::create(
    input,
    options,
  ).await?;
  
  Ok(id)
}

/// 根据 id 修改数据权限
#[allow(dead_code)]
pub async fn update_by_id(
  id: DataPermitId,
  input: DataPermitInput,
  options: Option<Options>,
) -> Result<DataPermitId> {
  
  let input = data_permit_service::set_id_by_lbl(
    input,
  ).await?;
  
  use_permit(
    "/base/data_permit".to_owned(),
    "edit".to_owned(),
  ).await?;
  
  let res = data_permit_service::update_by_id(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除数据权限
#[allow(dead_code)]
pub async fn delete_by_ids(
  ids: Vec<DataPermitId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    "/base/data_permit".to_owned(),
    "delete".to_owned(),
  ).await?;
  
  let num = data_permit_service::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取数据权限字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<DataPermitFieldComment> {
  
  let comments = data_permit_service::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原数据权限
#[allow(dead_code)]
pub async fn revert_by_ids(
  ids: Vec<DataPermitId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    "/base/data_permit".to_owned(),
    "delete".to_owned(),
  ).await?;
  
  let num = data_permit_service::revert_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除数据权限
#[allow(dead_code)]
pub async fn force_delete_by_ids(
  ids: Vec<DataPermitId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    "/base/data_permit".to_owned(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = data_permit_service::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}
