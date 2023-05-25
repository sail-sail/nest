use anyhow::Result;
use tracing::info;

use crate::common::util::string::*;
use crate::common::util::dao::{many2many_update, ManyOpts};

use crate::common::context::{
  Ctx,
  QueryArgs,
  Options,
  CountModel,
  UniqueType,
  SrvErr,
  OrderByModel,
  get_short_uuid,
  get_order_by_query,
  get_page_query,
};

use crate::src::base::i18n::i18n_dao::NRoute;

use crate::common::gql::model::{PageInput, SortInput};

use crate::src::base::dict_detail::dict_detail_dao::get_dict;

use super::tenant_model::*;

#[allow(unused_variables)]
fn get_where_query<'a>(
  ctx: &mut impl Ctx<'a>,
  args: &mut QueryArgs,
  search: Option<TenantSearch>,
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
      where_query += &format!(" and id in ({})", arg);
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
    let host = match &search {
      Some(item) => item.host.clone(),
      None => None,
    };
    if let Some(host) = host {
      where_query += &format!(" and t.host = {}", args.push(host.into()));
    }
    let host_like = match &search {
      Some(item) => item.host_like.clone(),
      None => None,
    };
    if let Some(host_like) = host_like {
      where_query += &format!(" and t.host like {}", args.push((sql_like(&host_like) + "%").into()));
    }
  }
  {
    let expiration: Vec<chrono::NaiveDate> = match &search {
      Some(item) => item.expiration.clone().unwrap_or_default(),
      None => vec![],
    };
    let expiration_gt: Option<chrono::NaiveDate> = match &expiration.len() {
      0 => None,
      _ => expiration[0].clone().into(),
    };
    let expiration_lt: Option<chrono::NaiveDate> = match &expiration.len() {
      0 => None,
      1 => None,
      _ => expiration[1].clone().into(),
    };
    if let Some(expiration_gt) = expiration_gt {
      where_query += &format!(" and t.expiration >= {}", args.push(expiration_gt.into()));
    }
    if let Some(expiration_lt) = expiration_lt {
      where_query += &format!(" and t.expiration <= {}", args.push(expiration_lt.into()));
    }
  }
  {
    let max_usr_num: Vec<u32> = match &search {
      Some(item) => item.max_usr_num.clone().unwrap_or_default(),
      None => vec![],
    };
    let max_usr_num_gt: Option<u32> = match &max_usr_num.len() {
      0 => None,
      _ => max_usr_num[0].clone().into(),
    };
    let max_usr_num_lt: Option<u32> = match &max_usr_num.len() {
      0 => None,
      1 => None,
      _ => max_usr_num[1].clone().into(),
    };
    if let Some(max_usr_num_gt) = max_usr_num_gt {
      where_query += &format!(" and t.max_usr_num >= {}", args.push(max_usr_num_gt.into()));
    }
    if let Some(max_usr_num_lt) = max_usr_num_lt {
      where_query += &format!(" and t.max_usr_num <= {}", args.push(max_usr_num_lt.into()));
    }
  }
  {
    let is_enabled: Vec<u8> = match &search {
      Some(item) => item.is_enabled.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !is_enabled.is_empty() {
      let arg = {
        let mut items = Vec::with_capacity(is_enabled.len());
        for item in is_enabled {
          args.push(item.into());
          items.push("?");
        }
        items.join(",")
      };
      where_query += &format!(" and t.is_enabled in ({})", arg);
    }
  }
  {
    let menu_ids: Vec<String> = match &search {
      Some(item) => item.menu_ids.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !menu_ids.is_empty() {
      let arg = {
        let mut items = Vec::with_capacity(menu_ids.len());
        for item in menu_ids {
          args.push(item.into());
          items.push("?");
        }
        items.join(",")
      };
      where_query += &format!(" and base_menu.id in ({})", arg);
    }
  }
  {
    let menu_ids_is_null: bool = match &search {
      Some(item) => item.menu_ids_is_null.unwrap_or(false),
      None => false,
    };
    if menu_ids_is_null {
      where_query += &format!(" and menu_ids_lbl.id is null");
    }
  }
  {
    let order_by: Vec<u32> = match &search {
      Some(item) => item.order_by.clone().unwrap_or_default(),
      None => vec![],
    };
    let order_by_gt: Option<u32> = match &order_by.len() {
      0 => None,
      _ => order_by[0].clone().into(),
    };
    let order_by_lt: Option<u32> = match &order_by.len() {
      0 => None,
      1 => None,
      _ => order_by[1].clone().into(),
    };
    if let Some(order_by_gt) = order_by_gt {
      where_query += &format!(" and t.order_by >= {}", args.push(order_by_gt.into()));
    }
    if let Some(order_by_lt) = order_by_lt {
      where_query += &format!(" and t.order_by <= {}", args.push(order_by_lt.into()));
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
  where_query
}

fn get_from_query() -> &'static str {
  let from_query = r#"base_tenant t
    left join base_tenant_menu
      on base_tenant_menu.tenant_id = t.id
    left join base_menu
      on base_tenant_menu.menu_id = base_menu.id
    left join (
      select
        json_arrayagg(base_menu.id) menu_ids,
        json_arrayagg(base_menu.lbl) menu_ids_lbl,
        base_tenant.id tenant_id
      from base_tenant_menu
      inner join base_menu
        on base_menu.id = base_tenant_menu.menu_id
      inner join base_tenant
        on base_tenant.id = base_tenant_menu.tenant_id
      group by tenant_id
    ) _menu
      on _menu.tenant_id = t.id"#;
  from_query
}

/// 根据搜索条件和分页查找数据
#[allow(unused_variables)]
pub async fn find_all<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<TenantSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<TenantModel>> {
  
  #[allow(unused_variables)]
  let table = "base_tenant";
  let _method = "find_all";
  
  let mut args = QueryArgs::new();
  
  let from_query = get_from_query();
  let where_query = get_where_query(ctx, &mut args, search);
  let order_by_query = get_order_by_query(sort);
  let page_query = get_page_query(page);
  
  let sql = format!(r#"
    select
      t.*
      ,max(menu_ids) menu_ids
      ,max(menu_ids_lbl) menu_ids_lbl
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
  
  let mut res: Vec<TenantModel> = ctx.query(
    sql,
    args,
    options,
  ).await?;
  
  let dict_vec = get_dict(ctx, &vec![
    "is_enabled",
  ]).await?;
  
  let is_enabled_dict = &dict_vec[0];
  
  for model in &mut res {
    
    // 启用
    model.is_enabled_lbl = {
      is_enabled_dict.iter()
        .find(|item| item.val == model.is_enabled.to_string())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.is_enabled.to_string())
    };
    
  }
  
  Ok(res)
}

/// 根据搜索条件查询数据总数
pub async fn find_count<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<TenantSearch>,
  options: Option<Options>,
) -> Result<i64> {
  
  #[allow(unused_variables)]
  let table = "base_tenant";
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
pub async fn get_field_comments<'a>(
  ctx: &mut impl Ctx<'a>,
  _options: Option<Options>,
) -> Result<TenantFieldComment> {
  
  let n_route = NRoute {
    route_path: "/tenant".to_owned().into(),
  };
  
  let field_comments = TenantFieldComment {
    lbl: n_route.n(ctx, "名称".to_owned(), None).await?,
    host: n_route.n(ctx, "域名绑定".to_owned(), None).await?,
    expiration: n_route.n(ctx, "到期日".to_owned(), None).await?,
    expiration_lbl: n_route.n(ctx, "到期日".to_owned(), None).await?,
    max_usr_num: n_route.n(ctx, "最大用户数".to_owned(), None).await?,
    is_enabled: n_route.n(ctx, "启用".to_owned(), None).await?,
    is_enabled_lbl: n_route.n(ctx, "启用".to_owned(), None).await?,
    menu_ids: n_route.n(ctx, "菜单".to_owned(), None).await?,
    menu_ids_lbl: n_route.n(ctx, "菜单".to_owned(), None).await?,
    order_by: n_route.n(ctx, "排序".to_owned(), None).await?,
    rem: n_route.n(ctx, "备注".to_owned(), None).await?,
  };
  Ok(field_comments)
}

/// 获得表的唯一字段名列表
#[allow(dead_code)]
pub fn get_unique_keys() -> Vec<&'static str> {
  let unique_keys = vec![
    "lbl",
  ];
  unique_keys
}

