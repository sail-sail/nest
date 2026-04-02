
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

use super::log_model::*;

use crate::base::tenant::tenant_model::TenantId;
use crate::bpm::process_inst::process_inst_model::ProcessInstId;
use crate::bpm::node_inst::node_inst_model::NodeInstId;
use crate::bpm::task::task_model::TaskId;
use crate::base::usr::usr_model::UsrId;

use crate::base::usr::usr_dao::find_by_id_usr;

#[allow(unused_variables)]
async fn get_where_query(
  args: &mut QueryArgs,
  search: Option<&LogSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let is_deleted = search
    .and_then(|item| item.is_deleted)
    .unwrap_or(0);
  
  let mut where_query = String::with_capacity(80 * 14 * 2);
  
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
    let ids: Option<Vec<LogId>> = match search {
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
  // 节点实例
  {
    let node_inst_id: Option<Vec<NodeInstId>> = match search {
      Some(item) => item.node_inst_id.clone(),
      None => None,
    };
    if let Some(node_inst_id) = node_inst_id {
      let arg = {
        if node_inst_id.is_empty() {
          SmolStr::new("null")
        } else {
          let mut items = Vec::with_capacity(node_inst_id.len());
          for item in node_inst_id {
            args.push(item.into());
            items.push("?");
          }
          SmolStr::new(items.join(","))
        }
      };
      where_query.push_str(" and t.node_inst_id in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let node_inst_id_is_null: bool = match search {
      Some(item) => item.node_inst_id_is_null.unwrap_or(false),
      None => false,
    };
    if node_inst_id_is_null {
      where_query.push_str(" and t.node_inst_id is null");
    }
  }
  {
    let node_inst_id_lbl: Option<Vec<SmolStr>> = match search {
      Some(item) => item.node_inst_id_lbl.clone(),
      None => None,
    };
    if let Some(node_inst_id_lbl) = node_inst_id_lbl {
      let arg = {
        if node_inst_id_lbl.is_empty() {
          SmolStr::new("null")
        } else {
          let mut items = Vec::with_capacity(node_inst_id_lbl.len());
          for item in node_inst_id_lbl {
            args.push(item.into());
            items.push("?");
          }
          SmolStr::new(items.join(","))
        }
      };
      where_query.push_str(" and t.node_inst_id_lbl in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
    {
      let node_inst_id_lbl_like = match search {
        Some(item) => item.node_inst_id_lbl_like.clone(),
        None => None,
      };
      if let Some(node_inst_id_lbl_like) = node_inst_id_lbl_like {
        if !node_inst_id_lbl_like.is_empty() {
          where_query.push_str(" and node_inst_id_lbl like ?");
          args.push(format!("%{}%", sql_like(&node_inst_id_lbl_like)).into());
        }
      }
    }
  }
  // 关联任务
  {
    let task_id: Option<Vec<TaskId>> = match search {
      Some(item) => item.task_id.clone(),
      None => None,
    };
    if let Some(task_id) = task_id {
      let arg = {
        if task_id.is_empty() {
          SmolStr::new("null")
        } else {
          let mut items = Vec::with_capacity(task_id.len());
          for item in task_id {
            args.push(item.into());
            items.push("?");
          }
          SmolStr::new(items.join(","))
        }
      };
      where_query.push_str(" and t.task_id in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let task_id_is_null: bool = match search {
      Some(item) => item.task_id_is_null.unwrap_or(false),
      None => false,
    };
    if task_id_is_null {
      where_query.push_str(" and t.task_id is null");
    }
  }
  {
    let task_id_lbl: Option<Vec<SmolStr>> = match search {
      Some(item) => item.task_id_lbl.clone(),
      None => None,
    };
    if let Some(task_id_lbl) = task_id_lbl {
      let arg = {
        if task_id_lbl.is_empty() {
          SmolStr::new("null")
        } else {
          let mut items = Vec::with_capacity(task_id_lbl.len());
          for item in task_id_lbl {
            args.push(item.into());
            items.push("?");
          }
          SmolStr::new(items.join(","))
        }
      };
      where_query.push_str(" and t.task_id_lbl in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
    {
      let task_id_lbl_like = match search {
        Some(item) => item.task_id_lbl_like.clone(),
        None => None,
      };
      if let Some(task_id_lbl_like) = task_id_lbl_like {
        if !task_id_lbl_like.is_empty() {
          where_query.push_str(" and task_id_lbl like ?");
          args.push(format!("%{}%", sql_like(&task_id_lbl_like)).into());
        }
      }
    }
  }
  // 动作
  {
    let action: Option<Vec<LogAction>> = match search {
      Some(item) => item.action.clone(),
      None => None,
    };
    if let Some(action) = action {
      let arg = {
        if action.is_empty() {
          SmolStr::new("null")
        } else {
          let mut items = Vec::with_capacity(action.len());
          for item in action {
            args.push(item.into());
            items.push("?");
          }
          SmolStr::new(items.join(","))
        }
      };
      where_query.push_str(" and t.action in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  // 操作人
  {
    let usr_id: Option<Vec<UsrId>> = match search {
      Some(item) => item.usr_id.clone(),
      None => None,
    };
    if let Some(usr_id) = usr_id {
      let arg = {
        if usr_id.is_empty() {
          SmolStr::new("null")
        } else {
          let mut items = Vec::with_capacity(usr_id.len());
          for item in usr_id {
            args.push(item.into());
            items.push("?");
          }
          SmolStr::new(items.join(","))
        }
      };
      where_query.push_str(" and t.usr_id in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let usr_id_is_null: bool = match search {
      Some(item) => item.usr_id_is_null.unwrap_or(false),
      None => false,
    };
    if usr_id_is_null {
      where_query.push_str(" and t.usr_id is null");
    }
  }
  {
    let usr_id_lbl: Option<Vec<SmolStr>> = match search {
      Some(item) => item.usr_id_lbl.clone(),
      None => None,
    };
    if let Some(usr_id_lbl) = usr_id_lbl {
      let arg = {
        if usr_id_lbl.is_empty() {
          SmolStr::new("null")
        } else {
          let mut items = Vec::with_capacity(usr_id_lbl.len());
          for item in usr_id_lbl {
            args.push(item.into());
            items.push("?");
          }
          SmolStr::new(items.join(","))
        }
      };
      where_query.push_str(" and t.usr_id_lbl in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
    {
      let usr_id_lbl_like = match search {
        Some(item) => item.usr_id_lbl_like.clone(),
        None => None,
      };
      if let Some(usr_id_lbl_like) = usr_id_lbl_like {
        if !usr_id_lbl_like.is_empty() {
          where_query.push_str(" and usr_id_lbl like ?");
          args.push(format!("%{}%", sql_like(&usr_id_lbl_like)).into());
        }
      }
    }
  }
  // 审批意见
  {
    let opinion = match search {
      Some(item) => item.opinion.clone(),
      None => None,
    };
    if let Some(opinion) = opinion {
      where_query.push_str(" and t.opinion=?");
      args.push(opinion.into());
    }
    let opinion_like = match search {
      Some(item) => item.opinion_like.clone(),
      None => None,
    };
    if let Some(opinion_like) = opinion_like && !opinion_like.is_empty() {
      where_query.push_str(" and t.opinion like ?");
      args.push(format!("%{}%", sql_like(&opinion_like)).into());
    }
  }
  // 节点名称
  {
    let node_label = match search {
      Some(item) => item.node_label.clone(),
      None => None,
    };
    if let Some(node_label) = node_label {
      where_query.push_str(" and t.node_label=?");
      args.push(node_label.into());
    }
    let node_label_like = match search {
      Some(item) => item.node_label_like.clone(),
      None => None,
    };
    if let Some(node_label_like) = node_label_like && !node_label_like.is_empty() {
      where_query.push_str(" and t.node_label like ?");
      args.push(format!("%{}%", sql_like(&node_label_like)).into());
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
  search: Option<&LogSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let from_query = r#"bpm_log t"#.to_owned();
  Ok(from_query)
}

// MARK: find_all_log
/// 根据搜索条件和分页查找流程日志列表
#[allow(unused_mut, unused_variables)]
pub async fn find_all_log(
  search: Option<LogSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<LogModel>> {
  
  let table = get_table_name_log();
  let method = "find_all_log";
  
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
  // 节点实例
  if let Some(search) = &search && let Some(node_inst_id) = &search.node_inst_id {
    let len = node_inst_id.len();
    if len == 0 {
      return Ok(vec![]);
    }
    if len > ids_limit {
      return Err(eyre!("search.node_inst_id.length > {ids_limit}"));
    }
  }
  // 关联任务
  if let Some(search) = &search && let Some(task_id) = &search.task_id {
    let len = task_id.len();
    if len == 0 {
      return Ok(vec![]);
    }
    if len > ids_limit {
      return Err(eyre!("search.task_id.length > {ids_limit}"));
    }
  }
  // 动作
  if let Some(search) = &search && let Some(action) = &search.action {
    let len = action.len();
    if len == 0 {
      return Ok(vec![]);
    }
    if len > ids_limit {
      return Err(eyre!("search.action.length > {ids_limit}"));
    }
  }
  // 操作人
  if let Some(search) = &search && let Some(usr_id) = &search.usr_id {
    let len = usr_id.len();
    if len == 0 {
      return Ok(vec![]);
    }
    if len > ids_limit {
      return Err(eyre!("search.usr_id.length > {ids_limit}"));
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
  
  if !sort.iter().any(|item| item.prop == "log_time") {
    sort.push(SortInput {
      prop: "log_time".into(),
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
  
  let mut res: Vec<LogModel> = query(
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
    "bpm_log_action",
  ]).await?;
  let [
    action_dict,
  ]: [Vec<_>; 1] = dict_vec
    .try_into()
    .map_err(|err| eyre!("{:#?}", err))?;
  
  #[allow(unused_variables)]
  for model in &mut res {
    
    // 动作
    model.action_lbl = {
      action_dict
        .iter()
        .find(|item| item.val == model.action.as_str())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.action.clone().into())
    };
    
  }
  
  Ok(res)
}

// MARK: find_count_log
/// 根据条件查找流程日志总数
pub async fn find_count_log(
  search: Option<LogSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_log();
  let method = "find_count_log";
  
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
  // 节点实例
  if let Some(search) = &search && search.node_inst_id.is_some() {
    let len = search.node_inst_id.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.node_inst_id.length > {ids_limit}"));
    }
  }
  // 关联任务
  if let Some(search) = &search && search.task_id.is_some() {
    let len = search.task_id.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.task_id.length > {ids_limit}"));
    }
  }
  // 动作
  if let Some(search) = &search && search.action.is_some() {
    let len = search.action.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.action.length > {ids_limit}"));
    }
  }
  // 操作人
  if let Some(search) = &search && search.usr_id.is_some() {
    let len = search.usr_id.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.usr_id.length > {ids_limit}"));
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

// MARK: get_field_comments_log
/// 获取流程日志字段注释
#[allow(unused_mut)]
pub async fn get_field_comments_log(
  _options: Option<Options>,
) -> Result<LogFieldComment> {
  
  let mut field_comments = LogFieldComment {
    id: "ID".into(),
    process_inst_id: "流程实例".into(),
    process_inst_id_lbl: "流程实例".into(),
    node_inst_id: "节点实例".into(),
    node_inst_id_lbl: "节点实例".into(),
    task_id: "关联任务".into(),
    task_id_lbl: "关联任务".into(),
    action: "动作".into(),
    action_lbl: "动作".into(),
    usr_id: "操作人".into(),
    usr_id_lbl: "操作人".into(),
    opinion: "审批意见".into(),
    node_label: "节点名称".into(),
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

// MARK: find_one_ok_log
/// 根据条件查找第一个流程日志, 如果不存在则抛错
#[allow(dead_code)]
pub async fn find_one_ok_log(
  search: Option<LogSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<LogModel> {
  
  let table = get_table_name_log();
  let method = "find_one_ok_log";
  
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
  
  let log_model = find_one_log(
    search,
    sort,
    options,
  ).await?;
  
  let Some(log_model) = log_model else {
    let err_msg = "此 流程日志 已被删除";
    return Err(eyre!(err_msg));
  };
  
  Ok(log_model)
}

// MARK: find_one_log
/// 根据条件查找第一个流程日志
#[allow(dead_code)]
pub async fn find_one_log(
  search: Option<LogSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<LogModel>> {
  
  let table = get_table_name_log();
  let method = "find_one_log";
  
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
  
  let res = find_all_log(
    search,
    page,
    sort,
    options,
  ).await?;
  
  let model: Option<LogModel> = res.into_iter().next();
  
  Ok(model)
}

// MARK: find_by_id_ok_log
/// 根据 id 查找流程日志, 如果不存在则抛错
#[allow(dead_code)]
pub async fn find_by_id_ok_log(
  id: LogId,
  options: Option<Options>,
) -> Result<LogModel> {
  
  let table = get_table_name_log();
  let method = "find_by_id_ok_log";
  
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
  
  let log_model = find_by_id_log(
    id,
    options,
  ).await?;
  
  let Some(log_model) = log_model else {
    let err_msg = SmolStr::new("此 流程日志 已被删除");
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
  
  Ok(log_model)
}

// MARK: find_by_id_log
/// 根据 id 查找流程日志
pub async fn find_by_id_log(
  id: LogId,
  options: Option<Options>,
) -> Result<Option<LogModel>> {
  
  let table = get_table_name_log();
  let method = "find_by_id_log";
  
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
  
  let search = LogSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let log_model = find_one_log(
    search,
    None,
    options,
  ).await?;
  
  Ok(log_model)
}

// MARK: find_by_ids_ok_log
/// 根据 ids 查找流程日志, 出现查询不到的 id 则报错
#[allow(dead_code)]
pub async fn find_by_ids_ok_log(
  ids: Vec<LogId>,
  options: Option<Options>,
) -> Result<Vec<LogModel>> {
  
  let table = get_table_name_log();
  let method = "find_by_ids_ok_log";
  
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
  
  let log_models = find_by_ids_log(
    ids.clone(),
    options,
  ).await?;
  
  if log_models.len() != len {
    let err_msg = SmolStr::new("此 流程日志 已被删除");
    return Err(eyre!(err_msg));
  }
  
  let log_models = ids
    .into_iter()
    .map(|id| {
      let model = log_models
        .iter()
        .find(|item| item.id == id);
      if let Some(model) = model {
        return Ok(model.clone());
      }
      let err_msg = SmolStr::new("此 流程日志 已经被删除");
      Err(eyre!(err_msg))
    })
    .collect::<Result<Vec<LogModel>>>()?;
  
  Ok(log_models)
}

// MARK: find_by_ids_log
/// 根据 ids 查找流程日志
#[allow(dead_code)]
pub async fn find_by_ids_log(
  ids: Vec<LogId>,
  options: Option<Options>,
) -> Result<Vec<LogModel>> {
  
  let table = get_table_name_log();
  let method = "find_by_ids_log";
  
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
  
  let search = LogSearch {
    ids: Some(ids.clone()),
    ..Default::default()
  }.into();
  
  let log_models = find_all_log(
    search,
    None,
    None,
    options,
  ).await?;
  
  let log_models = ids
    .into_iter()
    .filter_map(|id| {
      log_models
        .iter()
        .find(|item| item.id == id)
        .cloned()
    })
    .collect::<Vec<LogModel>>();
  
  Ok(log_models)
}

// MARK: exists_log
/// 根据搜索条件判断流程日志是否存在
#[allow(dead_code)]
pub async fn exists_log(
  search: Option<LogSearch>,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = get_table_name_log();
  let method = "exists_log";
  
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
  // 节点实例
  if let Some(search) = &search && search.node_inst_id.is_some() {
    let len = search.node_inst_id.as_ref().unwrap().len();
    if len == 0 {
      return Ok(false);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.node_inst_id.length > {ids_limit}"));
    }
  }
  // 关联任务
  if let Some(search) = &search && search.task_id.is_some() {
    let len = search.task_id.as_ref().unwrap().len();
    if len == 0 {
      return Ok(false);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.task_id.length > {ids_limit}"));
    }
  }
  // 动作
  if let Some(search) = &search && search.action.is_some() {
    let len = search.action.as_ref().unwrap().len();
    if len == 0 {
      return Ok(false);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.action.length > {ids_limit}"));
    }
  }
  // 操作人
  if let Some(search) = &search && search.usr_id.is_some() {
    let len = search.usr_id.as_ref().unwrap().len();
    if len == 0 {
      return Ok(false);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.usr_id.length > {ids_limit}"));
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

// MARK: exists_by_id_log
/// 根据 id 判断流程日志是否存在
#[allow(dead_code)]
pub async fn exists_by_id_log(
  id: LogId,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = get_table_name_log();
  let method = "exists_by_id_log";
  
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
  
  let search = LogSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let exists = exists_log(
    search,
    options,
  ).await?;
  
  Ok(exists)
}

// MARK: find_by_unique_log
/// 通过唯一约束获得数据列表
#[allow(unused_variables)]
pub async fn find_by_unique_log(
  search: LogSearch,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<LogModel>> {
  
  let table = get_table_name_log();
  let method = "find_by_unique_log";
  
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
    let model = find_by_id_log(
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
  input: &LogInput,
  model: &LogModel,
  options: Option<&Options>,
) -> bool {
  if input.id.as_ref().is_some() {
    return input.id.as_ref().unwrap() == &model.id;
  }
  
  let is_silent_mode = get_is_silent_mode(options);
  false
}

// MARK: check_by_unique_log
/// 通过唯一约束检查数据是否已经存在
#[allow(unused_variables)]
pub async fn check_by_unique_log(
  input: LogInput,
  model: LogModel,
  options: Option<Options>,
) -> Result<Option<LogId>> {
  
  let table = get_table_name_log();
  let method = "check_by_unique_log";
  
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
    let id = update_by_id_log(
      model.id,
      input,
      options,
    ).await?;
    return Ok(id.into());
  }
  if unique_type == UniqueType::Throw {
    let err_msg = "流程日志 重复";
    return Err(eyre!(err_msg));
  }
  Ok(None)
}

// MARK: set_id_by_lbl_log
/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(unused_variables, dead_code)]
pub async fn set_id_by_lbl_log(
  input: LogInput,
) -> Result<LogInput> {
  
  #[allow(unused_mut)]
  let mut input = input;
  
  let dict_vec = get_dict(&[
    "bpm_log_action",
  ]).await?;
  
  // 动作
  if input.action.is_none() {
    let action_dict = &dict_vec[0];
    if let Some(action_lbl) = input.action_lbl.clone() {
      input.action = action_dict
        .iter()
        .find(|item| {
          item.lbl == action_lbl
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
  
  // 关联任务
  if input.task_id_lbl.is_some()
    && !input.task_id_lbl.as_ref().unwrap().is_empty()
    && input.task_id.is_none()
  {
    input.task_id_lbl = input.task_id_lbl.map(|item| 
      SmolStr::new(item.trim())
    );
    let model = crate::bpm::task::task_dao::find_one_task(
      crate::bpm::task::task_model::TaskSearch {
        lbl: input.task_id_lbl.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(model) = model {
      input.task_id = model.id.into();
    }
  } else if
    (input.task_id_lbl.is_none() || input.task_id_lbl.as_ref().unwrap().is_empty())
    && input.task_id.is_some()
  {
    let task_model = crate::bpm::task::task_dao::find_one_task(
      crate::bpm::task::task_model::TaskSearch {
        id: input.task_id.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(task_model) = task_model {
      input.task_id_lbl = task_model.lbl.into();
    }
  }
  
  // 动作
  if
    input.action_lbl.is_some() && !input.action_lbl.as_ref().unwrap().is_empty()
    && input.action.is_none()
  {
    let action_dict = &dict_vec[0];
    let dict_model = action_dict.iter().find(|item| {
      item.lbl == input.action_lbl.clone().unwrap_or_default()
    });
    let val = dict_model.map(|item| SmolStr::new(&item.val));
    if let Some(val) = val {
      input.action = val.parse::<LogAction>()?.into();
    }
  } else if
    (input.action_lbl.is_none() || input.action_lbl.as_ref().unwrap().is_empty())
    && input.action.is_some()
  {
    let action_dict = &dict_vec[0];
    let dict_model = action_dict.iter().find(|item| {
      item.val == input.action.unwrap_or_default().to_string()
    });
    let lbl = dict_model.map(|item| SmolStr::new(&item.lbl));
    input.action_lbl = lbl;
  }
  
  // 操作人
  if input.usr_id_lbl.is_some()
    && !input.usr_id_lbl.as_ref().unwrap().is_empty()
    && input.usr_id.is_none()
  {
    input.usr_id_lbl = input.usr_id_lbl.map(|item| 
      SmolStr::new(item.trim())
    );
    let model = crate::base::usr::usr_dao::find_one_usr(
      crate::base::usr::usr_model::UsrSearch {
        lbl: input.usr_id_lbl.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(model) = model {
      input.usr_id = model.id.into();
    }
  } else if
    (input.usr_id_lbl.is_none() || input.usr_id_lbl.as_ref().unwrap().is_empty())
    && input.usr_id.is_some()
  {
    let usr_model = crate::base::usr::usr_dao::find_one_usr(
      crate::base::usr::usr_model::UsrSearch {
        id: input.usr_id.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(usr_model) = usr_model {
      input.usr_id_lbl = usr_model.lbl.into();
    }
  }
  
  Ok(input)
}

// MARK: creates_return_log
/// 批量创建流程日志并返回
#[allow(dead_code)]
pub async fn creates_return_log(
  inputs: Vec<LogInput>,
  options: Option<Options>,
) -> Result<Vec<LogModel>> {
  
  let table = get_table_name_log();
  let method = "creates_return_log";
  
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
  
  let models_log = find_by_ids_log(
    ids,
    options,
  ).await?;
  
  Ok(models_log)
}

// MARK: creates_log
/// 批量创建流程日志
pub async fn creates_log(
  inputs: Vec<LogInput>,
  options: Option<Options>,
) -> Result<Vec<LogId>> {
  
  let table = get_table_name_log();
  let method = "creates_log";
  
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

/// 批量创建流程日志
#[allow(unused_variables, clippy::redundant_locals)]
async fn _creates(
  inputs: Vec<LogInput>,
  options: Option<Options>,
) -> Result<Vec<LogId>> {
  
  let table = get_table_name_log();
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  
  let unique_type = options.as_ref()
    .and_then(|item|
      item.get_unique_type()
    )
    .unwrap_or_default();
  
  let mut ids2: Vec<LogId> = vec![];
  let mut inputs2: Vec<LogInput> = vec![];
  
  for input in inputs {
  
    if input.id.is_some() {
      return Err(eyre!("Can not set id when create in dao: {table}"));
    }
    
    let old_models = find_by_unique_log(
      input.clone().into(),
      None,
      options,
    ).await?;
    
    if !old_models.is_empty() {
      let mut id: Option<LogId> = None;
      
      for old_model in old_models {
        let options = Options::from(options)
          .set_unique_type(unique_type);
        
        id = check_by_unique_log(
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
  let mut sql_fields = String::with_capacity(80 * 14 + 20);
  
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
  // 节点实例
  sql_fields += ",node_inst_id_lbl";
  // 节点实例
  sql_fields += ",node_inst_id";
  // 关联任务
  sql_fields += ",task_id_lbl";
  // 关联任务
  sql_fields += ",task_id";
  // 动作
  sql_fields += ",action";
  // 操作人
  sql_fields += ",usr_id_lbl";
  // 操作人
  sql_fields += ",usr_id";
  // 审批意见
  sql_fields += ",opinion";
  // 节点名称
  sql_fields += ",node_label";
  
  let inputs2_len = inputs2.len();
  let mut sql_values = String::with_capacity((2 * 14 + 3) * inputs2_len);
  let mut inputs2_ids = vec![];
  
  for (i, input) in inputs2
    .clone()
    .into_iter()
    .enumerate()
  {
    
    let id: LogId = get_short_uuid().into();
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
    // 节点实例
    if let Some(node_inst_id_lbl) = input.node_inst_id_lbl {
      if !node_inst_id_lbl.is_empty() {
        sql_values += ",?";
        args.push(node_inst_id_lbl.into());
      } else {
        sql_values += ",default";
      }
    } else {
      sql_values += ",default";
    }
    // 节点实例
    if let Some(node_inst_id) = input.node_inst_id {
      sql_values += ",?";
      args.push(node_inst_id.into());
    } else {
      sql_values += ",default";
    }
    // 关联任务
    if let Some(task_id_lbl) = input.task_id_lbl {
      if !task_id_lbl.is_empty() {
        sql_values += ",?";
        args.push(task_id_lbl.into());
      } else {
        sql_values += ",default";
      }
    } else {
      sql_values += ",default";
    }
    // 关联任务
    if let Some(task_id) = input.task_id {
      sql_values += ",?";
      args.push(task_id.into());
    } else {
      sql_values += ",default";
    }
    // 动作
    if let Some(action) = input.action {
      sql_values += ",?";
      args.push(action.into());
    } else {
      sql_values += ",default";
    }
    // 操作人
    if let Some(usr_id_lbl) = input.usr_id_lbl {
      if !usr_id_lbl.is_empty() {
        sql_values += ",?";
        args.push(usr_id_lbl.into());
      } else {
        sql_values += ",default";
      }
    } else {
      sql_values += ",default";
    }
    // 操作人
    if let Some(usr_id) = input.usr_id {
      sql_values += ",?";
      args.push(usr_id.into());
    } else {
      sql_values += ",default";
    }
    // 审批意见
    if let Some(opinion) = input.opinion {
      sql_values += ",?";
      args.push(opinion.into());
    } else {
      sql_values += ",default";
    }
    // 节点名称
    if let Some(node_label) = input.node_label {
      sql_values += ",?";
      args.push(node_label.into());
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

// MARK: create_return_log
/// 创建流程日志并返回
#[allow(dead_code)]
pub async fn create_return_log(
  #[allow(unused_mut)]
  mut input: LogInput,
  options: Option<Options>,
) -> Result<LogModel> {
  
  let id = create_log(
    input.clone(),
    options,
  ).await?;
  
  let model_log = find_by_id_log(
    id,
    options,
  ).await?;
  
  let model_log = match model_log {
    Some(model) => model,
    None => {
      let err_msg = "create_return_log: model_log.is_none()";
      return Err(eyre!(
        ServiceException {
          message: err_msg.into(),
          trace: true,
          ..Default::default()
        },
      ));
    }
  };
  
  Ok(model_log)
}

// MARK: create_log
/// 创建流程日志
#[allow(dead_code)]
pub async fn create_log(
  #[allow(unused_mut)]
  mut input: LogInput,
  options: Option<Options>,
) -> Result<LogId> {
  
  let table = get_table_name_log();
  let method = "create_log";
  
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

// MARK: update_tenant_by_id_log
/// 流程日志根据id修改租户id
pub async fn update_tenant_by_id_log(
  id: LogId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  let table = get_table_name_log();
  let method = "update_tenant_by_id_log";
  
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

// MARK: update_by_id_log
/// 根据 id 修改流程日志
#[allow(unused_mut)]
#[allow(unused_variables)]
pub async fn update_by_id_log(
  id: LogId,
  mut input: LogInput,
  options: Option<Options>,
) -> Result<LogId> {
  
  let table = get_table_name_log();
  let method = "update_by_id_log";
  
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
  
  let old_model = find_by_id_log(
    id,
    options,
  ).await?;
  
  let old_model = match old_model {
    Some(model) => model,
    None => {
      let err_msg = "编辑失败, 此 流程日志 已被删除";
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
    
    let models = find_by_unique_log(
      input.into(),
      None,
      options,
    ).await?;
    
    let models = models.into_iter()
      .filter(|item| 
        item.id != id
      )
      .collect::<Vec<LogModel>>();
    
    if !models.is_empty() {
      let unique_type = options
        .as_ref()
        .and_then(|item| item.get_unique_type())
        .unwrap_or(UniqueType::Throw);
      if unique_type == UniqueType::Throw {
        let err_msg = "流程日志 重复";
        return Err(eyre!(err_msg));
      } else if unique_type == UniqueType::Ignore {
        return Ok(id);
      }
    }
  }
  
  let mut args = QueryArgs::new();
  
  let mut sql_fields = String::with_capacity(80 * 14 + 20);
  
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
  // 节点实例
  if let Some(node_inst_id_lbl) = input.node_inst_id_lbl {
    if !node_inst_id_lbl.is_empty() {
      field_num += 1;
      sql_fields += "node_inst_id_lbl=?,";
      args.push(node_inst_id_lbl.into());
    }
  }
  // 节点实例
  if let Some(node_inst_id) = input.node_inst_id {
    field_num += 1;
    sql_fields += "node_inst_id=?,";
    args.push(node_inst_id.into());
  }
  // 关联任务
  if let Some(task_id_lbl) = input.task_id_lbl {
    if !task_id_lbl.is_empty() {
      field_num += 1;
      sql_fields += "task_id_lbl=?,";
      args.push(task_id_lbl.into());
    }
  }
  // 关联任务
  if let Some(task_id) = input.task_id {
    field_num += 1;
    sql_fields += "task_id=?,";
    args.push(task_id.into());
  }
  // 动作
  if let Some(action) = input.action {
    field_num += 1;
    sql_fields += "action=?,";
    args.push(action.into());
  }
  // 操作人
  if let Some(usr_id_lbl) = input.usr_id_lbl {
    if !usr_id_lbl.is_empty() {
      field_num += 1;
      sql_fields += "usr_id_lbl=?,";
      args.push(usr_id_lbl.into());
    }
  }
  // 操作人
  if let Some(usr_id) = input.usr_id {
    field_num += 1;
    sql_fields += "usr_id=?,";
    args.push(usr_id.into());
  }
  // 审批意见
  if let Some(opinion) = input.opinion.clone() {
    field_num += 1;
    sql_fields += "opinion=?,";
    args.push(opinion.into());
  }
  // 节点名称
  if let Some(node_label) = input.node_label.clone() {
    field_num += 1;
    sql_fields += "node_label=?,";
    args.push(node_label.into());
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

// MARK: update_by_id_return_log
/// 根据 id 更新流程日志, 并返回更新后的数据
#[allow(dead_code)]
pub async fn update_by_id_return_log(
  id: LogId,
  input: LogInput,
  options: Option<Options>,
) -> Result<LogModel> {
  
  update_by_id_log(
    id,
    input,
    options,
  ).await?;
  
  let model = find_by_id_log(
    id,
    options,
  ).await?;
  
  match model {
    Some(model) => Ok(model),
    None => Err(eyre!(
      "流程日志 update_by_id_return_log id: {id}",
    )),
  }
}

/// 获取需要清空缓存的表名
#[allow(dead_code)]
fn get_cache_tables() -> Vec<&'static str> {
  let table = get_table_name_log();
  vec![
    table,
    "bpm_process_inst",
    "bpm_node_inst",
    "bpm_task",
  ]
}

// MARK: del_cache_log
/// 清空缓存
#[allow(dead_code)]
pub async fn del_cache_log() -> Result<()> {
  
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

// MARK: delete_by_ids_log
/// 根据 ids 删除流程日志
#[allow(unused_variables)]
pub async fn delete_by_ids_log(
  ids: Vec<LogId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_log();
  let method = "delete_by_ids_log";
  
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
  
  let old_models = find_by_ids_ok_log(
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

// MARK: revert_by_ids_log
/// 根据 ids 还原流程日志
pub async fn revert_by_ids_log(
  ids: Vec<LogId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_log();
  let method = "revert_by_ids_log";
  
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
    
    let mut old_model = find_one_log(
      LogSearch {
        id: Some(id),
        is_deleted: Some(1),
        ..Default::default()
      }.into(),
      None,
      options,
    ).await?;
    
    if old_model.is_none() {
      old_model = find_by_id_log(
        id,
        options,
      ).await?;
    }
    
    let old_model = match old_model {
      Some(model) => model,
      None => continue,
    };
    
    {
      let mut input: LogInput = old_model.clone().into();
      input.id = None;
      
      let models = find_by_unique_log(
        input.into(),
        None,
        options,
      ).await?;
      
      let models: Vec<LogModel> = models
        .into_iter()
        .filter(|item| 
          item.id != id
        )
        .collect();
      
      if !models.is_empty() {
        let err_msg = "流程日志 重复";
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

// MARK: force_delete_by_ids_log
/// 根据 ids 彻底删除流程日志
#[allow(unused_variables)]
pub async fn force_delete_by_ids_log(
  ids: Vec<LogId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_log();
  let method = "force_delete_by_ids_log";
  
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
    
    let old_model = find_one_log(
      Some(LogSearch {
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

// MARK: validate_option_log
/// 校验流程日志是否存在
#[allow(dead_code)]
pub async fn validate_option_log(
  model: Option<LogModel>,
) -> Result<LogModel> {
  
  let model = match model {
    Some(model) => model,
    None => {
      let err_msg = SmolStr::new("流程日志不存在");
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
