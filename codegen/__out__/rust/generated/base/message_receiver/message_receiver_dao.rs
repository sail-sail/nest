
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
  get_auth_org_id,
};
use crate::common::exceptions::service_exception::ServiceException;

use crate::common::gql::model::{
  PageInput,
  SortInput,
};

use crate::common::dict_detail::dict_detail_dao::get_dict;

use super::message_receiver_model::*;

use crate::base::tenant::tenant_model::TenantId;
#[allow(unused_imports)]
use crate::base::message::message_model::MessageId;
#[allow(unused_imports)]
use crate::base::usr::usr_model::UsrId;
#[allow(unused_imports)]
use crate::base::org::org_model::OrgId;

use crate::base::usr::usr_dao::find_by_id_usr;

#[allow(unused_variables)]
async fn get_where_query(
  args: &mut QueryArgs,
  search: Option<&MessageReceiverSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let is_deleted = search
    .and_then(|item| item.is_deleted)
    .unwrap_or(0);
  
  let mut where_query = String::with_capacity(80 * 12 * 2);
  
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
  // 消息
  {
    if let Some(message_id) = search.and_then(|item| item.message_id.as_deref()) {
      let arg = {
        if message_id.is_empty() {
          String::from("''")
        } else {
          let mut items = Vec::with_capacity(message_id.len());
          for item in message_id {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.message_id in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let message_id_is_null: bool = match search {
      Some(item) => item.message_id_is_null.unwrap_or(false),
      None => false,
    };
    if message_id_is_null {
      where_query.push_str(" and t.message_id is null");
    }
  }
  {
    let message_id_content: Option<Vec<String>> = match search {
      Some(item) => item.message_id_content.clone(),
      None => None,
    };
    if let Some(message_id_content) = message_id_content {
      let arg = {
        if message_id_content.is_empty() {
          String::from("''")
        } else {
          let mut items = Vec::with_capacity(message_id_content.len());
          for item in message_id_content {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and message_id_lbl.content in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let message_id_content_like = match search {
      Some(item) => item.message_id_content_like.clone(),
      None => None,
    };
    if let Some(message_id_content_like) = message_id_content_like {
      where_query.push_str(" and message_id_lbl.content like ?");
      args.push(format!("%{}%", sql_like(&message_id_content_like)).into());
    }
  }
  // 接收人
  {
    if let Some(receiver_usr_id) = search.and_then(|item| item.receiver_usr_id.as_deref()) {
      let arg = {
        if receiver_usr_id.is_empty() {
          String::from("''")
        } else {
          let mut items = Vec::with_capacity(receiver_usr_id.len());
          for item in receiver_usr_id {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.receiver_usr_id in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let receiver_usr_id_is_null: bool = match search {
      Some(item) => item.receiver_usr_id_is_null.unwrap_or(false),
      None => false,
    };
    if receiver_usr_id_is_null {
      where_query.push_str(" and t.receiver_usr_id is null");
    }
  }
  {
    let receiver_usr_id_lbl: Option<Vec<String>> = match search {
      Some(item) => item.receiver_usr_id_lbl.clone(),
      None => None,
    };
    if let Some(receiver_usr_id_lbl) = receiver_usr_id_lbl {
      let arg = {
        if receiver_usr_id_lbl.is_empty() {
          String::from("''")
        } else {
          let mut items = Vec::with_capacity(receiver_usr_id_lbl.len());
          for item in receiver_usr_id_lbl {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.receiver_usr_id_lbl in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
    {
      let receiver_usr_id_lbl_like = match search {
        Some(item) => item.receiver_usr_id_lbl_like.clone(),
        None => None,
      };
      if let Some(receiver_usr_id_lbl_like) = receiver_usr_id_lbl_like {
        if !receiver_usr_id_lbl_like.is_empty() {
          where_query.push_str(" and receiver_usr_id_lbl like ?");
          args.push(format!("%{}%", sql_like(&receiver_usr_id_lbl_like)).into());
        }
      }
    }
  }
  // 已读
  {
    let is_read: Option<Vec<u8>> = match search {
      Some(item) => item.is_read.clone(),
      None => None,
    };
    if let Some(is_read) = is_read {
      let arg = {
        if is_read.is_empty() {
          String::from("null")
        } else {
          let mut items = Vec::with_capacity(is_read.len());
          for item in is_read {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.is_read in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  // 阅读时间
  {
    let mut read_time = match search {
      Some(item) => item.read_time.unwrap_or_default(),
      None => Default::default(),
    };
    let read_time_gt = read_time[0].take();
    let read_time_lt = read_time[1].take();
    if let Some(read_time_gt) = read_time_gt {
      where_query.push_str(" and t.read_time >= ?");
      args.push(read_time_gt.into());
    }
    if let Some(read_time_lt) = read_time_lt {
      where_query.push_str(" and t.read_time <= ?");
      args.push(read_time_lt.into());
    }
  }
  // 所属组织
  {
    if let Some(org_id) = search.and_then(|item| item.org_id.as_deref()) {
      let arg = {
        if org_id.is_empty() {
          String::from("''")
        } else {
          let mut items = Vec::with_capacity(org_id.len());
          for item in org_id {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.org_id in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let org_id_is_null: bool = match search {
      Some(item) => item.org_id_is_null.unwrap_or(false),
      None => false,
    };
    if org_id_is_null {
      where_query.push_str(" and t.org_id is null");
    }
  }
  {
    let org_id_lbl: Option<Vec<String>> = match search {
      Some(item) => item.org_id_lbl.clone(),
      None => None,
    };
    if let Some(org_id_lbl) = org_id_lbl {
      let arg = {
        if org_id_lbl.is_empty() {
          String::from("''")
        } else {
          let mut items = Vec::with_capacity(org_id_lbl.len());
          for item in org_id_lbl {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.org_id_lbl in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
    {
      let org_id_lbl_like = match search {
        Some(item) => item.org_id_lbl_like.clone(),
        None => None,
      };
      if let Some(org_id_lbl_like) = org_id_lbl_like {
        if !org_id_lbl_like.is_empty() {
          where_query.push_str(" and org_id_lbl like ?");
          args.push(format!("%{}%", sql_like(&org_id_lbl_like)).into());
        }
      }
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
  search: Option<&MessageReceiverSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let from_query = r#"base_message_receiver t
  left join base_message message_id_lbl on message_id_lbl.id=t.message_id"#.to_owned();
  Ok(from_query)
}

// MARK: find_all_message_receiver
/// 根据搜索条件和分页查找消息接收人列表
#[allow(unused_mut, unused_variables)]
pub async fn find_all_message_receiver(
  search: Option<MessageReceiverSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<MessageReceiverModel>> {
  
  let table = get_table_name_message_receiver();
  let method = "find_all_message_receiver";
  
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
  // 消息
  if let Some(search) = &search && let Some(message_id) = &search.message_id {
    let len = message_id.len();
    if len == 0 {
      return Ok(vec![]);
    }
    if len > ids_limit {
      return Err(eyre!("search.message_id.length > {ids_limit}"));
    }
  }
  // 接收人
  if let Some(search) = &search && let Some(receiver_usr_id) = &search.receiver_usr_id {
    let len = receiver_usr_id.len();
    if len == 0 {
      return Ok(vec![]);
    }
    if len > ids_limit {
      return Err(eyre!("search.receiver_usr_id.length > {ids_limit}"));
    }
  }
  // 已读
  if let Some(search) = &search && let Some(is_read) = &search.is_read {
    let len = is_read.len();
    if len == 0 {
      return Ok(vec![]);
    }
    if len > ids_limit {
      return Err(eyre!("search.is_read.length > {ids_limit}"));
    }
  }
  // 所属组织
  if let Some(search) = &search && let Some(org_id) = &search.org_id {
    let len = org_id.len();
    if len == 0 {
      return Ok(vec![]);
    }
    if len > ids_limit {
      return Err(eyre!("search.org_id.length > {ids_limit}"));
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
  ,message_id_lbl.content message_id_content
  from {from_query} where {where_query} group by t.id{order_by_query}) f {page_query}"#);
  
  let args = args.into();
  
  let mut res: Vec<MessageReceiverModel> = query(
    sql,
    args,
    options,
  ).await?;
  
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
    "yes_no",
  ]).await?;
  let [
    is_read_dict,
  ]: [Vec<_>; 1] = dict_vec
    .try_into()
    .map_err(|err| eyre!("{:#?}", err))?;
  
  #[allow(unused_variables)]
  for model in &mut res {
    
    // 已读
    model.is_read_lbl = {
      is_read_dict
        .iter()
        .find(|item| item.val == model.is_read.to_string())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.is_read.to_string())
    };
    
  }
  
  Ok(res)
}

// MARK: find_count_message_receiver
/// 根据条件查找消息接收人总数
pub async fn find_count_message_receiver(
  search: Option<MessageReceiverSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_message_receiver();
  let method = "find_count_message_receiver";
  
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
  // 消息
  if let Some(search) = &search && search.message_id.is_some() {
    let len = search.message_id.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.message_id.length > {ids_limit}"));
    }
  }
  // 接收人
  if let Some(search) = &search && search.receiver_usr_id.is_some() {
    let len = search.receiver_usr_id.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.receiver_usr_id.length > {ids_limit}"));
    }
  }
  // 已读
  if let Some(search) = &search && search.is_read.is_some() {
    let len = search.is_read.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.is_read.length > {ids_limit}"));
    }
  }
  // 所属组织
  if let Some(search) = &search && search.org_id.is_some() {
    let len = search.org_id.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.org_id.length > {ids_limit}"));
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

// MARK: get_field_comments_message_receiver
/// 获取消息接收人字段注释
#[allow(unused_mut)]
pub async fn get_field_comments_message_receiver(
  _options: Option<Options>,
) -> Result<MessageReceiverFieldComment> {
  
  let mut field_comments = MessageReceiverFieldComment {
    id: "ID".into(),
    message_id: "消息".into(),
    message_id_lbl: "消息".into(),
    receiver_usr_id: "接收人".into(),
    receiver_usr_id_lbl: "接收人".into(),
    is_read: "已读".into(),
    is_read_lbl: "已读".into(),
    read_time: "阅读时间".into(),
    read_time_lbl: "阅读时间".into(),
    org_id: "所属组织".into(),
    org_id_lbl: "所属组织".into(),
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

// MARK: find_one_ok_message_receiver
/// 根据条件查找第一个消息接收人, 如果不存在则抛错
#[allow(dead_code)]
pub async fn find_one_ok_message_receiver(
  search: Option<MessageReceiverSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<MessageReceiverModel> {
  
  let table = get_table_name_message_receiver();
  let method = "find_one_ok_message_receiver";
  
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
  
  let message_receiver_model = find_one_message_receiver(
    search,
    sort,
    options,
  ).await?;
  
  let Some(message_receiver_model) = message_receiver_model else {
    let err_msg = "此 消息接收人 已被删除";
    return Err(eyre!(err_msg));
  };
  
  Ok(message_receiver_model)
}

// MARK: find_one_message_receiver
/// 根据条件查找第一个消息接收人
#[allow(dead_code)]
pub async fn find_one_message_receiver(
  search: Option<MessageReceiverSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<MessageReceiverModel>> {
  
  let table = get_table_name_message_receiver();
  let method = "find_one_message_receiver";
  
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
  
  let res = find_all_message_receiver(
    search,
    page,
    sort,
    options,
  ).await?;
  
  let model: Option<MessageReceiverModel> = res.into_iter().next();
  
  Ok(model)
}

// MARK: find_by_id_ok_message_receiver
/// 根据 id 查找消息接收人, 如果不存在则抛错
#[allow(dead_code)]
pub async fn find_by_id_ok_message_receiver(
  id: MessageReceiverId,
  options: Option<Options>,
) -> Result<MessageReceiverModel> {
  
  let table = get_table_name_message_receiver();
  let method = "find_by_id_ok_message_receiver";
  
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
  
  let message_receiver_model = find_by_id_message_receiver(
    id,
    options,
  ).await?;
  
  let Some(message_receiver_model) = message_receiver_model else {
    let err_msg = String::from("此 消息接收人 已被删除");
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
  
  Ok(message_receiver_model)
}

// MARK: find_by_id_message_receiver
/// 根据 id 查找消息接收人
pub async fn find_by_id_message_receiver(
  id: MessageReceiverId,
  options: Option<Options>,
) -> Result<Option<MessageReceiverModel>> {
  
  let table = get_table_name_message_receiver();
  let method = "find_by_id_message_receiver";
  
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
  
  let search = MessageReceiverSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let message_receiver_model = find_one_message_receiver(
    search,
    None,
    options,
  ).await?;
  
  Ok(message_receiver_model)
}

// MARK: find_by_ids_ok_message_receiver
/// 根据 ids 查找消息接收人, 出现查询不到的 id 则报错
#[allow(dead_code)]
pub async fn find_by_ids_ok_message_receiver(
  ids: Vec<MessageReceiverId>,
  options: Option<Options>,
) -> Result<Vec<MessageReceiverModel>> {
  
  let table = get_table_name_message_receiver();
  let method = "find_by_ids_ok_message_receiver";
  
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
  
  let message_receiver_models = find_by_ids_message_receiver(
    ids.clone(),
    options,
  ).await?;
  
  if message_receiver_models.len() != len {
    let err_msg = String::from("此 消息接收人 已被删除");
    return Err(eyre!(err_msg));
  }
  
  let message_receiver_models = ids
    .into_iter()
    .map(|id| {
      let model = message_receiver_models
        .iter()
        .find(|item| item.id == id);
      if let Some(model) = model {
        return Ok(model.clone());
      }
      let err_msg = String::from("此 消息接收人 已经被删除");
      Err(eyre!(err_msg))
    })
    .collect::<Result<Vec<MessageReceiverModel>>>()?;
  
  Ok(message_receiver_models)
}

// MARK: find_by_ids_message_receiver
/// 根据 ids 查找消息接收人
#[allow(dead_code)]
pub async fn find_by_ids_message_receiver(
  ids: Vec<MessageReceiverId>,
  options: Option<Options>,
) -> Result<Vec<MessageReceiverModel>> {
  
  let table = get_table_name_message_receiver();
  let method = "find_by_ids_message_receiver";
  
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
  
  let search = MessageReceiverSearch {
    ids: Some(ids.clone()),
    ..Default::default()
  }.into();
  
  let message_receiver_models = find_all_message_receiver(
    search,
    None,
    None,
    options,
  ).await?;
  
  let message_receiver_models = ids
    .into_iter()
    .filter_map(|id| {
      message_receiver_models
        .iter()
        .find(|item| item.id == id)
        .cloned()
    })
    .collect::<Vec<MessageReceiverModel>>();
  
  Ok(message_receiver_models)
}

// MARK: exists_message_receiver
/// 根据搜索条件判断消息接收人是否存在
#[allow(dead_code)]
pub async fn exists_message_receiver(
  search: Option<MessageReceiverSearch>,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = get_table_name_message_receiver();
  let method = "exists_message_receiver";
  
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
  // 消息
  if let Some(search) = &search && let Some(message_id) = &search.message_id {
    let len = message_id.len();
    if len == 0 {
      return Ok(false);
    }
    if len > ids_limit {
      return Err(eyre!("search.message_id.length > {ids_limit}"));
    }
  }
  // 接收人
  if let Some(search) = &search && let Some(receiver_usr_id) = &search.receiver_usr_id {
    let len = receiver_usr_id.len();
    if len == 0 {
      return Ok(false);
    }
    if len > ids_limit {
      return Err(eyre!("search.receiver_usr_id.length > {ids_limit}"));
    }
  }
  // 已读
  if let Some(search) = &search && let Some(is_read) = &search.is_read {
    let len = is_read.len();
    if len == 0 {
      return Ok(false);
    }
    if len > ids_limit {
      return Err(eyre!("search.is_read.length > {ids_limit}"));
    }
  }
  // 所属组织
  if let Some(search) = &search && let Some(org_id) = &search.org_id {
    let len = org_id.len();
    if len == 0 {
      return Ok(false);
    }
    if len > ids_limit {
      return Err(eyre!("search.org_id.length > {ids_limit}"));
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
  
  let res: Option<(bool,)> = query_one(
    sql,
    args,
    options,
  ).await?;
  
  Ok(res
    .map(|item| item.0)
    .unwrap_or_default())
}

// MARK: exists_by_id_message_receiver
/// 根据 id 判断消息接收人是否存在
#[allow(dead_code)]
pub async fn exists_by_id_message_receiver(
  id: MessageReceiverId,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = get_table_name_message_receiver();
  let method = "exists_by_id_message_receiver";
  
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
  
  let search = MessageReceiverSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let exists = exists_message_receiver(
    search,
    options,
  ).await?;
  
  Ok(exists)
}

// MARK: find_by_unique_message_receiver
/// 通过唯一约束获得数据列表
#[allow(unused_variables)]
pub async fn find_by_unique_message_receiver(
  search: MessageReceiverSearch,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<MessageReceiverModel>> {
  
  let table = get_table_name_message_receiver();
  let method = "find_by_unique_message_receiver";
  
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
    let model = find_by_id_message_receiver(
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
  input: &MessageReceiverInput,
  model: &MessageReceiverModel,
  options: Option<&Options>,
) -> bool {
  if input.id.as_ref().is_some() {
    return input.id.as_ref().unwrap() == &model.id;
  }
  
  let is_silent_mode = get_is_silent_mode(options);
  false
}

// MARK: check_by_unique_message_receiver
/// 通过唯一约束检查数据是否已经存在
#[allow(unused_variables)]
pub async fn check_by_unique_message_receiver(
  input: MessageReceiverInput,
  model: MessageReceiverModel,
  options: Option<Options>,
) -> Result<Option<MessageReceiverId>> {
  
  let table = get_table_name_message_receiver();
  let method = "check_by_unique_message_receiver";
  
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
    let id = update_by_id_message_receiver(
      model.id,
      input,
      options,
    ).await?;
    return Ok(id.into());
  }
  if unique_type == UniqueType::Throw {
    let err_msg = "消息接收人 重复";
    return Err(eyre!(err_msg));
  }
  Ok(None)
}

// MARK: set_id_by_lbl_message_receiver
/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(unused_variables, dead_code)]
pub async fn set_id_by_lbl_message_receiver(
  input: MessageReceiverInput,
) -> Result<MessageReceiverInput> {
  
  #[allow(unused_mut)]
  let mut input = input;
  
  // 阅读时间
  if input.read_time.is_none() && let Some(read_time_lbl) = input.read_time_lbl.as_ref().filter(|s| !s.is_empty()) {
    input.read_time = chrono::NaiveDateTime::parse_from_str(read_time_lbl, "%Y-%m-%d %H:%M:%S").ok();
    if input.read_time.is_none() {
      input.read_time = chrono::NaiveDateTime::parse_from_str(read_time_lbl, "%Y-%m-%d").ok();
    }
    if input.read_time.is_none() {
      let field_comments = get_field_comments_message_receiver(
        None,
      ).await?;
      let column_comment = field_comments.read_time;
      
      let err_msg = "日期格式错误";
      return Err(eyre!("{column_comment} {err_msg}"));
    }
  }
  
  let dict_vec = get_dict(&[
    "yes_no",
  ]).await?;
  
  // 已读
  if input.is_read.is_none() {
    let is_read_dict = &dict_vec[0];
    if let Some(is_read_lbl) = input.is_read_lbl.clone() {
      input.is_read = is_read_dict
        .iter()
        .find(|item| {
          item.lbl == is_read_lbl
        })
        .map(|item| {
          item.val.parse().unwrap_or_default()
        });
    }
  }
  
  // 消息
  if input.message_id_content.is_some()
    && !input.message_id_content.as_ref().unwrap().is_empty()
    && input.message_id.is_none()
  {
    input.message_id_content = input.message_id_content.map(|item| 
      String::from(item.trim())
    );
    let model = crate::base::message::message_dao::find_one_message(
      crate::base::message::message_model::MessageSearch {
        content: input.message_id_content.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(model) = model {
      input.message_id = model.id.into();
    }
  } else if
    (input.message_id_content.is_none() || input.message_id_content.as_ref().unwrap().is_empty())
    && input.message_id.is_some()
  {
    let message_model = crate::base::message::message_dao::find_one_message(
      crate::base::message::message_model::MessageSearch {
        id: input.message_id.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(message_model) = message_model {
      input.message_id_content = message_model.content.into();
    }
  }
  
  // 接收人
  if input.receiver_usr_id_lbl.is_some()
    && !input.receiver_usr_id_lbl.as_ref().unwrap().is_empty()
    && input.receiver_usr_id.is_none()
  {
    input.receiver_usr_id_lbl = input.receiver_usr_id_lbl.map(|item| 
      String::from(item.trim())
    );
    let model = crate::base::usr::usr_dao::find_one_usr(
      crate::base::usr::usr_model::UsrSearch {
        lbl: input.receiver_usr_id_lbl.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(model) = model {
      input.receiver_usr_id = model.id.into();
    }
  } else if
    (input.receiver_usr_id_lbl.is_none() || input.receiver_usr_id_lbl.as_ref().unwrap().is_empty())
    && input.receiver_usr_id.is_some()
  {
    let usr_model = crate::base::usr::usr_dao::find_one_usr(
      crate::base::usr::usr_model::UsrSearch {
        id: input.receiver_usr_id.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(usr_model) = usr_model {
      input.receiver_usr_id_lbl = usr_model.lbl.into();
    }
  }
  
  // 已读
  if
    input.is_read_lbl.is_some() && !input.is_read_lbl.as_ref().unwrap().is_empty()
    && input.is_read.is_none()
  {
    let is_read_dict = &dict_vec[0];
    let dict_model = is_read_dict.iter().find(|item| {
      item.lbl == input.is_read_lbl.clone().unwrap_or_default()
    });
    let val = dict_model.map(|item| item.val.to_string());
    if let Some(val) = val {
      input.is_read = val.parse::<u8>()?.into();
    }
  } else if
    (input.is_read_lbl.is_none() || input.is_read_lbl.as_ref().unwrap().is_empty())
    && input.is_read.is_some()
  {
    let is_read_dict = &dict_vec[0];
    let dict_model = is_read_dict.iter().find(|item| {
      item.val == input.is_read.unwrap_or_default().to_string()
    });
    let lbl = dict_model.map(|item| item.lbl.to_string());
    input.is_read_lbl = lbl;
  }
  
  // 所属组织
  if input.org_id_lbl.is_some()
    && !input.org_id_lbl.as_ref().unwrap().is_empty()
    && input.org_id.is_none()
  {
    input.org_id_lbl = input.org_id_lbl.map(|item| 
      String::from(item.trim())
    );
    let model = crate::base::org::org_dao::find_one_org(
      crate::base::org::org_model::OrgSearch {
        lbl: input.org_id_lbl.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(model) = model {
      input.org_id = model.id.into();
    }
  } else if
    (input.org_id_lbl.is_none() || input.org_id_lbl.as_ref().unwrap().is_empty())
    && input.org_id.is_some()
  {
    let org_model = crate::base::org::org_dao::find_one_org(
      crate::base::org::org_model::OrgSearch {
        id: input.org_id.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(org_model) = org_model {
      input.org_id_lbl = org_model.lbl.into();
    }
  }
  
  Ok(input)
}

// MARK: creates_return_message_receiver
/// 批量创建消息接收人并返回
#[allow(dead_code)]
pub async fn creates_return_message_receiver(
  inputs: Vec<MessageReceiverInput>,
  options: Option<Options>,
) -> Result<Vec<MessageReceiverModel>> {
  
  let table = get_table_name_message_receiver();
  let method = "creates_return_message_receiver";
  
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
  
  let models_message_receiver = find_by_ids_message_receiver(
    ids,
    options,
  ).await?;
  
  Ok(models_message_receiver)
}

// MARK: creates_message_receiver
/// 批量创建消息接收人
pub async fn creates_message_receiver(
  inputs: Vec<MessageReceiverInput>,
  options: Option<Options>,
) -> Result<Vec<MessageReceiverId>> {
  
  let table = get_table_name_message_receiver();
  let method = "creates_message_receiver";
  
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

/// 批量创建消息接收人
#[allow(unused_variables, clippy::redundant_locals, unused_mut)]
async fn _creates(
  inputs: Vec<MessageReceiverInput>,
  options: Option<Options>,
) -> Result<Vec<MessageReceiverId>> {
  
  let table = get_table_name_message_receiver();
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  
  let unique_type = options.as_ref()
    .and_then(|item|
      item.get_unique_type()
    )
    .unwrap_or_default();

  let auth_org_id = get_auth_org_id();
  let mut auth_org_id_lbl = String::from("");
  if let Some(auth_org_id) = auth_org_id {
    let org_model = crate::base::org::org_dao::find_by_id_org(
      auth_org_id,
      options,
    ).await?;
    if let Some(org_model) = org_model {
      auth_org_id_lbl = org_model.lbl;
    }
  }
  let mut inputs = inputs;
  for input in &mut inputs {
    if input.org_id.is_none_or(|x| x.is_empty()) {
      input.org_id = auth_org_id;
      input.org_id_lbl = Some(auth_org_id_lbl.clone());
    }
  }
  
  let mut ids2: Vec<MessageReceiverId> = vec![];
  let mut inputs2: Vec<MessageReceiverInput> = vec![];
  
  for input in inputs {
  
    if input.id.is_some() {
      return Err(eyre!("Can not set id when create in dao: {table}"));
    }

    let mut input = input;

    // 接收人
    if (input.receiver_usr_id_lbl.is_none() || input.receiver_usr_id_lbl.as_ref().unwrap().is_empty())
      && input.receiver_usr_id.is_some()
      && !input.receiver_usr_id.as_ref().unwrap().is_empty()
    {
      let usr_model = crate::base::usr::usr_dao::find_by_id_usr(
        input.receiver_usr_id.clone().unwrap(),
        Some(Options::new().set_is_debug(Some(false))),
      ).await?;
      if let Some(usr_model) = usr_model {
        input.receiver_usr_id_lbl = usr_model.lbl.into();
      }
    }

    // 所属组织
    if (input.org_id_lbl.is_none() || input.org_id_lbl.as_ref().unwrap().is_empty())
      && input.org_id.is_some()
      && !input.org_id.as_ref().unwrap().is_empty()
    {
      let org_model = crate::base::org::org_dao::find_by_id_org(
        input.org_id.clone().unwrap(),
        Some(Options::new().set_is_debug(Some(false))),
      ).await?;
      if let Some(org_model) = org_model {
        input.org_id_lbl = org_model.lbl.into();
      }
    }
    let input = input;
    
    let old_models = find_by_unique_message_receiver(
      input.clone().into(),
      None,
      options,
    ).await?;
    
    if !old_models.is_empty() {
      let mut id: Option<MessageReceiverId> = None;
      
      for old_model in old_models {
        let options = Options::from(options)
          .set_unique_type(unique_type);
        
        id = check_by_unique_message_receiver(
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
  // 消息
  sql_fields += ",message_id";
  // 接收人
  sql_fields += ",receiver_usr_id_lbl";
  // 接收人
  sql_fields += ",receiver_usr_id";
  // 已读
  sql_fields += ",is_read";
  // 阅读时间
  sql_fields += ",read_time";
  // 所属组织
  sql_fields += ",org_id_lbl";
  // 所属组织
  sql_fields += ",org_id";
  
  let inputs2_len = inputs2.len();
  let mut sql_values = String::with_capacity((2 * 12 + 3) * inputs2_len);
  let mut inputs2_ids = vec![];
  
  for (i, input) in inputs2
    .clone()
    .into_iter()
    .enumerate()
  {
    
    let id: MessageReceiverId = get_short_uuid().into();
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
    // 消息
    if let Some(message_id) = input.message_id {
      sql_values += ",?";
      args.push(message_id.into());
    } else {
      sql_values += ",default";
    }
    // 接收人
    if let Some(receiver_usr_id_lbl) = input.receiver_usr_id_lbl {
      sql_values += ",?";
      args.push(receiver_usr_id_lbl.into());
    } else {
      sql_values += ",default";
    }
    // 接收人
    if let Some(receiver_usr_id) = input.receiver_usr_id {
      sql_values += ",?";
      args.push(receiver_usr_id.into());
    } else {
      sql_values += ",default";
    }
    // 已读
    if let Some(is_read) = input.is_read {
      sql_values += ",?";
      args.push(is_read.into());
    } else {
      sql_values += ",default";
    }
    // 阅读时间
    if let Some(read_time) = input.read_time {
      sql_values += ",?";
      args.push(read_time.into());
    } else if input.read_time_save_null == Some(true) {
      sql_values += ",null";
    } else {
      sql_values += ",default";
    }
    // 所属组织
    if let Some(org_id_lbl) = input.org_id_lbl {
      sql_values += ",?";
      args.push(org_id_lbl.into());
    } else {
      sql_values += ",default";
    }
    // 所属组织
    if let Some(org_id) = input.org_id {
      sql_values += ",?";
      args.push(org_id.into());
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

// MARK: create_return_message_receiver
/// 创建消息接收人并返回
#[allow(dead_code)]
pub async fn create_return_message_receiver(
  #[allow(unused_mut)]
  mut input: MessageReceiverInput,
  options: Option<Options>,
) -> Result<MessageReceiverModel> {
  
  let id = create_message_receiver(
    input.clone(),
    options,
  ).await?;
  
  let model_message_receiver = find_by_id_message_receiver(
    id,
    options,
  ).await?;
  
  let model_message_receiver = match model_message_receiver {
    Some(model) => model,
    None => {
      let err_msg = "create_return_message_receiver: model_message_receiver.is_none()";
      return Err(eyre!(
        ServiceException {
          message: err_msg.into(),
          trace: true,
          ..Default::default()
        },
      ));
    }
  };
  
  Ok(model_message_receiver)
}

// MARK: create_message_receiver
/// 创建消息接收人
#[allow(dead_code)]
pub async fn create_message_receiver(
  #[allow(unused_mut)]
  mut input: MessageReceiverInput,
  options: Option<Options>,
) -> Result<MessageReceiverId> {
  
  let table = get_table_name_message_receiver();
  let method = "create_message_receiver";
  
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

// MARK: update_tenant_by_id_message_receiver
/// 消息接收人根据id修改租户id
pub async fn update_tenant_by_id_message_receiver(
  id: MessageReceiverId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  let table = get_table_name_message_receiver();
  let method = "update_tenant_by_id_message_receiver";
  
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

// MARK: sync_usr_lbl_by_usr_id_message_receiver
/// 根据 usr_id 同步创建人/更新人/删除人标签
pub async fn sync_usr_lbl_by_usr_id_message_receiver(
  usr_id: UsrId,
  options: Option<Options>,
) -> Result<u64> {
  let table = get_table_name_message_receiver();
  let method = "sync_usr_lbl_by_usr_id_message_receiver";
  
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
  let mut sql_fields = String::with_capacity(180);
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
  
  Ok(num)
}

// MARK: update_by_id_message_receiver
/// 根据 id 修改消息接收人
#[allow(unused_mut)]
#[allow(unused_variables)]
pub async fn update_by_id_message_receiver(
  id: MessageReceiverId,
  mut input: MessageReceiverInput,
  options: Option<Options>,
) -> Result<MessageReceiverId> {
  
  let table = get_table_name_message_receiver();
  let method = "update_by_id_message_receiver";
  
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

  // 接收人
  if (input.receiver_usr_id_lbl.is_none() || input.receiver_usr_id_lbl.as_ref().unwrap().is_empty())
    && input.receiver_usr_id.is_some()
    && !input.receiver_usr_id.as_ref().unwrap().is_empty()
  {
    let usr_model = crate::base::usr::usr_dao::find_by_id_usr(
      input.receiver_usr_id.clone().unwrap(),
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(usr_model) = usr_model {
      input.receiver_usr_id_lbl = usr_model.lbl.into();
    }
  }

  // 所属组织
  if (input.org_id_lbl.is_none() || input.org_id_lbl.as_ref().unwrap().is_empty())
    && input.org_id.is_some()
    && !input.org_id.as_ref().unwrap().is_empty()
  {
    let org_model = crate::base::org::org_dao::find_by_id_org(
      input.org_id.clone().unwrap(),
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(org_model) = org_model {
      input.org_id_lbl = org_model.lbl.into();
    }
  }
  
  let old_model = find_by_id_message_receiver(
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
    
    let models = find_by_unique_message_receiver(
      input.into(),
      None,
      options,
    ).await?;
    
    let models = models.into_iter()
      .filter(|item| 
        item.id != id
      )
      .collect::<Vec<MessageReceiverModel>>();
    
    if !models.is_empty() {
      let unique_type = options
        .as_ref()
        .and_then(|item| item.get_unique_type())
        .unwrap_or(UniqueType::Throw);
      if unique_type == UniqueType::Throw {
        let err_msg = "消息接收人 重复";
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
  // 消息
  if let Some(message_id) = input.message_id {
    field_num += 1;
    sql_fields += "message_id=?,";
    args.push(message_id.into());
  }
  // 接收人
  if let Some(receiver_usr_id_lbl) = input.receiver_usr_id_lbl {
    field_num += 1;
    sql_fields += "receiver_usr_id_lbl=?,";
    args.push(receiver_usr_id_lbl.into());
  }
  // 接收人
  if let Some(receiver_usr_id) = input.receiver_usr_id {
    field_num += 1;
    sql_fields += "receiver_usr_id=?,";
    args.push(receiver_usr_id.into());
  }
  // 已读
  if let Some(is_read) = input.is_read {
    field_num += 1;
    sql_fields += "is_read=?,";
    args.push(is_read.into());
  }
  // 阅读时间
  if let Some(read_time) = input.read_time {
    field_num += 1;
    sql_fields += "read_time=?,";
    args.push(read_time.into());
  } else if input.read_time_save_null == Some(true) {
    field_num += 1;
    sql_fields += "read_time=null,";
  }
  // 所属组织
  if let Some(org_id_lbl) = input.org_id_lbl {
    field_num += 1;
    sql_fields += "org_id_lbl=?,";
    args.push(org_id_lbl.into());
  }
  // 所属组织
  if let Some(org_id) = input.org_id {
    field_num += 1;
    sql_fields += "org_id=?,";
    args.push(org_id.into());
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
    
  }
  
  Ok(id)
}

// MARK: update_by_id_return_message_receiver
/// 根据 id 更新消息接收人, 并返回更新后的数据
#[allow(dead_code)]
pub async fn update_by_id_return_message_receiver(
  id: MessageReceiverId,
  input: MessageReceiverInput,
  options: Option<Options>,
) -> Result<MessageReceiverModel> {
  
  update_by_id_message_receiver(
    id,
    input,
    options,
  ).await?;
  
  let model = find_by_id_message_receiver(
    id,
    options,
  ).await?;
  
  match model {
    Some(model) => Ok(model),
    None => Err(eyre!(
      "消息接收人 update_by_id_return_message_receiver id: {id}",
    )),
  }
}

// MARK: delete_by_ids_message_receiver
/// 根据 ids 删除消息接收人
#[allow(unused_variables)]
pub async fn delete_by_ids_message_receiver(
  ids: Vec<MessageReceiverId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_message_receiver();
  let method = "delete_by_ids_message_receiver";
  
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
  
  let old_models = find_by_ids_message_receiver(
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
  
  if num > MAX_SAFE_INTEGER {
    return Err(eyre!("num: {} > MAX_SAFE_INTEGER", num));
  }
  
  Ok(num)
}

// MARK: revert_by_ids_message_receiver
/// 根据 ids 还原消息接收人
pub async fn revert_by_ids_message_receiver(
  ids: Vec<MessageReceiverId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_message_receiver();
  let method = "revert_by_ids_message_receiver";
  
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
    
    let mut old_model = find_one_message_receiver(
      MessageReceiverSearch {
        id: Some(id),
        is_deleted: Some(1),
        ..Default::default()
      }.into(),
      None,
      options,
    ).await?;
    
    if old_model.is_none() {
      old_model = find_by_id_message_receiver(
        id,
        options,
      ).await?;
    }
    
    let old_model = match old_model {
      Some(model) => model,
      None => continue,
    };
    
    {
      let mut input: MessageReceiverInput = old_model.clone().into();
      input.id = None;
      
      let models = find_by_unique_message_receiver(
        input.into(),
        None,
        options,
      ).await?;
      
      let models: Vec<MessageReceiverModel> = models
        .into_iter()
        .filter(|item| 
          item.id != id
        )
        .collect();
      
      if !models.is_empty() {
        let err_msg = "消息接收人 重复";
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

// MARK: force_delete_by_ids_message_receiver
/// 根据 ids 彻底删除消息接收人
#[allow(unused_variables)]
pub async fn force_delete_by_ids_message_receiver(
  ids: Vec<MessageReceiverId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_message_receiver();
  let method = "force_delete_by_ids_message_receiver";
  
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
    
    let old_model = find_one_message_receiver(
      Some(MessageReceiverSearch {
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

// MARK: validate_option_message_receiver
/// 校验消息接收人是否存在
#[allow(dead_code)]
pub async fn validate_option_message_receiver(
  model: Option<MessageReceiverModel>,
) -> Result<MessageReceiverModel> {
  
  let model = match model {
    Some(model) => model,
    None => {
      let err_msg = String::from("消息接收人不存在");
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