/// 根据条件查找第一条数据
pub async fn find_one<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<TenantSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<TenantModel>> {
  
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
  
  let model: Option<TenantModel> = res.into_iter().next();
  
  Ok(model)
}

/// 根据ID查找第一条数据
pub async fn find_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  options: Option<Options>,
) -> Result<Option<TenantModel>> {
  
  let search = TenantSearch {
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
  search: TenantSearch,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<TenantModel>> {
  
  if search.id.is_none() {
    if
      search.lbl.is_none()
    {
      return Ok(None);
    }
  }
  
  let search = TenantSearch {
    id: search.id,
    lbl: search.lbl,
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
  input: &TenantInput,
  model: &TenantModel,
) -> bool {
  if input.id.as_ref().is_some() {
    return input.id.as_ref().unwrap() == &model.id;
  }
  if
    input.lbl.as_ref().is_none() || input.lbl.as_ref().unwrap() != &model.lbl
  {
    return false;
  }
  true
}

/// 通过唯一约束检查数据是否已经存在
#[allow(unused_variables)]
pub async fn check_by_unique<'a>(
  ctx: &mut impl Ctx<'a>,
  input: TenantInput,
  model: TenantModel,
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
    let err_msg: String = format!(
      "{}: {} 已经存在",
      field_comments.lbl,
      input.lbl.unwrap_or_default(),
    );
    return Err(SrvErr::msg(err_msg).into());
  }
  Ok(None)
}

#[allow(unused_variables)]
pub async fn set_id_by_lbl<'a>(
  ctx: &mut impl Ctx<'a>,
  input: TenantInput,
) -> Result<TenantInput> {
  
  #[allow(unused_mut)]
  let mut input = input;
  
  let dict_vec = get_dict(ctx, &vec![
    "is_enabled",
  ]).await?;
  
  
  // 启用
  let is_enabled_dict = &dict_vec[0];
  if let Some(is_enabled_lbl) = input.is_enabled_lbl.clone() {
    input.is_enabled = is_enabled_dict.into_iter()
      .find(|item| {
        item.lbl == is_enabled_lbl
      })
      .map(|item| {
        item.val.parse().unwrap_or_default()
      })
      .into();
  }
  
  // 菜单
  if input.menu_ids_lbl.is_some() && input.menu_ids.is_none() {
    input.menu_ids_lbl = input.menu_ids_lbl.map(|item| 
      item.into_iter()
        .map(|item| item.trim().to_owned())
        .collect::<Vec<String>>()
    );
    let mut models = vec![];
    for lbl in input.menu_ids_lbl.clone().unwrap_or_default() {
      let model = crate::gen::base::menu::menu_dao::find_one(
        ctx,
        crate::gen::base::menu::menu_model::MenuSearch {
          lbl: lbl.into(),
          ..Default::default()
        }.into(),
        None,
        None,
      ).await?;
      if let Some(model) = model {
        models.push(model);
      }
    }
    if !models.is_empty() {
      input.menu_ids = models.into_iter()
        .map(|item| item.id)
        .collect::<Vec<String>>()
        .into();
    }
  }
  
  Ok(input)
}

