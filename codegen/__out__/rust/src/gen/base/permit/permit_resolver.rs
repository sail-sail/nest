#[allow(unused_imports)]
use std::time::Instant;

use anyhow::Result;

use crate::common::context::Options;
use crate::common::gql::model::{PageInput, SortInput};
use crate::src::base::permit::permit_service::use_permit;

use super::permit_model::*;
use super::permit_service;

/// 根据搜索条件和分页查找按钮权限列表
pub async fn find_all(
  search: Option<PermitSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<PermitModel>> {
  
  let res = permit_service::find_all(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找按钮权限总数
pub async fn find_count(
  search: Option<PermitSearch>,
  options: Option<Options>,
) -> Result<i64> {
  
  let num = permit_service::find_count(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个按钮权限
pub async fn find_one(
  search: Option<PermitSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<PermitModel>> {
  
  let model = permit_service::find_one(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找按钮权限
pub async fn find_by_id(
  id: PermitId,
  options: Option<Options>,
) -> Result<Option<PermitModel>> {
  
  let model = permit_service::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 创建按钮权限
#[allow(dead_code)]
pub async fn create(
  input: PermitInput,
  options: Option<Options>,
) -> Result<PermitId> {
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = permit_service::set_id_by_lbl(
    input,
  ).await?;
  
  use_permit(
    "/base/permit".to_owned(),
    "add".to_owned(),
  ).await?;
  
  let id = permit_service::create(
    input,
    options,
  ).await?;
  
  Ok(id)
}

/// 批量创建按钮权限
#[allow(dead_code)]
pub async fn creates(
  inputs: Vec<PermitInput>,
  options: Option<Options>,
) -> Result<Vec<PermitId>> {
  
  let mut inputs = inputs;
  for input in &mut inputs {
    input.id = None;
  }
  let inputs = inputs;
  
  let mut inputs2 = Vec::with_capacity(inputs.len());
  for input in inputs {
    let input = permit_service::set_id_by_lbl(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    "/base/permit".to_owned(),
    "add".to_owned(),
  ).await?;
  
  let ids = permit_service::creates(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 根据 id 修改按钮权限
#[allow(dead_code)]
pub async fn update_by_id(
  id: PermitId,
  input: PermitInput,
  options: Option<Options>,
) -> Result<PermitId> {
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = permit_service::set_id_by_lbl(
    input,
  ).await?;
  
  use_permit(
    "/base/permit".to_owned(),
    "edit".to_owned(),
  ).await?;
  
  let res = permit_service::update_by_id(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除按钮权限
#[allow(dead_code)]
pub async fn delete_by_ids(
  ids: Vec<PermitId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    "/base/permit".to_owned(),
    "delete".to_owned(),
  ).await?;
  
  let num = permit_service::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取按钮权限字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<PermitFieldComment> {
  
  let comments = permit_service::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原按钮权限
#[allow(dead_code)]
pub async fn revert_by_ids(
  ids: Vec<PermitId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    "/base/permit".to_owned(),
    "delete".to_owned(),
  ).await?;
  
  let num = permit_service::revert_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除按钮权限
#[allow(dead_code)]
pub async fn force_delete_by_ids(
  ids: Vec<PermitId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    "/base/permit".to_owned(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = permit_service::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}
