use anyhow::Result;
use tracing::info;
use crate::common::util::string::*;

use crate::common::util::dao::{
  many2many_update,
  ManyOpts,
};

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

use crate::src::base::dict_detail::dict_detail_dao::get_dict;

use super::role_model::*;

#[allow(unused_variables)]
async fn get_where_query<'a>(
  ctx: &mut impl Ctx<'a>,
  args: &mut QueryArgs,
  search: Option<RoleSearch>,
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
      where_query += " and menu_ids_lbl.id is null";
    }
  }
  {
    let permit_ids: Vec<String> = match &search {
      Some(item) => item.permit_ids.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !permit_ids.is_empty() {
      let arg = {
        let mut items = Vec::with_capacity(permit_ids.len());
        for item in permit_ids {
          args.push(item.into());
          items.push("?");
        }
        items.join(",")
      };
      where_query += &format!(" and base_permit.id in ({})", arg);
    }
  }
  {
    let permit_ids_is_null: bool = match &search {
      Some(item) => item.permit_ids_is_null.unwrap_or(false),
      None => false,
    };
    if permit_ids_is_null {
      where_query += " and permit_ids_lbl.id is null";
    }
  }
  {
    let data_permit_ids: Vec<String> = match &search {
      Some(item) => item.data_permit_ids.clone().unwrap_or_default(),
      None => Default::default(),
    };
    if !data_permit_ids.is_empty() {
      let arg = {
        let mut items = Vec::with_capacity(data_permit_ids.len());
        for item in data_permit_ids {
          args.push(item.into());
          items.push("?");
        }
        items.join(",")
      };
      where_query += &format!(" and base_data_permit.id in ({})", arg);
    }
  }
  {
    let data_permit_ids_is_null: bool = match &search {
      Some(item) => item.data_permit_ids_is_null.unwrap_or(false),
      None => false,
    };
    if data_permit_ids_is_null {
      where_query += " and data_permit_ids_lbl.id is null";
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
      where_query += " and create_usr_id_lbl.id is null";
    }
  }
  {
    let create_time: Vec<chrono::NaiveDateTime> = match &search {
      Some(item) => item.create_time.clone().unwrap_or_default(),
      None => vec![],
    };
    let create_time_gt: Option<chrono::NaiveDateTime> = match &create_time.len() {
      0 => None,
      _ => create_time[0].into(),
    };
    let create_time_lt: Option<chrono::NaiveDateTime> = match &create_time.len() {
      0 => None,
      1 => None,
      _ => create_time[1].into(),
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
      where_query += " and update_usr_id_lbl.id is null";
    }
  }
  {
    let update_time: Vec<chrono::NaiveDateTime> = match &search {
      Some(item) => item.update_time.clone().unwrap_or_default(),
      None => vec![],
    };
    let update_time_gt: Option<chrono::NaiveDateTime> = match &update_time.len() {
      0 => None,
      _ => update_time[0].into(),
    };
    let update_time_lt: Option<chrono::NaiveDateTime> = match &update_time.len() {
      0 => None,
      1 => None,
      _ => update_time[1].into(),
    };
    if let Some(update_time_gt) = update_time_gt {
      where_query += &format!(" and t.update_time >= {}", args.push(update_time_gt.into()));
    }
    if let Some(update_time_lt) = update_time_lt {
      where_query += &format!(" and t.update_time <= {}", args.push(update_time_lt.into()));
    }
  }
  Ok(where_query)
}

