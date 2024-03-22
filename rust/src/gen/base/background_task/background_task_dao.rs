#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use std::collections::HashSet;

use anyhow::Result;
use tracing::{info, error};
#[allow(unused_imports)]
use crate::common::util::string::*;

#[allow(unused_imports)]
use crate::common::context::{
  get_auth_model,
  get_auth_id,
  get_auth_tenant_id,
  get_auth_org_id,
  execute,
  query,
  query_one,
  get_now,
  get_req_id,
  QueryArgs,
  Options,
  CountModel,
  UniqueType,
  SrvErr,
  get_short_uuid,
  get_order_by_query,
  get_page_query,
  del_caches,
  IS_DEBUG,
};

use crate::src::base::i18n::i18n_dao;

use crate::common::gql::model::{
  PageInput,
  SortInput,
};

use crate::src::base::dict_detail::dict_detail_dao::get_dict;

use super::background_task_model::*;

use crate::gen::base::tenant::tenant_model::TenantId;
use crate::gen::base::usr::usr_model::UsrId;

#[allow(unused_variables)]
async fn get_where_query(
  args: &mut QueryArgs,
  search: Option<&BackgroundTaskSearch>,
  options: Option<&Options>,
) -> Result<String> {
  let is_deleted = search
    .and_then(|item| item.is_deleted)
    .unwrap_or(0);
  let mut where_query = String::with_capacity(80 * 15 * 2);
  where_query += " t.is_deleted = ?";
  args.push(is_deleted.into());
  {
    let id = match search {
      Some(item) => item.id.as_ref(),
      None => None,
    };
    let id = match id {
      None => None,
      Some(item) => match item.as_str() {
        "-" => None,
        _ => item.into(),
      },
    };
    if let Some(id) = id {
      where_query += " and t.id = ?";
      args.push(id.into());
    }
  }
  {
    let ids: Option<Vec<BackgroundTaskId>> = match search {
      Some(item) => item.ids.clone(),
      None => None,
    };
    if let Some(ids) = ids {
      let arg = {
        let mut items = Vec::with_capacity(ids.len());
        for id in ids {
          args.push(id.into());
          items.push("?");
        }
        items.join(",")
      };
      where_query += &format!(" and t.id in ({arg})");
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
      where_query += " and t.tenant_id = ?";
      args.push(tenant_id.into());
    }
  }
  // 名称
  {
    let lbl = match search {
      Some(item) => item.lbl.clone(),
      None => None,
    };
    if let Some(lbl) = lbl {
      where_query += &format!(" and t.lbl = {}", args.push(lbl.into()));
    }
    let lbl_like = match search {
      Some(item) => item.lbl_like.clone(),
      None => None,
    };
    if let Some(lbl_like) = lbl_like {
      where_query += &format!(
        " and t.lbl like {}",
        args.push(
          format!("%{}%", sql_like(&lbl_like)).into()
        ),
      );
    }
  }
  // 状态
  {
    let state: Option<Vec<BackgroundTaskState>> = match search {
      Some(item) => item.state.clone(),
      None => None,
    };
    if let Some(state) = state {
      let arg = {
        let mut items = Vec::with_capacity(state.len());
        for item in state {
          args.push(item.into());
          items.push("?");
        }
        items.join(",")
      };
      where_query += &format!(" and t.state in ({})", arg);
    }
  }
  // 类型
  {
    let r#type: Option<Vec<BackgroundTaskType>> = match search {
      Some(item) => item.r#type.clone(),
      None => None,
    };
    if let Some(r#type) = r#type {
      let arg = {
        let mut items = Vec::with_capacity(r#type.len());
        for item in r#type {
          args.push(item.into());
          items.push("?");
        }
        items.join(",")
      };
      where_query += &format!(" and t.type in ({})", arg);
    }
  }
  // 执行结果
  {
    let result = match search {
      Some(item) => item.result.clone(),
      None => None,
    };
    if let Some(result) = result {
      where_query += &format!(" and t.result = {}", args.push(result.into()));
    }
    let result_like = match search {
      Some(item) => item.result_like.clone(),
      None => None,
    };
    if let Some(result_like) = result_like {
      where_query += &format!(
        " and t.result like {}",
        args.push(
          format!("%{}%", sql_like(&result_like)).into()
        ),
      );
    }
  }
  // 错误信息
  {
    let err_msg = match search {
      Some(item) => item.err_msg.clone(),
      None => None,
    };
    if let Some(err_msg) = err_msg {
      where_query += &format!(" and t.err_msg = {}", args.push(err_msg.into()));
    }
    let err_msg_like = match search {
      Some(item) => item.err_msg_like.clone(),
      None => None,
    };
    if let Some(err_msg_like) = err_msg_like {
      where_query += &format!(
        " and t.err_msg like {}",
        args.push(
          format!("%{}%", sql_like(&err_msg_like)).into()
        ),
      );
    }
  }
  // 开始时间
  {
    let mut begin_time: Vec<Option<chrono::NaiveDateTime>> = match search {
      Some(item) => item.begin_time.clone().unwrap_or_default(),
      None => Default::default(),
    };
    let begin_time_gt: Option<chrono::NaiveDateTime> = begin_time.get_mut(0)
      .and_then(|item| item.take());
    let begin_time_lt: Option<chrono::NaiveDateTime> = begin_time.get_mut(1)
      .and_then(|item| item.take());
    if let Some(begin_time_gt) = begin_time_gt {
      where_query += &format!(" and t.begin_time >= {}", args.push(begin_time_gt.into()));
    }
    if let Some(begin_time_lt) = begin_time_lt {
      where_query += &format!(" and t.begin_time <= {}", args.push(begin_time_lt.into()));
    }
  }
  // 结束时间
  {
    let mut end_time: Vec<Option<chrono::NaiveDateTime>> = match search {
      Some(item) => item.end_time.clone().unwrap_or_default(),
      None => Default::default(),
    };
    let end_time_gt: Option<chrono::NaiveDateTime> = end_time.get_mut(0)
      .and_then(|item| item.take());
    let end_time_lt: Option<chrono::NaiveDateTime> = end_time.get_mut(1)
      .and_then(|item| item.take());
    if let Some(end_time_gt) = end_time_gt {
      where_query += &format!(" and t.end_time >= {}", args.push(end_time_gt.into()));
    }
    if let Some(end_time_lt) = end_time_lt {
      where_query += &format!(" and t.end_time <= {}", args.push(end_time_lt.into()));
    }
  }
  // 备注
  {
    let rem = match search {
      Some(item) => item.rem.clone(),
      None => None,
    };
    if let Some(rem) = rem {
      where_query += &format!(" and t.rem = {}", args.push(rem.into()));
    }
    let rem_like = match search {
      Some(item) => item.rem_like.clone(),
      None => None,
    };
    if let Some(rem_like) = rem_like {
      where_query += &format!(
        " and t.rem like {}",
        args.push(
          format!("%{}%", sql_like(&rem_like)).into()
        ),
      );
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
        let mut items = Vec::with_capacity(create_usr_id.len());
        for item in create_usr_id {
          args.push(item.into());
          items.push("?");
        }
        items.join(",")
      };
      where_query += &format!(" and create_usr_id_lbl.id in ({})", arg);
    }
  }
  {
    let create_usr_id_is_null: bool = match search {
      Some(item) => item.create_usr_id_is_null.unwrap_or(false),
      None => false,
    };
    if create_usr_id_is_null {
      where_query += " and create_usr_id_lbl.id is null";
    }
  }
  // 创建时间
  {
    let mut create_time: Vec<Option<chrono::NaiveDateTime>> = match search {
      Some(item) => item.create_time.clone().unwrap_or_default(),
      None => Default::default(),
    };
    let create_time_gt: Option<chrono::NaiveDateTime> = create_time.get_mut(0)
      .and_then(|item| item.take());
    let create_time_lt: Option<chrono::NaiveDateTime> = create_time.get_mut(1)
      .and_then(|item| item.take());
    if let Some(create_time_gt) = create_time_gt {
      where_query += &format!(" and t.create_time >= {}", args.push(create_time_gt.into()));
    }
    if let Some(create_time_lt) = create_time_lt {
      where_query += &format!(" and t.create_time <= {}", args.push(create_time_lt.into()));
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
        let mut items = Vec::with_capacity(update_usr_id.len());
        for item in update_usr_id {
          args.push(item.into());
          items.push("?");
        }
        items.join(",")
      };
      where_query += &format!(" and update_usr_id_lbl.id in ({})", arg);
    }
  }
  {
    let update_usr_id_is_null: bool = match search {
      Some(item) => item.update_usr_id_is_null.unwrap_or(false),
      None => false,
    };
    if update_usr_id_is_null {
      where_query += " and update_usr_id_lbl.id is null";
    }
  }
  // 更新时间
  {
    let mut update_time: Vec<Option<chrono::NaiveDateTime>> = match search {
      Some(item) => item.update_time.clone().unwrap_or_default(),
      None => Default::default(),
    };
    let update_time_gt: Option<chrono::NaiveDateTime> = update_time.get_mut(0)
      .and_then(|item| item.take());
    let update_time_lt: Option<chrono::NaiveDateTime> = update_time.get_mut(1)
      .and_then(|item| item.take());
    if let Some(update_time_gt) = update_time_gt {
      where_query += &format!(" and t.update_time >= {}", args.push(update_time_gt.into()));
    }
    if let Some(update_time_lt) = update_time_lt {
      where_query += &format!(" and t.update_time <= {}", args.push(update_time_lt.into()));
    }
  }
  Ok(where_query)
}

