#[allow(unused_imports)]
use std::collections::HashMap;

use anyhow::Result;

#[allow(unused_imports)]
use crate::common::context::{
  SrvErr,
  Options,
};

use crate::common::gql::model::{PageInput, SortInput};

#[allow(unused_imports)]
use crate::src::base::i18n::i18n_dao;

use crate::gen::base::tenant::tenant_model::TenantId;

use super::login_log_model::*;
use super::login_log_dao;

/// 根据搜索条件和分页查找登录日志列表
pub async fn find_all(
  search: Option<LoginLogSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<LoginLogModel>> {
  
  let res = login_log_dao::find_all(
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
  
  let res = login_log_dao::find_count(
    search,
    options,
  ).await?;
  
  Ok(res)
}

/// 根据条件查找第一个登录日志
pub async fn find_one(
  search: Option<LoginLogSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<LoginLogModel>> {
  
  let model = login_log_dao::find_one(
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
  
  let model = login_log_dao::find_by_id(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
pub async fn set_id_by_lbl(
  input: LoginLogInput,
) -> Result<LoginLogInput> {
  
  let input = login_log_dao::set_id_by_lbl(
    input,
  ).await?;
  
  Ok(input)
}

/// 创建登录日志
#[allow(dead_code)]
pub async fn create(
  input: LoginLogInput,
  options: Option<Options>,
) -> Result<LoginLogId> {
  
  let id = login_log_dao::create(
    input,
    options,
  ).await?;
  
  Ok(id)
}

/// 登录日志根据id修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id(
  id: LoginLogId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = login_log_dao::update_tenant_by_id(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改登录日志
#[allow(dead_code)]
#[allow(unused_mut)]
pub async fn update_by_id(
  id: LoginLogId,
  mut input: LoginLogInput,
  options: Option<Options>,
) -> Result<LoginLogId> {
  
  let res = login_log_dao::update_by_id(
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
  
  let num = login_log_dao::delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取登录日志字段注释
pub async fn get_field_comments(
  options: Option<Options>,
) -> Result<LoginLogFieldComment> {
  
  let comments = login_log_dao::get_field_comments(
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
  
  let num = login_log_dao::revert_by_ids(
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
  
  let num = login_log_dao::force_delete_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(num)
}
