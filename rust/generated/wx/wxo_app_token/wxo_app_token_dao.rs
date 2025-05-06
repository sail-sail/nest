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

use super::wxo_app_token_model::*;
use crate::wx::wxo_app::wxo_app_model::WxoAppId;
use crate::base::usr::usr_model::UsrId;

use crate::base::usr::usr_dao::find_by_id_usr;

#[allow(unused_variables)]
async fn get_where_query(
  args: &mut QueryArgs,
  search: Option<&WxoAppTokenSearch>,
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
    let ids: Option<Vec<WxoAppTokenId>> = match search {
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
  // 小程序设置
  {
    let wxo_app_id: Option<Vec<WxoAppId>> = match search {
      Some(item) => item.wxo_app_id.clone(),
      None => None,
    };
    if let Some(wxo_app_id) = wxo_app_id {
      let arg = {
        if wxo_app_id.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(wxo_app_id.len());
          for item in wxo_app_id {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.wxo_app_id in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let wxo_app_id_is_null: bool = match search {
      Some(item) => item.wxo_app_id_is_null.unwrap_or(false),
      None => false,
    };
    if wxo_app_id_is_null {
      where_query.push_str(" and t.wxo_app_id is null");
    }
  }
  {
    let wxo_app_id_lbl: Option<Vec<String>> = match search {
      Some(item) => item.wxo_app_id_lbl.clone(),
      None => None,
    };
    if let Some(wxo_app_id_lbl) = wxo_app_id_lbl {
      let arg = {
        if wxo_app_id_lbl.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(wxo_app_id_lbl.len());
          for item in wxo_app_id_lbl {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and wxo_app_id_lbl.lbl in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let wxo_app_id_lbl_like = match search {
      Some(item) => item.wxo_app_id_lbl_like.clone(),
      None => None,
    };
    if let Some(wxo_app_id_lbl_like) = wxo_app_id_lbl_like {
      where_query.push_str(" and wxo_app_id_lbl.lbl like ?");
      args.push(format!("%{}%", sql_like(&wxo_app_id_lbl_like)).into());
    }
  }
  // 开发者ID
  {
    let appid = match search {
      Some(item) => item.appid.clone(),
      None => None,
    };
    if let Some(appid) = appid {
      where_query.push_str(" and t.appid=?");
      args.push(appid.into());
    }
    let appid_like = match search {
      Some(item) => item.appid_like.clone(),
      None => None,
    };
    if let Some(appid_like) = appid_like {
      where_query.push_str(" and t.appid like ?");
      args.push(format!("%{}%", sql_like(&appid_like)).into());
    }
  }
  // 开发者密码
  {
    let appsecret = match search {
      Some(item) => item.appsecret.clone(),
      None => None,
    };
    if let Some(appsecret) = appsecret {
      where_query.push_str(" and t.appsecret=?");
      args.push(appsecret.into());
    }
    let appsecret_like = match search {
      Some(item) => item.appsecret_like.clone(),
      None => None,
    };
    if let Some(appsecret_like) = appsecret_like {
      where_query.push_str(" and t.appsecret like ?");
      args.push(format!("%{}%", sql_like(&appsecret_like)).into());
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
  search: Option<&WxoAppTokenSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let from_query = r#"wx_wxo_app_token t
  left join wx_wxo_app wxo_app_id_lbl on wxo_app_id_lbl.id=t.wxo_app_id"#.to_owned();
  Ok(from_query)
}

// MARK: find_all_wxo_app_token
/// 根据搜索条件和分页查找小程序接口凭据列表
#[allow(unused_mut)]
pub async fn find_all_wxo_app_token(
  search: Option<WxoAppTokenSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxoAppTokenModel>> {
  
  let table = "wx_wxo_app_token";
  let method = "find_all_wxo_app_token";
  
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
  // 小程序设置
  if let Some(search) = &search {
    if search.wxo_app_id.is_some() {
      let len = search.wxo_app_id.as_ref().unwrap().len();
      if len == 0 {
        return Ok(vec![]);
      }
      let ids_limit = options
        .as_ref()
        .and_then(|x| x.get_ids_limit())
        .unwrap_or(FIND_ALL_IDS_LIMIT);
      if len > ids_limit {
        return Err(eyre!("search.wxo_app_id.length > {ids_limit}"));
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
        return Err(eyre!("search.create_usr_id.length > {ids_limit}"));
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
        return Err(eyre!("search.update_usr_id.length > {ids_limit}"));
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
  ,wxo_app_id_lbl.lbl wxo_app_id_lbl
  from {from_query} where {where_query} group by t.id{order_by_query}) f {page_query}"#);
  
  let args = args.into();
  
  let options = Options::from(options);
  
  let options = options.set_cache_key(table, &sql, &args);
  
  let mut res: Vec<WxoAppTokenModel> = query(
    sql,
    args,
    Some(options),
  ).await?;
  
  #[allow(unused_variables)]
  for model in &mut res {
    
  }
  
  Ok(res)
}

// MARK: find_count_wxo_app_token
/// 根据条件查找小程序接口凭据总数
pub async fn find_count_wxo_app_token(
  search: Option<WxoAppTokenSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "wx_wxo_app_token";
  let method = "find_count_wxo_app_token";
  
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
  // 小程序设置
  if let Some(search) = &search {
    if search.wxo_app_id.is_some() {
      let len = search.wxo_app_id.as_ref().unwrap().len();
      if len == 0 {
        return Ok(0);
      }
      let ids_limit = options
        .as_ref()
        .and_then(|x| x.get_ids_limit())
        .unwrap_or(FIND_ALL_IDS_LIMIT);
      if len > ids_limit {
        return Err(eyre!("search.wxo_app_id.length > {ids_limit}"));
      }
    }
  }
  // 创建人
  if let Some(search) = &search {
    if search.create_usr_id.is_some() {
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
  }
  // 更新人
  if let Some(search) = &search {
    if search.update_usr_id.is_some() {
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

// MARK: get_field_comments_wxo_app_token
/// 获取小程序接口凭据字段注释
pub async fn get_field_comments_wxo_app_token(
  _options: Option<Options>,
) -> Result<WxoAppTokenFieldComment> {
  
  let field_comments = WxoAppTokenFieldComment {
    id: "ID".into(),
    wxo_app_id: "小程序设置".into(),
    wxo_app_id_lbl: "小程序设置".into(),
    appid: "开发者ID".into(),
    appsecret: "开发者密码".into(),
    access_token: "令牌".into(),
    token_time: "令牌创建时间".into(),
    token_time_lbl: "令牌创建时间".into(),
    expires_in: "令牌超时时间".into(),
  };
  Ok(field_comments)
}

// MARK: find_one_ok_wxo_app_token
/// 根据条件查找第一个小程序接口凭据
#[allow(dead_code)]
pub async fn find_one_ok_wxo_app_token(
  search: Option<WxoAppTokenSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<WxoAppTokenModel> {
  
  let table = "wx_wxo_app_token";
  let method = "find_one_ok_wxo_app_token";
  
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
  
  let wxo_app_token_model = validate_option_wxo_app_token(
    find_one_wxo_app_token(
      search,
      sort,
      options,
    ).await?,
  ).await?;
  
  Ok(wxo_app_token_model)
}

// MARK: find_one_wxo_app_token
/// 根据条件查找第一个小程序接口凭据
#[allow(dead_code)]
pub async fn find_one_wxo_app_token(
  search: Option<WxoAppTokenSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<WxoAppTokenModel>> {
  
  let table = "wx_wxo_app_token";
  let method = "find_one_wxo_app_token";
  
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
  
  let res = find_all_wxo_app_token(
    search,
    page,
    sort,
    options,
  ).await?;
  
  let model: Option<WxoAppTokenModel> = res.into_iter().next();
  
  Ok(model)
}

// MARK: find_by_id_ok_wxo_app_token
/// 根据 id 查找小程序接口凭据
#[allow(dead_code)]
pub async fn find_by_id_ok_wxo_app_token(
  id: WxoAppTokenId,
  options: Option<Options>,
) -> Result<WxoAppTokenModel> {
  
  let table = "wx_wxo_app_token";
  let method = "find_by_id_ok_wxo_app_token";
  
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
  
  let wxo_app_token_model = validate_option_wxo_app_token(
    find_by_id_wxo_app_token(
      id,
      options,
    ).await?,
  ).await?;
  
  Ok(wxo_app_token_model)
}

// MARK: find_by_id_wxo_app_token
/// 根据 id 查找小程序接口凭据
pub async fn find_by_id_wxo_app_token(
  id: WxoAppTokenId,
  options: Option<Options>,
) -> Result<Option<WxoAppTokenModel>> {
  
  let table = "wx_wxo_app_token";
  let method = "find_by_id_wxo_app_token";
  
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
  
  let search = WxoAppTokenSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let wxo_app_token_model = find_one_wxo_app_token(
    search,
    None,
    options,
  ).await?;
  
  Ok(wxo_app_token_model)
}

// MARK: find_by_ids_wxo_app_token
/// 根据 ids 查找小程序接口凭据
#[allow(dead_code)]
pub async fn find_by_ids_wxo_app_token(
  ids: Vec<WxoAppTokenId>,
  options: Option<Options>,
) -> Result<Vec<WxoAppTokenModel>> {
  
  let table = "wx_wxo_app_token";
  let method = "find_by_ids_wxo_app_token";
  
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
    return Err(eyre!("find_by_ids: ids.length > FIND_ALL_IDS_LIMIT"));
  }
  
  let search = WxoAppTokenSearch {
    ids: Some(ids.clone()),
    ..Default::default()
  }.into();
  
  let models = find_all_wxo_app_token(
    search,
    None,
    None,
    options,
  ).await?;
  
  if models.len() != len {
    let err_msg = "此 小程序接口凭据 已被删除";
    return Err(eyre!(err_msg));
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
      let err_msg = "此 小程序接口凭据 已经被删除";
      Err(eyre!(err_msg))
    })
    .collect::<Result<Vec<WxoAppTokenModel>>>()?;
  
  Ok(models)
}

// MARK: exists_wxo_app_token
/// 根据搜索条件判断小程序接口凭据是否存在
#[allow(dead_code)]
pub async fn exists_wxo_app_token(
  search: Option<WxoAppTokenSearch>,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = "wx_wxo_app_token";
  let method = "exists_wxo_app_token";
  
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
  // 小程序设置
  if let Some(search) = &search {
    if search.wxo_app_id.is_some() {
      let len = search.wxo_app_id.as_ref().unwrap().len();
      if len == 0 {
        return Ok(false);
      }
      let ids_limit = options
        .as_ref()
        .and_then(|x| x.get_ids_limit())
        .unwrap_or(FIND_ALL_IDS_LIMIT);
      if len > ids_limit {
        return Err(eyre!("search.wxo_app_id.length > {ids_limit}"));
      }
    }
  }
  // 创建人
  if let Some(search) = &search {
    if search.create_usr_id.is_some() {
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
  }
  // 更新人
  if let Some(search) = &search {
    if search.update_usr_id.is_some() {
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

// MARK: exists_by_id_wxo_app_token
/// 根据 id 判断小程序接口凭据是否存在
#[allow(dead_code)]
pub async fn exists_by_id_wxo_app_token(
  id: WxoAppTokenId,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = "wx_wxo_app_token";
  let method = "exists_by_id_wxo_app_token";
  
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
  
  let search = WxoAppTokenSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let exists = exists_wxo_app_token(
    search,
    options,
  ).await?;
  
  Ok(exists)
}

// MARK: find_by_unique_wxo_app_token
/// 通过唯一约束获得数据列表
#[allow(unused_variables)]
pub async fn find_by_unique_wxo_app_token(
  search: WxoAppTokenSearch,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxoAppTokenModel>> {
  
  let table = "wx_wxo_app_token";
  let method = "find_by_unique_wxo_app_token";
  
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
    let model = find_by_id_wxo_app_token(
      id,
      options.clone(),
    ).await?;
    return Ok(model.map_or_else(Vec::new, |m| vec![m]));
  }
  
  let mut models: Vec<WxoAppTokenModel> = vec![];
  
  let mut models_tmp = {
    if
      search.wxo_app_id.is_none()
    {
      return Ok(vec![]);
    }
    
    let search = WxoAppTokenSearch {
      wxo_app_id: search.wxo_app_id.clone(),
      ..Default::default()
    };
    
    find_all_wxo_app_token(
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
  input: &WxoAppTokenInput,
  model: &WxoAppTokenModel,
) -> bool {
  if input.id.as_ref().is_some() {
    return input.id.as_ref().unwrap() == &model.id;
  }
  
  if
    input.wxo_app_id.as_ref().is_some() && input.wxo_app_id.as_ref().unwrap() == &model.wxo_app_id
  {
    return true;
  }
  false
}

// MARK: check_by_unique_wxo_app_token
/// 通过唯一约束检查数据是否已经存在
#[allow(unused_variables)]
pub async fn check_by_unique_wxo_app_token(
  input: WxoAppTokenInput,
  model: WxoAppTokenModel,
  options: Option<Options>,
) -> Result<Option<WxoAppTokenId>> {
  
  let table = "wx_wxo_app_token";
  let method = "check_by_unique_wxo_app_token";
  
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
    let id = update_by_id_wxo_app_token(
      model.id.clone(),
      input,
      options,
    ).await?;
    return Ok(id.into());
  }
  if unique_type == UniqueType::Throw {
    let err_msg = "此 小程序接口凭据 已经存在";
    return Err(eyre!(err_msg));
  }
  Ok(None)
}

// MARK: set_id_by_lbl_wxo_app_token
/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(unused_variables, dead_code)]
pub async fn set_id_by_lbl_wxo_app_token(
  input: WxoAppTokenInput,
) -> Result<WxoAppTokenInput> {
  
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
        let field_comments = get_field_comments_wxo_app_token(
          None,
        ).await?;
        let column_comment = field_comments.token_time;
        
        let err_msg = "日期格式错误";
        return Err(eyre!("{column_comment} {err_msg}"));
      }
    }
  }
  
  // 小程序设置
  if input.wxo_app_id_lbl.is_some()
    && !input.wxo_app_id_lbl.as_ref().unwrap().is_empty()
    && input.wxo_app_id.is_none()
  {
    input.wxo_app_id_lbl = input.wxo_app_id_lbl.map(|item| 
      item.trim().to_owned()
    );
    let model = crate::wx::wxo_app::wxo_app_dao::find_one_wxo_app(
      crate::wx::wxo_app::wxo_app_model::WxoAppSearch {
        lbl: input.wxo_app_id_lbl.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(model) = model {
      input.wxo_app_id = model.id.into();
    }
  } else if
    (input.wxo_app_id_lbl.is_none() || input.wxo_app_id_lbl.as_ref().unwrap().is_empty())
    && input.wxo_app_id.is_some()
  {
    let wxo_app_model = crate::wx::wxo_app::wxo_app_dao::find_one_wxo_app(
      crate::wx::wxo_app::wxo_app_model::WxoAppSearch {
        id: input.wxo_app_id.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(wxo_app_model) = wxo_app_model {
      input.wxo_app_id_lbl = wxo_app_model.lbl.into();
    }
  }
  
  Ok(input)
}

// MARK: creates_return_wxo_app_token
/// 批量创建小程序接口凭据并返回
#[allow(dead_code)]
pub async fn creates_return_wxo_app_token(
  inputs: Vec<WxoAppTokenInput>,
  options: Option<Options>,
) -> Result<Vec<WxoAppTokenModel>> {
  
  let table = "wx_wxo_app_token";
  let method = "creates_return_wxo_app_token";
  
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
  
  let models_wxo_app_token = find_by_ids_wxo_app_token(
    ids,
    options,
  ).await?;
  
  Ok(models_wxo_app_token)
}

// MARK: creates_wxo_app_token
/// 批量创建小程序接口凭据
pub async fn creates_wxo_app_token(
  inputs: Vec<WxoAppTokenInput>,
  options: Option<Options>,
) -> Result<Vec<WxoAppTokenId>> {
  
  let table = "wx_wxo_app_token";
  let method = "creates_wxo_app_token";
  
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

/// 批量创建小程序接口凭据
#[allow(unused_variables, clippy::redundant_locals)]
async fn _creates(
  inputs: Vec<WxoAppTokenInput>,
  options: Option<Options>,
) -> Result<Vec<WxoAppTokenId>> {
  
  let table = "wx_wxo_app_token";
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  
  let unique_type = options.as_ref()
    .and_then(|item|
      item.get_unique_type()
    )
    .unwrap_or_default();
  
  let mut ids2: Vec<WxoAppTokenId> = vec![];
  let mut inputs2: Vec<WxoAppTokenInput> = vec![];
  
  for input in inputs {
  
    if input.id.is_some() {
      return Err(eyre!("Can not set id when create in dao: {table}"));
    }
    
    let old_models = find_by_unique_wxo_app_token(
      input.clone().into(),
      None,
      options.clone(),
    ).await?;
    
    if !old_models.is_empty() {
      let mut id: Option<WxoAppTokenId> = None;
      
      for old_model in old_models {
        let options = Options::from(options.clone())
          .set_unique_type(unique_type);
        
        id = check_by_unique_wxo_app_token(
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
  // 小程序设置
  sql_fields += ",wxo_app_id";
  // 开发者ID
  sql_fields += ",appid";
  // 开发者密码
  sql_fields += ",appsecret";
  // 令牌
  sql_fields += ",access_token";
  // 令牌创建时间
  sql_fields += ",token_time";
  // 令牌超时时间
  sql_fields += ",expires_in";
  
  let inputs2_len = inputs2.len();
  let mut sql_values = String::with_capacity((2 * 12 + 3) * inputs2_len);
  let mut inputs2_ids = vec![];
  
  for (i, input) in inputs2
    .clone()
    .into_iter()
    .enumerate()
  {
    
    let id: WxoAppTokenId = get_short_uuid().into();
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
    // 小程序设置
    if let Some(wxo_app_id) = input.wxo_app_id {
      sql_values += ",?";
      args.push(wxo_app_id.into());
    } else {
      sql_values += ",default";
    }
    // 开发者ID
    if let Some(appid) = input.appid {
      sql_values += ",?";
      args.push(appid.into());
    } else {
      sql_values += ",default";
    }
    // 开发者密码
    if let Some(appsecret) = input.appsecret {
      sql_values += ",?";
      args.push(appsecret.into());
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
  
  Ok(ids2)
}

// MARK: create_return_wxo_app_token
/// 创建小程序接口凭据并返回
#[allow(dead_code)]
pub async fn create_return_wxo_app_token(
  #[allow(unused_mut)]
  mut input: WxoAppTokenInput,
  options: Option<Options>,
) -> Result<WxoAppTokenModel> {
  
  let id = create_wxo_app_token(
    input.clone(),
    options.clone(),
  ).await?;
  
  let model_wxo_app_token = find_by_id_wxo_app_token(
    id,
    options,
  ).await?;
  
  if model_wxo_app_token.is_none() {
    let err_msg = "create_return_wxo_app_token: model_wxo_app_token.is_none()";
    return Err(eyre!(
      ServiceException {
        code: String::new(),
        message: err_msg.to_owned(),
        trace: true,
        ..Default::default()
      },
    ));
  }
  let model_wxo_app_token = model_wxo_app_token.unwrap();
  
  Ok(model_wxo_app_token)
}

// MARK: create_wxo_app_token
/// 创建小程序接口凭据
#[allow(dead_code)]
pub async fn create_wxo_app_token(
  #[allow(unused_mut)]
  mut input: WxoAppTokenInput,
  options: Option<Options>,
) -> Result<WxoAppTokenId> {
  
  let table = "wx_wxo_app_token";
  let method = "create_wxo_app_token";
  
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

// MARK: update_by_id_wxo_app_token
/// 根据 id 修改小程序接口凭据
#[allow(unused_mut)]
#[allow(unused_variables)]
pub async fn update_by_id_wxo_app_token(
  id: WxoAppTokenId,
  mut input: WxoAppTokenInput,
  options: Option<Options>,
) -> Result<WxoAppTokenId> {
  
  let table = "wx_wxo_app_token";
  let method = "update_by_id_wxo_app_token";
  
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
  
  let old_model = find_by_id_wxo_app_token(
    id.clone(),
    options.clone(),
  ).await?;
  
  if old_model.is_none() {
    let err_msg = "编辑失败, 此 小程序接口凭据 已被删除";
    return Err(eyre!(err_msg));
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
    
    let models = find_by_unique_wxo_app_token(
      input.into(),
      None,
      options.clone(),
    ).await?;
    
    let models = models.into_iter()
      .filter(|item| 
        item.id != id
      )
      .collect::<Vec<WxoAppTokenModel>>();
    
    if !models.is_empty() {
      let unique_type = options
        .as_ref()
        .and_then(|item| item.get_unique_type())
        .unwrap_or(UniqueType::Throw);
      if unique_type == UniqueType::Throw {
        let err_msg = "此 小程序接口凭据 已经存在";
        return Err(eyre!(err_msg));
      } else if unique_type == UniqueType::Ignore {
        return Ok(id);
      }
    }
  }
  
  let mut args = QueryArgs::new();
  
  let mut sql_fields = String::with_capacity(80 * 12 + 20);
  
  let mut field_num: usize = 0;
  // 小程序设置
  if let Some(wxo_app_id) = input.wxo_app_id {
    field_num += 1;
    sql_fields += "wxo_app_id=?,";
    args.push(wxo_app_id.into());
  }
  // 开发者ID
  if let Some(appid) = input.appid {
    field_num += 1;
    sql_fields += "appid=?,";
    args.push(appid.into());
  }
  // 开发者密码
  if let Some(appsecret) = input.appsecret {
    field_num += 1;
    sql_fields += "appsecret=?,";
    args.push(appsecret.into());
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
  let table = "wx_wxo_app_token";
  vec![
    table,
  ]
}

// MARK: del_cache_wxo_app_token
/// 清空缓存
#[allow(dead_code)]
pub async fn del_cache_wxo_app_token() -> Result<()> {
  let cache_key1s = get_cache_tables();
  del_caches(
    cache_key1s.as_slice(),
  ).await?;
  Ok(())
}

// MARK: delete_by_ids_wxo_app_token
/// 根据 ids 删除小程序接口凭据
#[allow(unused_variables)]
pub async fn delete_by_ids_wxo_app_token(
  ids: Vec<WxoAppTokenId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "wx_wxo_app_token";
  let method = "delete_by_ids_wxo_app_token";
  
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
  for id in ids.clone() {
    
    let old_model = find_by_id_wxo_app_token(
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
    return Err(eyre!("num: {} > MAX_SAFE_INTEGER", num));
  }
  
  Ok(num)
}

// MARK: revert_by_ids_wxo_app_token
/// 根据 ids 还原小程序接口凭据
pub async fn revert_by_ids_wxo_app_token(
  ids: Vec<WxoAppTokenId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "wx_wxo_app_token";
  let method = "revert_by_ids_wxo_app_token";
  
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
    
    let mut old_model = find_one_wxo_app_token(
      WxoAppTokenSearch {
        id: Some(id.clone()),
        is_deleted: Some(1),
        ..Default::default()
      }.into(),
      None,
      options.clone(),
    ).await?;
    
    if old_model.is_none() {
      old_model = find_by_id_wxo_app_token(
        id.clone(),
        options.clone(),
      ).await?;
    }
    
    if old_model.is_none() {
      continue;
    }
    let old_model = old_model.unwrap();
    
    {
      let mut input: WxoAppTokenInput = old_model.clone().into();
      input.id = None;
      
      let models = find_by_unique_wxo_app_token(
        input.into(),
        None,
        options.clone(),
      ).await?;
      
      let models: Vec<WxoAppTokenModel> = models
        .into_iter()
        .filter(|item| 
          item.id != id
        )
        .collect();
      
      if !models.is_empty() {
        let err_msg = "此 小程序接口凭据 已经存在";
        return Err(eyre!(err_msg));
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

// MARK: force_delete_by_ids_wxo_app_token
/// 根据 ids 彻底删除小程序接口凭据
#[allow(unused_variables)]
pub async fn force_delete_by_ids_wxo_app_token(
  ids: Vec<WxoAppTokenId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "wx_wxo_app_token";
  let method = "force_delete_by_ids_wxo_app_token";
  
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
    
    let old_model = find_all_wxo_app_token(
      WxoAppTokenSearch {
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

// MARK: validate_option_wxo_app_token
/// 校验小程序接口凭据是否存在
#[allow(dead_code)]
pub async fn validate_option_wxo_app_token(
  model: Option<WxoAppTokenModel>,
) -> Result<WxoAppTokenModel> {
  if model.is_none() {
    let err_msg = "小程序接口凭据不存在";
    error!(
      "{req_id} {err_msg}",
      req_id = get_req_id(),
    );
    return Err(eyre!(
      ServiceException {
        code: String::new(),
        message: err_msg.to_owned(),
        rollback: true,
        trace: true,
      },
    ));
  }
  let model = model.unwrap();
  Ok(model)
}
