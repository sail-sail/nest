use anyhow::Result;
use tracing::info;

use crate::common::util::string::*;

use crate::common::context::{
  Ctx,
  QueryArgs,
  Options,
  CountModel,
  UniqueType,
  SrvErr,
  get_short_uuid,
  get_order_by_query,
  get_page_query,
};

use crate::src::base::i18n::i18n_dao::NRoute;

use crate::common::gql::model::{PageInput, SortInput};

use crate::src::base::dict_detail::dict_detail_dao::get_dict;

use super::background_task_model::*;

#[allow(unused_variables)]
fn get_where_query<'a>(
  ctx: &mut impl Ctx<'a>,
  args: &mut QueryArgs,
  search: Option<BackgroundTaskSearch>,
) -> String {
  let mut where_query = String::with_capacity(80 * 15 * 2);
  {
    let is_deleted = search.as_ref()
      .and_then(|item| item.is_deleted)
      .unwrap_or(0);
    where_query += " t.is_deleted = ?";
    args.push(is_deleted.into());
  }
  {
    let id = match &search {
      Some(item) => &item.id,
      None => &None,
    };
    let id = match trim_opt(id) {
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
    let ids: Vec<String> = match &search {
      Some(item) => item.ids.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !ids.is_empty() {
      let arg = {
        let mut item = "".to_owned();
        for tmp in ids {
          item += "?,";
          args.push(tmp.into());
        }
        item = item.trim_end_matches(",").to_owned();
        item
      };
      where_query += &format!(" and id in ({})", arg);
    }
  }
  {
    let tenant_id = {
      let tenant_id = match &search {
        Some(item) => &item.tenant_id,
        None => &None,
      };
      let tenant_id = match trim_opt(tenant_id) {
        None => ctx.get_auth_tenant_id(),
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
  {
    let lbl = match &search {
      Some(item) => item.lbl.clone(),
      None => None,
    };
    if let Some(lbl) = lbl {
      where_query += &format!(" and t.lbl = {}", args.push(lbl.into()));
    }
    let lbl_like = match &search {
      Some(item) => item.lbl_like.clone(),
      None => None,
    };
    if let Some(lbl_like) = lbl_like {
      where_query += &format!(" and t.lbl like {}", args.push((sql_like(&lbl_like) + "%").into()));
    }
  }
  {
    let state: Vec<String> = match &search {
      Some(item) => item.state.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !state.is_empty() {
      let arg = {
        let mut item = "".to_owned();
        for tmp in state {
          item += &format!("{},", args.push(tmp.into()));
        }
        item = item.trim_end_matches(",").to_owned();
        item
      };
      where_query += &format!(" and t.state in ({})", arg);
    }
  }
  {
    let r#type: Vec<String> = match &search {
      Some(item) => item.r#type.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !r#type.is_empty() {
      let arg = {
        let mut item = "".to_owned();
        for tmp in r#type {
          item += &format!("{},", args.push(tmp.into()));
        }
        item = item.trim_end_matches(",").to_owned();
        item
      };
      where_query += &format!(" and t.type in ({})", arg);
    }
  }
  {
    let result = match &search {
      Some(item) => item.result.clone(),
      None => None,
    };
    if let Some(result) = result {
      where_query += &format!(" and t.result = {}", args.push(result.into()));
    }
    let result_like = match &search {
      Some(item) => item.result_like.clone(),
      None => None,
    };
    if let Some(result_like) = result_like {
      where_query += &format!(" and t.result like {}", args.push((sql_like(&result_like) + "%").into()));
    }
  }
  {
    let err_msg = match &search {
      Some(item) => item.err_msg.clone(),
      None => None,
    };
    if let Some(err_msg) = err_msg {
      where_query += &format!(" and t.err_msg = {}", args.push(err_msg.into()));
    }
    let err_msg_like = match &search {
      Some(item) => item.err_msg_like.clone(),
      None => None,
    };
    if let Some(err_msg_like) = err_msg_like {
      where_query += &format!(" and t.err_msg like {}", args.push((sql_like(&err_msg_like) + "%").into()));
    }
  }
  {
    let begin_time: Vec<chrono::NaiveDateTime> = match &search {
      Some(item) => item.begin_time.clone().unwrap_or_default(),
      None => vec![],
    };
    let begin_time_gt: Option<chrono::NaiveDateTime> = match &begin_time.len() {
      0 => None,
      _ => begin_time[0].clone().into(),
    };
    let begin_time_lt: Option<chrono::NaiveDateTime> = match &begin_time.len() {
      0 => None,
      1 => None,
      _ => begin_time[1].clone().into(),
    };
    if let Some(begin_time_gt) = begin_time_gt {
      where_query += &format!(" and t.begin_time >= {}", args.push(begin_time_gt.into()));
    }
    if let Some(begin_time_lt) = begin_time_lt {
      where_query += &format!(" and t.begin_time <= {}", args.push(begin_time_lt.into()));
    }
  }
  {
    let end_time: Vec<chrono::NaiveDateTime> = match &search {
      Some(item) => item.end_time.clone().unwrap_or_default(),
      None => vec![],
    };
    let end_time_gt: Option<chrono::NaiveDateTime> = match &end_time.len() {
      0 => None,
      _ => end_time[0].clone().into(),
    };
    let end_time_lt: Option<chrono::NaiveDateTime> = match &end_time.len() {
      0 => None,
      1 => None,
      _ => end_time[1].clone().into(),
    };
    if let Some(end_time_gt) = end_time_gt {
      where_query += &format!(" and t.end_time >= {}", args.push(end_time_gt.into()));
    }
    if let Some(end_time_lt) = end_time_lt {
      where_query += &format!(" and t.end_time <= {}", args.push(end_time_lt.into()));
    }
  }
  {
    let rem = match &search {
      Some(item) => item.rem.clone(),
      None => None,
    };
    if let Some(rem) = rem {
      where_query += &format!(" and t.rem = {}", args.push(rem.into()));
    }
    let rem_like = match &search {
      Some(item) => item.rem_like.clone(),
      None => None,
    };
    if let Some(rem_like) = rem_like {
      where_query += &format!(" and t.rem like {}", args.push((sql_like(&rem_like) + "%").into()));
    }
  }
  {
    let create_usr_id: Vec<String> = match &search {
      Some(item) => item.create_usr_id.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !create_usr_id.is_empty() {
      let arg = {
        let mut item = "".to_owned();
        for tmp in create_usr_id {
          item += &format!("{},", args.push(tmp.into()));
        }
        item = item.trim_end_matches(",").to_owned();
        item
      };
      where_query += &format!(" and create_usr_id_lbl.id in ({})", arg);
    }
  }
  {
    let create_usr_id_is_null: bool = match &search {
      Some(item) => item.create_usr_id_is_null.unwrap_or(false),
      None => false,
    };
    if create_usr_id_is_null {
      where_query += &format!(" and create_usr_id_lbl.id is null");
    }
  }
  where_query
}

fn get_from_query() -> &'static str {
  let from_query = r#"base_background_task t
    left join base_usr create_usr_id_lbl
      on create_usr_id_lbl.id = t.create_usr_id"#;
  from_query
}

/// 根据搜索条件和分页查找数据
#[allow(unused_variables)]
pub async fn find_all<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<BackgroundTaskSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<BackgroundTaskModel>> {
  
  #[allow(unused_variables)]
  let table = "base_background_task";
  let _method = "find_all";
  
  let mut args = QueryArgs::new();
  
  let from_query = get_from_query();
  let where_query = get_where_query(ctx, &mut args, search);
  let order_by_query = get_order_by_query(sort);
  let page_query = get_page_query(page);
  
  let sql = format!(r#"
    select
      t.*
      ,create_usr_id_lbl.lbl create_usr_id_lbl
    from
      {from_query}
    where
      {where_query}
    group by t.id{order_by_query}{page_query}
  "#);
  
  let args = args.into();
  
  let options = Options::from(options);
  
  let options = options.into();
  
  let mut res: Vec<BackgroundTaskModel> = ctx.query(
    sql,
    args,
    options,
  ).await?;
  
  let dict_vec = get_dict(ctx, &vec![
    "background_task_state",
    "background_task_type",
  ]).await?;
  
  let state_dict = &dict_vec[0];
  let type_dict = &dict_vec[1];
  
  for model in &mut res {
    
    // 状态
    model.state_lbl = {
      state_dict.iter()
        .find(|item| item.val == model.state.to_string())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.state.to_string())
    };
    
    // 类型
    model.r#type_lbl = {
      r#type_dict.iter()
        .find(|item| item.val == model.r#type.to_string())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.r#type.to_string())
    };
    
  }
  
  Ok(res)
}

/// 根据搜索条件查询数据总数
pub async fn find_count<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<BackgroundTaskSearch>,
  options: Option<Options>,
) -> Result<i64> {
  
  #[allow(unused_variables)]
  let table = "base_background_task";
  let _method = "find_count";
  
  let mut args = QueryArgs::new();
  
  let from_query = get_from_query();
  let where_query = get_where_query(ctx, &mut args, search);
  
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
  
  let res: Option<CountModel> = ctx.query_one(
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

/// 获取字段对应的国家化后的名称
pub async fn get_field_comments<'a>(
  ctx: &mut impl Ctx<'a>,
  _options: Option<Options>,
) -> Result<BackgroundTaskFieldComment> {
  
  let n_route = NRoute {
    route_path: "/background_task".to_owned().into(),
  };
  
  let field_comments = BackgroundTaskFieldComment {
    lbl: n_route.n(ctx, "名称".to_owned(), None).await?,
    state: n_route.n(ctx, "状态".to_owned(), None).await?,
    state_lbl: n_route.n(ctx, "状态".to_owned(), None).await?,
    r#type: n_route.n(ctx, "类型".to_owned(), None).await?,
    r#type_lbl: n_route.n(ctx, "类型".to_owned(), None).await?,
    result: n_route.n(ctx, "执行结果".to_owned(), None).await?,
    err_msg: n_route.n(ctx, "错误信息".to_owned(), None).await?,
    begin_time: n_route.n(ctx, "开始时间".to_owned(), None).await?,
    begin_time_lbl: n_route.n(ctx, "开始时间".to_owned(), None).await?,
    end_time: n_route.n(ctx, "结束时间".to_owned(), None).await?,
    end_time_lbl: n_route.n(ctx, "结束时间".to_owned(), None).await?,
    rem: n_route.n(ctx, "备注".to_owned(), None).await?,
    create_usr_id: n_route.n(ctx, "创建人".to_owned(), None).await?,
    create_usr_id_lbl: n_route.n(ctx, "创建人".to_owned(), None).await?,
  };
  Ok(field_comments)
}

/// 获得表的唯一字段名列表
#[allow(dead_code)]
pub fn get_unique_keys() -> Vec<&'static str> {
  let unique_keys = vec![
  ];
  unique_keys
}

/// 根据条件查找第一条数据
pub async fn find_one<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<BackgroundTaskSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<BackgroundTaskModel>> {
  
  let page = PageInput {
    pg_offset: 0.into(),
    pg_size: 1.into(),
  }.into();
  
  let res = find_all(
    ctx,
    search,
    page,
    sort,
    options,
  ).await?;
  
  let model: Option<BackgroundTaskModel> = res.into_iter().next();
  
  Ok(model)
}

/// 根据ID查找第一条数据
pub async fn find_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  options: Option<Options>,
) -> Result<Option<BackgroundTaskModel>> {
  
  let search = BackgroundTaskSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let res = find_one(
    ctx,
    search,
    None,
    options,
  ).await?;
  
  Ok(res)
}

/// 通过唯一约束获得一行数据
#[allow(unused_variables)]
pub async fn find_by_unique<'a>(
  ctx: &mut impl Ctx<'a>,
  search: BackgroundTaskSearch,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<BackgroundTaskModel>> {
  Ok(None)
}

/// 根据唯一约束对比对象是否相等
#[allow(dead_code)]
fn equals_by_unique(
  input: BackgroundTaskInput,
  model: BackgroundTaskModel,
) -> bool {
  if input.id.is_some() {
    return input.id.unwrap() == model.id;
  }
  false
}

/// 通过唯一约束检查数据是否已经存在
#[allow(unused_variables)]
pub async fn check_by_unique<'a>(
  ctx: &mut impl Ctx<'a>,
  input: BackgroundTaskInput,
  model: BackgroundTaskModel,
  unique_type: UniqueType,
) -> Result<Option<String>> {
  Ok(None)
}

#[allow(unused_variables)]
pub async fn set_id_by_lbl<'a>(
  ctx: &mut impl Ctx<'a>,
  input: BackgroundTaskInput,
) -> Result<BackgroundTaskInput> {
  
  #[allow(unused_mut)]
  let mut input = input;
  
  let dict_vec = get_dict(ctx, &vec![
    "background_task_state",
    "background_task_type",
  ]).await?;
  
  
  // 状态
  let state_dict = &dict_vec[0];
  if let Some(state_lbl) = input.state_lbl.clone() {
    input.state = state_dict.into_iter()
      .find(|item| {
        item.lbl == state_lbl
      })
      .map(|item| {
        item.val.parse().unwrap_or_default()
      })
      .into();
  }
  
  // 类型
  let type_dict = &dict_vec[1];
  if let Some(type_lbl) = input.type_lbl.clone() {
    input.r#type = type_dict.into_iter()
      .find(|item| {
        item.lbl == type_lbl
      })
      .map(|item| {
        item.val.parse().unwrap_or_default()
      })
      .into();
  }
  
  Ok(input)
}

