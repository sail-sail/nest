
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

use super::process_inst_model::*;

use crate::base::tenant::tenant_model::TenantId;
use crate::bpm::process_def::process_def_model::ProcessDefId;
use crate::bpm::process_revision::process_revision_model::ProcessRevisionId;
use crate::base::usr::usr_model::UsrId;
use crate::base::dept::dept_model::DeptId;

use crate::base::usr::usr_dao::find_by_id_usr;

#[allow(unused_variables)]
async fn get_where_query(
  args: &mut QueryArgs,
  search: Option<&ProcessInstSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let is_deleted = search
    .and_then(|item| item.is_deleted)
    .unwrap_or(0);
  
  let mut where_query = String::with_capacity(80 * 18 * 2);
  
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
    let ids: Option<Vec<ProcessInstId>> = match search {
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
  // 实例标题
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
  // 流程定义
  {
    let process_def_id: Option<Vec<ProcessDefId>> = match search {
      Some(item) => item.process_def_id.clone(),
      None => None,
    };
    if let Some(process_def_id) = process_def_id {
      let arg = {
        if process_def_id.is_empty() {
          SmolStr::new("null")
        } else {
          let mut items = Vec::with_capacity(process_def_id.len());
          for item in process_def_id {
            args.push(item.into());
            items.push("?");
          }
          SmolStr::new(items.join(","))
        }
      };
      where_query.push_str(" and t.process_def_id in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let process_def_id_is_null: bool = match search {
      Some(item) => item.process_def_id_is_null.unwrap_or(false),
      None => false,
    };
    if process_def_id_is_null {
      where_query.push_str(" and t.process_def_id is null");
    }
  }
  {
    let process_def_id_lbl: Option<Vec<SmolStr>> = match search {
      Some(item) => item.process_def_id_lbl.clone(),
      None => None,
    };
    if let Some(process_def_id_lbl) = process_def_id_lbl {
      let arg = {
        if process_def_id_lbl.is_empty() {
          SmolStr::new("null")
        } else {
          let mut items = Vec::with_capacity(process_def_id_lbl.len());
          for item in process_def_id_lbl {
            args.push(item.into());
            items.push("?");
          }
          SmolStr::new(items.join(","))
        }
      };
      where_query.push_str(" and t.process_def_id_lbl in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
    {
      let process_def_id_lbl_like = match search {
        Some(item) => item.process_def_id_lbl_like.clone(),
        None => None,
      };
      if let Some(process_def_id_lbl_like) = process_def_id_lbl_like {
        if !process_def_id_lbl_like.is_empty() {
          where_query.push_str(" and process_def_id_lbl like ?");
          args.push(format!("%{}%", sql_like(&process_def_id_lbl_like)).into());
        }
      }
    }
  }
  // 流程版本
  {
    let process_revision_id: Option<Vec<ProcessRevisionId>> = match search {
      Some(item) => item.process_revision_id.clone(),
      None => None,
    };
    if let Some(process_revision_id) = process_revision_id {
      let arg = {
        if process_revision_id.is_empty() {
          SmolStr::new("null")
        } else {
          let mut items = Vec::with_capacity(process_revision_id.len());
          for item in process_revision_id {
            args.push(item.into());
            items.push("?");
          }
          SmolStr::new(items.join(","))
        }
      };
      where_query.push_str(" and t.process_revision_id in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let process_revision_id_is_null: bool = match search {
      Some(item) => item.process_revision_id_is_null.unwrap_or(false),
      None => false,
    };
    if process_revision_id_is_null {
      where_query.push_str(" and t.process_revision_id is null");
    }
  }
  {
    let process_revision_id_lbl: Option<Vec<SmolStr>> = match search {
      Some(item) => item.process_revision_id_lbl.clone(),
      None => None,
    };
    if let Some(process_revision_id_lbl) = process_revision_id_lbl {
      let arg = {
        if process_revision_id_lbl.is_empty() {
          SmolStr::new("null")
        } else {
          let mut items = Vec::with_capacity(process_revision_id_lbl.len());
          for item in process_revision_id_lbl {
            args.push(item.into());
            items.push("?");
          }
          SmolStr::new(items.join(","))
        }
      };
      where_query.push_str(" and t.process_revision_id_lbl in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
    {
      let process_revision_id_lbl_like = match search {
        Some(item) => item.process_revision_id_lbl_like.clone(),
        None => None,
      };
      if let Some(process_revision_id_lbl_like) = process_revision_id_lbl_like {
        if !process_revision_id_lbl_like.is_empty() {
          where_query.push_str(" and process_revision_id_lbl like ?");
          args.push(format!("%{}%", sql_like(&process_revision_id_lbl_like)).into());
        }
      }
    }
  }
  // 状态
  {
    let status: Option<Vec<ProcessInstStatus>> = match search {
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
  // 关联业务
  {
    let biz_code: Option<Vec<ProcessInstBizCode>> = match search {
      Some(item) => item.biz_code.clone(),
      None => None,
    };
    if let Some(biz_code) = biz_code {
      let arg = {
        if biz_code.is_empty() {
          SmolStr::new("null")
        } else {
          let mut items = Vec::with_capacity(biz_code.len());
          for item in biz_code {
            args.push(item.into());
            items.push("?");
          }
          SmolStr::new(items.join(","))
        }
      };
      where_query.push_str(" and t.biz_code in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  // 业务数据ID
  {
    let form_data_id = match search {
      Some(item) => item.form_data_id.clone(),
      None => None,
    };
    if let Some(form_data_id) = form_data_id {
      where_query.push_str(" and t.form_data_id=?");
      args.push(form_data_id.into());
    }
    let form_data_id_like = match search {
      Some(item) => item.form_data_id_like.clone(),
      None => None,
    };
    if let Some(form_data_id_like) = form_data_id_like && !form_data_id_like.is_empty() {
      where_query.push_str(" and t.form_data_id like ?");
      args.push(format!("%{}%", sql_like(&form_data_id_like)).into());
    }
  }
  // 发起人
  {
    let start_usr_id: Option<Vec<UsrId>> = match search {
      Some(item) => item.start_usr_id.clone(),
      None => None,
    };
    if let Some(start_usr_id) = start_usr_id {
      let arg = {
        if start_usr_id.is_empty() {
          SmolStr::new("null")
        } else {
          let mut items = Vec::with_capacity(start_usr_id.len());
          for item in start_usr_id {
            args.push(item.into());
            items.push("?");
          }
          SmolStr::new(items.join(","))
        }
      };
      where_query.push_str(" and t.start_usr_id in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let start_usr_id_is_null: bool = match search {
      Some(item) => item.start_usr_id_is_null.unwrap_or(false),
      None => false,
    };
    if start_usr_id_is_null {
      where_query.push_str(" and t.start_usr_id is null");
    }
  }
  {
    let start_usr_id_lbl: Option<Vec<SmolStr>> = match search {
      Some(item) => item.start_usr_id_lbl.clone(),
      None => None,
    };
    if let Some(start_usr_id_lbl) = start_usr_id_lbl {
      let arg = {
        if start_usr_id_lbl.is_empty() {
          SmolStr::new("null")
        } else {
          let mut items = Vec::with_capacity(start_usr_id_lbl.len());
          for item in start_usr_id_lbl {
            args.push(item.into());
            items.push("?");
          }
          SmolStr::new(items.join(","))
        }
      };
      where_query.push_str(" and t.start_usr_id_lbl in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
    {
      let start_usr_id_lbl_like = match search {
        Some(item) => item.start_usr_id_lbl_like.clone(),
        None => None,
      };
      if let Some(start_usr_id_lbl_like) = start_usr_id_lbl_like {
        if !start_usr_id_lbl_like.is_empty() {
          where_query.push_str(" and start_usr_id_lbl like ?");
          args.push(format!("%{}%", sql_like(&start_usr_id_lbl_like)).into());
        }
      }
    }
  }
  // 发起人部门
  {
    let start_dept_id: Option<Vec<DeptId>> = match search {
      Some(item) => item.start_dept_id.clone(),
      None => None,
    };
    if let Some(start_dept_id) = start_dept_id {
      let arg = {
        if start_dept_id.is_empty() {
          SmolStr::new("null")
        } else {
          let mut items = Vec::with_capacity(start_dept_id.len());
          for item in start_dept_id {
            args.push(item.into());
            items.push("?");
          }
          SmolStr::new(items.join(","))
        }
      };
      where_query.push_str(" and t.start_dept_id in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let start_dept_id_is_null: bool = match search {
      Some(item) => item.start_dept_id_is_null.unwrap_or(false),
      None => false,
    };
    if start_dept_id_is_null {
      where_query.push_str(" and t.start_dept_id is null");
    }
  }
  {
    let start_dept_id_lbl: Option<Vec<SmolStr>> = match search {
      Some(item) => item.start_dept_id_lbl.clone(),
      None => None,
    };
    if let Some(start_dept_id_lbl) = start_dept_id_lbl {
      let arg = {
        if start_dept_id_lbl.is_empty() {
          SmolStr::new("null")
        } else {
          let mut items = Vec::with_capacity(start_dept_id_lbl.len());
          for item in start_dept_id_lbl {
            args.push(item.into());
            items.push("?");
          }
          SmolStr::new(items.join(","))
        }
      };
      where_query.push_str(" and t.start_dept_id_lbl in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
    {
      let start_dept_id_lbl_like = match search {
        Some(item) => item.start_dept_id_lbl_like.clone(),
        None => None,
      };
      if let Some(start_dept_id_lbl_like) = start_dept_id_lbl_like {
        if !start_dept_id_lbl_like.is_empty() {
          where_query.push_str(" and start_dept_id_lbl like ?");
          args.push(format!("%{}%", sql_like(&start_dept_id_lbl_like)).into());
        }
      }
    }
  }
  // 当前活跃节点
  {
    let current_node_ids = match search {
      Some(item) => item.current_node_ids.clone(),
      None => None,
    };
    if let Some(current_node_ids) = current_node_ids {
      where_query.push_str(" and t.current_node_ids=?");
      args.push(current_node_ids.into());
    }
  }
  // 当前节点名称
  {
    let current_node_lbls = match search {
      Some(item) => item.current_node_lbls.clone(),
      None => None,
    };
    if let Some(current_node_lbls) = current_node_lbls {
      where_query.push_str(" and t.current_node_lbls=?");
      args.push(current_node_lbls.into());
    }
    let current_node_lbls_like = match search {
      Some(item) => item.current_node_lbls_like.clone(),
      None => None,
    };
    if let Some(current_node_lbls_like) = current_node_lbls_like && !current_node_lbls_like.is_empty() {
      where_query.push_str(" and t.current_node_lbls like ?");
      args.push(format!("%{}%", sql_like(&current_node_lbls_like)).into());
    }
  }
  // 总耗时(秒)
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
  search: Option<&ProcessInstSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let from_query = r#"bpm_process_inst t"#.to_owned();
  Ok(from_query)
}

// MARK: find_all_process_inst
/// 根据搜索条件和分页查找流程实例列表
#[allow(unused_mut, unused_variables)]
pub async fn find_all_process_inst(
  search: Option<ProcessInstSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<ProcessInstModel>> {
  
  let table = get_table_name_process_inst();
  let method = "find_all_process_inst";
  
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
  // 流程定义
  if let Some(search) = &search && let Some(process_def_id) = &search.process_def_id {
    let len = process_def_id.len();
    if len == 0 {
      return Ok(vec![]);
    }
    if len > ids_limit {
      return Err(eyre!("search.process_def_id.length > {ids_limit}"));
    }
  }
  // 流程版本
  if let Some(search) = &search && let Some(process_revision_id) = &search.process_revision_id {
    let len = process_revision_id.len();
    if len == 0 {
      return Ok(vec![]);
    }
    if len > ids_limit {
      return Err(eyre!("search.process_revision_id.length > {ids_limit}"));
    }
  }
  // 状态
  if let Some(search) = &search && let Some(status) = &search.status {
    let len = status.len();
    if len == 0 {
      return Ok(vec![]);
    }
    if len > ids_limit {
      return Err(eyre!("search.status.length > {ids_limit}"));
    }
  }
  // 关联业务
  if let Some(search) = &search && let Some(biz_code) = &search.biz_code {
    let len = biz_code.len();
    if len == 0 {
      return Ok(vec![]);
    }
    if len > ids_limit {
      return Err(eyre!("search.biz_code.length > {ids_limit}"));
    }
  }
  // 发起人
  if let Some(search) = &search && let Some(start_usr_id) = &search.start_usr_id {
    let len = start_usr_id.len();
    if len == 0 {
      return Ok(vec![]);
    }
    if len > ids_limit {
      return Err(eyre!("search.start_usr_id.length > {ids_limit}"));
    }
  }
  // 发起人部门
  if let Some(search) = &search && let Some(start_dept_id) = &search.start_dept_id {
    let len = start_dept_id.len();
    if len == 0 {
      return Ok(vec![]);
    }
    if len > ids_limit {
      return Err(eyre!("search.start_dept_id.length > {ids_limit}"));
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
  
  let mut res: Vec<ProcessInstModel> = query(
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
    "bpm_inst_status",
    "bpm_biz_code",
  ]).await?;
  let [
    status_dict,
    biz_code_dict,
  ]: [Vec<_>; 2] = dict_vec
    .try_into()
    .map_err(|err| eyre!("{:#?}", err))?;
  
  #[allow(unused_variables)]
  for model in &mut res {
    
    // 状态
    model.status_lbl = {
      status_dict
        .iter()
        .find(|item| item.val == model.status.as_str())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.status.clone().into())
    };
    
    // 关联业务
    model.biz_code_lbl = {
      biz_code_dict
        .iter()
        .find(|item| item.val == model.biz_code.as_str())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.biz_code.clone().into())
    };
    
  }
  
  Ok(res)
}

// MARK: find_count_process_inst
/// 根据条件查找流程实例总数
pub async fn find_count_process_inst(
  search: Option<ProcessInstSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_process_inst();
  let method = "find_count_process_inst";
  
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
  // 流程定义
  if let Some(search) = &search && search.process_def_id.is_some() {
    let len = search.process_def_id.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.process_def_id.length > {ids_limit}"));
    }
  }
  // 流程版本
  if let Some(search) = &search && search.process_revision_id.is_some() {
    let len = search.process_revision_id.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.process_revision_id.length > {ids_limit}"));
    }
  }
  // 状态
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
  // 关联业务
  if let Some(search) = &search && search.biz_code.is_some() {
    let len = search.biz_code.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.biz_code.length > {ids_limit}"));
    }
  }
  // 发起人
  if let Some(search) = &search && search.start_usr_id.is_some() {
    let len = search.start_usr_id.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.start_usr_id.length > {ids_limit}"));
    }
  }
  // 发起人部门
  if let Some(search) = &search && search.start_dept_id.is_some() {
    let len = search.start_dept_id.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.start_dept_id.length > {ids_limit}"));
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

// MARK: get_field_comments_process_inst
/// 获取流程实例字段注释
#[allow(unused_mut)]
pub async fn get_field_comments_process_inst(
  _options: Option<Options>,
) -> Result<ProcessInstFieldComment> {
  
  let mut field_comments = ProcessInstFieldComment {
    id: "ID".into(),
    lbl: "实例标题".into(),
    process_def_id: "流程定义".into(),
    process_def_id_lbl: "流程定义".into(),
    process_revision_id: "流程版本".into(),
    process_revision_id_lbl: "流程版本".into(),
    status: "状态".into(),
    status_lbl: "状态".into(),
    biz_code: "关联业务".into(),
    biz_code_lbl: "关联业务".into(),
    form_data_id: "业务数据ID".into(),
    start_usr_id: "发起人".into(),
    start_usr_id_lbl: "发起人".into(),
    start_dept_id: "发起人部门".into(),
    start_dept_id_lbl: "发起人部门".into(),
    current_node_ids: "当前活跃节点".into(),
    current_node_lbls: "当前节点名称".into(),
    duration_seconds: "总耗时(秒)".into(),
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

// MARK: find_one_ok_process_inst
/// 根据条件查找第一个流程实例, 如果不存在则抛错
#[allow(dead_code)]
pub async fn find_one_ok_process_inst(
  search: Option<ProcessInstSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<ProcessInstModel> {
  
  let table = get_table_name_process_inst();
  let method = "find_one_ok_process_inst";
  
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
  
  let process_inst_model = find_one_process_inst(
    search,
    sort,
    options,
  ).await?;
  
  let Some(process_inst_model) = process_inst_model else {
    let err_msg = "此 流程实例 已被删除";
    return Err(eyre!(err_msg));
  };
  
  Ok(process_inst_model)
}

// MARK: find_one_process_inst
/// 根据条件查找第一个流程实例
#[allow(dead_code)]
pub async fn find_one_process_inst(
  search: Option<ProcessInstSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<ProcessInstModel>> {
  
  let table = get_table_name_process_inst();
  let method = "find_one_process_inst";
  
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
  
  let res = find_all_process_inst(
    search,
    page,
    sort,
    options,
  ).await?;
  
  let model: Option<ProcessInstModel> = res.into_iter().next();
  
  Ok(model)
}

// MARK: find_by_id_ok_process_inst
/// 根据 id 查找流程实例, 如果不存在则抛错
#[allow(dead_code)]
pub async fn find_by_id_ok_process_inst(
  id: ProcessInstId,
  options: Option<Options>,
) -> Result<ProcessInstModel> {
  
  let table = get_table_name_process_inst();
  let method = "find_by_id_ok_process_inst";
  
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
  
  let process_inst_model = find_by_id_process_inst(
    id,
    options,
  ).await?;
  
  let Some(process_inst_model) = process_inst_model else {
    let err_msg = SmolStr::new("此 流程实例 已被删除");
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
  
  Ok(process_inst_model)
}

// MARK: find_by_id_process_inst
/// 根据 id 查找流程实例
pub async fn find_by_id_process_inst(
  id: ProcessInstId,
  options: Option<Options>,
) -> Result<Option<ProcessInstModel>> {
  
  let table = get_table_name_process_inst();
  let method = "find_by_id_process_inst";
  
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
  
  let search = ProcessInstSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let process_inst_model = find_one_process_inst(
    search,
    None,
    options,
  ).await?;
  
  Ok(process_inst_model)
}

// MARK: find_by_ids_ok_process_inst
/// 根据 ids 查找流程实例, 出现查询不到的 id 则报错
#[allow(dead_code)]
pub async fn find_by_ids_ok_process_inst(
  ids: Vec<ProcessInstId>,
  options: Option<Options>,
) -> Result<Vec<ProcessInstModel>> {
  
  let table = get_table_name_process_inst();
  let method = "find_by_ids_ok_process_inst";
  
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
  
  let process_inst_models = find_by_ids_process_inst(
    ids.clone(),
    options,
  ).await?;
  
  if process_inst_models.len() != len {
    let err_msg = SmolStr::new("此 流程实例 已被删除");
    return Err(eyre!(err_msg));
  }
  
  let process_inst_models = ids
    .into_iter()
    .map(|id| {
      let model = process_inst_models
        .iter()
        .find(|item| item.id == id);
      if let Some(model) = model {
        return Ok(model.clone());
      }
      let err_msg = SmolStr::new("此 流程实例 已经被删除");
      Err(eyre!(err_msg))
    })
    .collect::<Result<Vec<ProcessInstModel>>>()?;
  
  Ok(process_inst_models)
}

// MARK: find_by_ids_process_inst
/// 根据 ids 查找流程实例
#[allow(dead_code)]
pub async fn find_by_ids_process_inst(
  ids: Vec<ProcessInstId>,
  options: Option<Options>,
) -> Result<Vec<ProcessInstModel>> {
  
  let table = get_table_name_process_inst();
  let method = "find_by_ids_process_inst";
  
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
  
  let search = ProcessInstSearch {
    ids: Some(ids.clone()),
    ..Default::default()
  }.into();
  
  let process_inst_models = find_all_process_inst(
    search,
    None,
    None,
    options,
  ).await?;
  
  let process_inst_models = ids
    .into_iter()
    .filter_map(|id| {
      process_inst_models
        .iter()
        .find(|item| item.id == id)
        .cloned()
    })
    .collect::<Vec<ProcessInstModel>>();
  
  Ok(process_inst_models)
}

// MARK: exists_process_inst
/// 根据搜索条件判断流程实例是否存在
#[allow(dead_code)]
pub async fn exists_process_inst(
  search: Option<ProcessInstSearch>,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = get_table_name_process_inst();
  let method = "exists_process_inst";
  
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
  // 流程定义
  if let Some(search) = &search && search.process_def_id.is_some() {
    let len = search.process_def_id.as_ref().unwrap().len();
    if len == 0 {
      return Ok(false);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.process_def_id.length > {ids_limit}"));
    }
  }
  // 流程版本
  if let Some(search) = &search && search.process_revision_id.is_some() {
    let len = search.process_revision_id.as_ref().unwrap().len();
    if len == 0 {
      return Ok(false);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.process_revision_id.length > {ids_limit}"));
    }
  }
  // 状态
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
  // 关联业务
  if let Some(search) = &search && search.biz_code.is_some() {
    let len = search.biz_code.as_ref().unwrap().len();
    if len == 0 {
      return Ok(false);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.biz_code.length > {ids_limit}"));
    }
  }
  // 发起人
  if let Some(search) = &search && search.start_usr_id.is_some() {
    let len = search.start_usr_id.as_ref().unwrap().len();
    if len == 0 {
      return Ok(false);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.start_usr_id.length > {ids_limit}"));
    }
  }
  // 发起人部门
  if let Some(search) = &search && search.start_dept_id.is_some() {
    let len = search.start_dept_id.as_ref().unwrap().len();
    if len == 0 {
      return Ok(false);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.start_dept_id.length > {ids_limit}"));
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

// MARK: exists_by_id_process_inst
/// 根据 id 判断流程实例是否存在
#[allow(dead_code)]
pub async fn exists_by_id_process_inst(
  id: ProcessInstId,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = get_table_name_process_inst();
  let method = "exists_by_id_process_inst";
  
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
  
  let search = ProcessInstSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let exists = exists_process_inst(
    search,
    options,
  ).await?;
  
  Ok(exists)
}

// MARK: find_by_unique_process_inst
/// 通过唯一约束获得数据列表
#[allow(unused_variables)]
pub async fn find_by_unique_process_inst(
  search: ProcessInstSearch,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<ProcessInstModel>> {
  
  let table = get_table_name_process_inst();
  let method = "find_by_unique_process_inst";
  
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
    let model = find_by_id_process_inst(
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
  input: &ProcessInstInput,
  model: &ProcessInstModel,
  options: Option<&Options>,
) -> bool {
  if input.id.as_ref().is_some() {
    return input.id.as_ref().unwrap() == &model.id;
  }
  
  let is_silent_mode = get_is_silent_mode(options);
  false
}

// MARK: check_by_unique_process_inst
/// 通过唯一约束检查数据是否已经存在
#[allow(unused_variables)]
pub async fn check_by_unique_process_inst(
  input: ProcessInstInput,
  model: ProcessInstModel,
  options: Option<Options>,
) -> Result<Option<ProcessInstId>> {
  
  let table = get_table_name_process_inst();
  let method = "check_by_unique_process_inst";
  
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
    let id = update_by_id_process_inst(
      model.id,
      input,
      options,
    ).await?;
    return Ok(id.into());
  }
  if unique_type == UniqueType::Throw {
    let err_msg = "流程实例 重复";
    return Err(eyre!(err_msg));
  }
  Ok(None)
}

// MARK: set_id_by_lbl_process_inst
/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(unused_variables, dead_code)]
pub async fn set_id_by_lbl_process_inst(
  input: ProcessInstInput,
) -> Result<ProcessInstInput> {
  
  #[allow(unused_mut)]
  let mut input = input;
  
  let dict_vec = get_dict(&[
    "bpm_inst_status",
    "bpm_biz_code",
  ]).await?;
  
  // 状态
  if input.status.is_none() {
    let status_dict = &dict_vec[0];
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
  
  // 关联业务
  if input.biz_code.is_none() {
    let biz_code_dict = &dict_vec[1];
    if let Some(biz_code_lbl) = input.biz_code_lbl.clone() {
      input.biz_code = biz_code_dict
        .iter()
        .find(|item| {
          item.lbl == biz_code_lbl
        })
        .map(|item| {
          item.val.parse().unwrap_or_default()
        });
    }
  }
  
  // 流程定义
  if input.process_def_id_lbl.is_some()
    && !input.process_def_id_lbl.as_ref().unwrap().is_empty()
    && input.process_def_id.is_none()
  {
    input.process_def_id_lbl = input.process_def_id_lbl.map(|item| 
      SmolStr::new(item.trim())
    );
    let model = crate::bpm::process_def::process_def_dao::find_one_process_def(
      crate::bpm::process_def::process_def_model::ProcessDefSearch {
        lbl: input.process_def_id_lbl.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(model) = model {
      input.process_def_id = model.id.into();
    }
  } else if
    (input.process_def_id_lbl.is_none() || input.process_def_id_lbl.as_ref().unwrap().is_empty())
    && input.process_def_id.is_some()
  {
    let process_def_model = crate::bpm::process_def::process_def_dao::find_one_process_def(
      crate::bpm::process_def::process_def_model::ProcessDefSearch {
        id: input.process_def_id.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(process_def_model) = process_def_model {
      input.process_def_id_lbl = process_def_model.lbl.into();
    }
  }
  
  // 流程版本
  if input.process_revision_id_lbl.is_some()
    && !input.process_revision_id_lbl.as_ref().unwrap().is_empty()
    && input.process_revision_id.is_none()
  {
    input.process_revision_id_lbl = input.process_revision_id_lbl.map(|item| 
      SmolStr::new(item.trim())
    );
    let model = crate::bpm::process_revision::process_revision_dao::find_one_process_revision(
      crate::bpm::process_revision::process_revision_model::ProcessRevisionSearch {
        lbl: input.process_revision_id_lbl.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(model) = model {
      input.process_revision_id = model.id.into();
    }
  } else if
    (input.process_revision_id_lbl.is_none() || input.process_revision_id_lbl.as_ref().unwrap().is_empty())
    && input.process_revision_id.is_some()
  {
    let process_revision_model = crate::bpm::process_revision::process_revision_dao::find_one_process_revision(
      crate::bpm::process_revision::process_revision_model::ProcessRevisionSearch {
        id: input.process_revision_id.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(process_revision_model) = process_revision_model {
      input.process_revision_id_lbl = process_revision_model.lbl.into();
    }
  }
  
  // 状态
  if
    input.status_lbl.is_some() && !input.status_lbl.as_ref().unwrap().is_empty()
    && input.status.is_none()
  {
    let status_dict = &dict_vec[0];
    let dict_model = status_dict.iter().find(|item| {
      item.lbl == input.status_lbl.clone().unwrap_or_default()
    });
    let val = dict_model.map(|item| SmolStr::new(&item.val));
    if let Some(val) = val {
      input.status = val.parse::<ProcessInstStatus>()?.into();
    }
  } else if
    (input.status_lbl.is_none() || input.status_lbl.as_ref().unwrap().is_empty())
    && input.status.is_some()
  {
    let status_dict = &dict_vec[0];
    let dict_model = status_dict.iter().find(|item| {
      item.val == input.status.unwrap_or_default().to_string()
    });
    let lbl = dict_model.map(|item| SmolStr::new(&item.lbl));
    input.status_lbl = lbl;
  }
  
  // 关联业务
  if
    input.biz_code_lbl.is_some() && !input.biz_code_lbl.as_ref().unwrap().is_empty()
    && input.biz_code.is_none()
  {
    let biz_code_dict = &dict_vec[1];
    let dict_model = biz_code_dict.iter().find(|item| {
      item.lbl == input.biz_code_lbl.clone().unwrap_or_default()
    });
    let val = dict_model.map(|item| SmolStr::new(&item.val));
    if let Some(val) = val {
      input.biz_code = val.parse::<ProcessInstBizCode>()?.into();
    }
  } else if
    (input.biz_code_lbl.is_none() || input.biz_code_lbl.as_ref().unwrap().is_empty())
    && input.biz_code.is_some()
  {
    let biz_code_dict = &dict_vec[1];
    let dict_model = biz_code_dict.iter().find(|item| {
      item.val == input.biz_code.unwrap_or_default().to_string()
    });
    let lbl = dict_model.map(|item| SmolStr::new(&item.lbl));
    input.biz_code_lbl = lbl;
  }
  
  // 发起人
  if input.start_usr_id_lbl.is_some()
    && !input.start_usr_id_lbl.as_ref().unwrap().is_empty()
    && input.start_usr_id.is_none()
  {
    input.start_usr_id_lbl = input.start_usr_id_lbl.map(|item| 
      SmolStr::new(item.trim())
    );
    let model = crate::base::usr::usr_dao::find_one_usr(
      crate::base::usr::usr_model::UsrSearch {
        lbl: input.start_usr_id_lbl.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(model) = model {
      input.start_usr_id = model.id.into();
    }
  } else if
    (input.start_usr_id_lbl.is_none() || input.start_usr_id_lbl.as_ref().unwrap().is_empty())
    && input.start_usr_id.is_some()
  {
    let usr_model = crate::base::usr::usr_dao::find_one_usr(
      crate::base::usr::usr_model::UsrSearch {
        id: input.start_usr_id.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(usr_model) = usr_model {
      input.start_usr_id_lbl = usr_model.lbl.into();
    }
  }
  
  // 发起人部门
  if input.start_dept_id_lbl.is_some()
    && !input.start_dept_id_lbl.as_ref().unwrap().is_empty()
    && input.start_dept_id.is_none()
  {
    input.start_dept_id_lbl = input.start_dept_id_lbl.map(|item| 
      SmolStr::new(item.trim())
    );
    let model = crate::base::dept::dept_dao::find_one_dept(
      crate::base::dept::dept_model::DeptSearch {
        lbl: input.start_dept_id_lbl.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(model) = model {
      input.start_dept_id = model.id.into();
    }
  } else if
    (input.start_dept_id_lbl.is_none() || input.start_dept_id_lbl.as_ref().unwrap().is_empty())
    && input.start_dept_id.is_some()
  {
    let dept_model = crate::base::dept::dept_dao::find_one_dept(
      crate::base::dept::dept_model::DeptSearch {
        id: input.start_dept_id.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(dept_model) = dept_model {
      input.start_dept_id_lbl = dept_model.lbl.into();
    }
  }
  
  Ok(input)
}

// MARK: creates_return_process_inst
/// 批量创建流程实例并返回
#[allow(dead_code)]
pub async fn creates_return_process_inst(
  inputs: Vec<ProcessInstInput>,
  options: Option<Options>,
) -> Result<Vec<ProcessInstModel>> {
  
  let table = get_table_name_process_inst();
  let method = "creates_return_process_inst";
  
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
  
  let models_process_inst = find_by_ids_process_inst(
    ids,
    options,
  ).await?;
  
  Ok(models_process_inst)
}

// MARK: creates_process_inst
/// 批量创建流程实例
pub async fn creates_process_inst(
  inputs: Vec<ProcessInstInput>,
  options: Option<Options>,
) -> Result<Vec<ProcessInstId>> {
  
  let table = get_table_name_process_inst();
  let method = "creates_process_inst";
  
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

/// 批量创建流程实例
#[allow(unused_variables, clippy::redundant_locals)]
async fn _creates(
  inputs: Vec<ProcessInstInput>,
  options: Option<Options>,
) -> Result<Vec<ProcessInstId>> {
  
  let table = get_table_name_process_inst();
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  
  let unique_type = options.as_ref()
    .and_then(|item|
      item.get_unique_type()
    )
    .unwrap_or_default();
  
  let mut ids2: Vec<ProcessInstId> = vec![];
  let mut inputs2: Vec<ProcessInstInput> = vec![];
  
  for input in inputs {
  
    if input.id.is_some() {
      return Err(eyre!("Can not set id when create in dao: {table}"));
    }
    
    let old_models = find_by_unique_process_inst(
      input.clone().into(),
      None,
      options,
    ).await?;
    
    if !old_models.is_empty() {
      let mut id: Option<ProcessInstId> = None;
      
      for old_model in old_models {
        let options = Options::from(options)
          .set_unique_type(unique_type);
        
        id = check_by_unique_process_inst(
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
  let mut sql_fields = String::with_capacity(80 * 18 + 20);
  
  sql_fields += "id";
  sql_fields += ",create_time";
  sql_fields += ",update_time";
  sql_fields += ",create_usr_id";
  sql_fields += ",create_usr_id_lbl";
  sql_fields += ",update_usr_id";
  sql_fields += ",update_usr_id_lbl";
  sql_fields += ",tenant_id";
  // 实例标题
  sql_fields += ",lbl";
  // 流程定义
  sql_fields += ",process_def_id_lbl";
  // 流程定义
  sql_fields += ",process_def_id";
  // 流程版本
  sql_fields += ",process_revision_id_lbl";
  // 流程版本
  sql_fields += ",process_revision_id";
  // 状态
  sql_fields += ",status";
  // 关联业务
  sql_fields += ",biz_code";
  // 业务数据ID
  sql_fields += ",form_data_id";
  // 发起人
  sql_fields += ",start_usr_id_lbl";
  // 发起人
  sql_fields += ",start_usr_id";
  // 发起人部门
  sql_fields += ",start_dept_id_lbl";
  // 发起人部门
  sql_fields += ",start_dept_id";
  // 当前活跃节点
  sql_fields += ",current_node_ids";
  // 当前节点名称
  sql_fields += ",current_node_lbls";
  // 总耗时(秒)
  sql_fields += ",duration_seconds";
  
  let inputs2_len = inputs2.len();
  let mut sql_values = String::with_capacity((2 * 18 + 3) * inputs2_len);
  let mut inputs2_ids = vec![];
  
  for (i, input) in inputs2
    .clone()
    .into_iter()
    .enumerate()
  {
    
    let id: ProcessInstId = get_short_uuid().into();
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
    // 实例标题
    if let Some(lbl) = input.lbl {
      sql_values += ",?";
      args.push(lbl.into());
    } else {
      sql_values += ",default";
    }
    // 流程定义
    if let Some(process_def_id_lbl) = input.process_def_id_lbl {
      if !process_def_id_lbl.is_empty() {
        sql_values += ",?";
        args.push(process_def_id_lbl.into());
      } else {
        sql_values += ",default";
      }
    } else {
      sql_values += ",default";
    }
    // 流程定义
    if let Some(process_def_id) = input.process_def_id {
      sql_values += ",?";
      args.push(process_def_id.into());
    } else {
      sql_values += ",default";
    }
    // 流程版本
    if let Some(process_revision_id_lbl) = input.process_revision_id_lbl {
      if !process_revision_id_lbl.is_empty() {
        sql_values += ",?";
        args.push(process_revision_id_lbl.into());
      } else {
        sql_values += ",default";
      }
    } else {
      sql_values += ",default";
    }
    // 流程版本
    if let Some(process_revision_id) = input.process_revision_id {
      sql_values += ",?";
      args.push(process_revision_id.into());
    } else {
      sql_values += ",default";
    }
    // 状态
    if let Some(status) = input.status {
      sql_values += ",?";
      args.push(status.into());
    } else {
      sql_values += ",default";
    }
    // 关联业务
    if let Some(biz_code) = input.biz_code {
      sql_values += ",?";
      args.push(biz_code.into());
    } else {
      sql_values += ",default";
    }
    // 业务数据ID
    if let Some(form_data_id) = input.form_data_id {
      sql_values += ",?";
      args.push(form_data_id.into());
    } else {
      sql_values += ",default";
    }
    // 发起人
    if let Some(start_usr_id_lbl) = input.start_usr_id_lbl {
      if !start_usr_id_lbl.is_empty() {
        sql_values += ",?";
        args.push(start_usr_id_lbl.into());
      } else {
        sql_values += ",default";
      }
    } else {
      sql_values += ",default";
    }
    // 发起人
    if let Some(start_usr_id) = input.start_usr_id {
      sql_values += ",?";
      args.push(start_usr_id.into());
    } else {
      sql_values += ",default";
    }
    // 发起人部门
    if let Some(start_dept_id_lbl) = input.start_dept_id_lbl {
      if !start_dept_id_lbl.is_empty() {
        sql_values += ",?";
        args.push(start_dept_id_lbl.into());
      } else {
        sql_values += ",default";
      }
    } else {
      sql_values += ",default";
    }
    // 发起人部门
    if let Some(start_dept_id) = input.start_dept_id {
      sql_values += ",?";
      args.push(start_dept_id.into());
    } else {
      sql_values += ",default";
    }
    // 当前活跃节点
    if let Some(current_node_ids) = input.current_node_ids {
      sql_values += ",?";
      args.push(current_node_ids.into());
    } else {
      sql_values += ",default";
    }
    // 当前节点名称
    if let Some(current_node_lbls) = input.current_node_lbls {
      sql_values += ",?";
      args.push(current_node_lbls.into());
    } else {
      sql_values += ",default";
    }
    // 总耗时(秒)
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

// MARK: create_return_process_inst
/// 创建流程实例并返回
#[allow(dead_code)]
pub async fn create_return_process_inst(
  #[allow(unused_mut)]
  mut input: ProcessInstInput,
  options: Option<Options>,
) -> Result<ProcessInstModel> {
  
  let id = create_process_inst(
    input.clone(),
    options,
  ).await?;
  
  let model_process_inst = find_by_id_process_inst(
    id,
    options,
  ).await?;
  
  let model_process_inst = match model_process_inst {
    Some(model) => model,
    None => {
      let err_msg = "create_return_process_inst: model_process_inst.is_none()";
      return Err(eyre!(
        ServiceException {
          message: err_msg.into(),
          trace: true,
          ..Default::default()
        },
      ));
    }
  };
  
  Ok(model_process_inst)
}

// MARK: create_process_inst
/// 创建流程实例
#[allow(dead_code)]
pub async fn create_process_inst(
  #[allow(unused_mut)]
  mut input: ProcessInstInput,
  options: Option<Options>,
) -> Result<ProcessInstId> {
  
  let table = get_table_name_process_inst();
  let method = "create_process_inst";
  
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

// MARK: update_tenant_by_id_process_inst
/// 流程实例根据id修改租户id
pub async fn update_tenant_by_id_process_inst(
  id: ProcessInstId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  let table = get_table_name_process_inst();
  let method = "update_tenant_by_id_process_inst";
  
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

// MARK: update_by_id_process_inst
/// 根据 id 修改流程实例
#[allow(unused_mut)]
#[allow(unused_variables)]
pub async fn update_by_id_process_inst(
  id: ProcessInstId,
  mut input: ProcessInstInput,
  options: Option<Options>,
) -> Result<ProcessInstId> {
  
  let table = get_table_name_process_inst();
  let method = "update_by_id_process_inst";
  
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
  
  let old_model = find_by_id_process_inst(
    id,
    options,
  ).await?;
  
  let old_model = match old_model {
    Some(model) => model,
    None => {
      let err_msg = "编辑失败, 此 流程实例 已被删除";
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
    
    let models = find_by_unique_process_inst(
      input.into(),
      None,
      options,
    ).await?;
    
    let models = models.into_iter()
      .filter(|item| 
        item.id != id
      )
      .collect::<Vec<ProcessInstModel>>();
    
    if !models.is_empty() {
      let unique_type = options
        .as_ref()
        .and_then(|item| item.get_unique_type())
        .unwrap_or(UniqueType::Throw);
      if unique_type == UniqueType::Throw {
        let err_msg = "流程实例 重复";
        return Err(eyre!(err_msg));
      } else if unique_type == UniqueType::Ignore {
        return Ok(id);
      }
    }
  }
  
  let mut args = QueryArgs::new();
  
  let mut sql_fields = String::with_capacity(80 * 18 + 20);
  
  let mut field_num: usize = 0;
  
  if let Some(tenant_id) = input.tenant_id {
    field_num += 1;
    sql_fields += "tenant_id=?,";
    args.push(tenant_id.into());
  }
  // 实例标题
  if let Some(lbl) = input.lbl.clone() {
    field_num += 1;
    sql_fields += "lbl=?,";
    args.push(lbl.into());
  }
  // 流程定义
  if let Some(process_def_id_lbl) = input.process_def_id_lbl {
    if !process_def_id_lbl.is_empty() {
      field_num += 1;
      sql_fields += "process_def_id_lbl=?,";
      args.push(process_def_id_lbl.into());
    }
  }
  // 流程定义
  if let Some(process_def_id) = input.process_def_id {
    field_num += 1;
    sql_fields += "process_def_id=?,";
    args.push(process_def_id.into());
  }
  // 流程版本
  if let Some(process_revision_id_lbl) = input.process_revision_id_lbl {
    if !process_revision_id_lbl.is_empty() {
      field_num += 1;
      sql_fields += "process_revision_id_lbl=?,";
      args.push(process_revision_id_lbl.into());
    }
  }
  // 流程版本
  if let Some(process_revision_id) = input.process_revision_id {
    field_num += 1;
    sql_fields += "process_revision_id=?,";
    args.push(process_revision_id.into());
  }
  // 状态
  if let Some(status) = input.status {
    field_num += 1;
    sql_fields += "status=?,";
    args.push(status.into());
  }
  // 关联业务
  if let Some(biz_code) = input.biz_code {
    field_num += 1;
    sql_fields += "biz_code=?,";
    args.push(biz_code.into());
  }
  // 业务数据ID
  if let Some(form_data_id) = input.form_data_id.clone() {
    field_num += 1;
    sql_fields += "form_data_id=?,";
    args.push(form_data_id.into());
  }
  // 发起人
  if let Some(start_usr_id_lbl) = input.start_usr_id_lbl {
    if !start_usr_id_lbl.is_empty() {
      field_num += 1;
      sql_fields += "start_usr_id_lbl=?,";
      args.push(start_usr_id_lbl.into());
    }
  }
  // 发起人
  if let Some(start_usr_id) = input.start_usr_id {
    field_num += 1;
    sql_fields += "start_usr_id=?,";
    args.push(start_usr_id.into());
  }
  // 发起人部门
  if let Some(start_dept_id_lbl) = input.start_dept_id_lbl {
    if !start_dept_id_lbl.is_empty() {
      field_num += 1;
      sql_fields += "start_dept_id_lbl=?,";
      args.push(start_dept_id_lbl.into());
    }
  }
  // 发起人部门
  if let Some(start_dept_id) = input.start_dept_id {
    field_num += 1;
    sql_fields += "start_dept_id=?,";
    args.push(start_dept_id.into());
  }
  // 当前活跃节点
  if let Some(current_node_ids) = input.current_node_ids {
    field_num += 1;
    sql_fields += "current_node_ids=?,";
    args.push(current_node_ids.into());
  }
  // 当前节点名称
  if let Some(current_node_lbls) = input.current_node_lbls.clone() {
    field_num += 1;
    sql_fields += "current_node_lbls=?,";
    args.push(current_node_lbls.into());
  }
  // 总耗时(秒)
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

// MARK: update_by_id_return_process_inst
/// 根据 id 更新流程实例, 并返回更新后的数据
#[allow(dead_code)]
pub async fn update_by_id_return_process_inst(
  id: ProcessInstId,
  input: ProcessInstInput,
  options: Option<Options>,
) -> Result<ProcessInstModel> {
  
  update_by_id_process_inst(
    id,
    input,
    options,
  ).await?;
  
  let model = find_by_id_process_inst(
    id,
    options,
  ).await?;
  
  match model {
    Some(model) => Ok(model),
    None => Err(eyre!(
      "流程实例 update_by_id_return_process_inst id: {id}",
    )),
  }
}

/// 获取需要清空缓存的表名
#[allow(dead_code)]
fn get_cache_tables() -> Vec<&'static str> {
  let table = get_table_name_process_inst();
  vec![
    table,
    "bpm_process_def",
    "bpm_process_revision",
    "base_dept",
  ]
}

// MARK: del_cache_process_inst
/// 清空缓存
#[allow(dead_code)]
pub async fn del_cache_process_inst() -> Result<()> {
  
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

// MARK: delete_by_ids_process_inst
/// 根据 ids 删除流程实例
#[allow(unused_variables)]
pub async fn delete_by_ids_process_inst(
  ids: Vec<ProcessInstId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_process_inst();
  let method = "delete_by_ids_process_inst";
  
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
  
  let old_models = find_by_ids_ok_process_inst(
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

// MARK: revert_by_ids_process_inst
/// 根据 ids 还原流程实例
pub async fn revert_by_ids_process_inst(
  ids: Vec<ProcessInstId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_process_inst();
  let method = "revert_by_ids_process_inst";
  
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
    
    let mut old_model = find_one_process_inst(
      ProcessInstSearch {
        id: Some(id),
        is_deleted: Some(1),
        ..Default::default()
      }.into(),
      None,
      options,
    ).await?;
    
    if old_model.is_none() {
      old_model = find_by_id_process_inst(
        id,
        options,
      ).await?;
    }
    
    let old_model = match old_model {
      Some(model) => model,
      None => continue,
    };
    
    {
      let mut input: ProcessInstInput = old_model.clone().into();
      input.id = None;
      
      let models = find_by_unique_process_inst(
        input.into(),
        None,
        options,
      ).await?;
      
      let models: Vec<ProcessInstModel> = models
        .into_iter()
        .filter(|item| 
          item.id != id
        )
        .collect();
      
      if !models.is_empty() {
        let err_msg = "流程实例 重复";
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

// MARK: force_delete_by_ids_process_inst
/// 根据 ids 彻底删除流程实例
#[allow(unused_variables)]
pub async fn force_delete_by_ids_process_inst(
  ids: Vec<ProcessInstId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_process_inst();
  let method = "force_delete_by_ids_process_inst";
  
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
    
    let old_model = find_one_process_inst(
      Some(ProcessInstSearch {
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

// MARK: validate_option_process_inst
/// 校验流程实例是否存在
#[allow(dead_code)]
pub async fn validate_option_process_inst(
  model: Option<ProcessInstModel>,
) -> Result<ProcessInstModel> {
  
  let model = match model {
    Some(model) => model,
    None => {
      let err_msg = SmolStr::new("流程实例不存在");
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
