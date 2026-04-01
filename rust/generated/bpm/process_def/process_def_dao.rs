
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

use super::process_def_model::*;

use crate::base::tenant::tenant_model::TenantId;
use crate::bpm::process_revision::process_revision_model::ProcessRevisionId;
use crate::base::usr::usr_model::UsrId;

use crate::base::usr::usr_dao::find_by_id_usr;

#[allow(unused_variables)]
async fn get_where_query(
  args: &mut QueryArgs,
  search: Option<&ProcessDefSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let is_deleted = search
    .and_then(|item| item.is_deleted)
    .unwrap_or(0);
  
  let mut where_query = String::with_capacity(80 * 17 * 2);
  
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
    let ids: Option<Vec<ProcessDefId>> = match search {
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
    if let Some(code_like) = code_like && !code_like.is_empty() {
      where_query.push_str(" and t.code like ?");
      args.push(format!("%{}%", sql_like(&code_like)).into());
    }
  }
  // 流程名称
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
  // 关联业务
  {
    let biz_code: Option<Vec<ProcessDefBizCode>> = match search {
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
  // 当前生效版本
  {
    let current_revision_id: Option<Vec<ProcessRevisionId>> = match search {
      Some(item) => item.current_revision_id.clone(),
      None => None,
    };
    if let Some(current_revision_id) = current_revision_id {
      let arg = {
        if current_revision_id.is_empty() {
          SmolStr::new("null")
        } else {
          let mut items = Vec::with_capacity(current_revision_id.len());
          for item in current_revision_id {
            args.push(item.into());
            items.push("?");
          }
          SmolStr::new(items.join(","))
        }
      };
      where_query.push_str(" and t.current_revision_id in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let current_revision_id_is_null: bool = match search {
      Some(item) => item.current_revision_id_is_null.unwrap_or(false),
      None => false,
    };
    if current_revision_id_is_null {
      where_query.push_str(" and t.current_revision_id is null");
    }
  }
  {
    let current_revision_id_lbl: Option<Vec<SmolStr>> = match search {
      Some(item) => item.current_revision_id_lbl.clone(),
      None => None,
    };
    if let Some(current_revision_id_lbl) = current_revision_id_lbl {
      let arg = {
        if current_revision_id_lbl.is_empty() {
          SmolStr::new("null")
        } else {
          let mut items = Vec::with_capacity(current_revision_id_lbl.len());
          for item in current_revision_id_lbl {
            args.push(item.into());
            items.push("?");
          }
          SmolStr::new(items.join(","))
        }
      };
      where_query.push_str(" and t.current_revision_id_lbl in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
    {
      let current_revision_id_lbl_like = match search {
        Some(item) => item.current_revision_id_lbl_like.clone(),
        None => None,
      };
      if let Some(current_revision_id_lbl_like) = current_revision_id_lbl_like {
        if !current_revision_id_lbl_like.is_empty() {
          where_query.push_str(" and current_revision_id_lbl like ?");
          args.push(format!("%{}%", sql_like(&current_revision_id_lbl_like)).into());
        }
      }
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
          SmolStr::new("null")
        } else {
          let mut items = Vec::with_capacity(is_enabled.len());
          for item in is_enabled {
            args.push(item.into());
            items.push("?");
          }
          SmolStr::new(items.join(","))
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
  // 流程描述
  {
    let description = match search {
      Some(item) => item.description.clone(),
      None => None,
    };
    if let Some(description) = description {
      where_query.push_str(" and t.description=?");
      args.push(description.into());
    }
    let description_like = match search {
      Some(item) => item.description_like.clone(),
      None => None,
    };
    if let Some(description_like) = description_like && !description_like.is_empty() {
      where_query.push_str(" and t.description like ?");
      args.push(format!("%{}%", sql_like(&description_like)).into());
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
  // 流程图
  {
    let graph_json = match search {
      Some(item) => item.graph_json.clone(),
      None => None,
    };
    if let Some(graph_json) = graph_json {
      where_query.push_str(" and t.graph_json=?");
      args.push(graph_json.into());
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
  search: Option<&ProcessDefSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let from_query = r#"bpm_process_def t"#.to_owned();
  Ok(from_query)
}

// MARK: find_all_process_def
/// 根据搜索条件和分页查找流程定义列表
#[allow(unused_mut, unused_variables)]
pub async fn find_all_process_def(
  search: Option<ProcessDefSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<ProcessDefModel>> {
  
  let table = get_table_name_process_def();
  let method = "find_all_process_def";
  
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
  // 当前生效版本
  if let Some(search) = &search && let Some(current_revision_id) = &search.current_revision_id {
    let len = current_revision_id.len();
    if len == 0 {
      return Ok(vec![]);
    }
    if len > ids_limit {
      return Err(eyre!("search.current_revision_id.length > {ids_limit}"));
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
  
  let mut res: Vec<ProcessDefModel> = query(
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
    "bpm_biz_code",
    "is_enabled",
  ]).await?;
  let [
    biz_code_dict,
    is_enabled_dict,
  ]: [Vec<_>; 2] = dict_vec
    .try_into()
    .map_err(|err| eyre!("{:#?}", err))?;
  
  #[allow(unused_variables)]
  for model in &mut res {
    
    // 关联业务
    model.biz_code_lbl = {
      biz_code_dict
        .iter()
        .find(|item| item.val == model.biz_code.as_str())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.biz_code.clone().into())
    };
    
    // 启用
    model.is_enabled_lbl = {
      is_enabled_dict
        .iter()
        .find(|item| item.val == model.is_enabled.to_string())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.is_enabled.to_string().into())
    };
    
  }
  
  Ok(res)
}

// MARK: find_count_process_def
/// 根据条件查找流程定义总数
pub async fn find_count_process_def(
  search: Option<ProcessDefSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_process_def();
  let method = "find_count_process_def";
  
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
  // 当前生效版本
  if let Some(search) = &search && search.current_revision_id.is_some() {
    let len = search.current_revision_id.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.current_revision_id.length > {ids_limit}"));
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

// MARK: get_field_comments_process_def
/// 获取流程定义字段注释
#[allow(unused_mut)]
pub async fn get_field_comments_process_def(
  _options: Option<Options>,
) -> Result<ProcessDefFieldComment> {
  
  let mut field_comments = ProcessDefFieldComment {
    id: "ID".into(),
    code: "编码".into(),
    lbl: "流程名称".into(),
    biz_code: "关联业务".into(),
    biz_code_lbl: "关联业务".into(),
    current_revision_id: "当前生效版本".into(),
    current_revision_id_lbl: "当前生效版本".into(),
    is_enabled: "启用".into(),
    is_enabled_lbl: "启用".into(),
    order_by: "排序".into(),
    description: "流程描述".into(),
    rem: "备注".into(),
    graph_json: "流程图".into(),
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

// MARK: find_one_ok_process_def
/// 根据条件查找第一个流程定义, 如果不存在则抛错
#[allow(dead_code)]
pub async fn find_one_ok_process_def(
  search: Option<ProcessDefSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<ProcessDefModel> {
  
  let table = get_table_name_process_def();
  let method = "find_one_ok_process_def";
  
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
  
  let process_def_model = find_one_process_def(
    search,
    sort,
    options,
  ).await?;
  
  let Some(process_def_model) = process_def_model else {
    let err_msg = "此 流程定义 已被删除";
    return Err(eyre!(err_msg));
  };
  
  Ok(process_def_model)
}

// MARK: find_one_process_def
/// 根据条件查找第一个流程定义
#[allow(dead_code)]
pub async fn find_one_process_def(
  search: Option<ProcessDefSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<ProcessDefModel>> {
  
  let table = get_table_name_process_def();
  let method = "find_one_process_def";
  
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
  
  let res = find_all_process_def(
    search,
    page,
    sort,
    options,
  ).await?;
  
  let model: Option<ProcessDefModel> = res.into_iter().next();
  
  Ok(model)
}

// MARK: find_by_id_ok_process_def
/// 根据 id 查找流程定义, 如果不存在则抛错
#[allow(dead_code)]
pub async fn find_by_id_ok_process_def(
  id: ProcessDefId,
  options: Option<Options>,
) -> Result<ProcessDefModel> {
  
  let table = get_table_name_process_def();
  let method = "find_by_id_ok_process_def";
  
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
  
  let process_def_model = find_by_id_process_def(
    id,
    options,
  ).await?;
  
  let Some(process_def_model) = process_def_model else {
    let err_msg = SmolStr::new("此 流程定义 已被删除");
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
  
  Ok(process_def_model)
}

// MARK: find_by_id_process_def
/// 根据 id 查找流程定义
pub async fn find_by_id_process_def(
  id: ProcessDefId,
  options: Option<Options>,
) -> Result<Option<ProcessDefModel>> {
  
  let table = get_table_name_process_def();
  let method = "find_by_id_process_def";
  
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
  
  let search = ProcessDefSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let process_def_model = find_one_process_def(
    search,
    None,
    options,
  ).await?;
  
  Ok(process_def_model)
}

// MARK: find_by_ids_ok_process_def
/// 根据 ids 查找流程定义, 出现查询不到的 id 则报错
#[allow(dead_code)]
pub async fn find_by_ids_ok_process_def(
  ids: Vec<ProcessDefId>,
  options: Option<Options>,
) -> Result<Vec<ProcessDefModel>> {
  
  let table = get_table_name_process_def();
  let method = "find_by_ids_ok_process_def";
  
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
  
  let process_def_models = find_by_ids_process_def(
    ids.clone(),
    options,
  ).await?;
  
  if process_def_models.len() != len {
    let err_msg = SmolStr::new("此 流程定义 已被删除");
    return Err(eyre!(err_msg));
  }
  
  let process_def_models = ids
    .into_iter()
    .map(|id| {
      let model = process_def_models
        .iter()
        .find(|item| item.id == id);
      if let Some(model) = model {
        return Ok(model.clone());
      }
      let err_msg = SmolStr::new("此 流程定义 已经被删除");
      Err(eyre!(err_msg))
    })
    .collect::<Result<Vec<ProcessDefModel>>>()?;
  
  Ok(process_def_models)
}

// MARK: find_by_ids_process_def
/// 根据 ids 查找流程定义
#[allow(dead_code)]
pub async fn find_by_ids_process_def(
  ids: Vec<ProcessDefId>,
  options: Option<Options>,
) -> Result<Vec<ProcessDefModel>> {
  
  let table = get_table_name_process_def();
  let method = "find_by_ids_process_def";
  
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
  
  let search = ProcessDefSearch {
    ids: Some(ids.clone()),
    ..Default::default()
  }.into();
  
  let process_def_models = find_all_process_def(
    search,
    None,
    None,
    options,
  ).await?;
  
  let process_def_models = ids
    .into_iter()
    .filter_map(|id| {
      process_def_models
        .iter()
        .find(|item| item.id == id)
        .cloned()
    })
    .collect::<Vec<ProcessDefModel>>();
  
  Ok(process_def_models)
}

// MARK: exists_process_def
/// 根据搜索条件判断流程定义是否存在
#[allow(dead_code)]
pub async fn exists_process_def(
  search: Option<ProcessDefSearch>,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = get_table_name_process_def();
  let method = "exists_process_def";
  
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
  // 当前生效版本
  if let Some(search) = &search && search.current_revision_id.is_some() {
    let len = search.current_revision_id.as_ref().unwrap().len();
    if len == 0 {
      return Ok(false);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.current_revision_id.length > {ids_limit}"));
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

// MARK: exists_by_id_process_def
/// 根据 id 判断流程定义是否存在
#[allow(dead_code)]
pub async fn exists_by_id_process_def(
  id: ProcessDefId,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = get_table_name_process_def();
  let method = "exists_by_id_process_def";
  
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
  
  let search = ProcessDefSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let exists = exists_process_def(
    search,
    options,
  ).await?;
  
  Ok(exists)
}

// MARK: find_by_unique_process_def
/// 通过唯一约束获得数据列表
#[allow(unused_variables)]
pub async fn find_by_unique_process_def(
  search: ProcessDefSearch,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<ProcessDefModel>> {
  
  let table = get_table_name_process_def();
  let method = "find_by_unique_process_def";
  
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
    let model = find_by_id_process_def(
      id,
      options,
    ).await?;
    return Ok(model.map_or_else(Vec::new, |m| vec![m]));
  }
  
  let mut models: Vec<ProcessDefModel> = vec![];
  
  let mut models_tmp = {
    if
      search.code.is_none()
    {
      return Ok(vec![]);
    }
    
    let search = ProcessDefSearch {
      code: search.code.clone(),
      ..Default::default()
    };
    
    find_all_process_def(
      search.into(),
      None,
      sort.clone(),
      options,
    ).await?
  };
  models.append(&mut models_tmp);
  
  let mut models_tmp = {
    if
      search.lbl.is_none()
    {
      return Ok(vec![]);
    }
    
    let search = ProcessDefSearch {
      lbl: search.lbl.clone(),
      ..Default::default()
    };
    
    find_all_process_def(
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
  input: &ProcessDefInput,
  model: &ProcessDefModel,
  options: Option<&Options>,
) -> bool {
  if input.id.as_ref().is_some() {
    return input.id.as_ref().unwrap() == &model.id;
  }
  
  let is_silent_mode = get_is_silent_mode(options);
  
  if
    input.code.as_ref().is_some() && input.code.as_ref().unwrap() == &model.code
  {
    return true;
  }
  
  if
    input.lbl.as_ref().is_some() && input.lbl.as_ref().unwrap() == &model.lbl
  {
    return true;
  }
  false
}

// MARK: check_by_unique_process_def
/// 通过唯一约束检查数据是否已经存在
#[allow(unused_variables)]
pub async fn check_by_unique_process_def(
  input: ProcessDefInput,
  model: ProcessDefModel,
  options: Option<Options>,
) -> Result<Option<ProcessDefId>> {
  
  let table = get_table_name_process_def();
  let method = "check_by_unique_process_def";
  
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
    let id = update_by_id_process_def(
      model.id,
      input,
      options,
    ).await?;
    return Ok(id.into());
  }
  if unique_type == UniqueType::Throw {
    let err_msg = "流程定义 重复";
    return Err(eyre!(err_msg));
  }
  Ok(None)
}

// MARK: set_id_by_lbl_process_def
/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(unused_variables, dead_code)]
pub async fn set_id_by_lbl_process_def(
  input: ProcessDefInput,
) -> Result<ProcessDefInput> {
  
  #[allow(unused_mut)]
  let mut input = input;
  
  let dict_vec = get_dict(&[
    "bpm_biz_code",
    "is_enabled",
  ]).await?;
  
  // 关联业务
  if input.biz_code.is_none() {
    let biz_code_dict = &dict_vec[0];
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
  
  // 关联业务
  if
    input.biz_code_lbl.is_some() && !input.biz_code_lbl.as_ref().unwrap().is_empty()
    && input.biz_code.is_none()
  {
    let biz_code_dict = &dict_vec[0];
    let dict_model = biz_code_dict.iter().find(|item| {
      item.lbl == input.biz_code_lbl.clone().unwrap_or_default()
    });
    let val = dict_model.map(|item| SmolStr::new(&item.val));
    if let Some(val) = val {
      input.biz_code = val.parse::<ProcessDefBizCode>()?.into();
    }
  } else if
    (input.biz_code_lbl.is_none() || input.biz_code_lbl.as_ref().unwrap().is_empty())
    && input.biz_code.is_some()
  {
    let biz_code_dict = &dict_vec[0];
    let dict_model = biz_code_dict.iter().find(|item| {
      item.val == input.biz_code.unwrap_or_default().to_string()
    });
    let lbl = dict_model.map(|item| SmolStr::new(&item.lbl));
    input.biz_code_lbl = lbl;
  }
  
  // 当前生效版本
  if input.current_revision_id_lbl.is_some()
    && !input.current_revision_id_lbl.as_ref().unwrap().is_empty()
    && input.current_revision_id.is_none()
  {
    input.current_revision_id_lbl = input.current_revision_id_lbl.map(|item| 
      SmolStr::new(item.trim())
    );
    let model = crate::bpm::process_revision::process_revision_dao::find_one_process_revision(
      crate::bpm::process_revision::process_revision_model::ProcessRevisionSearch {
        lbl: input.current_revision_id_lbl.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(model) = model {
      input.current_revision_id = model.id.into();
    }
  } else if
    (input.current_revision_id_lbl.is_none() || input.current_revision_id_lbl.as_ref().unwrap().is_empty())
    && input.current_revision_id.is_some()
  {
    let process_revision_model = crate::bpm::process_revision::process_revision_dao::find_one_process_revision(
      crate::bpm::process_revision::process_revision_model::ProcessRevisionSearch {
        id: input.current_revision_id.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(process_revision_model) = process_revision_model {
      input.current_revision_id_lbl = process_revision_model.lbl.into();
    }
  }
  
  // 启用
  if
    input.is_enabled_lbl.is_some() && !input.is_enabled_lbl.as_ref().unwrap().is_empty()
    && input.is_enabled.is_none()
  {
    let is_enabled_dict = &dict_vec[1];
    let dict_model = is_enabled_dict.iter().find(|item| {
      item.lbl == input.is_enabled_lbl.clone().unwrap_or_default()
    });
    let val = dict_model.map(|item| SmolStr::new(&item.val));
    if let Some(val) = val {
      input.is_enabled = val.parse::<u8>()?.into();
    }
  } else if
    (input.is_enabled_lbl.is_none() || input.is_enabled_lbl.as_ref().unwrap().is_empty())
    && input.is_enabled.is_some()
  {
    let is_enabled_dict = &dict_vec[1];
    let dict_model = is_enabled_dict.iter().find(|item| {
      item.val == input.is_enabled.unwrap_or_default().to_string()
    });
    let lbl = dict_model.map(|item| SmolStr::new(&item.lbl));
    input.is_enabled_lbl = lbl;
  }
  
  Ok(input)
}

// MARK: creates_return_process_def
/// 批量创建流程定义并返回
#[allow(dead_code)]
pub async fn creates_return_process_def(
  inputs: Vec<ProcessDefInput>,
  options: Option<Options>,
) -> Result<Vec<ProcessDefModel>> {
  
  let table = get_table_name_process_def();
  let method = "creates_return_process_def";
  
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
  
  let models_process_def = find_by_ids_process_def(
    ids,
    options,
  ).await?;
  
  Ok(models_process_def)
}

// MARK: creates_process_def
/// 批量创建流程定义
pub async fn creates_process_def(
  inputs: Vec<ProcessDefInput>,
  options: Option<Options>,
) -> Result<Vec<ProcessDefId>> {
  
  let table = get_table_name_process_def();
  let method = "creates_process_def";
  
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

/// 批量创建流程定义
#[allow(unused_variables, clippy::redundant_locals)]
async fn _creates(
  inputs: Vec<ProcessDefInput>,
  options: Option<Options>,
) -> Result<Vec<ProcessDefId>> {
  
  let table = get_table_name_process_def();
  
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
    ) = find_auto_code_process_def(options).await?;
    input.code_seq = Some(code_seq);
    input.code = Some(code);
  }
  
  let mut ids2: Vec<ProcessDefId> = vec![];
  let mut inputs2: Vec<ProcessDefInput> = vec![];
  
  for input in inputs {
  
    if input.id.is_some() {
      return Err(eyre!("Can not set id when create in dao: {table}"));
    }
    
    let old_models = find_by_unique_process_def(
      input.clone().into(),
      None,
      options,
    ).await?;
    
    if !old_models.is_empty() {
      let mut id: Option<ProcessDefId> = None;
      
      for old_model in old_models {
        let options = Options::from(options)
          .set_unique_type(unique_type);
        
        id = check_by_unique_process_def(
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
  let mut sql_fields = String::with_capacity(80 * 17 + 20);
  
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
  // 编码
  sql_fields += ",code";
  // 流程名称
  sql_fields += ",lbl";
  // 关联业务
  sql_fields += ",biz_code";
  // 当前生效版本
  sql_fields += ",current_revision_id_lbl";
  // 当前生效版本
  sql_fields += ",current_revision_id";
  // 启用
  sql_fields += ",is_enabled";
  // 排序
  sql_fields += ",order_by";
  // 流程描述
  sql_fields += ",description";
  // 备注
  sql_fields += ",rem";
  // 流程图
  sql_fields += ",graph_json";
  
  let inputs2_len = inputs2.len();
  let mut sql_values = String::with_capacity((2 * 17 + 3) * inputs2_len);
  let mut inputs2_ids = vec![];
  
  for (i, input) in inputs2
    .clone()
    .into_iter()
    .enumerate()
  {
    
    let id: ProcessDefId = get_short_uuid().into();
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
    // 编码-序列号
    if let Some(code_seq) = input.code_seq {
      sql_values += ",?";
      args.push(code_seq.into());
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
    // 流程名称
    if let Some(lbl) = input.lbl {
      sql_values += ",?";
      args.push(lbl.into());
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
    // 当前生效版本
    if let Some(current_revision_id_lbl) = input.current_revision_id_lbl {
      if !current_revision_id_lbl.is_empty() {
        sql_values += ",?";
        args.push(current_revision_id_lbl.into());
      } else {
        sql_values += ",default";
      }
    } else {
      sql_values += ",default";
    }
    // 当前生效版本
    if let Some(current_revision_id) = input.current_revision_id {
      sql_values += ",?";
      args.push(current_revision_id.into());
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
    // 流程描述
    if let Some(description) = input.description {
      sql_values += ",?";
      args.push(description.into());
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
    // 流程图
    if let Some(graph_json) = input.graph_json {
      sql_values += ",?";
      args.push(graph_json.into());
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

// MARK: find_auto_code_process_def
/// 获得 流程定义 自动编码
pub async fn find_auto_code_process_def(
  options: Option<Options>,
) -> Result<(u32, SmolStr)> {
  
  let table = get_table_name_process_def();
  let method = "find_auto_code_process_def";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    if let Some(options) = &options {
      msg += &format!(" options: {options:?}");
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let model = find_one_process_def(
    None,
    Some(vec![
      SortInput {
        prop: "code_seq".into(),
        order: SortOrderEnum::Desc,
      },
    ]),
    options,
  ).await?;
  
  let code_seq = model
    .as_ref()
    .map_or(0, |item| item.code_seq) + 1;
  
  let model_deleted = find_one_process_def(
    Some(ProcessDefSearch {
      is_deleted: Some(1),
      ..Default::default()
    }),
    Some(vec![
      SortInput {
        prop: "code_seq".into(),
        order: SortOrderEnum::Desc,
      },
    ]),
    options,
  ).await?;
  
  let code_seq_deleted = model_deleted
    .as_ref()
    .map_or(0, |item| item.code_seq) + 1;
  
  let code_seq = if code_seq_deleted > code_seq {
    code_seq_deleted
  } else {
    code_seq
  };
  
  let code = format!("BPM{code_seq:04}");
  
  Ok((code_seq, SmolStr::new(&code)))
}

// MARK: create_return_process_def
/// 创建流程定义并返回
#[allow(dead_code)]
pub async fn create_return_process_def(
  #[allow(unused_mut)]
  mut input: ProcessDefInput,
  options: Option<Options>,
) -> Result<ProcessDefModel> {
  
  let id = create_process_def(
    input.clone(),
    options,
  ).await?;
  
  let model_process_def = find_by_id_process_def(
    id,
    options,
  ).await?;
  
  let model_process_def = match model_process_def {
    Some(model) => model,
    None => {
      let err_msg = "create_return_process_def: model_process_def.is_none()";
      return Err(eyre!(
        ServiceException {
          message: err_msg.into(),
          trace: true,
          ..Default::default()
        },
      ));
    }
  };
  
  Ok(model_process_def)
}

// MARK: create_process_def
/// 创建流程定义
#[allow(dead_code)]
pub async fn create_process_def(
  #[allow(unused_mut)]
  mut input: ProcessDefInput,
  options: Option<Options>,
) -> Result<ProcessDefId> {
  
  let table = get_table_name_process_def();
  let method = "create_process_def";
  
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

// MARK: update_tenant_by_id_process_def
/// 流程定义根据id修改租户id
pub async fn update_tenant_by_id_process_def(
  id: ProcessDefId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  let table = get_table_name_process_def();
  let method = "update_tenant_by_id_process_def";
  
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

// MARK: update_by_id_process_def
/// 根据 id 修改流程定义
#[allow(unused_mut)]
#[allow(unused_variables)]
pub async fn update_by_id_process_def(
  id: ProcessDefId,
  mut input: ProcessDefInput,
  options: Option<Options>,
) -> Result<ProcessDefId> {
  
  let table = get_table_name_process_def();
  let method = "update_by_id_process_def";
  
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
  
  let old_model = find_by_id_process_def(
    id,
    options,
  ).await?;
  
  let old_model = match old_model {
    Some(model) => model,
    None => {
      let err_msg = "编辑失败, 此 流程定义 已被删除";
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
    
    let models = find_by_unique_process_def(
      input.into(),
      None,
      options,
    ).await?;
    
    let models = models.into_iter()
      .filter(|item| 
        item.id != id
      )
      .collect::<Vec<ProcessDefModel>>();
    
    if !models.is_empty() {
      let unique_type = options
        .as_ref()
        .and_then(|item| item.get_unique_type())
        .unwrap_or(UniqueType::Throw);
      if unique_type == UniqueType::Throw {
        let err_msg = "流程定义 重复";
        return Err(eyre!(err_msg));
      } else if unique_type == UniqueType::Ignore {
        return Ok(id);
      }
    }
  }
  
  // 如果更新了 graph_json, 需要校验当前版本是否有正在运行的实例
  let graph_json_to_sync = input.graph_json.clone();
  if graph_json_to_sync.is_some() && !old_model.current_revision_id.is_empty() {
    let has_running = crate::bpm::process_inst::process_inst_dao::exists_process_inst(
      Some(crate::bpm::process_inst::process_inst_model::ProcessInstSearch {
        process_revision_id: Some(vec![old_model.current_revision_id.clone()]),
        status: Some(vec![crate::bpm::process_inst::process_inst_model::ProcessInstStatus::Running]),
        ..Default::default()
      }),
      options,
    ).await?;
    if has_running {
      return Err(eyre!("此流程版本有正在运行的实例, 不允许修改"));
    }
  }
  
  let mut args = QueryArgs::new();
  
  let mut sql_fields = String::with_capacity(80 * 17 + 20);
  
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
  // 编码
  if let Some(code) = input.code.clone() {
    field_num += 1;
    sql_fields += "code=?,";
    args.push(code.into());
  }
  // 流程名称
  if let Some(lbl) = input.lbl.clone() {
    field_num += 1;
    sql_fields += "lbl=?,";
    args.push(lbl.into());
  }
  // 关联业务
  if let Some(biz_code) = input.biz_code {
    field_num += 1;
    sql_fields += "biz_code=?,";
    args.push(biz_code.into());
  }
  // 当前生效版本
  if let Some(current_revision_id_lbl) = input.current_revision_id_lbl {
    if !current_revision_id_lbl.is_empty() {
      field_num += 1;
      sql_fields += "current_revision_id_lbl=?,";
      args.push(current_revision_id_lbl.into());
    }
  }
  // 当前生效版本
  if let Some(current_revision_id) = input.current_revision_id {
    field_num += 1;
    sql_fields += "current_revision_id=?,";
    args.push(current_revision_id.into());
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
  // 流程描述
  if let Some(description) = input.description.clone() {
    field_num += 1;
    sql_fields += "description=?,";
    args.push(description.into());
  }
  // 备注
  if let Some(rem) = input.rem.clone() {
    field_num += 1;
    sql_fields += "rem=?,";
    args.push(rem.into());
  }
  // 流程图
  if let Some(graph_json) = input.graph_json {
    field_num += 1;
    sql_fields += "graph_json=?,";
    args.push(graph_json.into());
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
    
    // 同步 graph_json 到当前版本
    if let Some(graph_json) = graph_json_to_sync {
      if !old_model.current_revision_id.is_empty() {
        crate::bpm::process_revision::process_revision_dao::update_by_id_process_revision(
          old_model.current_revision_id,
          crate::bpm::process_revision::process_revision_model::ProcessRevisionInput {
            graph_json: Some(graph_json),
            ..Default::default()
          },
          options,
        ).await?;
      }
    }
    
  }
  
  Ok(id)
}

// MARK: update_by_id_return_process_def
/// 根据 id 更新流程定义, 并返回更新后的数据
#[allow(dead_code)]
pub async fn update_by_id_return_process_def(
  id: ProcessDefId,
  input: ProcessDefInput,
  options: Option<Options>,
) -> Result<ProcessDefModel> {
  
  update_by_id_process_def(
    id,
    input,
    options,
  ).await?;
  
  let model = find_by_id_process_def(
    id,
    options,
  ).await?;
  
  match model {
    Some(model) => Ok(model),
    None => Err(eyre!(
      "流程定义 update_by_id_return_process_def id: {id}",
    )),
  }
}

/// 获取需要清空缓存的表名
#[allow(dead_code)]
fn get_cache_tables() -> Vec<&'static str> {
  let table = get_table_name_process_def();
  vec![
    table,
    "bpm_process_revision",
  ]
}

// MARK: del_cache_process_def
/// 清空缓存
#[allow(dead_code)]
pub async fn del_cache_process_def() -> Result<()> {
  
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

// MARK: delete_by_ids_process_def
/// 根据 ids 删除流程定义
#[allow(unused_variables)]
pub async fn delete_by_ids_process_def(
  ids: Vec<ProcessDefId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_process_def();
  let method = "delete_by_ids_process_def";
  
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
  
  let old_models = find_by_ids_ok_process_def(
    ids.clone(),
    options,
  ).await?;
  
  let mut num = 0;
  for old_model in old_models {
    
    let id = old_model.id;
    
    // 遍历版本表, 如果有版本被实例关联则不允许删除
    let revisions = crate::bpm::process_revision::process_revision_dao::find_all_process_revision(
      Some(crate::bpm::process_revision::process_revision_model::ProcessRevisionSearch {
        process_def_id: Some(vec![id]),
        ..Default::default()
      }),
      None,
      None,
      options,
    ).await?;
    for revision in &revisions {
      let has_inst = crate::bpm::process_inst::process_inst_dao::exists_process_inst(
        Some(crate::bpm::process_inst::process_inst_model::ProcessInstSearch {
          process_revision_id: Some(vec![revision.id.clone()]),
          ..Default::default()
        }),
        options,
      ).await?;
      if has_inst {
        return Err(eyre!("流程定义 \"{}\" 的版本 \"{}\" 存在关联的流程实例, 不允许删除", old_model.lbl, revision.lbl));
      }
    }
    
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

// MARK: get_is_enabled_by_id_process_def
/// 根据 id 查找流程定义是否已启用
/// 记录不存在则返回 false
pub async fn get_is_enabled_by_id_process_def(
  id: ProcessDefId,
  options: Option<Options>,
) -> Result<bool> {
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let model = find_by_id_process_def(
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

// MARK: enable_by_ids_process_def
/// 根据 ids 启用或者禁用流程定义
pub async fn enable_by_ids_process_def(
  ids: Vec<ProcessDefId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_process_def();
  let method = "enable_by_ids_process_def";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" ids: {ids:?}");
    msg += &format!(" is_enabled: {is_enabled:?}");
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
    
    let sql = format!("update {table} set is_enabled=? where id=? limit 1");
    
    args.push(is_enabled.into());
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

// MARK: revert_by_ids_process_def
/// 根据 ids 还原流程定义
pub async fn revert_by_ids_process_def(
  ids: Vec<ProcessDefId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_process_def();
  let method = "revert_by_ids_process_def";
  
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
    
    let mut old_model = find_one_process_def(
      ProcessDefSearch {
        id: Some(id),
        is_deleted: Some(1),
        ..Default::default()
      }.into(),
      None,
      options,
    ).await?;
    
    if old_model.is_none() {
      old_model = find_by_id_process_def(
        id,
        options,
      ).await?;
    }
    
    let old_model = match old_model {
      Some(model) => model,
      None => continue,
    };
    
    {
      let mut input: ProcessDefInput = old_model.clone().into();
      input.id = None;
      
      let models = find_by_unique_process_def(
        input.into(),
        None,
        options,
      ).await?;
      
      let models: Vec<ProcessDefModel> = models
        .into_iter()
        .filter(|item| 
          item.id != id
        )
        .collect();
      
      if !models.is_empty() {
        let err_msg = "流程定义 重复";
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

// MARK: force_delete_by_ids_process_def
/// 根据 ids 彻底删除流程定义
#[allow(unused_variables)]
pub async fn force_delete_by_ids_process_def(
  ids: Vec<ProcessDefId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_process_def();
  let method = "force_delete_by_ids_process_def";
  
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
    
    let old_model = find_one_process_def(
      Some(ProcessDefSearch {
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

// MARK: find_last_order_by_process_def
/// 查找 流程定义 order_by 字段的最大值
pub async fn find_last_order_by_process_def(
  search: Option<ProcessDefSearch>,
  options: Option<Options>,
) -> Result<u32> {
  
  let table = get_table_name_process_def();
  let method = "find_last_order_by_process_def";
  
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

// MARK: validate_is_enabled_process_def
/// 校验流程定义是否启用
#[allow(dead_code)]
pub async fn validate_is_enabled_process_def(
  model: &ProcessDefModel,
) -> Result<()> {
  if model.is_enabled == 0 {
    let err_msg = SmolStr::new("流程定义已禁用");
    return Err(eyre!(err_msg));
  }
  Ok(())
}

// MARK: validate_option_process_def
/// 校验流程定义是否存在
#[allow(dead_code)]
pub async fn validate_option_process_def(
  model: Option<ProcessDefModel>,
) -> Result<ProcessDefModel> {
  
  let model = match model {
    Some(model) => model,
    None => {
      let err_msg = SmolStr::new("流程定义不存在");
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