/// 创建数据
pub async fn create<'a>(
  ctx: &mut impl Ctx<'a>,
  mut input: BackgroundTaskInput,
  options: Option<Options>,
) -> Result<String> {
  
  let table = "base_background_task";
  let _method = "create";
  
  let now = ctx.get_now();
  
  input = set_id_by_lbl(
    ctx,
    input,
  ).await?;
  
  let old_model = find_by_unique(
    ctx,
    input.clone().into(),
    None,
    None,
  ).await?;
  
  if old_model.is_some() {
    let id = check_by_unique(
      ctx,
      input.clone().into(),
      old_model.unwrap(),
      UniqueType::Throw,
    ).await?;
    match id {
      Some(id) => return Ok(id),
      None => {},
    }
  }
  
  let id = get_short_uuid();
  
  if input.id.is_none() {
    input.id = Some(id.clone().into());
  }
  
  let mut args = QueryArgs::new();
  
  let mut sql_fields = "id,create_time".to_owned();
  
  let mut sql_values = "?,?".to_owned();
  
  args.push(id.clone().into());
  args.push(now.into());
  
  
  if let Some(tenant_id) = ctx.get_auth_tenant_id() {
    sql_fields += ",tenant_id";
    sql_values += ",?";
    args.push(tenant_id.into());
  }
  
  if let Some(auth_model) = ctx.get_auth_model() {
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
  
  let sql = format!(
    "insert into {} ({}) values ({})",
    table,
    sql_fields,
    sql_values,
  );
  
  let args = args.into();
  
  let options = Options::from(options);
  
  let options = options.into();
  
  let num = ctx.execute(
    sql,
    args,
    options,
  ).await?;
  
  if num != 1 {
    return Err(SrvErr::msg("创建失败".to_owned()).into());
  }
  
  Ok(id)
}

/// 根据id修改租户id
pub async fn update_tenant_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  tenant_id: String,
  options: Option<Options>,
) -> Result<u64> {
  let table = "base_background_task";
  let _method = "update_tenant_by_id";
  
  let mut args = QueryArgs::new();
  
  let sql_fields = "tenant_id = ?,update_time = ?";
  args.push(tenant_id.into());
  args.push(ctx.get_now().into());
  
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
  
  let num = ctx.execute(
    sql,
    args,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据id修改数据
pub async fn update_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  mut input: BackgroundTaskInput,
  options: Option<Options>,
) -> Result<u64> {
  
  input = set_id_by_lbl(
    ctx,
    input,
  ).await?;
  
  let table = "base_background_task";
  let _method = "update_by_id";
  
  let now = ctx.get_now();
  
  let mut args = QueryArgs::new();
  
  let mut sql_fields = "update_time = ?".to_owned();
  args.push(now.into());
  
  let mut field_num: usize = 0;
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
  
  if field_num == 0 {
    return Ok(0);
  }
  
  if let Some(auth_model) = ctx.get_auth_model() {
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
  
  let num = ctx.execute(
    sql,
    args,
    options,
  ).await?;
  
  Ok(num)
}

/// 获取外键关联表, 第一个是主表
#[allow(dead_code)]
fn get_foreign_tables() -> Vec<&'static str> {
  let table = "base_background_task";
  vec![
    table,
    "usr",
  ]
}

/// 根据 ids 删除数据
pub async fn delete_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_background_task";
  let _method = "delete_by_ids";
  
  let options = Options::from(options);
  
  let mut num = 0;
  for id in ids {
    let mut args = QueryArgs::new();
    
    let sql = format!(
      "update {} set is_deleted=1,delete_time=? where id=? limit 1",
      table,
    );
    
    args.push(ctx.get_now().into());
    args.push(id.into());
    
    let args = args.into();
    
    let options = options.clone();
    
    let options = options.into();
    
    num += ctx.execute(
      sql,
      args,
      options,
    ).await?;
  }
  
  Ok(num)
}

