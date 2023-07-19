use tracing::instrument;
use anyhow::Result;
use tracing::info;

use crate::common::util::string::*;

#[allow(unused_imports)]
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

use crate::src::base::i18n::i18n_dao;

use crate::common::gql::model::{PageInput, SortInput};

use super::i18n_model::*;

#[allow(unused_variables)]
fn get_where_query<'a>(
  ctx: &mut impl Ctx<'a>,
  args: &mut QueryArgs,
  search: Option<I18nSearch>,
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
        let mut items = Vec::with_capacity(ids.len());
        for id in ids {
          args.push(id.into());
          items.push("?");
        }
        items.join(",")
      };
      where_query += &format!(" and t.id in ({})", arg);
    }
  }
  {
    let lang_id: Vec<String> = match &search {
      Some(item) => item.lang_id.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !lang_id.is_empty() {
      let arg = {
        let mut items = Vec::with_capacity(lang_id.len());
        for item in lang_id {
          args.push(item.into());
          items.push("?");
        }
        items.join(",")
      };
      where_query += &format!(" and lang_id_lbl.id in ({})", arg);
    }
  }
  {
    let lang_id_is_null: bool = match &search {
      Some(item) => item.lang_id_is_null.unwrap_or(false),
      None => false,
    };
    if lang_id_is_null {
      where_query += &format!(" and lang_id_lbl.id is null");
    }
  }
  {
    let menu_id: Vec<String> = match &search {
      Some(item) => item.menu_id.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !menu_id.is_empty() {
      let arg = {
        let mut items = Vec::with_capacity(menu_id.len());
        for item in menu_id {
          args.push(item.into());
          items.push("?");
        }
        items.join(",")
      };
      where_query += &format!(" and menu_id_lbl.id in ({})", arg);
    }
  }
  {
    let menu_id_is_null: bool = match &search {
      Some(item) => item.menu_id_is_null.unwrap_or(false),
      None => false,
    };
    if menu_id_is_null {
      where_query += &format!(" and menu_id_lbl.id is null");
    }
  }
  {
    let code = match &search {
      Some(item) => item.code.clone(),
      None => None,
    };
    if let Some(code) = code {
      where_query += &format!(" and t.code = {}", args.push(code.into()));
    }
    let code_like = match &search {
      Some(item) => item.code_like.clone(),
      None => None,
    };
    if let Some(code_like) = code_like {
      where_query += &format!(" and t.code like {}", args.push((sql_like(&code_like) + "%").into()));
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
    let create_usr_id_is_null: bool = match &search {
      Some(item) => item.create_usr_id_is_null.unwrap_or(false),
      None => false,
    };
    if create_usr_id_is_null {
      where_query += &format!(" and create_usr_id_lbl.id is null");
    }
  }
  {
    let create_time: Vec<chrono::NaiveDateTime> = match &search {
      Some(item) => item.create_time.clone().unwrap_or_default(),
      None => vec![],
    };
    let create_time_gt: Option<chrono::NaiveDateTime> = match &create_time.len() {
      0 => None,
      _ => create_time[0].clone().into(),
    };
    let create_time_lt: Option<chrono::NaiveDateTime> = match &create_time.len() {
      0 => None,
      1 => None,
      _ => create_time[1].clone().into(),
    };
    if let Some(create_time_gt) = create_time_gt {
      where_query += &format!(" and t.create_time >= {}", args.push(create_time_gt.into()));
    }
    if let Some(create_time_lt) = create_time_lt {
      where_query += &format!(" and t.create_time <= {}", args.push(create_time_lt.into()));
    }
  }
  {
    let update_usr_id: Vec<String> = match &search {
      Some(item) => item.update_usr_id.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !update_usr_id.is_empty() {
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
    let update_usr_id_is_null: bool = match &search {
      Some(item) => item.update_usr_id_is_null.unwrap_or(false),
      None => false,
    };
    if update_usr_id_is_null {
      where_query += &format!(" and update_usr_id_lbl.id is null");
    }
  }
  {
    let update_time: Vec<chrono::NaiveDateTime> = match &search {
      Some(item) => item.update_time.clone().unwrap_or_default(),
      None => vec![],
    };
    let update_time_gt: Option<chrono::NaiveDateTime> = match &update_time.len() {
      0 => None,
      _ => update_time[0].clone().into(),
    };
    let update_time_lt: Option<chrono::NaiveDateTime> = match &update_time.len() {
      0 => None,
      1 => None,
      _ => update_time[1].clone().into(),
    };
    if let Some(update_time_gt) = update_time_gt {
      where_query += &format!(" and t.update_time >= {}", args.push(update_time_gt.into()));
    }
    if let Some(update_time_lt) = update_time_lt {
      where_query += &format!(" and t.update_time <= {}", args.push(update_time_lt.into()));
    }
  }
  where_query
}

fn get_from_query() -> &'static str {
  let from_query = r#"base_i18n t
    left join base_lang lang_id_lbl
      on lang_id_lbl.id = t.lang_id
    left join base_menu menu_id_lbl
      on menu_id_lbl.id = t.menu_id
    left join base_usr create_usr_id_lbl
      on create_usr_id_lbl.id = t.create_usr_id
    left join base_usr update_usr_id_lbl
      on update_usr_id_lbl.id = t.update_usr_id"#;
  from_query
}

/// 根据搜索条件和分页查找数据
#[instrument(skip(ctx))]
#[allow(unused_variables)]
pub async fn find_all<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<I18nSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<I18nModel>> {
  
  #[allow(unused_variables)]
  let table = "base_i18n";
  let _method = "find_all";
  
  let mut args = QueryArgs::new();
  
  let from_query = get_from_query();
  let where_query = get_where_query(ctx, &mut args, search);
  let order_by_query = get_order_by_query(sort);
  let page_query = get_page_query(page);
  
  let sql = format!(r#"
    select
      t.*
      ,lang_id_lbl.lbl lang_id_lbl
      ,menu_id_lbl.lbl menu_id_lbl
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
  
  let options = options.set_is_debug(false);
  
  let options = options.set_cache_key(table, &sql, &args);
  
  let options = options.into();
  
  let mut res: Vec<I18nModel> = ctx.query(
    sql,
    args,
    options,
  ).await?;
  
  for model in &mut res {
    
  }
  
  Ok(res)
}

/// 根据搜索条件查询数据总数
#[instrument(skip(ctx))]
pub async fn find_count<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<I18nSearch>,
  options: Option<Options>,
) -> Result<i64> {
  
  #[allow(unused_variables)]
  let table = "base_i18n";
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
  
  let options = options.set_is_debug(false);
  
  let options = options.set_cache_key(table, &sql, &args);
  
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
#[instrument(skip(ctx))]
pub async fn get_field_comments<'a>(
  ctx: &mut impl Ctx<'a>,
  _options: Option<Options>,
) -> Result<I18nFieldComment> {
  
  let n_route = i18n_dao::NRoute {
    route_path: "/base/i18n".to_owned().into(),
  };
  
  let field_comments = I18nFieldComment {
    lang_id: n_route.n(ctx, "语言".to_owned(), None).await?,
    lang_id_lbl: n_route.n(ctx, "语言".to_owned(), None).await?,
    menu_id: n_route.n(ctx, "菜单".to_owned(), None).await?,
    menu_id_lbl: n_route.n(ctx, "菜单".to_owned(), None).await?,
    code: n_route.n(ctx, "编码".to_owned(), None).await?,
    lbl: n_route.n(ctx, "名称".to_owned(), None).await?,
    rem: n_route.n(ctx, "备注".to_owned(), None).await?,
    create_usr_id: n_route.n(ctx, "创建人".to_owned(), None).await?,
    create_usr_id_lbl: n_route.n(ctx, "创建人".to_owned(), None).await?,
    create_time: n_route.n(ctx, "创建时间".to_owned(), None).await?,
    create_time_lbl: n_route.n(ctx, "创建时间".to_owned(), None).await?,
    update_usr_id: n_route.n(ctx, "更新人".to_owned(), None).await?,
    update_usr_id_lbl: n_route.n(ctx, "更新人".to_owned(), None).await?,
    update_time: n_route.n(ctx, "更新时间".to_owned(), None).await?,
    update_time_lbl: n_route.n(ctx, "更新时间".to_owned(), None).await?,
  };
  Ok(field_comments)
}

/// 获得表的唯一字段名列表
#[allow(dead_code)]
pub fn get_unique_keys() -> Vec<&'static str> {
  let unique_keys = vec![
    "lang_id",
    "menu_id",
    "code",
  ];
  unique_keys
}

/// 根据条件查找第一条数据
#[instrument(skip(ctx))]
pub async fn find_one<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<I18nSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<I18nModel>> {
  
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
  
  let model: Option<I18nModel> = res.into_iter().next();
  
  Ok(model)
}

/// 根据ID查找第一条数据
#[instrument(skip(ctx))]
pub async fn find_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  options: Option<Options>,
) -> Result<Option<I18nModel>> {
  
  let search = I18nSearch {
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
#[instrument(skip(ctx))]
#[allow(unused_variables)]
pub async fn find_by_unique<'a>(
  ctx: &mut impl Ctx<'a>,
  search: I18nSearch,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<I18nModel>> {
  
  if search.id.is_none() {
    if
      search.lang_id.is_none() ||
      search.menu_id.is_none() ||
      search.code.is_none()
    {
      return Ok(None);
    }
  }
  
  let search = I18nSearch {
    id: search.id,
    lang_id: search.lang_id,
    menu_id: search.menu_id,
    code: search.code,
    ..Default::default()
  }.into();
  
  let model = find_one(
    ctx,
    search,
    sort,
    options,
  ).await?;
  
  Ok(model)
}

/// 根据唯一约束对比对象是否相等
#[allow(dead_code)]
fn equals_by_unique(
  input: &I18nInput,
  model: &I18nModel,
) -> bool {
  if input.id.as_ref().is_some() {
    return input.id.as_ref().unwrap() == &model.id;
  }
  if
    input.lang_id.as_ref().is_none() || input.lang_id.as_ref().unwrap() != &model.lang_id ||
    input.menu_id.as_ref().is_none() || input.menu_id.as_ref().unwrap() != &model.menu_id ||
    input.code.as_ref().is_none() || input.code.as_ref().unwrap() != &model.code
  {
    return false;
  }
  true
}

/// 通过唯一约束检查数据是否已经存在
#[instrument(skip(ctx))]
#[allow(unused_variables)]
pub async fn check_by_unique<'a>(
  ctx: &mut impl Ctx<'a>,
  input: I18nInput,
  model: I18nModel,
  unique_type: UniqueType,
) -> Result<Option<String>> {
  let is_equals = equals_by_unique(
    &input,
    &model,
  );
  if !is_equals {
    return Ok(None);
  }
  if unique_type == UniqueType::Ignore {
    return Ok(None);
  }
  if unique_type == UniqueType::Update {
    let res = update_by_id(
      ctx,
      model.id.clone(),
      input,
      None,
    ).await?;
    return Ok(res.into());
  }
  if unique_type == UniqueType::Throw {
    let field_comments = get_field_comments(ctx, None).await?;
    let str = i18n_dao::ns(ctx, "已经存在".to_owned(), None).await?;
    let err_msg: String = format!(
      "{}: {}, {}: {}, {}: {} {str}",
      field_comments.lang_id,
      input.lang_id.unwrap_or_default(),
      field_comments.menu_id,
      input.menu_id.unwrap_or_default(),
      field_comments.code,
      input.code.unwrap_or_default(),
    );
    return Err(SrvErr::msg(err_msg).into());
  }
  Ok(None)
}

#[allow(unused_variables)]
pub async fn set_id_by_lbl<'a>(
  ctx: &mut impl Ctx<'a>,
  input: I18nInput,
) -> Result<I18nInput> {
  
  #[allow(unused_mut)]
  let mut input = input;
  
  // 语言
  if input.lang_id.is_none() {
    if is_not_empty_opt(&input.lang_id_lbl) && input.lang_id.is_none() {
      input.lang_id_lbl = input.lang_id_lbl.map(|item| 
        item.trim().to_owned()
      );
      let model = crate::gen::base::lang::lang_dao::find_one(
        ctx,
        crate::gen::base::lang::lang_model::LangSearch {
          lbl: input.lang_id_lbl.clone(),
          ..Default::default()
        }.into(),
        None,
        None,
      ).await?;
      if let Some(model) = model {
        input.lang_id = model.id.into();
      }
    }
  }
  
  // 菜单
  if input.menu_id.is_none() {
    if is_not_empty_opt(&input.menu_id_lbl) && input.menu_id.is_none() {
      input.menu_id_lbl = input.menu_id_lbl.map(|item| 
        item.trim().to_owned()
      );
      let model = crate::gen::base::menu::menu_dao::find_one(
        ctx,
        crate::gen::base::menu::menu_model::MenuSearch {
          lbl: input.menu_id_lbl.clone(),
          ..Default::default()
        }.into(),
        None,
        None,
      ).await?;
      if let Some(model) = model {
        input.menu_id = model.id.into();
      }
    }
  }
  
  Ok(input)
}

/// 创建数据
#[instrument(skip(ctx))]
pub async fn create<'a>(
  ctx: &mut impl Ctx<'a>,
  mut input: I18nInput,
  options: Option<Options>,
) -> Result<String> {
  
  let table = "base_i18n";
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
      UniqueType::Update,
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
  
  
  if let Some(auth_model) = ctx.get_auth_model() {
    let usr_id = auth_model.id;
    sql_fields += ",create_usr_id";
    sql_values += ",?";
    args.push(usr_id.into());
  }
  // 语言
  if let Some(lang_id) = input.lang_id {
    sql_fields += ",lang_id";
    sql_values += ",?";
    args.push(lang_id.into());
  }
  // 菜单
  if let Some(menu_id) = input.menu_id {
    sql_fields += ",menu_id";
    sql_values += ",?";
    args.push(menu_id.into());
  }
  // 编码
  if let Some(code) = input.code {
    sql_fields += ",code";
    sql_values += ",?";
    args.push(code.into());
  }
  // 名称
  if let Some(lbl) = input.lbl {
    sql_fields += ",lbl";
    sql_values += ",?";
    args.push(lbl.into());
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
  
  let options = options.set_is_debug(false);
  
  let options = options.set_del_cache_key1s(get_foreign_tables());
  
  let options = options.into();
  
  ctx.execute(
    sql,
    args,
    options,
  ).await?;
  
  Ok(id)
}

/// 根据id修改数据
#[instrument(skip(ctx))]
pub async fn update_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  mut input: I18nInput,
  options: Option<Options>,
) -> Result<String> {
  
  input = set_id_by_lbl(
    ctx,
    input,
  ).await?;
  
  let table = "base_i18n";
  let _method = "update_by_id";
  
  let now = ctx.get_now();
  
  let mut args = QueryArgs::new();
  
  let mut sql_fields = "update_time = ?".to_owned();
  args.push(now.into());
  
  let mut field_num: usize = 0;
  // 语言
  if let Some(lang_id) = input.lang_id {
    field_num += 1;
    sql_fields += ",lang_id = ?";
    args.push(lang_id.into());
  }
  // 菜单
  if let Some(menu_id) = input.menu_id {
    field_num += 1;
    sql_fields += ",menu_id = ?";
    args.push(menu_id.into());
  }
  // 编码
  if let Some(code) = input.code {
    field_num += 1;
    sql_fields += ",code = ?";
    args.push(code.into());
  }
  // 名称
  if let Some(lbl) = input.lbl {
    field_num += 1;
    sql_fields += ",lbl = ?";
    args.push(lbl.into());
  }
  // 备注
  if let Some(rem) = input.rem {
    field_num += 1;
    sql_fields += ",rem = ?";
    args.push(rem.into());
  }
  
  if field_num > 0 {
    
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
    
    let options = options.set_is_debug(false);
    
    let options = options.set_del_cache_key1s(get_foreign_tables());
    
    let options = options.into();
    
    ctx.execute(
      sql,
      args,
      options,
    ).await?;
    
  }
  
  crate::src::base::options::options_dao::update_i18n_version(ctx).await?;
  
  Ok(id)
}

