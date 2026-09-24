
#![allow(clippy::clone_on_copy)]
#![allow(clippy::redundant_clone)]
#![allow(clippy::collapsible_if)]

#[allow(unused_imports)]
use serde::{Serialize, Deserialize};
#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use std::collections::HashSet;

use color_eyre::eyre::{Result, eyre};
#[allow(unused_imports)]
use tracing::{info, error};

use crate::common::cache::cache_dao;
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
  get_find_all_result_limit,
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
use crate::common::exceptions::service_exception::ServiceException;

use crate::common::gql::model::{
  PageInput,
  SortInput,
};

use crate::common::dict_detail::dict_detail_dao::get_dict;

use super::comp_cnf_model::*;

use crate::base::tenant::tenant_model::TenantId;
#[allow(unused_imports)]
use crate::base::usr::usr_model::UsrId;

use crate::base::usr::usr_dao::find_by_id_usr;

#[allow(unused_variables)]
async fn get_where_query(
  args: &mut QueryArgs,
  search: Option<&CompCnfSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let is_deleted = search
    .and_then(|item| item.is_deleted)
    .unwrap_or(0);
  
  let mut where_query = String::with_capacity(80 * 13 * 6);
  
  where_query.push_str(" t.is_deleted=?");
  args.push(is_deleted.into());
  {
    if let Some(id) = search.and_then(|item| item.id) {
      where_query.push_str(" and t.id=?");
      args.push(id.into());
    }
  }
  {
    if let Some(ids) = search.and_then(|item| item.ids.as_deref()) {
      let arg = {
        if ids.is_empty() {
          String::from("null")
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
        Some(item) => item.tenant_id,
        None => None,
      };
      match tenant_id {
        None => get_auth_tenant_id(),
        Some(item) => match item.as_str() {
          "" => None,
          _ => item.into(),
        },
      }
    };
    if let Some(tenant_id) = tenant_id {
      where_query.push_str(" and t.tenant_id=?");
      args.push(tenant_id.into());
    }
  }
  // 分组
  {
    let group = match search {
      Some(item) => item.group.clone(),
      None => None,
    };
    if let Some(group) = group {
      where_query.push_str(" and t.group=?");
      args.push(group.into());
    }
    let group_like = match search {
      Some(item) => item.group_like.clone(),
      None => None,
    };
    if let Some(group_like) = group_like && !group_like.is_empty() {
      where_query.push_str(" and t.group like ?");
      args.push(format!("%{}%", sql_like(&group_like)).into());
    }
  }
  // 名称
  {
    let lbl = match search {
      Some(item) => item.lbl.clone(),
      None => None,
    };
    if let Some(lbl) = lbl {
      where_query.push_str(" and t.lbl=?");
      args.push(lbl.into());
    }
    let lbl_like = match search {
      Some(item) => item.lbl_like.clone(),
      None => None,
    };
    if let Some(lbl_like) = lbl_like && !lbl_like.is_empty() {
      where_query.push_str(" and t.lbl like ?");
      args.push(format!("%{}%", sql_like(&lbl_like)).into());
    }
  }
  // 类型
  {
    let r#type: Option<Vec<String>> = match search {
      Some(item) => item.r#type.clone(),
      None => None,
    };
    if let Some(r#type) = r#type {
      let arg = {
        if r#type.is_empty() {
          String::from("null")
        } else {
          let mut items = Vec::with_capacity(r#type.len());
          for item in r#type {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.type in (");
      where_query.push_str(&arg);
      where_query.push(')');
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
      where_query.push_str(" and t.rem=?");
      args.push(rem.into());
    }
    let rem_like = match search {
      Some(item) => item.rem_like.clone(),
      None => None,
    };
    if let Some(rem_like) = rem_like && !rem_like.is_empty() {
      where_query.push_str(" and t.rem like ?");
      args.push(format!("%{}%", sql_like(&rem_like)).into());
    }
  }
  // 值
  {
    let val = match search {
      Some(item) => item.val.clone(),
      None => None,
    };
    if let Some(val) = val {
      where_query.push_str(" and t.val=?");
      args.push(val.into());
    }
  }
  // 创建人
  {
    if let Some(create_usr_id) = search.and_then(|item| item.create_usr_id.as_deref()) {
      let arg = {
        if create_usr_id.is_empty() {
          String::from("''")
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
          String::from("''")
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
        if !create_usr_id_lbl_like.is_empty() {
          where_query.push_str(" and create_usr_id_lbl like ?");
          args.push(format!("%{}%", sql_like(&create_usr_id_lbl_like)).into());
        }
      }
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
  // 更新人
  {
    if let Some(update_usr_id) = search.and_then(|item| item.update_usr_id.as_deref()) {
      let arg = {
        if update_usr_id.is_empty() {
          String::from("''")
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
          String::from("''")
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
        if !update_usr_id_lbl_like.is_empty() {
          where_query.push_str(" and update_usr_id_lbl like ?");
          args.push(format!("%{}%", sql_like(&update_usr_id_lbl_like)).into());
        }
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
  search: Option<&CompCnfSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let from_query = r#"nuxt_comp_cnf t"#.to_owned();
  Ok(from_query)
}

// MARK: find_all_comp_cnf
/// 根据搜索条件和分页查找组件配置列表
#[allow(unused_mut, unused_variables)]
pub async fn find_all_comp_cnf(
  search: Option<CompCnfSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<CompCnfModel>> {
  
  let table = get_table_name_comp_cnf();
  let method = "find_all_comp_cnf";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    if let Some(search) = &search {
      msg += &format!(" search: {search:?}");
    }
    if let Some(page) = &page {
      msg += &format!(" page: {page:?}");
    }
    if let Some(sort) = &sort {
      msg += &format!(" sort: {sort:?}");
    }
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let ids_limit = options
    .as_ref()
    .and_then(|x| x.get_ids_limit())
    .unwrap_or(FIND_ALL_IDS_LIMIT);
  
  if let Some(search) = &search {
    if let Some(id) = &search.id && id.is_empty() {
      return Ok(vec![]);
    }
    if let Some(ids) = &search.ids && ids.is_empty() {
      return Ok(vec![]);
    }
  }
  // 类型
  if let Some(search) = &search && let Some(r#type) = &search.r#type {
    let len = r#type.len();
    if len == 0 {
      return Ok(vec![]);
    }
    if len > ids_limit {
      return Err(eyre!("search.type.length > {ids_limit}"));
    }
  }
  // 创建人
  if let Some(search) = &search && let Some(create_usr_id) = &search.create_usr_id {
    let len = create_usr_id.len();
    if len == 0 {
      return Ok(vec![]);
    }
    if len > ids_limit {
      return Err(eyre!("search.create_usr_id.length > {ids_limit}"));
    }
  }
  // 更新人
  if let Some(search) = &search && let Some(update_usr_id) = &search.update_usr_id {
    let len = update_usr_id.len();
    if len == 0 {
      return Ok(vec![]);
    }
    if len > ids_limit {
      return Err(eyre!("search.update_usr_id.length > {ids_limit}"));
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
  
  if !sort.iter().any(|item| item.prop == "order_by") {
    sort.push(SortInput {
      prop: "order_by".into(),
      order: SortOrderEnum::Asc,
    });
  }
  
  if !sort.iter().any(|item| item.prop == "create_time") {
    sort.push(SortInput {
      prop: "create_time".into(),
      order: SortOrderEnum::Asc,
    });
  }
  
  let order_by_query = get_order_by_query(Some(sort));
  let is_result_limit = page.as_ref()
    .and_then(|item| item.is_result_limit)
    .unwrap_or(true);
  let page_query = get_page_query(page);
  
  let sql = format!(r#"select f.* from (select t.*
  from {from_query} where {where_query} group by t.id{order_by_query}) f {page_query}"#);
  
  let args = args.into();
  
  let cache_enabled = cache_dao::get_cache_enabled();
  
  let (
    cache_key1,
    cache_key2,
  ) = if cache_enabled {
    (
      format!("dao.sql.{table}"),
      crate::common::util::string::hash(serde_json::json!([ &sql, args ]).to_string().as_bytes()),
    )
  } else {
    (
      String::new(),
      String::new(),
    )
  };
  
  let res = if cache_enabled {
    let str = cache_dao::get_cache(&cache_key1, &cache_key2).await?;
    if let Some(str) = str {
      let res2: Vec<CompCnfModel>;
      let res = serde_json::from_str::<Vec<CompCnfModel>>(&str);
      if let Ok(res) = res {
        res2 = res;
      } else {
        res2 = vec![];
        cache_dao::del_cache(&cache_key1).await?;
      }
      Some(res2)
    } else {
      None
    }
  } else {
    None
  };
  
  let mut res: Vec<CompCnfModel> = if let Some(res) = res {
    res
  } else {
    let res = query(
      sql,
      args,
      options,
    ).await?;
    if cache_enabled {
      let str = serde_json::to_string(&res)?;
      cache_dao::set_cache(&cache_key1, &cache_key2, &str).await?;
    }
    res
  };
  
  let len = res.len();
  let result_limit_num = get_find_all_result_limit();
  
  if is_result_limit && len > result_limit_num {
    return Err(eyre!(
      ServiceException {
        message: format!("{table}.{method}: result length {len} > {result_limit_num}"),
        trace: true,
        ..Default::default()
      },
    ));
  }
  
  let dict_vec = get_dict(&[
    "nuxt_comp_cnf_type",
  ]).await?;
  let [
    type_dict,
  ]: [Vec<_>; 1] = dict_vec
    .try_into()
    .map_err(|err| eyre!("{:#?}", err))?;
  
  #[allow(unused_variables)]
  for model in &mut res {
    
    // 类型
    model.r#type_lbl = {
      r#type_dict
        .iter()
        .find(|item| item.val == model.r#type.as_str())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.r#type.clone())
    };
    
  }
  
  Ok(res)
}

// MARK: find_count_comp_cnf
/// 根据条件查找组件配置总数
pub async fn find_count_comp_cnf(
  search: Option<CompCnfSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_comp_cnf();
  let method = "find_count_comp_cnf";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    if let Some(search) = &search {
      msg += &format!(" search: {search:?}");
    }
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
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
  // 类型
  if let Some(search) = &search && search.r#type.is_some() {
    let len = search.r#type.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.type.length > {ids_limit}"));
    }
  }
  // 创建人
  if let Some(search) = &search && search.create_usr_id.is_some() {
    let len = search.create_usr_id.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.create_usr_id.length > {ids_limit}"));
    }
  }
  // 更新人
  if let Some(search) = &search && search.update_usr_id.is_some() {
    let len = search.update_usr_id.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.update_usr_id.length > {ids_limit}"));
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
  
  let cache_enabled = cache_dao::get_cache_enabled();
  
  let (
    cache_key1,
    cache_key2,
  ) = if cache_enabled {
    (
      format!("dao.sql.{table}"),
      crate::common::util::string::hash(serde_json::json!([ &sql, args ]).to_string().as_bytes()),
    )
  } else {
    (
      String::new(),
      String::new(),
    )
  };
  
  let total = if cache_enabled {
    let str = cache_dao::get_cache(&cache_key1, &cache_key2).await?;
    if let Some(str) = str {
      let res2: u64;
      let res = serde_json::from_str::<u64>(&str);
      if let Ok(res) = res {
        res2 = res;
      } else {
        res2 = 0;
        cache_dao::del_cache(&cache_key1).await?;
      }
      Some(res2)
    } else {
      None
    }
  } else {
    None
  };
  
  let total: u64 = if let Some(total) = total {
    total
  } else {
    let options = Options::from(options)
      .set_is_debug(Some(false));
    let options = Some(options);
    
    let res: Option<CountModel> = query_one(
      sql,
      args,
      options,
    ).await?;
    let total = res
      .map(|item| item.total)
      .unwrap_or_default();
    if cache_enabled {
      let str = serde_json::to_string(&total)?;
      cache_dao::set_cache(&cache_key1, &cache_key2, &str).await?;
    }
    total
  };
  
  if total > MAX_SAFE_INTEGER {
    return Err(eyre!("total > MAX_SAFE_INTEGER"));
  }
  
  Ok(total)
}

// MARK: get_field_comments_comp_cnf
/// 获取组件配置字段注释
#[allow(unused_mut)]
pub async fn get_field_comments_comp_cnf(
  _options: Option<Options>,
) -> Result<CompCnfFieldComment> {
  
  let mut field_comments = CompCnfFieldComment {
    id: "ID".into(),
    group: "分组".into(),
    lbl: "名称".into(),
    r#type: "类型".into(),
    type_lbl: "类型".into(),
    order_by: "排序".into(),
    rem: "备注".into(),
    val: "值".into(),
    create_usr_id: "创建人".into(),
    create_usr_id_lbl: "创建人".into(),
    create_time: "创建时间".into(),
    create_time_lbl: "创建时间".into(),
    update_usr_id: "更新人".into(),
    update_usr_id_lbl: "更新人".into(),
    update_time: "更新时间".into(),
    update_time_lbl: "更新时间".into(),
  };
  Ok(field_comments)
}

// MARK: find_one_ok_comp_cnf
/// 根据条件查找第一个组件配置, 如果不存在则抛错
#[allow(dead_code)]
pub async fn find_one_ok_comp_cnf(
  search: Option<CompCnfSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<CompCnfModel> {
  
  let table = get_table_name_comp_cnf();
  let method = "find_one_ok_comp_cnf";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    if let Some(search) = &search {
      msg += &format!(" search: {search:?}");
    }
    if let Some(sort) = &sort {
      msg += &format!(" sort: {sort:?}");
    }
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let comp_cnf_model = find_one_comp_cnf(
    search,
    sort,
    options,
  ).await?;
  
  let Some(comp_cnf_model) = comp_cnf_model else {
    let err_msg = "此 组件配置 已被删除";
    return Err(eyre!(err_msg));
  };
  
  Ok(comp_cnf_model)
}

// MARK: find_one_comp_cnf
/// 根据条件查找第一个组件配置
#[allow(dead_code)]
pub async fn find_one_comp_cnf(
  search: Option<CompCnfSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<CompCnfModel>> {
  
  let table = get_table_name_comp_cnf();
  let method = "find_one_comp_cnf";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    if let Some(search) = &search {
      msg += &format!(" search: {search:?}");
    }
    if let Some(sort) = &sort {
      msg += &format!(" sort: {sort:?}");
    }
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  if let Some(search) = &search && search.id.is_some() && search.id.as_ref().unwrap().is_empty() {
    return Ok(None);
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let page = Some(PageInput {
    pg_offset: Some(0),
    pg_size: Some(1),
    is_result_limit: Some(true),
  });
  
  let res = find_all_comp_cnf(
    search,
    page,
    sort,
    options,
  ).await?;
  
  let model: Option<CompCnfModel> = res.into_iter().next();
  
  Ok(model)
}

// MARK: find_by_id_ok_comp_cnf
/// 根据 id 查找组件配置, 如果不存在则抛错
#[allow(dead_code)]
pub async fn find_by_id_ok_comp_cnf(
  id: CompCnfId,
  options: Option<Options>,
) -> Result<CompCnfModel> {
  
  let table = get_table_name_comp_cnf();
  let method = "find_by_id_ok_comp_cnf";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" id: {id:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let comp_cnf_model = find_by_id_comp_cnf(
    id,
    options,
  ).await?;
  
  let Some(comp_cnf_model) = comp_cnf_model else {
    let err_msg = String::from("此 组件配置 已被删除");
    error!(
      "{req_id} {err_msg} id: {id:?}",
      req_id = get_req_id(),
    );
    return Err(eyre!(ServiceException {
      message: err_msg,
      trace: true,
      ..Default::default()
    }));
  };
  
  Ok(comp_cnf_model)
}

// MARK: find_by_id_comp_cnf
/// 根据 id 查找组件配置
pub async fn find_by_id_comp_cnf(
  id: CompCnfId,
  options: Option<Options>,
) -> Result<Option<CompCnfModel>> {
  
  let table = get_table_name_comp_cnf();
  let method = "find_by_id_comp_cnf";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" id: {id:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
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
  
  let search = CompCnfSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let comp_cnf_model = find_one_comp_cnf(
    search,
    None,
    options,
  ).await?;
  
  Ok(comp_cnf_model)
}

// MARK: find_by_ids_ok_comp_cnf
/// 根据 ids 查找组件配置, 出现查询不到的 id 则报错
#[allow(dead_code)]
pub async fn find_by_ids_ok_comp_cnf(
  ids: Vec<CompCnfId>,
  options: Option<Options>,
) -> Result<Vec<CompCnfModel>> {
  
  let table = get_table_name_comp_cnf();
  let method = "find_by_ids_ok_comp_cnf";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" ids: {ids:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
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
    return Err(eyre!(
      ServiceException {
        message: "ids.length > FIND_ALL_IDS_LIMIT".into(),
        trace: true,
        ..Default::default()
      },
    ));
  }
  
  let comp_cnf_models = find_by_ids_comp_cnf(
    ids.clone(),
    options,
  ).await?;
  
  if comp_cnf_models.len() != len {
    let err_msg = String::from("此 组件配置 已被删除");
    return Err(eyre!(err_msg));
  }
  
  let comp_cnf_models = ids
    .into_iter()
    .map(|id| {
      let model = comp_cnf_models
        .iter()
        .find(|item| item.id == id);
      if let Some(model) = model {
        return Ok(model.clone());
      }
      let err_msg = String::from("此 组件配置 已经被删除");
      Err(eyre!(err_msg))
    })
    .collect::<Result<Vec<CompCnfModel>>>()?;
  
  Ok(comp_cnf_models)
}

// MARK: find_by_ids_comp_cnf
/// 根据 ids 查找组件配置
#[allow(dead_code)]
pub async fn find_by_ids_comp_cnf(
  ids: Vec<CompCnfId>,
  options: Option<Options>,
) -> Result<Vec<CompCnfModel>> {
  
  let table = get_table_name_comp_cnf();
  let method = "find_by_ids_comp_cnf";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" ids: {ids:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
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
    return Err(eyre!(
      ServiceException {
        message: "ids.length > FIND_ALL_IDS_LIMIT".into(),
        trace: true,
        ..Default::default()
      },
    ));
  }
  
  let search = CompCnfSearch {
    ids: Some(ids.clone()),
    ..Default::default()
  }.into();
  
  let comp_cnf_models = find_all_comp_cnf(
    search,
    None,
    None,
    options,
  ).await?;
  
  let comp_cnf_models = ids
    .into_iter()
    .filter_map(|id| {
      comp_cnf_models
        .iter()
        .find(|item| item.id == id)
        .cloned()
    })
    .collect::<Vec<CompCnfModel>>();
  
  Ok(comp_cnf_models)
}

// MARK: exists_comp_cnf
/// 根据搜索条件判断组件配置是否存在
#[allow(dead_code)]
pub async fn exists_comp_cnf(
  search: Option<CompCnfSearch>,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = get_table_name_comp_cnf();
  let method = "exists_comp_cnf";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    if let Some(search) = &search {
      msg += &format!(" search: {search:?}");
    }
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let ids_limit = options
    .as_ref()
    .and_then(|x| x.get_ids_limit())
    .unwrap_or(FIND_ALL_IDS_LIMIT);
  
  if let Some(search) = &search {
    if let Some(id) = &search.id && id.is_empty() {
      return Ok(false);
    }
    if let Some(ids) = &search.ids && ids.is_empty() {
      return Ok(false);
    }
  }
  // 类型
  if let Some(search) = &search && let Some(r#type) = &search.r#type {
    let len = r#type.len();
    if len == 0 {
      return Ok(false);
    }
    if len > ids_limit {
      return Err(eyre!("search.type.length > {ids_limit}"));
    }
  }
  // 创建人
  if let Some(search) = &search && let Some(create_usr_id) = &search.create_usr_id {
    let len = create_usr_id.len();
    if len == 0 {
      return Ok(false);
    }
    if len > ids_limit {
      return Err(eyre!("search.create_usr_id.length > {ids_limit}"));
    }
  }
  // 更新人
  if let Some(search) = &search && let Some(update_usr_id) = &search.update_usr_id {
    let len = update_usr_id.len();
    if len == 0 {
      return Ok(false);
    }
    if len > ids_limit {
      return Err(eyre!("search.update_usr_id.length > {ids_limit}"));
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
  
  let sql = format!(r#"select exists(select 1 from {from_query} where {where_query} group by t.id)"#);
  
  let args = args.into();
  
  let cache_enabled = cache_dao::get_cache_enabled();
  
  let (
    cache_key1,
    cache_key2,
  ) = if cache_enabled {
    (
      format!("dao.sql.{table}"),
      crate::common::util::string::hash(serde_json::json!([ &sql, args ]).to_string().as_bytes()),
    )
  } else {
    (
      String::new(),
      String::new(),
    )
  };
  
  let exists_res = if cache_enabled {
    let str = cache_dao::get_cache(&cache_key1, &cache_key2).await?;
    if let Some(str) = str {
      let res2: bool;
      let res = serde_json::from_str::<bool>(&str);
      if let Ok(res) = res {
        res2 = res;
      } else {
        res2 = false;
        cache_dao::del_cache(&cache_key1).await?;
      }
      Some(res2)
    } else {
      None
    }
  } else {
    None
  };
  
  let exists_res: bool = if let Some(exists_res) = exists_res {
    exists_res
  } else {
    let res: Option<(bool,)> = query_one(
      sql,
      args,
      options,
    ).await?;
    let exists_res = res
      .map(|item| item.0)
      .unwrap_or_default();
    if cache_enabled {
      let str = serde_json::to_string(&exists_res)?;
      cache_dao::set_cache(&cache_key1, &cache_key2, &str).await?;
    }
    exists_res
  };
  
  Ok(exists_res)
}

// MARK: exists_by_id_comp_cnf
/// 根据 id 判断组件配置是否存在
#[allow(dead_code)]
pub async fn exists_by_id_comp_cnf(
  id: CompCnfId,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = get_table_name_comp_cnf();
  let method = "exists_by_id_comp_cnf";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" id: {id:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let search = CompCnfSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let exists = exists_comp_cnf(
    search,
    options,
  ).await?;
  
  Ok(exists)
}

// MARK: find_by_unique_comp_cnf
/// 通过唯一约束获得数据列表
#[allow(unused_variables)]
pub async fn find_by_unique_comp_cnf(
  search: CompCnfSearch,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<CompCnfModel>> {
  
  let table = get_table_name_comp_cnf();
  let method = "find_by_unique_comp_cnf";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" search: {search:?}");
    if let Some(sort) = &sort {
      msg += &format!(" sort: {sort:?}");
    }
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  
  if let Some(id) = search.id {
    let model = find_by_id_comp_cnf(
      id,
      options,
    ).await?;
    return Ok(model.map_or_else(Vec::new, |m| vec![m]));
  }
  
  let mut models: Vec<CompCnfModel> = vec![];
  
  let mut models_tmp = if
    search.group.is_none() ||
    search.lbl.is_none()
  {
    vec![]
  } else {
    let search = CompCnfSearch {
      tenant_id: search.tenant_id,
      group: search.group.clone(),
      lbl: search.lbl.clone(),
      ..Default::default()
    };
    
    find_all_comp_cnf(
      search.into(),
      None,
      sort.clone(),
      options,
    ).await?
  };
  models.append(&mut models_tmp);
  
  Ok(models)
}

/// 根据唯一约束对比对象是否相等
#[allow(dead_code, unused_variables)]
pub fn equals_by_unique(
  input: &CompCnfInput,
  model: &CompCnfModel,
  options: Option<&Options>,
) -> bool {
  if input.id.as_ref().is_some() {
    return input.id.as_ref().unwrap() == &model.id;
  }
  
  let is_silent_mode = get_is_silent_mode(options);
  
  if
    input.group.as_ref().is_some() && input.group.as_ref().unwrap() == &model.group &&
    input.lbl.as_ref().is_some() && input.lbl.as_ref().unwrap() == &model.lbl
  {
    return true;
  }
  false
}

// MARK: check_by_unique_comp_cnf
/// 通过唯一约束检查数据是否已经存在
#[allow(unused_variables)]
pub async fn check_by_unique_comp_cnf(
  input: CompCnfInput,
  model: CompCnfModel,
  options: Option<Options>,
) -> Result<Option<CompCnfId>> {
  
  let table = get_table_name_comp_cnf();
  let method = "check_by_unique_comp_cnf";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" input: {input:?}");
    msg += &format!(" model: {model:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
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
    options.as_ref(),
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
    let id = update_by_id_comp_cnf(
      model.id,
      input,
      options,
    ).await?;
    return Ok(id.into());
  }
  if unique_type == UniqueType::Throw {
    let err_msg = "组件配置 重复";
    return Err(eyre!(err_msg));
  }
  Ok(None)
}

// MARK: set_id_by_lbl_comp_cnf
/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(unused_variables, dead_code)]
pub async fn set_id_by_lbl_comp_cnf(
  input: CompCnfInput,
) -> Result<CompCnfInput> {
  
  #[allow(unused_mut)]
  let mut input = input;
  
  let dict_vec = get_dict(&[
    "nuxt_comp_cnf_type",
  ]).await?;
  
  // 类型
  if input.r#type.is_none() {
    let type_dict = &dict_vec[0];
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
  
  // 类型
  if
    input.type_lbl.is_some() && !input.type_lbl.as_ref().unwrap().is_empty()
    && input.r#type.is_none()
  {
    let type_dict = &dict_vec[0];
    let dict_model = type_dict.iter().find(|item| {
      item.lbl == input.type_lbl.clone().unwrap_or_default()
    });
    let val = dict_model.map(|item| item.val.to_string());
    if let Some(val) = val {
      input.r#type = val.into();
    }
  } else if
    (input.type_lbl.is_none() || input.type_lbl.as_ref().unwrap().is_empty())
    && input.r#type.is_some()
  {
    let type_dict = &dict_vec[0];
    let dict_model = type_dict.iter().find(|item| {
      item.val == input.r#type.clone().unwrap_or_default()
    });
    let lbl = dict_model.map(|item| item.lbl.to_string());
    input.type_lbl = lbl;
  }
  
  Ok(input)
}

// MARK: creates_return_comp_cnf
/// 批量创建组件配置并返回
#[allow(dead_code)]
pub async fn creates_return_comp_cnf(
  inputs: Vec<CompCnfInput>,
  options: Option<Options>,
) -> Result<Vec<CompCnfModel>> {
  
  let table = get_table_name_comp_cnf();
  let method = "creates_return_comp_cnf";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" inputs: {inputs:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let ids = _creates(
    inputs.clone(),
    options,
  ).await?;
  
  let models_comp_cnf = find_by_ids_comp_cnf(
    ids,
    options,
  ).await?;
  
  Ok(models_comp_cnf)
}

// MARK: creates_comp_cnf
/// 批量创建组件配置
pub async fn creates_comp_cnf(
  inputs: Vec<CompCnfInput>,
  options: Option<Options>,
) -> Result<Vec<CompCnfId>> {
  
  let table = get_table_name_comp_cnf();
  let method = "creates_comp_cnf";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" inputs: {inputs:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let ids = _creates(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 批量创建组件配置
#[allow(unused_variables, clippy::redundant_locals, unused_mut)]
async fn _creates(
  inputs: Vec<CompCnfInput>,
  options: Option<Options>,
) -> Result<Vec<CompCnfId>> {
  
  let table = get_table_name_comp_cnf();
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  
  let unique_type = options.as_ref()
    .and_then(|item|
      item.get_unique_type()
    )
    .unwrap_or_default();
  
  let mut ids2: Vec<CompCnfId> = vec![];
  let mut inputs2: Vec<CompCnfInput> = vec![];
  
  for input in inputs {
  
    if input.id.is_some() {
      return Err(eyre!("Can not set id when create in dao: {table}"));
    }

    let mut input = input;
    let input = input;
    
    let old_models = find_by_unique_comp_cnf(
      input.clone().into(),
      None,
      options,
    ).await?;
    
    if !old_models.is_empty() {
      let mut id: Option<CompCnfId> = None;
      
      for old_model in old_models {
        let options = Options::from(options)
          .set_unique_type(unique_type);
        
        id = check_by_unique_comp_cnf(
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
  let mut sql_fields = String::with_capacity(80 * 13 * 3 + 60);
  
  sql_fields += "id";
  sql_fields += ",create_time";
  sql_fields += ",update_time";
  sql_fields += ",create_usr_id";
  sql_fields += ",create_usr_id_lbl";
  sql_fields += ",update_usr_id";
  sql_fields += ",update_usr_id_lbl";
  sql_fields += ",tenant_id";
  // 分组
  sql_fields += ",`group`";
  // 名称
  sql_fields += ",lbl";
  // 类型
  sql_fields += ",type";
  // 排序
  sql_fields += ",order_by";
  // 备注
  sql_fields += ",rem";
  // 值
  sql_fields += ",val";
  
  let inputs2_len = inputs2.len();
  let mut sql_values = String::with_capacity(((2 * 13 + 3) * inputs2_len) * 3);
  let mut inputs2_ids = vec![];
  
  for (i, input) in inputs2
    .clone()
    .into_iter()
    .enumerate()
  {
    
    let id: CompCnfId = get_short_uuid().into();
    ids2.push(id);
    
    inputs2_ids.push(id);
    
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
        let mut usr_lbl = String::from("");
        if usr_id.is_some() {
          let usr_model = find_by_id_usr(
            usr_id.unwrap(),
            options,
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
      } else if input.create_usr_id.is_none_or(|s| s.is_empty()) {
        sql_values += ",default";
        sql_values += ",default";
      } else {
        let mut usr_id = input.create_usr_id;
        let mut usr_lbl = String::from("");
        let usr_model = find_by_id_usr(
          usr_id.unwrap(),
          options,
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
    // 分组
    if let Some(group) = input.group {
      sql_values += ",?";
      args.push(group.into());
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
    // 类型
    if let Some(r#type) = input.r#type {
      sql_values += ",?";
      args.push(r#type.into());
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
    // 值
    if let Some(val) = input.val {
      sql_values += ",?";
      args.push(val.into());
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
  
  del_cache_comp_cnf().await?;
  
  let affected_rows = execute(
    sql,
    args,
    options,
  ).await?;
  
  del_cache_comp_cnf().await?;
  
  if affected_rows != inputs2_len as u64 {
    return Err(eyre!("affectedRows: {affected_rows} != {inputs2_len}"));
  }
  
  Ok(ids2)
}

// MARK: create_return_comp_cnf
/// 创建组件配置并返回
#[allow(dead_code)]
pub async fn create_return_comp_cnf(
  #[allow(unused_mut)]
  mut input: CompCnfInput,
  options: Option<Options>,
) -> Result<CompCnfModel> {
  
  let id = create_comp_cnf(
    input.clone(),
    options,
  ).await?;
  
  let model_comp_cnf = find_by_id_comp_cnf(
    id,
    options,
  ).await?;
  
  let model_comp_cnf = match model_comp_cnf {
    Some(model) => model,
    None => {
      let err_msg = "create_return_comp_cnf: model_comp_cnf.is_none()";
      return Err(eyre!(
        ServiceException {
          message: err_msg.into(),
          trace: true,
          ..Default::default()
        },
      ));
    }
  };
  
  Ok(model_comp_cnf)
}

// MARK: create_comp_cnf
/// 创建组件配置
#[allow(dead_code)]
pub async fn create_comp_cnf(
  #[allow(unused_mut)]
  mut input: CompCnfInput,
  options: Option<Options>,
) -> Result<CompCnfId> {
  
  let table = get_table_name_comp_cnf();
  let method = "create_comp_cnf";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" input: {input:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
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

// MARK: update_tenant_by_id_comp_cnf
/// 组件配置根据id修改租户id
pub async fn update_tenant_by_id_comp_cnf(
  id: CompCnfId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  let table = get_table_name_comp_cnf();
  let method = "update_tenant_by_id_comp_cnf";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" id: {id:?}");
    msg += &format!(" tenant_id: {tenant_id:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let mut args = QueryArgs::new();
  
  args.push(tenant_id.into());
  args.push(id.into());
  
  let sql = format!("update {table} set tenant_id=? where id=?");
  
  let args: Vec<_> = args.into();
  
  let num = execute(
    sql,
    args,
    options,
  ).await?;
  
  Ok(num)
}

// MARK: sync_usr_lbl_by_usr_id_comp_cnf
/// 根据 usr_id 同步创建人/更新人/删除人标签
pub async fn sync_usr_lbl_by_usr_id_comp_cnf(
  usr_id: UsrId,
  options: Option<Options>,
) -> Result<u64> {
  let table = get_table_name_comp_cnf();
  let method = "sync_usr_lbl_by_usr_id_comp_cnf";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" usr_id: {usr_id:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  if usr_id.is_empty() {
    return Ok(0);
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let usr_model = find_by_id_usr(
    usr_id,
    options,
  ).await?;
  
  let Some(usr_model) = usr_model else {
    return Ok(0);
  };
  
  let usr_lbl = usr_model.lbl;
  let mut sql_fields = String::with_capacity(540);
  let mut where_querys = Vec::with_capacity(3);
  let mut args = QueryArgs::new();
  
  sql_fields += "create_usr_id_lbl=case when create_usr_id=? then ? else create_usr_id_lbl end,";
  args.push(usr_id.into());
  args.push(usr_lbl.clone().into());
  where_querys.push("create_usr_id=?");
  
  sql_fields += "update_usr_id_lbl=case when update_usr_id=? then ? else update_usr_id_lbl end,";
  args.push(usr_id.into());
  args.push(usr_lbl.clone().into());
  where_querys.push("update_usr_id=?");
  
  sql_fields += "delete_usr_id_lbl=case when delete_usr_id=? then ? else delete_usr_id_lbl end,";
  args.push(usr_id.into());
  args.push(usr_lbl.clone().into());
  where_querys.push("delete_usr_id=?");
  
  if sql_fields.ends_with(',') {
    sql_fields.pop();
  }
  
  args.push(usr_id.into());
  args.push(usr_id.into());
  args.push(usr_id.into());
  let where_query = where_querys.join(" or ");
  
  let sql = format!("update {table} set {sql_fields} where {where_query}");
  
  let args: Vec<_> = args.into();
  
  let num = execute(
    sql,
    args,
    options,
  ).await?;
  
  if num > 0 {
    del_cache_comp_cnf().await?;
  }
  
  Ok(num)
}

// MARK: update_by_id_comp_cnf
/// 根据 id 修改组件配置
#[allow(unused_mut)]
#[allow(unused_variables)]
pub async fn update_by_id_comp_cnf(
  id: CompCnfId,
  mut input: CompCnfInput,
  options: Option<Options>,
) -> Result<CompCnfId> {
  
  let table = get_table_name_comp_cnf();
  let method = "update_by_id_comp_cnf";
  
  let is_debug = get_is_debug(options.as_ref());
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  let is_creating = get_is_creating(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" id: {id:?}");
    msg += &format!(" input: {input:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let old_model = find_by_id_comp_cnf(
    id,
    options,
  ).await?;
  
  let old_model = match old_model {
    Some(model) => model,
    None => {
      return Ok(id);
    }
  };
  
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
    
    let models = find_by_unique_comp_cnf(
      input.into(),
      None,
      options,
    ).await?;
    
    let models = models.into_iter()
      .filter(|item| 
        item.id != id
      )
      .collect::<Vec<CompCnfModel>>();
    
    if !models.is_empty() {
      let unique_type = options
        .as_ref()
        .and_then(|item| item.get_unique_type())
        .unwrap_or(UniqueType::Throw);
      if unique_type == UniqueType::Throw {
        let err_msg = "组件配置 重复";
        return Err(eyre!(err_msg));
      } else if unique_type == UniqueType::Ignore {
        return Ok(id);
      }
    }
  }
  
  let mut args = QueryArgs::new();
  
  let mut sql_fields = String::with_capacity((80 * 13 + 20) * 3);
  
  let mut field_num: usize = 0;
  
  if let Some(tenant_id) = input.tenant_id {
    field_num += 1;
    sql_fields += "tenant_id=?,";
    args.push(tenant_id.into());
  }
  // 分组
  if let Some(group) = input.group.clone() {
    field_num += 1;
    sql_fields += "`group`=?,";
    args.push(group.into());
  }
  // 名称
  if let Some(lbl) = input.lbl.clone() {
    field_num += 1;
    sql_fields += "lbl=?,";
    args.push(lbl.into());
  }
  // 类型
  if let Some(r#type) = input.r#type.clone() {
    field_num += 1;
    sql_fields += "type=?,";
    args.push(r#type.into());
  }
  // 排序
  if let Some(order_by) = input.order_by {
    field_num += 1;
    sql_fields += "order_by=?,";
    args.push(order_by.into());
  }
  // 备注
  if let Some(rem) = input.rem.clone() {
    field_num += 1;
    sql_fields += "rem=?,";
    args.push(rem.into());
  }
  // 值
  if let Some(val) = input.val {
    field_num += 1;
    sql_fields += "val=?,";
    args.push(val.into());
  }
  
  if field_num > 0 {
    del_cache_comp_cnf().await?;
  }
  
  if field_num > 0 {
    if !is_silent_mode && !is_creating {
      if input.update_usr_id.is_none() {
        let mut usr_id = get_auth_id();
        let mut usr_id_lbl = String::from("");
        if usr_id.is_some() {
          let usr_model = find_by_id_usr(
            usr_id.unwrap(),
            options,
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
      } else if input.update_usr_id.is_some_and(
        |s| !s.is_empty()
      ) {
        let mut usr_id = input.update_usr_id;
        let mut usr_id_lbl = String::from("");
        if usr_id.is_some() {
          let usr_model = find_by_id_usr(
            usr_id.unwrap(),
            options,
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
      if input.update_usr_id.is_some_and(
        |s| !s.is_empty()
      ) {
        let usr_id = input.update_usr_id;
        if let Some(usr_id) = usr_id {
          sql_fields += "update_usr_id=?,";
          args.push(usr_id.into());
        }
      }
      if let Some(update_usr_id_lbl) = input.update_usr_id_lbl {
        sql_fields += "update_usr_id_lbl=?,";
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
    args.push(id.into());
    
    let sql = format!("update {table} set {sql_fields} where {sql_where} limit 1");
    
    let args: Vec<_> = args.into();
    
    execute(
      sql,
      args,
      options,
    ).await?;
    
    del_cache_comp_cnf().await?;
    
  }
  
  Ok(id)
}

// MARK: update_by_id_return_comp_cnf
/// 根据 id 更新组件配置, 并返回更新后的数据
#[allow(dead_code)]
pub async fn update_by_id_return_comp_cnf(
  id: CompCnfId,
  input: CompCnfInput,
  options: Option<Options>,
) -> Result<CompCnfModel> {
  
  update_by_id_comp_cnf(
    id,
    input,
    options,
  ).await?;
  
  let model = find_by_id_comp_cnf(
    id,
    options,
  ).await?;
  
  match model {
    Some(model) => Ok(model),
    None => Err(eyre!(
      "组件配置 update_by_id_return_comp_cnf id: {id}",
    )),
  }
}

/// 获取需要清空缓存的表名
#[allow(dead_code)]
fn get_cache_tables() -> Vec<&'static str> {
  let table = get_table_name_comp_cnf();
  vec![
    table,
  ]
}

// MARK: del_cache_comp_cnf
/// 清空缓存
#[allow(dead_code)]
pub async fn del_cache_comp_cnf() -> Result<()> {
  
  let cache_key1s = get_cache_tables();
  
  let cache_key1s = cache_key1s
    .into_iter()
    .map(|x|
      format!("dao.sql.{x}")
    )
    .collect::<Vec<String>>();
  
  let cache_key1s_str = cache_key1s
    .iter()
    .map(|item| item.as_str())
    .collect::<Vec<&str>>();
  
  del_caches(
    cache_key1s_str.as_slice(),
  ).await?;
  
  Ok(())
}

// MARK: delete_by_ids_comp_cnf
/// 根据 ids 删除组件配置
#[allow(unused_variables)]
pub async fn delete_by_ids_comp_cnf(
  ids: Vec<CompCnfId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_comp_cnf();
  let method = "delete_by_ids_comp_cnf";
  
  let is_debug = get_is_debug(options.as_ref());
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  let is_creating = get_is_creating(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" ids: {ids:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
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
  
  del_cache_comp_cnf().await?;
  
  let old_models = find_by_ids_comp_cnf(
    ids.clone(),
    options,
  ).await?;
  
  let mut num = 0;
  for old_model in old_models {
    
    let id = old_model.id;
    
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
    
    let mut sql_fields = String::with_capacity(90);
    sql_fields.push_str("is_deleted=1,");
    let mut usr_id = get_auth_id();
    let mut usr_lbl = String::from("");
    if usr_id.is_some() {
      let usr_model = find_by_id_usr(
        usr_id.unwrap(),
        options,
      ).await?;
      if let Some(usr_model) = usr_model {
        usr_lbl = usr_model.lbl;
      } else {
        usr_id = None;
      }
    }
    
    if !is_silent_mode && !is_creating && let Some(usr_id) = usr_id {
      sql_fields.push_str("delete_usr_id=?,");
      args.push(usr_id.into());
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
    
    args.push(id.into());
    
    let args: Vec<_> = args.into();
    
    num += execute(
      sql,
      args,
      options,
    ).await?;
  }
  
  del_cache_comp_cnf().await?;
  
  if num > MAX_SAFE_INTEGER {
    return Err(eyre!("num: {} > MAX_SAFE_INTEGER", num));
  }
  
  Ok(num)
}

// MARK: revert_by_ids_comp_cnf
/// 根据 ids 还原组件配置
pub async fn revert_by_ids_comp_cnf(
  ids: Vec<CompCnfId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_comp_cnf();
  let method = "revert_by_ids_comp_cnf";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" ids: {ids:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  if ids.is_empty() {
    return Ok(0);
  }
  
  del_cache_comp_cnf().await?;
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let mut num = 0;
  for id in ids.clone() {
    let mut args = QueryArgs::new();
    
    let sql = format!("update {table} set is_deleted=0 where id=? limit 1");
    
    args.push(id.into());
    
    let args: Vec<_> = args.into();
    
    let mut old_model = find_one_comp_cnf(
      CompCnfSearch {
        id: Some(id),
        is_deleted: Some(1),
        ..Default::default()
      }.into(),
      None,
      options,
    ).await?;
    
    if old_model.is_none() {
      old_model = find_by_id_comp_cnf(
        id,
        options,
      ).await?;
    }
    
    let old_model = match old_model {
      Some(model) => model,
      None => continue,
    };
    
    {
      let mut input: CompCnfInput = old_model.clone().into();
      input.id = None;
      
      let models = find_by_unique_comp_cnf(
        input.into(),
        None,
        options,
      ).await?;
      
      let models: Vec<CompCnfModel> = models
        .into_iter()
        .filter(|item| 
          item.id != id
        )
        .collect();
      
      if !models.is_empty() {
        let err_msg = "组件配置 重复";
        return Err(eyre!(err_msg));
      }
    }
    
    num += execute(
      sql,
      args,
      options,
    ).await?;
    
  }
  
  del_cache_comp_cnf().await?;
  
  Ok(num)
}

// MARK: force_delete_by_ids_comp_cnf
/// 根据 ids 彻底删除组件配置
#[allow(unused_variables)]
pub async fn force_delete_by_ids_comp_cnf(
  ids: Vec<CompCnfId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_comp_cnf();
  let method = "force_delete_by_ids_comp_cnf";
  
  let is_debug = get_is_debug(options.as_ref());
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" ids: {ids:?}");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
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
  
  del_cache_comp_cnf().await?;
  
  let mut num = 0;
  for id in ids.clone() {
    
    let old_model = find_one_comp_cnf(
      Some(CompCnfSearch {
        id: Some(id),
        is_deleted: Some(1),
        ..Default::default()
      }),
      None,
      options,
    ).await?;
    
    let old_model = match old_model {
      Some(model) => model,
      None => continue,
    };
    
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
    
    args.push(id.into());
    
    let args: Vec<_> = args.into();
    
    num += execute(
      sql,
      args,
      options,
    ).await?;
  }
  
  del_cache_comp_cnf().await?;
  
  Ok(num)
}

// MARK: find_last_order_by_comp_cnf
/// 查找 组件配置 order_by 字段的最大值
pub async fn find_last_order_by_comp_cnf(
  search: Option<CompCnfSearch>,
  options: Option<Options>,
) -> Result<u32> {
  
  let table = get_table_name_comp_cnf();
  let method = "find_last_order_by_comp_cnf";
  
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
  
  let mut args = QueryArgs::new();
  
  let from_query = get_from_query(&mut args, search.as_ref(), options.as_ref()).await?;
  let where_query = get_where_query(&mut args, search.as_ref(), options.as_ref()).await?;
  
  let sql = format!(r#"select f.order_by from (select t.order_by
  from {from_query} where {where_query} group by t.id order by t.order_by desc limit 1) f"#);
  
  let args: Vec<_> = args.into();
  
  let cache_enabled = cache_dao::get_cache_enabled();
  
  let (
    cache_key1,
    cache_key2,
  ) = if cache_enabled {
    (
      format!("dao.sql.{table}"),
      crate::common::util::string::hash(serde_json::json!([ &sql, args ]).to_string().as_bytes()),
    )
  } else {
    (
      String::new(),
      String::new(),
    )
  };
  
  let order_by = if cache_enabled {
    let str = cache_dao::get_cache(&cache_key1, &cache_key2).await?;
    if let Some(str) = str {
      let res2: u32;
      let res = serde_json::from_str::<u32>(&str);
      if let Ok(res) = res {
        res2 = res;
      } else {
        res2 = 0;
        cache_dao::del_cache(&cache_key1).await?;
      }
      Some(res2)
    } else {
      None
    }
  } else {
    None
  };
  
  let order_by: u32 = if let Some(order_by) = order_by {
    order_by
  } else {
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
    if cache_enabled {
      let str = serde_json::to_string(&order_by)?;
      cache_dao::set_cache(&cache_key1, &cache_key2, &str).await?;
    }
    order_by
  };
  
  Ok(order_by)
}

// MARK: validate_option_comp_cnf
/// 校验组件配置是否存在
#[allow(dead_code)]
pub async fn validate_option_comp_cnf(
  model: Option<CompCnfModel>,
) -> Result<CompCnfModel> {
  
  let model = match model {
    Some(model) => model,
    None => {
      let err_msg = String::from("组件配置不存在");
      error!(
        "{req_id} {err_msg}",
        req_id = get_req_id(),
      );
      return Err(eyre!(
        ServiceException {
          message: err_msg,
          trace: true,
          ..Default::default()
        },
      ));
    },
  };
  
  Ok(model)
}
