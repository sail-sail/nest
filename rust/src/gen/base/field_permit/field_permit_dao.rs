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
  OrderByModel,
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

use crate::src::base::lang::lang_dao::get_lang_id;
use crate::r#gen::base::lang::lang_model::LangId;
use crate::src::base::i18n::i18n_dao::get_server_i18n_enable;

use super::field_permit_model::*;
use crate::r#gen::base::menu::menu_model::MenuId;

#[allow(unused_variables)]
async fn get_where_query(
  args: &mut QueryArgs,
  search: Option<&FieldPermitSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let server_i18n_enable = get_server_i18n_enable();
  
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
    let ids: Option<Vec<FieldPermitId>> = match search {
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
  // 菜单
  {
    let menu_id: Option<Vec<MenuId>> = match search {
      Some(item) => item.menu_id.clone(),
      None => None,
    };
    if let Some(menu_id) = menu_id {
      let arg = {
        if menu_id.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(menu_id.len());
          for item in menu_id {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.menu_id in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let menu_id_is_null: bool = match search {
      Some(item) => item.menu_id_is_null.unwrap_or(false),
      None => false,
    };
    if menu_id_is_null {
      where_query.push_str(" and t.menu_id is null");
    }
  }
  {
    let menu_id_lbl: Option<Vec<String>> = match search {
      Some(item) => item.menu_id_lbl.clone(),
      None => None,
    };
    if let Some(menu_id_lbl) = menu_id_lbl {
      let arg = {
        if menu_id_lbl.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(menu_id_lbl.len());
          for item in menu_id_lbl {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and menu_id_lbl.lbl in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let menu_id_lbl_like = match search {
      Some(item) => item.menu_id_lbl_like.clone(),
      None => None,
    };
    if let Some(menu_id_lbl_like) = menu_id_lbl_like {
      where_query.push_str(" and menu_id_lbl.lbl like ?");
      args.push(format!("%{}%", sql_like(&menu_id_lbl_like)).into());
    }
  }
  // 编码
  {
    let code = match search {
      Some(item) => item.code.clone(),
      None => None,
    };
    if let Some(code) = code {
      where_query.push_str(" and t.code=?");
      args.push(code.into());
    }
    let code_like = match search {
      Some(item) => item.code_like.clone(),
      None => None,
    };
    if let Some(code_like) = code_like {
      where_query.push_str(" and t.code like ?");
      args.push(format!("%{}%", sql_like(&code_like)).into());
    }
  }
  // 名称
  {
    let lbl = match search {
      Some(item) => item.lbl.clone(),
      None => None,
    };
    if let Some(lbl) = lbl {
      if server_i18n_enable {
        where_query.push_str(" and (t.lbl=? or base_field_permit_lang.lbl=?)");
        args.push(lbl.as_str().into());
        args.push(lbl.as_str().into());
      } else {
        where_query.push_str(" and t.lbl=?");
        args.push(lbl.into());
      }
    }
    let lbl_like = match search {
      Some(item) => item.lbl_like.clone(),
      None => None,
    };
    if let Some(lbl_like) = lbl_like {
      if server_i18n_enable {
        where_query.push_str(" and (t.lbl like ? or base_field_permit_lang.lbl like ?)");
        let like_str = format!("%{}%", sql_like(&lbl_like));
        args.push(like_str.as_str().into());
        args.push(like_str.as_str().into());
      } else {
        where_query.push_str(" and t.lbl like ?");
        args.push(format!("%{}%", sql_like(&lbl_like)).into());
      }
    }
  }
  // 排序
  {
    let mut order_by = match search {
      Some(item) => item.order_by.unwrap_or_default(),
      None => Default::default(),
    };
    let order_by_gt = order_by[0].take();
    let order_by_lt = order_by[1].take();
    if let Some(order_by_gt) = order_by_gt {
      where_query.push_str(" and t.order_by >= ?");
      args.push(order_by_gt.into());
    }
    if let Some(order_by_lt) = order_by_lt {
      where_query.push_str(" and t.order_by <= ?");
      args.push(order_by_lt.into());
    }
  }
  // 备注
  {
    let rem = match search {
      Some(item) => item.rem.clone(),
      None => None,
    };
    if let Some(rem) = rem {
      if server_i18n_enable {
        where_query.push_str(" and (t.rem=? or base_field_permit_lang.rem=?)");
        args.push(rem.as_str().into());
        args.push(rem.as_str().into());
      } else {
        where_query.push_str(" and t.rem=?");
        args.push(rem.into());
      }
    }
    let rem_like = match search {
      Some(item) => item.rem_like.clone(),
      None => None,
    };
    if let Some(rem_like) = rem_like {
      if server_i18n_enable {
        where_query.push_str(" and (t.rem like ? or base_field_permit_lang.rem like ?)");
        let like_str = format!("%{}%", sql_like(&rem_like));
        args.push(like_str.as_str().into());
        args.push(like_str.as_str().into());
      } else {
        where_query.push_str(" and t.rem like ?");
        args.push(format!("%{}%", sql_like(&rem_like)).into());
      }
    }
  }
  Ok(where_query)
}

#[allow(unused_variables)]
async fn get_from_query(
  args: &mut QueryArgs,
  search: Option<&FieldPermitSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let server_i18n_enable = get_server_i18n_enable();
  
  let mut from_query = r#"base_field_permit t
  left join base_menu menu_id_lbl on menu_id_lbl.id=t.menu_id"#.to_owned();
  if server_i18n_enable {
    from_query += " left join base_field_permit_lang on base_field_permit_lang.field_permit_id=t.id and base_field_permit_lang.lang_id=?";
    args.push(get_lang_id().await?.unwrap_or_default().to_string().into());
  }
  Ok(from_query)
}

// MARK: find_all
/// 根据搜索条件和分页查找字段权限列表
#[allow(unused_mut)]
pub async fn find_all(
  search: Option<FieldPermitSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<FieldPermitModel>> {
  
  let table = "base_field_permit";
  let method = "find_all";
  
  let server_i18n_enable= get_server_i18n_enable();
  
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
  // 菜单
  if let Some(search) = &search {
    if search.menu_id.is_some() {
      let len = search.menu_id.as_ref().unwrap().len();
      if len == 0 {
        return Ok(vec![]);
      }
      let ids_limit = options
        .as_ref()
        .and_then(|x| x.get_ids_limit())
        .unwrap_or(FIND_ALL_IDS_LIMIT);
      if len > ids_limit {
        return Err(eyre!("search.menu_id.length > {ids_limit}"));
      }
    }
  }
  
  let lang_sql = {
    let mut lang_sql = String::new();
    if server_i18n_enable {
      lang_sql += ",max(base_field_permit_lang.lbl) lbl_lang";
      lang_sql += ",max(base_field_permit_lang.rem) rem_lang";
    }
    lang_sql
  };
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let mut args = QueryArgs::new();
  
  let from_query = get_from_query(&mut args, search.as_ref(), options.as_ref()).await?;
  let where_query = get_where_query(&mut args, search.as_ref(), options.as_ref()).await?;
  
  let mut sort = sort.unwrap_or_default();
  
  if !sort.iter().any(|item| item.prop == "order_by") {
    sort.push(SortInput {
      prop: "order_by".into(),
      order: SortOrderEnum::Asc,
    });
  }
  
  let sort = sort.into();
  
  let order_by_query = get_order_by_query(sort);
  let page_query = get_page_query(page);
  
  let sql = format!(r#"select f.* from (select t.*
  ,menu_id_lbl.lbl menu_id_lbl
  {lang_sql}
  from {from_query} where {where_query} group by t.id{order_by_query}) f {page_query}"#);
  
  let args = args.into();
  
  let options = Options::from(options);
  
  let options = options.set_cache_key(table, &sql, &args);
  
  let mut res: Vec<FieldPermitModel> = query(
    sql,
    args,
    Some(options),
  ).await?;
  
  #[allow(unused_variables)]
  for model in &mut res {
    
  }
  
  Ok(res)
}

// MARK: find_count
/// 根据条件查找字段权限总数
pub async fn find_count(
  search: Option<FieldPermitSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_field_permit";
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
  
  let options = Options::from(options);
  
  let options = options.set_cache_key(table, &sql, &args);
  
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

/// 获取当前路由的国际化
pub fn get_n_route() -> i18n_dao::NRoute {
  i18n_dao::NRoute {
    route_path: get_route_path_field_permit().into(),
  }
}

// MARK: get_field_comments
/// 获取字段权限字段注释
pub async fn get_field_comments(
  _options: Option<Options>,
) -> Result<FieldPermitFieldComment> {
  
  let n_route = get_n_route();
  
  let i18n_code_maps: Vec<i18n_dao::I18nCodeMap> = vec![
    "ID".into(),
    "菜单".into(),
    "菜单".into(),
    "编码".into(),
    "名称".into(),
    "排序".into(),
    "备注".into(),
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
  
  let field_comments = FieldPermitFieldComment {
    id: vec[0].to_owned(),
    menu_id: vec[1].to_owned(),
    menu_id_lbl: vec[2].to_owned(),
    code: vec[3].to_owned(),
    lbl: vec[4].to_owned(),
    order_by: vec[5].to_owned(),
    rem: vec[6].to_owned(),
  };
  Ok(field_comments)
}

// MARK: find_one
/// 根据条件查找第一个字段权限
pub async fn find_one(
  search: Option<FieldPermitSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<FieldPermitModel>> {
  
  let table = "base_field_permit";
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
  
  let model: Option<FieldPermitModel> = res.into_iter().next();
  
  Ok(model)
}

// MARK: find_by_id
/// 根据 id 查找字段权限
pub async fn find_by_id(
  id: FieldPermitId,
  options: Option<Options>,
) -> Result<Option<FieldPermitModel>> {
  
  let table = "base_field_permit";
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
  
  let search = FieldPermitSearch {
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
/// 根据 ids 查找字段权限
#[allow(dead_code)]
pub async fn find_by_ids(
  ids: Vec<FieldPermitId>,
  options: Option<Options>,
) -> Result<Vec<FieldPermitModel>> {
  
  let table = "base_field_permit";
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
  
  let search = FieldPermitSearch {
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
    .collect::<Result<Vec<FieldPermitModel>>>()?;
  
  Ok(models)
}

// MARK: exists
/// 根据搜索条件判断字段权限是否存在
#[allow(dead_code)]
pub async fn exists(
  search: Option<FieldPermitSearch>,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = "base_field_permit";
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
/// 根据 id 判断字段权限是否存在
#[allow(dead_code)]
pub async fn exists_by_id(
  id: FieldPermitId,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = "base_field_permit";
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
  
  let search = FieldPermitSearch {
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
  search: FieldPermitSearch,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<FieldPermitModel>> {
  
  let table = "base_field_permit";
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
  
  let mut models: Vec<FieldPermitModel> = vec![];
  
  let mut models_tmp = {
    if
      search.menu_id.is_none() ||
      search.code.is_none()
    {
      return Ok(vec![]);
    }
    
    let search = FieldPermitSearch {
      menu_id: search.menu_id.clone(),
      code: search.code.clone(),
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
pub fn equals_by_unique(
  input: &FieldPermitInput,
  model: &FieldPermitModel,
) -> bool {
  if input.id.as_ref().is_some() {
    return input.id.as_ref().unwrap() == &model.id;
  }
  
  if
    input.menu_id.as_ref().is_some() && input.menu_id.as_ref().unwrap() == &model.menu_id &&
    input.code.as_ref().is_some() && input.code.as_ref().unwrap() == &model.code
  {
    return true;
  }
  false
}

// MARK: check_by_unique
/// 通过唯一约束检查数据是否已经存在
#[allow(unused_variables)]
pub async fn check_by_unique(
  input: FieldPermitInput,
  model: FieldPermitModel,
  options: Option<Options>,
) -> Result<Option<FieldPermitId>> {
  
  let table = "base_field_permit";
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
      "字段权限".to_owned(),
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
  input: FieldPermitInput,
) -> Result<FieldPermitInput> {
  
  #[allow(unused_mut)]
  let mut input = input;
  
  // 菜单
  if input.menu_id_lbl.is_some()
    && !input.menu_id_lbl.as_ref().unwrap().is_empty()
    && input.menu_id.is_none()
  {
    input.menu_id_lbl = input.menu_id_lbl.map(|item| 
      item.trim().to_owned()
    );
    let model = crate::r#gen::base::menu::menu_dao::find_one(
      crate::r#gen::base::menu::menu_model::MenuSearch {
        lbl: input.menu_id_lbl.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(model) = model {
      input.menu_id = model.id.into();
    }
  } else if
    (input.menu_id_lbl.is_none() || input.menu_id_lbl.as_ref().unwrap().is_empty())
    && input.menu_id.is_some()
  {
    let menu_model = crate::r#gen::base::menu::menu_dao::find_one(
      crate::r#gen::base::menu::menu_model::MenuSearch {
        id: input.menu_id.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(menu_model) = menu_model {
      input.menu_id_lbl = menu_model.lbl.into();
    }
  }
  
  Ok(input)
}

// MARK: creates_return
/// 批量创建字段权限并返回
#[allow(dead_code)]
pub async fn creates_return(
  inputs: Vec<FieldPermitInput>,
  options: Option<Options>,
) -> Result<Vec<FieldPermitModel>> {
  
  let table = "base_field_permit";
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
/// 批量创建字段权限
pub async fn creates(
  inputs: Vec<FieldPermitInput>,
  options: Option<Options>,
) -> Result<Vec<FieldPermitId>> {
  
  let table = "base_field_permit";
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

/// 批量创建字段权限
#[allow(unused_variables)]
async fn _creates(
  inputs: Vec<FieldPermitInput>,
  options: Option<Options>,
) -> Result<Vec<FieldPermitId>> {
  
  let table = "base_field_permit";
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  
  let unique_type = options.as_ref()
    .and_then(|item|
      item.get_unique_type()
    )
    .unwrap_or_default();
  
  let mut ids2: Vec<FieldPermitId> = vec![];
  let mut inputs2: Vec<FieldPermitInput> = vec![];
  
  for input in inputs.clone() {
  
    if input.id.is_some() {
      return Err(eyre!("Can not set id when create in dao: {table}"));
    }
    
    let old_models = find_by_unique(
      input.clone().into(),
      None,
      options.clone(),
    ).await?;
    
    if !old_models.is_empty() {
      let mut id: Option<FieldPermitId> = None;
      
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
  let mut sql_fields = String::with_capacity(80 * 7 + 20);
  
  sql_fields += "id";
  // 菜单
  sql_fields += ",menu_id";
  // 编码
  sql_fields += ",code";
  // 名称
  sql_fields += ",lbl";
  // 排序
  sql_fields += ",order_by";
  // 备注
  sql_fields += ",rem";
  // 系统字段
  sql_fields += ",is_sys";
  
  let inputs2_len = inputs2.len();
  let mut sql_values = String::with_capacity((2 * 7 + 3) * inputs2_len);
  let mut inputs2_ids = vec![];
  
  for (i, input) in inputs2
    .clone()
    .into_iter()
    .enumerate()
  {
    
    let id: FieldPermitId = get_short_uuid().into();
    ids2.push(id.clone());
    
    inputs2_ids.push(id.clone());
    
    sql_values += "(?";
    args.push(id.into());
    // 菜单
    if let Some(menu_id) = input.menu_id {
      sql_values += ",?";
      args.push(menu_id.into());
    } else {
      sql_values += ",default";
    }
    // 编码
    if let Some(code) = input.code {
      sql_values += ",?";
      args.push(code.into());
    } else {
      sql_values += ",default";
    }
    // 名称
    if let Some(lbl) = input.lbl {
      sql_values += ",?";
      args.push(lbl.into());
    } else {
      sql_values += ",default";
    }
    // 排序
    if let Some(order_by) = input.order_by {
      sql_values += ",?";
      args.push(order_by.into());
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
    // 系统字段
    if let Some(is_sys) = input.is_sys {
      sql_values += ",?";
      args.push(is_sys.into());
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
  
  let options = options.set_del_cache_key1s(get_cache_tables());
  
  let options = Some(options);
  
  let affected_rows = execute(
    sql,
    args,
    options.clone(),
  ).await?;
  
  if affected_rows != inputs2_len as u64 {
    return Err(eyre!("affectedRows: {affected_rows} != {inputs2_len}"));
  }
  for input in inputs.iter() {
    refresh_lang_by_input(input, options.clone()).await?;
  }
  
  Ok(ids2)
}

// MARK: create_return
/// 创建字段权限并返回
#[allow(dead_code)]
pub async fn create_return(
  #[allow(unused_mut)]
  mut input: FieldPermitInput,
  options: Option<Options>,
) -> Result<FieldPermitModel> {
  
  let table = "base_field_permit";
  
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
/// 创建字段权限
#[allow(dead_code)]
pub async fn create(
  #[allow(unused_mut)]
  mut input: FieldPermitInput,
  options: Option<Options>,
) -> Result<FieldPermitId> {
  
  let table = "base_field_permit";
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

#[allow(unused_variables)]
async fn refresh_lang_by_input(
  input: &FieldPermitInput,
  options: Option<Options>,
) -> Result<()> {
  
  if input.id.is_none() || input.id.as_ref().unwrap().is_empty() {
    return Err(eyre!("refresh_lang_by_input: input.id is empty"));
  }
  
  let server_i18n_enable = get_server_i18n_enable();
  
  if !server_i18n_enable {
    return Ok(());
  }
  #[derive(Serialize, Deserialize, sqlx::FromRow)]
  struct ResultTmp {
    id: String,
  }
  let lang_sql = "select id from base_field_permit_lang where lang_id=? and field_permit_id=?".to_owned();
  let mut lang_args = QueryArgs::new();
  lang_args.push(get_lang_id().await?.unwrap_or_default().to_string().into());
  lang_args.push(input.id.clone().unwrap_or_default().clone().into());
  let model = query_one::<ResultTmp>(
    lang_sql,
    lang_args.into(),
    options.clone(),
  ).await?;
  let lang_id: Option<LangId> = model.map(|item| item.id).map(|item| item.into());
  if let Some(lang_id) = lang_id {
    let mut lang_sql = "update base_field_permit_lang set ".to_owned();
    let mut lang_args = QueryArgs::new();
    // 名称
    if input.lbl.is_some() {
      lang_sql += "lbl=?,";
      lang_args.push(input.lbl.clone().unwrap_or_default().into());
    }
    // 备注
    if input.rem.is_some() {
      lang_sql += "rem=?,";
      lang_args.push(input.rem.clone().unwrap_or_default().into());
    }
    lang_sql.pop();
    lang_sql += " where id=?";
    lang_args.push(lang_id.into());
    execute(
      lang_sql,
      lang_args.into(),
      options.clone(),
    ).await?;
  } else {
    let mut sql_fields: Vec<&'static str> = vec![];
    let mut lang_args = QueryArgs::new();
    let id: LangId = get_short_uuid().into();
    lang_args.push(id.into());
    lang_args.push(get_lang_id().await?.unwrap_or_default().to_string().into());
    lang_args.push(input.id.clone().unwrap_or_default().clone().into());
    // 名称
    if input.lbl.is_some() {
      sql_fields.push("lbl");
      lang_args.push(input.lbl.clone().unwrap_or_default().into());
    }
    // 备注
    if input.rem.is_some() {
      sql_fields.push("rem");
      lang_args.push(input.rem.clone().unwrap_or_default().into());
    }
    let mut lang_sql = "insert into base_field_permit_lang(id,lang_id,field_permit_id".to_owned();
    let sql_fields_len = sql_fields.len();
    for sql_field in sql_fields {
      lang_sql += ",";
      lang_sql += sql_field;
    }
    lang_sql += ")values(?,?,?";
    for _ in 0..sql_fields_len {
      lang_sql += ",?";
    }
    lang_sql += ")";
    execute(
      lang_sql,
      lang_args.into(),
      options.clone(),
    ).await?;
  }
  
  Ok(())
}

// MARK: update_by_id
/// 根据 id 修改字段权限
#[allow(unused_mut)]
#[allow(unused_variables)]
pub async fn update_by_id(
  id: FieldPermitId,
  mut input: FieldPermitInput,
  options: Option<Options>,
) -> Result<FieldPermitId> {
  
  let table = "base_field_permit";
  let method = "update_by_id";
  
  let is_debug = get_is_debug(options.as_ref());
  let is_creating = get_is_creating(options.as_ref());
  
  let server_i18n_enable = get_server_i18n_enable();
  
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
      "字段权限".to_owned(),
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
  
  if server_i18n_enable {
    let mut input = input.clone();
    input.id = Some(id.clone());
    refresh_lang_by_input(
      &input,
      options.clone(),
    ).await?;
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
      .collect::<Vec<FieldPermitModel>>();
    
    if !models.is_empty() {
      let unique_type = options
        .as_ref()
        .and_then(|item| item.get_unique_type())
        .unwrap_or(UniqueType::Throw);
      if unique_type == UniqueType::Throw {
        let table_comment = i18n_dao::ns(
          "字段权限".to_owned(),
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
  
  let mut sql_fields = String::with_capacity(80 * 7 + 20);
  
  let mut field_num: usize = 0;
  // 菜单
  if let Some(menu_id) = input.menu_id {
    field_num += 1;
    sql_fields += "menu_id=?,";
    args.push(menu_id.into());
  }
  // 编码
  if let Some(code) = input.code {
    field_num += 1;
    sql_fields += "code=?,";
    args.push(code.into());
  }
  // 名称
  if let Some(lbl) = input.lbl {
    field_num += 1;
    if !server_i18n_enable {
      sql_fields += "lbl=?,";
      args.push(lbl.into());
    }
  }
  // 排序
  if let Some(order_by) = input.order_by {
    field_num += 1;
    sql_fields += "order_by=?,";
    args.push(order_by.into());
  }
  // 备注
  if let Some(rem) = input.rem {
    field_num += 1;
    if !server_i18n_enable {
      sql_fields += "rem=?,";
      args.push(rem.into());
    }
  }
  // 系统字段
  if let Some(is_sys) = input.is_sys {
    field_num += 1;
    sql_fields += "is_sys=?,";
    args.push(is_sys.into());
  }
  
  if field_num > 0 {
    
    if sql_fields.ends_with(',') {
      sql_fields.pop();
    }
    
    let sql_where = "id=?";
    args.push(id.clone().into());
    
    let sql = format!("update {table} set {sql_fields} where {sql_where} limit 1");
    
    let args: Vec<_> = args.into();
    
    let options = Options::from(options.clone());
    
    let options = options.set_del_cache_key1s(get_cache_tables());
    
    let options = Some(options);
    
    execute(
      sql,
      args,
      options.clone(),
    ).await?;
    
  }
  
  if field_num > 0 {
    let options = Options::from(options);
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
  let table = "base_field_permit";
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
/// 根据 ids 删除字段权限
#[allow(unused_variables)]
pub async fn delete_by_ids(
  ids: Vec<FieldPermitId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_field_permit";
  let method = "delete_by_ids";
  
  let is_debug = get_is_debug(options.as_ref());
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  let is_creating = get_is_creating(options.as_ref());
  let server_i18n_enable = get_server_i18n_enable();
  
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
    
    let sql = format!("delete from {table} where id=? limit 1");
    
    args.push(id.clone().into());
    
    let args: Vec<_> = args.into();
    
    let options = Options::from(options.clone());
    
    let options = options.set_del_cache_key1s(get_cache_tables());
    
    let options = Some(options);
    
    num += execute(
      sql,
      args,
      options.clone(),
    ).await?;
    
    if server_i18n_enable {
      let sql = "delete from base_field_permit_lang where field_permit_id=?".to_owned();
      let mut args = QueryArgs::new();
      args.push(id.clone().into());
      execute(
        sql,
        args.into(),
        options.clone(),
      ).await?;
    }
    {
      let mut args = QueryArgs::new();
      let sql = "update base_role_field_permit set is_deleted=1 where field_permit_id=? and is_deleted=0".to_owned();
      args.push(id.clone().into());
      let args: Vec<_> = args.into();
      execute(
        sql,
        args,
        options.clone(),
      ).await?;
    }
  }
  
  if num > MAX_SAFE_INTEGER {
    return Err(eyre!("num: {} > MAX_SAFE_INTEGER", num));
  }
  
  Ok(num)
}

// MARK: find_last_order_by
/// 查找 字段权限 order_by 字段的最大值
pub async fn find_last_order_by(
  options: Option<Options>,
) -> Result<u32> {
  
  let table = "base_field_permit";
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
    .set_is_debug(Some(false));
  let options = Some(options);
  
  #[allow(unused_mut)]
  let mut args = QueryArgs::new();
  #[allow(unused_mut)]
  let mut sql_wheres: Vec<&'static str> = Vec::with_capacity(3);
  
  let sql_where = sql_wheres.join(" and ");
  let sql = format!("select t.order_by order_by from {table} t where {sql_where} order by t.order_by desc limit 1");
  
  let args: Vec<_> = args.into();
  
  let options = Options::from(options);
  
  let options = options.set_cache_key(table, &sql, &args);
  
  let options = Some(options);
  
  let model = query_one::<OrderByModel>(
    sql,
    args,
    options.clone(),
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

// MARK: validate_option
/// 校验字段权限是否存在
#[allow(dead_code)]
pub async fn validate_option<T>(
  model: Option<T>,
) -> Result<T> {
  if model.is_none() {
    let table_comment = i18n_dao::ns(
      "字段权限".to_owned(),
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
