
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

use super::dyn_page_model::*;

// 动态页面字段
use crate::base::dyn_page_field::dyn_page_field_dao::{
  find_all_dyn_page_field,
  create_dyn_page_field,
  delete_by_ids_dyn_page_field,
  revert_by_ids_dyn_page_field,
  update_by_id_dyn_page_field,
  force_delete_by_ids_dyn_page_field,
};

// 动态页面字段
use crate::base::dyn_page_field::dyn_page_field_model::*;

use crate::base::tenant::tenant_model::TenantId;
use crate::base::usr::usr_model::UsrId;

use crate::base::usr::usr_dao::find_by_id_usr;

use crate::base::menu::menu_dao::{
  find_one_menu,
  create_menu,
  update_by_id_menu,
  delete_by_ids_menu,
  revert_by_ids_menu,
};

use crate::base::menu::menu_model::{
  MenuId,
  MenuInput,
  MenuSearch,
};

use crate::base::role::role_dao::{
  find_all_role,
  find_by_ids_role,
  update_by_id_role,
};

use crate::base::role::role_model::{
  RoleId,
  RoleSearch,
  RoleInput,
};

#[allow(unused_variables)]
async fn get_where_query(
  args: &mut QueryArgs,
  search: Option<&DynPageSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let is_deleted = search
    .and_then(|item| item.is_deleted)
    .unwrap_or(0);
  
  let mut where_query = String::with_capacity(80 * 15 * 2);
  
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
    let ids: Option<Vec<DynPageId>> = match search {
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
  // 编码-序列号
  {
    let mut code_seq = match search {
      Some(item) => item.code_seq.unwrap_or_default(),
      None => Default::default(),
    };
    let code_seq_gt = code_seq[0].take();
    let code_seq_lt = code_seq[1].take();
    if let Some(code_seq_gt) = code_seq_gt {
      where_query.push_str(" and t.code_seq >= ?");
      args.push(code_seq_gt.into());
    }
    if let Some(code_seq_lt) = code_seq_lt {
      where_query.push_str(" and t.code_seq <= ?");
      args.push(code_seq_lt.into());
    }
  }
  // 路由
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
    if let Some(code_like) = code_like && !code_like.is_empty() {
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
  Ok(where_query)
}

#[allow(unused_variables)]
async fn get_from_query(
  args: &mut QueryArgs,
  search: Option<&DynPageSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let from_query = r#"base_dyn_page t"#.to_owned();
  Ok(from_query)
}

// MARK: find_all_dyn_page
/// 根据搜索条件和分页查找动态页面列表
#[allow(unused_mut)]
pub async fn find_all_dyn_page(
  search: Option<DynPageSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<DynPageModel>> {
  
  let table = get_table_name_dyn_page();
  let method = "find_all_dyn_page";
  
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
  // 启用
  if let Some(search) = &search && search.is_enabled.is_some() {
    let len = search.is_enabled.as_ref().unwrap().len();
    if len == 0 {
      return Ok(vec![]);
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
      return Ok(vec![]);
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
      return Ok(vec![]);
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
  let page_query = get_page_query(page);
  
  let sql = format!(r#"select f.* from (select t.*
  from {from_query} where {where_query} group by t.id{order_by_query}) f {page_query}"#);
  
  let args = args.into();
  
  let options = Options::from(options);
  
  let options = options.set_cache_key(table, &sql, &args);
  
  let mut res: Vec<DynPageModel> = query(
    sql,
    args,
    Some(options.clone()),
  ).await?;
  
  let dict_vec = get_dict(&[
    "is_enabled",
  ]).await?;
  let [
    is_enabled_dict,
  ]: [Vec<_>; 1] = dict_vec
    .try_into()
    .map_err(|err| eyre!("{:#?}", err))?;
  
  // 动态页面字段
  let dyn_page_field_models = find_all_dyn_page_field(
    DynPageFieldSearch {
      dyn_page_id: res
        .iter()
        .map(|item| item.id)
        .collect::<Vec<DynPageId>>()
        .into(),
      is_deleted,
      ..Default::default()
    }.into(),
    None,
    None,
    None,
  ).await?;
  
  #[allow(unused_variables)]
  for model in &mut res {
    
    // 根据路由获取菜单及其角色列表
    {
      let menu_model = find_one_menu(
        Some(MenuSearch {
          route_path: Some(model.code.clone()),
          is_deleted: search.as_ref().and_then(|s| s.is_deleted),
          ..Default::default()
        }),
        None,
        Some(options.clone()),
      ).await?;
      
      if let Some(menu_model) = menu_model {
        // 获取父菜单ID
        model.parent_menu_id = menu_model.parent_id;
        model.parent_menu_id_lbl = menu_model.parent_id_lbl.clone();
        
        // 获取拥有此菜单权限的角色列表
        let role_models = find_all_role(
          Some(RoleSearch {
            menu_ids: Some(vec![menu_model.id.clone()]),
            is_deleted: search.as_ref().and_then(|s| s.is_deleted),
            ..Default::default()
          }),
          None,
          None,
          Some(options.clone()),
        ).await?;
        
        model.role_ids = role_models.iter().map(|item| item.id.clone()).collect();
        model.role_ids_lbl = role_models.iter().map(|item| item.lbl.clone()).collect();
      }
    }
    
    // 启用
    model.is_enabled_lbl = {
      is_enabled_dict
        .iter()
        .find(|item| item.val == model.is_enabled.to_string())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.is_enabled.to_string())
    };
    
    // 动态页面字段
    model.dyn_page_field = dyn_page_field_models
      .iter()
      .filter(|item|
        item.dyn_page_id == model.id
      )
      .cloned()
      .collect::<Vec<_>>();
    
  }
  
  Ok(res)
}

// MARK: find_count_dyn_page
/// 根据条件查找动态页面总数
pub async fn find_count_dyn_page(
  search: Option<DynPageSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_dyn_page();
  let method = "find_count_dyn_page";
  
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

// MARK: get_field_comments_dyn_page
/// 获取动态页面字段注释
#[allow(unused_mut)]
pub async fn get_field_comments_dyn_page(
  _options: Option<Options>,
) -> Result<DynPageFieldComment> {
  
  let mut field_comments = DynPageFieldComment {
    id: "ID".into(),
    code: "路由".into(),
    lbl: "名称".into(),
    parent_menu_id: "父菜单".into(),
    parent_menu_id_lbl: "父菜单".into(),
    role_ids: "所属角色".into(),
    role_ids_lbl: "所属角色".into(),
    order_by: "排序".into(),
    is_enabled: "启用".into(),
    is_enabled_lbl: "启用".into(),
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

// MARK: find_one_ok_dyn_page
/// 根据条件查找第一个动态页面, 如果不存在则抛错
#[allow(dead_code)]
pub async fn find_one_ok_dyn_page(
  search: Option<DynPageSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<DynPageModel> {
  
  let table = get_table_name_dyn_page();
  let method = "find_one_ok_dyn_page";
  
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
  
  let dyn_page_model = find_one_dyn_page(
    search,
    sort,
    options,
  ).await?;
  
  let Some(dyn_page_model) = dyn_page_model else {
    let err_msg = "此 动态页面 已被删除";
    return Err(eyre!(err_msg));
  };
  
  Ok(dyn_page_model)
}

// MARK: find_one_dyn_page
/// 根据条件查找第一个动态页面
#[allow(dead_code)]
pub async fn find_one_dyn_page(
  search: Option<DynPageSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<DynPageModel>> {
  
  let table = get_table_name_dyn_page();
  let method = "find_one_dyn_page";
  
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
  
  let page = PageInput {
    pg_offset: 0.into(),
    pg_size: 1.into(),
  }.into();
  
  let res = find_all_dyn_page(
    search,
    page,
    sort,
    options,
  ).await?;
  
  let model: Option<DynPageModel> = res.into_iter().next();
  
  Ok(model)
}

// MARK: find_by_id_ok_dyn_page
/// 根据 id 查找动态页面, 如果不存在则抛错
#[allow(dead_code)]
pub async fn find_by_id_ok_dyn_page(
  id: DynPageId,
  options: Option<Options>,
) -> Result<DynPageModel> {
  
  let table = get_table_name_dyn_page();
  let method = "find_by_id_ok_dyn_page";
  
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
  
  let dyn_page_model = find_by_id_dyn_page(
    id,
    options,
  ).await?;
  
  let Some(dyn_page_model) = dyn_page_model else {
    let err_msg = "此 动态页面 已被删除";
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
  
  Ok(dyn_page_model)
}

// MARK: find_by_id_dyn_page
/// 根据 id 查找动态页面
pub async fn find_by_id_dyn_page(
  id: DynPageId,
  options: Option<Options>,
) -> Result<Option<DynPageModel>> {
  
  let table = get_table_name_dyn_page();
  let method = "find_by_id_dyn_page";
  
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
  
  let search = DynPageSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let dyn_page_model = find_one_dyn_page(
    search,
    None,
    options,
  ).await?;
  
  Ok(dyn_page_model)
}

// MARK: find_by_ids_ok_dyn_page
/// 根据 ids 查找动态页面, 出现查询不到的 id 则报错
#[allow(dead_code)]
pub async fn find_by_ids_ok_dyn_page(
  ids: Vec<DynPageId>,
  options: Option<Options>,
) -> Result<Vec<DynPageModel>> {
  
  let table = get_table_name_dyn_page();
  let method = "find_by_ids_ok_dyn_page";
  
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
  
  let dyn_page_models = find_by_ids_dyn_page(
    ids.clone(),
    options,
  ).await?;
  
  if dyn_page_models.len() != len {
    let err_msg = "此 动态页面 已被删除";
    return Err(eyre!(err_msg));
  }
  
  let dyn_page_models = ids
    .into_iter()
    .map(|id| {
      let model = dyn_page_models
        .iter()
        .find(|item| item.id == id);
      if let Some(model) = model {
        return Ok(model.clone());
      }
      let err_msg = "此 动态页面 已经被删除";
      Err(eyre!(err_msg))
    })
    .collect::<Result<Vec<DynPageModel>>>()?;
  
  Ok(dyn_page_models)
}

// MARK: find_by_ids_dyn_page
/// 根据 ids 查找动态页面
#[allow(dead_code)]
pub async fn find_by_ids_dyn_page(
  ids: Vec<DynPageId>,
  options: Option<Options>,
) -> Result<Vec<DynPageModel>> {
  
  let table = get_table_name_dyn_page();
  let method = "find_by_ids_dyn_page";
  
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
  
  let search = DynPageSearch {
    ids: Some(ids.clone()),
    ..Default::default()
  }.into();
  
  let dyn_page_models = find_all_dyn_page(
    search,
    None,
    None,
    options,
  ).await?;
  
  let dyn_page_models = ids
    .into_iter()
    .filter_map(|id| {
      dyn_page_models
        .iter()
        .find(|item| item.id == id)
        .cloned()
    })
    .collect::<Vec<DynPageModel>>();
  
  Ok(dyn_page_models)
}

// MARK: exists_dyn_page
/// 根据搜索条件判断动态页面是否存在
#[allow(dead_code)]
pub async fn exists_dyn_page(
  search: Option<DynPageSearch>,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = get_table_name_dyn_page();
  let method = "exists_dyn_page";
  
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

// MARK: exists_by_id_dyn_page
/// 根据 id 判断动态页面是否存在
#[allow(dead_code)]
pub async fn exists_by_id_dyn_page(
  id: DynPageId,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = get_table_name_dyn_page();
  let method = "exists_by_id_dyn_page";
  
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
  
  let search = DynPageSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let exists = exists_dyn_page(
    search,
    options,
  ).await?;
  
  Ok(exists)
}

// MARK: find_by_unique_dyn_page
/// 通过唯一约束获得数据列表
#[allow(unused_variables)]
pub async fn find_by_unique_dyn_page(
  search: DynPageSearch,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<DynPageModel>> {
  
  let table = get_table_name_dyn_page();
  let method = "find_by_unique_dyn_page";
  
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
    let model = find_by_id_dyn_page(
      id,
      options.clone(),
    ).await?;
    return Ok(model.map_or_else(Vec::new, |m| vec![m]));
  }
  
  let mut models: Vec<DynPageModel> = vec![];
  
  let mut models_tmp = {
    if
      search.lbl.is_none()
    {
      return Ok(vec![]);
    }
    
    let search = DynPageSearch {
      lbl: search.lbl.clone(),
      ..Default::default()
    };
    
    find_all_dyn_page(
      search.into(),
      None,
      sort.clone(),
      options.clone(),
    ).await?
  };
  models.append(&mut models_tmp);
  
  let mut models_tmp = {
    if
      search.code.is_none()
    {
      return Ok(vec![]);
    }
    
    let search = DynPageSearch {
      code: search.code.clone(),
      ..Default::default()
    };
    
    find_all_dyn_page(
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
  input: &DynPageInput,
  model: &DynPageModel,
) -> bool {
  if input.id.as_ref().is_some() {
    return input.id.as_ref().unwrap() == &model.id;
  }
  
  if
    input.lbl.as_ref().is_some() && input.lbl.as_ref().unwrap() == &model.lbl
  {
    return true;
  }
  
  if
    input.code.as_ref().is_some() && input.code.as_ref().unwrap() == &model.code
  {
    return true;
  }
  false
}

// MARK: check_by_unique_dyn_page
/// 通过唯一约束检查数据是否已经存在
#[allow(unused_variables)]
pub async fn check_by_unique_dyn_page(
  input: DynPageInput,
  model: DynPageModel,
  options: Option<Options>,
) -> Result<Option<DynPageId>> {
  
  let table = get_table_name_dyn_page();
  let method = "check_by_unique_dyn_page";
  
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
    let id = update_by_id_dyn_page(
      model.id,
      input,
      options,
    ).await?;
    return Ok(id.into());
  }
  if unique_type == UniqueType::Throw {
    let err_msg = "动态页面 重复";
    return Err(eyre!(err_msg));
  }
  Ok(None)
}

// MARK: set_id_by_lbl_dyn_page
/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(unused_variables, dead_code)]
pub async fn set_id_by_lbl_dyn_page(
  input: DynPageInput,
) -> Result<DynPageInput> {
  
  #[allow(unused_mut)]
  let mut input = input;
  
  let dict_vec = get_dict(&[
    "is_enabled",
  ]).await?;
  
  // 启用
  if input.is_enabled.is_none() {
    let is_enabled_dict = &dict_vec[0];
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
  
  // 启用
  if
    input.is_enabled_lbl.is_some() && !input.is_enabled_lbl.as_ref().unwrap().is_empty()
    && input.is_enabled.is_none()
  {
    let is_enabled_dict = &dict_vec[0];
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
    let is_enabled_dict = &dict_vec[0];
    let dict_model = is_enabled_dict.iter().find(|item| {
      item.val == input.is_enabled.unwrap_or_default().to_string()
    });
    let lbl = dict_model.map(|item| item.lbl.to_string());
    input.is_enabled_lbl = lbl;
  }
  
  Ok(input)
}

// MARK: creates_return_dyn_page
/// 批量创建动态页面并返回
#[allow(dead_code)]
pub async fn creates_return_dyn_page(
  inputs: Vec<DynPageInput>,
  options: Option<Options>,
) -> Result<Vec<DynPageModel>> {
  
  let table = get_table_name_dyn_page();
  let method = "creates_return_dyn_page";
  
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
  
  let models_dyn_page = find_by_ids_dyn_page(
    ids,
    options,
  ).await?;
  
  Ok(models_dyn_page)
}

// MARK: creates_dyn_page
/// 批量创建动态页面
pub async fn creates_dyn_page(
  inputs: Vec<DynPageInput>,
  options: Option<Options>,
) -> Result<Vec<DynPageId>> {
  
  let table = get_table_name_dyn_page();
  let method = "creates_dyn_page";
  
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

/// 批量创建动态页面
#[allow(unused_variables, clippy::redundant_locals)]
async fn _creates(
  inputs: Vec<DynPageInput>,
  options: Option<Options>,
) -> Result<Vec<DynPageId>> {
  
  let table = get_table_name_dyn_page();
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  
  let unique_type = options.as_ref()
    .and_then(|item|
      item.get_unique_type()
    )
    .unwrap_or_default();
  
  // 设置自动编码
  let mut inputs = inputs;
  for input in &mut inputs {
    if input.code.is_some() && !input.code.as_ref().unwrap().is_empty() {
      continue;
    }
    let (
      code_seq,
      code,
    ) = find_auto_code_dyn_page(options.clone()).await?;
    input.code_seq = Some(code_seq);
    input.code = Some(code);
  }
  
  let mut ids2: Vec<DynPageId> = vec![];
  let mut inputs2: Vec<DynPageInput> = vec![];
  
  for input in inputs {
  
    if input.id.is_some() {
      return Err(eyre!("Can not set id when create in dao: {table}"));
    }
    
    let old_models = find_by_unique_dyn_page(
      input.clone().into(),
      None,
      options.clone(),
    ).await?;
    
    if !old_models.is_empty() {
      let mut id: Option<DynPageId> = None;
      
      for old_model in old_models {
        let options = Options::from(options.clone())
          .set_unique_type(unique_type);
        
        id = check_by_unique_dyn_page(
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
  let mut sql_fields = String::with_capacity(80 * 15 + 20);
  
  sql_fields += "id";
  sql_fields += ",create_time";
  sql_fields += ",update_time";
  sql_fields += ",create_usr_id";
  sql_fields += ",create_usr_id_lbl";
  sql_fields += ",update_usr_id";
  sql_fields += ",update_usr_id_lbl";
  sql_fields += ",tenant_id";
  // 编码-序列号
  sql_fields += ",code_seq";
  // 路由
  sql_fields += ",code";
  // 名称
  sql_fields += ",lbl";
  // 排序
  sql_fields += ",order_by";
  // 启用
  sql_fields += ",is_enabled";
  // 备注
  sql_fields += ",rem";
  
  let inputs2_len = inputs2.len();
  let mut sql_values = String::with_capacity((2 * 15 + 3) * inputs2_len);
  let mut inputs2_ids = vec![];
  
  for (i, input) in inputs2
    .clone()
    .into_iter()
    .enumerate()
  {
    
    let id: DynPageId = get_short_uuid().into();
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
    
    if let Some(tenant_id) = input.tenant_id {
      sql_values += ",?";
      args.push(tenant_id.into());
    } else if let Some(tenant_id) = get_auth_tenant_id() {
      sql_values += ",?";
      args.push(tenant_id.into());
    } else {
      sql_values += ",default";
    }
    // 编码-序列号
    if let Some(code_seq) = input.code_seq {
      sql_values += ",?";
      args.push(code_seq.into());
    } else {
      sql_values += ",default";
    }
    // 路由
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
    // 启用
    if let Some(is_enabled) = input.is_enabled {
      sql_values += ",?";
      args.push(is_enabled.into());
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
  
  for (i, input) in inputs2
    .clone()
    .into_iter()
    .enumerate()
  {
    let id = inputs2_ids.get(i).unwrap().clone();
    
    // 动态页面字段
    if let Some(dyn_page_field) = input.dyn_page_field {
      for mut model in dyn_page_field {
        model.dyn_page_id = Some(id);
        create_dyn_page_field(
          model,
          options.clone(),
        ).await?;
      }
    }
  }
  
  // 根据 code 路由查找菜单, 如果菜单不存在则创建菜单, 否则更新菜单名称
  for input in &inputs2 {
    let code = match input.code.clone() {
      Some(code) => code,
      None => continue,
    };
    let menu_model = find_one_menu(
      Some(MenuSearch {
        route_path: Some(code.clone()),
        ..Default::default()
      }),
      None,
      options.clone(),
    ).await?;
    let menu_id = if let Some(menu_model) = menu_model {
      // 更新菜单名称
      let menu_options = Options::from(options.clone())
        .set_is_creating(Some(true));
      update_by_id_menu(
        menu_model.id,
        MenuInput {
          parent_id: input.parent_menu_id,
          lbl: input.lbl.clone(),
          is_enabled: input.is_enabled,
          ..Default::default()
        },
        Some(menu_options),
      ).await?;
      menu_model.id
    } else {
      // 创建菜单
      create_menu(
        MenuInput {
          parent_id: input.parent_menu_id,
          route_path: Some(code.clone()),
          lbl: input.lbl.clone(),
          is_dyn_page: Some(1),
          is_enabled: input.is_enabled,
          ..Default::default()
        },
        options.clone(),
      ).await?
    };
    
    // 菜单所属角色
    let new_role_ids = input.role_ids.clone().unwrap_or_default();
    
    // 查找旧的角色列表(拥有此菜单的角色)
    let old_role_models = find_all_role(
      Some(RoleSearch {
        menu_ids: Some(vec![menu_id.clone()]),
        ..Default::default()
      }),
      None,
      None,
      options.clone(),
    ).await?;
    let old_role_ids: Vec<RoleId> = old_role_models.iter().map(|item| item.id.clone()).collect();
    
    // 找出需要删除此菜单的角色(在旧列表中但不在新列表中)
    let remove_role_ids: Vec<RoleId> = old_role_ids
      .iter()
      .filter(|role_id| !new_role_ids.contains(role_id))
      .cloned()
      .collect();
    for role_id in remove_role_ids {
      let role_model = old_role_models.iter().find(|item| item.id == role_id);
      if let Some(role_model) = role_model {
        let menu_ids: Vec<MenuId> = role_model.menu_ids
          .iter()
          .filter(|id| *id != &menu_id)
          .cloned()
          .collect();
        let role_options = Options::from(options.clone())
          .set_is_creating(Some(true));
        update_by_id_role(
          role_id,
          RoleInput {
            menu_ids: Some(menu_ids),
            ..Default::default()
          },
          Some(role_options),
        ).await?;
      }
    }
    
    // 找出需要添加此菜单的角色(在新列表中但不在旧列表中)
    let add_role_ids: Vec<RoleId> = new_role_ids
      .iter()
      .filter(|role_id| !old_role_ids.contains(role_id))
      .cloned()
      .collect();
    if !add_role_ids.is_empty() {
      let add_role_models = find_by_ids_role(
        add_role_ids,
        options.clone(),
      ).await?;
      for role_model in add_role_models {
        let role_id = role_model.id.clone();
        let mut menu_ids = role_model.menu_ids.clone();
        if menu_ids.contains(&menu_id) {
          continue;
        }
        menu_ids.push(menu_id.clone());
        let role_options = Options::from(options.clone())
          .set_is_creating(Some(true));
        update_by_id_role(
          role_id,
          RoleInput {
            menu_ids: Some(menu_ids),
            ..Default::default()
          },
          Some(role_options),
        ).await?;
      }
    }
  }
  
  Ok(ids2)
}

// MARK: find_auto_code_dyn_page
/// 获得 动态页面 自动编码
pub async fn find_auto_code_dyn_page(
  options: Option<Options>,
) -> Result<(u32, String)> {
  
  let table = get_table_name_dyn_page();
  let method = "find_auto_code_dyn_page";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let model = find_one_dyn_page(
    None,
    Some(vec![
      SortInput {
        prop: "code_seq".to_owned(),
        order: SortOrderEnum::Desc,
      },
    ]),
    options.clone(),
  ).await?;
  
  let code_seq = model
    .as_ref()
    .map_or(0, |item| item.code_seq) + 1;
  
  let model_deleted = find_one_dyn_page(
    Some(DynPageSearch {
      is_deleted: Some(1),
      ..Default::default()
    }),
    Some(vec![
      SortInput {
        prop: "code_seq".to_owned(),
        order: SortOrderEnum::Desc,
      },
    ]),
    options.clone(),
  ).await?;
  
  let code_seq_deleted = model_deleted
    .as_ref()
    .map_or(0, |item| item.code_seq) + 1;
  
  let code_seq = if code_seq_deleted > code_seq {
    code_seq_deleted
  } else {
    code_seq
  };
  
  let code = format!("/dyn/pg{code_seq:0}");
  
  Ok((code_seq, code))
}

// MARK: create_return_dyn_page
/// 创建动态页面并返回
#[allow(dead_code)]
pub async fn create_return_dyn_page(
  #[allow(unused_mut)]
  mut input: DynPageInput,
  options: Option<Options>,
) -> Result<DynPageModel> {
  
  let id = create_dyn_page(
    input.clone(),
    options.clone(),
  ).await?;
  
  let model_dyn_page = find_by_id_dyn_page(
    id,
    options,
  ).await?;
  
  let model_dyn_page = match model_dyn_page {
    Some(model) => model,
    None => {
      let err_msg = "create_return_dyn_page: model_dyn_page.is_none()";
      return Err(eyre!(
        ServiceException {
          message: err_msg.to_owned(),
          trace: true,
          ..Default::default()
        },
      ));
    }
  };
  
  Ok(model_dyn_page)
}

// MARK: create_dyn_page
/// 创建动态页面
#[allow(dead_code)]
pub async fn create_dyn_page(
  #[allow(unused_mut)]
  mut input: DynPageInput,
  options: Option<Options>,
) -> Result<DynPageId> {
  
  let table = get_table_name_dyn_page();
  let method = "create_dyn_page";
  
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

// MARK: update_tenant_by_id_dyn_page
/// 动态页面根据id修改租户id
pub async fn update_tenant_by_id_dyn_page(
  id: DynPageId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  let table = get_table_name_dyn_page();
  let method = "update_tenant_by_id_dyn_page";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" id: {:?}", &id);
    msg += &format!(" tenant_id: {:?}", &tenant_id);
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
  
  let mut args = QueryArgs::new();
  
  args.push(tenant_id.into());
  args.push(id.into());
  
  let sql = format!("update {table} set tenant_id=? where id=?");
  
  let args: Vec<_> = args.into();
  
  let num = execute(
    sql,
    args,
    Some(options.clone()),
  ).await?;
  
  Ok(num)
}

// MARK: update_by_id_dyn_page
/// 根据 id 修改动态页面
#[allow(unused_mut)]
#[allow(unused_variables)]
pub async fn update_by_id_dyn_page(
  id: DynPageId,
  mut input: DynPageInput,
  options: Option<Options>,
) -> Result<DynPageId> {
  
  let table = get_table_name_dyn_page();
  let method = "update_by_id_dyn_page";
  
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
  
  let old_model = find_by_id_dyn_page(
    id,
    options.clone(),
  ).await?;
  
  let old_model = match old_model {
    Some(model) => model,
    None => {
      let err_msg = "编辑失败, 此 动态页面 已被删除";
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
    
    let models = find_by_unique_dyn_page(
      input.into(),
      None,
      options.clone(),
    ).await?;
    
    let models = models.into_iter()
      .filter(|item| 
        item.id != id
      )
      .collect::<Vec<DynPageModel>>();
    
    if !models.is_empty() {
      let unique_type = options
        .as_ref()
        .and_then(|item| item.get_unique_type())
        .unwrap_or(UniqueType::Throw);
      if unique_type == UniqueType::Throw {
        let err_msg = "动态页面 重复";
        return Err(eyre!(err_msg));
      } else if unique_type == UniqueType::Ignore {
        return Ok(id);
      }
    }
  }
  
  let mut args = QueryArgs::new();
  
  let mut sql_fields = String::with_capacity(80 * 15 + 20);
  
  let mut field_num: usize = 0;
  
  if let Some(tenant_id) = input.tenant_id {
    field_num += 1;
    sql_fields += "tenant_id=?,";
    args.push(tenant_id.into());
  }
  // 编码-序列号
  if let Some(code_seq) = input.code_seq {
    field_num += 1;
    sql_fields += "code_seq=?,";
    args.push(code_seq.into());
  }
  // 路由
  if let Some(code) = input.code.clone() {
    field_num += 1;
    sql_fields += "code=?,";
    args.push(code.into());
  }
  // 名称
  if let Some(lbl) = input.lbl.clone() {
    field_num += 1;
    sql_fields += "lbl=?,";
    args.push(lbl.into());
  }
  // 排序
  if let Some(order_by) = input.order_by {
    field_num += 1;
    sql_fields += "order_by=?,";
    args.push(order_by.into());
  }
  // 启用
  if let Some(is_enabled) = input.is_enabled {
    field_num += 1;
    sql_fields += "is_enabled=?,";
    args.push(is_enabled.into());
  }
  // 备注
  if let Some(rem) = input.rem {
    field_num += 1;
    sql_fields += "rem=?,";
    args.push(rem.into());
  }
  
  // 动态页面字段
  if let Some(dyn_page_field_input) = input.dyn_page_field {
    let dyn_page_field_models = find_all_dyn_page_field(
      DynPageFieldSearch {
        dyn_page_id: vec![id].into(),
        is_deleted: 0.into(),
        ..Default::default()
      }.into(),
      None,
      None,
      options.clone(),
    ).await?;
    if !dyn_page_field_models.is_empty() && !dyn_page_field_input.is_empty() {
      field_num += 1;
    }
    for model in dyn_page_field_models.clone() {
      if dyn_page_field_input
        .iter()
        .filter(|item| item.id.is_some())
        .any(|item| item.id == Some(model.id))
      {
        continue;
      }
      delete_by_ids_dyn_page_field(
        vec![model.id],
        options.clone(),
      ).await?;
    }
    for mut input2 in dyn_page_field_input {
      if input2.id.is_none() {
        input2.dyn_page_id = Some(id);
        create_dyn_page_field(
          input2,
          options.clone(),
        ).await?;
        continue;
      }
      let id2 = input2.id.unwrap();
      if !dyn_page_field_models
        .iter()
        .any(|item| item.id == id2)
      {
        revert_by_ids_dyn_page_field(
          vec![id2.clone()],
          options.clone(),
        ).await?;
      }
      input2.id = None;
      input2.dyn_page_id = Some(id);
      update_by_id_dyn_page_field(
        id2.clone(),
        input2,
        options.clone(),
      ).await?;
    }
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
    
    execute(
      sql,
      args,
      options.clone(),
    ).await?;
    
  }
  
  if field_num > 0 {
    let options = Options::from(options.clone());
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
  
  // 根据 code 路由查找菜单, 如果菜单不存在则创建菜单, 否则更新菜单名称
  if input.code.is_some() {
    let code = input.code.as_ref().unwrap();
    let menu_model = find_one_menu(
      Some(MenuSearch {
        route_path: Some(code.clone()),
        ..Default::default()
      }),
      None,
      options.clone(),
    ).await?;
    let menu_id = if let Some(menu_model) = menu_model {
      // 更新菜单名称
      let menu_options = Options::from(options.clone())
        .set_is_creating(Some(true));
      update_by_id_menu(
        menu_model.id.clone(),
        MenuInput {
          parent_id: input.parent_menu_id,
          lbl: input.lbl.clone(),
          is_enabled: input.is_enabled,
          ..Default::default()
        },
        Some(menu_options),
      ).await?;
      menu_model.id
    } else {
      // 创建菜单
      create_menu(
        MenuInput {
          parent_id: input.parent_menu_id,
          route_path: Some(code.clone()),
          lbl: input.lbl.clone(),
          is_dyn_page: Some(1),
          is_enabled: input.is_enabled,
          ..Default::default()
        },
        options.clone(),
      ).await?
    };
    
    // 菜单所属角色
    let new_role_ids = input.role_ids.clone().unwrap_or_default();
    
    // 查找旧的角色列表(拥有此菜单的角色)
    let old_role_models = find_all_role(
      Some(RoleSearch {
        menu_ids: Some(vec![menu_id.clone()]),
        ..Default::default()
      }),
      None,
      None,
      options.clone(),
    ).await?;
    let old_role_ids: Vec<RoleId> = old_role_models.iter().map(|item| item.id.clone()).collect();
    
    // 找出需要删除此菜单的角色(在旧列表中但不在新列表中)
    let remove_role_ids: Vec<RoleId> = old_role_ids
      .iter()
      .filter(|role_id| !new_role_ids.contains(role_id))
      .cloned()
      .collect();
    for role_id in remove_role_ids {
      let role_model = old_role_models.iter().find(|item| item.id == role_id);
      if let Some(role_model) = role_model {
        let menu_ids: Vec<MenuId> = role_model.menu_ids
          .iter()
          .filter(|id| *id != &menu_id)
          .cloned()
          .collect();
        let role_options = Options::from(options.clone())
          .set_is_creating(Some(true));
        update_by_id_role(
          role_id,
          RoleInput {
            menu_ids: Some(menu_ids),
            ..Default::default()
          },
          Some(role_options),
        ).await?;
      }
    }
    
    // 找出需要添加此菜单的角色(在新列表中但不在旧列表中)
    let add_role_ids: Vec<RoleId> = new_role_ids
      .iter()
      .filter(|role_id| !old_role_ids.contains(role_id))
      .cloned()
      .collect();
    if !add_role_ids.is_empty() {
      let add_role_models = find_by_ids_role(
        add_role_ids,
        options.clone(),
      ).await?;
      for role_model in add_role_models {
        let role_id = role_model.id.clone();
        let mut menu_ids = role_model.menu_ids.clone();
        if menu_ids.contains(&menu_id) {
          continue;
        }
        menu_ids.push(menu_id.clone());
        let role_options = Options::from(options.clone())
          .set_is_creating(Some(true));
        update_by_id_role(
          role_id,
          RoleInput {
            menu_ids: Some(menu_ids),
            ..Default::default()
          },
          Some(role_options),
        ).await?;
      }
    }
  }
  
  Ok(id)
}

/// 获取需要清空缓存的表名
#[allow(dead_code)]
fn get_cache_tables() -> Vec<&'static str> {
  let table = get_table_name_dyn_page();
  vec![
    table,
  ]
}

// MARK: del_cache_dyn_page
/// 清空缓存
#[allow(dead_code)]
pub async fn del_cache_dyn_page() -> Result<()> {
  let cache_key1s = get_cache_tables();
  del_caches(
    cache_key1s.as_slice(),
  ).await?;
  Ok(())
}

// MARK: delete_by_ids_dyn_page
/// 根据 ids 删除动态页面
#[allow(unused_variables)]
pub async fn delete_by_ids_dyn_page(
  ids: Vec<DynPageId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_dyn_page();
  let method = "delete_by_ids_dyn_page";
  
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
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let mut num = 0;
  let mut menu_ids_to_delete: Vec<MenuId> = vec![];
  
  for id in ids.clone() {
    
    let old_model = find_by_id_dyn_page(
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
    
    // 检查是否需要级联删除菜单
    if !old_model.code.is_empty() {
      let code = &old_model.code;
      let menu_model = find_one_menu(
        Some(MenuSearch {
          route_path: Some(code.clone()),
          ..Default::default()
        }),
        None,
        options.clone(),
      ).await?;
      if let Some(menu_model) = menu_model {
        if menu_model.is_dyn_page == 1 {
          menu_ids_to_delete.push(menu_model.id);
        }
      }
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
  }
  
  if num > MAX_SAFE_INTEGER {
    return Err(eyre!("num: {} > MAX_SAFE_INTEGER", num));
  }
  
  // 动态页面字段
  let dyn_page_field_models = find_all_dyn_page_field(
    DynPageFieldSearch {
      dyn_page_id: ids.clone().into(),
      is_deleted: 0.into(),
      ..Default::default()
    }.into(),
    None,
    None,
    options.clone(),
  ).await?;
  
  delete_by_ids_dyn_page_field(
    dyn_page_field_models.into_iter()
      .map(|item| item.id)
      .collect::<Vec<DynPageFieldId>>(),
    options.clone(),
  ).await?;
  
  // 级联删除菜单
  if !menu_ids_to_delete.is_empty() {
    delete_by_ids_menu(
      menu_ids_to_delete,
      options.clone(),
    ).await?;
  }
  
  Ok(num)
}

// MARK: get_is_enabled_by_id_dyn_page
/// 根据 id 查找动态页面是否已启用
/// 记录不存在则返回 false
pub async fn get_is_enabled_by_id_dyn_page(
  id: DynPageId,
  options: Option<Options>,
) -> Result<bool> {
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let model = find_by_id_dyn_page(
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

// MARK: enable_by_ids_dyn_page
/// 根据 ids 启用或者禁用动态页面
pub async fn enable_by_ids_dyn_page(
  ids: Vec<DynPageId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_dyn_page();
  let method = "enable_by_ids_dyn_page";
  
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
  
  Ok(num)
}

// MARK: revert_by_ids_dyn_page
/// 根据 ids 还原动态页面
pub async fn revert_by_ids_dyn_page(
  ids: Vec<DynPageId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_dyn_page();
  let method = "revert_by_ids_dyn_page";
  
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
    .set_is_debug(Some(false));
  let options = options.set_del_cache_key1s(get_cache_tables());
  let options = Some(options);
  
  let mut num = 0;
  let mut menu_ids_to_revert: Vec<MenuId> = vec![];
  
  for id in ids.clone() {
    let mut args = QueryArgs::new();
    
    let sql = format!("update {table} set is_deleted=0 where id=? limit 1");
    
    args.push(id.into());
    
    let args: Vec<_> = args.into();
    
    let mut old_model = find_one_dyn_page(
      DynPageSearch {
        id: Some(id),
        is_deleted: Some(1),
        ..Default::default()
      }.into(),
      None,
      options.clone(),
    ).await?;
    
    if old_model.is_none() {
      old_model = find_by_id_dyn_page(
        id,
        options.clone(),
      ).await?;
    }
    
    let old_model = match old_model {
      Some(model) => model,
      None => continue,
    };
    
    {
      let mut input: DynPageInput = old_model.clone().into();
      input.id = None;
      
      let models = find_by_unique_dyn_page(
        input.into(),
        None,
        options.clone(),
      ).await?;
      
      let models: Vec<DynPageModel> = models
        .into_iter()
        .filter(|item| 
          item.id != id
        )
        .collect();
      
      if !models.is_empty() {
        let err_msg = "动态页面 重复";
        return Err(eyre!(err_msg));
      }
    }
    
    // 检查是否需要级联还原菜单
    if !old_model.code.is_empty() {
      let code = &old_model.code;
      let menu_model = find_one_menu(
        Some(MenuSearch {
          route_path: Some(code.clone()),
          is_deleted: Some(1),
          ..Default::default()
        }),
        None,
        options.clone(),
      ).await?;
      if let Some(menu_model) = menu_model {
        if menu_model.is_dyn_page == 1 {
          menu_ids_to_revert.push(menu_model.id);
        }
      }
    }
    
    num += execute(
      sql,
      args,
      options.clone(),
    ).await?;
    
  }
  
  // 动态页面字段
  let dyn_page_field_models = find_all_dyn_page_field(
    DynPageFieldSearch {
      dyn_page_id: ids.clone().into(),
      is_deleted: 1.into(),
      ..Default::default()
    }.into(),
    None,
    None,
    options.clone(),
  ).await?;
  
  revert_by_ids_dyn_page_field(
    dyn_page_field_models
      .into_iter()
      .map(|item| item.id)
      .collect::<Vec<DynPageFieldId>>(),
    options.clone(),
  ).await?;
  
  // 级联还原菜单
  if !menu_ids_to_revert.is_empty() {
    revert_by_ids_menu(
      menu_ids_to_revert,
      options.clone(),
    ).await?;
  }
  
  Ok(num)
}

// MARK: force_delete_by_ids_dyn_page
/// 根据 ids 彻底删除动态页面
#[allow(unused_variables)]
pub async fn force_delete_by_ids_dyn_page(
  ids: Vec<DynPageId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_dyn_page();
  let method = "force_delete_by_ids_dyn_page";
  
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
  let mut menu_ids_to_force_delete: Vec<MenuId> = vec![];
  
  for id in ids.clone() {
    
    let old_model = find_one_dyn_page(
      Some(DynPageSearch {
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
    
    // 检查是否需要级联彻底删除菜单
    if !old_model.code.is_empty() {
      let code = &old_model.code;
      let menu_model = find_one_menu(
        Some(MenuSearch {
          route_path: Some(code.clone()),
          is_deleted: Some(1),
          ..Default::default()
        }),
        None,
        options.clone(),
      ).await?;
      if let Some(menu_model) = menu_model {
        if menu_model.is_dyn_page == 1 {
          menu_ids_to_force_delete.push(menu_model.id);
        }
      }
    }
    
    let mut args = QueryArgs::new();
    
    let sql = format!("delete from {table} where id=? and is_deleted=1 limit 1");
    
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
  }
  
  // 动态页面字段
  let dyn_page_field_models = find_all_dyn_page_field(
    DynPageFieldSearch {
      dyn_page_id: ids.clone().into(),
      is_deleted: 0.into(),
      ..Default::default()
    }.into(),
    None,
    None,
    options.clone(),
  ).await?;
  
  force_delete_by_ids_dyn_page_field(
    dyn_page_field_models.into_iter()
      .map(|item| item.id)
      .collect::<Vec<DynPageFieldId>>(),
    options.clone(),
  ).await?;
  
  Ok(num)
}

// MARK: find_last_order_by_dyn_page
/// 查找 动态页面 order_by 字段的最大值
pub async fn find_last_order_by_dyn_page(
  options: Option<Options>,
) -> Result<u32> {
  
  let table = get_table_name_dyn_page();
  let method = "find_last_order_by_dyn_page";
  
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
  
  sql_wheres.push("t.is_deleted=0");
  
  if let Some(tenant_id) = get_auth_tenant_id() {
    sql_wheres.push("t.tenant_id=?");
    args.push(tenant_id.into());
  }
  
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

// MARK: validate_is_enabled_dyn_page
/// 校验动态页面是否启用
#[allow(dead_code)]
pub async fn validate_is_enabled_dyn_page(
  model: &DynPageModel,
) -> Result<()> {
  if model.is_enabled == 0 {
    let err_msg = "动态页面已禁用";
    return Err(eyre!(err_msg));
  }
  Ok(())
}

// MARK: validate_option_dyn_page
/// 校验动态页面是否存在
#[allow(dead_code)]
pub async fn validate_option_dyn_page(
  model: Option<DynPageModel>,
) -> Result<DynPageModel> {
  
  let model = match model {
    Some(model) => model,
    None => {
      let err_msg = "动态页面不存在";
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