async fn get_from_query() -> Result<String> {
  let from_query = r#"base_role t
    left join base_role_menu
      on base_role_menu.role_id = t.id
      and base_role_menu.is_deleted = 0
    left join base_menu
      on base_role_menu.menu_id = base_menu.id
      and base_menu.is_deleted = 0
    left join (
      select
        json_objectagg(base_role_menu.order_by, base_menu.id) menu_ids,
        json_objectagg(base_role_menu.order_by, base_menu.lbl) menu_ids_lbl,
        base_role.id role_id
      from base_role_menu
      inner join base_menu
        on base_menu.id = base_role_menu.menu_id
        and base_menu.is_deleted = 0
      inner join base_role
        on base_role.id = base_role_menu.role_id
      where
        base_role_menu.is_deleted = 0
      group by role_id
    ) _menu
      on _menu.role_id = t.id
    left join base_role_permit
      on base_role_permit.role_id = t.id
      and base_role_permit.is_deleted = 0
    left join base_permit
      on base_role_permit.permit_id = base_permit.id
      and base_permit.is_deleted = 0
    left join (
      select
        json_objectagg(base_role_permit.order_by, base_permit.id) permit_ids,
        json_objectagg(base_role_permit.order_by, base_permit.lbl) permit_ids_lbl,
        base_role.id role_id
      from base_role_permit
      inner join base_permit
        on base_permit.id = base_role_permit.permit_id
        and base_permit.is_deleted = 0
      inner join base_role
        on base_role.id = base_role_permit.role_id
      where
        base_role_permit.is_deleted = 0
      group by role_id
    ) _permit
      on _permit.role_id = t.id
    left join base_role_data_permit
      on base_role_data_permit.role_id = t.id
      and base_role_data_permit.is_deleted = 0
    left join base_data_permit
      on base_role_data_permit.data_permit_id = base_data_permit.id
      and base_data_permit.is_deleted = 0
    left join (
      select
        json_objectagg(base_role_data_permit.order_by, base_data_permit.id) data_permit_ids,
        json_objectagg(base_role_data_permit.order_by, base_data_permit.scope) data_permit_ids_lbl,
        base_role.id role_id
      from base_role_data_permit
      inner join base_data_permit
        on base_data_permit.id = base_role_data_permit.data_permit_id
        and base_data_permit.is_deleted = 0
      inner join base_role
        on base_role.id = base_role_data_permit.role_id
      where
        base_role_data_permit.is_deleted = 0
      group by role_id
    ) _data_permit
      on _data_permit.role_id = t.id
    left join base_usr create_usr_id_lbl
      on create_usr_id_lbl.id = t.create_usr_id
    left join base_usr update_usr_id_lbl
      on update_usr_id_lbl.id = t.update_usr_id"#.to_owned();
  Ok(from_query)
}

