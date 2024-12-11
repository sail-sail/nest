#[allow(unused_imports)]
use serde::{Serialize, Deserialize};
#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use std::collections::HashSet;

use anyhow::{Result,anyhow};
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
use crate::src::base::i18n::i18n_dao::get_server_i18n_enable;

use super::wxw_app_token_model::*;

use crate::r#gen::base::tenant::tenant_model::TenantId;
use crate::r#gen::wxwork::wxw_app::wxw_app_model::WxwAppId;
use crate::r#gen::base::usr::usr_model::UsrId;

use crate::r#gen::base::usr::usr_dao::find_by_id as find_by_id_usr;

#[allow(unused_variables)]
async fn get_where_query(
  args: &mut QueryArgs,
  search: Option<&WxwAppTokenSearch>,
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
    let ids: Option<Vec<WxwAppTokenId>> = match search {
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
        Some(item) => item.tenant_id.clone(),
        None => None,
      };
      let tenant_id = match tenant_id {
        None => get_auth_tenant_id(),
        Some(item) => match item.as_str() {
          "-" => None,
          _ => item.into(),
        },
      };
      tenant_id
    };
    if let Some(tenant_id) = tenant_id {
      where_query.push_str(" and t.tenant_id=?");
      args.push(tenant_id.into());
    }
  }
  // 企微应用
  {
    let wxw_app_id: Option<Vec<WxwAppId>> = match search {
      Some(item) => item.wxw_app_id.clone(),
      None => None,
    };
    if let Some(wxw_app_id) = wxw_app_id {
      let arg = {
        if wxw_app_id.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(wxw_app_id.len());
          for item in wxw_app_id {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.wxw_app_id in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let wxw_app_id_is_null: bool = match search {
      Some(item) => item.wxw_app_id_is_null.unwrap_or(false),
      None => false,
    };
    if wxw_app_id_is_null {
      where_query.push_str(" and t.wxw_app_id is null");
    }
  }
  {
    let wxw_app_id_lbl: Option<Vec<String>> = match search {
      Some(item) => item.wxw_app_id_lbl.clone(),
      None => None,
    };
    if let Some(wxw_app_id_lbl) = wxw_app_id_lbl {
      let arg = {
        if wxw_app_id_lbl.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(wxw_app_id_lbl.len());
          for item in wxw_app_id_lbl {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and wxw_app_id_lbl.lbl in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let wxw_app_id_lbl_like = match search {
      Some(item) => item.wxw_app_id_lbl_like.clone(),
      None => None,
    };
    if let Some(wxw_app_id_lbl_like) = wxw_app_id_lbl_like {
      where_query.push_str(" and wxw_app_id_lbl.lbl like ?");
      args.push(format!("%{}%", sql_like(&wxw_app_id_lbl_like)).into());
    }
  }
  // 类型corp和contact
  {
    let r#type = match search {
      Some(item) => item.r#type.clone(),
      None => None,
    };
    if let Some(r#type) = r#type {
      where_query.push_str(" and t.type=?");
      args.push(r#type.into());
    }
    let type_like = match search {
      Some(item) => item.type_like.clone(),
      None => None,
    };
    if let Some(type_like) = type_like {
      where_query.push_str(" and t.type like ?");
      args.push(format!("%{}%", sql_like(&type_like)).into());
    }
  }
  // 令牌
  {
    let access_token = match search {
      Some(item) => item.access_token.clone(),
      None => None,
    };
    if let Some(access_token) = access_token {
      where_query.push_str(" and t.access_token=?");
      args.push(access_token.into());
    }
    let access_token_like = match search {
      Some(item) => item.access_token_like.clone(),
      None => None,
    };
    if let Some(access_token_like) = access_token_like {
      where_query.push_str(" and t.access_token like ?");
      args.push(format!("%{}%", sql_like(&access_token_like)).into());
    }
  }
  // 令牌创建时间
  {
    let mut token_time = match search {
      Some(item) => item.token_time.unwrap_or_default(),
      None => Default::default(),
    };
    let token_time_gt = token_time[0].take();
    let token_time_lt = token_time[1].take();
    if let Some(token_time_gt) = token_time_gt {
      where_query.push_str(" and t.token_time >= ?");
      args.push(token_time_gt.into());
    }
    if let Some(token_time_lt) = token_time_lt {
      where_query.push_str(" and t.token_time <= ?");
      args.push(token_time_lt.into());
    }
  }
  // 令牌超时时间
  {
    let mut expires_in = match search {
      Some(item) => item.expires_in.unwrap_or_default(),
      None => Default::default(),
    };
    let expires_in_gt = expires_in[0].take();
    let expires_in_lt = expires_in[1].take();
    if let Some(expires_in_gt) = expires_in_gt {
      where_query.push_str(" and t.expires_in >= ?");
      args.push(expires_in_gt.into());
    }
    if let Some(expires_in_lt) = expires_in_lt {
      where_query.push_str(" and t.expires_in <= ?");
      args.push(expires_in_lt.into());
    }
  }
  // 企业jsapi_ticket
  {
    let jsapi_ticket = match search {
      Some(item) => item.jsapi_ticket.clone(),
      None => None,
    };
    if let Some(jsapi_ticket) = jsapi_ticket {
      where_query.push_str(" and t.jsapi_ticket=?");
      args.push(jsapi_ticket.into());
    }
    let jsapi_ticket_like = match search {
      Some(item) => item.jsapi_ticket_like.clone(),
      None => None,
    };
    if let Some(jsapi_ticket_like) = jsapi_ticket_like {
      where_query.push_str(" and t.jsapi_ticket like ?");
      args.push(format!("%{}%", sql_like(&jsapi_ticket_like)).into());
    }
  }
  // 企业jsapi_ticket创建时间
  {
    let mut jsapi_ticket_time = match search {
      Some(item) => item.jsapi_ticket_time.unwrap_or_default(),
      None => Default::default(),
    };
    let jsapi_ticket_time_gt = jsapi_ticket_time[0].take();
    let jsapi_ticket_time_lt = jsapi_ticket_time[1].take();
    if let Some(jsapi_ticket_time_gt) = jsapi_ticket_time_gt {
      where_query.push_str(" and t.jsapi_ticket_time >= ?");
      args.push(jsapi_ticket_time_gt.into());
    }
    if let Some(jsapi_ticket_time_lt) = jsapi_ticket_time_lt {
      where_query.push_str(" and t.jsapi_ticket_time <= ?");
      args.push(jsapi_ticket_time_lt.into());
    }
  }
  // 企业jsapi_ticket超时时间
  {
    let mut jsapi_ticket_expires_in = match search {
      Some(item) => item.jsapi_ticket_expires_in.unwrap_or_default(),
      None => Default::default(),
    };
    let jsapi_ticket_expires_in_gt = jsapi_ticket_expires_in[0].take();
    let jsapi_ticket_expires_in_lt = jsapi_ticket_expires_in[1].take();
    if let Some(jsapi_ticket_expires_in_gt) = jsapi_ticket_expires_in_gt {
      where_query.push_str(" and t.jsapi_ticket_expires_in >= ?");
      args.push(jsapi_ticket_expires_in_gt.into());
    }
    if let Some(jsapi_ticket_expires_in_lt) = jsapi_ticket_expires_in_lt {
      where_query.push_str(" and t.jsapi_ticket_expires_in <= ?");
      args.push(jsapi_ticket_expires_in_lt.into());
    }
  }
  // 应用jsapi_ticket
  {
    let jsapi_ticket_agent_config = match search {
      Some(item) => item.jsapi_ticket_agent_config.clone(),
      None => None,
    };
    if let Some(jsapi_ticket_agent_config) = jsapi_ticket_agent_config {
      where_query.push_str(" and t.jsapi_ticket_agent_config=?");
      args.push(jsapi_ticket_agent_config.into());
    }
    let jsapi_ticket_agent_config_like = match search {
      Some(item) => item.jsapi_ticket_agent_config_like.clone(),
      None => None,
    };
    if let Some(jsapi_ticket_agent_config_like) = jsapi_ticket_agent_config_like {
      where_query.push_str(" and t.jsapi_ticket_agent_config like ?");
      args.push(format!("%{}%", sql_like(&jsapi_ticket_agent_config_like)).into());
    }
  }
  // 应用jsapi_ticket创建时间
  {
    let mut jsapi_ticket_agent_config_time = match search {
      Some(item) => item.jsapi_ticket_agent_config_time.unwrap_or_default(),
      None => Default::default(),
    };
    let jsapi_ticket_agent_config_time_gt = jsapi_ticket_agent_config_time[0].take();
    let jsapi_ticket_agent_config_time_lt = jsapi_ticket_agent_config_time[1].take();
    if let Some(jsapi_ticket_agent_config_time_gt) = jsapi_ticket_agent_config_time_gt {
      where_query.push_str(" and t.jsapi_ticket_agent_config_time >= ?");
      args.push(jsapi_ticket_agent_config_time_gt.into());
    }
    if let Some(jsapi_ticket_agent_config_time_lt) = jsapi_ticket_agent_config_time_lt {
      where_query.push_str(" and t.jsapi_ticket_agent_config_time <= ?");
      args.push(jsapi_ticket_agent_config_time_lt.into());
    }
  }
  // 应用jsapi_ticket超时时间
  {
    let mut jsapi_ticket_agent_config_expires_in = match search {
      Some(item) => item.jsapi_ticket_agent_config_expires_in.unwrap_or_default(),
      None => Default::default(),
    };
    let jsapi_ticket_agent_config_expires_in_gt = jsapi_ticket_agent_config_expires_in[0].take();
    let jsapi_ticket_agent_config_expires_in_lt = jsapi_ticket_agent_config_expires_in[1].take();
    if let Some(jsapi_ticket_agent_config_expires_in_gt) = jsapi_ticket_agent_config_expires_in_gt {
      where_query.push_str(" and t.jsapi_ticket_agent_config_expires_in >= ?");
      args.push(jsapi_ticket_agent_config_expires_in_gt.into());
    }
    if let Some(jsapi_ticket_agent_config_expires_in_lt) = jsapi_ticket_agent_config_expires_in_lt {
      where_query.push_str(" and t.jsapi_ticket_agent_config_expires_in <= ?");
      args.push(jsapi_ticket_agent_config_expires_in_lt.into());
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
        where_query.push_str(" and create_usr_id_lbl.lbl like ?");
        args.push(format!("%{}%", sql_like(&create_usr_id_lbl_like)).into());
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
        where_query.push_str(" and update_usr_id_lbl.lbl like ?");
        args.push(format!("%{}%", sql_like(&update_usr_id_lbl_like)).into());
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
  search: Option<&WxwAppTokenSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let server_i18n_enable = get_server_i18n_enable();
  
  let from_query = r#"wxwork_wxw_app_token t
  left join wxwork_wxw_app wxw_app_id_lbl on wxw_app_id_lbl.id=t.wxw_app_id"#.to_owned();
  Ok(from_query)
}

// MARK: find_all
/// 根据搜索条件和分页查找企微应用接口凭据列表
#[allow(unused_mut)]
pub async fn find_all(
  search: Option<WxwAppTokenSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxwAppTokenModel>> {
  
  let table = "wxwork_wxw_app_token";
  let method = "find_all";
  
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
  // 企微应用
  if let Some(search) = &search {
    if search.wxw_app_id.is_some() {
      let len = search.wxw_app_id.as_ref().unwrap().len();
      if len == 0 {
        return Ok(vec![]);
      }
      let ids_limit = options
        .as_ref()
        .and_then(|x| x.get_ids_limit())
        .unwrap_or(FIND_ALL_IDS_LIMIT);
      if len > ids_limit {
        return Err(anyhow!("search.wxw_app_id.length > {ids_limit}"));
      }
    }
  }
  // 创建人
  if let Some(search) = &search {
    if search.create_usr_id.is_some() {
      let len = search.create_usr_id.as_ref().unwrap().len();
      if len == 0 {
        return Ok(vec![]);
      }
      let ids_limit = options
        .as_ref()
        .and_then(|x| x.get_ids_limit())
        .unwrap_or(FIND_ALL_IDS_LIMIT);
      if len > ids_limit {
        return Err(anyhow!("search.create_usr_id.length > {ids_limit}"));
      }
    }
  }
  // 更新人
  if let Some(search) = &search {
    if search.update_usr_id.is_some() {
      let len = search.update_usr_id.as_ref().unwrap().len();
      if len == 0 {
        return Ok(vec![]);
      }
      let ids_limit = options
        .as_ref()
        .and_then(|x| x.get_ids_limit())
        .unwrap_or(FIND_ALL_IDS_LIMIT);
      if len > ids_limit {
        return Err(anyhow!("search.update_usr_id.length > {ids_limit}"));
      }
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
  
  let sort = sort.into();
  
  let order_by_query = get_order_by_query(sort);
  let page_query = get_page_query(page);
  
  let sql = format!(r#"select f.* from (select t.*
  ,wxw_app_id_lbl.lbl wxw_app_id_lbl
  from {from_query} where {where_query} group by t.id{order_by_query}) f {page_query}"#);
  
  let args = args.into();
  
  let options = Options::from(options);
  
  let options = options.set_cache_key(table, &sql, &args);
  
  let mut res: Vec<WxwAppTokenModel> = query(
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
/// 根据条件查找企微应用接口凭据总数
pub async fn find_count(
  search: Option<WxwAppTokenSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "wxwork_wxw_app_token";
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
  
  Ok(total)
}

/// 获取当前路由的国际化
pub fn get_n_route() -> i18n_dao::NRoute {
  i18n_dao::NRoute {
    route_path: get_route_path_wxw_app_token().into(),
  }
}

// MARK: get_field_comments
/// 获取企微应用接口凭据字段注释
pub async fn get_field_comments(
  _options: Option<Options>,
) -> Result<WxwAppTokenFieldComment> {
  
  let n_route = get_n_route();
  
  let i18n_code_maps: Vec<i18n_dao::I18nCodeMap> = vec![
    "ID".into(),
    "企微应用".into(),
    "企微应用".into(),
    "类型corp和contact".into(),
    "令牌".into(),
    "令牌创建时间".into(),
    "令牌创建时间".into(),
    "令牌超时时间".into(),
    "企业jsapi_ticket".into(),
    "企业jsapi_ticket创建时间".into(),
    "企业jsapi_ticket创建时间".into(),
    "企业jsapi_ticket超时时间".into(),
    "应用jsapi_ticket".into(),
    "应用jsapi_ticket创建时间".into(),
    "应用jsapi_ticket创建时间".into(),
    "应用jsapi_ticket超时时间".into(),
    "创建人".into(),
    "创建人".into(),
    "创建时间".into(),
    "创建时间".into(),
    "更新人".into(),
    "更新人".into(),
    "更新时间".into(),
    "更新时间".into(),
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
  
  let field_comments = WxwAppTokenFieldComment {
    id: vec[0].to_owned(),
    wxw_app_id: vec[1].to_owned(),
    wxw_app_id_lbl: vec[2].to_owned(),
    r#type: vec[3].to_owned(),
    access_token: vec[4].to_owned(),
    token_time: vec[5].to_owned(),
    token_time_lbl: vec[6].to_owned(),
    expires_in: vec[7].to_owned(),
    jsapi_ticket: vec[8].to_owned(),
    jsapi_ticket_time: vec[9].to_owned(),
    jsapi_ticket_time_lbl: vec[10].to_owned(),
    jsapi_ticket_expires_in: vec[11].to_owned(),
    jsapi_ticket_agent_config: vec[12].to_owned(),
    jsapi_ticket_agent_config_time: vec[13].to_owned(),
    jsapi_ticket_agent_config_time_lbl: vec[14].to_owned(),
    jsapi_ticket_agent_config_expires_in: vec[15].to_owned(),
    create_usr_id: vec[16].to_owned(),
    create_usr_id_lbl: vec[17].to_owned(),
    create_time: vec[18].to_owned(),
    create_time_lbl: vec[19].to_owned(),
    update_usr_id: vec[20].to_owned(),
    update_usr_id_lbl: vec[21].to_owned(),
    update_time: vec[22].to_owned(),
    update_time_lbl: vec[23].to_owned(),
  };
  Ok(field_comments)
}

// MARK: find_one
/// 根据条件查找第一个企微应用接口凭据
pub async fn find_one(
  search: Option<WxwAppTokenSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<WxwAppTokenModel>> {
  
  let table = "wxwork_wxw_app_token";
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
  
  let model: Option<WxwAppTokenModel> = res.into_iter().next();
  
  Ok(model)
}

// MARK: find_by_id
/// 根据 id 查找企微应用接口凭据
pub async fn find_by_id(
  id: WxwAppTokenId,
  options: Option<Options>,
) -> Result<Option<WxwAppTokenModel>> {
  
  let table = "wxwork_wxw_app_token";
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
  
  let search = WxwAppTokenSearch {
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
/// 根据 ids 查找企微应用接口凭据
#[allow(dead_code)]
pub async fn find_by_ids(
  ids: Vec<WxwAppTokenId>,
  options: Option<Options>,
) -> Result<Vec<WxwAppTokenModel>> {
  
  let table = "wxwork_wxw_app_token";
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
    return Err(anyhow!("find_by_ids: ids.length > FIND_ALL_IDS_LIMIT"));
  }
  
  let search = WxwAppTokenSearch {
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
    return Err(anyhow!("find_by_ids: models.length !== ids.length"));
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
      Err(anyhow!("find_by_ids: id: {id} not found"))
    })
    .collect::<Result<Vec<WxwAppTokenModel>>>()?;
  
  Ok(models)
}

// MARK: exists
/// 根据搜索条件判断企微应用接口凭据是否存在
#[allow(dead_code)]
pub async fn exists(
  search: Option<WxwAppTokenSearch>,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = "wxwork_wxw_app_token";
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
/// 根据 id 判断企微应用接口凭据是否存在
#[allow(dead_code)]
pub async fn exists_by_id(
  id: WxwAppTokenId,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = "wxwork_wxw_app_token";
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
  
  let search = WxwAppTokenSearch {
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
  search: WxwAppTokenSearch,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxwAppTokenModel>> {
  
  let table = "wxwork_wxw_app_token";
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
  
  let mut models: Vec<WxwAppTokenModel> = vec![];
  
  let mut models_tmp = {
    if
      search.wxw_app_id.is_none() ||
      search.r#type.is_none()
    {
      return Ok(vec![]);
    }
    
    let search = WxwAppTokenSearch {
      wxw_app_id: search.wxw_app_id.clone(),
      r#type: search.r#type.clone(),
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
  
  let mut models_tmp = {
    if
      search.access_token.is_none()
    {
      return Ok(vec![]);
    }
    
    let search = WxwAppTokenSearch {
      access_token: search.access_token.clone(),
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
  input: &WxwAppTokenInput,
  model: &WxwAppTokenModel,
) -> bool {
  if input.id.as_ref().is_some() {
    return input.id.as_ref().unwrap() == &model.id;
  }
  
  if
    input.wxw_app_id.as_ref().is_some() && input.wxw_app_id.as_ref().unwrap() == &model.wxw_app_id &&
    input.r#type.as_ref().is_some() && input.r#type.as_ref().unwrap() == &model.r#type
  {
    return true;
  }
  
  if
    input.access_token.as_ref().is_some() && input.access_token.as_ref().unwrap() == &model.access_token
  {
    return true;
  }
  false
}

// MARK: check_by_unique
/// 通过唯一约束检查数据是否已经存在
#[allow(unused_variables)]
pub async fn check_by_unique(
  input: WxwAppTokenInput,
  model: WxwAppTokenModel,
  options: Option<Options>,
) -> Result<Option<WxwAppTokenId>> {
  
  let table = "wxwork_wxw_app_token";
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
      "企微应用接口凭据".to_owned(),
      None,
    ).await?;
    let map = HashMap::from([
      ("0".to_owned(), table_comment),
    ]);
    let err_msg = i18n_dao::ns(
      "此 {0} 已经存在".to_owned(),
      map.into(),
    ).await?;
    return Err(anyhow!(err_msg));
  }
  Ok(None)
}

// MARK: set_id_by_lbl
/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(unused_variables, dead_code)]
pub async fn set_id_by_lbl(
  input: WxwAppTokenInput,
) -> Result<WxwAppTokenInput> {
  
  #[allow(unused_mut)]
  let mut input = input;
  
  // 令牌创建时间
  if input.token_time.is_none() {
    if let Some(token_time_lbl) = input.token_time_lbl.as_ref().filter(|s| !s.is_empty()) {
      input.token_time = chrono::NaiveDateTime::parse_from_str(token_time_lbl, "%Y-%m-%d %H:%M:%S").ok();
      if input.token_time.is_none() {
        input.token_time = chrono::NaiveDateTime::parse_from_str(token_time_lbl, "%Y-%m-%d").ok();
      }
      if input.token_time.is_none() {
        let field_comments = get_field_comments(
          None,
        ).await?;
        let column_comment = field_comments.token_time;
        
        let err_msg = i18n_dao::ns(
          "日期格式错误".to_owned(),
          None,
        ).await?;
        return Err(anyhow!("{column_comment} {err_msg}"));
      }
    }
  }
  
  // 企业jsapi_ticket创建时间
  if input.jsapi_ticket_time.is_none() {
    if let Some(jsapi_ticket_time_lbl) = input.jsapi_ticket_time_lbl.as_ref().filter(|s| !s.is_empty()) {
      input.jsapi_ticket_time = chrono::NaiveDateTime::parse_from_str(jsapi_ticket_time_lbl, "%Y-%m-%d %H:%M:%S").ok();
      if input.jsapi_ticket_time.is_none() {
        input.jsapi_ticket_time = chrono::NaiveDateTime::parse_from_str(jsapi_ticket_time_lbl, "%Y-%m-%d").ok();
      }
      if input.jsapi_ticket_time.is_none() {
        let field_comments = get_field_comments(
          None,
        ).await?;
        let column_comment = field_comments.jsapi_ticket_time;
        
        let err_msg = i18n_dao::ns(
          "日期格式错误".to_owned(),
          None,
        ).await?;
        return Err(anyhow!("{column_comment} {err_msg}"));
      }
    }
  }
  
  // 应用jsapi_ticket创建时间
  if input.jsapi_ticket_agent_config_time.is_none() {
    if let Some(jsapi_ticket_agent_config_time_lbl) = input.jsapi_ticket_agent_config_time_lbl.as_ref().filter(|s| !s.is_empty()) {
      input.jsapi_ticket_agent_config_time = chrono::NaiveDateTime::parse_from_str(jsapi_ticket_agent_config_time_lbl, "%Y-%m-%d %H:%M:%S").ok();
      if input.jsapi_ticket_agent_config_time.is_none() {
        input.jsapi_ticket_agent_config_time = chrono::NaiveDateTime::parse_from_str(jsapi_ticket_agent_config_time_lbl, "%Y-%m-%d").ok();
      }
      if input.jsapi_ticket_agent_config_time.is_none() {
        let field_comments = get_field_comments(
          None,
        ).await?;
        let column_comment = field_comments.jsapi_ticket_agent_config_time;
        
        let err_msg = i18n_dao::ns(
          "日期格式错误".to_owned(),
          None,
        ).await?;
        return Err(anyhow!("{column_comment} {err_msg}"));
      }
    }
  }
  
  // 企微应用
  if input.wxw_app_id_lbl.is_some()
    && !input.wxw_app_id_lbl.as_ref().unwrap().is_empty()
    && input.wxw_app_id.is_none()
  {
    input.wxw_app_id_lbl = input.wxw_app_id_lbl.map(|item| 
      item.trim().to_owned()
    );
    let model = crate::r#gen::wxwork::wxw_app::wxw_app_dao::find_one(
      crate::r#gen::wxwork::wxw_app::wxw_app_model::WxwAppSearch {
        lbl: input.wxw_app_id_lbl.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(model) = model {
      input.wxw_app_id = model.id.into();
    }
  } else if
    (input.wxw_app_id_lbl.is_none() || input.wxw_app_id_lbl.as_ref().unwrap().is_empty())
    && input.wxw_app_id.is_some()
  {
    let wxw_app_model = crate::r#gen::wxwork::wxw_app::wxw_app_dao::find_one(
      crate::r#gen::wxwork::wxw_app::wxw_app_model::WxwAppSearch {
        id: input.wxw_app_id.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(wxw_app_model) = wxw_app_model {
      input.wxw_app_id_lbl = wxw_app_model.lbl.into();
    }
  }
  
  Ok(input)
}

// MARK: creates_return
/// 批量创建企微应用接口凭据并返回
#[allow(dead_code)]
pub async fn creates_return(
  inputs: Vec<WxwAppTokenInput>,
  options: Option<Options>,
) -> Result<Vec<WxwAppTokenModel>> {
  
  let table = "wxwork_wxw_app_token";
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
/// 批量创建企微应用接口凭据
pub async fn creates(
  inputs: Vec<WxwAppTokenInput>,
  options: Option<Options>,
) -> Result<Vec<WxwAppTokenId>> {
  
  let table = "wxwork_wxw_app_token";
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

/// 批量创建企微应用接口凭据
#[allow(unused_variables)]
async fn _creates(
  inputs: Vec<WxwAppTokenInput>,
  options: Option<Options>,
) -> Result<Vec<WxwAppTokenId>> {
  
  let table = "wxwork_wxw_app_token";
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  
  let unique_type = options.as_ref()
    .and_then(|item|
      item.get_unique_type()
    )
    .unwrap_or_default();
  
  let mut ids2: Vec<WxwAppTokenId> = vec![];
  let mut inputs2: Vec<WxwAppTokenInput> = vec![];
  
  for input in inputs {
  
    if input.id.is_some() {
      return Err(anyhow!("Can not set id when create in dao: {table}"));
    }
    
    let old_models = find_by_unique(
      input.clone().into(),
      None,
      options.clone(),
    ).await?;
    
    if !old_models.is_empty() {
      let mut id: Option<WxwAppTokenId> = None;
      
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
  let mut sql_fields = String::with_capacity(80 * 18 + 20);
  
  sql_fields += "id";
  sql_fields += ",create_time";
  sql_fields += ",update_time";
  sql_fields += ",create_usr_id";
  sql_fields += ",create_usr_id_lbl";
  sql_fields += ",update_usr_id";
  sql_fields += ",update_usr_id_lbl";
  sql_fields += ",tenant_id";
  // 企微应用
  sql_fields += ",wxw_app_id";
  // 类型corp和contact
  sql_fields += ",type";
  // 令牌
  sql_fields += ",access_token";
  // 令牌创建时间
  sql_fields += ",token_time";
  // 令牌超时时间
  sql_fields += ",expires_in";
  // 企业jsapi_ticket
  sql_fields += ",jsapi_ticket";
  // 企业jsapi_ticket创建时间
  sql_fields += ",jsapi_ticket_time";
  // 企业jsapi_ticket超时时间
  sql_fields += ",jsapi_ticket_expires_in";
  // 应用jsapi_ticket
  sql_fields += ",jsapi_ticket_agent_config";
  // 应用jsapi_ticket创建时间
  sql_fields += ",jsapi_ticket_agent_config_time";
  // 应用jsapi_ticket超时时间
  sql_fields += ",jsapi_ticket_agent_config_expires_in";
  
  let inputs2_len = inputs2.len();
  let mut sql_values = String::with_capacity((2 * 18 + 3) * inputs2_len);
  let mut inputs2_ids = vec![];
  
  for (i, input) in inputs2
    .clone()
    .into_iter()
    .enumerate()
  {
    
    let id: WxwAppTokenId = get_short_uuid().into();
    ids2.push(id.clone());
    
    inputs2_ids.push(id.clone());
    
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
            usr_id.clone().unwrap(),
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
      } else if input.create_usr_id.clone().unwrap().as_str() == "-" {
        sql_values += ",default";
        sql_values += ",default";
      } else {
        let mut usr_id = input.create_usr_id.clone();
        let mut usr_lbl = String::new();
        let usr_model = find_by_id_usr(
          usr_id.clone().unwrap(),
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
    // 企微应用
    if let Some(wxw_app_id) = input.wxw_app_id {
      sql_values += ",?";
      args.push(wxw_app_id.into());
    } else {
      sql_values += ",default";
    }
    // 类型corp和contact
    if let Some(r#type) = input.r#type {
      sql_values += ",?";
      args.push(r#type.into());
    } else {
      sql_values += ",default";
    }
    // 令牌
    if let Some(access_token) = input.access_token {
      sql_values += ",?";
      args.push(access_token.into());
    } else {
      sql_values += ",default";
    }
    // 令牌创建时间
    if let Some(token_time) = input.token_time {
      sql_values += ",?";
      args.push(token_time.into());
    } else if input.token_time_save_null == Some(true) {
      sql_values += ",null";
    } else {
      sql_values += ",default";
    }
    // 令牌超时时间
    if let Some(expires_in) = input.expires_in {
      sql_values += ",?";
      args.push(expires_in.into());
    } else {
      sql_values += ",default";
    }
    // 企业jsapi_ticket
    if let Some(jsapi_ticket) = input.jsapi_ticket {
      sql_values += ",?";
      args.push(jsapi_ticket.into());
    } else {
      sql_values += ",default";
    }
    // 企业jsapi_ticket创建时间
    if let Some(jsapi_ticket_time) = input.jsapi_ticket_time {
      sql_values += ",?";
      args.push(jsapi_ticket_time.into());
    } else if input.jsapi_ticket_time_save_null == Some(true) {
      sql_values += ",null";
    } else {
      sql_values += ",default";
    }
    // 企业jsapi_ticket超时时间
    if let Some(jsapi_ticket_expires_in) = input.jsapi_ticket_expires_in {
      sql_values += ",?";
      args.push(jsapi_ticket_expires_in.into());
    } else {
      sql_values += ",default";
    }
    // 应用jsapi_ticket
    if let Some(jsapi_ticket_agent_config) = input.jsapi_ticket_agent_config {
      sql_values += ",?";
      args.push(jsapi_ticket_agent_config.into());
    } else {
      sql_values += ",default";
    }
    // 应用jsapi_ticket创建时间
    if let Some(jsapi_ticket_agent_config_time) = input.jsapi_ticket_agent_config_time {
      sql_values += ",?";
      args.push(jsapi_ticket_agent_config_time.into());
    } else if input.jsapi_ticket_agent_config_time_save_null == Some(true) {
      sql_values += ",null";
    } else {
      sql_values += ",default";
    }
    // 应用jsapi_ticket超时时间
    if let Some(jsapi_ticket_agent_config_expires_in) = input.jsapi_ticket_agent_config_expires_in {
      sql_values += ",?";
      args.push(jsapi_ticket_agent_config_expires_in.into());
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
    return Err(anyhow!("affectedRows: {affected_rows} != {inputs2_len}"));
  }
  
  Ok(ids2)
}

// MARK: create_return
/// 创建企微应用接口凭据并返回
#[allow(dead_code)]
pub async fn create_return(
  #[allow(unused_mut)]
  mut input: WxwAppTokenInput,
  options: Option<Options>,
) -> Result<WxwAppTokenModel> {
  
  let table = "wxwork_wxw_app_token";
  
  let id = create(input.clone(), options.clone()).await?;
  
  let model = find_by_id(
    id,
    options,
  ).await?;
  
  if model.is_none() {
    return Err(anyhow!("create_return: Create failed in dao: {table}"));
  }
  let model = model.unwrap();
  
  Ok(model)
}

// MARK: create
/// 创建企微应用接口凭据
#[allow(dead_code)]
pub async fn create(
  #[allow(unused_mut)]
  mut input: WxwAppTokenInput,
  options: Option<Options>,
) -> Result<WxwAppTokenId> {
  
  let table = "wxwork_wxw_app_token";
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
    return Err(anyhow!("_creates: Create failed in dao: {table}"));
  }
  let id = ids[0].clone();
  
  Ok(id)
}

// MARK: update_tenant_by_id
/// 企微应用接口凭据根据id修改租户id
pub async fn update_tenant_by_id(
  id: WxwAppTokenId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  let table = "wxwork_wxw_app_token";
  let method = "update_tenant_by_id";
  
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

// MARK: update_by_id
/// 根据 id 修改企微应用接口凭据
#[allow(unused_mut)]
#[allow(unused_variables)]
pub async fn update_by_id(
  id: WxwAppTokenId,
  mut input: WxwAppTokenInput,
  options: Option<Options>,
) -> Result<WxwAppTokenId> {
  
  let table = "wxwork_wxw_app_token";
  let method = "update_by_id";
  
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
  
  let old_model = find_by_id(
    id.clone(),
    options.clone(),
  ).await?;
  
  if old_model.is_none() {
    let table_comment = i18n_dao::ns(
      "企微应用接口凭据".to_owned(),
      None,
    ).await?;
    let map = HashMap::from([
      ("0".to_owned(), table_comment),
    ]);
    let err_msg = i18n_dao::ns(
      "编辑失败, 此 {0} 已被删除".to_owned(),
      map.into(),
    ).await?;
    return Err(anyhow!(err_msg));
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
      .collect::<Vec<WxwAppTokenModel>>();
    
    if !models.is_empty() {
      let unique_type = options
        .as_ref()
        .and_then(|item| item.get_unique_type())
        .unwrap_or(UniqueType::Throw);
      if unique_type == UniqueType::Throw {
        let table_comment = i18n_dao::ns(
          "企微应用接口凭据".to_owned(),
          None,
        ).await?;
        let map = HashMap::from([
          ("0".to_owned(), table_comment),
        ]);
        let err_msg = i18n_dao::ns(
          "此 {0} 已经存在".to_owned(),
          map.into(),
        ).await?;
        return Err(anyhow!(err_msg));
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
  // 企微应用
  if let Some(wxw_app_id) = input.wxw_app_id {
    field_num += 1;
    sql_fields += "wxw_app_id=?,";
    args.push(wxw_app_id.into());
  }
  // 类型corp和contact
  if let Some(r#type) = input.r#type {
    field_num += 1;
    sql_fields += "type=?,";
    args.push(r#type.into());
  }
  // 令牌
  if let Some(access_token) = input.access_token {
    field_num += 1;
    sql_fields += "access_token=?,";
    args.push(access_token.into());
  }
  // 令牌创建时间
  if let Some(token_time) = input.token_time {
    field_num += 1;
    sql_fields += "token_time=?,";
    args.push(token_time.into());
  } else if input.token_time_save_null == Some(true) {
    field_num += 1;
    sql_fields += "token_time=null,";
  }
  // 令牌超时时间
  if let Some(expires_in) = input.expires_in {
    field_num += 1;
    sql_fields += "expires_in=?,";
    args.push(expires_in.into());
  }
  // 企业jsapi_ticket
  if let Some(jsapi_ticket) = input.jsapi_ticket {
    field_num += 1;
    sql_fields += "jsapi_ticket=?,";
    args.push(jsapi_ticket.into());
  }
  // 企业jsapi_ticket创建时间
  if let Some(jsapi_ticket_time) = input.jsapi_ticket_time {
    field_num += 1;
    sql_fields += "jsapi_ticket_time=?,";
    args.push(jsapi_ticket_time.into());
  } else if input.jsapi_ticket_time_save_null == Some(true) {
    field_num += 1;
    sql_fields += "jsapi_ticket_time=null,";
  }
  // 企业jsapi_ticket超时时间
  if let Some(jsapi_ticket_expires_in) = input.jsapi_ticket_expires_in {
    field_num += 1;
    sql_fields += "jsapi_ticket_expires_in=?,";
    args.push(jsapi_ticket_expires_in.into());
  }
  // 应用jsapi_ticket
  if let Some(jsapi_ticket_agent_config) = input.jsapi_ticket_agent_config {
    field_num += 1;
    sql_fields += "jsapi_ticket_agent_config=?,";
    args.push(jsapi_ticket_agent_config.into());
  }
  // 应用jsapi_ticket创建时间
  if let Some(jsapi_ticket_agent_config_time) = input.jsapi_ticket_agent_config_time {
    field_num += 1;
    sql_fields += "jsapi_ticket_agent_config_time=?,";
    args.push(jsapi_ticket_agent_config_time.into());
  } else if input.jsapi_ticket_agent_config_time_save_null == Some(true) {
    field_num += 1;
    sql_fields += "jsapi_ticket_agent_config_time=null,";
  }
  // 应用jsapi_ticket超时时间
  if let Some(jsapi_ticket_agent_config_expires_in) = input.jsapi_ticket_agent_config_expires_in {
    field_num += 1;
    sql_fields += "jsapi_ticket_agent_config_expires_in=?,";
    args.push(jsapi_ticket_agent_config_expires_in.into());
  }
  
  if field_num > 0 {
    if !is_silent_mode && !is_creating {
      if input.update_usr_id.is_none() {
        let mut usr_id = get_auth_id();
        let mut usr_id_lbl = String::new();
        if usr_id.is_some() {
          let usr_model = find_by_id_usr(
            usr_id.clone().unwrap(),
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
      } else if input.update_usr_id.clone().unwrap().as_str() != "-" {
        let mut usr_id = input.update_usr_id.clone();
        let mut usr_id_lbl = String::new();
        if usr_id.is_some() {
          let usr_model = find_by_id_usr(
            usr_id.clone().unwrap(),
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
      if input.update_usr_id.is_some() && input.update_usr_id.clone().unwrap().as_str() != "-" {
        let usr_id = input.update_usr_id.clone();
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
  let table = "wxwork_wxw_app_token";
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
/// 根据 ids 删除企微应用接口凭据
#[allow(unused_variables)]
pub async fn delete_by_ids(
  ids: Vec<WxwAppTokenId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "wxwork_wxw_app_token";
  let method = "delete_by_ids";
  
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
    return Err(anyhow!("ids.len(): {} > MAX_SAFE_INTEGER", ids.len()));
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
    
    let mut sql_fields = String::with_capacity(30);
    sql_fields.push_str("is_deleted=1,");
    let mut usr_id = get_auth_id();
    let mut usr_lbl = String::new();
    if usr_id.is_some() {
      let usr_model = find_by_id_usr(
        usr_id.clone().unwrap(),
        options.clone(),
      ).await?;
      if let Some(usr_model) = usr_model {
        usr_lbl = usr_model.lbl;
      } else {
        usr_id = None;
      }
    }
    
    if !is_silent_mode && !is_creating {
      if let Some(usr_id) = usr_id {
        sql_fields.push_str("delete_usr_id=?,");
        args.push(usr_id.into());
      }
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
  }
  
  if num > MAX_SAFE_INTEGER {
    return Err(anyhow!("num: {} > MAX_SAFE_INTEGER", num));
  }
  
  Ok(num)
}

// MARK: revert_by_ids
/// 根据 ids 还原企微应用接口凭据
pub async fn revert_by_ids(
  ids: Vec<WxwAppTokenId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "wxwork_wxw_app_token";
  let method = "revert_by_ids";
  
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
  for id in ids.clone() {
    let mut args = QueryArgs::new();
    
    let sql = format!("update {table} set is_deleted=0 where id=? limit 1");
    
    args.push(id.clone().into());
    
    let args: Vec<_> = args.into();
    
    let mut old_model = find_one(
      WxwAppTokenSearch {
        id: Some(id.clone()),
        is_deleted: Some(1),
        ..Default::default()
      }.into(),
      None,
      options.clone(),
    ).await?;
    
    if old_model.is_none() {
      old_model = find_by_id(
        id.clone(),
        options.clone(),
      ).await?;
    }
    
    if old_model.is_none() {
      continue;
    }
    let old_model = old_model.unwrap();
    
    {
      let mut input: WxwAppTokenInput = old_model.clone().into();
      input.id = None;
      
      let models = find_by_unique(
        input.into(),
        None,
        options.clone(),
      ).await?;
      
      let models: Vec<WxwAppTokenModel> = models
        .into_iter()
        .filter(|item| 
          item.id != id
        )
        .collect();
      
      if !models.is_empty() {
        let table_comment = i18n_dao::ns(
          "企微应用接口凭据".to_owned(),
          None,
        ).await?;
        let map = HashMap::from([
          ("0".to_owned(), table_comment),
        ]);
        let err_msg = i18n_dao::ns(
          "此 {0} 已经存在".to_owned(),
          map.into(),
        ).await?;
        return Err(anyhow!(err_msg));
      }
    }
    
    num += execute(
      sql,
      args,
      options.clone(),
    ).await?;
    
  }
  
  Ok(num)
}

// MARK: force_delete_by_ids
/// 根据 ids 彻底删除企微应用接口凭据
#[allow(unused_variables)]
pub async fn force_delete_by_ids(
  ids: Vec<WxwAppTokenId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "wxwork_wxw_app_token";
  let method = "force_delete_by_ids";
  
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
    
    let old_model = find_all(
      WxwAppTokenSearch {
        id: id.clone().into(),
        is_deleted: 1.into(),
        ..Default::default()
      }.into(),
      None,
      None, 
      options.clone(),
    ).await?.into_iter().next();
    
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
    
    let sql = format!("delete from {table} where id=? and is_deleted=1 limit 1");
    
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
  }
  
  Ok(num)
}

// MARK: validate_option
/// 校验企微应用接口凭据是否存在
#[allow(dead_code)]
pub async fn validate_option<T>(
  model: Option<T>,
) -> Result<T> {
  if model.is_none() {
    let table_comment = i18n_dao::ns(
      "企微应用接口凭据".to_owned(),
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
    return Err(anyhow!(err_msg));
  }
  Ok(model.unwrap())
}
