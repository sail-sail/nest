
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

use super::message_model::*;

use crate::base::tenant::tenant_model::TenantId;
#[allow(unused_imports)]
use crate::base::usr::usr_model::UsrId;
#[allow(unused_imports)]
use crate::base::org::org_model::OrgId;

use crate::base::usr::usr_dao::find_by_id_usr;

#[allow(unused_variables)]
async fn get_where_query(
  args: &mut QueryArgs,
  search: Option<&MessageSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let is_deleted = search
    .and_then(|item| item.is_deleted)
    .unwrap_or(0);
  
  let mut where_query = String::with_capacity(80 * 17 * 6);
  
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
  {
    let keyword: Option<String> = match search {
      Some(item) => item.keyword.clone(),
      None => None,
    };
    if let Some(keyword) = keyword && !keyword.is_empty() {
      where_query.push_str(" and (");
      where_query.push_str(" t.title like ?");
      args.push(format!("%{}%", sql_like(&keyword)).into());
        
      where_query.push_str(" or");
      where_query.push_str(" t.content like ?");
      args.push(format!("%{}%", sql_like(&keyword)).into());
      where_query.push(')');
    }
  }
  // 分类
  {
    let category: Option<Vec<String>> = match search {
      Some(item) => item.category.clone(),
      None => None,
    };
    if let Some(category) = category {
      let arg = {
        if category.is_empty() {
          String::from("null")
        } else {
          let mut items = Vec::with_capacity(category.len());
          for item in category {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.category in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  // 发送通道
  {
    let channel: Option<Vec<String>> = match search {
      Some(item) => item.channel.clone(),
      None => None,
    };
    if let Some(channel) = channel {
      let arg = {
        if channel.is_empty() {
          String::from("null")
        } else {
          let mut items = Vec::with_capacity(channel.len());
          for item in channel {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.channel in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  // 标题
  {
    let title = match search {
      Some(item) => item.title.clone(),
      None => None,
    };
    if let Some(title) = title {
      where_query.push_str(" and t.title=?");
      args.push(title.into());
    }
    let title_like = match search {
      Some(item) => item.title_like.clone(),
      None => None,
    };
    if let Some(title_like) = title_like && !title_like.is_empty() {
      where_query.push_str(" and t.title like ?");
      args.push(format!("%{}%", sql_like(&title_like)).into());
    }
  }
  // 内容
  {
    let content = match search {
      Some(item) => item.content.clone(),
      None => None,
    };
    if let Some(content) = content {
      where_query.push_str(" and t.content=?");
      args.push(content.into());
    }
    let content_like = match search {
      Some(item) => item.content_like.clone(),
      None => None,
    };
    if let Some(content_like) = content_like && !content_like.is_empty() {
      where_query.push_str(" and t.content like ?");
      args.push(format!("%{}%", sql_like(&content_like)).into());
    }
  }
  // 跳转路由
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
  // 跳转参数
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
  // 发送人
  {
    if let Some(sender_usr_id) = search.and_then(|item| item.sender_usr_id.as_deref()) {
      let arg = {
        if sender_usr_id.is_empty() {
          String::from("''")
        } else {
          let mut items = Vec::with_capacity(sender_usr_id.len());
          for item in sender_usr_id {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.sender_usr_id in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let sender_usr_id_is_null: bool = match search {
      Some(item) => item.sender_usr_id_is_null.unwrap_or(false),
      None => false,
    };
    if sender_usr_id_is_null {
      where_query.push_str(" and t.sender_usr_id is null");
    }
  }
  {
    let sender_usr_id_lbl: Option<Vec<String>> = match search {
      Some(item) => item.sender_usr_id_lbl.clone(),
      None => None,
    };
    if let Some(sender_usr_id_lbl) = sender_usr_id_lbl {
      let arg = {
        if sender_usr_id_lbl.is_empty() {
          String::from("''")
        } else {
          let mut items = Vec::with_capacity(sender_usr_id_lbl.len());
          for item in sender_usr_id_lbl {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.sender_usr_id_lbl in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
    {
      let sender_usr_id_lbl_like = match search {
        Some(item) => item.sender_usr_id_lbl_like.clone(),
        None => None,
      };
      if let Some(sender_usr_id_lbl_like) = sender_usr_id_lbl_like {
        if !sender_usr_id_lbl_like.is_empty() {
          where_query.push_str(" and sender_usr_id_lbl like ?");
          args.push(format!("%{}%", sql_like(&sender_usr_id_lbl_like)).into());
        }
      }
    }
  }
  // 系统消息
  {
    let is_sys_msg: Option<Vec<u8>> = match search {
      Some(item) => item.is_sys_msg.clone(),
      None => None,
    };
    if let Some(is_sys_msg) = is_sys_msg {
      let arg = {
        if is_sys_msg.is_empty() {
          String::from("null")
        } else {
          let mut items = Vec::with_capacity(is_sys_msg.len());
          for item in is_sys_msg {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.is_sys_msg in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  // 置顶
  {
    let is_pinned: Option<Vec<u8>> = match search {
      Some(item) => item.is_pinned.clone(),
      None => None,
    };
    if let Some(is_pinned) = is_pinned {
      let arg = {
        if is_pinned.is_empty() {
          String::from("null")
        } else {
          let mut items = Vec::with_capacity(is_pinned.len());
          for item in is_pinned {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.is_pinned in (");
      where_query.push_str(&arg);
      where_query.push(')');
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
  search: Option<&MessageSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let from_query = r#"base_message t"#.to_owned();
  Ok(from_query)
}

// MARK: find_all_message
/// 根据搜索条件和分页查找消息列表
#[allow(unused_mut, unused_variables)]
pub async fn find_all_message(
  search: Option<MessageSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<MessageModel>> {
  
  let table = get_table_name_message();
  let method = "find_all_message";
  
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
  // 分类
  if let Some(search) = &search && let Some(category) = &search.category {
    let len = category.len();
    if len == 0 {
      return Ok(vec![]);
    }
    if len > ids_limit {
      return Err(eyre!("search.category.length > {ids_limit}"));
    }
  }
  // 发送通道
  if let Some(search) = &search && let Some(channel) = &search.channel {
    let len = channel.len();
    if len == 0 {
      return Ok(vec![]);
    }
    if len > ids_limit {
      return Err(eyre!("search.channel.length > {ids_limit}"));
    }
  }
  // 发送人
  if let Some(search) = &search && let Some(sender_usr_id) = &search.sender_usr_id {
    let len = sender_usr_id.len();
    if len == 0 {
      return Ok(vec![]);
    }
    if len > ids_limit {
      return Err(eyre!("search.sender_usr_id.length > {ids_limit}"));
    }
  }
  // 系统消息
  if let Some(search) = &search && let Some(is_sys_msg) = &search.is_sys_msg {
    let len = is_sys_msg.len();
    if len == 0 {
      return Ok(vec![]);
    }
    if len > ids_limit {
      return Err(eyre!("search.is_sys_msg.length > {ids_limit}"));
    }
  }
  // 置顶
  if let Some(search) = &search && let Some(is_pinned) = &search.is_pinned {
    let len = is_pinned.len();
    if len == 0 {
      return Ok(vec![]);
    }
    if len > ids_limit {
      return Err(eyre!("search.is_pinned.length > {ids_limit}"));
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
  from {from_query} where {where_query} group by t.id{order_by_query}) f {page_query}"#);
  
  let args = args.into();
  
  let mut res: Vec<MessageModel> = query(
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
    "message_category",
    "message_channel",
    "yes_no",
    "yes_no",
  ]).await?;
  let [
    category_dict,
    channel_dict,
    is_sys_msg_dict,
    is_pinned_dict,
  ]: [Vec<_>; 4] = dict_vec
    .try_into()
    .map_err(|err| eyre!("{:#?}", err))?;
  
  #[allow(unused_variables)]
  for model in &mut res {
    
    // 分类
    model.category_lbl = {
      category_dict
        .iter()
        .find(|item| item.val == model.category.as_str())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.category.clone())
    };
    
    // 发送通道
    model.channel_lbl = {
      channel_dict
        .iter()
        .find(|item| item.val == model.channel.as_str())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.channel.clone())
    };
    
    // 系统消息
    model.is_sys_msg_lbl = {
      is_sys_msg_dict
        .iter()
        .find(|item| item.val == model.is_sys_msg.to_string())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.is_sys_msg.to_string())
    };
    
    // 置顶
    model.is_pinned_lbl = {
      is_pinned_dict
        .iter()
        .find(|item| item.val == model.is_pinned.to_string())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.is_pinned.to_string())
    };
    
  }
  
  Ok(res)
}

// MARK: find_count_message
/// 根据条件查找消息总数
pub async fn find_count_message(
  search: Option<MessageSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_message();
  let method = "find_count_message";
  
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
  // 分类
  if let Some(search) = &search && search.category.is_some() {
    let len = search.category.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.category.length > {ids_limit}"));
    }
  }
  // 发送通道
  if let Some(search) = &search && search.channel.is_some() {
    let len = search.channel.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.channel.length > {ids_limit}"));
    }
  }
  // 发送人
  if let Some(search) = &search && search.sender_usr_id.is_some() {
    let len = search.sender_usr_id.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.sender_usr_id.length > {ids_limit}"));
    }
  }
  // 系统消息
  if let Some(search) = &search && search.is_sys_msg.is_some() {
    let len = search.is_sys_msg.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.is_sys_msg.length > {ids_limit}"));
    }
  }
  // 置顶
  if let Some(search) = &search && search.is_pinned.is_some() {
    let len = search.is_pinned.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.is_pinned.length > {ids_limit}"));
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

// MARK: get_field_comments_message
/// 获取消息字段注释
#[allow(unused_mut)]
pub async fn get_field_comments_message(
  _options: Option<Options>,
) -> Result<MessageFieldComment> {
  
  let mut field_comments = MessageFieldComment {
    id: "ID".into(),
    category: "分类".into(),
    category_lbl: "分类".into(),
    channel: "发送通道".into(),
    channel_lbl: "发送通道".into(),
    title: "标题".into(),
    content: "内容".into(),
    route_path: "跳转路由".into(),
    route_query: "跳转参数".into(),
    sender_usr_id: "发送人".into(),
    sender_usr_id_lbl: "发送人".into(),
    is_sys_msg: "系统消息".into(),
    is_sys_msg_lbl: "系统消息".into(),
    is_pinned: "置顶".into(),
    is_pinned_lbl: "置顶".into(),
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

// MARK: find_one_ok_message
/// 根据条件查找第一个消息, 如果不存在则抛错
#[allow(dead_code)]
pub async fn find_one_ok_message(
  search: Option<MessageSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<MessageModel> {
  
  let table = get_table_name_message();
  let method = "find_one_ok_message";
  
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
  
  let message_model = find_one_message(
    search,
    sort,
    options,
  ).await?;
  
  let Some(message_model) = message_model else {
    let err_msg = "此 消息 已被删除";
    return Err(eyre!(err_msg));
  };
  
  Ok(message_model)
}

// MARK: find_one_message
/// 根据条件查找第一个消息
#[allow(dead_code)]
pub async fn find_one_message(
  search: Option<MessageSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<MessageModel>> {
  
  let table = get_table_name_message();
  let method = "find_one_message";
  
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
  
  let res = find_all_message(
    search,
    page,
    sort,
    options,
  ).await?;
  
  let model: Option<MessageModel> = res.into_iter().next();
  
  Ok(model)
}

// MARK: find_by_id_ok_message
/// 根据 id 查找消息, 如果不存在则抛错
#[allow(dead_code)]
pub async fn find_by_id_ok_message(
  id: MessageId,
  options: Option<Options>,
) -> Result<MessageModel> {
  
  let table = get_table_name_message();
  let method = "find_by_id_ok_message";
  
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
  
  let message_model = find_by_id_message(
    id,
    options,
  ).await?;
  
  let Some(message_model) = message_model else {
    let err_msg = String::from("此 消息 已被删除");
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
  
  Ok(message_model)
}

// MARK: find_by_id_message
/// 根据 id 查找消息
pub async fn find_by_id_message(
  id: MessageId,
  options: Option<Options>,
) -> Result<Option<MessageModel>> {
  
  let table = get_table_name_message();
  let method = "find_by_id_message";
  
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
  
  let search = MessageSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let message_model = find_one_message(
    search,
    None,
    options,
  ).await?;
  
  Ok(message_model)
}

// MARK: find_by_ids_ok_message
/// 根据 ids 查找消息, 出现查询不到的 id 则报错
#[allow(dead_code)]
pub async fn find_by_ids_ok_message(
  ids: Vec<MessageId>,
  options: Option<Options>,
) -> Result<Vec<MessageModel>> {
  
  let table = get_table_name_message();
  let method = "find_by_ids_ok_message";
  
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
  
  let message_models = find_by_ids_message(
    ids.clone(),
    options,
  ).await?;
  
  if message_models.len() != len {
    let err_msg = String::from("此 消息 已被删除");
    return Err(eyre!(err_msg));
  }
  
  let message_models = ids
    .into_iter()
    .map(|id| {
      let model = message_models
        .iter()
        .find(|item| item.id == id);
      if let Some(model) = model {
        return Ok(model.clone());
      }
      let err_msg = String::from("此 消息 已经被删除");
      Err(eyre!(err_msg))
    })
    .collect::<Result<Vec<MessageModel>>>()?;
  
  Ok(message_models)
}

// MARK: find_by_ids_message
/// 根据 ids 查找消息
#[allow(dead_code)]
pub async fn find_by_ids_message(
  ids: Vec<MessageId>,
  options: Option<Options>,
) -> Result<Vec<MessageModel>> {
  
  let table = get_table_name_message();
  let method = "find_by_ids_message";
  
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
  
  let search = MessageSearch {
    ids: Some(ids.clone()),
    ..Default::default()
  }.into();
  
  let message_models = find_all_message(
    search,
    None,
    None,
    options,
  ).await?;
  
  let message_models = ids
    .into_iter()
    .filter_map(|id| {
      message_models
        .iter()
        .find(|item| item.id == id)
        .cloned()
    })
    .collect::<Vec<MessageModel>>();
  
  Ok(message_models)
}

// MARK: exists_message
/// 根据搜索条件判断消息是否存在
#[allow(dead_code)]
pub async fn exists_message(
  search: Option<MessageSearch>,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = get_table_name_message();
  let method = "exists_message";
  
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
  // 分类
  if let Some(search) = &search && let Some(category) = &search.category {
    let len = category.len();
    if len == 0 {
      return Ok(false);
    }
    if len > ids_limit {
      return Err(eyre!("search.category.length > {ids_limit}"));
    }
  }
  // 发送通道
  if let Some(search) = &search && let Some(channel) = &search.channel {
    let len = channel.len();
    if len == 0 {
      return Ok(false);
    }
    if len > ids_limit {
      return Err(eyre!("search.channel.length > {ids_limit}"));
    }
  }
  // 发送人
  if let Some(search) = &search && let Some(sender_usr_id) = &search.sender_usr_id {
    let len = sender_usr_id.len();
    if len == 0 {
      return Ok(false);
    }
    if len > ids_limit {
      return Err(eyre!("search.sender_usr_id.length > {ids_limit}"));
    }
  }
  // 系统消息
  if let Some(search) = &search && let Some(is_sys_msg) = &search.is_sys_msg {
    let len = is_sys_msg.len();
    if len == 0 {
      return Ok(false);
    }
    if len > ids_limit {
      return Err(eyre!("search.is_sys_msg.length > {ids_limit}"));
    }
  }
  // 置顶
  if let Some(search) = &search && let Some(is_pinned) = &search.is_pinned {
    let len = is_pinned.len();
    if len == 0 {
      return Ok(false);
    }
    if len > ids_limit {
      return Err(eyre!("search.is_pinned.length > {ids_limit}"));
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

// MARK: exists_by_id_message
/// 根据 id 判断消息是否存在
#[allow(dead_code)]
pub async fn exists_by_id_message(
  id: MessageId,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = get_table_name_message();
  let method = "exists_by_id_message";
  
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
  
  let search = MessageSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let exists = exists_message(
    search,
    options,
  ).await?;
  
  Ok(exists)
}

// MARK: find_by_unique_message
/// 通过唯一约束获得数据列表
#[allow(unused_variables)]
pub async fn find_by_unique_message(
  search: MessageSearch,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<MessageModel>> {
  
  let table = get_table_name_message();
  let method = "find_by_unique_message";
  
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
    let model = find_by_id_message(
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
  input: &MessageInput,
  model: &MessageModel,
  options: Option<&Options>,
) -> bool {
  if input.id.as_ref().is_some() {
    return input.id.as_ref().unwrap() == &model.id;
  }
  
  let is_silent_mode = get_is_silent_mode(options);
  false
}

// MARK: check_by_unique_message
/// 通过唯一约束检查数据是否已经存在
#[allow(unused_variables)]
pub async fn check_by_unique_message(
  input: MessageInput,
  model: MessageModel,
  options: Option<Options>,
) -> Result<Option<MessageId>> {
  
  let table = get_table_name_message();
  let method = "check_by_unique_message";
  
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
    let id = update_by_id_message(
      model.id,
      input,
      options,
    ).await?;
    return Ok(id.into());
  }
  if unique_type == UniqueType::Throw {
    let err_msg = "消息 重复";
    return Err(eyre!(err_msg));
  }
  Ok(None)
}

// MARK: set_id_by_lbl_message
/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(unused_variables, dead_code)]
pub async fn set_id_by_lbl_message(
  input: MessageInput,
) -> Result<MessageInput> {
  
  #[allow(unused_mut)]
  let mut input = input;
  
  let dict_vec = get_dict(&[
    "message_category",
    "message_channel",
    "yes_no",
    "yes_no",
  ]).await?;
  
  // 分类
  if input.category.is_none() {
    let category_dict = &dict_vec[0];
    if let Some(category_lbl) = input.category_lbl.clone() {
      input.category = category_dict
        .iter()
        .find(|item| {
          item.lbl == category_lbl
        })
        .map(|item| {
          item.val.parse().unwrap_or_default()
        });
    }
  }
  
  // 发送通道
  if input.channel.is_none() {
    let channel_dict = &dict_vec[1];
    if let Some(channel_lbl) = input.channel_lbl.clone() {
      input.channel = channel_dict
        .iter()
        .find(|item| {
          item.lbl == channel_lbl
        })
        .map(|item| {
          item.val.parse().unwrap_or_default()
        });
    }
  }
  
  // 系统消息
  if input.is_sys_msg.is_none() {
    let is_sys_msg_dict = &dict_vec[2];
    if let Some(is_sys_msg_lbl) = input.is_sys_msg_lbl.clone() {
      input.is_sys_msg = is_sys_msg_dict
        .iter()
        .find(|item| {
          item.lbl == is_sys_msg_lbl
        })
        .map(|item| {
          item.val.parse().unwrap_or_default()
        });
    }
  }
  
  // 置顶
  if input.is_pinned.is_none() {
    let is_pinned_dict = &dict_vec[3];
    if let Some(is_pinned_lbl) = input.is_pinned_lbl.clone() {
      input.is_pinned = is_pinned_dict
        .iter()
        .find(|item| {
          item.lbl == is_pinned_lbl
        })
        .map(|item| {
          item.val.parse().unwrap_or_default()
        });
    }
  }
  
  // 分类
  if
    input.category_lbl.is_some() && !input.category_lbl.as_ref().unwrap().is_empty()
    && input.category.is_none()
  {
    let category_dict = &dict_vec[0];
    let dict_model = category_dict.iter().find(|item| {
      item.lbl == input.category_lbl.clone().unwrap_or_default()
    });
    let val = dict_model.map(|item| item.val.to_string());
    if let Some(val) = val {
      input.category = val.into();
    }
  } else if
    (input.category_lbl.is_none() || input.category_lbl.as_ref().unwrap().is_empty())
    && input.category.is_some()
  {
    let category_dict = &dict_vec[0];
    let dict_model = category_dict.iter().find(|item| {
      item.val == input.category.clone().unwrap_or_default()
    });
    let lbl = dict_model.map(|item| item.lbl.to_string());
    input.category_lbl = lbl;
  }
  
  // 发送通道
  if
    input.channel_lbl.is_some() && !input.channel_lbl.as_ref().unwrap().is_empty()
    && input.channel.is_none()
  {
    let channel_dict = &dict_vec[1];
    let dict_model = channel_dict.iter().find(|item| {
      item.lbl == input.channel_lbl.clone().unwrap_or_default()
    });
    let val = dict_model.map(|item| item.val.to_string());
    if let Some(val) = val {
      input.channel = val.into();
    }
  } else if
    (input.channel_lbl.is_none() || input.channel_lbl.as_ref().unwrap().is_empty())
    && input.channel.is_some()
  {
    let channel_dict = &dict_vec[1];
    let dict_model = channel_dict.iter().find(|item| {
      item.val == input.channel.clone().unwrap_or_default()
    });
    let lbl = dict_model.map(|item| item.lbl.to_string());
    input.channel_lbl = lbl;
  }
  
  // 发送人
  if input.sender_usr_id_lbl.is_some()
    && !input.sender_usr_id_lbl.as_ref().unwrap().is_empty()
    && input.sender_usr_id.is_none()
  {
    input.sender_usr_id_lbl = input.sender_usr_id_lbl.map(|item| 
      String::from(item.trim())
    );
    let model = crate::base::usr::usr_dao::find_one_usr(
      crate::base::usr::usr_model::UsrSearch {
        lbl: input.sender_usr_id_lbl.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(model) = model {
      input.sender_usr_id = model.id.into();
    }
  } else if
    (input.sender_usr_id_lbl.is_none() || input.sender_usr_id_lbl.as_ref().unwrap().is_empty())
    && input.sender_usr_id.is_some()
  {
    let usr_model = crate::base::usr::usr_dao::find_one_usr(
      crate::base::usr::usr_model::UsrSearch {
        id: input.sender_usr_id.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(usr_model) = usr_model {
      input.sender_usr_id_lbl = usr_model.lbl.into();
    }
  }
  
  // 系统消息
  if
    input.is_sys_msg_lbl.is_some() && !input.is_sys_msg_lbl.as_ref().unwrap().is_empty()
    && input.is_sys_msg.is_none()
  {
    let is_sys_msg_dict = &dict_vec[2];
    let dict_model = is_sys_msg_dict.iter().find(|item| {
      item.lbl == input.is_sys_msg_lbl.clone().unwrap_or_default()
    });
    let val = dict_model.map(|item| item.val.to_string());
    if let Some(val) = val {
      input.is_sys_msg = val.parse::<u8>()?.into();
    }
  } else if
    (input.is_sys_msg_lbl.is_none() || input.is_sys_msg_lbl.as_ref().unwrap().is_empty())
    && input.is_sys_msg.is_some()
  {
    let is_sys_msg_dict = &dict_vec[2];
    let dict_model = is_sys_msg_dict.iter().find(|item| {
      item.val == input.is_sys_msg.unwrap_or_default().to_string()
    });
    let lbl = dict_model.map(|item| item.lbl.to_string());
    input.is_sys_msg_lbl = lbl;
  }
  
  // 置顶
  if
    input.is_pinned_lbl.is_some() && !input.is_pinned_lbl.as_ref().unwrap().is_empty()
    && input.is_pinned.is_none()
  {
    let is_pinned_dict = &dict_vec[3];
    let dict_model = is_pinned_dict.iter().find(|item| {
      item.lbl == input.is_pinned_lbl.clone().unwrap_or_default()
    });
    let val = dict_model.map(|item| item.val.to_string());
    if let Some(val) = val {
      input.is_pinned = val.parse::<u8>()?.into();
    }
  } else if
    (input.is_pinned_lbl.is_none() || input.is_pinned_lbl.as_ref().unwrap().is_empty())
    && input.is_pinned.is_some()
  {
    let is_pinned_dict = &dict_vec[3];
    let dict_model = is_pinned_dict.iter().find(|item| {
      item.val == input.is_pinned.unwrap_or_default().to_string()
    });
    let lbl = dict_model.map(|item| item.lbl.to_string());
    input.is_pinned_lbl = lbl;
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

// MARK: creates_return_message
/// 批量创建消息并返回
#[allow(dead_code)]
pub async fn creates_return_message(
  inputs: Vec<MessageInput>,
  options: Option<Options>,
) -> Result<Vec<MessageModel>> {
  
  let table = get_table_name_message();
  let method = "creates_return_message";
  
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
  
  let models_message = find_by_ids_message(
    ids,
    options,
  ).await?;
  
  Ok(models_message)
}

// MARK: creates_message
/// 批量创建消息
pub async fn creates_message(
  inputs: Vec<MessageInput>,
  options: Option<Options>,
) -> Result<Vec<MessageId>> {
  
  let table = get_table_name_message();
  let method = "creates_message";
  
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

/// 批量创建消息
#[allow(unused_variables, clippy::redundant_locals, unused_mut)]
async fn _creates(
  inputs: Vec<MessageInput>,
  options: Option<Options>,
) -> Result<Vec<MessageId>> {
  
  let table = get_table_name_message();
  
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
  
  let mut ids2: Vec<MessageId> = vec![];
  let mut inputs2: Vec<MessageInput> = vec![];
  
  for input in inputs {
  
    if input.id.is_some() {
      return Err(eyre!("Can not set id when create in dao: {table}"));
    }

    let mut input = input;

    // 发送人
    if (input.sender_usr_id_lbl.is_none() || input.sender_usr_id_lbl.as_ref().unwrap().is_empty())
      && input.sender_usr_id.is_some()
      && !input.sender_usr_id.as_ref().unwrap().is_empty()
    {
      let usr_model = crate::base::usr::usr_dao::find_by_id_usr(
        input.sender_usr_id.clone().unwrap(),
        Some(Options::new().set_is_debug(Some(false))),
      ).await?;
      if let Some(usr_model) = usr_model {
        input.sender_usr_id_lbl = usr_model.lbl.into();
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
    
    let old_models = find_by_unique_message(
      input.clone().into(),
      None,
      options,
    ).await?;
    
    if !old_models.is_empty() {
      let mut id: Option<MessageId> = None;
      
      for old_model in old_models {
        let options = Options::from(options)
          .set_unique_type(unique_type);
        
        id = check_by_unique_message(
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
  let mut sql_fields = String::with_capacity(80 * 17 * 3 + 60);
  
  sql_fields += "id";
  sql_fields += ",create_time";
  sql_fields += ",update_time";
  sql_fields += ",create_usr_id";
  sql_fields += ",create_usr_id_lbl";
  sql_fields += ",update_usr_id";
  sql_fields += ",update_usr_id_lbl";
  sql_fields += ",tenant_id";
  // 分类
  sql_fields += ",category";
  // 发送通道
  sql_fields += ",channel";
  // 标题
  sql_fields += ",title";
  // 内容
  sql_fields += ",content";
  // 跳转路由
  sql_fields += ",route_path";
  // 跳转参数
  sql_fields += ",route_query";
  // 发送人
  sql_fields += ",sender_usr_id_lbl";
  // 发送人
  sql_fields += ",sender_usr_id";
  // 系统消息
  sql_fields += ",is_sys_msg";
  // 置顶
  sql_fields += ",is_pinned";
  // 所属组织
  sql_fields += ",org_id_lbl";
  // 所属组织
  sql_fields += ",org_id";
  
  let inputs2_len = inputs2.len();
  let mut sql_values = String::with_capacity(((2 * 17 + 3) * inputs2_len) * 3);
  let mut inputs2_ids = vec![];
  
  for (i, input) in inputs2
    .clone()
    .into_iter()
    .enumerate()
  {
    
    let id: MessageId = get_short_uuid().into();
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
    // 分类
    if let Some(category) = input.category {
      sql_values += ",?";
      args.push(category.into());
    } else {
      sql_values += ",default";
    }
    // 发送通道
    if let Some(channel) = input.channel {
      sql_values += ",?";
      args.push(channel.into());
    } else {
      sql_values += ",default";
    }
    // 标题
    if let Some(title) = input.title {
      sql_values += ",?";
      args.push(title.into());
    } else {
      sql_values += ",default";
    }
    // 内容
    if let Some(content) = input.content {
      sql_values += ",?";
      args.push(content.into());
    } else {
      sql_values += ",default";
    }
    // 跳转路由
    if let Some(route_path) = input.route_path {
      sql_values += ",?";
      args.push(route_path.into());
    } else {
      sql_values += ",default";
    }
    // 跳转参数
    if let Some(route_query) = input.route_query {
      sql_values += ",?";
      args.push(route_query.into());
    } else {
      sql_values += ",default";
    }
    // 发送人
    if let Some(sender_usr_id_lbl) = input.sender_usr_id_lbl {
      sql_values += ",?";
      args.push(sender_usr_id_lbl.into());
    } else {
      sql_values += ",default";
    }
    // 发送人
    if let Some(sender_usr_id) = input.sender_usr_id {
      sql_values += ",?";
      args.push(sender_usr_id.into());
    } else {
      sql_values += ",default";
    }
    // 系统消息
    if let Some(is_sys_msg) = input.is_sys_msg {
      sql_values += ",?";
      args.push(is_sys_msg.into());
    } else {
      sql_values += ",default";
    }
    // 置顶
    if let Some(is_pinned) = input.is_pinned {
      sql_values += ",?";
      args.push(is_pinned.into());
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

// MARK: create_return_message
/// 创建消息并返回
#[allow(dead_code)]
pub async fn create_return_message(
  #[allow(unused_mut)]
  mut input: MessageInput,
  options: Option<Options>,
) -> Result<MessageModel> {
  
  let id = create_message(
    input.clone(),
    options,
  ).await?;
  
  let model_message = find_by_id_message(
    id,
    options,
  ).await?;
  
  let model_message = match model_message {
    Some(model) => model,
    None => {
      let err_msg = "create_return_message: model_message.is_none()";
      return Err(eyre!(
        ServiceException {
          message: err_msg.into(),
          trace: true,
          ..Default::default()
        },
      ));
    }
  };
  
  Ok(model_message)
}

// MARK: create_message
/// 创建消息
#[allow(dead_code)]
pub async fn create_message(
  #[allow(unused_mut)]
  mut input: MessageInput,
  options: Option<Options>,
) -> Result<MessageId> {
  
  let table = get_table_name_message();
  let method = "create_message";
  
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

// MARK: update_tenant_by_id_message
/// 消息根据id修改租户id
pub async fn update_tenant_by_id_message(
  id: MessageId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  let table = get_table_name_message();
  let method = "update_tenant_by_id_message";
  
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

// MARK: sync_usr_lbl_by_usr_id_message
/// 根据 usr_id 同步创建人/更新人/删除人标签
pub async fn sync_usr_lbl_by_usr_id_message(
  usr_id: UsrId,
  options: Option<Options>,
) -> Result<u64> {
  let table = get_table_name_message();
  let method = "sync_usr_lbl_by_usr_id_message";
  
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
  
  Ok(num)
}

// MARK: update_by_id_message
/// 根据 id 修改消息
#[allow(unused_mut)]
#[allow(unused_variables)]
pub async fn update_by_id_message(
  id: MessageId,
  mut input: MessageInput,
  options: Option<Options>,
) -> Result<MessageId> {
  
  let table = get_table_name_message();
  let method = "update_by_id_message";
  
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

  // 发送人
  if (input.sender_usr_id_lbl.is_none() || input.sender_usr_id_lbl.as_ref().unwrap().is_empty())
    && input.sender_usr_id.is_some()
    && !input.sender_usr_id.as_ref().unwrap().is_empty()
  {
    let usr_model = crate::base::usr::usr_dao::find_by_id_usr(
      input.sender_usr_id.clone().unwrap(),
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(usr_model) = usr_model {
      input.sender_usr_id_lbl = usr_model.lbl.into();
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
  
  let old_model = find_by_id_message(
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
    
    let models = find_by_unique_message(
      input.into(),
      None,
      options,
    ).await?;
    
    let models = models.into_iter()
      .filter(|item| 
        item.id != id
      )
      .collect::<Vec<MessageModel>>();
    
    if !models.is_empty() {
      let unique_type = options
        .as_ref()
        .and_then(|item| item.get_unique_type())
        .unwrap_or(UniqueType::Throw);
      if unique_type == UniqueType::Throw {
        let err_msg = "消息 重复";
        return Err(eyre!(err_msg));
      } else if unique_type == UniqueType::Ignore {
        return Ok(id);
      }
    }
  }
  
  let mut args = QueryArgs::new();
  
  let mut sql_fields = String::with_capacity((80 * 17 + 20) * 3);
  
  let mut field_num: usize = 0;
  
  if let Some(tenant_id) = input.tenant_id {
    field_num += 1;
    sql_fields += "tenant_id=?,";
    args.push(tenant_id.into());
  }
  // 分类
  if let Some(category) = input.category.clone() {
    field_num += 1;
    sql_fields += "category=?,";
    args.push(category.into());
  }
  // 发送通道
  if let Some(channel) = input.channel.clone() {
    field_num += 1;
    sql_fields += "channel=?,";
    args.push(channel.into());
  }
  // 标题
  if let Some(title) = input.title.clone() {
    field_num += 1;
    sql_fields += "title=?,";
    args.push(title.into());
  }
  // 内容
  if let Some(content) = input.content.clone() {
    field_num += 1;
    sql_fields += "content=?,";
    args.push(content.into());
  }
  // 跳转路由
  if let Some(route_path) = input.route_path.clone() {
    field_num += 1;
    sql_fields += "route_path=?,";
    args.push(route_path.into());
  }
  // 跳转参数
  if let Some(route_query) = input.route_query.clone() {
    field_num += 1;
    sql_fields += "route_query=?,";
    args.push(route_query.into());
  }
  // 发送人
  if let Some(sender_usr_id_lbl) = input.sender_usr_id_lbl {
    field_num += 1;
    sql_fields += "sender_usr_id_lbl=?,";
    args.push(sender_usr_id_lbl.into());
  }
  // 发送人
  if let Some(sender_usr_id) = input.sender_usr_id {
    field_num += 1;
    sql_fields += "sender_usr_id=?,";
    args.push(sender_usr_id.into());
  }
  // 系统消息
  if let Some(is_sys_msg) = input.is_sys_msg {
    field_num += 1;
    sql_fields += "is_sys_msg=?,";
    args.push(is_sys_msg.into());
  }
  // 置顶
  if let Some(is_pinned) = input.is_pinned {
    field_num += 1;
    sql_fields += "is_pinned=?,";
    args.push(is_pinned.into());
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

// MARK: update_by_id_return_message
/// 根据 id 更新消息, 并返回更新后的数据
#[allow(dead_code)]
pub async fn update_by_id_return_message(
  id: MessageId,
  input: MessageInput,
  options: Option<Options>,
) -> Result<MessageModel> {
  
  update_by_id_message(
    id,
    input,
    options,
  ).await?;
  
  let model = find_by_id_message(
    id,
    options,
  ).await?;
  
  match model {
    Some(model) => Ok(model),
    None => Err(eyre!(
      "消息 update_by_id_return_message id: {id}",
    )),
  }
}

// MARK: delete_by_ids_message
/// 根据 ids 删除消息
#[allow(unused_variables)]
pub async fn delete_by_ids_message(
  ids: Vec<MessageId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_message();
  let method = "delete_by_ids_message";
  
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
  
  let old_models = find_by_ids_message(
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
  
  if num > MAX_SAFE_INTEGER {
    return Err(eyre!("num: {} > MAX_SAFE_INTEGER", num));
  }
  
  Ok(num)
}

// MARK: revert_by_ids_message
/// 根据 ids 还原消息
pub async fn revert_by_ids_message(
  ids: Vec<MessageId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_message();
  let method = "revert_by_ids_message";
  
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
    
    let mut old_model = find_one_message(
      MessageSearch {
        id: Some(id),
        is_deleted: Some(1),
        ..Default::default()
      }.into(),
      None,
      options,
    ).await?;
    
    if old_model.is_none() {
      old_model = find_by_id_message(
        id,
        options,
      ).await?;
    }
    
    let old_model = match old_model {
      Some(model) => model,
      None => continue,
    };
    
    {
      let mut input: MessageInput = old_model.clone().into();
      input.id = None;
      
      let models = find_by_unique_message(
        input.into(),
        None,
        options,
      ).await?;
      
      let models: Vec<MessageModel> = models
        .into_iter()
        .filter(|item| 
          item.id != id
        )
        .collect();
      
      if !models.is_empty() {
        let err_msg = "消息 重复";
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

// MARK: force_delete_by_ids_message
/// 根据 ids 彻底删除消息
#[allow(unused_variables)]
pub async fn force_delete_by_ids_message(
  ids: Vec<MessageId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_message();
  let method = "force_delete_by_ids_message";
  
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
    
    let old_model = find_one_message(
      Some(MessageSearch {
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

// MARK: validate_option_message
/// 校验消息是否存在
#[allow(dead_code)]
pub async fn validate_option_message(
  model: Option<MessageModel>,
) -> Result<MessageModel> {
  
  let model = match model {
    Some(model) => model,
    None => {
      let err_msg = String::from("消息不存在");
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
