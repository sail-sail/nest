use anyhow::Result;
use tracing::info;

use crate::common::util::string::*;
use crate::common::util::dao::{many2many_update, ManyOpts};

#[allow(unused_imports)]
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

use crate::src::base::i18n::i18n_dao;

use crate::common::gql::model::{
  PageInput,
  SortInput,
};

use crate::src::base::dict_detail::dict_detail_dao::get_dict;

use super::menu_model::*;

#[allow(unused_variables)]
fn get_where_query<'a>(
  ctx: &mut impl Ctx<'a>,
  args: &mut QueryArgs,
  search: Option<MenuSearch>,
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
    let r#type: Vec<String> = match &search {
      Some(item) => item.r#type.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !r#type.is_empty() {
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
  {
    let parent_id: Vec<String> = match &search {
      Some(item) => item.parent_id.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !parent_id.is_empty() {
      let arg = {
        let mut items = Vec::with_capacity(parent_id.len());
        for item in parent_id {
          args.push(item.into());
          items.push("?");
        }
        items.join(",")
      };
      where_query += &format!(" and parent_id_lbl.id in ({})", arg);
    }
  }
  {
    let parent_id_is_null: bool = match &search {
      Some(item) => item.parent_id_is_null.unwrap_or(false),
      None => false,
    };
    if parent_id_is_null {
      where_query += &format!(" and parent_id_lbl.id is null");
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
    let route_path = match &search {
      Some(item) => item.route_path.clone(),
      None => None,
    };
    if let Some(route_path) = route_path {
      where_query += &format!(" and t.route_path = {}", args.push(route_path.into()));
    }
    let route_path_like = match &search {
      Some(item) => item.route_path_like.clone(),
      None => None,
    };
    if let Some(route_path_like) = route_path_like {
      where_query += &format!(" and t.route_path like {}", args.push((sql_like(&route_path_like) + "%").into()));
    }
  }
  {
    let route_query = match &search {
      Some(item) => item.route_query.clone(),
      None => None,
    };
    if let Some(route_query) = route_query {
      where_query += &format!(" and t.route_query = {}", args.push(route_query.into()));
    }
  }
  {
    let is_locked: Vec<u8> = match &search {
      Some(item) => item.is_locked.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !is_locked.is_empty() {
      let arg = {
        let mut items = Vec::with_capacity(is_locked.len());
        for item in is_locked {
          args.push(item.into());
          items.push("?");
        }
        items.join(",")
      };
      where_query += &format!(" and t.is_locked in ({})", arg);
    }
  }
  {
    let tenant_ids: Vec<String> = match &search {
      Some(item) => item.tenant_ids.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !tenant_ids.is_empty() {
      let arg = {
        let mut items = Vec::with_capacity(tenant_ids.len());
        for item in tenant_ids {
          args.push(item.into());
          items.push("?");
        }
        items.join(",")
      };
      where_query += &format!(" and base_tenant.id in ({})", arg);
    }
  }
  {
    let tenant_ids_is_null: bool = match &search {
      Some(item) => item.tenant_ids_is_null.unwrap_or(false),
      None => false,
    };
    if tenant_ids_is_null {
      where_query += &format!(" and tenant_ids_lbl.id is null");
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
  let from_query = r#"base_menu t
    left join base_menu parent_id_lbl
      on parent_id_lbl.id = t.parent_id
    left join base_tenant_menu
      on base_tenant_menu.menu_id = t.id
      and base_tenant_menu.is_deleted = 0
    left join base_tenant
      on base_tenant_menu.tenant_id = base_tenant.id
      and base_tenant.is_deleted = 0
    left join (
      select
        json_arrayagg(base_tenant.id) tenant_ids,
        json_arrayagg(base_tenant.lbl) tenant_ids_lbl,
        base_menu.id menu_id
      from base_tenant_menu
      inner join base_tenant
        on base_tenant.id = base_tenant_menu.tenant_id
        and base_tenant.is_deleted = 0
      inner join base_menu
        on base_menu.id = base_tenant_menu.menu_id
      where
        base_tenant_menu.is_deleted = 0
      group by menu_id
    ) _tenant
      on _tenant.menu_id = t.id
    left join base_usr create_usr_id_lbl
      on create_usr_id_lbl.id = t.create_usr_id
    left join base_usr update_usr_id_lbl
      on update_usr_id_lbl.id = t.update_usr_id"#;
  from_query
}

/// 根据搜索条件和分页查找数据
#[allow(unused_variables)]
pub async fn find_all<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<MenuSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<MenuModel>> {
  
  #[allow(unused_variables)]
  let table = "base_menu";
  let _method = "find_all";
  
  let mut args = QueryArgs::new();
  
  let from_query = get_from_query();
  let where_query = get_where_query(ctx, &mut args, search);
  let order_by_query = get_order_by_query(sort);
  let page_query = get_page_query(page);
  
  let sql = format!(r#"
    select
      t.*
      ,parent_id_lbl.lbl parent_id_lbl
      ,max(tenant_ids) tenant_ids
      ,max(tenant_ids_lbl) tenant_ids_lbl
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
  
  let options = options.set_cache_key(table, &sql, &args);
  
  let options = options.into();
  
  let mut res: Vec<MenuModel> = ctx.query(
    sql,
    args,
    options,
  ).await?;
  
  let dict_vec = get_dict(ctx, &vec![
    "menu_type",
    "is_locked",
    "is_enabled",
  ]).await?;
  
  let type_dict = &dict_vec[0];
  let is_locked_dict = &dict_vec[1];
  let is_enabled_dict = &dict_vec[2];
  
  for model in &mut res {
    
    // 类型
    model.r#type_lbl = {
      r#type_dict.iter()
        .find(|item| item.val == model.r#type.to_string())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.r#type.to_string())
    };
    
    // 锁定
    model.is_locked_lbl = {
      is_locked_dict.iter()
        .find(|item| item.val == model.is_locked.to_string())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.is_locked.to_string())
    };
    
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
  search: Option<MenuSearch>,
  options: Option<Options>,
) -> Result<i64> {
  
  #[allow(unused_variables)]
  let table = "base_menu";
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

/// 获取路由地址
pub fn get_route_path() -> String {
  "/base/menu".to_owned()
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
) -> Result<MenuFieldComment> {
  
  let n_route = get_n_route();
  
  let i18n_code_maps: Vec<i18n_dao::I18nCodeMap> = vec![
    "ID".into(),
    "类型".into(),
    "类型".into(),
    "父菜单".into(),
    "父菜单".into(),
    "名称".into(),
    "路由".into(),
    "参数".into(),
    "锁定".into(),
    "锁定".into(),
    "所在租户".into(),
    "所在租户".into(),
    "启用".into(),
    "启用".into(),
    "排序".into(),
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
  
  let field_comments = MenuFieldComment {
    id: vec[0].to_owned(),
    r#type: vec[1].to_owned(),
    r#type_lbl: vec[2].to_owned(),
    parent_id: vec[3].to_owned(),
    parent_id_lbl: vec[4].to_owned(),
    lbl: vec[5].to_owned(),
    route_path: vec[6].to_owned(),
    route_query: vec[7].to_owned(),
    is_locked: vec[8].to_owned(),
    is_locked_lbl: vec[9].to_owned(),
    tenant_ids: vec[10].to_owned(),
    tenant_ids_lbl: vec[11].to_owned(),
    is_enabled: vec[12].to_owned(),
    is_enabled_lbl: vec[13].to_owned(),
    order_by: vec[14].to_owned(),
    rem: vec[15].to_owned(),
    create_usr_id: vec[16].to_owned(),
    create_usr_id_lbl: vec[17].to_owned(),
    create_time: vec[18].to_owned(),
    create_time_lbl: vec[19].to_owned(),
    update_usr_id: vec[20].to_owned(),
    update_usr_id_lbl: vec[21].to_owned(),
    update_time: vec[22].to_owned(),
    update_time_lbl: vec[23].to_owned(),
  };
  Ok(field_comments)
}

/// 根据条件查找第一条数据
pub async fn find_one<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<MenuSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<MenuModel>> {
  
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
  
  let model: Option<MenuModel> = res.into_iter().next();
  
  Ok(model)
}

/// 根据ID查找第一条数据
pub async fn find_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  options: Option<Options>,
) -> Result<Option<MenuModel>> {
  
  let search = MenuSearch {
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
  search: MenuSearch,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<MenuModel>> {
  
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
  
  let mut models: Vec<MenuModel> = vec![];
  
  let mut models_tmp = {
    if
      search.parent_id.is_none() ||
      search.lbl.is_none()
    {
      return Ok(vec![]);
    }
    
    let search = MenuSearch {
      parent_id: search.parent_id,
      lbl: search.lbl,
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
      search.route_path.is_none()
    {
      return Ok(vec![]);
    }
    
    let search = MenuSearch {
      route_path: search.route_path,
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
  input: &MenuInput,
  model: &MenuModel,
) -> bool {
  if input.id.as_ref().is_some() {
    return input.id.as_ref().unwrap() == &model.id;
  }
  
  if
    input.parent_id.as_ref().is_some() && input.parent_id.as_ref().unwrap() == &model.parent_id &&
    input.lbl.as_ref().is_some() && input.lbl.as_ref().unwrap() == &model.lbl
  {
    return true;
  }
  
  if
    input.route_path.as_ref().is_some() && input.route_path.as_ref().unwrap() == &model.route_path
  {
    return true;
  }
  false
}

/// 通过唯一约束检查数据是否已经存在
#[allow(unused_variables)]
pub async fn check_by_unique<'a>(
  ctx: &mut impl Ctx<'a>,
  input: MenuInput,
  model: MenuModel,
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
    let id = update_by_id(
      ctx,
      model.id.clone(),
      input,
      None,
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
  input: MenuInput,
) -> Result<MenuInput> {
  
  #[allow(unused_mut)]
  let mut input = input;
  
  let dict_vec = get_dict(ctx, &vec![
    "menu_type",
    "is_locked",
    "is_enabled",
  ]).await?;
  
  // 类型
  if input.r#type.is_none() {
    let type_dict = &dict_vec[0];
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
  }
  
  // 锁定
  if input.is_locked.is_none() {
    let is_locked_dict = &dict_vec[1];
    if let Some(is_locked_lbl) = input.is_locked_lbl.clone() {
      input.is_locked = is_locked_dict.into_iter()
        .find(|item| {
          item.lbl == is_locked_lbl
        })
        .map(|item| {
          item.val.parse().unwrap_or_default()
        })
        .into();
    }
  }
  
  // 启用
  if input.is_enabled.is_none() {
    let is_enabled_dict = &dict_vec[2];
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
  }
  
  // 父菜单
  if input.parent_id.is_none() {
    if input.parent_id_lbl.is_some()
      && !input.parent_id_lbl.as_ref().unwrap().is_empty()
      && input.parent_id.is_none()
    {
      input.parent_id_lbl = input.parent_id_lbl.map(|item| 
        item.trim().to_owned()
      );
      let model = find_one(
        ctx,
        crate::gen::base::menu::menu_model::MenuSearch {
          lbl: input.parent_id_lbl.clone(),
          ..Default::default()
        }.into(),
        None,
        None,
      ).await?;
      if let Some(model) = model {
        input.parent_id = model.id.into();
      }
    }
  }
  
  // 所在租户
  if input.tenant_ids.is_none() {
    if input.tenant_ids_lbl.is_some() && input.tenant_ids.is_none() {
      input.tenant_ids_lbl = input.tenant_ids_lbl.map(|item| 
        item.into_iter()
          .map(|item| item.trim().to_owned())
          .collect::<Vec<String>>()
      );
      let mut models = vec![];
      for lbl in input.tenant_ids_lbl.clone().unwrap_or_default() {
        let model = crate::gen::base::tenant::tenant_dao::find_one(
          ctx,
          crate::gen::base::tenant::tenant_model::TenantSearch {
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
        input.tenant_ids = models.into_iter()
          .map(|item| item.id)
          .collect::<Vec<String>>()
          .into();
      }
    }
  }
  
  Ok(input)
}

/// 创建数据
pub async fn create<'a>(
  ctx: &mut impl Ctx<'a>,
  mut input: MenuInput,
  options: Option<Options>,
) -> Result<String> {
  
  validate(
    &input,
  )?;
  
  let table = "base_menu";
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
  
  if let Some(auth_model) = ctx.get_auth_model() {
    let usr_id = auth_model.id;
    sql_fields += ",create_usr_id";
    sql_values += ",?";
    args.push(usr_id.into());
  }
  // 类型
  if let Some(r#type) = input.r#type {
    sql_fields += ",type";
    sql_values += ",?";
    args.push(r#type.into());
  }
  // 父菜单
  if let Some(parent_id) = input.parent_id {
    sql_fields += ",parent_id";
    sql_values += ",?";
    args.push(parent_id.into());
  }
  // 名称
  if let Some(lbl) = input.lbl {
    sql_fields += ",lbl";
    sql_values += ",?";
    args.push(lbl.into());
  }
  // 路由
  if let Some(route_path) = input.route_path {
    sql_fields += ",route_path";
    sql_values += ",?";
    args.push(route_path.into());
  }
  // 参数
  if let Some(route_query) = input.route_query {
    sql_fields += ",route_query";
    sql_values += ",?";
    args.push(route_query.into());
  }
  // 锁定
  if let Some(is_locked) = input.is_locked {
    sql_fields += ",is_locked";
    sql_values += ",?";
    args.push(is_locked.into());
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
  
  let options = options.set_del_cache_key1s(get_foreign_tables());
  
  let options = options.into();
  
  ctx.execute(
    sql,
    args,
    options,
  ).await?;
  
  // 所在租户
  if let Some(tenant_ids) = input.tenant_ids {
    many2many_update(
      ctx,
      id.clone(),
      tenant_ids.clone(),
      ManyOpts {
        r#mod: "base",
        table: "tenant_menu",
        column1: "menu_id",
        column2: "tenant_id",
      },
    ).await?;
  }
  
  Ok(id)
}

/// 根据id修改数据
pub async fn update_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  mut input: MenuInput,
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
    
    let models: Vec<MenuModel> = models.into_iter()
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
  
  let table = "base_menu";
  let _method = "update_by_id";
  
  let now = ctx.get_now();
  
  let mut args = QueryArgs::new();
  
  let mut sql_fields = "update_time = ?".to_owned();
  args.push(now.into());
  
  let mut field_num: usize = 0;
  // 类型
  if let Some(r#type) = input.r#type {
    field_num += 1;
    sql_fields += ",type = ?";
    args.push(r#type.into());
  }
  // 父菜单
  if let Some(parent_id) = input.parent_id {
    field_num += 1;
    sql_fields += ",parent_id = ?";
    args.push(parent_id.into());
  }
  // 名称
  if let Some(lbl) = input.lbl {
    field_num += 1;
    sql_fields += ",lbl = ?";
    args.push(lbl.into());
  }
  // 路由
  if let Some(route_path) = input.route_path {
    field_num += 1;
    sql_fields += ",route_path = ?";
    args.push(route_path.into());
  }
  // 参数
  if let Some(route_query) = input.route_query {
    field_num += 1;
    sql_fields += ",route_query = ?";
    args.push(route_query.into());
  }
  // 锁定
  if let Some(is_locked) = input.is_locked {
    field_num += 1;
    sql_fields += ",is_locked = ?";
    args.push(is_locked.into());
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
  
  let mut field_num = 0;
  
  // 所在租户
  if let Some(tenant_ids) = input.tenant_ids {
    many2many_update(
      ctx,
      id.clone(),
      tenant_ids.clone(),
      ManyOpts {
        r#mod: "base",
        table: "tenant_menu",
        column1: "menu_id",
        column2: "tenant_id",
      },
    ).await?;
    
    field_num += 1;
  }
  
  if field_num > 0 {
    let options = Options::from(None);
    let options = options.set_del_cache_key1s(get_foreign_tables());
    if let Some(del_cache_key1s) = options.get_del_cache_key1s() {
      crate::common::cache::cache_dao::del_caches(del_cache_key1s).await?;
    }
  }
  
  Ok(id)
}

/// 获取外键关联表, 第一个是主表
#[allow(dead_code)]
fn get_foreign_tables() -> Vec<&'static str> {
  let table = "base_menu";
  vec![
    table,
    "base_menu",
    "base_tenant_menu",
    "base_tenant",
    "base_usr",
  ]
}

/// 根据 ids 删除数据
pub async fn delete_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_menu";
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

/// 根据 ID 查找是否已启用
/// 记录不存在则返回 false
pub async fn get_is_enabled_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  options: Option<Options>,
) -> Result<bool> {
  
  let model = find_by_id(ctx, id, options).await?;
  
  let is_enabled = {
    if let Some(model) = model {
      model.is_enabled == 1
    } else {
      false
    }
  };
  
  Ok(is_enabled)
}

/// 根据 ids 启用或禁用数据
pub async fn enable_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_menu";
  let _method = "enable_by_ids";
  
  let options = Options::from(options);
  
  let options = options.set_del_cache_key1s(get_foreign_tables());
  
  let mut num = 0;
  for id in ids {
    let mut args = QueryArgs::new();
    
    let sql = format!(
      "update {} set is_enabled=? where id=? limit 1",
      table,
    );
    
    args.push(is_enabled.into());
    args.push(id.into());
    
    let args = args.into();
    
    let options = options.clone().into();
    
    num += ctx.execute(
      sql,
      args,
      options,
    ).await?;
  }
  
  Ok(num)
}

/// 根据 ID 查找是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
pub async fn get_is_locked_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  options: Option<Options>,
) -> Result<bool> {
  
  let model = find_by_id(ctx, id, options).await?;
  
  let is_locked = {
    if let Some(model) = model {
      model.is_locked == 1
    } else {
      false
    }
  };
  
  Ok(is_locked)
}

/// 根据 ids 锁定或者解锁数据
pub async fn lock_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_menu";
  let _method = "lock_by_ids";
  
  let options = Options::from(options);
  
  let options = options.set_del_cache_key1s(get_foreign_tables());
  
  let mut num = 0;
  for id in ids {
    let mut args = QueryArgs::new();
    
    let sql = format!(
      "update {} set is_locked=? where id=? limit 1",
      table,
    );
    
    args.push(is_locked.into());
    args.push(id.into());
    
    let args = args.into();
    
    let options = options.clone().into();
    
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
  
  let table = "base_menu";
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
      
      let mut input: MenuInput = old_model.into();
      input.id = None;
      
      let models = find_by_unique(
        ctx,
        input.into(),
        None,
        None,
      ).await?;
      
      let models: Vec<MenuModel> = models.into_iter()
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
  
  let table = "base_menu";
  let _method = "force_delete_by_ids";
  
  let options = Options::from(options);
  
  let mut num = 0;
  for id in ids {
    
    let model = find_all(
      ctx,
      MenuSearch {
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

/// 查找 order_by 字段的最大值
pub async fn find_last_order_by<'a>(
  ctx: &mut impl Ctx<'a>,
  options: Option<Options>,
) -> Result<u32> {
  
  let table = "base_menu";
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
  
  let options = Options::from(options);
  
  let options = options.set_cache_key(table, &sql, &args);
  
  let options = options.into();
  
  let model = ctx.query_one::<OrderByModel>(
    sql,
    args,
    options,
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

/// 校验, 校验失败时抛出SrvErr异常
#[allow(unused_imports)]
pub fn validate<'a>(
  input: &MenuInput,
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
  chars_max_length(
    input.id.clone(),
    22,
    "",
  )?;
  chars_max_length(
    input.id.clone(),
    22,
    "",
  )?;
  chars_max_length(
    input.id.clone(),
    22,
    "",
  )?;
  
  // 类型
  chars_max_length(
    input.r#type.clone(),
    10,
    "",
  )?;
  chars_max_length(
    input.r#type.clone(),
    10,
    "",
  )?;
  chars_max_length(
    input.r#type.clone(),
    10,
    "",
  )?;
  chars_max_length(
    input.r#type.clone(),
    10,
    "",
  )?;
  
  // 父菜单
  chars_max_length(
    input.parent_id.clone(),
    22,
    "",
  )?;
  chars_max_length(
    input.parent_id.clone(),
    22,
    "",
  )?;
  chars_max_length(
    input.parent_id.clone(),
    22,
    "",
  )?;
  chars_max_length(
    input.parent_id.clone(),
    22,
    "",
  )?;
  
  // 名称
  chars_max_length(
    input.lbl.clone(),
    45,
    "",
  )?;
  chars_max_length(
    input.lbl.clone(),
    45,
    "",
  )?;
  chars_max_length(
    input.lbl.clone(),
    45,
    "",
  )?;
  chars_max_length(
    input.lbl.clone(),
    45,
    "",
  )?;
  
  // 路由
  chars_max_length(
    input.route_path.clone(),
    255,
    "",
  )?;
  chars_max_length(
    input.route_path.clone(),
    255,
    "",
  )?;
  chars_max_length(
    input.route_path.clone(),
    255,
    "",
  )?;
  chars_max_length(
    input.route_path.clone(),
    255,
    "",
  )?;
  
  // 备注
  chars_max_length(
    input.rem.clone(),
    255,
    "",
  )?;
  chars_max_length(
    input.rem.clone(),
    255,
    "",
  )?;
  chars_max_length(
    input.rem.clone(),
    255,
    "",
  )?;
  chars_max_length(
    input.rem.clone(),
    255,
    "",
  )?;
  
  // 创建人
  chars_max_length(
    input.create_usr_id.clone(),
    22,
    "",
  )?;
  chars_max_length(
    input.create_usr_id.clone(),
    22,
    "",
  )?;
  chars_max_length(
    input.create_usr_id.clone(),
    22,
    "",
  )?;
  chars_max_length(
    input.create_usr_id.clone(),
    22,
    "",
  )?;
  
  // 更新人
  chars_max_length(
    input.update_usr_id.clone(),
    22,
    "",
  )?;
  chars_max_length(
    input.update_usr_id.clone(),
    22,
    "",
  )?;
  chars_max_length(
    input.update_usr_id.clone(),
    22,
    "",
  )?;
  chars_max_length(
    input.update_usr_id.clone(),
    22,
    "",
  )?;
  
  Ok(())
}
