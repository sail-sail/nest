
#![allow(clippy::clone_on_copy)]
#![allow(clippy::redundant_clone)]

#[allow(unused_imports)]
use std::time::Instant;

use color_eyre::eyre::Result;
use tracing::info;

use crate::common::context::{
  get_req_id,
  Options,
};

#[allow(unused_imports)]
use smol_str::SmolStr;

use crate::common::gql::model::{PageInput, SortInput};
#[allow(unused_imports)]
use crate::common::permit::permit_service::use_permit;

use super::server_log_model::*;
use super::server_log_service;

/// 根据搜索条件和分页查找系统日志列表
#[function_name::named]
pub async fn find_all_server_log(
  search: Option<ServerLogSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<ServerLogModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} page: {page:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_server_log(sort.as_deref())?;
  
  let models = server_log_service::find_all_server_log(
    search,
    page,
    sort,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据条件查找系统日志总数
#[function_name::named]
pub async fn find_count_server_log(
  search: Option<ServerLogSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  info!(
    "{req_id} {function_name}: search: {search:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let num = server_log_service::find_count_server_log(
    search,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据条件查找第一个系统日志
#[function_name::named]
pub async fn find_one_server_log(
  search: Option<ServerLogSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<ServerLogModel>> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_server_log(sort.as_deref())?;
  
  let model = server_log_service::find_one_server_log(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据条件查找第一个系统日志, 如果不存在则抛错
#[function_name::named]
pub async fn find_one_ok_server_log(
  search: Option<ServerLogSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<ServerLogModel> {
  
  info!(
    "{req_id} {function_name}: search: {search:?} sort: {sort:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  check_sort_server_log(sort.as_deref())?;
  
  let model = server_log_service::find_one_ok_server_log(
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找系统日志
#[function_name::named]
pub async fn find_by_id_server_log(
  id: ServerLogId,
  options: Option<Options>,
) -> Result<Option<ServerLogModel>> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = server_log_service::find_by_id_server_log(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 id 查找系统日志, 如果不存在则抛错
#[function_name::named]
pub async fn find_by_id_ok_server_log(
  id: ServerLogId,
  options: Option<Options>,
) -> Result<ServerLogModel> {
  
  info!(
    "{req_id} {function_name}: id: {id:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let model = server_log_service::find_by_id_ok_server_log(
    id,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据 ids 查找系统日志
#[function_name::named]
pub async fn find_by_ids_server_log(
  ids: Vec<ServerLogId>,
  options: Option<Options>,
) -> Result<Vec<ServerLogModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = server_log_service::find_by_ids_server_log(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 根据 ids 查找系统日志, 出现查询不到的 id 则报错
#[function_name::named]
pub async fn find_by_ids_ok_server_log(
  ids: Vec<ServerLogId>,
  options: Option<Options>,
) -> Result<Vec<ServerLogModel>> {
  
  info!(
    "{req_id} {function_name}: ids: {ids:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let models = server_log_service::find_by_ids_ok_server_log(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

/// 获取系统日志字段注释
#[function_name::named]
pub async fn get_field_comments_server_log(
  options: Option<Options>,
) -> Result<ServerLogFieldComment> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let comments = server_log_service::get_field_comments_server_log(
    options,
  ).await?;
  
  Ok(comments)
}

/// 获取可用的日志日期列表
#[function_name::named]
pub async fn get_server_log_dates() -> Result<Vec<chrono::NaiveDate>> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let dates = server_log_service::get_server_log_dates().await?;
  
  Ok(dates)
}
