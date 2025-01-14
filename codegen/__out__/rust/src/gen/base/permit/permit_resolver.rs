#[allow(unused_imports)]
use std::time::Instant;

use color_eyre::eyre::Result;

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
  
  check_sort_permit(sort.as_deref())?;
  
  let models = permit_service::find_all(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找按钮权限总数
pub async fn find_count(
  search: Option<PermitSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
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
  
  check_sort_permit(sort.as_deref())?;
  
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
    get_route_path_permit(),
    "edit".to_owned(),
  ).await?;
  
  let res = permit_service::update_by_id(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
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

/// 查找 按钮权限 order_by 字段的最大值
pub async fn find_last_order_by(
  options: Option<Options>,
) -> Result<u32> {
  
  let res = permit_service::find_last_order_by(
    options,
  ).await?;
  
  Ok(res)
}
