
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

use super::server_log_model::*;
use super::server_log_dao;
use super::server_log_dao2;

#[allow(unused_variables)]
async fn set_search_query(
  search: &mut ServerLogSearch,
  options: Option<Options>,
) -> Result<()> {
  Ok(())
}

/// 根据搜索条件和分页查找系统日志列表
pub async fn find_all_server_log(
  search: Option<ServerLogSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<ServerLogModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let server_log_models = server_log_dao2::find_all_server_log(
    Some(search),
    page,
    sort,
    None,
  ).await?;
  
  Ok(server_log_models)
}

/// 根据条件查找系统日志总数
pub async fn find_count_server_log(
  search: Option<ServerLogSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let server_log_num = server_log_dao2::find_count_server_log(
    Some(search),
    None,
  ).await?;
  
  Ok(server_log_num)
}

/// 根据条件查找第一个系统日志
pub async fn find_one_server_log(
  search: Option<ServerLogSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<ServerLogModel>> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let server_log_model = server_log_dao2::find_all_server_log(
    Some(search),
    Some(PageInput {
      pg_offset: Some(0),
      pg_size: Some(1),
      ..Default::default()
    }),
    sort,
    None,
  ).await?.into_iter().next();
  
  Ok(server_log_model)
}

/// 根据条件查找第一个系统日志, 如果不存在则抛错
pub async fn find_one_ok_server_log(
  search: Option<ServerLogSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<ServerLogModel> {
  
  let mut search = search.unwrap_or_default();
  
  set_search_query(
    &mut search,
    options,
  ).await?;
  
  let server_log_model = server_log_dao2::find_all_server_log(
    Some(search),
    Some(PageInput {
      pg_offset: Some(0),
      pg_size: Some(1),
      ..Default::default()
    }),
    sort,
    None,
  ).await?.into_iter().next();
  let Some(server_log_model) = server_log_model else {
    return Err(eyre!("此 系统日志 已被删除"));
  };
  
  Ok(server_log_model)
}

/// 根据 id 查找系统日志
pub async fn find_by_id_server_log(
  server_log_id: ServerLogId,
  _options: Option<Options>,
) -> Result<Option<ServerLogModel>> {
  
  let server_log_model = server_log_dao2::find_by_id_server_log(
    server_log_id,
    None,
  ).await?;
  
  Ok(server_log_model)
}

/// 根据 id 查找系统日志, 如果不存在则抛错
pub async fn find_by_id_ok_server_log(
  server_log_id: ServerLogId,
  _options: Option<Options>,
) -> Result<ServerLogModel> {
  
  let server_log_model = server_log_dao2::find_by_id_server_log(
    server_log_id.clone(),
    None,
  ).await?;
  let Some(server_log_model) = server_log_model else {
    return Err(eyre!("此 系统日志 已被删除"));
  };
  
  Ok(server_log_model)
}

/// 根据 ids 查找系统日志
pub async fn find_by_ids_server_log(
  server_log_ids: Vec<ServerLogId>,
  _options: Option<Options>,
) -> Result<Vec<ServerLogModel>> {
  
  let mut models = Vec::new();
  for id in server_log_ids {
    if let Some(model) = server_log_dao2::find_by_id_server_log(
      id,
      None,
    ).await? {
      models.push(model);
    }
  }
  
  Ok(models)
}

/// 根据 ids 查找系统日志, 出现查询不到的 id 则报错
pub async fn find_by_ids_ok_server_log(
  server_log_ids: Vec<ServerLogId>,
  _options: Option<Options>,
) -> Result<Vec<ServerLogModel>> {
  
  let mut models = Vec::new();
  for id in &server_log_ids {
    let model = server_log_dao2::find_by_id_server_log(
      id.clone(),
      None,
    ).await?;
    let Some(model) = model else {
      return Err(eyre!("系统日志 {} 未找到", id));
    };
    models.push(model);
  }
  
  Ok(models)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(dead_code)]
pub async fn set_id_by_lbl_server_log(
  server_log_input: ServerLogInput,
) -> Result<ServerLogInput> {
  
  let server_log_input = server_log_dao::set_id_by_lbl_server_log(
    server_log_input,
  ).await?;
  
  Ok(server_log_input)
}

/// 创建系统日志
#[allow(dead_code)]
pub async fn creates_server_log(
  server_log_inputs: Vec<ServerLogInput>,
  options: Option<Options>,
) -> Result<Vec<ServerLogId>> {
  
  let server_log_ids = server_log_dao::creates_server_log(
    server_log_inputs,
    options,
  ).await?;
  
  Ok(server_log_ids)
}

/// 根据 server_log_id 修改系统日志
#[allow(dead_code, unused_mut)]
pub async fn update_by_id_server_log(
  server_log_id: ServerLogId,
  mut server_log_input: ServerLogInput,
  options: Option<Options>,
) -> Result<ServerLogId> {
  
  let server_log_id = server_log_dao::update_by_id_server_log(
    server_log_id,
    server_log_input,
    options,
  ).await?;
  
  Ok(server_log_id)
}

/// 校验系统日志是否存在
#[allow(dead_code)]
pub async fn validate_option_server_log(
  server_log_model: Option<ServerLogModel>,
) -> Result<ServerLogModel> {
  
  let server_log_model = server_log_dao::validate_option_server_log(server_log_model).await?;
  
  Ok(server_log_model)
}

/// 根据 server_log_ids 删除系统日志
#[allow(dead_code)]
pub async fn delete_by_ids_server_log(
  server_log_ids: Vec<ServerLogId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let num = server_log_dao::delete_by_ids_server_log(
    server_log_ids,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取系统日志字段注释
pub async fn get_field_comments_server_log(
  options: Option<Options>,
) -> Result<ServerLogFieldComment> {
  
  let comments = server_log_dao::get_field_comments_server_log(
    options,
  ).await?;
  
  Ok(comments)
}

/// 获取可用的日志日期列表
pub async fn get_server_log_dates() -> Result<Vec<chrono::NaiveDate>> {
  let dates = server_log_dao2::get_server_log_dates().await?;
  Ok(dates)
}
