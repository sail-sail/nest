
#![allow(clippy::clone_on_copy)]
#![allow(clippy::redundant_clone)]
#![allow(clippy::collapsible_if)]

#[allow(unused_imports)]
use serde::{Serialize, Deserialize};
#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use std::collections::HashSet;

#[allow(unused_imports)]
use smol_str::SmolStr;

use color_eyre::eyre::{Result, eyre};
#[allow(unused_imports)]
use tracing::{info, error};
#[allow(unused_imports)]
use crate::common::util::string::sql_like;
#[allow(unused_imports)]
use crate::common::gql::model::SortOrderEnum;

#[allow(unused_imports)]
use crate::common::context::{
  get_auth_id,
  get_auth_tenant_id,
  execute,
  query,
  query_one,
  get_now,
  get_req_id,
  QueryArgs,
  Options,
  FIND_ALL_IDS_LIMIT,
  MAX_SAFE_INTEGER,
  get_find_all_result_limit,
  CountModel,
  UniqueType,
  get_short_uuid,
  get_order_by_query,
  get_page_query,
  del_caches,
  get_is_debug,
  get_is_silent_mode,
  get_is_creating,
};
use crate::common::exceptions::service_exception::ServiceException;

use crate::common::gql::model::{
  PageInput,
  SortInput,
};

use crate::common::dict_detail::dict_detail_dao::get_dict;

use super::server_log_model::*;