/// 获取外键关联表, 第一个是主表
#[allow(dead_code)]
fn get_foreign_tables() -> Vec<&'static str> {
  let table = "base_i18n";
  vec![
    table,
    "base_lang",
    "base_menu",
    "base_usr",
  ]
}

/// 根据 ids 删除数据
#[instrument(skip(ctx))]
pub async fn delete_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_i18n";
  let _method = "delete_by_ids";
  
  let options = Options::from(options);
  
  let options = options.set_is_debug(false);
  
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
    
    let options = options.set_del_cache_key1s(get_foreign_tables());
    
    let options = options.into();
    
    num += ctx.execute(
      sql,
      args,
      options,
    ).await?;
  }
  
  crate::src::base::options::options_dao::update_i18n_version(ctx).await?;
  
  Ok(num)
}

/// 根据 ids 还原数据
#[instrument(skip(ctx))]
pub async fn revert_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_i18n";
  let _method = "revert_by_ids";
  
  let options = Options::from(options);
  
  let options = options.set_is_debug(false);
  
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
    
    let options = options.set_del_cache_key1s(get_foreign_tables());
    
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
#[instrument(skip(ctx))]
pub async fn force_delete_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_i18n";
  let _method = "force_delete_by_ids";
  
  let options = Options::from(options);
  
  let options = options.set_is_debug(false);
  
  let mut num = 0;
  for id in ids {
    
    let model = find_all(
      ctx,
      I18nSearch {
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
      "delete from {} set where id=? and is_deleted = 1 limit 1",
      table,
    );
    
    args.push(id.into());
    
    let args = args.into();
    
    let options = options.clone();
    
    let options = options.set_del_cache_key1s(get_foreign_tables());
    
    let options = options.into();
    
    num += ctx.execute(
      sql,
      args,
      options,
    ).await?;
  }
  
  Ok(num)
}