#[allow(unused_variables)]
async fn get_from_query(
  args: &mut QueryArgs,
  search: Option<&BackgroundTaskSearch>,
  options: Option<&Options>,
) -> Result<String> {
  let from_query = r#"base_background_task t
    left join base_usr create_usr_id_lbl
      on create_usr_id_lbl.id = t.create_usr_id
    left join base_usr update_usr_id_lbl
      on update_usr_id_lbl.id = t.update_usr_id"#.to_owned();
  Ok(from_query)
}

/// 根据搜索条件和分页查找后台任务列表
pub async fn find_all(
  search: Option<BackgroundTaskSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<BackgroundTaskModel>> {
  
  let table = "base_background_task";
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
  
  let options = Options::from(options)
    .set_is_debug(false);
  let options = Some(options);
  
  #[allow(unused_variables)]
  let is_deleted = search.as_ref()
    .and_then(|item| item.is_deleted);
  
  let mut args = QueryArgs::new();
  
  let from_query = get_from_query(&mut args, search.as_ref(), options.as_ref()).await?;
  let where_query = get_where_query(&mut args, search.as_ref(), options.as_ref()).await?;
  
  let mut sort = sort.unwrap_or_default();
  if !sort.iter().any(|item| item.prop == "begin_time") {
    sort.push(SortInput {
      prop: "begin_time".into(),
      order: "desc".into(),
    });
  }
  if !sort.iter().any(|item| item.prop == "create_time") {
    sort.push(SortInput {
      prop: "create_time".into(),
      order: "asc".into(),
    });
  }
  let sort = sort.into();
  
  let order_by_query = get_order_by_query(sort);
  let page_query = get_page_query(page);
  
  let sql = format!(r#"
    select
      t.*
      ,create_usr_id_lbl.lbl create_usr_id_lbl
      ,update_usr_id_lbl.lbl update_usr_id_lbl
    from
      {from_query}
    where
      {where_query}
    group by t.id{order_by_query}{page_query}
  "#);
  
  let args = args.into();
  
  let options = Options::from(options);
  
  let options = options.into();
  
  let mut res: Vec<BackgroundTaskModel> = query(
    sql,
    args,
    options,
  ).await?;
  
  let dict_vec = get_dict(&[
    "background_task_state",
    "background_task_type",
  ]).await?;
  let [
    state_dict,
    type_dict,
  ]: [Vec<_>; 2] = dict_vec
    .try_into()
    .map_err(|err| anyhow::anyhow!(format!("{:#?}", err)))?;
  
  #[allow(unused_variables)]
  for model in &mut res {
    
    // 状态
    model.state_lbl = {
      state_dict
        .iter()
        .find(|item| item.val == model.state.as_str())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.state.to_string())
    };
    
    // 类型
    model.r#type_lbl = {
      r#type_dict
        .iter()
        .find(|item| item.val == model.r#type.as_str())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.r#type.to_string())
    };
    
  }
  
  Ok(res)
}

/// 根据条件查找后台任务总数
pub async fn find_count(
  search: Option<BackgroundTaskSearch>,
  options: Option<Options>,
) -> Result<i64> {
  
  let table = "base_background_task";
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
    .set_is_debug(false);
  let options = Some(options);
  
  let mut args = QueryArgs::new();
  
  let from_query = get_from_query(&mut args, search.as_ref(), options.as_ref()).await?;
  let where_query = get_where_query(&mut args, search.as_ref(), options.as_ref()).await?;
  
  let sql = format!(r#"
    select
      count(1) total
    from
      (
        select
          1
        from
          {from_query}
        where
          {where_query}
        group by t.id
      ) t
  "#);
  
  let args = args.into();
  
  let options = Options::from(options);
  
  let options = options.into();
  
  let res: Option<CountModel> = query_one(
    sql,
    args,
    options,
  ).await?;
  
  let total = res
    .map(|item| item.total)
    .unwrap_or_default()
    ;
  
  Ok(total)
}

/// 获取路由地址
pub fn get_route_path() -> String {
  "/base/background_task".to_owned()
}

/// 获取当前路由的国际化
pub fn get_n_route() -> i18n_dao::NRoute {
  i18n_dao::NRoute {
    route_path: get_route_path().into(),
  }
}

/// 获取后台任务字段注释
pub async fn get_field_comments(
  _options: Option<Options>,
) -> Result<BackgroundTaskFieldComment> {
  
  let n_route = get_n_route();
  
  let i18n_code_maps: Vec<i18n_dao::I18nCodeMap> = vec![
    "ID".into(),
    "名称".into(),
    "状态".into(),
    "状态".into(),
    "类型".into(),
    "类型".into(),
    "执行结果".into(),
    "错误信息".into(),
    "开始时间".into(),
    "开始时间".into(),
    "结束时间".into(),
    "结束时间".into(),
    "备注".into(),
    "创建人".into(),
    "创建人".into(),
    "创建时间".into(),
    "创建时间".into(),
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
  
  let field_comments = BackgroundTaskFieldComment {
    id: vec[0].to_owned(),
    lbl: vec[1].to_owned(),
    state: vec[2].to_owned(),
    state_lbl: vec[3].to_owned(),
    r#type: vec[4].to_owned(),
    type_lbl: vec[5].to_owned(),
    result: vec[6].to_owned(),
    err_msg: vec[7].to_owned(),
    begin_time: vec[8].to_owned(),
    begin_time_lbl: vec[9].to_owned(),
    end_time: vec[10].to_owned(),
    end_time_lbl: vec[11].to_owned(),
    rem: vec[12].to_owned(),
    create_usr_id: vec[13].to_owned(),
    create_usr_id_lbl: vec[14].to_owned(),
    create_time: vec[15].to_owned(),
    create_time_lbl: vec[16].to_owned(),
    update_usr_id: vec[17].to_owned(),
    update_usr_id_lbl: vec[18].to_owned(),
    update_time: vec[19].to_owned(),
    update_time_lbl: vec[20].to_owned(),
  };
  Ok(field_comments)
}

/// 根据条件查找第一个后台任务
pub async fn find_one(
  search: Option<BackgroundTaskSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<BackgroundTaskModel>> {
  
  let table = "base_background_task";
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
    .set_is_debug(false);
  let options = Some(options);
  
  let options = Options::from(options)
    .set_is_debug(false);
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
  
  let model: Option<BackgroundTaskModel> = res.into_iter().next();
  
  Ok(model)
}

/// 根据 id 查找后台任务
pub async fn find_by_id(
  id: BackgroundTaskId,
  options: Option<Options>,
) -> Result<Option<BackgroundTaskModel>> {
  
  let table = "base_background_task";
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
    .set_is_debug(false);
  let options = Some(options);
  
  let search = BackgroundTaskSearch {
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

/// 根据搜索条件判断后台任务是否存在
pub async fn exists(
  search: Option<BackgroundTaskSearch>,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = "base_background_task";
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
    .set_is_debug(false);
  let options = Some(options);
  
  let total = find_count(
    search,
    options,
  ).await?;
  
  Ok(total > 0)
}

/// 根据 id 判断后台任务是否存在
pub async fn exists_by_id(
  id: BackgroundTaskId,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = "base_background_task";
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
    .set_is_debug(false);
  let options = Some(options);
  
  let search = BackgroundTaskSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let res = exists(
    search,
    options,
  ).await?;
  
  Ok(res)
}

/// 通过唯一约束获得数据列表
#[allow(unused_variables)]
pub async fn find_by_unique(
  search: BackgroundTaskSearch,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<BackgroundTaskModel>> {
  
  let table = "base_background_task";
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
    .set_is_debug(false);
  let options = Some(options);
  
  if let Some(id) = search.id {
    let model = find_by_id(
      id,
      None,
    ).await?;
    return Ok(model.map_or_else(Vec::new, |m| vec![m]));
  }
  
  Ok(vec![])
}

/// 根据唯一约束对比对象是否相等
#[allow(dead_code)]
fn equals_by_unique(
  input: &BackgroundTaskInput,
  model: &BackgroundTaskModel,
) -> bool {
  if input.id.as_ref().is_some() {
    return input.id.as_ref().unwrap() == &model.id;
  }
  false
}

/// 通过唯一约束检查数据是否已经存在
#[allow(unused_variables)]
pub async fn check_by_unique(
  input: BackgroundTaskInput,
  model: BackgroundTaskModel,
  options: Option<Options>,
) -> Result<Option<BackgroundTaskId>> {
  
  let table = "base_background_task";
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
    .set_is_debug(false);
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
    let options = Options::new();
    let id = update_by_id(
      model.id.clone(),
      input,
      Some(options),
    ).await?;
    return Ok(id.into());
  }
  if unique_type == UniqueType::Throw {
    let table_comment = i18n_dao::ns(
      "后台任务".to_owned(),
      None,
    ).await?;
    let map = HashMap::from([
      ("0".to_owned(), table_comment),
    ]);
    let err_msg = i18n_dao::ns(
      "此 {0} 已经存在".to_owned(),
      map.into(),
    ).await?;
    return Err(SrvErr::msg(err_msg).into());
  }
  Ok(None)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(unused_variables)]
pub async fn set_id_by_lbl(
  input: BackgroundTaskInput,
) -> Result<BackgroundTaskInput> {
  
  #[allow(unused_mut)]
  let mut input = input;
  
  let dict_vec = get_dict(&[
    "background_task_state",
    "background_task_type",
  ]).await?;
  
  // 状态
  if input.state.is_none() {
    let state_dict = &dict_vec[0];
    if let Some(state_lbl) = input.state_lbl.clone() {
      input.state = state_dict
        .iter()
        .find(|item| {
          item.lbl == state_lbl
        })
        .map(|item| {
          item.val.parse().unwrap_or_default()
        });
    }
  }
  
  // 类型
  if input.r#type.is_none() {
    let type_dict = &dict_vec[1];
    if let Some(type_lbl) = input.type_lbl.clone() {
      input.r#type = type_dict
        .iter()
        .find(|item| {
          item.lbl == type_lbl
        })
        .map(|item| {
          item.val.parse().unwrap_or_default()
        });
    }
  }
  
  Ok(input)
}

pub fn get_is_debug(
  options: Option<&Options>,
) -> bool {
  let mut is_debug: bool = *IS_DEBUG;
  if let Some(options) = &options {
    is_debug = options.get_is_debug();
  }
  is_debug
}

/// 创建后台任务
pub async fn create(
  #[allow(unused_mut)]
  mut input: BackgroundTaskInput,
  options: Option<Options>,
) -> Result<BackgroundTaskId> {
  
  let table = "base_background_task";
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
  
  let options = Options::from(options)
    .set_is_debug(false);
  let options = Some(options);
  
  if input.id.is_some() {
    return Err(SrvErr::msg(
      format!("Can not set id when create in dao: {table}")
    ).into());
  }
  
  let now = get_now();
  
  let old_models = find_by_unique(
    input.clone().into(),
    None,
    None,
  ).await?;
  
  if !old_models.is_empty() {
    
    let unique_type = options.as_ref()
      .and_then(|item|
        item.get_unique_type()
      )
      .unwrap_or_default();
    
    let mut id: Option<BackgroundTaskId> = None;
    
    for old_model in old_models {
      
      let options = Options::from(options.clone())
        .set_unique_type(unique_type);
      let options = Some(options);
      
      id = check_by_unique(
        input.clone(),
        old_model,
        options,
      ).await?;
      
      if id.is_some() {
        break;
      }
    }
    
    if let Some(id) = id {
      return Ok(id);
    }
  }
  
  let mut id: BackgroundTaskId;
  loop {
    id = get_short_uuid().into();
    let is_exist = exists_by_id(
      id.clone(),
      None,
    ).await?;
    if !is_exist {
      break;
    }
    error!(
      "{req_id} ID_COLLIDE: {table} {id}",
      req_id = get_req_id(),
    );
  }
  let id = id;
  
  let mut args = QueryArgs::new();
  
  let mut sql_fields = "id,create_time".to_owned();
  
  let mut sql_values = "?,?".to_owned();
  
  args.push(id.clone().into());
  args.push(now.into());
  
  if let Some(tenant_id) = input.tenant_id {
    sql_fields += ",tenant_id";
    sql_values += ",?";
    args.push(tenant_id.into());
  } else if let Some(tenant_id) = get_auth_tenant_id() {
    sql_fields += ",tenant_id";
    sql_values += ",?";
    args.push(tenant_id.into());
  }
  
  if let Some(auth_model) = get_auth_model() {
    let usr_id = auth_model.id;
    sql_fields += ",create_usr_id";
    sql_values += ",?";
    args.push(usr_id.into());
  }
  // 名称
  if let Some(lbl) = input.lbl {
    sql_fields += ",lbl";
    sql_values += ",?";
    args.push(lbl.into());
  }
  // 状态
  if let Some(state) = input.state {
    sql_fields += ",state";
    sql_values += ",?";
    args.push(state.into());
  }
  // 类型
  if let Some(r#type) = input.r#type {
    sql_fields += ",type";
    sql_values += ",?";
    args.push(r#type.into());
  }
  // 执行结果
  if let Some(result) = input.result {
    sql_fields += ",result";
    sql_values += ",?";
    args.push(result.into());
  }
  // 错误信息
  if let Some(err_msg) = input.err_msg {
    sql_fields += ",err_msg";
    sql_values += ",?";
    args.push(err_msg.into());
  }
  // 开始时间
  if let Some(begin_time) = input.begin_time {
    sql_fields += ",begin_time";
    sql_values += ",?";
    args.push(begin_time.into());
  }
  // 结束时间
  if let Some(end_time) = input.end_time {
    sql_fields += ",end_time";
    sql_values += ",?";
    args.push(end_time.into());
  }
  // 备注
  if let Some(rem) = input.rem {
    sql_fields += ",rem";
    sql_values += ",?";
    args.push(rem.into());
  }
  // 更新人
  if let Some(update_usr_id) = input.update_usr_id {
    sql_fields += ",update_usr_id";
    sql_values += ",?";
    args.push(update_usr_id.into());
  }
  // 更新时间
  if let Some(update_time) = input.update_time {
    sql_fields += ",update_time";
    sql_values += ",?";
    args.push(update_time.into());
  }
  
  let sql = format!(
    "insert into {} ({}) values ({})",
    table,
    sql_fields,
    sql_values,
  );
  
  let args = args.into();
  
  let options = Options::from(options);
  
  let options = options.into();
  
  execute(
    sql,
    args,
    options,
  ).await?;
  
  Ok(id)
}

/// 后台任务根据id修改租户id
pub async fn update_tenant_by_id(
  id: BackgroundTaskId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  let table = "base_background_task";
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
    .set_is_debug(false);
  let options = options.into();
  
  let mut args = QueryArgs::new();
  
  let sql_fields = "tenant_id = ?,update_time = ?";
  args.push(tenant_id.into());
  args.push(get_now().into());
  
  let sql_where = "id = ?";
  args.push(id.into());
  
  let sql = format!(
    "update {} set {} where {}",
    table,
    sql_fields,
    sql_where,
  );
  
  let args = args.into();
  
  let options = Options::from(options);
  
  let options = options.into();
  
  let num = execute(
    sql,
    args,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改后台任务
#[allow(unused_mut)]
pub async fn update_by_id(
  id: BackgroundTaskId,
  mut input: BackgroundTaskInput,
  options: Option<Options>,
) -> Result<BackgroundTaskId> {
  
  let old_model = find_by_id(
    id.clone(),
    None,
  ).await?;
  
  if old_model.is_none() {
    let table_comment = i18n_dao::ns(
      "后台任务".to_owned(),
      None,
    ).await?;
    let map = HashMap::from([
      ("0".to_owned(), table_comment),
    ]);
    let err_msg = i18n_dao::ns(
      "编辑失败, 此 {0} 已被删除".to_owned(),
      map.into(),
    ).await?;
    return Err(SrvErr::msg(err_msg).into());
  }
  
  {
    let mut input = input.clone();
    input.id = None;
    
    let models = find_by_unique(
      input.into(),
      None,
      None,
    ).await?;
    
    let models = models.into_iter()
      .filter(|item| 
        item.id != id
      )
      .collect::<Vec<BackgroundTaskModel>>();
    
    if !models.is_empty() {
      let unique_type = {
        if let Some(options) = options.as_ref() {
          options.get_unique_type()
            .unwrap_or(UniqueType::Throw)
        } else {
          UniqueType::Throw
        }
      };
      if unique_type == UniqueType::Throw {
        let table_comment = i18n_dao::ns(
          "后台任务".to_owned(),
          None,
        ).await?;
        let map = HashMap::from([
          ("0".to_owned(), table_comment),
        ]);
        let err_msg = i18n_dao::ns(
          "此 {0} 已经存在".to_owned(),
          map.into(),
        ).await?;
        return Err(SrvErr::msg(err_msg).into());
      } else if unique_type == UniqueType::Ignore {
        return Ok(id);
      }
    }
  }
  
  let table = "base_background_task";
  let method = "update_by_id";
  
  let is_debug = get_is_debug(options.as_ref());
  
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
    .set_is_debug(false);
  let options = Some(options);
  
  let now = get_now();
  
  let mut args = QueryArgs::new();
  
  let mut sql_fields = "update_time = ?".to_owned();
  args.push(now.into());
  
  let mut field_num: usize = 0;
  
  if let Some(tenant_id) = input.tenant_id {
    field_num += 1;
    sql_fields += ",tenant_id = ?";
    args.push(tenant_id.into());
  }
  // 名称
  if let Some(lbl) = input.lbl {
    field_num += 1;
    sql_fields += ",lbl = ?";
    args.push(lbl.into());
  }
  // 状态
  if let Some(state) = input.state {
    field_num += 1;
    sql_fields += ",state = ?";
    args.push(state.into());
  }
  // 类型
  if let Some(r#type) = input.r#type {
    field_num += 1;
    sql_fields += ",type = ?";
    args.push(r#type.into());
  }
  // 执行结果
  if let Some(result) = input.result {
    field_num += 1;
    sql_fields += ",result = ?";
    args.push(result.into());
  }
  // 错误信息
  if let Some(err_msg) = input.err_msg {
    field_num += 1;
    sql_fields += ",err_msg = ?";
    args.push(err_msg.into());
  }
  // 开始时间
  if let Some(begin_time) = input.begin_time {
    field_num += 1;
    sql_fields += ",begin_time = ?";
    args.push(begin_time.into());
  }
  // 结束时间
  if let Some(end_time) = input.end_time {
    field_num += 1;
    sql_fields += ",end_time = ?";
    args.push(end_time.into());
  }
  // 备注
  if let Some(rem) = input.rem {
    field_num += 1;
    sql_fields += ",rem = ?";
    args.push(rem.into());
  }
  
  if field_num > 0 {
    
    if let Some(auth_model) = get_auth_model() {
      let usr_id = auth_model.id;
      sql_fields += ",update_usr_id = ?";
      args.push(usr_id.into());
    }
    
    let sql_where = "id = ?";
    args.push(id.clone().into());
    
    let sql = format!(
      "update {} set {} where {} limit 1",
      table,
      sql_fields,
      sql_where,
    );
    
    let args = args.into();
    
    let options = Options::from(options);
    
    let options = options.into();
    
    execute(
      sql,
      args,
      options,
    ).await?;
    
  }
  
  if field_num > 0 {
    let options = Options::from(None);
    let options = options.set_del_cache_key1s(get_foreign_tables());
    if let Some(del_cache_key1s) = options.get_del_cache_key1s() {
      del_caches(
        del_cache_key1s
          .iter()
          .map(|item| item.as_str())
          .collect::<Vec<&str>>()
          .as_slice()
      ).await?;
    }
  }
  
  Ok(id)
}

/// 获取外键关联表, 第一个是主表
#[allow(dead_code)]
fn get_foreign_tables() -> Vec<&'static str> {
  let table = "base_background_task";
  vec![
    table,
    "base_usr",
  ]
}

/// 清空缓存
#[allow(dead_code)]
pub async fn del_cache() -> Result<()> {
  let cache_key1s = get_foreign_tables();
  del_caches(
    cache_key1s.as_slice(),
  ).await?;
  Ok(())
}

/// 根据 ids 删除后台任务
pub async fn delete_by_ids(
  ids: Vec<BackgroundTaskId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_background_task";
  let method = "delete_by_ids";
  
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
  
  let options = Options::from(options)
    .set_is_debug(false);
  
  let mut num = 0;
  for id in ids.clone() {
    let mut args = QueryArgs::new();
    
    let sql = format!(
      "update {} set is_deleted=1,delete_time=? where id=? limit 1",
      table,
    );
    
    args.push(get_now().into());
    args.push(id.into());
    
    let args = args.into();
    
    let options = options.clone();
    
    let options = options.into();
    
    num += execute(
      sql,
      args,
      options,
    ).await?;
  }
  
  Ok(num)
}

/// 根据 ids 还原后台任务
pub async fn revert_by_ids(
  ids: Vec<BackgroundTaskId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_background_task";
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
    .set_is_debug(false);
  
  let mut num = 0;
  for id in ids.clone() {
    let mut args = QueryArgs::new();
    
    let sql = format!(
      "update {} set is_deleted=0 where id=? limit 1",
      table,
    );
    
    args.push(id.clone().into());
    
    let args = args.into();
    
    let options = options.clone();
    
    let options = options.into();
    
    num += execute(
      sql,
      args,
      options,
    ).await?;
    
    // 检查数据的唯一索引
    {
      let old_model = find_by_id(
        id.clone(),
        None,
      ).await?;
      
      if old_model.is_none() {
        continue;
      }
      let old_model = old_model.unwrap();
      
      let mut input: BackgroundTaskInput = old_model.into();
      input.id = None;
      
      let models = find_by_unique(
        input.into(),
        None,
        None,
      ).await?;
      
      let models: Vec<BackgroundTaskModel> = models.into_iter()
        .filter(|item| 
          item.id != id
        )
        .collect();
      
      if !models.is_empty() {
        let table_comment = i18n_dao::ns(
          "后台任务".to_owned(),
          None,
        ).await?;
        let map = HashMap::from([
          ("0".to_owned(), table_comment),
        ]);
        let err_msg = i18n_dao::ns(
          "此 {0} 已经存在".to_owned(),
          map.into(),
        ).await?;
        return Err(SrvErr::msg(err_msg).into());
      }
    }
    
  }
  
  Ok(num)
}

/// 根据 ids 彻底删除后台任务
pub async fn force_delete_by_ids(
  ids: Vec<BackgroundTaskId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_background_task";
  let method = "force_delete_by_ids";
  
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
    .set_is_debug(false);
  
  let mut num = 0;
  for id in ids.clone() {
    
    let model = find_all(
      BackgroundTaskSearch {
        id: id.clone().into(),
        is_deleted: 1.into(),
        ..Default::default()
      }.into(),
      None,
      None, 
      options.clone().into(),
    ).await?.into_iter().next();
    
    if model.is_none() {
      continue;
    }
    
    info!("force_delete_by_ids: {}", serde_json::to_string(&model)?);
    
    let mut args = QueryArgs::new();
    
    let sql = format!(
      "delete from {table} where id=? and is_deleted = 1 limit 1",
    );
    
    args.push(id.into());
    
    let args = args.into();
    
    let options = options.clone();
    
    let options = options.into();
    
    num += execute(
      sql,
      args,
      options,
    ).await?;
  }
  
  Ok(num)
}

/// 校验后台任务是否存在
#[function_name::named]
#[allow(dead_code)]
pub async fn validate_option<'a, T>(
  model: Option<T>,
) -> Result<T> {
  if model.is_none() {
    let table_comment = i18n_dao::ns(
      "后台任务".to_owned(),
      None,
    ).await?;
    let msg1 = i18n_dao::ns(
      "不存在".to_owned(),
      None,
    ).await?;
    let err_msg = table_comment + &msg1;
    return Err(SrvErr::new(function_name!().to_owned(), err_msg).into());
  }
  Ok(model.unwrap())
}
