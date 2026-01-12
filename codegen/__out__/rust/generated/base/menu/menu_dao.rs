
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
  find_all_result_limit,
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

use super::menu_model::*;
use crate::base::usr::usr_model::UsrId;

use crate::base::usr::usr_dao::find_by_id_usr;

#[allow(unused_variables)]
async fn get_where_query(
  args: &mut QueryArgs,
  search: Option<&MenuSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let is_deleted = search
    .and_then(|item| item.is_deleted)
    .unwrap_or(0);
  
  let mut where_query = String::with_capacity(80 * 16 * 2);
  
  where_query.push_str(" t.is_deleted=?");
  args.push(is_deleted.into());
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
    let ids: Option<Vec<MenuId>> = match search {
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
  // 父菜单
  {
    let parent_id: Option<Vec<MenuId>> = match search {
      Some(item) => item.parent_id.clone(),
      None => None,
    };
    if let Some(parent_id) = parent_id {
      let arg = {
        if parent_id.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(parent_id.len());
          for item in parent_id {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.parent_id in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let parent_id_is_null: bool = match search {
      Some(item) => item.parent_id_is_null.unwrap_or(false),
      None => false,
    };
    if parent_id_is_null {
      where_query.push_str(" and t.parent_id is null");
    }
  }
  {
    let parent_id_lbl: Option<Vec<String>> = match search {
      Some(item) => item.parent_id_lbl.clone(),
      None => None,
    };
    if let Some(parent_id_lbl) = parent_id_lbl {
      let arg = {
        if parent_id_lbl.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(parent_id_lbl.len());
          for item in parent_id_lbl {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and parent_id_lbl.lbl in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let parent_id_lbl_like = match search {
      Some(item) => item.parent_id_lbl_like.clone(),
      None => None,
    };
    if let Some(parent_id_lbl_like) = parent_id_lbl_like {
      where_query.push_str(" and parent_id_lbl.lbl like ?");
      args.push(format!("%{}%", sql_like(&parent_id_lbl_like)).into());
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
  // 路由
  {
    let route_path = match search {
      Some(item) => item.route_path.clone(),
      None => None,
    };
    if let Some(route_path) = route_path {
      where_query.push_str(" and t.route_path=?");
      args.push(route_path.into());
    }
    let route_path_like = match search {
      Some(item) => item.route_path_like.clone(),
      None => None,
    };
    if let Some(route_path_like) = route_path_like && !route_path_like.is_empty() {
      where_query.push_str(" and t.route_path like ?");
      args.push(format!("%{}%", sql_like(&route_path_like)).into());
    }
  }
  // 参数
  {
    let route_query = match search {
      Some(item) => item.route_query.clone(),
      None => None,
    };
    if let Some(route_query) = route_query {
      where_query.push_str(" and t.route_query=?");
      args.push(route_query.into());
    }
    let route_query_like = match search {
      Some(item) => item.route_query_like.clone(),
      None => None,
    };
    if let Some(route_query_like) = route_query_like && !route_query_like.is_empty() {
      where_query.push_str(" and t.route_query like ?");
      args.push(format!("%{}%", sql_like(&route_query_like)).into());
    }
  }
  // 首页隐藏
  {
    let is_home_hide: Option<Vec<u8>> = match search {
      Some(item) => item.is_home_hide.clone(),
      None => None,
    };
    if let Some(is_home_hide) = is_home_hide {
      let arg = {
        if is_home_hide.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(is_home_hide.len());
          for item in is_home_hide {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.is_home_hide in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  // 动态页面
  {
    let is_dyn_page: Option<Vec<u8>> = match search {
      Some(item) => item.is_dyn_page.clone(),
      None => None,
    };
    if let Some(is_dyn_page) = is_dyn_page {
      let arg = {
        if is_dyn_page.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(is_dyn_page.len());
          for item in is_dyn_page {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.is_dyn_page in (");
      where_query.push_str(&arg);
      where_query.push(')');
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
        if is_enabled.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(is_enabled.len());
          for item in is_enabled {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.is_enabled in (");
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
  // 创建人
  {
    let create_usr_id: Option<Vec<UsrId>> = match search {
      Some(item) => item.create_usr_id.clone(),
      None => None,
    };
    if let Some(create_usr_id) = create_usr_id {
      let arg = {
        if create_usr_id.is_empty() {
          "null".to_string()
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
          "null".to_string()
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
    let update_usr_id: Option<Vec<UsrId>> = match search {
      Some(item) => item.update_usr_id.clone(),
      None => None,
    };
    if let Some(update_usr_id) = update_usr_id {
      let arg = {
        if update_usr_id.is_empty() {
          "null".to_string()
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
          "null".to_string()
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
  // 隐藏记录
  {
    let is_hidden: Option<Vec<u8>> = match search {
      Some(item) => item.is_hidden.clone(),
      None => Default::default(),
    };
    if let Some(is_hidden) = is_hidden {
      let arg = {
        if is_hidden.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(is_hidden.len());
          for item in is_hidden {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.is_hidden in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  Ok(where_query)
}

#[allow(unused_variables)]
async fn get_from_query(
  args: &mut QueryArgs,
  search: Option<&MenuSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let from_query = r#"base_menu t
  left join base_menu parent_id_lbl on parent_id_lbl.id=t.parent_id"#.to_owned();
  Ok(from_query)
}

// MARK: find_all_menu
/// 根据搜索条件和分页查找菜单列表
#[allow(unused_mut)]
pub async fn find_all_menu(
  search: Option<MenuSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<MenuModel>> {
  
  let table = get_table_name_menu();
  let method = "find_all_menu";
  
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
  // 父菜单
  if let Some(search) = &search && let Some(parent_id) = &search.parent_id {
    let len = parent_id.len();
    if len == 0 {
      return Ok(vec![]);
    }
    if len > ids_limit {
      return Err(eyre!("search.parent_id.length > {ids_limit}"));
    }
  }
  // 首页隐藏
  if let Some(search) = &search && let Some(is_home_hide) = &search.is_home_hide {
    let len = is_home_hide.len();
    if len == 0 {
      return Ok(vec![]);
    }
    if len > ids_limit {
      return Err(eyre!("search.is_home_hide.length > {ids_limit}"));
    }
  }
  // 动态页面
  if let Some(search) = &search && let Some(is_dyn_page) = &search.is_dyn_page {
    let len = is_dyn_page.len();
    if len == 0 {
      return Ok(vec![]);
    }
    if len > ids_limit {
      return Err(eyre!("search.is_dyn_page.length > {ids_limit}"));
    }
  }
  // 启用
  if let Some(search) = &search && let Some(is_enabled) = &search.is_enabled {
    let len = is_enabled.len();
    if len == 0 {
      return Ok(vec![]);
    }
    if len > ids_limit {
      return Err(eyre!("search.is_enabled.length > {ids_limit}"));
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
  // 隐藏记录
  if let Some(search) = &search && let Some(is_hidden) = &search.is_hidden {
    let len = is_hidden.len();
    if len == 0 {
      return Ok(vec![]);
    }
    if len > ids_limit {
      return Err(eyre!("search.is_hidden.length > {ids_limit}"));
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
      prop: "create_time".to_string(),
      order: SortOrderEnum::Asc,
    });
  }
  
  let order_by_query = get_order_by_query(Some(sort));
  let is_result_limit = page.as_ref()
    .and_then(|item| item.is_result_limit)
    .unwrap_or(true);
  let page_query = get_page_query(page);
  
  let sql = format!(r#"select f.* from (select t.*
  ,parent_id_lbl.lbl parent_id_lbl
  from {from_query} where {where_query} group by t.id{order_by_query}) f {page_query}"#);
  
  let args = args.into();
  
  let options = Options::from(options);
  
  let options = options.set_cache_key(table, &sql, &args);
  
  let mut res: Vec<MenuModel> = query(
    sql,
    args,
    Some(options),
  ).await?;
  
  let len = res.len();
  let result_limit_num = find_all_result_limit();
  
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
    "yes_no",
    "yes_no",
    "is_enabled",
  ]).await?;
  let [
    is_home_hide_dict,
    is_dyn_page_dict,
    is_enabled_dict,
  ]: [Vec<_>; 3] = dict_vec
    .try_into()
    .map_err(|err| eyre!("{:#?}", err))?;
  
  #[allow(unused_variables)]
  for model in &mut res {
    
    // 首页隐藏
    model.is_home_hide_lbl = {
      is_home_hide_dict
        .iter()
        .find(|item| item.val == model.is_home_hide.to_string())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.is_home_hide.to_string())
    };
    
    // 动态页面
    model.is_dyn_page_lbl = {
      is_dyn_page_dict
        .iter()
        .find(|item| item.val == model.is_dyn_page.to_string())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.is_dyn_page.to_string())
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

// MARK: find_count_menu
/// 根据条件查找菜单总数
pub async fn find_count_menu(
  search: Option<MenuSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_menu();
  let method = "find_count_menu";
  
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
  // 父菜单
  if let Some(search) = &search && search.parent_id.is_some() {
    let len = search.parent_id.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.parent_id.length > {ids_limit}"));
    }
  }
  // 首页隐藏
  if let Some(search) = &search && search.is_home_hide.is_some() {
    let len = search.is_home_hide.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.is_home_hide.length > {ids_limit}"));
    }
  }
  // 动态页面
  if let Some(search) = &search && search.is_dyn_page.is_some() {
    let len = search.is_dyn_page.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.is_dyn_page.length > {ids_limit}"));
    }
  }
  // 启用
  if let Some(search) = &search && search.is_enabled.is_some() {
    let len = search.is_enabled.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.is_enabled.length > {ids_limit}"));
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
  // 隐藏记录
  if let Some(search) = &search && search.is_hidden.is_some() {
    let len = search.is_hidden.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.is_hidden.length > {ids_limit}"));
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

// MARK: get_field_comments_menu
/// 获取菜单字段注释
#[allow(unused_mut)]
pub async fn get_field_comments_menu(
  _options: Option<Options>,
) -> Result<MenuFieldComment> {
  
  let mut field_comments = MenuFieldComment {
    id: "ID".into(),
    parent_id: "父菜单".into(),
    parent_id_lbl: "父菜单".into(),
    lbl: "名称".into(),
    route_path: "路由".into(),
    route_query: "参数".into(),
    is_home_hide: "首页隐藏".into(),
    is_home_hide_lbl: "首页隐藏".into(),
    is_dyn_page: "动态页面".into(),
    is_dyn_page_lbl: "动态页面".into(),
    is_enabled: "启用".into(),
    is_enabled_lbl: "启用".into(),
    order_by: "排序".into(),
    rem: "备注".into(),
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

// MARK: find_one_ok_menu
/// 根据条件查找第一个菜单, 如果不存在则抛错
#[allow(dead_code)]
pub async fn find_one_ok_menu(
  search: Option<MenuSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<MenuModel> {
  
  let table = get_table_name_menu();
  let method = "find_one_ok_menu";
  
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
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let menu_model = find_one_menu(
    search,
    sort,
    options,
  ).await?;
  
  let Some(menu_model) = menu_model else {
    let err_msg = "此 菜单 已被删除";
    return Err(eyre!(err_msg));
  };
  
  Ok(menu_model)
}

// MARK: find_one_menu
/// 根据条件查找第一个菜单
#[allow(dead_code)]
pub async fn find_one_menu(
  search: Option<MenuSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<MenuModel>> {
  
  let table = get_table_name_menu();
  let method = "find_one_menu";
  
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
  
  let res = find_all_menu(
    search,
    page,
    sort,
    options,
  ).await?;
  
  let model: Option<MenuModel> = res.into_iter().next();
  
  Ok(model)
}

// MARK: find_by_id_ok_menu
/// 根据 id 查找菜单, 如果不存在则抛错
#[allow(dead_code)]
pub async fn find_by_id_ok_menu(
  id: MenuId,
  options: Option<Options>,
) -> Result<MenuModel> {
  
  let table = get_table_name_menu();
  let method = "find_by_id_ok_menu";
  
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
  
  let menu_model = find_by_id_menu(
    id,
    options,
  ).await?;
  
  let Some(menu_model) = menu_model else {
    let err_msg = "此 菜单 已被删除";
    error!(
      "{req_id} {err_msg} id: {id:?}",
      req_id = get_req_id(),
    );
    return Err(eyre!(ServiceException {
      message: err_msg.to_string(),
      trace: true,
      ..Default::default()
    }));
  };
  
  Ok(menu_model)
}

// MARK: find_by_id_menu
/// 根据 id 查找菜单
pub async fn find_by_id_menu(
  id: MenuId,
  options: Option<Options>,
) -> Result<Option<MenuModel>> {
  
  let table = get_table_name_menu();
  let method = "find_by_id_menu";
  
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
  
  let search = MenuSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let menu_model = find_one_menu(
    search,
    None,
    options,
  ).await?;
  
  Ok(menu_model)
}

// MARK: find_by_ids_ok_menu
/// 根据 ids 查找菜单, 出现查询不到的 id 则报错
#[allow(dead_code)]
pub async fn find_by_ids_ok_menu(
  ids: Vec<MenuId>,
  options: Option<Options>,
) -> Result<Vec<MenuModel>> {
  
  let table = get_table_name_menu();
  let method = "find_by_ids_ok_menu";
  
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
    return Err(eyre!(
      ServiceException {
        message: "ids.length > FIND_ALL_IDS_LIMIT".to_string(),
        trace: true,
        ..Default::default()
      },
    ));
  }
  
  let menu_models = find_by_ids_menu(
    ids.clone(),
    options,
  ).await?;
  
  if menu_models.len() != len {
    let err_msg = "此 菜单 已被删除";
    return Err(eyre!(err_msg));
  }
  
  let menu_models = ids
    .into_iter()
    .map(|id| {
      let model = menu_models
        .iter()
        .find(|item| item.id == id);
      if let Some(model) = model {
        return Ok(model.clone());
      }
      let err_msg = "此 菜单 已经被删除";
      Err(eyre!(err_msg))
    })
    .collect::<Result<Vec<MenuModel>>>()?;
  
  Ok(menu_models)
}

// MARK: find_by_ids_menu
/// 根据 ids 查找菜单
#[allow(dead_code)]
pub async fn find_by_ids_menu(
  ids: Vec<MenuId>,
  options: Option<Options>,
) -> Result<Vec<MenuModel>> {
  
  let table = get_table_name_menu();
  let method = "find_by_ids_menu";
  
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
    return Err(eyre!(
      ServiceException {
        message: "ids.length > FIND_ALL_IDS_LIMIT".to_string(),
        trace: true,
        ..Default::default()
      },
    ));
  }
  
  let search = MenuSearch {
    ids: Some(ids.clone()),
    ..Default::default()
  }.into();
  
  let menu_models = find_all_menu(
    search,
    None,
    None,
    options,
  ).await?;
  
  let menu_models = ids
    .into_iter()
    .filter_map(|id| {
      menu_models
        .iter()
        .find(|item| item.id == id)
        .cloned()
    })
    .collect::<Vec<MenuModel>>();
  
  Ok(menu_models)
}

// MARK: exists_menu
/// 根据搜索条件判断菜单是否存在
#[allow(dead_code)]
pub async fn exists_menu(
  search: Option<MenuSearch>,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = get_table_name_menu();
  let method = "exists_menu";
  
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
      return Ok(false);
    }
    if search.ids.is_some() && search.ids.as_ref().unwrap().is_empty() {
      return Ok(false);
    }
  }
  // 父菜单
  if let Some(search) = &search && search.parent_id.is_some() {
    let len = search.parent_id.as_ref().unwrap().len();
    if len == 0 {
      return Ok(false);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.parent_id.length > {ids_limit}"));
    }
  }
  // 首页隐藏
  if let Some(search) = &search && search.is_home_hide.is_some() {
    let len = search.is_home_hide.as_ref().unwrap().len();
    if len == 0 {
      return Ok(false);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.is_home_hide.length > {ids_limit}"));
    }
  }
  // 动态页面
  if let Some(search) = &search && search.is_dyn_page.is_some() {
    let len = search.is_dyn_page.as_ref().unwrap().len();
    if len == 0 {
      return Ok(false);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.is_dyn_page.length > {ids_limit}"));
    }
  }
  // 启用
  if let Some(search) = &search && search.is_enabled.is_some() {
    let len = search.is_enabled.as_ref().unwrap().len();
    if len == 0 {
      return Ok(false);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.is_enabled.length > {ids_limit}"));
    }
  }
  // 创建人
  if let Some(search) = &search && search.create_usr_id.is_some() {
    let len = search.create_usr_id.as_ref().unwrap().len();
    if len == 0 {
      return Ok(false);
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
      return Ok(false);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.update_usr_id.length > {ids_limit}"));
    }
  }
  // 隐藏记录
  if let Some(search) = &search && search.is_hidden.is_some() {
    let len = search.is_hidden.as_ref().unwrap().len();
    if len == 0 {
      return Ok(false);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.is_hidden.length > {ids_limit}"));
    }
  }
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let mut args = QueryArgs::new();
  
  let from_query = get_from_query(&mut args, search.as_ref(), options.as_ref()).await?;
  let where_query = get_where_query(&mut args, search.as_ref(), options.as_ref()).await?;
  
  let sql = format!(r#"select exists(select 1 from {from_query} where {where_query} group by t.id)"#);
  
  let args = args.into();
  
  let options = Options::from(options);
  
  let options = options.set_cache_key(table, &sql, &args);
  
  let options = Some(options);
  
  let res: Option<(bool,)> = query_one(
    sql,
    args,
    options,
  ).await?;
  
  Ok(res
    .map(|item| item.0)
    .unwrap_or_default())
}

// MARK: exists_by_id_menu
/// 根据 id 判断菜单是否存在
#[allow(dead_code)]
pub async fn exists_by_id_menu(
  id: MenuId,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = get_table_name_menu();
  let method = "exists_by_id_menu";
  
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
  
  let search = MenuSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let exists = exists_menu(
    search,
    options,
  ).await?;
  
  Ok(exists)
}

// MARK: find_by_unique_menu
/// 通过唯一约束获得数据列表
#[allow(unused_variables)]
pub async fn find_by_unique_menu(
  search: MenuSearch,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<MenuModel>> {
  
  let table = get_table_name_menu();
  let method = "find_by_unique_menu";
  
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
    let model = find_by_id_menu(
      id,
      options.clone(),
    ).await?;
    return Ok(model.map_or_else(Vec::new, |m| vec![m]));
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
      parent_id: search.parent_id.clone(),
      lbl: search.lbl.clone(),
      ..Default::default()
    };
    
    find_all_menu(
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
  false
}

// MARK: check_by_unique_menu
/// 通过唯一约束检查数据是否已经存在
#[allow(unused_variables)]
pub async fn check_by_unique_menu(
  input: MenuInput,
  model: MenuModel,
  options: Option<Options>,
) -> Result<Option<MenuId>> {
  
  let table = get_table_name_menu();
  let method = "check_by_unique_menu";
  
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
    let id = update_by_id_menu(
      model.id,
      input,
      options,
    ).await?;
    return Ok(id.into());
  }
  if unique_type == UniqueType::Throw {
    let err_msg = "菜单 重复";
    return Err(eyre!(err_msg));
  }
  Ok(None)
}

// MARK: set_id_by_lbl_menu
/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(unused_variables, dead_code)]
pub async fn set_id_by_lbl_menu(
  input: MenuInput,
) -> Result<MenuInput> {
  
  #[allow(unused_mut)]
  let mut input = input;
  
  let dict_vec = get_dict(&[
    "yes_no",
    "yes_no",
    "is_enabled",
  ]).await?;
  
  // 首页隐藏
  if input.is_home_hide.is_none() {
    let is_home_hide_dict = &dict_vec[0];
    if let Some(is_home_hide_lbl) = input.is_home_hide_lbl.clone() {
      input.is_home_hide = is_home_hide_dict
        .iter()
        .find(|item| {
          item.lbl == is_home_hide_lbl
        })
        .map(|item| {
          item.val.parse().unwrap_or_default()
        });
    }
  }
  
  // 动态页面
  if input.is_dyn_page.is_none() {
    let is_dyn_page_dict = &dict_vec[1];
    if let Some(is_dyn_page_lbl) = input.is_dyn_page_lbl.clone() {
      input.is_dyn_page = is_dyn_page_dict
        .iter()
        .find(|item| {
          item.lbl == is_dyn_page_lbl
        })
        .map(|item| {
          item.val.parse().unwrap_or_default()
        });
    }
  }
  
  // 启用
  if input.is_enabled.is_none() {
    let is_enabled_dict = &dict_vec[2];
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
  
  // 父菜单
  if input.parent_id_lbl.is_some()
    && !input.parent_id_lbl.as_ref().unwrap().is_empty()
    && input.parent_id.is_none()
  {
    input.parent_id_lbl = input.parent_id_lbl.map(|item| 
      item.trim().to_owned()
    );
    let model = find_one_menu(
      MenuSearch {
        lbl: input.parent_id_lbl.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(model) = model {
      input.parent_id = model.id.into();
    }
  } else if
    (input.parent_id_lbl.is_none() || input.parent_id_lbl.as_ref().unwrap().is_empty())
    && input.parent_id.is_some()
  {
    let menu_model = find_one_menu(
      MenuSearch {
        id: input.parent_id.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(menu_model) = menu_model {
      input.parent_id_lbl = menu_model.lbl.into();
    }
  }
  
  // 首页隐藏
  if
    input.is_home_hide_lbl.is_some() && !input.is_home_hide_lbl.as_ref().unwrap().is_empty()
    && input.is_home_hide.is_none()
  {
    let is_home_hide_dict = &dict_vec[0];
    let dict_model = is_home_hide_dict.iter().find(|item| {
      item.lbl == input.is_home_hide_lbl.clone().unwrap_or_default()
    });
    let val = dict_model.map(|item| item.val.to_string());
    if let Some(val) = val {
      input.is_home_hide = val.parse::<u8>()?.into();
    }
  } else if
    (input.is_home_hide_lbl.is_none() || input.is_home_hide_lbl.as_ref().unwrap().is_empty())
    && input.is_home_hide.is_some()
  {
    let is_home_hide_dict = &dict_vec[0];
    let dict_model = is_home_hide_dict.iter().find(|item| {
      item.val == input.is_home_hide.unwrap_or_default().to_string()
    });
    let lbl = dict_model.map(|item| item.lbl.to_string());
    input.is_home_hide_lbl = lbl;
  }
  
  // 动态页面
  if
    input.is_dyn_page_lbl.is_some() && !input.is_dyn_page_lbl.as_ref().unwrap().is_empty()
    && input.is_dyn_page.is_none()
  {
    let is_dyn_page_dict = &dict_vec[1];
    let dict_model = is_dyn_page_dict.iter().find(|item| {
      item.lbl == input.is_dyn_page_lbl.clone().unwrap_or_default()
    });
    let val = dict_model.map(|item| item.val.to_string());
    if let Some(val) = val {
      input.is_dyn_page = val.parse::<u8>()?.into();
    }
  } else if
    (input.is_dyn_page_lbl.is_none() || input.is_dyn_page_lbl.as_ref().unwrap().is_empty())
    && input.is_dyn_page.is_some()
  {
    let is_dyn_page_dict = &dict_vec[1];
    let dict_model = is_dyn_page_dict.iter().find(|item| {
      item.val == input.is_dyn_page.unwrap_or_default().to_string()
    });
    let lbl = dict_model.map(|item| item.lbl.to_string());
    input.is_dyn_page_lbl = lbl;
  }
  
  // 启用
  if
    input.is_enabled_lbl.is_some() && !input.is_enabled_lbl.as_ref().unwrap().is_empty()
    && input.is_enabled.is_none()
  {
    let is_enabled_dict = &dict_vec[2];
    let dict_model = is_enabled_dict.iter().find(|item| {
      item.lbl == input.is_enabled_lbl.clone().unwrap_or_default()
    });
    let val = dict_model.map(|item| item.val.to_string());
    if let Some(val) = val {
      input.is_enabled = val.parse::<u8>()?.into();
    }
  } else if
    (input.is_enabled_lbl.is_none() || input.is_enabled_lbl.as_ref().unwrap().is_empty())
    && input.is_enabled.is_some()
  {
    let is_enabled_dict = &dict_vec[2];
    let dict_model = is_enabled_dict.iter().find(|item| {
      item.val == input.is_enabled.unwrap_or_default().to_string()
    });
    let lbl = dict_model.map(|item| item.lbl.to_string());
    input.is_enabled_lbl = lbl;
  }
  
  Ok(input)
}

// MARK: creates_return_menu
/// 批量创建菜单并返回
#[allow(dead_code)]
pub async fn creates_return_menu(
  inputs: Vec<MenuInput>,
  options: Option<Options>,
) -> Result<Vec<MenuModel>> {
  
  let table = get_table_name_menu();
  let method = "creates_return_menu";
  
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
  
  let models_menu = find_by_ids_menu(
    ids,
    options,
  ).await?;
  
  Ok(models_menu)
}

// MARK: creates_menu
/// 批量创建菜单
pub async fn creates_menu(
  inputs: Vec<MenuInput>,
  options: Option<Options>,
) -> Result<Vec<MenuId>> {
  
  let table = get_table_name_menu();
  let method = "creates_menu";
  
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

/// 批量创建菜单
#[allow(unused_variables, clippy::redundant_locals)]
async fn _creates(
  inputs: Vec<MenuInput>,
  options: Option<Options>,
) -> Result<Vec<MenuId>> {
  
  let table = get_table_name_menu();
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  
  let unique_type = options.as_ref()
    .and_then(|item|
      item.get_unique_type()
    )
    .unwrap_or_default();
  
  let mut ids2: Vec<MenuId> = vec![];
  let mut inputs2: Vec<MenuInput> = vec![];
  
  for input in inputs {
  
    if input.id.is_some() {
      return Err(eyre!("Can not set id when create in dao: {table}"));
    }
    
    let old_models = find_by_unique_menu(
      input.clone().into(),
      None,
      options.clone(),
    ).await?;
    
    if !old_models.is_empty() {
      let mut id: Option<MenuId> = None;
      
      for old_model in old_models {
        let options = Options::from(options.clone())
          .set_unique_type(unique_type);
        
        id = check_by_unique_menu(
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
  let mut sql_fields = String::with_capacity(80 * 16 + 20);
  
  sql_fields += "id";
  sql_fields += ",create_time";
  sql_fields += ",update_time";
  sql_fields += ",create_usr_id";
  sql_fields += ",create_usr_id_lbl";
  sql_fields += ",update_usr_id";
  sql_fields += ",update_usr_id_lbl";
  // 父菜单
  sql_fields += ",parent_id";
  // 名称
  sql_fields += ",lbl";
  // 路由
  sql_fields += ",route_path";
  // 参数
  sql_fields += ",route_query";
  // 首页隐藏
  sql_fields += ",is_home_hide";
  // 动态页面
  sql_fields += ",is_dyn_page";
  // 启用
  sql_fields += ",is_enabled";
  // 排序
  sql_fields += ",order_by";
  // 备注
  sql_fields += ",rem";
  // 隐藏记录
  sql_fields += ",is_hidden";
  
  let inputs2_len = inputs2.len();
  let mut sql_values = String::with_capacity((2 * 16 + 3) * inputs2_len);
  let mut inputs2_ids = vec![];
  
  for (i, input) in inputs2
    .clone()
    .into_iter()
    .enumerate()
  {
    
    let id: MenuId = get_short_uuid().into();
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
        let mut usr_lbl = String::new();
        if usr_id.is_some() {
          let usr_model = find_by_id_usr(
            usr_id.unwrap(),
            options.clone(),
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
      } else if input.create_usr_id.unwrap().is_empty() {
        sql_values += ",default";
        sql_values += ",default";
      } else {
        let mut usr_id = input.create_usr_id;
        let mut usr_lbl = String::new();
        let usr_model = find_by_id_usr(
          usr_id.unwrap(),
          options.clone(),
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
    // 父菜单
    if let Some(parent_id) = input.parent_id {
      sql_values += ",?";
      args.push(parent_id.into());
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
    // 路由
    if let Some(route_path) = input.route_path {
      sql_values += ",?";
      args.push(route_path.into());
    } else {
      sql_values += ",default";
    }
    // 参数
    if let Some(route_query) = input.route_query {
      sql_values += ",?";
      args.push(route_query.into());
    } else {
      sql_values += ",default";
    }
    // 首页隐藏
    if let Some(is_home_hide) = input.is_home_hide {
      sql_values += ",?";
      args.push(is_home_hide.into());
    } else {
      sql_values += ",default";
    }
    // 动态页面
    if let Some(is_dyn_page) = input.is_dyn_page {
      sql_values += ",?";
      args.push(is_dyn_page.into());
    } else {
      sql_values += ",default";
    }
    // 启用
    if let Some(is_enabled) = input.is_enabled {
      sql_values += ",?";
      args.push(is_enabled.into());
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
    // 隐藏记录
    if let Some(is_hidden) = input.is_hidden {
      sql_values += ",?";
      args.push(is_hidden.into());
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
  
  del_caches(
    vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
  ).await?;
  
  let affected_rows = execute(
    sql,
    args,
    options.clone(),
  ).await?;
  
  del_caches(
    vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
  ).await?;
  
  if affected_rows != inputs2_len as u64 {
    return Err(eyre!("affectedRows: {affected_rows} != {inputs2_len}"));
  }
  
  Ok(ids2)
}

// MARK: create_return_menu
/// 创建菜单并返回
#[allow(dead_code)]
pub async fn create_return_menu(
  #[allow(unused_mut)]
  mut input: MenuInput,
  options: Option<Options>,
) -> Result<MenuModel> {
  
  let id = create_menu(
    input.clone(),
    options.clone(),
  ).await?;
  
  let model_menu = find_by_id_menu(
    id,
    options,
  ).await?;
  
  let model_menu = match model_menu {
    Some(model) => model,
    None => {
      let err_msg = "create_return_menu: model_menu.is_none()";
      return Err(eyre!(
        ServiceException {
          message: err_msg.to_owned(),
          trace: true,
          ..Default::default()
        },
      ));
    }
  };
  
  Ok(model_menu)
}

// MARK: create_menu
/// 创建菜单
#[allow(dead_code)]
pub async fn create_menu(
  #[allow(unused_mut)]
  mut input: MenuInput,
  options: Option<Options>,
) -> Result<MenuId> {
  
  let table = get_table_name_menu();
  let method = "create_menu";
  
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

// MARK: update_by_id_menu
/// 根据 id 修改菜单
#[allow(unused_mut)]
#[allow(unused_variables)]
pub async fn update_by_id_menu(
  id: MenuId,
  mut input: MenuInput,
  options: Option<Options>,
) -> Result<MenuId> {
  
  let table = get_table_name_menu();
  let method = "update_by_id_menu";
  
  let is_debug = get_is_debug(options.as_ref());
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  let is_creating = get_is_creating(options.as_ref());
  
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
  
  let old_model = find_by_id_menu(
    id,
    options.clone(),
  ).await?;
  
  let old_model = match old_model {
    Some(model) => model,
    None => {
      let err_msg = "编辑失败, 此 菜单 已被删除";
      return Err(eyre!(err_msg));
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
    
    let models = find_by_unique_menu(
      input.into(),
      None,
      options.clone(),
    ).await?;
    
    let models = models.into_iter()
      .filter(|item| 
        item.id != id
      )
      .collect::<Vec<MenuModel>>();
    
    if !models.is_empty() {
      let unique_type = options
        .as_ref()
        .and_then(|item| item.get_unique_type())
        .unwrap_or(UniqueType::Throw);
      if unique_type == UniqueType::Throw {
        let err_msg = "菜单 重复";
        return Err(eyre!(err_msg));
      } else if unique_type == UniqueType::Ignore {
        return Ok(id);
      }
    }
  }
  
  let mut args = QueryArgs::new();
  
  let mut sql_fields = String::with_capacity(80 * 16 + 20);
  
  let mut field_num: usize = 0;
  // 父菜单
  if let Some(parent_id) = input.parent_id {
    field_num += 1;
    sql_fields += "parent_id=?,";
    args.push(parent_id.into());
  }
  // 名称
  if let Some(lbl) = input.lbl {
    field_num += 1;
    sql_fields += "lbl=?,";
    args.push(lbl.into());
  }
  // 路由
  if let Some(route_path) = input.route_path {
    field_num += 1;
    sql_fields += "route_path=?,";
    args.push(route_path.into());
  }
  // 参数
  if let Some(route_query) = input.route_query {
    field_num += 1;
    sql_fields += "route_query=?,";
    args.push(route_query.into());
  }
  // 首页隐藏
  if let Some(is_home_hide) = input.is_home_hide {
    field_num += 1;
    sql_fields += "is_home_hide=?,";
    args.push(is_home_hide.into());
  }
  // 动态页面
  if let Some(is_dyn_page) = input.is_dyn_page {
    field_num += 1;
    sql_fields += "is_dyn_page=?,";
    args.push(is_dyn_page.into());
  }
  // 启用
  if let Some(is_enabled) = input.is_enabled {
    field_num += 1;
    sql_fields += "is_enabled=?,";
    args.push(is_enabled.into());
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
    sql_fields += "rem=?,";
    args.push(rem.into());
  }
  // 隐藏记录
  if let Some(is_hidden) = input.is_hidden {
    field_num += 1;
    sql_fields += "is_hidden=?,";
    args.push(is_hidden.into());
  }
  
  if field_num > 0 {
    if !is_silent_mode && !is_creating {
      if input.update_usr_id.is_none() {
        let mut usr_id = get_auth_id();
        let mut usr_id_lbl = String::new();
        if usr_id.is_some() {
          let usr_model = find_by_id_usr(
            usr_id.unwrap(),
            options.clone(),
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
      } else if !input.update_usr_id.unwrap().is_empty() {
        let mut usr_id = input.update_usr_id;
        let mut usr_id_lbl = String::new();
        if usr_id.is_some() {
          let usr_model = find_by_id_usr(
            usr_id.unwrap(),
            options.clone(),
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
      if input.update_usr_id.is_some() && !input.update_usr_id.unwrap().is_empty() {
        let usr_id = input.update_usr_id;
        if let Some(usr_id) = usr_id {
          sql_fields += "update_usr_id=?,";
          args.push(usr_id.into());
        }
      }
      if let Some(update_usr_id_lbl) = input.update_usr_id_lbl {
        sql_fields += "update_usr_id=?,";
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
    
    let options = Options::from(options.clone());
    
    let options = options.set_del_cache_key1s(get_cache_tables());
    
    let options = Some(options);
    
    del_caches(
      vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
    ).await?;
    
    execute(
      sql,
      args,
      options.clone(),
    ).await?;
    
    del_caches(
      vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
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
  let table = get_table_name_menu();
  vec![
    table,
    "base_menu",
  ]
}

// MARK: del_cache_menu
/// 清空缓存
#[allow(dead_code)]
pub async fn del_cache_menu() -> Result<()> {
  
  let cache_key1s = get_cache_tables();
  
  let cache_key1s = cache_key1s
    .into_iter()
    .map(|x|
      format!("dao.sql.{x}")
    )
    .chain(vec!["dao.sql.base_menu._getMenus".to_owned()])
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

// MARK: delete_by_ids_menu
/// 根据 ids 删除菜单
#[allow(unused_variables)]
pub async fn delete_by_ids_menu(
  ids: Vec<MenuId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_menu();
  let method = "delete_by_ids_menu";
  
  let is_debug = get_is_debug(options.as_ref());
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  let is_creating = get_is_creating(options.as_ref());
  
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
  
  del_caches(
    vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
  ).await?;
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let mut num = 0;
  for id in ids.clone() {
    
    let old_model = find_by_id_menu(
      id,
      options.clone(),
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
    
    let mut sql_fields = String::with_capacity(30);
    sql_fields.push_str("is_deleted=1,");
    let mut usr_id = get_auth_id();
    let mut usr_lbl = String::new();
    if usr_id.is_some() {
      let usr_model = find_by_id_usr(
        usr_id.unwrap(),
        options.clone(),
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
    
    let options = Options::from(options.clone());
    
    let options = options.set_del_cache_key1s(get_cache_tables());
    
    let options = Some(options);
    
    num += execute(
      sql,
      args,
      options.clone(),
    ).await?;
    {
      let mut args = QueryArgs::new();
      let sql = "update base_role_menu set is_deleted=1 where menu_id=? and is_deleted=0".to_owned();
      args.push(id.into());
      let args: Vec<_> = args.into();
      execute(
        sql,
        args,
        options.clone(),
      ).await?;
    }
    {
      let mut args = QueryArgs::new();
      let sql = "update base_tenant_menu set is_deleted=1 where menu_id=? and is_deleted=0".to_owned();
      args.push(id.into());
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
  
  del_caches(
    vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
  ).await?;
  
  Ok(num)
}

// MARK: get_is_enabled_by_id_menu
/// 根据 id 查找菜单是否已启用
/// 记录不存在则返回 false
pub async fn get_is_enabled_by_id_menu(
  id: MenuId,
  options: Option<Options>,
) -> Result<bool> {
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let model = find_by_id_menu(
    id,
    options,
  ).await?;
  
  let is_enabled = {
    if let Some(model) = model {
      model.is_enabled == 1
    } else {
      false
    }
  };
  
  Ok(is_enabled)
}

// MARK: enable_by_ids_menu
/// 根据 ids 启用或者禁用菜单
pub async fn enable_by_ids_menu(
  ids: Vec<MenuId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_menu();
  let method = "enable_by_ids_menu";
  
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
  
  if ids.is_empty() {
    return Ok(0);
  }
  
  del_caches(
    vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
  ).await?;
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  
  let options = options.set_del_cache_key1s(get_cache_tables());
  
  let mut num = 0;
  for id in ids {
    let mut args = QueryArgs::new();
    
    let sql = format!("update {table} set is_enabled=? where id=? limit 1");
    
    args.push(is_enabled.into());
    args.push(id.into());
    
    let args: Vec<_> = args.into();
    
    let options = options.clone().into();
    
    num += execute(
      sql,
      args,
      options,
    ).await?;
  }
  
  del_caches(
    vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
  ).await?;
  
  Ok(num)
}

// MARK: revert_by_ids_menu
/// 根据 ids 还原菜单
pub async fn revert_by_ids_menu(
  ids: Vec<MenuId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_menu();
  let method = "revert_by_ids_menu";
  
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
  
  del_caches(
    vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
  ).await?;
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = options.set_del_cache_key1s(get_cache_tables());
  let options = Some(options);
  
  let mut num = 0;
  for id in ids.clone() {
    let mut args = QueryArgs::new();
    
    let sql = format!("update {table} set is_deleted=0 where id=? limit 1");
    
    args.push(id.into());
    
    let args: Vec<_> = args.into();
    
    let mut old_model = find_one_menu(
      MenuSearch {
        id: Some(id),
        is_deleted: Some(1),
        ..Default::default()
      }.into(),
      None,
      options.clone(),
    ).await?;
    
    if old_model.is_none() {
      old_model = find_by_id_menu(
        id,
        options.clone(),
      ).await?;
    }
    
    let old_model = match old_model {
      Some(model) => model,
      None => continue,
    };
    
    {
      let mut input: MenuInput = old_model.clone().into();
      input.id = None;
      
      let models = find_by_unique_menu(
        input.into(),
        None,
        options.clone(),
      ).await?;
      
      let models: Vec<MenuModel> = models
        .into_iter()
        .filter(|item| 
          item.id != id
        )
        .collect();
      
      if !models.is_empty() {
        let err_msg = "菜单 重复";
        return Err(eyre!(err_msg));
      }
    }
    
    num += execute(
      sql,
      args,
      options.clone(),
    ).await?;
    
  }
  
  del_caches(
    vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
  ).await?;
  
  Ok(num)
}

// MARK: force_delete_by_ids_menu
/// 根据 ids 彻底删除菜单
#[allow(unused_variables)]
pub async fn force_delete_by_ids_menu(
  ids: Vec<MenuId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_menu();
  let method = "force_delete_by_ids_menu";
  
  let is_debug = get_is_debug(options.as_ref());
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  
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
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let mut num = 0;
  for id in ids.clone() {
    
    let old_model = find_one_menu(
      Some(MenuSearch {
        id: Some(id),
        is_deleted: Some(1),
        ..Default::default()
      }),
      None,
      options.clone(),
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
    
    let options = Options::from(options.clone());
    
    let options = options.set_del_cache_key1s(get_cache_tables());
    
    let options = Some(options);
    
    del_caches(
      vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
    ).await?;
    
    num += execute(
      sql,
      args,
      options.clone(),
    ).await?;
    {
      let mut args = QueryArgs::new();
      let sql = "delete from base_role_menu where menu_id=?".to_owned();
      args.push(id.into());
      let args: Vec<_> = args.into();
      execute(
        sql,
        args,
        options.clone(),
      ).await?;
    }
    {
      let mut args = QueryArgs::new();
      let sql = "delete from base_tenant_menu where menu_id=?".to_owned();
      args.push(id.into());
      let args: Vec<_> = args.into();
      execute(
        sql,
        args,
        options.clone(),
      ).await?;
    }
    
    del_caches(
      vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
    ).await?;
  }
  
  Ok(num)
}

// MARK: find_last_order_by_menu
/// 查找 菜单 order_by 字段的最大值
pub async fn find_last_order_by_menu(
  search: Option<MenuSearch>,
  options: Option<Options>,
) -> Result<u32> {
  
  let table = get_table_name_menu();
  let method = "find_last_order_by_menu";
  
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

// MARK: validate_is_enabled_menu
/// 校验菜单是否启用
#[allow(dead_code)]
pub async fn validate_is_enabled_menu(
  model: &MenuModel,
) -> Result<()> {
  if model.is_enabled == 0 {
    let err_msg = "菜单已禁用";
    return Err(eyre!(err_msg));
  }
  Ok(())
}

// MARK: validate_option_menu
/// 校验菜单是否存在
#[allow(dead_code)]
pub async fn validate_option_menu(
  model: Option<MenuModel>,
) -> Result<MenuModel> {
  
  let model = match model {
    Some(model) => model,
    None => {
      let err_msg = "菜单不存在";
      error!(
        "{req_id} {err_msg}",
        req_id = get_req_id(),
      );
      return Err(eyre!(
        ServiceException {
          message: err_msg.to_owned(),
          trace: true,
          ..Default::default()
        },
      ));
    },
  };
  
  Ok(model)
}