/// 根据 ids 还原数据
pub async fn revert_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_background_task";
  let _method = "revert_by_ids";
  
  let options = Options::from(options);
  
  let mut num = 0;
  for id in ids {
    let mut args = QueryArgs::new();
    
    let sql = format!(
      "update {} set is_deleted=0 where id=? limit 1",
      table,
    );
    
    args.push(id.into());
    
    let args = args.into();
    
    let options = options.clone();
    
    let options = options.into();
    
    num += ctx.execute(
      sql,
      args,
      options,
    ).await?;
  }
  
  Ok(num)
}

/// 根据 ids 彻底删除数据
pub async fn force_delete_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_background_task";
  let _method = "force_delete_by_ids";
  
  let options = Options::from(options);
  
  let mut num = 0;
  for id in ids {
    
    let model = find_by_id(ctx, id.clone(), None).await?;
    info!("force_delete_by_ids: {:?}", model);
    
    if model.is_none() {
      continue;
    }
    
    let mut args = QueryArgs::new();
    
    let sql = format!(
      "delete from {} set where id=? and is_deleted = 1 limit 1",
      table,
    );
    
    args.push(id.into());
    
    let args = args.into();
    
    let options = options.clone();
    
    let options = options.into();
    
    num += ctx.execute(
      sql,
      args,
      options,
    ).await?;
  }
  
  Ok(num)
}