/// 根据搜索条件和分页查找数据
#[allow(unused_variables)]
pub async fn find_all<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<RoleSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<RoleModel>> {
  
  #[allow(unused_variables)]
  let table = "base_role";
  let _method = "find_all";
  
  let mut args = QueryArgs::new();
  
  let from_query = get_from_query().await?;
  let where_query = get_where_query(ctx, &mut args, search).await?;
  let order_by_query = get_order_by_query(sort);
  let page_query = get_page_query(page);
  
  let sql = format!(r#"
    select
      t.*
      ,max(menu_ids) menu_ids
      ,max(menu_ids_lbl) menu_ids_lbl
      ,max(permit_ids) permit_ids
      ,max(permit_ids_lbl) permit_ids_lbl
      ,max(data_permit_ids) data_permit_ids
      ,max(data_permit_ids_lbl) data_permit_ids_lbl
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
  
  let mut res: Vec<RoleModel> = ctx.query(
    sql,
    args,
    options,
  ).await?;
  
  let dict_vec = get_dict(ctx, &vec![
    "is_locked",
    "is_enabled",
  ]).await?;
  
  let is_locked_dict = &dict_vec[0];
  let is_enabled_dict = &dict_vec[1];
  
  for model in &mut res {
    
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
  search: Option<RoleSearch>,
  options: Option<Options>,
) -> Result<i64> {
  
  #[allow(unused_variables)]
  let table = "base_role";
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
  "/base/role".to_owned()
}

/// 获取当前路由的国际化
pub fn get_n_route() -> i18n_dao::NRoute {
  i18n_dao::NRoute {
    route_path: get_route_path().into(),
  }
}

/// 获取字段对应的国家化后的名称
pub async fn get_field_comments<'a>(
  ctx: &mut impl Ctx<'a>,
  _options: Option<Options>,
) -> Result<RoleFieldComment> {
  
  let n_route = get_n_route();
  
  let i18n_code_maps: Vec<i18n_dao::I18nCodeMap> = vec![
    "ID".into(),
    "名称".into(),
    "菜单权限".into(),
    "菜单权限".into(),
    "按钮权限".into(),
    "按钮权限".into(),
    "数据权限".into(),
    "数据权限".into(),
    "锁定".into(),
    "锁定".into(),
    "启用".into(),
    "启用".into(),
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
  
  let vec = i18n_code_maps.into_iter()
    .map(|item|
      map.get(&item.code)
        .map(|item| item.to_owned())
        .unwrap_or_default()
    )
    .collect::<Vec<String>>();
  
  let field_comments = RoleFieldComment {
    id: vec[0].to_owned(),
    lbl: vec[1].to_owned(),
    menu_ids: vec[2].to_owned(),
    menu_ids_lbl: vec[3].to_owned(),
    permit_ids: vec[4].to_owned(),
    permit_ids_lbl: vec[5].to_owned(),
    data_permit_ids: vec[6].to_owned(),
    data_permit_ids_lbl: vec[7].to_owned(),
    is_locked: vec[8].to_owned(),
    is_locked_lbl: vec[9].to_owned(),
    is_enabled: vec[10].to_owned(),
    is_enabled_lbl: vec[11].to_owned(),
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

/// 根据条件查找第一条数据
pub async fn find_one<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<RoleSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<RoleModel>> {
  
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
  
  let model: Option<RoleModel> = res.into_iter().next();
  
  Ok(model)
}

/// 根据ID查找第一条数据
pub async fn find_by_id<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
  options: Option<Options>,
) -> Result<Option<RoleModel>> {
  
  let search = RoleSearch {
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
  search: RoleSearch,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<RoleModel>> {
  
  if let Some(id) = search.id {
    let model = find_by_id(
      ctx,
      id,
      None,
    ).await?;
    return Ok(model.map_or_else(Vec::new, |m| vec![m]));
  }
  
  let mut models: Vec<RoleModel> = vec![];
  
  let mut models_tmp = {
    if
      search.lbl.is_none()
    {
      return Ok(vec![]);
    }
    
    let search = RoleSearch {
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
  
  Ok(models)
}

/// 根据唯一约束对比对象是否相等
#[allow(dead_code)]
fn equals_by_unique(
  input: &RoleInput,
  model: &RoleModel,
) -> bool {
  if input.id.as_ref().is_some() {
    return input.id.as_ref().unwrap() == &model.id;
  }
  
  if
    input.lbl.as_ref().is_some() && input.lbl.as_ref().unwrap() == &model.lbl
  {
    return true;
  }
  false
}

/// 通过唯一约束检查数据是否已经存在
#[allow(unused_variables)]
pub async fn check_by_unique<'a>(
  ctx: &mut impl Ctx<'a>,
  input: RoleInput,
  model: RoleModel,
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
  input: RoleInput,
) -> Result<RoleInput> {
  
  #[allow(unused_mut)]
  let mut input = input;
  
  let dict_vec = get_dict(ctx, &vec![
    "is_locked",
    "is_enabled",
  ]).await?;
  
  // 锁定
  if input.is_locked.is_none() {
    let is_locked_dict = &dict_vec[0];
    if let Some(is_locked_lbl) = input.is_locked_lbl.clone() {
      input.is_locked = is_locked_dict.iter()
        .find(|item| {
          item.lbl == is_locked_lbl
        })
        .map(|item| {
          item.val.parse().unwrap_or_default()
        });
    }
  }
  
  // 启用
  if input.is_enabled.is_none() {
    let is_enabled_dict = &dict_vec[1];
    if let Some(is_enabled_lbl) = input.is_enabled_lbl.clone() {
      input.is_enabled = is_enabled_dict.iter()
        .find(|item| {
          item.lbl == is_enabled_lbl
        })
        .map(|item| {
          item.val.parse().unwrap_or_default()
        });
    }
  }
  
  // 菜单权限
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
  
  // 按钮权限
  if input.permit_ids_lbl.is_some() && input.permit_ids.is_none() {
    input.permit_ids_lbl = input.permit_ids_lbl.map(|item| 
      item.into_iter()
        .map(|item| item.trim().to_owned())
        .collect::<Vec<String>>()
    );
    let mut models = vec![];
    for lbl in input.permit_ids_lbl.clone().unwrap_or_default() {
      let model = crate::gen::base::permit::permit_dao::find_one(
        ctx,
        crate::gen::base::permit::permit_model::PermitSearch {
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
      input.permit_ids = models.into_iter()
        .map(|item| item.id)
        .collect::<Vec<String>>()
        .into();
    }
  }
  
  // 数据权限
  if input.data_permit_ids_lbl.is_some() && input.data_permit_ids.is_none() {
    input.data_permit_ids_lbl = input.data_permit_ids_lbl.map(|item| 
      item.into_iter()
        .map(|item| item.trim().to_owned())
        .collect::<Vec<String>>()
    );
    let mut models = vec![];
    for lbl in input.data_permit_ids_lbl.clone().unwrap_or_default() {
      let model = crate::gen::base::data_permit::data_permit_dao::find_one(
        ctx,
        crate::gen::base::data_permit::data_permit_model::DataPermitSearch {
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
      input.data_permit_ids = models.into_iter()
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
  mut input: RoleInput,
  options: Option<Options>,
) -> Result<String> {
  
  validate(
    &input,
  )?;
  
  let table = "base_role";
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
  
  if !old_models.is_empty() {
    
    let unique_type = options.as_ref()
      .map(|item|
        item.get_unique_type().unwrap_or(UniqueType::Throw)
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
    
    if let Some(id) = id {
      return Ok(id);
    }
  }
  
  if input.menu_ids.is_some() {
    input.menu_ids = crate::src::base::tenant::tenant_dao::filter_menu_ids_by_tenant(
      ctx,
      input.menu_ids.unwrap(),
    ).await?.into();
  }
  
  let id = get_short_uuid();
  
  if input.id.is_none() {
    input.id = id.clone().into();
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
  
  // 菜单权限
  if let Some(menu_ids) = input.menu_ids {
    many2many_update(
      ctx,
      id.clone(),
      menu_ids.clone(),
      ManyOpts {
        r#mod: "base",
        table: "role_menu",
        column1: "role_id",
        column2: "menu_id",
      },
    ).await?;
  }
  
  // 按钮权限
  if let Some(permit_ids) = input.permit_ids {
    many2many_update(
      ctx,
      id.clone(),
      permit_ids.clone(),
      ManyOpts {
        r#mod: "base",
        table: "role_permit",
        column1: "role_id",
        column2: "permit_id",
      },
    ).await?;
  }
  
  // 数据权限
  if let Some(data_permit_ids) = input.data_permit_ids {
    many2many_update(
      ctx,
      id.clone(),
      data_permit_ids.clone(),
      ManyOpts {
        r#mod: "base",
        table: "role_data_permit",
        column1: "role_id",
        column2: "data_permit_id",
      },
    ).await?;
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
  let table = "base_role";
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
  mut input: RoleInput,
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
    
    let models = models.into_iter()
      .filter(|item| 
        item.id != id
      )
      .collect::<Vec<RoleModel>>();
    
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
  
  let table = "base_role";
  let _method = "update_by_id";
  
  let now = ctx.get_now();
  
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
  
  if input.menu_ids.is_some() {
    input.menu_ids = crate::src::base::tenant::tenant_dao::filter_menu_ids_by_tenant(
      ctx,
      input.menu_ids.unwrap(),
    ).await?.into();
  }
  
  let mut field_num = 0;
  
  // 菜单权限
  if let Some(menu_ids) = input.menu_ids {
    many2many_update(
      ctx,
      id.clone(),
      menu_ids.clone(),
      ManyOpts {
        r#mod: "base",
        table: "role_menu",
        column1: "role_id",
        column2: "menu_id",
      },
    ).await?;
    
    field_num += 1;
  }
  
  // 按钮权限
  if let Some(permit_ids) = input.permit_ids {
    many2many_update(
      ctx,
      id.clone(),
      permit_ids.clone(),
      ManyOpts {
        r#mod: "base",
        table: "role_permit",
        column1: "role_id",
        column2: "permit_id",
      },
    ).await?;
    
    field_num += 1;
  }
  
  // 数据权限
  if let Some(data_permit_ids) = input.data_permit_ids {
    many2many_update(
      ctx,
      id.clone(),
      data_permit_ids.clone(),
      ManyOpts {
        r#mod: "base",
        table: "role_data_permit",
        column1: "role_id",
        column2: "data_permit_id",
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
  let table = "base_role";
  vec![
    table,
    "base_role_menu",
    "base_menu",
    "base_role_permit",
    "base_permit",
    "base_role_data_permit",
    "base_data_permit",
    "base_usr",
  ]
}

/// 根据 ids 删除数据
pub async fn delete_by_ids<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_role";
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
  
  let table = "base_role";
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
  
  let table = "base_role";
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
  
  let table = "base_role";
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
      
      let mut input: RoleInput = old_model.into();
      input.id = None;
      
      let models = find_by_unique(
        ctx,
        input.into(),
        None,
        None,
      ).await?;
      
      let models: Vec<RoleModel> = models.into_iter()
        .filter(|item| 
          item.id != id
        )
        .collect();
      
      if !models.is_empty() {
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
  
  let table = "base_role";
  let _method = "force_delete_by_ids";
  
  let options = Options::from(options);
  
  let mut num = 0;
  for id in ids {
    
    let model = find_all(
      ctx,
      RoleSearch {
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

/// 校验记录是否启用
#[function_name::named]
#[allow(dead_code)]
pub async fn validate_is_enabled<'a>(
  ctx: &mut impl Ctx<'a>,
  model: &RoleModel,
) -> Result<()> {
  if model.is_enabled == 0 {
    let msg0 = i18n_dao::ns(
      ctx,
      "角色".to_owned(),
      None,
    ).await?;
    let msg1 = i18n_dao::ns(
      ctx,
      "已禁用".to_owned(),
      None,
    ).await?;
    let err_msg = msg0 + &msg1;
    return Err(SrvErr::new(function_name!().to_owned(), err_msg).into());
  }
  Ok(())
}

/// 校验记录是否存在
#[function_name::named]
#[allow(dead_code)]
pub async fn validate_option<'a, T>(
  ctx: &mut impl Ctx<'a>,
  model: Option<T>,
) -> Result<T> {
  if model.is_none() {
    let msg0 = i18n_dao::ns(
      ctx,
      "角色".to_owned(),
      None,
    ).await?;
    let msg1 = i18n_dao::ns(
      ctx,
      "不存在".to_owned(),
      None,
    ).await?;
    let err_msg = msg0 + &msg1;
    return Err(SrvErr::new(function_name!().to_owned(), err_msg).into());
  }
  Ok(model.unwrap())
}

/// 校验, 校验失败时抛出SrvErr异常
#[allow(unused_imports)]
pub fn validate(
  input: &RoleInput,
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
  
  // 名称
  chars_max_length(
    input.lbl.clone(),
    45,
    "",
  )?;
  
  // 备注
  chars_max_length(
    input.rem.clone(),
    100,
    "",
  )?;
  
  // 创建人
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
  
  Ok(())
}
