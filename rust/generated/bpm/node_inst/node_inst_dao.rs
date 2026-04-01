
#![allow(clippy::clone_on_copy)]
#![allow(clippy::redundant_clone)]
#![allow(clippy::collapsible_if)]

#[allow(unused_imports)]
use serde::{Serialize, Deserialize};
#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use std::collections::HashSet;

#[allow(unused_imports)]
use smol_str::SmolStr;

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
  get_find_all_result_limit,
  CountModel,
  UniqueType,
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

use super::node_inst_model::*;

use crate::base::tenant::tenant_model::TenantId;
use crate::bpm::process_inst::process_inst_model::ProcessInstId;
use crate::base::usr::usr_model::UsrId;

use crate::base::usr::usr_dao::find_by_id_usr;

#[allow(unused_variables)]
async fn get_where_query(
  args: &mut QueryArgs,
  search: Option<&NodeInstSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let is_deleted = search
    .and_then(|item| item.is_deleted)
    .unwrap_or(0);
  
  let mut where_query = String::with_capacity(80 * 12 * 2);
  
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
    let ids: Option<Vec<NodeInstId>> = match search {
      Some(item) => item.ids.clone(),
      None => None,
    };
    if let Some(ids) = ids {
      let arg = {
        if ids.is_empty() {
          SmolStr::new("null")
        } else {
          let mut items = Vec::with_capacity(ids.len());
          for id in ids {
            args.push(id.into());
            items.push("?");
          }
          SmolStr::new(items.join(","))
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
  // 流程实例
  {
    let process_inst_id: Option<Vec<ProcessInstId>> = match search {
      Some(item) => item.process_inst_id.clone(),
      None => None,
    };
    if let Some(process_inst_id) = process_inst_id {
      let arg = {
        if process_inst_id.is_empty() {
          SmolStr::new("null")
        } else {
          let mut items = Vec::with_capacity(process_inst_id.len());
          for item in process_inst_id {
            args.push(item.into());
            items.push("?");
          }
          SmolStr::new(items.join(","))
        }
      };
      where_query.push_str(" and t.process_inst_id in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let process_inst_id_is_null: bool = match search {
      Some(item) => item.process_inst_id_is_null.unwrap_or(false),
      None => false,
    };
    if process_inst_id_is_null {
      where_query.push_str(" and t.process_inst_id is null");
    }
  }
  {
    let process_inst_id_lbl: Option<Vec<SmolStr>> = match search {
      Some(item) => item.process_inst_id_lbl.clone(),
      None => None,
    };
    if let Some(process_inst_id_lbl) = process_inst_id_lbl {
      let arg = {
        if process_inst_id_lbl.is_empty() {
          SmolStr::new("null")
        } else {
          let mut items = Vec::with_capacity(process_inst_id_lbl.len());
          for item in process_inst_id_lbl {
            args.push(item.into());
            items.push("?");
          }
          SmolStr::new(items.join(","))
        }
      };
      where_query.push_str(" and t.process_inst_id_lbl in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
    {
      let process_inst_id_lbl_like = match search {
        Some(item) => item.process_inst_id_lbl_like.clone(),
        None => None,
      };
      if let Some(process_inst_id_lbl_like) = process_inst_id_lbl_like {
        if !process_inst_id_lbl_like.is_empty() {
          where_query.push_str(" and process_inst_id_lbl like ?");
          args.push(format!("%{}%", sql_like(&process_inst_id_lbl_like)).into());
        }
      }
    }
  }
  // 节点ID
  {
    let node_id = match search {
      Some(item) => item.node_id.clone(),
      None => None,
    };
    if let Some(node_id) = node_id {
      where_query.push_str(" and t.node_id=?");
      args.push(node_id.into());
    }
    let node_id_like = match search {
      Some(item) => item.node_id_like.clone(),
      None => None,
    };
    if let Some(node_id_like) = node_id_like && !node_id_like.is_empty() {
      where_query.push_str(" and t.node_id like ?");
      args.push(format!("%{}%", sql_like(&node_id_like)).into());
    }
  }
  // 节点类型
  {
    let node_type: Option<Vec<NodeInstNodeType>> = match search {
      Some(item) => item.node_type.clone(),
      None => None,
    };
    if let Some(node_type) = node_type {
      let arg = {
        if node_type.is_empty() {
          SmolStr::new("null")
        } else {
          let mut items = Vec::with_capacity(node_type.len());
          for item in node_type {
            args.push(item.into());
            items.push("?");
          }
          SmolStr::new(items.join(","))
        }
      };
      where_query.push_str(" and t.node_type in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  // 节点状态
  {
    let status: Option<Vec<NodeInstStatus>> = match search {
      Some(item) => item.status.clone(),
      None => None,
    };
    if let Some(status) = status {
      let arg = {
        if status.is_empty() {
          SmolStr::new("null")
        } else {
          let mut items = Vec::with_capacity(status.len());
          for item in status {
            args.push(item.into());
            items.push("?");
          }
          SmolStr::new(items.join(","))
        }
      };
      where_query.push_str(" and t.status in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  // 耗时(秒)
  {
    let mut duration_seconds = match search {
      Some(item) => item.duration_seconds.unwrap_or_default(),
      None => Default::default(),
    };
    let duration_seconds_gt = duration_seconds[0].take();
    let duration_seconds_lt = duration_seconds[1].take();
    if let Some(duration_seconds_gt) = duration_seconds_gt {
      where_query.push_str(" and t.duration_seconds >= ?");
      args.push(duration_seconds_gt.into());
    }
    if let Some(duration_seconds_lt) = duration_seconds_lt {
      where_query.push_str(" and t.duration_seconds <= ?");
      args.push(duration_seconds_lt.into());
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
          SmolStr::new("null")
        } else {
          let mut items = Vec::with_capacity(create_usr_id.len());
          for item in create_usr_id {
            args.push(item.into());
            items.push("?");
          }
          SmolStr::new(items.join(","))
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
    let create_usr_id_lbl: Option<Vec<SmolStr>> = match search {
      Some(item) => item.create_usr_id_lbl.clone(),
      None => None,
    };
    if let Some(create_usr_id_lbl) = create_usr_id_lbl {
      let arg = {
        if create_usr_id_lbl.is_empty() {
          SmolStr::new("null")
        } else {
          let mut items = Vec::with_capacity(create_usr_id_lbl.len());
          for item in create_usr_id_lbl {
            args.push(item.into());
            items.push("?");
          }
          SmolStr::new(items.join(","))
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
          SmolStr::new("null")
        } else {
          let mut items = Vec::with_capacity(update_usr_id.len());
          for item in update_usr_id {
            args.push(item.into());
            items.push("?");
          }
          SmolStr::new(items.join(","))
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
    let update_usr_id_lbl: Option<Vec<SmolStr>> = match search {
      Some(item) => item.update_usr_id_lbl.clone(),
      None => None,
    };
    if let Some(update_usr_id_lbl) = update_usr_id_lbl {
      let arg = {
        if update_usr_id_lbl.is_empty() {
          SmolStr::new("null")
        } else {
          let mut items = Vec::with_capacity(update_usr_id_lbl.len());
          for item in update_usr_id_lbl {
            args.push(item.into());
            items.push("?");
          }
          SmolStr::new(items.join(","))
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
  search: Option<&NodeInstSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let from_query = r#"bpm_node_inst t"#.to_owned();
  Ok(from_query)
}

// MARK: find_all_node_inst
/// 根据搜索条件和分页查找节点实例列表
#[allow(unused_mut, unused_variables)]
pub async fn find_all_node_inst(
  search: Option<NodeInstSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<NodeInstModel>> {
  
  let table = get_table_name_node_inst();
  let method = "find_all_node_inst";
  
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
  // 流程实例
  if let Some(search) = &search && let Some(process_inst_id) = &search.process_inst_id {
    let len = process_inst_id.len();
    if len == 0 {
      return Ok(vec![]);
    }
    if len > ids_limit {
      return Err(eyre!("search.process_inst_id.length > {ids_limit}"));
    }
  }
  // 节点类型
  if let Some(search) = &search && let Some(node_type) = &search.node_type {
    let len = node_type.len();
    if len == 0 {
      return Ok(vec![]);
    }
    if len > ids_limit {
      return Err(eyre!("search.node_type.length > {ids_limit}"));
    }
  }
  // 节点状态
  if let Some(search) = &search && let Some(status) = &search.status {
    let len = status.len();
    if len == 0 {
      return Ok(vec![]);
    }
    if len > ids_limit {
      return Err(eyre!("search.status.length > {ids_limit}"));
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
  
  if !sort.iter().any(|item| item.prop == "create_time") {
    sort.push(SortInput {
      prop: "create_time".into(),
      order: SortOrderEnum::Desc,
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
  
  let mut res: Vec<NodeInstModel> = query(
    sql,
    args,
    options,
  ).await?;
  
  let len = res.len();
  let result_limit_num = get_find_all_result_limit();
  
  if is_result_limit && len > result_limit_num {
    return Err(eyre!(
      ServiceException {
        message: format!("{table}.{method}: result length {len} > {result_limit_num}").into(),
        trace: true,
        ..Default::default()
      },
    ));
  }
  
  let dict_vec = get_dict(&[
    "bpm_node_type",
    "bpm_node_inst_status",
  ]).await?;
  let [
    node_type_dict,
    status_dict,
  ]: [Vec<_>; 2] = dict_vec
    .try_into()
    .map_err(|err| eyre!("{:#?}", err))?;
  
  #[allow(unused_variables)]
  for model in &mut res {
    
    // 节点类型
    model.node_type_lbl = {
      node_type_dict
        .iter()
        .find(|item| item.val == model.node_type.as_str())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.node_type.clone().into())
    };
    
    // 节点状态
    model.status_lbl = {
      status_dict
        .iter()
        .find(|item| item.val == model.status.as_str())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.status.clone().into())
    };
    
  }
  
  Ok(res)
}

// MARK: find_count_node_inst
/// 根据条件查找节点实例总数
pub async fn find_count_node_inst(
  search: Option<NodeInstSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_node_inst();
  let method = "find_count_node_inst";
  
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
  // 流程实例
  if let Some(search) = &search && search.process_inst_id.is_some() {
    let len = search.process_inst_id.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.process_inst_id.length > {ids_limit}"));
    }
  }
  // 节点类型
  if let Some(search) = &search && search.node_type.is_some() {
    let len = search.node_type.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.node_type.length > {ids_limit}"));
    }
  }
  // 节点状态
  if let Some(search) = &search && search.status.is_some() {
    let len = search.status.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.status.length > {ids_limit}"));
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
  
  if total > MAX_SAFE_INTEGER {
    return Err(eyre!("total > MAX_SAFE_INTEGER"));
  }
  
  Ok(total)
}

// MARK: get_field_comments_node_inst
/// 获取节点实例字段注释
#[allow(unused_mut)]
pub async fn get_field_comments_node_inst(
  _options: Option<Options>,
) -> Result<NodeInstFieldComment> {
  
  let mut field_comments = NodeInstFieldComment {
    id: "ID".into(),
    process_inst_id: "流程实例".into(),
    process_inst_id_lbl: "流程实例".into(),
    node_id: "节点ID".into(),
    node_type: "节点类型".into(),
    node_type_lbl: "节点类型".into(),
    status: "节点状态".into(),
    status_lbl: "节点状态".into(),
    duration_seconds: "耗时(秒)".into(),
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

// MARK: find_one_ok_node_inst
/// 根据条件查找第一个节点实例, 如果不存在则抛错
#[allow(dead_code)]
pub async fn find_one_ok_node_inst(
  search: Option<NodeInstSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<NodeInstModel> {
  
  let table = get_table_name_node_inst();
  let method = "find_one_ok_node_inst";
  
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
  
  let node_inst_model = find_one_node_inst(
    search,
    sort,
    options,
  ).await?;
  
  let Some(node_inst_model) = node_inst_model else {
    let err_msg = "此 节点实例 已被删除";
    return Err(eyre!(err_msg));
  };
  
  Ok(node_inst_model)
}

// MARK: find_one_node_inst
/// 根据条件查找第一个节点实例
#[allow(dead_code)]
pub async fn find_one_node_inst(
  search: Option<NodeInstSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<NodeInstModel>> {
  
  let table = get_table_name_node_inst();
  let method = "find_one_node_inst";
  
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
  
  let res = find_all_node_inst(
    search,
    page,
    sort,
    options,
  ).await?;
  
  let model: Option<NodeInstModel> = res.into_iter().next();
  
  Ok(model)
}

// MARK: find_by_id_ok_node_inst
/// 根据 id 查找节点实例, 如果不存在则抛错
#[allow(dead_code)]
pub async fn find_by_id_ok_node_inst(
  id: NodeInstId,
  options: Option<Options>,
) -> Result<NodeInstModel> {
  
  let table = get_table_name_node_inst();
  let method = "find_by_id_ok_node_inst";
  
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
  
  let node_inst_model = find_by_id_node_inst(
    id,
    options,
  ).await?;
  
  let Some(node_inst_model) = node_inst_model else {
    let err_msg = SmolStr::new("此 节点实例 已被删除");
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
  
  Ok(node_inst_model)
}

// MARK: find_by_id_node_inst
/// 根据 id 查找节点实例
pub async fn find_by_id_node_inst(
  id: NodeInstId,
  options: Option<Options>,
) -> Result<Option<NodeInstModel>> {
  
  let table = get_table_name_node_inst();
  let method = "find_by_id_node_inst";
  
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
  
  let search = NodeInstSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let node_inst_model = find_one_node_inst(
    search,
    None,
    options,
  ).await?;
  
  Ok(node_inst_model)
}

// MARK: find_by_ids_ok_node_inst
/// 根据 ids 查找节点实例, 出现查询不到的 id 则报错
#[allow(dead_code)]
pub async fn find_by_ids_ok_node_inst(
  ids: Vec<NodeInstId>,
  options: Option<Options>,
) -> Result<Vec<NodeInstModel>> {
  
  let table = get_table_name_node_inst();
  let method = "find_by_ids_ok_node_inst";
  
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
  
  let node_inst_models = find_by_ids_node_inst(
    ids.clone(),
    options,
  ).await?;
  
  if node_inst_models.len() != len {
    let err_msg = SmolStr::new("此 节点实例 已被删除");
    return Err(eyre!(err_msg));
  }
  
  let node_inst_models = ids
    .into_iter()
    .map(|id| {
      let model = node_inst_models
        .iter()
        .find(|item| item.id == id);
      if let Some(model) = model {
        return Ok(model.clone());
      }
      let err_msg = SmolStr::new("此 节点实例 已经被删除");
      Err(eyre!(err_msg))
    })
    .collect::<Result<Vec<NodeInstModel>>>()?;
  
  Ok(node_inst_models)
}

// MARK: find_by_ids_node_inst
/// 根据 ids 查找节点实例
#[allow(dead_code)]
pub async fn find_by_ids_node_inst(
  ids: Vec<NodeInstId>,
  options: Option<Options>,
) -> Result<Vec<NodeInstModel>> {
  
  let table = get_table_name_node_inst();
  let method = "find_by_ids_node_inst";
  
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
  
  let search = NodeInstSearch {
    ids: Some(ids.clone()),
    ..Default::default()
  }.into();
  
  let node_inst_models = find_all_node_inst(
    search,
    None,
    None,
    options,
  ).await?;
  
  let node_inst_models = ids
    .into_iter()
    .filter_map(|id| {
      node_inst_models
        .iter()
        .find(|item| item.id == id)
        .cloned()
    })
    .collect::<Vec<NodeInstModel>>();
  
  Ok(node_inst_models)
}

// MARK: exists_node_inst
/// 根据搜索条件判断节点实例是否存在
#[allow(dead_code)]
pub async fn exists_node_inst(
  search: Option<NodeInstSearch>,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = get_table_name_node_inst();
  let method = "exists_node_inst";
  
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
      return Ok(false);
    }
    if search.ids.is_some() && search.ids.as_ref().unwrap().is_empty() {
      return Ok(false);
    }
  }
  // 流程实例
  if let Some(search) = &search && search.process_inst_id.is_some() {
    let len = search.process_inst_id.as_ref().unwrap().len();
    if len == 0 {
      return Ok(false);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.process_inst_id.length > {ids_limit}"));
    }
  }
  // 节点类型
  if let Some(search) = &search && search.node_type.is_some() {
    let len = search.node_type.as_ref().unwrap().len();
    if len == 0 {
      return Ok(false);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.node_type.length > {ids_limit}"));
    }
  }
  // 节点状态
  if let Some(search) = &search && search.status.is_some() {
    let len = search.status.as_ref().unwrap().len();
    if len == 0 {
      return Ok(false);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.status.length > {ids_limit}"));
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
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
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

// MARK: exists_by_id_node_inst
/// 根据 id 判断节点实例是否存在
#[allow(dead_code)]
pub async fn exists_by_id_node_inst(
  id: NodeInstId,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = get_table_name_node_inst();
  let method = "exists_by_id_node_inst";
  
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
  
  let search = NodeInstSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let exists = exists_node_inst(
    search,
    options,
  ).await?;
  
  Ok(exists)
}

// MARK: find_by_unique_node_inst
/// 通过唯一约束获得数据列表
#[allow(unused_variables)]
pub async fn find_by_unique_node_inst(
  search: NodeInstSearch,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<NodeInstModel>> {
  
  let table = get_table_name_node_inst();
  let method = "find_by_unique_node_inst";
  
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
    let model = find_by_id_node_inst(
      id,
      options,
    ).await?;
    return Ok(model.map_or_else(Vec::new, |m| vec![m]));
  }
  
  Ok(vec![])
}

/// 根据唯一约束对比对象是否相等
#[allow(dead_code, unused_variables)]
pub fn equals_by_unique(
  input: &NodeInstInput,
  model: &NodeInstModel,
  options: Option<&Options>,
) -> bool {
  if input.id.as_ref().is_some() {
    return input.id.as_ref().unwrap() == &model.id;
  }
  
  let is_silent_mode = get_is_silent_mode(options);
  false
}

// MARK: check_by_unique_node_inst
/// 通过唯一约束检查数据是否已经存在
#[allow(unused_variables)]
pub async fn check_by_unique_node_inst(
  input: NodeInstInput,
  model: NodeInstModel,
  options: Option<Options>,
) -> Result<Option<NodeInstId>> {
  
  let table = get_table_name_node_inst();
  let method = "check_by_unique_node_inst";
  
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
    let id = update_by_id_node_inst(
      model.id,
      input,
      options,
    ).await?;
    return Ok(id.into());
  }
  if unique_type == UniqueType::Throw {
    let err_msg = "节点实例 重复";
    return Err(eyre!(err_msg));
  }
  Ok(None)
}

// MARK: set_id_by_lbl_node_inst
/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(unused_variables, dead_code)]
pub async fn set_id_by_lbl_node_inst(
  input: NodeInstInput,
) -> Result<NodeInstInput> {
  
  #[allow(unused_mut)]
  let mut input = input;
  
  let dict_vec = get_dict(&[
    "bpm_node_type",
    "bpm_node_inst_status",
  ]).await?;
  
  // 节点类型
  if input.node_type.is_none() {
    let node_type_dict = &dict_vec[0];
    if let Some(node_type_lbl) = input.node_type_lbl.clone() {
      input.node_type = node_type_dict
        .iter()
        .find(|item| {
          item.lbl == node_type_lbl
        })
        .map(|item| {
          item.val.parse().unwrap_or_default()
        });
    }
  }
  
  // 节点状态
  if input.status.is_none() {
    let status_dict = &dict_vec[1];
    if let Some(status_lbl) = input.status_lbl.clone() {
      input.status = status_dict
        .iter()
        .find(|item| {
          item.lbl == status_lbl
        })
        .map(|item| {
          item.val.parse().unwrap_or_default()
        });
    }
  }
  
  // 流程实例
  if input.process_inst_id_lbl.is_some()
    && !input.process_inst_id_lbl.as_ref().unwrap().is_empty()
    && input.process_inst_id.is_none()
  {
    input.process_inst_id_lbl = input.process_inst_id_lbl.map(|item| 
      SmolStr::new(item.trim())
    );
    let model = crate::bpm::process_inst::process_inst_dao::find_one_process_inst(
      crate::bpm::process_inst::process_inst_model::ProcessInstSearch {
        lbl: input.process_inst_id_lbl.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(model) = model {
      input.process_inst_id = model.id.into();
    }
  } else if
    (input.process_inst_id_lbl.is_none() || input.process_inst_id_lbl.as_ref().unwrap().is_empty())
    && input.process_inst_id.is_some()
  {
    let process_inst_model = crate::bpm::process_inst::process_inst_dao::find_one_process_inst(
      crate::bpm::process_inst::process_inst_model::ProcessInstSearch {
        id: input.process_inst_id.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(process_inst_model) = process_inst_model {
      input.process_inst_id_lbl = process_inst_model.lbl.into();
    }
  }
  
  // 节点类型
  if
    input.node_type_lbl.is_some() && !input.node_type_lbl.as_ref().unwrap().is_empty()
    && input.node_type.is_none()
  {
    let node_type_dict = &dict_vec[0];
    let dict_model = node_type_dict.iter().find(|item| {
      item.lbl == input.node_type_lbl.clone().unwrap_or_default()
    });
    let val = dict_model.map(|item| SmolStr::new(&item.val));
    if let Some(val) = val {
      input.node_type = val.parse::<NodeInstNodeType>()?.into();
    }
  } else if
    (input.node_type_lbl.is_none() || input.node_type_lbl.as_ref().unwrap().is_empty())
    && input.node_type.is_some()
  {
    let node_type_dict = &dict_vec[0];
    let dict_model = node_type_dict.iter().find(|item| {
      item.val == input.node_type.unwrap_or_default().to_string()
    });
    let lbl = dict_model.map(|item| SmolStr::new(&item.lbl));
    input.node_type_lbl = lbl;
  }
  
  // 节点状态
  if
    input.status_lbl.is_some() && !input.status_lbl.as_ref().unwrap().is_empty()
    && input.status.is_none()
  {
    let status_dict = &dict_vec[1];
    let dict_model = status_dict.iter().find(|item| {
      item.lbl == input.status_lbl.clone().unwrap_or_default()
    });
    let val = dict_model.map(|item| SmolStr::new(&item.val));
    if let Some(val) = val {
      input.status = val.parse::<NodeInstStatus>()?.into();
    }
  } else if
    (input.status_lbl.is_none() || input.status_lbl.as_ref().unwrap().is_empty())
    && input.status.is_some()
  {
    let status_dict = &dict_vec[1];
    let dict_model = status_dict.iter().find(|item| {
      item.val == input.status.unwrap_or_default().to_string()
    });
    let lbl = dict_model.map(|item| SmolStr::new(&item.lbl));
    input.status_lbl = lbl;
  }
  
  Ok(input)
}

// MARK: creates_return_node_inst
/// 批量创建节点实例并返回
#[allow(dead_code)]
pub async fn creates_return_node_inst(
  inputs: Vec<NodeInstInput>,
  options: Option<Options>,
) -> Result<Vec<NodeInstModel>> {
  
  let table = get_table_name_node_inst();
  let method = "creates_return_node_inst";
  
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
  
  let ids = _creates(
    inputs.clone(),
    options,
  ).await?;
  
  let models_node_inst = find_by_ids_node_inst(
    ids,
    options,
  ).await?;
  
  Ok(models_node_inst)
}

// MARK: creates_node_inst
/// 批量创建节点实例
pub async fn creates_node_inst(
  inputs: Vec<NodeInstInput>,
  options: Option<Options>,
) -> Result<Vec<NodeInstId>> {
  
  let table = get_table_name_node_inst();
  let method = "creates_node_inst";
  
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
  
  let ids = _creates(
    inputs,
    options,
  ).await?;
  
  Ok(ids)
}

/// 批量创建节点实例
#[allow(unused_variables, clippy::redundant_locals)]
async fn _creates(
  inputs: Vec<NodeInstInput>,
  options: Option<Options>,
) -> Result<Vec<NodeInstId>> {
  
  let table = get_table_name_node_inst();
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  
  let unique_type = options.as_ref()
    .and_then(|item|
      item.get_unique_type()
    )
    .unwrap_or_default();
  
  let mut ids2: Vec<NodeInstId> = vec![];
  let mut inputs2: Vec<NodeInstInput> = vec![];
  
  for input in inputs {
  
    if input.id.is_some() {
      return Err(eyre!("Can not set id when create in dao: {table}"));
    }
    
    let old_models = find_by_unique_node_inst(
      input.clone().into(),
      None,
      options,
    ).await?;
    
    if !old_models.is_empty() {
      let mut id: Option<NodeInstId> = None;
      
      for old_model in old_models {
        let options = Options::from(options)
          .set_unique_type(unique_type);
        
        id = check_by_unique_node_inst(
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
  let mut sql_fields = String::with_capacity(80 * 12 + 20);
  
  sql_fields += "id";
  sql_fields += ",create_time";
  sql_fields += ",update_time";
  sql_fields += ",create_usr_id";
  sql_fields += ",create_usr_id_lbl";
  sql_fields += ",update_usr_id";
  sql_fields += ",update_usr_id_lbl";
  sql_fields += ",tenant_id";
  // 流程实例
  sql_fields += ",process_inst_id_lbl";
  // 流程实例
  sql_fields += ",process_inst_id";
  // 节点ID
  sql_fields += ",node_id";
  // 节点类型
  sql_fields += ",node_type";
  // 节点状态
  sql_fields += ",status";
  // 耗时(秒)
  sql_fields += ",duration_seconds";
  
  let inputs2_len = inputs2.len();
  let mut sql_values = String::with_capacity((2 * 12 + 3) * inputs2_len);
  let mut inputs2_ids = vec![];
  
  for (i, input) in inputs2
    .clone()
    .into_iter()
    .enumerate()
  {
    
    let id: NodeInstId = get_short_uuid().into();
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
        let mut usr_lbl = SmolStr::new("");
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
        let mut usr_lbl = SmolStr::new("");
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
    // 流程实例
    if let Some(process_inst_id_lbl) = input.process_inst_id_lbl {
      if !process_inst_id_lbl.is_empty() {
        sql_values += ",?";
        args.push(process_inst_id_lbl.into());
      } else {
        sql_values += ",default";
      }
    } else {
      sql_values += ",default";
    }
    // 流程实例
    if let Some(process_inst_id) = input.process_inst_id {
      sql_values += ",?";
      args.push(process_inst_id.into());
    } else {
      sql_values += ",default";
    }
    // 节点ID
    if let Some(node_id) = input.node_id {
      sql_values += ",?";
      args.push(node_id.into());
    } else {
      sql_values += ",default";
    }
    // 节点类型
    if let Some(node_type) = input.node_type {
      sql_values += ",?";
      args.push(node_type.into());
    } else {
      sql_values += ",default";
    }
    // 节点状态
    if let Some(status) = input.status {
      sql_values += ",?";
      args.push(status.into());
    } else {
      sql_values += ",default";
    }
    // 耗时(秒)
    if let Some(duration_seconds) = input.duration_seconds {
      sql_values += ",?";
      args.push(duration_seconds.into());
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
  
  let affected_rows = execute(
    sql,
    args,
    options,
  ).await?;
  
  if affected_rows != inputs2_len as u64 {
    return Err(eyre!("affectedRows: {affected_rows} != {inputs2_len}"));
  }
  
  Ok(ids2)
}

// MARK: create_return_node_inst
/// 创建节点实例并返回
#[allow(dead_code)]
pub async fn create_return_node_inst(
  #[allow(unused_mut)]
  mut input: NodeInstInput,
  options: Option<Options>,
) -> Result<NodeInstModel> {
  
  let id = create_node_inst(
    input.clone(),
    options,
  ).await?;
  
  let model_node_inst = find_by_id_node_inst(
    id,
    options,
  ).await?;
  
  let model_node_inst = match model_node_inst {
    Some(model) => model,
    None => {
      let err_msg = "create_return_node_inst: model_node_inst.is_none()";
      return Err(eyre!(
        ServiceException {
          message: err_msg.into(),
          trace: true,
          ..Default::default()
        },
      ));
    }
  };
  
  Ok(model_node_inst)
}

// MARK: create_node_inst
/// 创建节点实例
#[allow(dead_code)]
pub async fn create_node_inst(
  #[allow(unused_mut)]
  mut input: NodeInstInput,
  options: Option<Options>,
) -> Result<NodeInstId> {
  
  let table = get_table_name_node_inst();
  let method = "create_node_inst";
  
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

// MARK: update_tenant_by_id_node_inst
/// 节点实例根据id修改租户id
pub async fn update_tenant_by_id_node_inst(
  id: NodeInstId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  let table = get_table_name_node_inst();
  let method = "update_tenant_by_id_node_inst";
  
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

// MARK: update_by_id_node_inst
/// 根据 id 修改节点实例
#[allow(unused_mut)]
#[allow(unused_variables)]
pub async fn update_by_id_node_inst(
  id: NodeInstId,
  mut input: NodeInstInput,
  options: Option<Options>,
) -> Result<NodeInstId> {
  
  let table = get_table_name_node_inst();
  let method = "update_by_id_node_inst";
  
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
  
  let old_model = find_by_id_node_inst(
    id,
    options,
  ).await?;
  
  let old_model = match old_model {
    Some(model) => model,
    None => {
      let err_msg = "编辑失败, 此 节点实例 已被删除";
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
    
    let models = find_by_unique_node_inst(
      input.into(),
      None,
      options,
    ).await?;
    
    let models = models.into_iter()
      .filter(|item| 
        item.id != id
      )
      .collect::<Vec<NodeInstModel>>();
    
    if !models.is_empty() {
      let unique_type = options
        .as_ref()
        .and_then(|item| item.get_unique_type())
        .unwrap_or(UniqueType::Throw);
      if unique_type == UniqueType::Throw {
        let err_msg = "节点实例 重复";
        return Err(eyre!(err_msg));
      } else if unique_type == UniqueType::Ignore {
        return Ok(id);
      }
    }
  }
  
  let mut args = QueryArgs::new();
  
  let mut sql_fields = String::with_capacity(80 * 12 + 20);
  
  let mut field_num: usize = 0;
  
  if let Some(tenant_id) = input.tenant_id {
    field_num += 1;
    sql_fields += "tenant_id=?,";
    args.push(tenant_id.into());
  }
  // 流程实例
  if let Some(process_inst_id_lbl) = input.process_inst_id_lbl {
    if !process_inst_id_lbl.is_empty() {
      field_num += 1;
      sql_fields += "process_inst_id_lbl=?,";
      args.push(process_inst_id_lbl.into());
    }
  }
  // 流程实例
  if let Some(process_inst_id) = input.process_inst_id {
    field_num += 1;
    sql_fields += "process_inst_id=?,";
    args.push(process_inst_id.into());
  }
  // 节点ID
  if let Some(node_id) = input.node_id.clone() {
    field_num += 1;
    sql_fields += "node_id=?,";
    args.push(node_id.into());
  }
  // 节点类型
  if let Some(node_type) = input.node_type {
    field_num += 1;
    sql_fields += "node_type=?,";
    args.push(node_type.into());
  }
  // 节点状态
  if let Some(status) = input.status {
    field_num += 1;
    sql_fields += "status=?,";
    args.push(status.into());
  }
  // 耗时(秒)
  if let Some(duration_seconds) = input.duration_seconds {
    field_num += 1;
    sql_fields += "duration_seconds=?,";
    args.push(duration_seconds.into());
  }
  
  if field_num > 0 {
    if !is_silent_mode && !is_creating {
      if input.update_usr_id.is_none() {
        let mut usr_id = get_auth_id();
        let mut usr_id_lbl = SmolStr::new("");
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
        let mut usr_id_lbl = SmolStr::new("");
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
    
    execute(
      sql,
      args,
      options,
    ).await?;
    
  }
  
  Ok(id)
}

// MARK: update_by_id_return_node_inst
/// 根据 id 更新节点实例, 并返回更新后的数据
#[allow(dead_code)]
pub async fn update_by_id_return_node_inst(
  id: NodeInstId,
  input: NodeInstInput,
  options: Option<Options>,
) -> Result<NodeInstModel> {
  
  update_by_id_node_inst(
    id,
    input,
    options,
  ).await?;
  
  let model = find_by_id_node_inst(
    id,
    options,
  ).await?;
  
  match model {
    Some(model) => Ok(model),
    None => Err(eyre!(
      "节点实例 update_by_id_return_node_inst id: {id}",
    )),
  }
}

/// 获取需要清空缓存的表名
#[allow(dead_code)]
fn get_cache_tables() -> Vec<&'static str> {
  let table = get_table_name_node_inst();
  vec![
    table,
    "bpm_process_inst",
  ]
}

// MARK: del_cache_node_inst
/// 清空缓存
#[allow(dead_code)]
pub async fn del_cache_node_inst() -> Result<()> {
  
  let cache_key1s = get_cache_tables();
  
  let cache_key1s = cache_key1s
    .into_iter()
    .map(|x|
      SmolStr::new(format!("dao.sql.{x}"))
    )
    .collect::<Vec<SmolStr>>();
  
  let cache_key1s_str = cache_key1s
    .iter()
    .map(|item| item.as_str())
    .collect::<Vec<&str>>();
  
  del_caches(
    cache_key1s_str.as_slice(),
  ).await?;
  
  Ok(())
}

// MARK: delete_by_ids_node_inst
/// 根据 ids 删除节点实例
#[allow(unused_variables)]
pub async fn delete_by_ids_node_inst(
  ids: Vec<NodeInstId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_node_inst();
  let method = "delete_by_ids_node_inst";
  
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
  
  let old_models = find_by_ids_ok_node_inst(
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
    
    let mut sql_fields = String::with_capacity(30);
    sql_fields.push_str("is_deleted=1,");
    let mut usr_id = get_auth_id();
    let mut usr_lbl = SmolStr::new("");
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
  
  if num > MAX_SAFE_INTEGER {
    return Err(eyre!("num: {} > MAX_SAFE_INTEGER", num));
  }
  
  Ok(num)
}

// MARK: revert_by_ids_node_inst
/// 根据 ids 还原节点实例
pub async fn revert_by_ids_node_inst(
  ids: Vec<NodeInstId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_node_inst();
  let method = "revert_by_ids_node_inst";
  
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
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let mut num = 0;
  for id in ids.clone() {
    let mut args = QueryArgs::new();
    
    let sql = format!("update {table} set is_deleted=0 where id=? limit 1");
    
    args.push(id.into());
    
    let args: Vec<_> = args.into();
    
    let mut old_model = find_one_node_inst(
      NodeInstSearch {
        id: Some(id),
        is_deleted: Some(1),
        ..Default::default()
      }.into(),
      None,
      options,
    ).await?;
    
    if old_model.is_none() {
      old_model = find_by_id_node_inst(
        id,
        options,
      ).await?;
    }
    
    let old_model = match old_model {
      Some(model) => model,
      None => continue,
    };
    
    {
      let mut input: NodeInstInput = old_model.clone().into();
      input.id = None;
      
      let models = find_by_unique_node_inst(
        input.into(),
        None,
        options,
      ).await?;
      
      let models: Vec<NodeInstModel> = models
        .into_iter()
        .filter(|item| 
          item.id != id
        )
        .collect();
      
      if !models.is_empty() {
        let err_msg = "节点实例 重复";
        return Err(eyre!(err_msg));
      }
    }
    
    num += execute(
      sql,
      args,
      options,
    ).await?;
    
  }
  
  Ok(num)
}

// MARK: force_delete_by_ids_node_inst
/// 根据 ids 彻底删除节点实例
#[allow(unused_variables)]
pub async fn force_delete_by_ids_node_inst(
  ids: Vec<NodeInstId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_node_inst();
  let method = "force_delete_by_ids_node_inst";
  
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
  
  let mut num = 0;
  for id in ids.clone() {
    
    let old_model = find_one_node_inst(
      Some(NodeInstSearch {
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
  
  Ok(num)
}

// MARK: validate_option_node_inst
/// 校验节点实例是否存在
#[allow(dead_code)]
pub async fn validate_option_node_inst(
  model: Option<NodeInstModel>,
) -> Result<NodeInstModel> {
  
  let model = match model {
    Some(model) => model,
    None => {
      let err_msg = SmolStr::new("节点实例不存在");
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
