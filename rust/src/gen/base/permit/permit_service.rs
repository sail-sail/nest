#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use anyhow::{Result,anyhow};

use crate::common::context::Options;
use crate::common::gql::model::{PageInput, SortInput};

#[allow(unused_imports)]
use crate::src::base::i18n::i18n_dao;

use super::permit_model::*;
use super::permit_dao;

/// 根据搜索条件和分页查找按钮权限列表
pub async fn find_all(
  search: Option<PermitSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<PermitModel>> {
  
  let res = permit_dao::find_all(
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
  
  let res = permit_dao::find_count(
    search,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找第一个按钮权限
pub async fn find_one(
  search: Option<PermitSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<PermitModel>> {
  
  let model = permit_dao::find_one(
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
  
  let model = permit_dao::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
pub async fn set_id_by_lbl(
  input: PermitInput,
) -> Result<PermitInput> {
  
  let input = permit_dao::set_id_by_lbl(
    input,
  ).await?;
  
  Ok(input)
}

/// 创建按钮权限
#[allow(dead_code)]
pub async fn create(
  input: PermitInput,
  options: Option<Options>,
) -> Result<PermitId> {
  
  let id = permit_dao::create(
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
  
  let ids = permit_dao::creates(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 根据 id 修改按钮权限
#[allow(dead_code)]
#[allow(unused_mut)]
pub async fn update_by_id(
  id: PermitId,
  mut input: PermitInput,
  options: Option<Options>,
) -> Result<PermitId> {
  
  // 不能修改系统记录的系统字段
  let model = permit_dao::find_by_id(
    id.clone(),
    None,
  ).await?;
  
  if let Some(model) = model {
    if model.is_sys == 1 {
      // 菜单
      input.menu_id = None;
      input.menu_id_lbl = None;
      // 编码
      input.code = None;
    }
  }
  
  let res = permit_dao::update_by_id(
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
  
  let len = ids.len();
  let ids0 = ids.clone();
  let mut ids: Vec<PermitId> = vec![];
  for id in ids0 {
    let model = permit_dao::find_by_id(
      id.clone(),
      None,
    ).await?;
    if model.is_none() {
      continue;
    }
    let model = model.unwrap();
    if model.is_sys == 1 {
      continue;
    }
    ids.push(id);
  }
  if ids.is_empty() && len > 0 {
    let err_msg = i18n_dao::ns("不能删除系统记录".to_owned(), None).await?;
    return Err(anyhow!(err_msg));
  }
  
  let num = permit_dao::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取按钮权限字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<PermitFieldComment> {
  
  let comments = permit_dao::get_field_comments(
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
  
  let num = permit_dao::revert_by_ids(
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
  
  let num = permit_dao::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}