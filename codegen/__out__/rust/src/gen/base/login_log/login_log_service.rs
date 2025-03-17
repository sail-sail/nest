#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use color_eyre::eyre::{Result,eyre};

#[allow(unused_imports)]
use crate::common::context::{
  Options,
  get_auth_id_err,
  get_auth_org_id,
};

use crate::common::gql::model::{PageInput, SortInput};

use crate::r#gen::base::tenant::tenant_model::TenantId;

use super::login_log_model::*;
use super::login_log_dao;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut LoginLogSearch,
  options: Option<Options>,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找登录日志列表
pub async fn find_all(
  search: Option<LoginLogSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<LoginLogModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let login_log_models = login_log_dao::find_all(
    Some(search),
    page,
    sort,
    options,
  ).await?;
  
  Ok(login_log_models)
}

/// 根据条件查找登录日志总数
pub async fn find_count(
  search: Option<LoginLogSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let login_log_num = login_log_dao::find_count(
    Some(search),
    options,
  ).await?;
  
  Ok(login_log_num)
}

/// 根据条件查找第一个登录日志
pub async fn find_one(
  search: Option<LoginLogSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<LoginLogModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options.clone(),
  ).await?;
  
  let login_log_model = login_log_dao::find_one(
    Some(search),
    sort,
    options,
  ).await?;
  
  Ok(login_log_model)
}

/// 根据 id 查找登录日志
pub async fn find_by_id(
  login_log_id: LoginLogId,
  options: Option<Options>,
) -> Result<Option<LoginLogModel>> {
  
  let login_log_model = login_log_dao::find_by_id(
    login_log_id,
    options,
  ).await?;
  
  Ok(login_log_model)
}

/// 根据 login_log_ids 查找登录日志
pub async fn find_by_ids(
  login_log_ids: Vec<LoginLogId>,
  options: Option<Options>,
) -> Result<Vec<LoginLogModel>> {
  
  let login_log_models = login_log_dao::find_by_ids(
    login_log_ids,
    options,
  ).await?;
  
  Ok(login_log_models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl(
  login_log_input: LoginLogInput,
) -> Result<LoginLogInput> {
  
  let login_log_input = login_log_dao::set_id_by_lbl(
    login_log_input,
  ).await?;
  
  Ok(login_log_input)
}

/// 创建登录日志
#[allow(dead_code)]
pub async fn creates(
  login_log_inputs: Vec<LoginLogInput>,
  options: Option<Options>,
) -> Result<Vec<LoginLogId>> {
  
  let login_log_ids = login_log_dao::creates(
    login_log_inputs,
    options,
  ).await?;
  
  Ok(login_log_ids)
}

/// 登录日志根据 login_log_id 修改租户id
#[allow(dead_code)]
pub async fn update_tenant_by_id(
  login_log_id: LoginLogId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = login_log_dao::update_tenant_by_id(
    login_log_id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 login_log_id 修改登录日志
#[allow(dead_code, unused_mut)]
pub async fn update_by_id(
  login_log_id: LoginLogId,
  mut login_log_input: LoginLogInput,
  options: Option<Options>,
) -> Result<LoginLogId> {
  
  let login_log_id = login_log_dao::update_by_id(
    login_log_id,
    login_log_input,
    options.clone(),
  ).await?;
  
  Ok(login_log_id)
}

/// 校验登录日志是否存在
#[allow(dead_code)]
pub async fn validate_option(
  login_log_model: Option<LoginLogModel>,
) -> Result<LoginLogModel> {
  
  let login_log_model = login_log_dao::validate_option(login_log_model).await?;
  
  Ok(login_log_model)
}

/// 根据 login_log_ids 删除登录日志
#[allow(dead_code)]
pub async fn delete_by_ids(
  login_log_ids: Vec<LoginLogId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = login_log_dao::delete_by_ids(
    login_log_ids,
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

/// 根据 login_log_ids 还原登录日志
#[allow(dead_code)]
pub async fn revert_by_ids(
  login_log_ids: Vec<LoginLogId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = login_log_dao::revert_by_ids(
    login_log_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 login_log_ids 彻底删除登录日志
#[allow(dead_code)]
pub async fn force_delete_by_ids(
  login_log_ids: Vec<LoginLogId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = login_log_dao::force_delete_by_ids(
    login_log_ids,
    options,
  ).await?;
  
  Ok(num)
}
