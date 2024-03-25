#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use std::collections::HashSet;

use anyhow::Result;
use tracing::{info, error};
#[allow(unused_imports)]
use crate::common::util::string::*;

use crate::common::util::dao::{
  many2many_update,
  ManyOpts,
};

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
  OrderByModel,
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

use super::tenant_model::*;
use crate::gen::base::domain::domain_model::DomainId;
use crate::gen::base::menu::menu_model::MenuId;
use crate::gen::base::usr::usr_model::UsrId;

#[allow(unused_variables)]
async fn get_where_query(
  args: &mut QueryArgs,
  search: Option<&TenantSearch>,
  options: Option<&Options>,
) -> Result<String> {
  let is_deleted = search
    .and_then(|item| item.is_deleted)
    .unwrap_or(0);
  let mut where_query = String::with_capacity(80 * 14 * 2);
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
    let ids: Option<Vec<TenantId>> = match search {
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
  // 所属域名
  {
    let domain_ids: Option<Vec<DomainId>> = match search {
      Some(item) => item.domain_ids.clone(),
      None => None,
    };
    if let Some(domain_ids) = domain_ids {
      let arg = {
        let mut items = Vec::with_capacity(domain_ids.len());
        for item in domain_ids {
          args.push(item.into());
          items.push("?");
        }
        items.join(",")
      };
      where_query += &format!(" and base_domain.id in ({})", arg);
    }
  }
  {
    let domain_ids_is_null: bool = match search {
      Some(item) => item.domain_ids_is_null.unwrap_or(false),
      None => false,
    };
    if domain_ids_is_null {
      where_query += " and domain_ids_lbl.id is null";
    }
  }
  // 菜单权限
  {
    let menu_ids: Option<Vec<MenuId>> = match search {
      Some(item) => item.menu_ids.clone(),
      None => None,
    };
    if let Some(menu_ids) = menu_ids {
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
    let menu_ids_is_null: bool = match search {
      Some(item) => item.menu_ids_is_null.unwrap_or(false),
      None => false,
    };
    if menu_ids_is_null {
      where_query += " and menu_ids_lbl.id is null";
    }
  }
  // 锁定
  {
    let is_locked: Option<Vec<u8>> = match search {
      Some(item) => item.is_locked.clone(),
      None => None,
    };
    if let Some(is_locked) = is_locked {
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
  // 启用
  {
    let is_enabled: Option<Vec<u8>> = match search {
      Some(item) => item.is_enabled.clone(),
      None => None,
    };
    if let Some(is_enabled) = is_enabled {
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
  // 排序
  {
    let mut order_by: Vec<Option<u32>> = match search {
      Some(item) => item.order_by.clone().unwrap_or_default(),
      None => Default::default(),
    };
    let order_by_gt: Option<u32> = order_by.get_mut(0)
      .and_then(|item| item.take());
    let order_by_lt: Option<u32> = order_by.get_mut(1)
      .and_then(|item| item.take());
    if let Some(order_by_gt) = order_by_gt {
      where_query += &format!(" and t.order_by >= {}", args.push(order_by_gt.into()));
    }
    if let Some(order_by_lt) = order_by_lt {
      where_query += &format!(" and t.order_by <= {}", args.push(order_by_lt.into()));
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
  search: Option<&TenantSearch>,
  options: Option<&Options>,
) -> Result<String> {
  let is_deleted = search
    .and_then(|item| item.is_deleted)
    .unwrap_or(0);
  let from_query = r#"base_tenant t
    left join base_tenant_domain
      on base_tenant_domain.tenant_id = t.id
      and base_tenant_domain.is_deleted = ?
    left join base_domain
      on base_tenant_domain.domain_id = base_domain.id
      and base_domain.is_deleted = ?
    left join (
      select
        json_objectagg(base_tenant_domain.order_by, base_domain.id) domain_ids,
        json_objectagg(base_tenant_domain.order_by, base_domain.lbl) domain_ids_lbl,
        base_tenant.id tenant_id
      from base_tenant_domain
      inner join base_domain
        on base_domain.id = base_tenant_domain.domain_id
      inner join base_tenant
        on base_tenant.id = base_tenant_domain.tenant_id
      where
        base_tenant_domain.is_deleted = ?
      group by tenant_id
    ) _domain
      on _domain.tenant_id = t.id
    left join base_tenant_menu
      on base_tenant_menu.tenant_id = t.id
      and base_tenant_menu.is_deleted = ?
    left join base_menu
      on base_tenant_menu.menu_id = base_menu.id
      and base_menu.is_deleted = ?
    left join (
      select
        json_objectagg(base_tenant_menu.order_by, base_menu.id) menu_ids,
        json_objectagg(base_tenant_menu.order_by, base_menu.lbl) menu_ids_lbl,
        base_tenant.id tenant_id
      from base_tenant_menu
      inner join base_menu
        on base_menu.id = base_tenant_menu.menu_id
      inner join base_tenant
        on base_tenant.id = base_tenant_menu.tenant_id
      where
        base_tenant_menu.is_deleted = ?
      group by tenant_id
    ) _menu
      on _menu.tenant_id = t.id
    left join base_usr create_usr_id_lbl
      on create_usr_id_lbl.id = t.create_usr_id
    left join base_usr update_usr_id_lbl
      on update_usr_id_lbl.id = t.update_usr_id"#.to_owned();
  args.push(is_deleted.into());
  args.push(is_deleted.into());
  args.push(is_deleted.into());
  args.push(is_deleted.into());
  args.push(is_deleted.into());
  args.push(is_deleted.into());
  Ok(from_query)
}

/// 根据搜索条件和分页查找租户列表
pub async fn find_all(
  search: Option<TenantSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<TenantModel>> {
  
  let table = "base_tenant";
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
  // 所属域名
  if let Some(search) = &search {
    if search.domain_ids.is_some() && search.domain_ids.as_ref().unwrap().is_empty() {
      return Ok(vec![]);
    }
  }
  // 菜单权限
  if let Some(search) = &search {
    if search.menu_ids.is_some() && search.menu_ids.as_ref().unwrap().is_empty() {
      return Ok(vec![]);
    }
  }
  // 锁定
  if let Some(search) = &search {
    if search.is_locked.is_some() && search.is_locked.as_ref().unwrap().is_empty() {
      return Ok(vec![]);
    }
  }
  // 启用
  if let Some(search) = &search {
    if search.is_enabled.is_some() && search.is_enabled.as_ref().unwrap().is_empty() {
      return Ok(vec![]);
    }
  }
  // 创建人
  if let Some(search) = &search {
    if search.create_usr_id.is_some() && search.create_usr_id.as_ref().unwrap().is_empty() {
      return Ok(vec![]);
    }
  }
  // 更新人
  if let Some(search) = &search {
    if search.update_usr_id.is_some() && search.update_usr_id.as_ref().unwrap().is_empty() {
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
  if !sort.iter().any(|item| item.prop == "order_by") {
    sort.push(SortInput {
      prop: "order_by".into(),
      order: "asc".into(),
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
      ,max(domain_ids) domain_ids
      ,max(domain_ids_lbl) domain_ids_lbl
      ,max(menu_ids) menu_ids
      ,max(menu_ids_lbl) menu_ids_lbl
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
  
  let mut res: Vec<TenantModel> = query(
    sql,
    args,
    options,
  ).await?;
  
  let dict_vec = get_dict(&[
    "is_locked",
    "is_enabled",
  ]).await?;
  let [
    is_locked_dict,
    is_enabled_dict,
  ]: [Vec<_>; 2] = dict_vec
    .try_into()
    .map_err(|err| anyhow::anyhow!(format!("{:#?}", err)))?;
  
  #[allow(unused_variables)]
  for model in &mut res {
    
    // 锁定
    model.is_locked_lbl = {
      is_locked_dict
        .iter()
        .find(|item| item.val == model.is_locked.to_string())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.is_locked.to_string())
    };
    
    // 启用
    model.is_enabled_lbl = {
      is_enabled_dict
        .iter()
        .find(|item| item.val == model.is_enabled.to_string())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.is_enabled.to_string())
    };
    
  }
  
  Ok(res)
}

/// 根据条件查找租户总数
pub async fn find_count(
  search: Option<TenantSearch>,
  options: Option<Options>,
) -> Result<i64> {
  
  let table = "base_tenant";
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
  
  let options = options.set_cache_key(table, &sql, &args);
  
  let options = options.into();
  
  let res: Option<CountModel> = query_one(
    sql,
    args,
    options,
  ).await?;
  
  let total = res
    .map(|item| item.total)
    .unwrap_or_default();
  
  Ok(total)
}

/// 获取路由地址
pub fn get_route_path() -> String {
  "/base/tenant".to_owned()
}

/// 获取当前路由的国际化
pub fn get_n_route() -> i18n_dao::NRoute {
  i18n_dao::NRoute {
    route_path: get_route_path().into(),
  }
}

/// 获取租户字段注释
pub async fn get_field_comments(
  _options: Option<Options>,
) -> Result<TenantFieldComment> {
  
  let n_route = get_n_route();
  
  let i18n_code_maps: Vec<i18n_dao::I18nCodeMap> = vec![
    "ID".into(),
    "名称".into(),
    "所属域名".into(),
    "所属域名".into(),
    "菜单权限".into(),
    "菜单权限".into(),
    "锁定".into(),
    "锁定".into(),
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
    i18n_code_maps.clone(),
  ).await?;
  
  let vec = i18n_code_maps.into_iter()
    .map(|item|
      map.get(&item.code)
        .map(|item| item.to_owned())
        .unwrap_or_default()
    )
    .collect::<Vec<String>>();
  
  let field_comments = TenantFieldComment {
    id: vec[0].to_owned(),
    lbl: vec[1].to_owned(),
    domain_ids: vec[2].to_owned(),
    domain_ids_lbl: vec[3].to_owned(),
    menu_ids: vec[4].to_owned(),
    menu_ids_lbl: vec[5].to_owned(),
    is_locked: vec[6].to_owned(),
    is_locked_lbl: vec[7].to_owned(),
    is_enabled: vec[8].to_owned(),
    is_enabled_lbl: vec[9].to_owned(),
    order_by: vec[10].to_owned(),
    rem: vec[11].to_owned(),
    create_usr_id: vec[12].to_owned(),
    create_usr_id_lbl: vec[13].to_owned(),
    create_time: vec[14].to_owned(),
    create_time_lbl: vec[15].to_owned(),
    update_usr_id: vec[16].to_owned(),
    update_usr_id_lbl: vec[17].to_owned(),
    update_time: vec[18].to_owned(),
    update_time_lbl: vec[19].to_owned(),
  };
  Ok(field_comments)
}

/// 根据条件查找第一个租户
pub async fn find_one(
  search: Option<TenantSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<TenantModel>> {
  
  let table = "base_tenant";
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
  
  let model: Option<TenantModel> = res.into_iter().next();
  
  Ok(model)
}

/// 根据 id 查找租户
pub async fn find_by_id(
  id: TenantId,
  options: Option<Options>,
) -> Result<Option<TenantModel>> {
  
  let table = "base_tenant";
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
  
  let search = TenantSearch {
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

/// 根据搜索条件判断租户是否存在
pub async fn exists(
  search: Option<TenantSearch>,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = "base_tenant";
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

/// 根据 id 判断租户是否存在
pub async fn exists_by_id(
  id: TenantId,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = "base_tenant";
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
  
  let search = TenantSearch {
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
  search: TenantSearch,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<TenantModel>> {
  
  let table = "base_tenant";
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
  
  let mut models: Vec<TenantModel> = vec![];
  
  let mut models_tmp = {
    if
      search.lbl.is_none()
    {
      return Ok(vec![]);
    }
    
    let search = TenantSearch {
      lbl: search.lbl,
      ..Default::default()
    };
    
    find_all(
      search.into(),
      None,
      sort.clone(),
      options.clone(),
    ).await?
  };
  models.append(&mut models_tmp);
  
  Ok(models)
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
    input.lbl.as_ref().is_some() && input.lbl.as_ref().unwrap() == &model.lbl
  {
    return true;
  }
  false
}

/// 通过唯一约束检查数据是否已经存在
#[allow(unused_variables)]
pub async fn check_by_unique(
  input: TenantInput,
  model: TenantModel,
  options: Option<Options>,
) -> Result<Option<TenantId>> {
  
  let table = "base_tenant";
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
      "租户".to_owned(),
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
  input: TenantInput,
) -> Result<TenantInput> {
  
  #[allow(unused_mut)]
  let mut input = input;
  
  let dict_vec = get_dict(&[
    "is_locked",
    "is_enabled",
  ]).await?;
  
  // 锁定
  if input.is_locked.is_none() {
    let is_locked_dict = &dict_vec[0];
    if let Some(is_locked_lbl) = input.is_locked_lbl.clone() {
      input.is_locked = is_locked_dict
        .iter()
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
      input.is_enabled = is_enabled_dict
        .iter()
        .find(|item| {
          item.lbl == is_enabled_lbl
        })
        .map(|item| {
          item.val.parse().unwrap_or_default()
        });
    }
  }
  
  // 所属域名
  if input.domain_ids_lbl.is_some() && input.domain_ids.is_none() {
    input.domain_ids_lbl = input.domain_ids_lbl.map(|item| 
      item.into_iter()
        .map(|item| item.trim().to_owned())
        .filter(|item| !item.is_empty())
        .collect::<Vec<String>>()
    );
    input.domain_ids_lbl = input.domain_ids_lbl.map(|item| {
      let mut set = HashSet::new();
      item.into_iter()
        .filter(|item| set.insert(item.clone()))
        .collect::<Vec<String>>()
    });
    let mut models = vec![];
    for lbl in input.domain_ids_lbl.clone().unwrap_or_default() {
      let model = crate::gen::base::domain::domain_dao::find_one(
        crate::gen::base::domain::domain_model::DomainSearch {
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
    input.domain_ids = models.into_iter()
      .map(|item| item.id)
      .collect::<Vec<DomainId>>()
      .into();
  }
  
  // 菜单权限
  if input.menu_ids_lbl.is_some() && input.menu_ids.is_none() {
    input.menu_ids_lbl = input.menu_ids_lbl.map(|item| 
      item.into_iter()
        .map(|item| item.trim().to_owned())
        .filter(|item| !item.is_empty())
        .collect::<Vec<String>>()
    );
    input.menu_ids_lbl = input.menu_ids_lbl.map(|item| {
      let mut set = HashSet::new();
      item.into_iter()
        .filter(|item| set.insert(item.clone()))
        .collect::<Vec<String>>()
    });
    let mut models = vec![];
    for lbl in input.menu_ids_lbl.clone().unwrap_or_default() {
      let model = crate::gen::base::menu::menu_dao::find_one(
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
    input.menu_ids = models.into_iter()
      .map(|item| item.id)
      .collect::<Vec<MenuId>>()
      .into();
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

/// 创建租户
pub async fn create(
  #[allow(unused_mut)]
  mut input: TenantInput,
  options: Option<Options>,
) -> Result<TenantId> {
  
  let table = "base_tenant";
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
    
    let mut id: Option<TenantId> = None;
    
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
  
  let mut id: TenantId;
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
  // 系统字段
  if let Some(is_sys) = input.is_sys {
    sql_fields += ",is_sys";
    sql_values += ",?";
    args.push(is_sys.into());
  }
  
  let sql = format!(
    "insert into {} ({}) values ({})",
    table,
    sql_fields,
    sql_values,
  );
  
  let args = args.into();
  
  let options = Options::from(options);
  
  let options = options.set_del_cache_key1s(get_cache_tables());
  
  let options = options.into();
  
  del_caches(
    vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
  ).await?;
  
  execute(
    sql,
    args,
    options,
  ).await?;
  
  del_caches(
    vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
  ).await?;
  
  // 所属域名
  if let Some(domain_ids) = input.domain_ids {
    many2many_update(
      id.clone().into(),
      domain_ids
        .iter()
        .map(|item| item.clone().into())
        .collect(),
      ManyOpts {
        r#mod: "base",
        table: "tenant_domain",
        column1: "tenant_id",
        column2: "domain_id",
      },
    ).await?;
  }
  
  // 菜单权限
  if let Some(menu_ids) = input.menu_ids {
    many2many_update(
      id.clone().into(),
      menu_ids
        .iter()
        .map(|item| item.clone().into())
        .collect(),
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

/// 根据 id 修改租户
#[allow(unused_mut)]
pub async fn update_by_id(
  id: TenantId,
  mut input: TenantInput,
  options: Option<Options>,
) -> Result<TenantId> {
  
  let old_model = find_by_id(
    id.clone(),
    None,
  ).await?;
  
  if old_model.is_none() {
    let table_comment = i18n_dao::ns(
      "租户".to_owned(),
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
      .collect::<Vec<TenantModel>>();
    
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
          "租户".to_owned(),
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
  
  let table = "base_tenant";
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
  // 系统字段
  if let Some(is_sys) = input.is_sys {
    field_num += 1;
    sql_fields += ",is_sys = ?";
    args.push(is_sys.into());
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
    
    let options = options.set_del_cache_key1s(get_cache_tables());
    
    let options = options.into();
    
    del_caches(
      vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
    ).await?;
    
    execute(
      sql,
      args,
      options,
    ).await?;
    
    del_caches(
      vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
    ).await?;
    
  }
  
  // 所属域名
  if let Some(domain_ids) = input.domain_ids {
    many2many_update(
      id.clone().into(),
      domain_ids
        .iter()
        .map(|item| item.clone().into())
        .collect(),
      ManyOpts {
        r#mod: "base",
        table: "tenant_domain",
        column1: "tenant_id",
        column2: "domain_id",
      },
    ).await?;
    
    field_num += 1;
  }
  
  // 菜单权限
  if let Some(menu_ids) = input.menu_ids {
    many2many_update(
      id.clone().into(),
      menu_ids
        .iter()
        .map(|item| item.clone().into())
        .collect(),
      ManyOpts {
        r#mod: "base",
        table: "tenant_menu",
        column1: "tenant_id",
        column2: "menu_id",
      },
    ).await?;
    
    field_num += 1;
  }
  
  if field_num > 0 {
    let options = Options::from(None);
    let options = options.set_del_cache_key1s(get_cache_tables());
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

/// 获取需要清空缓存的表名
#[allow(dead_code)]
fn get_cache_tables() -> Vec<&'static str> {
  let table = "base_tenant";
  vec![
    table,
  ]
}

/// 清空缓存
#[allow(dead_code)]
pub async fn del_cache() -> Result<()> {
  let cache_key1s = get_cache_tables();
  del_caches(
    cache_key1s.as_slice(),
  ).await?;
  Ok(())
}

/// 根据 ids 删除租户
pub async fn delete_by_ids(
  ids: Vec<TenantId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_tenant";
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
  
  if ids.is_empty() {
    return Ok(0);
  }
  
  let options = Options::from(options)
    .set_is_debug(false);
  
  let mut num = 0;
  for id in ids.clone() {
    
    let old_model = find_by_id(
      id.clone(),
      None,
    ).await?;
    if old_model.is_none() {
      continue;
    }
    
    let mut args = QueryArgs::new();
    
    let sql = format!(
      "update {} set is_deleted=1,delete_time=? where id=? limit 1",
      table,
    );
    
    args.push(get_now().into());
    args.push(id.into());
    
    let args = args.into();
    
    let options = options.clone();
    
    let options = options.set_del_cache_key1s(get_cache_tables());
    
    let options = options.into();
    
    del_caches(
      vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
    ).await?;
    
    num += execute(
      sql,
      args,
      options,
    ).await?;
    
    del_caches(
      vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
    ).await?;
  }
  
  Ok(num)
}

/// 根据 id 查找租户是否已启用
/// 记录不存在则返回 false
pub async fn get_is_enabled_by_id(
  id: TenantId,
  options: Option<Options>,
) -> Result<bool> {
  
  let model = find_by_id(id, options).await?;
  
  let is_enabled = {
    if let Some(model) = model {
      model.is_enabled == 1
    } else {
      false
    }
  };
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用租户
pub async fn enable_by_ids(
  ids: Vec<TenantId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_tenant";
  let method = "enable_by_ids";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" ids: {:?}", &ids);
    msg += &format!(" is_enabled: {:?}", &is_enabled);
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
  
  let options = options.set_del_cache_key1s(get_cache_tables());
  
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
    
    del_caches(
      vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
    ).await?;
    
    num += execute(
      sql,
      args,
      options,
    ).await?;
    
    del_caches(
      vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
    ).await?;
  }
  
  Ok(num)
}

/// 根据 id 查找租户是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
pub async fn get_is_locked_by_id(
  id: TenantId,
  options: Option<Options>,
) -> Result<bool> {
  
  let model = find_by_id(id, options).await?;
  
  let is_locked = {
    if let Some(model) = model {
      model.is_locked == 1
    } else {
      false
    }
  };
  
  Ok(is_locked)
}

/// 根据 ids 锁定或者解锁租户
pub async fn lock_by_ids(
  ids: Vec<TenantId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_tenant";
  let method = "lock_by_ids";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" ids: {:?}", &ids);
    msg += &format!(" is_locked: {:?}", &is_locked);
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
  
  let options = Options::from(options);
  
  let options = options.set_del_cache_key1s(get_cache_tables());
  
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
    
    del_caches(
      vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
    ).await?;
    
    num += execute(
      sql,
      args,
      options,
    ).await?;
    
    del_caches(
      vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
    ).await?;
  }
  
  Ok(num)
}

/// 根据 ids 还原租户
pub async fn revert_by_ids(
  ids: Vec<TenantId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_tenant";
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
    
    let options = options.set_del_cache_key1s(get_cache_tables());
    
    let options = options.into();
    
    del_caches(
      vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
    ).await?;
    
    num += execute(
      sql,
      args,
      options,
    ).await?;
    
    del_caches(
      vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
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
      
      let mut input: TenantInput = old_model.into();
      input.id = None;
      
      let models = find_by_unique(
        input.into(),
        None,
        None,
      ).await?;
      
      let models: Vec<TenantModel> = models.into_iter()
        .filter(|item| 
          item.id != id
        )
        .collect();
      
      if !models.is_empty() {
        let table_comment = i18n_dao::ns(
          "租户".to_owned(),
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

/// 根据 ids 彻底删除租户
pub async fn force_delete_by_ids(
  ids: Vec<TenantId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_tenant";
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
      TenantSearch {
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
    
    let options = options.set_del_cache_key1s(get_cache_tables());
    
    let options = options.into();
    
    del_caches(
      vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
    ).await?;
    
    num += execute(
      sql,
      args,
      options,
    ).await?;
    
    del_caches(
      vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
    ).await?;
  }
  
  Ok(num)
}

/// 查找 租户 order_by 字段的最大值
pub async fn find_last_order_by(
  options: Option<Options>,
) -> Result<u32> {
  
  let table = "base_tenant";
  let method = "find_last_order_by";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let msg = format!("{table}.{method}:");
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(false);
  let options = Some(options);
  
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
  
  let model = query_one::<OrderByModel>(
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

/// 校验租户是否启用
#[function_name::named]
#[allow(dead_code)]
pub async fn validate_is_enabled(
  model: &TenantModel,
) -> Result<()> {
  if model.is_enabled == 0 {
    let table_comment = i18n_dao::ns(
      "租户".to_owned(),
      None,
    ).await?;
    let msg1 = i18n_dao::ns(
      "已禁用".to_owned(),
      None,
    ).await?;
    let err_msg = table_comment + &msg1;
    return Err(SrvErr::new(function_name!().to_owned(), err_msg).into());
  }
  Ok(())
}

/// 校验租户是否存在
#[function_name::named]
#[allow(dead_code)]
pub async fn validate_option<'a, T>(
  model: Option<T>,
) -> Result<T> {
  if model.is_none() {
    let table_comment = i18n_dao::ns(
      "租户".to_owned(),
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