/// 创建数据
pub async fn create<'a>(
  ctx: &mut impl Ctx<'a>,
  mut input: TenantInput,
  options: Option<Options>,
) -> Result<String> {
  
  let table = "base_tenant";
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
  // 名称
  if let Some(lbl) = input.lbl {
    sql_fields += ",lbl";
    sql_values += ",?";
    args.push(lbl.into());
  }
  // 域名绑定
  if let Some(host) = input.host {
    sql_fields += ",host";
    sql_values += ",?";
    args.push(host.into());
  }
  // 到期日
  if let Some(expiration) = input.expiration {
    sql_fields += ",expiration";
    sql_values += ",?";
    args.push(expiration.into());
  }
  // 最大用户数
  if let Some(max_usr_num) = input.max_usr_num {
    sql_fields += ",max_usr_num";
    sql_values += ",?";
    args.push(max_usr_num.into());
  }
  // 启用
  if let Some(is_enabled) = input.is_enabled {
    sql_fields += ",is_enabled";
    sql_values += ",?";
    args.push(is_enabled.into());
  }
  // 排序
  if let Some(order_by) = input.order_by {
    sql_fields += ",order_by";
    sql_values += ",?";
    args.push(order_by.into());
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
  
  let options = options.set_del_cache_key1s(get_foreign_tables());
  
  let options = options.into();
  
  let num = ctx.execute(
    sql,
    args,
    options,
  ).await?;
  
  if num != 1 {
    return Err(SrvErr::msg("创建失败".to_owned()).into());
  }
  
  // 菜单
  if let Some(menu_ids) = input.menu_ids {
    many2many_update(
      ctx,
      id.clone(),
      menu_ids.clone(),
      ManyOpts {
        r#mod: "base",
        table: "tenant_menu",
        column1: "tenant_id",
        column2: "menu_id",
      },
    ).await?;
  }
  
  Ok(id)
}

/// 根据id修改数据
pub async fn update_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  mut input: TenantInput,
  options: Option<Options>,
) -> Result<String> {
  
  input = set_id_by_lbl(
    ctx,
    input,
  ).await?;
  
  let table = "base_tenant";
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
  // 域名绑定
  if let Some(host) = input.host {
    field_num += 1;
    sql_fields += ",host = ?";
    args.push(host.into());
  }
  // 到期日
  if let Some(expiration) = input.expiration {
    field_num += 1;
    sql_fields += ",expiration = ?";
    args.push(expiration.into());
  }
  // 最大用户数
  if let Some(max_usr_num) = input.max_usr_num {
    field_num += 1;
    sql_fields += ",max_usr_num = ?";
    args.push(max_usr_num.into());
  }
  // 启用
  if let Some(is_enabled) = input.is_enabled {
    field_num += 1;
    sql_fields += ",is_enabled = ?";
    args.push(is_enabled.into());
  }
  // 排序
  if let Some(order_by) = input.order_by {
    field_num += 1;
    sql_fields += ",order_by = ?";
    args.push(order_by.into());
  }
  // 备注
  if let Some(rem) = input.rem {
    field_num += 1;
    sql_fields += ",rem = ?";
    args.push(rem.into());
  }
  
  if field_num == 0 {
    return Ok(id);
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
  
  let options = options.set_del_cache_key1s(get_foreign_tables());
  
  let options = options.into();
  
  ctx.execute(
    sql,
    args,
    options,
  ).await?;
  
  // 菜单
  if let Some(menu_ids) = input.menu_ids {
    many2many_update(
      ctx,
      id.clone(),
      menu_ids.clone(),
      ManyOpts {
        r#mod: "base",
        table: "tenant_menu",
        column1: "tenant_id",
        column2: "menu_id",
      },
    ).await?;
  }
  
  Ok(id)
}

/// 获取外键关联表, 第一个是主表
#[allow(dead_code)]
fn get_foreign_tables() -> Vec<&'static str> {
  let table = "base_tenant";
  vec![
    table,
    "tenant_menu",
    "menu",
  ]
}

/// 根据 ids 删除数据
pub async fn delete_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_tenant";
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
  
  let table = "base_tenant";
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
pub async fn force_delete_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_tenant";
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

/// 查找 order_by 字段的最大值
pub async fn find_last_order_by<'a>(
  ctx: &mut impl Ctx<'a>,
  _options: Option<Options>,
) -> Result<i64> {
  
  let table = "base_tenant";
  let _method = "find_last_order_by";
  
  #[allow(unused_mut)]
  let mut args = QueryArgs::new();
  let mut sql_where = "".to_owned();
  
  sql_where += "t.is_deleted = 0";
  
  let sql = format!(
    "select t.order_by order_by from {} t where {} order by t.order_by desc limit 1",
    table,
    sql_where,
  );
  
  let args = args.into();
  
  let model = ctx.query_one::<OrderByModel>(
    sql,
    args,
    None,
  ).await?;
  
  let order_by = {
    if let Some(model) = model {
      model.order_by
    } else {
      0
    }
  };
  
  Ok(order_by)
}
