#[allow(unused_imports)]
use serde::{Serialize, Deserialize};
#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use std::collections::HashSet;

use color_eyre::eyre::{Result,eyre};
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

use crate::src::base::i18n::i18n_dao;

use crate::common::gql::model::{
  PageInput,
  SortInput,
};

use crate::src::base::dict_detail::dict_detail_dao::get_dict;
use crate::src::base::i18n::i18n_dao::get_server_i18n_enable;

use super::cron_job_log_model::*;

use crate::r#gen::base::tenant::tenant_model::TenantId;
use crate::r#gen::cron::cron_job::cron_job_model::CronJobId;
use crate::r#gen::base::usr::usr_model::UsrId;

use crate::r#gen::base::usr::usr_dao::find_by_id as find_by_id_usr;

#[allow(unused_variables)]
async fn get_where_query(
  args: &mut QueryArgs,
  search: Option<&CronJobLogSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let is_deleted = search
    .and_then(|item| item.is_deleted)
    .unwrap_or(0);
  
  let mut where_query = String::with_capacity(80 * 13 * 2);
  
  where_query.push_str(" t.is_deleted=?");
  args.push(is_deleted.into());
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
    let ids: Option<Vec<CronJobLogId>> = match search {
      Some(item) => item.ids.clone(),
      None => None,
    };
    if let Some(ids) = ids {
      let arg = {
        if ids.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(ids.len());
          for id in ids {
            args.push(id.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.id in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let tenant_id = {
      let tenant_id = match search {
        Some(item) => item.tenant_id.clone(),
        None => None,
      };
      let tenant_id = match tenant_id {
        None => get_auth_tenant_id(),
        Some(item) => match item.as_str() {
          "-" => None,
          _ => item.into(),
        },
      };
      tenant_id
    };
    if let Some(tenant_id) = tenant_id {
      where_query.push_str(" and t.tenant_id=?");
      args.push(tenant_id.into());
    }
  }
  // 定时任务
  {
    let cron_job_id: Option<Vec<CronJobId>> = match search {
      Some(item) => item.cron_job_id.clone(),
      None => None,
    };
    if let Some(cron_job_id) = cron_job_id {
      let arg = {
        if cron_job_id.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(cron_job_id.len());
          for item in cron_job_id {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.cron_job_id in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let cron_job_id_is_null: bool = match search {
      Some(item) => item.cron_job_id_is_null.unwrap_or(false),
      None => false,
    };
    if cron_job_id_is_null {
      where_query.push_str(" and t.cron_job_id is null");
    }
  }
  {
    let cron_job_id_lbl: Option<Vec<String>> = match search {
      Some(item) => item.cron_job_id_lbl.clone(),
      None => None,
    };
    if let Some(cron_job_id_lbl) = cron_job_id_lbl {
      let arg = {
        if cron_job_id_lbl.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(cron_job_id_lbl.len());
          for item in cron_job_id_lbl {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and cron_job_id_lbl.lbl in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let cron_job_id_lbl_like = match search {
      Some(item) => item.cron_job_id_lbl_like.clone(),
      None => None,
    };
    if let Some(cron_job_id_lbl_like) = cron_job_id_lbl_like {
      where_query.push_str(" and cron_job_id_lbl.lbl like ?");
      args.push(format!("%{}%", sql_like(&cron_job_id_lbl_like)).into());
    }
  }
  // 执行状态
  {
    let exec_state: Option<Vec<CronJobLogExecState>> = match search {
      Some(item) => item.exec_state.clone(),
      None => None,
    };
    if let Some(exec_state) = exec_state {
      let arg = {
        if exec_state.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(exec_state.len());
          for item in exec_state {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.exec_state in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  // 执行结果
  {
    let exec_result = match search {
      Some(item) => item.exec_result.clone(),
      None => None,
    };
    if let Some(exec_result) = exec_result {
      where_query.push_str(" and t.exec_result=?");
      args.push(exec_result.into());
    }
    let exec_result_like = match search {
      Some(item) => item.exec_result_like.clone(),
      None => None,
    };
    if let Some(exec_result_like) = exec_result_like {
      where_query.push_str(" and t.exec_result like ?");
      args.push(format!("%{}%", sql_like(&exec_result_like)).into());
    }
  }
  // 开始时间
  {
    let mut begin_time = match search {
      Some(item) => item.begin_time.unwrap_or_default(),
      None => Default::default(),
    };
    let begin_time_gt = begin_time[0].take();
    let begin_time_lt = begin_time[1].take();
    if let Some(begin_time_gt) = begin_time_gt {
      where_query.push_str(" and t.begin_time >= ?");
      args.push(begin_time_gt.into());
    }
    if let Some(begin_time_lt) = begin_time_lt {
      where_query.push_str(" and t.begin_time <= ?");
      args.push(begin_time_lt.into());
    }
  }
  // 结束时间
  {
    let mut end_time = match search {
      Some(item) => item.end_time.unwrap_or_default(),
      None => Default::default(),
    };
    let end_time_gt = end_time[0].take();
    let end_time_lt = end_time[1].take();
    if let Some(end_time_gt) = end_time_gt {
      where_query.push_str(" and t.end_time >= ?");
      args.push(end_time_gt.into());
    }
    if let Some(end_time_lt) = end_time_lt {
      where_query.push_str(" and t.end_time <= ?");
      args.push(end_time_lt.into());
    }
  }
  // 备注
  {
    let rem = match search {
      Some(item) => item.rem.clone(),
      None => None,
    };
    if let Some(rem) = rem {
      where_query.push_str(" and t.rem=?");
      args.push(rem.into());
    }
    let rem_like = match search {
      Some(item) => item.rem_like.clone(),
      None => None,
    };
    if let Some(rem_like) = rem_like {
      where_query.push_str(" and t.rem like ?");
      args.push(format!("%{}%", sql_like(&rem_like)).into());
    }
  }
  // 创建时间
  {
    let mut create_time = match search {
      Some(item) => item.create_time.unwrap_or_default(),
      None => Default::default(),
    };
    let create_time_gt = create_time[0].take();
    let create_time_lt = create_time[1].take();
    if let Some(create_time_gt) = create_time_gt {
      where_query.push_str(" and t.create_time >= ?");
      args.push(create_time_gt.into());
    }
    if let Some(create_time_lt) = create_time_lt {
      where_query.push_str(" and t.create_time <= ?");
      args.push(create_time_lt.into());
    }
  }
  // 创建人
  {
    let create_usr_id: Option<Vec<UsrId>> = match search {
      Some(item) => item.create_usr_id.clone(),
      None => None,
    };
    if let Some(create_usr_id) = create_usr_id {
      let arg = {
        if create_usr_id.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(create_usr_id.len());
          for item in create_usr_id {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.create_usr_id in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let create_usr_id_is_null: bool = match search {
      Some(item) => item.create_usr_id_is_null.unwrap_or(false),
      None => false,
    };
    if create_usr_id_is_null {
      where_query.push_str(" and t.create_usr_id is null");
    }
  }
  {
    let create_usr_id_lbl: Option<Vec<String>> = match search {
      Some(item) => item.create_usr_id_lbl.clone(),
      None => None,
    };
    if let Some(create_usr_id_lbl) = create_usr_id_lbl {
      let arg = {
        if create_usr_id_lbl.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(create_usr_id_lbl.len());
          for item in create_usr_id_lbl {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.create_usr_id_lbl in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
    {
      let create_usr_id_lbl_like = match search {
        Some(item) => item.create_usr_id_lbl_like.clone(),
        None => None,
      };
      if let Some(create_usr_id_lbl_like) = create_usr_id_lbl_like {
        where_query.push_str(" and create_usr_id_lbl.lbl like ?");
        args.push(format!("%{}%", sql_like(&create_usr_id_lbl_like)).into());
      }
    }
  }
  // 更新人
  {
    let update_usr_id: Option<Vec<UsrId>> = match search {
      Some(item) => item.update_usr_id.clone(),
      None => None,
    };
    if let Some(update_usr_id) = update_usr_id {
      let arg = {
        if update_usr_id.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(update_usr_id.len());
          for item in update_usr_id {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.update_usr_id in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let update_usr_id_is_null: bool = match search {
      Some(item) => item.update_usr_id_is_null.unwrap_or(false),
      None => false,
    };
    if update_usr_id_is_null {
      where_query.push_str(" and t.update_usr_id is null");
    }
  }
  {
    let update_usr_id_lbl: Option<Vec<String>> = match search {
      Some(item) => item.update_usr_id_lbl.clone(),
      None => None,
    };
    if let Some(update_usr_id_lbl) = update_usr_id_lbl {
      let arg = {
        if update_usr_id_lbl.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(update_usr_id_lbl.len());
          for item in update_usr_id_lbl {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.update_usr_id_lbl in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
    {
      let update_usr_id_lbl_like = match search {
        Some(item) => item.update_usr_id_lbl_like.clone(),
        None => None,
      };
      if let Some(update_usr_id_lbl_like) = update_usr_id_lbl_like {
        where_query.push_str(" and update_usr_id_lbl.lbl like ?");
        args.push(format!("%{}%", sql_like(&update_usr_id_lbl_like)).into());
      }
    }
  }
  // 更新时间
  {
    let mut update_time = match search {
      Some(item) => item.update_time.unwrap_or_default(),
      None => Default::default(),
    };
    let update_time_gt = update_time[0].take();
    let update_time_lt = update_time[1].take();
    if let Some(update_time_gt) = update_time_gt {
      where_query.push_str(" and t.update_time >= ?");
      args.push(update_time_gt.into());
    }
    if let Some(update_time_lt) = update_time_lt {
      where_query.push_str(" and t.update_time <= ?");
      args.push(update_time_lt.into());
    }
  }
  Ok(where_query)
}

#[allow(unused_variables)]
async fn get_from_query(
  args: &mut QueryArgs,
  search: Option<&CronJobLogSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let server_i18n_enable = get_server_i18n_enable();
  
  let from_query = r#"cron_cron_job_log t
  left join cron_cron_job cron_job_id_lbl on cron_job_id_lbl.id=t.cron_job_id"#.to_owned();
  Ok(from_query)
}

// MARK: find_all
/// 根据搜索条件和分页查找定时任务日志列表
#[allow(unused_mut)]
pub async fn find_all(
  search: Option<CronJobLogSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<CronJobLogModel>> {
  
  let table = "cron_cron_job_log";
  let method = "find_all";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    if let Some(search) = &search {
      msg += &format!(" search: {:?}", &search);
    }
    if let Some(page) = &page {
      msg += &format!(" page: {:?}", &page);
    }
    if let Some(sort) = &sort {
      msg += &format!(" sort: {:?}", &sort);
    }
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  if let Some(search) = &search {
    if search.id.is_some() && search.id.as_ref().unwrap().is_empty() {
      return Ok(vec![]);
    }
    if search.ids.is_some() && search.ids.as_ref().unwrap().is_empty() {
      return Ok(vec![]);
    }
  }
  // 定时任务
  if let Some(search) = &search {
    if search.cron_job_id.is_some() {
      let len = search.cron_job_id.as_ref().unwrap().len();
      if len == 0 {
        return Ok(vec![]);
      }
      let ids_limit = options
        .as_ref()
        .and_then(|x| x.get_ids_limit())
        .unwrap_or(FIND_ALL_IDS_LIMIT);
      if len > ids_limit {
        return Err(eyre!("search.cron_job_id.length > {ids_limit}"));
      }
    }
  }
  // 执行状态
  if let Some(search) = &search {
    if search.exec_state.is_some() {
      let len = search.exec_state.as_ref().unwrap().len();
      if len == 0 {
        return Ok(vec![]);
      }
      let ids_limit = options
        .as_ref()
        .and_then(|x| x.get_ids_limit())
        .unwrap_or(FIND_ALL_IDS_LIMIT);
      if len > ids_limit {
        return Err(eyre!("search.exec_state.length > {ids_limit}"));
      }
    }
  }
  // 创建人
  if let Some(search) = &search {
    if search.create_usr_id.is_some() {
      let len = search.create_usr_id.as_ref().unwrap().len();
      if len == 0 {
        return Ok(vec![]);
      }
      let ids_limit = options
        .as_ref()
        .and_then(|x| x.get_ids_limit())
        .unwrap_or(FIND_ALL_IDS_LIMIT);
      if len > ids_limit {
        return Err(eyre!("search.create_usr_id.length > {ids_limit}"));
      }
    }
  }
  // 更新人
  if let Some(search) = &search {
    if search.update_usr_id.is_some() {
      let len = search.update_usr_id.as_ref().unwrap().len();
      if len == 0 {
        return Ok(vec![]);
      }
      let ids_limit = options
        .as_ref()
        .and_then(|x| x.get_ids_limit())
        .unwrap_or(FIND_ALL_IDS_LIMIT);
      if len > ids_limit {
        return Err(eyre!("search.update_usr_id.length > {ids_limit}"));
      }
    }
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  #[allow(unused_variables)]
  let is_deleted = search.as_ref()
    .and_then(|item| item.is_deleted);
  
  let mut args = QueryArgs::new();
  
  let from_query = get_from_query(&mut args, search.as_ref(), options.as_ref()).await?;
  let where_query = get_where_query(&mut args, search.as_ref(), options.as_ref()).await?;
  
  let mut sort = sort.unwrap_or_default();
  
  if !sort.iter().any(|item| item.prop == "create_time") {
    sort.push(SortInput {
      prop: "create_time".into(),
      order: SortOrderEnum::Desc,
    });
  }
  
  let sort = sort.into();
  
  let order_by_query = get_order_by_query(sort);
  let page_query = get_page_query(page);
  
  let sql = format!(r#"select f.* from (select t.*
  ,cron_job_id_lbl.lbl cron_job_id_lbl
  from {from_query} where {where_query} group by t.id{order_by_query}) f {page_query}"#);
  
  let args = args.into();
  
  let options = Options::from(options);
  
  let mut res: Vec<CronJobLogModel> = query(
    sql,
    args,
    Some(options),
  ).await?;
  
  let dict_vec = get_dict(&[
    "cron_job_log_exec_state",
  ]).await?;
  let [
    exec_state_dict,
  ]: [Vec<_>; 1] = dict_vec
    .try_into()
    .map_err(|err| eyre!("{:#?}", err))?;
  
  #[allow(unused_variables)]
  for model in &mut res {
    
    // 执行状态
    model.exec_state_lbl = {
      exec_state_dict
        .iter()
        .find(|item| item.val == model.exec_state.as_str())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.exec_state.to_string())
    };
    
  }
  
  Ok(res)
}

// MARK: find_count
/// 根据条件查找定时任务日志总数
pub async fn find_count(
  search: Option<CronJobLogSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "cron_cron_job_log";
  let method = "find_count";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    if let Some(search) = &search {
      msg += &format!(" search: {:?}", &search);
    }
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
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
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let mut args = QueryArgs::new();
  
  let from_query = get_from_query(&mut args, search.as_ref(), options.as_ref()).await?;
  let where_query = get_where_query(&mut args, search.as_ref(), options.as_ref()).await?;
  
  let sql = format!(r#"select count(1) total from(select 1 from {from_query} where {where_query} group by t.id) t"#);
  
  let args = args.into();
  
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

/// 获取当前路由的国际化
pub fn get_n_route() -> i18n_dao::NRoute {
  i18n_dao::NRoute {
    route_path: get_route_path_cron_job_log().into(),
  }
}

// MARK: get_field_comments
/// 获取定时任务日志字段注释
pub async fn get_field_comments(
  _options: Option<Options>,
) -> Result<CronJobLogFieldComment> {
  
  let n_route = get_n_route();
  
  let i18n_code_maps: Vec<i18n_dao::I18nCodeMap> = vec![
    "ID".into(),
    "定时任务".into(),
    "定时任务".into(),
    "执行状态".into(),
    "执行状态".into(),
    "执行结果".into(),
    "开始时间".into(),
    "开始时间".into(),
    "结束时间".into(),
    "结束时间".into(),
    "备注".into(),
    "创建时间".into(),
    "创建时间".into(),
    "创建人".into(),
    "创建人".into(),
    "更新人".into(),
    "更新人".into(),
    "更新时间".into(),
    "更新时间".into(),
  ];
  
  let map = n_route.n_batch(
    i18n_code_maps.clone(),
  ).await?;
  
  let vec = i18n_code_maps.into_iter()
    .map(|item|
      map.get(&item.code)
        .map(|item| item.to_owned())
        .unwrap_or_default()
    )
    .collect::<Vec<String>>();
  
  let field_comments = CronJobLogFieldComment {
    id: vec[0].to_owned(),
    cron_job_id: vec[1].to_owned(),
    cron_job_id_lbl: vec[2].to_owned(),
    exec_state: vec[3].to_owned(),
    exec_state_lbl: vec[4].to_owned(),
    exec_result: vec[5].to_owned(),
    begin_time: vec[6].to_owned(),
    begin_time_lbl: vec[7].to_owned(),
    end_time: vec[8].to_owned(),
    end_time_lbl: vec[9].to_owned(),
    rem: vec[10].to_owned(),
    create_time: vec[11].to_owned(),
    create_time_lbl: vec[12].to_owned(),
    create_usr_id: vec[13].to_owned(),
    create_usr_id_lbl: vec[14].to_owned(),
    update_usr_id: vec[15].to_owned(),
    update_usr_id_lbl: vec[16].to_owned(),
    update_time: vec[17].to_owned(),
    update_time_lbl: vec[18].to_owned(),
  };
  Ok(field_comments)
}

// MARK: find_one
/// 根据条件查找第一个定时任务日志
pub async fn find_one(
  search: Option<CronJobLogSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<CronJobLogModel>> {
  
  let table = "cron_cron_job_log";
  let method = "find_one";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    if let Some(search) = &search {
      msg += &format!(" search: {:?}", &search);
    }
    if let Some(sort) = &sort {
      msg += &format!(" sort: {:?}", &sort);
    }
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  if let Some(search) = &search {
    if search.id.is_some() && search.id.as_ref().unwrap().is_empty() {
      return Ok(None);
    }
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let page = PageInput {
    pg_offset: 0.into(),
    pg_size: 1.into(),
  }.into();
  
  let res = find_all(
    search,
    page,
    sort,
    options,
  ).await?;
  
  let model: Option<CronJobLogModel> = res.into_iter().next();
  
  Ok(model)
}

// MARK: find_by_id
/// 根据 id 查找定时任务日志
pub async fn find_by_id(
  id: CronJobLogId,
  options: Option<Options>,
) -> Result<Option<CronJobLogModel>> {
  
  let table = "cron_cron_job_log";
  let method = "find_by_id";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" id: {:?}", &id);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
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
  
  let search = CronJobLogSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let res = find_one(
    search,
    None,
    options,
  ).await?;
  
  Ok(res)
}

// MARK: find_by_ids
/// 根据 ids 查找定时任务日志
#[allow(dead_code)]
pub async fn find_by_ids(
  ids: Vec<CronJobLogId>,
  options: Option<Options>,
) -> Result<Vec<CronJobLogModel>> {
  
  let table = "cron_cron_job_log";
  let method = "find_by_ids";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" ids: {:?}", &ids);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
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
    return Err(eyre!("find_by_ids: ids.length > FIND_ALL_IDS_LIMIT"));
  }
  
  let search = CronJobLogSearch {
    ids: Some(ids.clone()),
    ..Default::default()
  }.into();
  
  let models = find_all(
    search,
    None,
    None,
    options,
  ).await?;
  
  if models.len() != len {
    return Err(eyre!("find_by_ids: models.length !== ids.length"));
  }
  
  let models = ids
    .into_iter()
    .map(|id| {
      let model = models
        .iter()
        .find(|item| item.id == id);
      if let Some(model) = model {
        return Ok(model.clone());
      }
      Err(eyre!("find_by_ids: id: {id} not found"))
    })
    .collect::<Result<Vec<CronJobLogModel>>>()?;
  
  Ok(models)
}

// MARK: exists
/// 根据搜索条件判断定时任务日志是否存在
#[allow(dead_code)]
pub async fn exists(
  search: Option<CronJobLogSearch>,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = "cron_cron_job_log";
  let method = "exists";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    if let Some(search) = &search {
      msg += &format!(" search: {:?}", &search);
    }
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let total = find_count(
    search,
    options,
  ).await?;
  
  Ok(total > 0)
}

// MARK: exists_by_id
/// 根据 id 判断定时任务日志是否存在
#[allow(dead_code)]
pub async fn exists_by_id(
  id: CronJobLogId,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = "cron_cron_job_log";
  let method = "exists_by_id";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" id: {:?}", &id);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let search = CronJobLogSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let res = exists(
    search,
    options,
  ).await?;
  
  Ok(res)
}

// MARK: find_by_unique
/// 通过唯一约束获得数据列表
#[allow(unused_variables)]
pub async fn find_by_unique(
  search: CronJobLogSearch,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<CronJobLogModel>> {
  
  let table = "cron_cron_job_log";
  let method = "find_by_unique";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" search: {:?}", &search);
    if let Some(sort) = &sort {
      msg += &format!(" sort: {:?}", &sort);
    }
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  if let Some(id) = search.id {
    let model = find_by_id(
      id,
      options.clone(),
    ).await?;
    return Ok(model.map_or_else(Vec::new, |m| vec![m]));
  }
  
  Ok(vec![])
}

/// 根据唯一约束对比对象是否相等
#[allow(dead_code)]
pub fn equals_by_unique(
  input: &CronJobLogInput,
  model: &CronJobLogModel,
) -> bool {
  if input.id.as_ref().is_some() {
    return input.id.as_ref().unwrap() == &model.id;
  }
  false
}

// MARK: check_by_unique
/// 通过唯一约束检查数据是否已经存在
#[allow(unused_variables)]
pub async fn check_by_unique(
  input: CronJobLogInput,
  model: CronJobLogModel,
  options: Option<Options>,
) -> Result<Option<CronJobLogId>> {
  
  let table = "cron_cron_job_log";
  let method = "check_by_unique";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" input: {:?}", &input);
    msg += &format!(" model: {:?}", &model);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
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
    let id = update_by_id(
      model.id.clone(),
      input,
      options,
    ).await?;
    return Ok(id.into());
  }
  if unique_type == UniqueType::Throw {
    let table_comment = i18n_dao::ns(
      "定时任务日志".to_owned(),
      None,
    ).await?;
    let map = HashMap::from([
      ("0".to_owned(), table_comment),
    ]);
    let err_msg = i18n_dao::ns(
      "此 {0} 已经存在".to_owned(),
      map.into(),
    ).await?;
    return Err(eyre!(err_msg));
  }
  Ok(None)
}

// MARK: set_id_by_lbl
/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(unused_variables, dead_code)]
pub async fn set_id_by_lbl(
  input: CronJobLogInput,
) -> Result<CronJobLogInput> {
  
  #[allow(unused_mut)]
  let mut input = input;
  
  // 开始时间
  if input.begin_time.is_none() {
    if let Some(begin_time_lbl) = input.begin_time_lbl.as_ref().filter(|s| !s.is_empty()) {
      input.begin_time = chrono::NaiveDateTime::parse_from_str(begin_time_lbl, "%Y-%m-%d %H:%M:%S").ok();
      if input.begin_time.is_none() {
        input.begin_time = chrono::NaiveDateTime::parse_from_str(begin_time_lbl, "%Y-%m-%d").ok();
      }
      if input.begin_time.is_none() {
        let field_comments = get_field_comments(
          None,
        ).await?;
        let column_comment = field_comments.begin_time;
        
        let err_msg = i18n_dao::ns(
          "日期格式错误".to_owned(),
          None,
        ).await?;
        return Err(eyre!("{column_comment} {err_msg}"));
      }
    }
  }
  
  // 结束时间
  if input.end_time.is_none() {
    if let Some(end_time_lbl) = input.end_time_lbl.as_ref().filter(|s| !s.is_empty()) {
      input.end_time = chrono::NaiveDateTime::parse_from_str(end_time_lbl, "%Y-%m-%d %H:%M:%S").ok();
      if input.end_time.is_none() {
        input.end_time = chrono::NaiveDateTime::parse_from_str(end_time_lbl, "%Y-%m-%d").ok();
      }
      if input.end_time.is_none() {
        let field_comments = get_field_comments(
          None,
        ).await?;
        let column_comment = field_comments.end_time;
        
        let err_msg = i18n_dao::ns(
          "日期格式错误".to_owned(),
          None,
        ).await?;
        return Err(eyre!("{column_comment} {err_msg}"));
      }
    }
  }
  
  let dict_vec = get_dict(&[
    "cron_job_log_exec_state",
  ]).await?;
  
  // 执行状态
  if input.exec_state.is_none() {
    let exec_state_dict = &dict_vec[0];
    if let Some(exec_state_lbl) = input.exec_state_lbl.clone() {
      input.exec_state = exec_state_dict
        .iter()
        .find(|item| {
          item.lbl == exec_state_lbl
        })
        .map(|item| {
          item.val.parse().unwrap_or_default()
        });
    }
  }
  
  // 定时任务
  if input.cron_job_id_lbl.is_some()
    && !input.cron_job_id_lbl.as_ref().unwrap().is_empty()
    && input.cron_job_id.is_none()
  {
    input.cron_job_id_lbl = input.cron_job_id_lbl.map(|item| 
      item.trim().to_owned()
    );
    let model = crate::r#gen::cron::cron_job::cron_job_dao::find_one(
      crate::r#gen::cron::cron_job::cron_job_model::CronJobSearch {
        lbl: input.cron_job_id_lbl.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(model) = model {
      input.cron_job_id = model.id.into();
    }
  } else if
    (input.cron_job_id_lbl.is_none() || input.cron_job_id_lbl.as_ref().unwrap().is_empty())
    && input.cron_job_id.is_some()
  {
    let cron_job_model = crate::r#gen::cron::cron_job::cron_job_dao::find_one(
      crate::r#gen::cron::cron_job::cron_job_model::CronJobSearch {
        id: input.cron_job_id.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(cron_job_model) = cron_job_model {
      input.cron_job_id_lbl = cron_job_model.lbl.into();
    }
  }
  
  // 执行状态
  if
    input.exec_state_lbl.is_some() && !input.exec_state_lbl.as_ref().unwrap().is_empty()
    && input.exec_state.is_none()
  {
    let exec_state_dict = &dict_vec[0];
    let dict_model = exec_state_dict.iter().find(|item| {
      item.lbl == input.exec_state_lbl.clone().unwrap_or_default()
    });
    let val = dict_model.map(|item| item.val.to_string());
    if let Some(val) = val {
      input.exec_state = val.parse::<CronJobLogExecState>()?.into();
    }
  } else if
    (input.exec_state_lbl.is_none() || input.exec_state_lbl.as_ref().unwrap().is_empty())
    && input.exec_state.is_some()
  {
    let exec_state_dict = &dict_vec[0];
    let dict_model = exec_state_dict.iter().find(|item| {
      item.val == input.exec_state.unwrap_or_default().to_string()
    });
    let lbl = dict_model.map(|item| item.lbl.to_string());
    input.exec_state_lbl = lbl;
  }
  
  Ok(input)
}

// MARK: creates_return
/// 批量创建定时任务日志并返回
#[allow(dead_code)]
pub async fn creates_return(
  inputs: Vec<CronJobLogInput>,
  options: Option<Options>,
) -> Result<Vec<CronJobLogModel>> {
  
  let table = "cron_cron_job_log";
  let method = "creates_return";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" inputs: {:?}", &inputs);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let ids = _creates(
    inputs.clone(),
    options.clone(),
  ).await?;
  
  let models = find_by_ids(
    ids,
    options,
  ).await?;
  
  Ok(models)
}

// MARK: creates
/// 批量创建定时任务日志
pub async fn creates(
  inputs: Vec<CronJobLogInput>,
  options: Option<Options>,
) -> Result<Vec<CronJobLogId>> {
  
  let table = "cron_cron_job_log";
  let method = "creates";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" inputs: {:?}", &inputs);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
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

/// 批量创建定时任务日志
#[allow(unused_variables)]
async fn _creates(
  inputs: Vec<CronJobLogInput>,
  options: Option<Options>,
) -> Result<Vec<CronJobLogId>> {
  
  let table = "cron_cron_job_log";
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  
  let unique_type = options.as_ref()
    .and_then(|item|
      item.get_unique_type()
    )
    .unwrap_or_default();
  
  let mut ids2: Vec<CronJobLogId> = vec![];
  let mut inputs2: Vec<CronJobLogInput> = vec![];
  
  for input in inputs {
  
    if input.id.is_some() {
      return Err(eyre!("Can not set id when create in dao: {table}"));
    }
    
    let old_models = find_by_unique(
      input.clone().into(),
      None,
      options.clone(),
    ).await?;
    
    if !old_models.is_empty() {
      let mut id: Option<CronJobLogId> = None;
      
      for old_model in old_models {
        let options = Options::from(options.clone())
          .set_unique_type(unique_type);
        
        id = check_by_unique(
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
  let mut sql_fields = String::with_capacity(80 * 13 + 20);
  
  sql_fields += "id";
  sql_fields += ",create_time";
  sql_fields += ",update_time";
  sql_fields += ",create_usr_id";
  sql_fields += ",create_usr_id_lbl";
  sql_fields += ",update_usr_id";
  sql_fields += ",update_usr_id_lbl";
  sql_fields += ",tenant_id";
  // 定时任务
  sql_fields += ",cron_job_id";
  // 执行状态
  sql_fields += ",exec_state";
  // 执行结果
  sql_fields += ",exec_result";
  // 开始时间
  sql_fields += ",begin_time";
  // 结束时间
  sql_fields += ",end_time";
  // 备注
  sql_fields += ",rem";
  
  let inputs2_len = inputs2.len();
  let mut sql_values = String::with_capacity((2 * 13 + 3) * inputs2_len);
  let mut inputs2_ids = vec![];
  
  for (i, input) in inputs2
    .clone()
    .into_iter()
    .enumerate()
  {
    
    let id: CronJobLogId = get_short_uuid().into();
    ids2.push(id.clone());
    
    inputs2_ids.push(id.clone());
    
    sql_values += "(?";
    args.push(id.into());
    
    if !is_silent_mode {
      if let Some(create_time) = input.create_time {
        sql_values += ",?";
        args.push(create_time.into());
      } else if input.create_time_save_null == Some(true) {
        sql_values += ",null";
      } else {
        sql_values += ",?";
        args.push(get_now().into());
      }
    } else if let Some(create_time) = input.create_time {
      sql_values += ",?";
      args.push(create_time.into());
    } else {
      sql_values += ",null";
    }
    
    if let Some(update_time) = input.update_time {
      sql_values += ",?";
      args.push(update_time.into());
    } else {
      sql_values += ",null";
    }
    
    if !is_silent_mode {
      if input.create_usr_id.is_none() {
        let mut usr_id = get_auth_id();
        let mut usr_lbl = String::new();
        if usr_id.is_some() {
          let usr_model = find_by_id_usr(
            usr_id.clone().unwrap(),
            options.clone(),
          ).await?;
          if let Some(usr_model) = usr_model {
            usr_lbl = usr_model.lbl;
          } else {
            usr_id = None;
          }
        }
        if let Some(usr_id) = usr_id {
          sql_values += ",?";
          args.push(usr_id.into());
        } else {
          sql_values += ",default";
        }
        sql_values += ",?";
        args.push(usr_lbl.into());
      } else if input.create_usr_id.clone().unwrap().as_str() == "-" {
        sql_values += ",default";
        sql_values += ",default";
      } else {
        let mut usr_id = input.create_usr_id.clone();
        let mut usr_lbl = String::new();
        let usr_model = find_by_id_usr(
          usr_id.clone().unwrap(),
          options.clone(),
        ).await?;
        if let Some(usr_model) = usr_model {
          usr_lbl = usr_model.lbl;
        } else {
          usr_id = None;
        }
        if let Some(usr_id) = usr_id {
          sql_values += ",?";
          args.push(usr_id.into());
        } else {
          sql_values += ",default";
        }
        sql_values += ",?";
        args.push(usr_lbl.into());
      }
    } else {
      if let Some(create_usr_id) = input.create_usr_id {
        sql_values += ",?";
        args.push(create_usr_id.into());
      } else {
        sql_values += ",default";
      }
      if let Some(create_usr_id_lbl) = input.create_usr_id_lbl {
        sql_values += ",?";
        args.push(create_usr_id_lbl.into());
      } else {
        sql_values += ",default";
      }
    }
    
    if let Some(update_usr_id) = input.update_usr_id {
      sql_values += ",?";
      args.push(update_usr_id.into());
    } else {
      sql_values += ",default";
    }
    
    if let Some(update_usr_id_lbl) = input.update_usr_id_lbl {
      sql_values += ",?";
      args.push(update_usr_id_lbl.into());
    } else {
      sql_values += ",default";
    }
    
    if let Some(tenant_id) = input.tenant_id {
      sql_values += ",?";
      args.push(tenant_id.into());
    } else if let Some(tenant_id) = get_auth_tenant_id() {
      sql_values += ",?";
      args.push(tenant_id.into());
    } else {
      sql_values += ",default";
    }
    // 定时任务
    if let Some(cron_job_id) = input.cron_job_id {
      sql_values += ",?";
      args.push(cron_job_id.into());
    } else {
      sql_values += ",default";
    }
    // 执行状态
    if let Some(exec_state) = input.exec_state {
      sql_values += ",?";
      args.push(exec_state.into());
    } else {
      sql_values += ",default";
    }
    // 执行结果
    if let Some(exec_result) = input.exec_result {
      sql_values += ",?";
      args.push(exec_result.into());
    } else {
      sql_values += ",default";
    }
    // 开始时间
    if let Some(begin_time) = input.begin_time {
      sql_values += ",?";
      args.push(begin_time.into());
    } else if input.begin_time_save_null == Some(true) {
      sql_values += ",null";
    } else {
      sql_values += ",default";
    }
    // 结束时间
    if let Some(end_time) = input.end_time {
      sql_values += ",?";
      args.push(end_time.into());
    } else if input.end_time_save_null == Some(true) {
      sql_values += ",null";
    } else {
      sql_values += ",default";
    }
    // 备注
    if let Some(rem) = input.rem {
      sql_values += ",?";
      args.push(rem.into());
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
  
  let options = Options::from(options);
  
  let options = Some(options);
  
  let affected_rows = execute(
    sql,
    args,
    options.clone(),
  ).await?;
  
  if affected_rows != inputs2_len as u64 {
    return Err(eyre!("affectedRows: {affected_rows} != {inputs2_len}"));
  }
  
  Ok(ids2)
}

// MARK: create_return
/// 创建定时任务日志并返回
#[allow(dead_code)]
pub async fn create_return(
  #[allow(unused_mut)]
  mut input: CronJobLogInput,
  options: Option<Options>,
) -> Result<CronJobLogModel> {
  
  let table = "cron_cron_job_log";
  
  let id = create(input.clone(), options.clone()).await?;
  
  let model = find_by_id(
    id,
    options,
  ).await?;
  
  if model.is_none() {
    return Err(eyre!("create_return: Create failed in dao: {table}"));
  }
  let model = model.unwrap();
  
  Ok(model)
}

// MARK: create
/// 创建定时任务日志
#[allow(dead_code)]
pub async fn create(
  #[allow(unused_mut)]
  mut input: CronJobLogInput,
  options: Option<Options>,
) -> Result<CronJobLogId> {
  
  let table = "cron_cron_job_log";
  let method = "create";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" input: {:?}", &input);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
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

// MARK: update_tenant_by_id
/// 定时任务日志根据id修改租户id
pub async fn update_tenant_by_id(
  id: CronJobLogId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  let table = "cron_cron_job_log";
  let method = "update_tenant_by_id";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" id: {:?}", &id);
    msg += &format!(" tenant_id: {:?}", &tenant_id);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  
  let mut args = QueryArgs::new();
  
  args.push(tenant_id.into());
  args.push(id.into());
  
  let sql = format!("update {table} set tenant_id=? where id=?");
  
  let args: Vec<_> = args.into();
  
  let num = execute(
    sql,
    args,
    Some(options.clone()),
  ).await?;
  
  Ok(num)
}

// MARK: update_by_id
/// 根据 id 修改定时任务日志
#[allow(unused_mut)]
#[allow(unused_variables)]
pub async fn update_by_id(
  id: CronJobLogId,
  mut input: CronJobLogInput,
  options: Option<Options>,
) -> Result<CronJobLogId> {
  
  let table = "cron_cron_job_log";
  let method = "update_by_id";
  
  let is_debug = get_is_debug(options.as_ref());
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  let is_creating = get_is_creating(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" id: {:?}", &id);
    msg += &format!(" input: {:?}", &input);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let old_model = find_by_id(
    id.clone(),
    options.clone(),
  ).await?;
  
  if old_model.is_none() {
    let table_comment = i18n_dao::ns(
      "定时任务日志".to_owned(),
      None,
    ).await?;
    let map = HashMap::from([
      ("0".to_owned(), table_comment),
    ]);
    let err_msg = i18n_dao::ns(
      "编辑失败, 此 {0} 已被删除".to_owned(),
      map.into(),
    ).await?;
    return Err(eyre!(err_msg));
  }
  let old_model = old_model.unwrap();
  
  if !is_silent_mode {
    info!(
      "{} {}.{}: {}",
      get_req_id(),
      table,
      method,
      serde_json::to_string(&old_model)?,
    );
  }
  
  {
    let mut input = input.clone();
    input.id = None;
    
    let models = find_by_unique(
      input.into(),
      None,
      options.clone(),
    ).await?;
    
    let models = models.into_iter()
      .filter(|item| 
        item.id != id
      )
      .collect::<Vec<CronJobLogModel>>();
    
    if !models.is_empty() {
      let unique_type = options
        .as_ref()
        .and_then(|item| item.get_unique_type())
        .unwrap_or(UniqueType::Throw);
      if unique_type == UniqueType::Throw {
        let table_comment = i18n_dao::ns(
          "定时任务日志".to_owned(),
          None,
        ).await?;
        let map = HashMap::from([
          ("0".to_owned(), table_comment),
        ]);
        let err_msg = i18n_dao::ns(
          "此 {0} 已经存在".to_owned(),
          map.into(),
        ).await?;
        return Err(eyre!(err_msg));
      } else if unique_type == UniqueType::Ignore {
        return Ok(id);
      }
    }
  }
  
  let mut args = QueryArgs::new();
  
  let mut sql_fields = String::with_capacity(80 * 13 + 20);
  
  let mut field_num: usize = 0;
  
  if let Some(tenant_id) = input.tenant_id {
    field_num += 1;
    sql_fields += "tenant_id=?,";
    args.push(tenant_id.into());
  }
  // 定时任务
  if let Some(cron_job_id) = input.cron_job_id {
    field_num += 1;
    sql_fields += "cron_job_id=?,";
    args.push(cron_job_id.into());
  }
  // 执行状态
  if let Some(exec_state) = input.exec_state {
    field_num += 1;
    sql_fields += "exec_state=?,";
    args.push(exec_state.into());
  }
  // 执行结果
  if let Some(exec_result) = input.exec_result {
    field_num += 1;
    sql_fields += "exec_result=?,";
    args.push(exec_result.into());
  }
  // 开始时间
  if let Some(begin_time) = input.begin_time {
    field_num += 1;
    sql_fields += "begin_time=?,";
    args.push(begin_time.into());
  } else if input.begin_time_save_null == Some(true) {
    field_num += 1;
    sql_fields += "begin_time=null,";
  }
  // 结束时间
  if let Some(end_time) = input.end_time {
    field_num += 1;
    sql_fields += "end_time=?,";
    args.push(end_time.into());
  } else if input.end_time_save_null == Some(true) {
    field_num += 1;
    sql_fields += "end_time=null,";
  }
  // 备注
  if let Some(rem) = input.rem {
    field_num += 1;
    sql_fields += "rem=?,";
    args.push(rem.into());
  }
  
  if field_num > 0 {
    if !is_silent_mode && !is_creating {
      if input.update_usr_id.is_none() {
        let mut usr_id = get_auth_id();
        let mut usr_id_lbl = String::new();
        if usr_id.is_some() {
          let usr_model = find_by_id_usr(
            usr_id.clone().unwrap(),
            options.clone(),
          ).await?;
          if let Some(usr_model) = usr_model {
            usr_id_lbl = usr_model.lbl;
          } else {
            usr_id = None;
          }
        }
        if let Some(usr_id) = usr_id {
          sql_fields += "update_usr_id=?,";
          args.push(usr_id.into());
        }
        if !usr_id_lbl.is_empty() {
          sql_fields += "update_usr_id_lbl=?,";
          args.push(usr_id_lbl.into());
        }
      } else if input.update_usr_id.clone().unwrap().as_str() != "-" {
        let mut usr_id = input.update_usr_id.clone();
        let mut usr_id_lbl = String::new();
        if usr_id.is_some() {
          let usr_model = find_by_id_usr(
            usr_id.clone().unwrap(),
            options.clone(),
          ).await?;
          if let Some(usr_model) = usr_model {
            usr_id_lbl = usr_model.lbl;
          } else {
            usr_id = None;
          }
        }
        if let Some(usr_id) = usr_id {
          sql_fields += "update_usr_id=?,";
          args.push(usr_id.into());
          sql_fields += "update_usr_id_lbl=?,";
          args.push(usr_id_lbl.into());
        }
      }
    } else {
      if input.update_usr_id.is_some() && input.update_usr_id.clone().unwrap().as_str() != "-" {
        let usr_id = input.update_usr_id.clone();
        if let Some(usr_id) = usr_id {
          sql_fields += "update_usr_id=?,";
          args.push(usr_id.into());
        }
      }
      if let Some(update_usr_id_lbl) = input.update_usr_id_lbl {
        sql_fields += "update_usr_id=?,";
        args.push(update_usr_id_lbl.into());
      }
    }
    if !is_silent_mode && !is_creating {
      if let Some(update_time) = input.update_time {
        sql_fields += "update_time=?,";
        args.push(update_time.into());
      } else {
        sql_fields += "update_time=?,";
        args.push(get_now().into());
      }
    } else if let Some(update_time) = input.update_time {
      sql_fields += "update_time=?,";
      args.push(update_time.into());
    }
    
    if sql_fields.ends_with(',') {
      sql_fields.pop();
    }
    
    let sql_where = "id=?";
    args.push(id.clone().into());
    
    let sql = format!("update {table} set {sql_fields} where {sql_where} limit 1");
    
    let args: Vec<_> = args.into();
    
    let options = Options::from(options.clone());
    
    let options = Some(options);
    
    execute(
      sql,
      args,
      options.clone(),
    ).await?;
    
  }
  
  Ok(id)
}

/// 获取需要清空缓存的表名
#[allow(dead_code)]
fn get_cache_tables() -> Vec<&'static str> {
  let table = "cron_cron_job_log";
  vec![
    table,
  ]
}

// MARK: del_cache
/// 清空缓存
#[allow(dead_code)]
pub async fn del_cache() -> Result<()> {
  let cache_key1s = get_cache_tables();
  del_caches(
    cache_key1s.as_slice(),
  ).await?;
  Ok(())
}

// MARK: delete_by_ids
/// 根据 ids 删除定时任务日志
#[allow(unused_variables)]
pub async fn delete_by_ids(
  ids: Vec<CronJobLogId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "cron_cron_job_log";
  let method = "delete_by_ids";
  
  let is_debug = get_is_debug(options.as_ref());
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  let is_creating = get_is_creating(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" ids: {:?}", &ids);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
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
    
    let old_model = find_by_id(
      id.clone(),
      options.clone(),
    ).await?;
    if old_model.is_none() {
      continue;
    }
    let old_model = old_model.unwrap();
    
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
    
    let mut sql_fields = String::with_capacity(30);
    sql_fields.push_str("is_deleted=1,");
    let mut usr_id = get_auth_id();
    let mut usr_lbl = String::new();
    if usr_id.is_some() {
      let usr_model = find_by_id_usr(
        usr_id.clone().unwrap(),
        options.clone(),
      ).await?;
      if let Some(usr_model) = usr_model {
        usr_lbl = usr_model.lbl;
      } else {
        usr_id = None;
      }
    }
    
    if !is_silent_mode && !is_creating {
      if let Some(usr_id) = usr_id {
        sql_fields.push_str("delete_usr_id=?,");
        args.push(usr_id.into());
      }
    }
    
    if !is_silent_mode && !is_creating {
      sql_fields.push_str("delete_usr_id_lbl=?,");
      args.push(usr_lbl.into());
    }
    
    if !is_silent_mode && !is_creating {
      sql_fields.push_str("delete_time=?,");
      args.push(get_now().into());
    }
    
    if sql_fields.ends_with(',') {
      sql_fields.pop();
    }
    
    let sql = format!("update {table} set {sql_fields} where id=? limit 1");
    
    args.push(id.clone().into());
    
    let args: Vec<_> = args.into();
    
    let options = Options::from(options.clone());
    
    let options = Some(options);
    
    num += execute(
      sql,
      args,
      options.clone(),
    ).await?;
  }
  
  if num > MAX_SAFE_INTEGER {
    return Err(eyre!("num: {} > MAX_SAFE_INTEGER", num));
  }
  
  Ok(num)
}

// MARK: revert_by_ids
/// 根据 ids 还原定时任务日志
pub async fn revert_by_ids(
  ids: Vec<CronJobLogId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "cron_cron_job_log";
  let method = "revert_by_ids";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" ids: {:?}", &ids);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  if ids.is_empty() {
    return Ok(0);
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let mut num = 0;
  for id in ids.clone() {
    let mut args = QueryArgs::new();
    
    let sql = format!("update {table} set is_deleted=0 where id=? limit 1");
    
    args.push(id.clone().into());
    
    let args: Vec<_> = args.into();
    
    let mut old_model = find_one(
      CronJobLogSearch {
        id: Some(id.clone()),
        is_deleted: Some(1),
        ..Default::default()
      }.into(),
      None,
      options.clone(),
    ).await?;
    
    if old_model.is_none() {
      old_model = find_by_id(
        id.clone(),
        options.clone(),
      ).await?;
    }
    
    if old_model.is_none() {
      continue;
    }
    let old_model = old_model.unwrap();
    
    {
      let mut input: CronJobLogInput = old_model.clone().into();
      input.id = None;
      
      let models = find_by_unique(
        input.into(),
        None,
        options.clone(),
      ).await?;
      
      let models: Vec<CronJobLogModel> = models
        .into_iter()
        .filter(|item| 
          item.id != id
        )
        .collect();
      
      if !models.is_empty() {
        let table_comment = i18n_dao::ns(
          "定时任务日志".to_owned(),
          None,
        ).await?;
        let map = HashMap::from([
          ("0".to_owned(), table_comment),
        ]);
        let err_msg = i18n_dao::ns(
          "此 {0} 已经存在".to_owned(),
          map.into(),
        ).await?;
        return Err(eyre!(err_msg));
      }
    }
    
    num += execute(
      sql,
      args,
      options.clone(),
    ).await?;
    
  }
  
  Ok(num)
}

// MARK: force_delete_by_ids
/// 根据 ids 彻底删除定时任务日志
#[allow(unused_variables)]
pub async fn force_delete_by_ids(
  ids: Vec<CronJobLogId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "cron_cron_job_log";
  let method = "force_delete_by_ids";
  
  let is_debug = get_is_debug(options.as_ref());
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" ids: {:?}", &ids);
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  if ids.is_empty() {
    return Ok(0);
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let mut num = 0;
  for id in ids.clone() {
    
    let old_model = find_all(
      CronJobLogSearch {
        id: id.clone().into(),
        is_deleted: 1.into(),
        ..Default::default()
      }.into(),
      None,
      None, 
      options.clone(),
    ).await?.into_iter().next();
    
    if old_model.is_none() {
      continue;
    }
    let old_model = old_model.unwrap();
    
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
    
    let sql = format!("delete from {table} where id=? and is_deleted=1 limit 1");
    
    args.push(id.clone().into());
    
    let args: Vec<_> = args.into();
    
    let options = Options::from(options.clone());
    
    let options = Some(options);
    
    num += execute(
      sql,
      args,
      options.clone(),
    ).await?;
  }
  
  Ok(num)
}

// MARK: validate_option
/// 校验定时任务日志是否存在
#[allow(dead_code)]
pub async fn validate_option<T>(
  model: Option<T>,
) -> Result<T> {
  if model.is_none() {
    let table_comment = i18n_dao::ns(
      "定时任务日志".to_owned(),
      None,
    ).await?;
    let msg1 = i18n_dao::ns(
      "不存在".to_owned(),
      None,
    ).await?;
    let err_msg = table_comment + msg1.as_str();
    let backtrace = std::backtrace::Backtrace::capture();
    error!(
      "{req_id} {err_msg}: {backtrace}",
      req_id = get_req_id(),
    );
    return Err(eyre!(err_msg));
  }
  Ok(model.unwrap())
}
