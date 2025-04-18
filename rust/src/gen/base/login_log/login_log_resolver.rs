#[allow(unused_imports)]
use std::time::Instant;

use color_eyre::eyre::Result;
use tracing::info;

use crate::common::context::{
  get_req_id,
  Options,
};

use crate::common::gql::model::{PageInput, SortInput};
#[allow(unused_imports)]
use crate::common::permit::permit_service::use_permit;

use super::login_log_model::*;
use super::login_log_service;

use crate::r#gen::base::tenant::tenant_model::TenantId;

/// 根据搜索条件和分页查找登录日志列表
#[function_name::named]
pub async fn find_all_login_log(
  search: Option<LoginLogSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<LoginLogModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_login_log(sort.as_deref())?;
  
  let models = login_log_service::find_all_login_log(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找登录日志总数
#[function_name::named]
pub async fn find_count_login_log(
  search: Option<LoginLogSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = login_log_service::find_count_login_log(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个登录日志
#[function_name::named]
pub async fn find_one_login_log(
  search: Option<LoginLogSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<LoginLogModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_login_log(sort.as_deref())?;
  
  let model = login_log_service::find_one_login_log(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找登录日志
#[function_name::named]
pub async fn find_by_id_login_log(
  id: LoginLogId,
  options: Option<Options>,
) -> Result<Option<LoginLogModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = login_log_service::find_by_id_login_log(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 ids 查找登录日志
#[function_name::named]
pub async fn find_by_ids_login_log(
  ids: Vec<LoginLogId>,
  options: Option<Options>,
) -> Result<Vec<LoginLogModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = login_log_service::find_by_ids_login_log(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 登录日志根据id修改租户id
#[allow(dead_code)]
#[function_name::named]
pub async fn update_tenant_by_id_login_log(
  id: LoginLogId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: id: {id:?} tenant_id: {tenant_id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = login_log_service::update_tenant_by_id_login_log(
    id,
    tenant_id,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 删除登录日志
#[allow(dead_code)]
#[function_name::named]
pub async fn delete_by_ids_login_log(
  ids: Vec<LoginLogId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_login_log(),
    "delete".to_owned(),
  ).await?;
  
  let num = login_log_service::delete_by_ids_login_log(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取登录日志字段注释
#[function_name::named]
pub async fn get_field_comments_login_log(
  options: Option<Options>,
) -> Result<LoginLogFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = login_log_service::get_field_comments_login_log(
    options,
  ).await?;
  
  Ok(comments)
}

/// 根据 ids 还原登录日志
#[allow(dead_code)]
#[function_name::named]
pub async fn revert_by_ids_login_log(
  ids: Vec<LoginLogId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_login_log(),
    "delete".to_owned(),
  ).await?;
  
  let num = login_log_service::revert_by_ids_login_log(
    ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 ids 彻底删除登录日志
#[allow(dead_code)]
#[function_name::named]
pub async fn force_delete_by_ids_login_log(
  ids: Vec<LoginLogId>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  use_permit(
    get_route_path_login_log(),
    "force_delete".to_owned(),
  ).await?;
  
  let num = login_log_service::force_delete_by_ids_login_log(
    ids,
    options,
  ).await?;
  
  Ok(num)
}