#[allow(unused_variables)]
async fn get_where_query(
  args: &mut QueryArgs,
  search: Option<&ServerLogSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let mut where_query = String::with_capacity(80 * 7 * 2);
  
  where_query.push_str(" 1=1");
  {
    let id = match search {
      Some(item) => item.id.as_ref(),
      None => None,
    };
    if let Some(id) = id {
      where_query.push_str(" and t.id=?");
      args.push(id.into());
    }
  }
  {
    let ids: Option<Vec<ServerLogId>> = match search {
      Some(item) => item.ids.clone(),
      None => None,
    };
    if let Some(ids) = ids {
      let arg = {
        if ids.is_empty() {
          SmolStr::new("null")
        } else {
          let mut items = Vec::with_capacity(ids.len());
          for id in ids {
            args.push(id.into());
            items.push("?");
          }
          SmolStr::new(items.join(","))
        }
      };
      where_query.push_str(" and t.id in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  // 日志日期
  {
    let mut log_date = match search {
      Some(item) => item.log_date.unwrap_or_default(),
      None => Default::default(),
    };
    let log_date_gt = log_date[0].take();
    let log_date_lt = log_date[1].take();
    if let Some(log_date_gt) = log_date_gt {
      where_query.push_str(" and t.log_date >= ?");
      args.push(log_date_gt.into());
    }
    if let Some(log_date_lt) = log_date_lt {
      where_query.push_str(" and t.log_date <= ?");
      args.push(log_date_lt.into());
    }
  }
  // 日志时间
  {
    let mut log_time = match search {
      Some(item) => item.log_time.unwrap_or_default(),
      None => Default::default(),
    };
    let log_time_gt = log_time[0].take();
    let log_time_lt = log_time[1].take();
    if let Some(log_time_gt) = log_time_gt {
      where_query.push_str(" and t.log_time >= ?");
      args.push(log_time_gt.into());
    }
    if let Some(log_time_lt) = log_time_lt {
      where_query.push_str(" and t.log_time <= ?");
      args.push(log_time_lt.into());
    }
  }
  // 日志级别
  {
    let level: Option<Vec<ServerLogLevel>> = match search {
      Some(item) => item.level.clone(),
      None => None,
    };
    if let Some(level) = level {
      let arg = {
        if level.is_empty() {
          SmolStr::new("null")
        } else {
          let mut items = Vec::with_capacity(level.len());
          for item in level {
            args.push(item.into());
            items.push("?");
          }
          SmolStr::new(items.join(","))
        }
      };
      where_query.push_str(" and t.level in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  // 模块
  {
    let module = match search {
      Some(item) => item.module.clone(),
      None => None,
    };
    if let Some(module) = module {
      where_query.push_str(" and t.module=?");
      args.push(module.into());
    }
    let module_like = match search {
      Some(item) => item.module_like.clone(),
      None => None,
    };
    if let Some(module_like) = module_like && !module_like.is_empty() {
      where_query.push_str(" and t.module like ?");
      args.push(format!("%{}%", sql_like(&module_like)).into());
    }
  }
  // 请求ID
  {
    let req_id = match search {
      Some(item) => item.req_id.clone(),
      None => None,
    };
    if let Some(req_id) = req_id {
      where_query.push_str(" and t.req_id=?");
      args.push(req_id.into());
    }
    let req_id_like = match search {
      Some(item) => item.req_id_like.clone(),
      None => None,
    };
    if let Some(req_id_like) = req_id_like && !req_id_like.is_empty() {
      where_query.push_str(" and t.req_id like ?");
      args.push(format!("%{}%", sql_like(&req_id_like)).into());
    }
  }
  // 日志内容
  {
    let content = match search {
      Some(item) => item.content.clone(),
      None => None,
    };
    if let Some(content) = content {
      where_query.push_str(" and t.content=?");
      args.push(content.into());
    }
    let content_like = match search {
      Some(item) => item.content_like.clone(),
      None => None,
    };
    if let Some(content_like) = content_like && !content_like.is_empty() {
      where_query.push_str(" and t.content like ?");
      args.push(format!("%{}%", sql_like(&content_like)).into());
    }
  }
  Ok(where_query)
}

#[allow(unused_variables)]
async fn get_from_query(
  args: &mut QueryArgs,
  search: Option<&ServerLogSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let from_query = r#"base_server_log t"#.to_owned();
  Ok(from_query)
}

// MARK: find_all_server_log
/// 根据搜索条件和分页查找系统日志列表
#[allow(unused_mut, unused_variables)]
pub async fn find_all_server_log(
  search: Option<ServerLogSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<ServerLogModel>> {
  
  let table = get_table_name_server_log();
  let method = "find_all_server_log";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    if let Some(search) = &search {
      msg += &format!(" search: {search:?}");
    }
    if let Some(page) = &page {
      msg += &format!(" page: {page:?}");
    }
    if let Some(sort) = &sort {
      msg += &format!(" sort: {sort:?}");
    }
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let ids_limit = options
    .as_ref()
    .and_then(|x| x.get_ids_limit())
    .unwrap_or(FIND_ALL_IDS_LIMIT);
  
  if let Some(search) = &search {
    if let Some(id) = &search.id && id.is_empty() {
      return Ok(vec![]);
    }
    if let Some(ids) = &search.ids && ids.is_empty() {
      return Ok(vec![]);
    }
  }
  // 日志级别
  if let Some(search) = &search && let Some(level) = &search.level {
    let len = level.len();
    if len == 0 {
      return Ok(vec![]);
    }
    if len > ids_limit {
      return Err(eyre!("search.level.length > {ids_limit}"));
    }
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let mut args = QueryArgs::new();
  
  let from_query = get_from_query(&mut args, search.as_ref(), options.as_ref()).await?;
  let where_query = get_where_query(&mut args, search.as_ref(), options.as_ref()).await?;
  
  let mut sort = sort.unwrap_or_default();
  
  if !sort.iter().any(|item| item.prop == "log_time") {
    sort.push(SortInput {
      prop: "log_time".into(),
      order: SortOrderEnum::Desc,
    });
  }
  
  let order_by_query = get_order_by_query(Some(sort));
  let is_result_limit = page.as_ref()
    .and_then(|item| item.is_result_limit)
    .unwrap_or(true);
  let page_query = get_page_query(page);
  
  let sql = format!(r#"select f.* from (select t.*
  from {from_query} where {where_query} group by t.id{order_by_query}) f {page_query}"#);
  
  let args = args.into();
  
  let mut res: Vec<ServerLogModel> = query(
    sql,
    args,
    options,
  ).await?;
  
  let len = res.len();
  let result_limit_num = get_find_all_result_limit();
  
  if is_result_limit && len > result_limit_num {
    return Err(eyre!(
      ServiceException {
        message: format!("{table}.{method}: result length {len} > {result_limit_num}").into(),
        trace: true,
        ..Default::default()
      },
    ));
  }
  
  let dict_vec = get_dict(&[
    "server_log_level",
  ]).await?;
  let [
    level_dict,
  ]: [Vec<_>; 1] = dict_vec
    .try_into()
    .map_err(|err| eyre!("{:#?}", err))?;
  
  #[allow(unused_variables)]
  for model in &mut res {
    
    // 日志级别
    model.level_lbl = {
      level_dict
        .iter()
        .find(|item| item.val == model.level.as_str())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.level.clone().into())
    };
    
  }
  
  Ok(res)
}

// MARK: find_count_server_log
/// 根据条件查找系统日志总数
pub async fn find_count_server_log(
  search: Option<ServerLogSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_server_log();
  let method = "find_count_server_log";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    if let Some(search) = &search {
      msg += &format!(" search: {search:?}");
    }
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  if let Some(search) = &search {
    if search.id.is_some() && search.id.as_ref().unwrap().is_empty() {
      return Ok(0);
    }
    if search.ids.is_some() && search.ids.as_ref().unwrap().is_empty() {
      return Ok(0);
    }
  }
  // 日志级别
  if let Some(search) = &search && search.level.is_some() {
    let len = search.level.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.level.length > {ids_limit}"));
    }
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let mut args = QueryArgs::new();
  
  let from_query = get_from_query(&mut args, search.as_ref(), options.as_ref()).await?;
  let where_query = get_where_query(&mut args, search.as_ref(), options.as_ref()).await?;
  
  let sql = format!(r#"select count(1) total from(select 1 from {from_query} where {where_query} group by t.id) t"#);
  
  let args = args.into();
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let res: Option<CountModel> = query_one(
    sql,
    args,
    options,
  ).await?;
  
  let total = res
    .map(|item| item.total)
    .unwrap_or_default();
  
  if total > MAX_SAFE_INTEGER {
    return Err(eyre!("total > MAX_SAFE_INTEGER"));
  }
  
  Ok(total)
}

// MARK: get_field_comments_server_log
/// 获取系统日志字段注释
#[allow(unused_mut)]
pub async fn get_field_comments_server_log(
  _options: Option<Options>,
) -> Result<ServerLogFieldComment> {
  
  let mut field_comments = ServerLogFieldComment {
    id: "ID".into(),
    log_date: "日志日期".into(),
    log_date_lbl: "日志日期".into(),
    log_time: "日志时间".into(),
    log_time_lbl: "日志时间".into(),
    level: "日志级别".into(),
    level_lbl: "日志级别".into(),
    module: "模块".into(),
    req_id: "请求ID".into(),
    content: "日志内容".into(),
  };
  Ok(field_comments)
}

// MARK: find_one_ok_server_log
/// 根据条件查找第一个系统日志, 如果不存在则抛错
#[allow(dead_code)]
pub async fn find_one_ok_server_log(
  search: Option<ServerLogSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<ServerLogModel> {
  
  let table = get_table_name_server_log();
  let method = "find_one_ok_server_log";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    if let Some(search) = &search {
      msg += &format!(" search: {search:?}");
    }
    if let Some(sort) = &sort {
      msg += &format!(" sort: {sort:?}");
    }
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let server_log_model = find_one_server_log(
    search,
    sort,
    options,
  ).await?;
  
  let Some(server_log_model) = server_log_model else {
    let err_msg = "此 系统日志 已被删除";
    return Err(eyre!(err_msg));
  };
  
  Ok(server_log_model)
}

// MARK: find_one_server_log
/// 根据条件查找第一个系统日志
#[allow(dead_code)]
pub async fn find_one_server_log(
  search: Option<ServerLogSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<ServerLogModel>> {
  
  let table = get_table_name_server_log();
  let method = "find_one_server_log";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    if let Some(search) = &search {
      msg += &format!(" search: {search:?}");
    }
    if let Some(sort) = &sort {
      msg += &format!(" sort: {sort:?}");
    }
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  if let Some(search) = &search && search.id.is_some() && search.id.as_ref().unwrap().is_empty() {
    return Ok(None);
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let page = Some(PageInput {
    pg_offset: Some(0),
    pg_size: Some(1),
    is_result_limit: Some(true),
  });
  
  let res = find_all_server_log(
    search,
    page,
    sort,
    options,
  ).await?;
  
  let model: Option<ServerLogModel> = res.into_iter().next();
  
  Ok(model)
}

// MARK: find_by_id_ok_server_log
/// 根据 id 查找系统日志, 如果不存在则抛错
#[allow(dead_code)]
pub async fn find_by_id_ok_server_log(
  id: ServerLogId,
  options: Option<Options>,
) -> Result<ServerLogModel> {
  
  let table = get_table_name_server_log();
  let method = "find_by_id_ok_server_log";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" id: {id:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let server_log_model = find_by_id_server_log(
    id,
    options,
  ).await?;
  
  let Some(server_log_model) = server_log_model else {
    let err_msg = SmolStr::new("此 系统日志 已被删除");
    error!(
      "{req_id} {err_msg} id: {id:?}",
      req_id = get_req_id(),
    );
    return Err(eyre!(ServiceException {
      message: err_msg,
      trace: true,
      ..Default::default()
    }));
  };
  
  Ok(server_log_model)
}

// MARK: find_by_id_server_log
/// 根据 id 查找系统日志
pub async fn find_by_id_server_log(
  id: ServerLogId,
  options: Option<Options>,
) -> Result<Option<ServerLogModel>> {
  
  let table = get_table_name_server_log();
  let method = "find_by_id_server_log";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" id: {id:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  if id.is_empty() {
    return Ok(None);
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let search = ServerLogSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let server_log_model = find_one_server_log(
    search,
    None,
    options,
  ).await?;
  
  Ok(server_log_model)
}

// MARK: find_by_ids_ok_server_log
/// 根据 ids 查找系统日志, 出现查询不到的 id 则报错
#[allow(dead_code)]
pub async fn find_by_ids_ok_server_log(
  ids: Vec<ServerLogId>,
  options: Option<Options>,
) -> Result<Vec<ServerLogModel>> {
  
  let table = get_table_name_server_log();
  let method = "find_by_ids_ok_server_log";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" ids: {ids:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  if ids.is_empty() {
    return Ok(vec![]);
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let len = ids.len();
  
  if len > FIND_ALL_IDS_LIMIT {
    return Err(eyre!(
      ServiceException {
        message: "ids.length > FIND_ALL_IDS_LIMIT".into(),
        trace: true,
        ..Default::default()
      },
    ));
  }
  
  let server_log_models = find_by_ids_server_log(
    ids.clone(),
    options,
  ).await?;
  
  if server_log_models.len() != len {
    let err_msg = SmolStr::new("此 系统日志 已被删除");
    return Err(eyre!(err_msg));
  }
  
  let server_log_models = ids
    .into_iter()
    .map(|id| {
      let model = server_log_models
        .iter()
        .find(|item| item.id == id);
      if let Some(model) = model {
        return Ok(model.clone());
      }
      let err_msg = SmolStr::new("此 系统日志 已经被删除");
      Err(eyre!(err_msg))
    })
    .collect::<Result<Vec<ServerLogModel>>>()?;
  
  Ok(server_log_models)
}

// MARK: find_by_ids_server_log
/// 根据 ids 查找系统日志
#[allow(dead_code)]
pub async fn find_by_ids_server_log(
  ids: Vec<ServerLogId>,
  options: Option<Options>,
) -> Result<Vec<ServerLogModel>> {
  
  let table = get_table_name_server_log();
  let method = "find_by_ids_server_log";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" ids: {ids:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  if ids.is_empty() {
    return Ok(vec![]);
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let len = ids.len();
  
  if len > FIND_ALL_IDS_LIMIT {
    return Err(eyre!(
      ServiceException {
        message: "ids.length > FIND_ALL_IDS_LIMIT".into(),
        trace: true,
        ..Default::default()
      },
    ));
  }
  
  let search = ServerLogSearch {
    ids: Some(ids.clone()),
    ..Default::default()
  }.into();
  
  let server_log_models = find_all_server_log(
    search,
    None,
    None,
    options,
  ).await?;
  
  let server_log_models = ids
    .into_iter()
    .filter_map(|id| {
      server_log_models
        .iter()
        .find(|item| item.id == id)
        .cloned()
    })
    .collect::<Vec<ServerLogModel>>();
  
  Ok(server_log_models)
}

// MARK: exists_server_log
/// 根据搜索条件判断系统日志是否存在
#[allow(dead_code)]
pub async fn exists_server_log(
  search: Option<ServerLogSearch>,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = get_table_name_server_log();
  let method = "exists_server_log";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    if let Some(search) = &search {
      msg += &format!(" search: {search:?}");
    }
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  if let Some(search) = &search {
    if search.id.is_some() && search.id.as_ref().unwrap().is_empty() {
      return Ok(false);
    }
    if search.ids.is_some() && search.ids.as_ref().unwrap().is_empty() {
      return Ok(false);
    }
  }
  // 日志级别
  if let Some(search) = &search && search.level.is_some() {
    let len = search.level.as_ref().unwrap().len();
    if len == 0 {
      return Ok(false);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.level.length > {ids_limit}"));
    }
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let mut args = QueryArgs::new();
  
  let from_query = get_from_query(&mut args, search.as_ref(), options.as_ref()).await?;
  let where_query = get_where_query(&mut args, search.as_ref(), options.as_ref()).await?;
  
  let sql = format!(r#"select exists(select 1 from {from_query} where {where_query} group by t.id)"#);
  
  let args = args.into();
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let res: Option<(bool,)> = query_one(
    sql,
    args,
    options,
  ).await?;
  
  Ok(res
    .map(|item| item.0)
    .unwrap_or_default())
}

// MARK: exists_by_id_server_log
/// 根据 id 判断系统日志是否存在
#[allow(dead_code)]
pub async fn exists_by_id_server_log(
  id: ServerLogId,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = get_table_name_server_log();
  let method = "exists_by_id_server_log";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" id: {id:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let search = ServerLogSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let exists = exists_server_log(
    search,
    options,
  ).await?;
  
  Ok(exists)
}

// MARK: find_by_unique_server_log
/// 通过唯一约束获得数据列表
#[allow(unused_variables)]
pub async fn find_by_unique_server_log(
  search: ServerLogSearch,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<ServerLogModel>> {
  
  let table = get_table_name_server_log();
  let method = "find_by_unique_server_log";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" search: {search:?}");
    if let Some(sort) = &sort {
      msg += &format!(" sort: {sort:?}");
    }
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  
  if let Some(id) = search.id {
    let model = find_by_id_server_log(
      id,
      options,
    ).await?;
    return Ok(model.map_or_else(Vec::new, |m| vec![m]));
  }
  
  Ok(vec![])
}

/// 根据唯一约束对比对象是否相等
#[allow(dead_code, unused_variables)]
pub fn equals_by_unique(
  input: &ServerLogInput,
  model: &ServerLogModel,
  options: Option<&Options>,
) -> bool {
  if input.id.as_ref().is_some() {
    return input.id.as_ref().unwrap() == &model.id;
  }
  
  let is_silent_mode = get_is_silent_mode(options);
  false
}

// MARK: check_by_unique_server_log
/// 通过唯一约束检查数据是否已经存在
#[allow(unused_variables)]
pub async fn check_by_unique_server_log(
  input: ServerLogInput,
  model: ServerLogModel,
  options: Option<Options>,
) -> Result<Option<ServerLogId>> {
  
  let table = get_table_name_server_log();
  let method = "check_by_unique_server_log";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" input: {input:?}");
    msg += &format!(" model: {model:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let is_equals = equals_by_unique(
    &input,
    &model,
    options.as_ref(),
  );
  if !is_equals {
    return Ok(None);
  }
  
  let unique_type = options
    .as_ref()
    .and_then(|item| item.get_unique_type())
    .unwrap_or_default();
  
  if unique_type == UniqueType::Ignore {
    return Ok(None);
  }
  if unique_type == UniqueType::Update {
    let id = update_by_id_server_log(
      model.id,
      input,
      options,
    ).await?;
    return Ok(id.into());
  }
  if unique_type == UniqueType::Throw {
    let err_msg = "系统日志 重复";
    return Err(eyre!(err_msg));
  }
  Ok(None)
}

// MARK: set_id_by_lbl_server_log
/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(unused_variables, dead_code)]
pub async fn set_id_by_lbl_server_log(
  input: ServerLogInput,
) -> Result<ServerLogInput> {
  
  #[allow(unused_mut)]
  let mut input = input;
  
  // 日志日期
  if input.log_date.is_none() && let Some(log_date_lbl) = input.log_date_lbl.as_ref().filter(|s| !s.is_empty()) {
    input.log_date = chrono::NaiveDate::parse_from_str(log_date_lbl, "%Y-%m-%d %H:%M:%S").ok();
    if input.log_date.is_none() {
      input.log_date = chrono::NaiveDate::parse_from_str(log_date_lbl, "%Y-%m-%d").ok();
    }
    if input.log_date.is_none() {
      let field_comments = get_field_comments_server_log(
        None,
      ).await?;
      let column_comment = field_comments.log_date;
      
      let err_msg = "日期格式错误";
      return Err(eyre!("{column_comment} {err_msg}"));
    }
  }
  
  // 日志时间
  if input.log_time.is_none() && let Some(log_time_lbl) = input.log_time_lbl.as_ref().filter(|s| !s.is_empty()) {
    input.log_time = chrono::NaiveDateTime::parse_from_str(log_time_lbl, "%Y-%m-%d %H:%M:%S").ok();
    if input.log_time.is_none() {
      input.log_time = chrono::NaiveDateTime::parse_from_str(log_time_lbl, "%Y-%m-%d").ok();
    }
    if input.log_time.is_none() {
      let field_comments = get_field_comments_server_log(
        None,
      ).await?;
      let column_comment = field_comments.log_time;
      
      let err_msg = "日期格式错误";
      return Err(eyre!("{column_comment} {err_msg}"));
    }
  }
  
  let dict_vec = get_dict(&[
    "server_log_level",
  ]).await?;
  
  // 日志级别
  if input.level.is_none() {
    let level_dict = &dict_vec[0];
    if let Some(level_lbl) = input.level_lbl.clone() {
      input.level = level_dict
        .iter()
        .find(|item| {
          item.lbl == level_lbl
        })
        .map(|item| {
          item.val.parse().unwrap_or_default()
        });
    }
  }
  
  // 日志级别
  if
    input.level_lbl.is_some() && !input.level_lbl.as_ref().unwrap().is_empty()
    && input.level.is_none()
  {
    let level_dict = &dict_vec[0];
    let dict_model = level_dict.iter().find(|item| {
      item.lbl == input.level_lbl.clone().unwrap_or_default()
    });
    let val = dict_model.map(|item| SmolStr::new(&item.val));
    if let Some(val) = val {
      input.level = val.parse::<ServerLogLevel>()?.into();
    }
  } else if
    (input.level_lbl.is_none() || input.level_lbl.as_ref().unwrap().is_empty())
    && input.level.is_some()
  {
    let level_dict = &dict_vec[0];
    let dict_model = level_dict.iter().find(|item| {
      item.val == input.level.unwrap_or_default().to_string()
    });
    let lbl = dict_model.map(|item| SmolStr::new(&item.lbl));
    input.level_lbl = lbl;
  }
  
  Ok(input)
}

// MARK: creates_return_server_log
/// 批量创建系统日志并返回
#[allow(dead_code)]
pub async fn creates_return_server_log(
  inputs: Vec<ServerLogInput>,
  options: Option<Options>,
) -> Result<Vec<ServerLogModel>> {
  
  let table = get_table_name_server_log();
  let method = "creates_return_server_log";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" inputs: {inputs:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let ids = _creates(
    inputs.clone(),
    options,
  ).await?;
  
  let models_server_log = find_by_ids_server_log(
    ids,
    options,
  ).await?;
  
  Ok(models_server_log)
}

// MARK: creates_server_log
/// 批量创建系统日志
pub async fn creates_server_log(
  inputs: Vec<ServerLogInput>,
  options: Option<Options>,
) -> Result<Vec<ServerLogId>> {
  
  let table = get_table_name_server_log();
  let method = "creates_server_log";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" inputs: {inputs:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let ids = _creates(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 批量创建系统日志
#[allow(unused_variables, clippy::redundant_locals)]
async fn _creates(
  inputs: Vec<ServerLogInput>,
  options: Option<Options>,
) -> Result<Vec<ServerLogId>> {
  
  let table = get_table_name_server_log();
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  
  let unique_type = options.as_ref()
    .and_then(|item|
      item.get_unique_type()
    )
    .unwrap_or_default();
  
  let mut ids2: Vec<ServerLogId> = vec![];
  let mut inputs2: Vec<ServerLogInput> = vec![];
  
  for input in inputs {
  
    if input.id.is_some() {
      return Err(eyre!("Can not set id when create in dao: {table}"));
    }
    
    let old_models = find_by_unique_server_log(
      input.clone().into(),
      None,
      options,
    ).await?;
    
    if !old_models.is_empty() {
      let mut id: Option<ServerLogId> = None;
      
      for old_model in old_models {
        let options = Options::from(options)
          .set_unique_type(unique_type);
        
        id = check_by_unique_server_log(
          input.clone(),
          old_model,
          Some(options),
        ).await?;
        
        if id.is_some() {
          break;
        }
      }
      if let Some(id) = id {
        ids2.push(id);
        continue;
      }
      inputs2.push(input);
    } else {
      inputs2.push(input);
    }
    
  }
  
  if inputs2.is_empty() {
    return Ok(ids2);
  }
    
  let mut args = QueryArgs::new();
  let mut sql_fields = String::with_capacity(80 * 7 + 20);
  
  sql_fields += "id";
  // 日志日期
  sql_fields += ",log_date";
  // 日志时间
  sql_fields += ",log_time";
  // 日志级别
  sql_fields += ",level";
  // 模块
  sql_fields += ",module";
  // 请求ID
  sql_fields += ",req_id";
  // 日志内容
  sql_fields += ",content";
  
  let inputs2_len = inputs2.len();
  let mut sql_values = String::with_capacity((2 * 7 + 3) * inputs2_len);
  let mut inputs2_ids = vec![];
  
  for (i, input) in inputs2
    .clone()
    .into_iter()
    .enumerate()
  {
    
    let id: ServerLogId = get_short_uuid().into();
    ids2.push(id);
    
    inputs2_ids.push(id);
    
    sql_values += "(?";
    args.push(id.into());
    // 日志日期
    if let Some(log_date) = input.log_date {
      sql_values += ",?";
      args.push(log_date.into());
    } else {
      sql_values += ",default";
    }
    // 日志时间
    if let Some(log_time) = input.log_time {
      sql_values += ",?";
      args.push(log_time.into());
    } else {
      sql_values += ",default";
    }
    // 日志级别
    if let Some(level) = input.level {
      sql_values += ",?";
      args.push(level.into());
    } else {
      sql_values += ",default";
    }
    // 模块
    if let Some(module) = input.module {
      sql_values += ",?";
      args.push(module.into());
    } else {
      sql_values += ",default";
    }
    // 请求ID
    if let Some(req_id) = input.req_id {
      sql_values += ",?";
      args.push(req_id.into());
    } else {
      sql_values += ",default";
    }
    // 日志内容
    if let Some(content) = input.content {
      sql_values += ",?";
      args.push(content.into());
    } else {
      sql_values += ",default";
    }
    
    sql_values.push(')');
    if i < inputs2_len - 1 {
      sql_values.push(',');
    }
    
  }
  
  let sql = format!("insert into {table} ({sql_fields}) values {sql_values}");
  
  let args: Vec<_> = args.into();
  
  let affected_rows = execute(
    sql,
    args,
    options,
  ).await?;
  
  if affected_rows != inputs2_len as u64 {
    return Err(eyre!("affectedRows: {affected_rows} != {inputs2_len}"));
  }
  
  Ok(ids2)
}

// MARK: create_return_server_log
/// 创建系统日志并返回
#[allow(dead_code)]
pub async fn create_return_server_log(
  #[allow(unused_mut)]
  mut input: ServerLogInput,
  options: Option<Options>,
) -> Result<ServerLogModel> {
  
  let id = create_server_log(
    input.clone(),
    options,
  ).await?;
  
  let model_server_log = find_by_id_server_log(
    id,
    options,
  ).await?;
  
  let model_server_log = match model_server_log {
    Some(model) => model,
    None => {
      let err_msg = "create_return_server_log: model_server_log.is_none()";
      return Err(eyre!(
        ServiceException {
          message: err_msg.into(),
          trace: true,
          ..Default::default()
        },
      ));
    }
  };
  
  Ok(model_server_log)
}

// MARK: create_server_log
/// 创建系统日志
#[allow(dead_code)]
pub async fn create_server_log(
  #[allow(unused_mut)]
  mut input: ServerLogInput,
  options: Option<Options>,
) -> Result<ServerLogId> {
  
  let table = get_table_name_server_log();
  let method = "create_server_log";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" input: {input:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let ids = _creates(
    vec![input],
    options,
  ).await?;
  
  if ids.is_empty() {
    return Err(eyre!("_creates: Create failed in dao: {table}"));
  }
  let id = ids[0].clone();
  
  Ok(id)
}

// MARK: update_by_id_server_log
/// 根据 id 修改系统日志
#[allow(unused_mut)]
#[allow(unused_variables)]
pub async fn update_by_id_server_log(
  id: ServerLogId,
  mut input: ServerLogInput,
  options: Option<Options>,
) -> Result<ServerLogId> {
  
  let table = get_table_name_server_log();
  let method = "update_by_id_server_log";
  
  let is_debug = get_is_debug(options.as_ref());
  let is_creating = get_is_creating(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" id: {id:?}");
    msg += &format!(" input: {input:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let old_model = find_by_id_server_log(
    id,
    options,
  ).await?;
  
  let old_model = match old_model {
    Some(model) => model,
    None => {
      let err_msg = "编辑失败, 此 系统日志 已被删除";
      return Err(eyre!(err_msg));
    }
  };
  
  {
    let mut input = input.clone();
    input.id = None;
    
    let models = find_by_unique_server_log(
      input.into(),
      None,
      options,
    ).await?;
    
    let models = models.into_iter()
      .filter(|item| 
        item.id != id
      )
      .collect::<Vec<ServerLogModel>>();
    
    if !models.is_empty() {
      let unique_type = options
        .as_ref()
        .and_then(|item| item.get_unique_type())
        .unwrap_or(UniqueType::Throw);
      if unique_type == UniqueType::Throw {
        let err_msg = "系统日志 重复";
        return Err(eyre!(err_msg));
      } else if unique_type == UniqueType::Ignore {
        return Ok(id);
      }
    }
  }
  
  let mut args = QueryArgs::new();
  
  let mut sql_fields = String::with_capacity(80 * 7 + 20);
  
  let mut field_num: usize = 0;
  // 日志日期
  if let Some(log_date) = input.log_date {
    field_num += 1;
    sql_fields += "log_date=?,";
    args.push(log_date.into());
  }
  // 日志时间
  if let Some(log_time) = input.log_time {
    field_num += 1;
    sql_fields += "log_time=?,";
    args.push(log_time.into());
  }
  // 日志级别
  if let Some(level) = input.level {
    field_num += 1;
    sql_fields += "level=?,";
    args.push(level.into());
  }
  // 模块
  if let Some(module) = input.module.clone() {
    field_num += 1;
    sql_fields += "module=?,";
    args.push(module.into());
  }
  // 请求ID
  if let Some(req_id) = input.req_id.clone() {
    field_num += 1;
    sql_fields += "req_id=?,";
    args.push(req_id.into());
  }
  // 日志内容
  if let Some(content) = input.content.clone() {
    field_num += 1;
    sql_fields += "content=?,";
    args.push(content.into());
  }
  
  if field_num > 0 {
    
    if sql_fields.ends_with(',') {
      sql_fields.pop();
    }
    
    let sql_where = "id=?";
    args.push(id.into());
    
    let sql = format!("update {table} set {sql_fields} where {sql_where} limit 1");
    
    let args: Vec<_> = args.into();
    
    execute(
      sql,
      args,
      options,
    ).await?;
    
  }
  
  Ok(id)
}

// MARK: update_by_id_return_server_log
/// 根据 id 更新系统日志, 并返回更新后的数据
#[allow(dead_code)]
pub async fn update_by_id_return_server_log(
  id: ServerLogId,
  input: ServerLogInput,
  options: Option<Options>,
) -> Result<ServerLogModel> {
  
  update_by_id_server_log(
    id,
    input,
    options,
  ).await?;
  
  let model = find_by_id_server_log(
    id,
    options,
  ).await?;
  
  match model {
    Some(model) => Ok(model),
    None => Err(eyre!(
      "系统日志 update_by_id_return_server_log id: {id}",
    )),
  }
}

/// 获取需要清空缓存的表名
#[allow(dead_code)]
fn get_cache_tables() -> Vec<&'static str> {
  let table = get_table_name_server_log();
  vec![
    table,
  ]
}

// MARK: del_cache_server_log
/// 清空缓存
#[allow(dead_code)]
pub async fn del_cache_server_log() -> Result<()> {
  
  let cache_key1s = get_cache_tables();
  
  let cache_key1s = cache_key1s
    .into_iter()
    .map(|x|
      SmolStr::new(format!("dao.sql.{x}"))
    )
    .collect::<Vec<SmolStr>>();
  
  let cache_key1s_str = cache_key1s
    .iter()
    .map(|item| item.as_str())
    .collect::<Vec<&str>>();
  
  del_caches(
    cache_key1s_str.as_slice(),
  ).await?;
  
  Ok(())
}

// MARK: delete_by_ids_server_log
/// 根据 ids 删除系统日志
#[allow(unused_variables)]
pub async fn delete_by_ids_server_log(
  ids: Vec<ServerLogId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_server_log();
  let method = "delete_by_ids_server_log";
  
  let is_debug = get_is_debug(options.as_ref());
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  let is_creating = get_is_creating(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" ids: {ids:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  if ids.is_empty() {
    return Ok(0);
  }
  
  if ids.len() as u64 > MAX_SAFE_INTEGER {
    return Err(eyre!("ids.len(): {} > MAX_SAFE_INTEGER", ids.len()));
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let mut num = 0;
  for id in ids.clone() {
    
    let old_model = find_by_id_server_log(
      id,
      options,
    ).await?;
    
    let old_model = match old_model {
      Some(model) => model,
      None => continue,
    };
    
    if !is_silent_mode {
      info!(
        "{} {}.{}: {}",
        get_req_id(),
        table,
        method,
        serde_json::to_string(&old_model)?,
      );
    }
    
    let mut args = QueryArgs::new();
    
    let sql = format!("delete from {table} where id=? limit 1");
    
    args.push(id.into());
    
    let args: Vec<_> = args.into();
    
    num += execute(
      sql,
      args,
      options,
    ).await?;
  }
  
  if num > MAX_SAFE_INTEGER {
    return Err(eyre!("num: {} > MAX_SAFE_INTEGER", num));
  }
  
  Ok(num)
}

// MARK: validate_option_server_log
/// 校验系统日志是否存在
#[allow(dead_code)]
pub async fn validate_option_server_log(
  model: Option<ServerLogModel>,
) -> Result<ServerLogModel> {
  
  let model = match model {
    Some(model) => model,
    None => {
      let err_msg = SmolStr::new("系统日志不存在");
      error!(
        "{req_id} {err_msg}",
        req_id = get_req_id(),
      );
      return Err(eyre!(
        ServiceException {
          message: err_msg,
          trace: true,
          ..Default::default()
        },
      ));
    },
  };
  
  Ok(model)
}
