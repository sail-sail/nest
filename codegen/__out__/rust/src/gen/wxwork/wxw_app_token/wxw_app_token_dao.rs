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

use crate::common::gql::model::{
  PageInput,
  SortInput,
};

use super::wxw_app_token_model::*;

#[allow(unused_variables)]
async fn get_where_query<'a>(
  ctx: &mut impl Ctx<'a>,
  args: &mut QueryArgs,
  search: Option<WxwAppTokenSearch>,
) -> Result<String> {
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
    let id = match trim_opt(id.as_ref()) {
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
    let tenant_id = {
      let tenant_id = match &search {
        Some(item) => &item.tenant_id,
        None => &None,
      };
      let tenant_id = match trim_opt(tenant_id.as_ref()) {
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
    let wxw_app_id: Vec<String> = match &search {
      Some(item) => item.wxw_app_id.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !wxw_app_id.is_empty() {
      let arg = {
        let mut items = Vec::with_capacity(wxw_app_id.len());
        for item in wxw_app_id {
          args.push(item.into());
          items.push("?");
        }
        items.join(",")
      };
      where_query += &format!(" and wxw_app_id_lbl.id in ({})", arg);
    }
  }
  {
    let wxw_app_id_is_null: bool = match &search {
      Some(item) => item.wxw_app_id_is_null.unwrap_or(false),
      None => false,
    };
    if wxw_app_id_is_null {
      where_query += &format!(" and wxw_app_id_lbl.id is null");
    }
  }
  {
    let r#type = match &search {
      Some(item) => item.r#type.clone(),
      None => None,
    };
    if let Some(r#type) = r#type {
      where_query += &format!(" and t.type = {}", args.push(r#type.into()));
    }
    let type_like = match &search {
      Some(item) => item.type_like.clone(),
      None => None,
    };
    if let Some(type_like) = type_like {
      where_query += &format!(" and t.type like {}", args.push((sql_like(&type_like) + "%").into()));
    }
  }
  {
    let access_token = match &search {
      Some(item) => item.access_token.clone(),
      None => None,
    };
    if let Some(access_token) = access_token {
      where_query += &format!(" and t.access_token = {}", args.push(access_token.into()));
    }
    let access_token_like = match &search {
      Some(item) => item.access_token_like.clone(),
      None => None,
    };
    if let Some(access_token_like) = access_token_like {
      where_query += &format!(" and t.access_token like {}", args.push((sql_like(&access_token_like) + "%").into()));
    }
  }
  {
    let token_time: Vec<chrono::NaiveDateTime> = match &search {
      Some(item) => item.token_time.clone().unwrap_or_default(),
      None => vec![],
    };
    let token_time_gt: Option<chrono::NaiveDateTime> = match &token_time.len() {
      0 => None,
      _ => token_time[0].clone().into(),
    };
    let token_time_lt: Option<chrono::NaiveDateTime> = match &token_time.len() {
      0 => None,
      1 => None,
      _ => token_time[1].clone().into(),
    };
    if let Some(token_time_gt) = token_time_gt {
      where_query += &format!(" and t.token_time >= {}", args.push(token_time_gt.into()));
    }
    if let Some(token_time_lt) = token_time_lt {
      where_query += &format!(" and t.token_time <= {}", args.push(token_time_lt.into()));
    }
  }
  {
    let expires_in: Vec<u32> = match &search {
      Some(item) => item.expires_in.clone().unwrap_or_default(),
      None => vec![],
    };
    let expires_in_gt: Option<u32> = match &expires_in.len() {
      0 => None,
      _ => expires_in[0].clone().into(),
    };
    let expires_in_lt: Option<u32> = match &expires_in.len() {
      0 => None,
      1 => None,
      _ => expires_in[1].clone().into(),
    };
    if let Some(expires_in_gt) = expires_in_gt {
      where_query += &format!(" and t.expires_in >= {}", args.push(expires_in_gt.into()));
    }
    if let Some(expires_in_lt) = expires_in_lt {
      where_query += &format!(" and t.expires_in <= {}", args.push(expires_in_lt.into()));
    }
  }
  Ok(where_query)
}

async fn get_from_query() -> Result<String> {
  let from_query = r#"wxwork_wxw_app_token t
    left join wxwork_wxw_app wxw_app_id_lbl
      on wxw_app_id_lbl.id = t.wxw_app_id"#.to_owned();
  Ok(from_query)
}

/// 根据搜索条件和分页查找数据
#[allow(unused_variables)]
pub async fn find_all<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<WxwAppTokenSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxwAppTokenModel>> {
  
  #[allow(unused_variables)]
  let table = "wxwork_wxw_app_token";
  let _method = "find_all";
  
  let mut args = QueryArgs::new();
  
  let from_query = get_from_query().await?;
  let where_query = get_where_query(ctx, &mut args, search).await?;
  let order_by_query = get_order_by_query(sort);
  let page_query = get_page_query(page);
  
  let sql = format!(r#"
    select
      t.*
      ,wxw_app_id_lbl.lbl wxw_app_id_lbl
    from
      {from_query}
    where
      {where_query}
    group by t.id{order_by_query}{page_query}
  "#);
  
  let args = args.into();
  
  let options = Options::from(options);
  
  let options = options.set_cache_key(table, &sql, &args);
  
  let options = options.into();
  
  let mut res: Vec<WxwAppTokenModel> = ctx.query(
    sql,
    args,
    options,
  ).await?;
  
  for model in &mut res {
    
  }
  
  Ok(res)
}

/// 根据搜索条件查询数据总数
pub async fn find_count<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<WxwAppTokenSearch>,
  options: Option<Options>,
) -> Result<i64> {
  
  #[allow(unused_variables)]
  let table = "wxwork_wxw_app_token";
  let _method = "find_count";
  
  let mut args = QueryArgs::new();
  
  let from_query = get_from_query().await?;
  let where_query = get_where_query(ctx, &mut args, search).await?;
  
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

/// 获取路由地址
pub fn get_route_path() -> String {
  "/wxwork/wxw_app_token".to_owned()
}

/// 获取当前路由的国际化
pub fn get_n_route() -> i18n_dao::NRoute {
  let n_route = i18n_dao::NRoute {
    route_path: get_route_path().into(),
  };
  n_route
}

/// 获取字段对应的国家化后的名称
pub async fn get_field_comments<'a>(
  ctx: &mut impl Ctx<'a>,
  _options: Option<Options>,
) -> Result<WxwAppTokenFieldComment> {
  
  let n_route = get_n_route();
  
  let i18n_code_maps: Vec<i18n_dao::I18nCodeMap> = vec![
    "ID".into(),
    "企微应用".into(),
    "企微应用".into(),
    "类型corp和contact".into(),
    "令牌".into(),
    "令牌创建时间".into(),
    "令牌创建时间".into(),
    "令牌超时时间".into(),
  ];
  
  let map = n_route.n_batch(
    ctx,
    i18n_code_maps.clone(),
  ).await?;
  
  let vec = i18n_code_maps
    .into_iter()
    .map(|item|
      map.get(&item.code)
        .map(|item| item.clone())
        .unwrap_or_default()
    )
    .collect::<Vec<String>>();
  
  let field_comments = WxwAppTokenFieldComment {
    id: vec[0].to_owned(),
    wxw_app_id: vec[1].to_owned(),
    wxw_app_id_lbl: vec[2].to_owned(),
    r#type: vec[3].to_owned(),
    access_token: vec[4].to_owned(),
    token_time: vec[5].to_owned(),
    token_time_lbl: vec[6].to_owned(),
    expires_in: vec[7].to_owned(),
  };
  Ok(field_comments)
}

/// 根据条件查找第一条数据
pub async fn find_one<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<WxwAppTokenSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<WxwAppTokenModel>> {
  
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
  
  let model: Option<WxwAppTokenModel> = res.into_iter().next();
  
  Ok(model)
}

/// 根据ID查找第一条数据
pub async fn find_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  options: Option<Options>,
) -> Result<Option<WxwAppTokenModel>> {
  
  let search = WxwAppTokenSearch {
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

/// 通过唯一约束获得数据列表
#[allow(unused_variables)]
pub async fn find_by_unique<'a>(
  ctx: &mut impl Ctx<'a>,
  search: WxwAppTokenSearch,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxwAppTokenModel>> {
  
  if let Some(id) = search.id {
    let model = find_by_id(
      ctx,
      id.into(),
      None,
    ).await?;
    if let Some(model) = model {
      return Ok(vec![model]);
    }
    return Ok(vec![]);
  }
  
  let mut models: Vec<WxwAppTokenModel> = vec![];
  
  let mut models_tmp = {
    if
      search.wxw_app_id.is_none()
    {
      return Ok(vec![]);
    }
    
    let search = WxwAppTokenSearch {
      wxw_app_id: search.wxw_app_id,
      ..Default::default()
    };
    
    find_all(
      ctx,
      search.into(),
      None,
      None,
      None,
    ).await?
  };
  models.append(&mut models_tmp);
  
  let mut models_tmp = {
    if
      search.access_token.is_none()
    {
      return Ok(vec![]);
    }
    
    let search = WxwAppTokenSearch {
      access_token: search.access_token,
      ..Default::default()
    };
    
    find_all(
      ctx,
      search.into(),
      None,
      None,
      None,
    ).await?
  };
  models.append(&mut models_tmp);
  
  Ok(models)
}

/// 根据唯一约束对比对象是否相等
#[allow(dead_code)]
fn equals_by_unique(
  input: &WxwAppTokenInput,
  model: &WxwAppTokenModel,
) -> bool {
  if input.id.as_ref().is_some() {
    return input.id.as_ref().unwrap() == &model.id;
  }
  
  if
    input.wxw_app_id.as_ref().is_some() && input.wxw_app_id.as_ref().unwrap() == &model.wxw_app_id
  {
    return true;
  }
  
  if
    input.access_token.as_ref().is_some() && input.access_token.as_ref().unwrap() == &model.access_token
  {
    return true;
  }
  false
}

/// 通过唯一约束检查数据是否已经存在
#[allow(unused_variables)]
pub async fn check_by_unique<'a>(
  ctx: &mut impl Ctx<'a>,
  input: WxwAppTokenInput,
  model: WxwAppTokenModel,
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
    let options = Options::new();
    let id = update_by_id(
      ctx,
      model.id.clone(),
      input,
      Some(options),
    ).await?;
    return Ok(id.into());
  }
  if unique_type == UniqueType::Throw {
    let err_msg = i18n_dao::ns(
      ctx,
      "记录已经存在".to_owned(),
      None,
    ).await?;
    return Err(SrvErr::msg(err_msg).into());
  }
  Ok(None)
}

#[allow(unused_variables)]
pub async fn set_id_by_lbl<'a>(
  ctx: &mut impl Ctx<'a>,
  input: WxwAppTokenInput,
) -> Result<WxwAppTokenInput> {
  
  #[allow(unused_mut)]
  let mut input = input;
  
  // 企微应用
  if input.wxw_app_id.is_none() {
    if input.wxw_app_id_lbl.is_some()
      && !input.wxw_app_id_lbl.as_ref().unwrap().is_empty()
      && input.wxw_app_id.is_none()
    {
      input.wxw_app_id_lbl = input.wxw_app_id_lbl.map(|item| 
        item.trim().to_owned()
      );
      let model = crate::gen::wxwork::wxw_app::wxw_app_dao::find_one(
        ctx,
        crate::gen::wxwork::wxw_app::wxw_app_model::WxwAppSearch {
          lbl: input.wxw_app_id_lbl.clone(),
          ..Default::default()
        }.into(),
        None,
        None,
      ).await?;
      if let Some(model) = model {
        input.wxw_app_id = model.id.into();
      }
    }
  }
  
  Ok(input)
}

/// 创建数据
pub async fn create<'a>(
  ctx: &mut impl Ctx<'a>,
  mut input: WxwAppTokenInput,
  options: Option<Options>,
) -> Result<String> {
  
  validate(
    &input,
  )?;
  
  let table = "wxwork_wxw_app_token";
  let _method = "create";
  
  let now = ctx.get_now();
  
  input = set_id_by_lbl(
    ctx,
    input,
  ).await?;
  
  let old_models = find_by_unique(
    ctx,
    input.clone().into(),
    None,
    None,
  ).await?;
  
  if old_models.len() > 0 {
    
    let unique_type = options.as_ref()
      .map(|item|
        item.get_unique_type()
          .map(|item| item.clone())
          .unwrap_or(UniqueType::Throw)
      )
      .unwrap_or(UniqueType::Throw);
    
    let mut id: Option<String> = None;
    
    for old_model in old_models {
      
      id = check_by_unique(
        ctx,
        input.clone(),
        old_model,
        unique_type,
      ).await?;
      
      if id.is_some() {
        break;
      }
    }
    
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
  // 企微应用
  if let Some(wxw_app_id) = input.wxw_app_id {
    sql_fields += ",wxw_app_id";
    sql_values += ",?";
    args.push(wxw_app_id.into());
  }
  // 类型corp和contact
  if let Some(r#type) = input.r#type {
    sql_fields += ",type";
    sql_values += ",?";
    args.push(r#type.into());
  }
  // 令牌
  if let Some(access_token) = input.access_token {
    sql_fields += ",access_token";
    sql_values += ",?";
    args.push(access_token.into());
  }
  // 令牌创建时间
  if let Some(token_time) = input.token_time {
    sql_fields += ",token_time";
    sql_values += ",?";
    args.push(token_time.into());
  }
  // 令牌超时时间
  if let Some(expires_in) = input.expires_in {
    sql_fields += ",expires_in";
    sql_values += ",?";
    args.push(expires_in.into());
  }
  
  let sql = format!(
    "insert into {} ({}) values ({})",
    table,
    sql_fields,
    sql_values,
  );
  
  let args = args.into();
  
  let options = Options::from(options);
  
  let options = options.set_del_cache_key1s(get_foreign_tables());
  
  let options = options.into();
  
  ctx.execute(
    sql,
    args,
    options,
  ).await?;
  
  Ok(id)
}

/// 根据id修改租户id
pub async fn update_tenant_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  tenant_id: String,
  options: Option<Options>,
) -> Result<u64> {
  let table = "wxwork_wxw_app_token";
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
  mut input: WxwAppTokenInput,
  options: Option<Options>,
) -> Result<String> {
  
  let old_model = find_by_id(
    ctx,
    id.clone(),
    None,
  ).await?;
  
  if old_model.is_none() {
    let err_msg = i18n_dao::ns(
      ctx,
      "数据已删除".to_owned(),
      None,
    ).await?;
    return Err(SrvErr::msg(err_msg).into());
  }
  
  validate(
    &input,
  )?;
  
  input = set_id_by_lbl(
    ctx,
    input,
  ).await?;
  
  {
    let mut input = input.clone();
    input.id = None;
    
    let models = find_by_unique(
      ctx,
      input.into(),
      None,
      None,
    ).await?;
    
    let models: Vec<WxwAppTokenModel> = models.into_iter()
      .filter(|item| 
        &item.id != &id
      )
      .collect();
    
    if models.len() > 0 {
      let unique_type = {
        if let Some(options) = options.as_ref() {
          options.get_unique_type()
            .map(|item| item.clone())
            .unwrap_or(UniqueType::Throw)
        } else {
          UniqueType::Throw
        }
      };
      if unique_type == UniqueType::Throw {
        let err_msg = i18n_dao::ns(
          ctx,
          "数据已经存在".to_owned(),
          None,
        ).await?;
        return Err(SrvErr::msg(err_msg).into());
      } else if unique_type == UniqueType::Ignore {
        return Ok(id);
      }
    }
  }
  
  let table = "wxwork_wxw_app_token";
  let _method = "update_by_id";
  
  let now = ctx.get_now();
  
  let mut args = QueryArgs::new();
  
  let mut sql_fields = "update_time = ?".to_owned();
  args.push(now.into());
  
  let mut field_num: usize = 0;
  // 企微应用
  if let Some(wxw_app_id) = input.wxw_app_id {
    field_num += 1;
    sql_fields += ",wxw_app_id = ?";
    args.push(wxw_app_id.into());
  }
  // 类型corp和contact
  if let Some(r#type) = input.r#type {
    field_num += 1;
    sql_fields += ",type = ?";
    args.push(r#type.into());
  }
  // 令牌
  if let Some(access_token) = input.access_token {
    field_num += 1;
    sql_fields += ",access_token = ?";
    args.push(access_token.into());
  }
  // 令牌创建时间
  if let Some(token_time) = input.token_time {
    field_num += 1;
    sql_fields += ",token_time = ?";
    args.push(token_time.into());
  }
  // 令牌超时时间
  if let Some(expires_in) = input.expires_in {
    field_num += 1;
    sql_fields += ",expires_in = ?";
    args.push(expires_in.into());
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
  
  Ok(id)
}

/// 获取外键关联表, 第一个是主表
#[allow(dead_code)]
fn get_foreign_tables() -> Vec<&'static str> {
  let table = "wxwork_wxw_app_token";
  vec![
    table,
    "wxwork_wxw_app",
  ]
}

/// 根据 ids 删除数据
pub async fn delete_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "wxwork_wxw_app_token";
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

/// 根据 ids 还原数据
pub async fn revert_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "wxwork_wxw_app_token";
  let _method = "revert_by_ids";
  
  let options = Options::from(options);
  
  let mut num = 0;
  for id in ids {
    let mut args = QueryArgs::new();
    
    let sql = format!(
      "update {} set is_deleted=0 where id=? limit 1",
      table,
    );
    
    args.push(id.clone().into());
    
    let args = args.into();
    
    let options = options.clone();
    
    let options = options.set_del_cache_key1s(get_foreign_tables());
    
    let options = options.into();
    
    num += ctx.execute(
      sql,
      args,
      options,
    ).await?;
    
    // 检查数据的唯一索引
    {
      let old_model = find_by_id(
        ctx,
        id.clone(),
        None,
      ).await?;
      
      if old_model.is_none() {
        continue;
      }
      let old_model = old_model.unwrap();
      
      let mut input: WxwAppTokenInput = old_model.into();
      input.id = None;
      
      let models = find_by_unique(
        ctx,
        input.into(),
        None,
        None,
      ).await?;
      
      let models: Vec<WxwAppTokenModel> = models.into_iter()
        .filter(|item| 
          &item.id != &id
        )
        .collect();
      
      if models.len() > 0 {
        let err_msg = i18n_dao::ns(
          ctx,
          "数据已经存在".to_owned(),
          None,
        ).await?;
        return Err(SrvErr::msg(err_msg).into());
      }
    }
    
  }
  
  Ok(num)
}

/// 根据 ids 彻底删除数据
pub async fn force_delete_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "wxwork_wxw_app_token";
  let _method = "force_delete_by_ids";
  
  let options = Options::from(options);
  
  let mut num = 0;
  for id in ids {
    
    let model = find_all(
      ctx,
      WxwAppTokenSearch {
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

/// 校验, 校验失败时抛出SrvErr异常
#[allow(unused_imports)]
pub fn validate<'a>(
  input: &WxwAppTokenInput,
) -> Result<()> {
  
  use crate::common::validators::max_items::max_items;
  use crate::common::validators::min_items::min_items;
  use crate::common::validators::maximum::maximum;
  use crate::common::validators::minimum::minimum;
  use crate::common::validators::chars_max_length::chars_max_length;
  use crate::common::validators::chars_min_length::chars_min_length;
  use crate::common::validators::multiple_of::multiple_of;
  use crate::common::validators::regex::regex;
  use crate::common::validators::email::email;
  use crate::common::validators::url::url;
  use crate::common::validators::ip::ip;
  
  // ID
  chars_max_length(
    input.id.clone(),
    22,
    "",
  )?;
  
  // 企微应用
  chars_max_length(
    input.wxw_app_id.clone(),
    22,
    "",
  )?;
  
  // 类型corp和contact
  chars_max_length(
    input.r#type.clone(),
    10,
    "",
  )?;
  
  // 令牌
  chars_max_length(
    input.access_token.clone(),
    512,
    "",
  )?;
  
  Ok(())
}
