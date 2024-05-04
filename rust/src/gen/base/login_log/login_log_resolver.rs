#[allow(unused_imports)]
use std::time::Instant;

use anyhow::Result;

use crate::common::context::Options;
use crate::common::gql::model::{PageInput, SortInput};
use crate::src::base::permit::permit_service::use_permit;

use super::login_log_model::*;
use super::login_log_service;

use crate::gen::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找登录日志列表
pub async fn find_all(
  search: Option<LoginLogSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<LoginLogModel>> {
  
  let res = login_log_service::find_all(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找登录日志总数
pub async fn find_count(
  search: Option<LoginLogSearch>,
  options: Option<Options>,
) -> Result<i64> {
  
  let num = login_log_service::find_count(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个登录日志
pub async fn find_one(
  search: Option<LoginLogSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<LoginLogModel>> {
  
  let model = login_log_service::find_one(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找登录日志
pub async fn find_by_id(
  id: LoginLogId,
  options: Option<Options>,
) -> Result<Option<LoginLogModel>> {
  
  let model = login_log_service::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 创建登录日志
#[allow(dead_code)]
pub async fn create(
  input: LoginLogInput,
  options: Option<Options>,
) -> Result<LoginLogId> {
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = login_log_service::set_id_by_lbl(
    input,
  ).await?;
  
  use_permit(
    "/base/login_log".to_owned(),
    "add".to_owned(),
  ).await?;
  
  let id = login_log_service::create(
    input,
    options,
  ).await?;
  
  Ok(id)
}

/// 批量创建登录日志
#[allow(dead_code)]
pub async fn creates(
  inputs: Vec<LoginLogInput>,
  options: Option<Options>,
) -> Result<Vec<LoginLogId>> {
  
  let mut inputs = inputs;
  for input in &mut inputs {
    input.id = None;
  }
  let inputs = inputs;
  
  let mut inputs2 = Vec::with_capacity(inputs.len());
  for input in inputs {
    let input = login_log_service::set_id_by_lbl(
      input,
    ).await?;
    inputs2.push(input);
  }
  let inputs = inputs2;
  
  use_permit(
    "/base/login_log".to_owned(),
    "add".to_owned(),
  ).await?;
  
  let ids = login_log_service::creates(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 登录日志根据id修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id(
  id: LoginLogId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = login_log_service::update_tenant_by_id(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改登录日志
#[allow(dead_code)]
pub async fn update_by_id(
  id: LoginLogId,
  input: LoginLogInput,
  options: Option<Options>,
) -> Result<LoginLogId> {
  
  let mut input = input;
  input.id = None;
  let input = input;
  
  let input = login_log_service::set_id_by_lbl(
    input,
  ).await?;
  
  use_permit(
    "/base/login_log".to_owned(),
    "edit".to_owned(),
  ).await?;
  
  let res = login_log_service::update_by_id(
    id,
    input,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据 ids 删除登录日志
#[allow(dead_code)]
pub async fn delete_by_ids(
  ids: Vec<LoginLogId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    "/base/login_log".to_owned(),
    "delete".to_owned(),
  ).await?;
  
  let num = login_log_service::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取登录日志字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<LoginLogFieldComment> {
  
  let comments = login_log_service::get_field_comments(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原登录日志
#[allow(dead_code)]
pub async fn revert_by_ids(
  ids: Vec<LoginLogId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    "/base/login_log".to_owned(),
    "delete".to_owned(),
  ).await?;
  
  let num = login_log_service::revert_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除登录日志
#[allow(dead_code)]
pub async fn force_delete_by_ids(
  ids: Vec<LoginLogId>,
  options: Option<Options>,
) -> Result<u64> {
  
  use_permit(
    "/base/login_log".to_owned(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = login_log_service::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}
