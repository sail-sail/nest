
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

use super::wxo_app_model::*;

use crate::base::tenant::tenant_model::TenantId;
use crate::base::domain::domain_model::DomainId;
use crate::base::usr::usr_model::UsrId;

use crate::base::usr::usr_dao::find_by_id_usr;

#[allow(unused_variables)]
async fn get_where_query(
  args: &mut QueryArgs,
  search: Option<&WxoAppSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let is_deleted = search
    .and_then(|item| item.is_deleted)
    .unwrap_or(0);
  
  let mut where_query = String::with_capacity(80 * 21 * 2);
  
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
    let ids: Option<Vec<WxoAppId>> = match search {
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
  // 原始ID
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
    if let Some(appid_like) = appid_like && !appid_like.is_empty() {
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
    if let Some(appsecret_like) = appsecret_like && !appsecret_like.is_empty() {
      where_query.push_str(" and t.appsecret like ?");
      args.push(format!("%{}%", sql_like(&appsecret_like)).into());
    }
  }
  // 令牌
  {
    let token = match search {
      Some(item) => item.token.clone(),
      None => None,
    };
    if let Some(token) = token {
      where_query.push_str(" and t.token=?");
      args.push(token.into());
    }
    let token_like = match search {
      Some(item) => item.token_like.clone(),
      None => None,
    };
    if let Some(token_like) = token_like && !token_like.is_empty() {
      where_query.push_str(" and t.token like ?");
      args.push(format!("%{}%", sql_like(&token_like)).into());
    }
  }
  // 消息加解密密钥
  {
    let encoding_aes_key = match search {
      Some(item) => item.encoding_aes_key.clone(),
      None => None,
    };
    if let Some(encoding_aes_key) = encoding_aes_key {
      where_query.push_str(" and t.encoding_aes_key=?");
      args.push(encoding_aes_key.into());
    }
    let encoding_aes_key_like = match search {
      Some(item) => item.encoding_aes_key_like.clone(),
      None => None,
    };
    if let Some(encoding_aes_key_like) = encoding_aes_key_like && !encoding_aes_key_like.is_empty() {
      where_query.push_str(" and t.encoding_aes_key like ?");
      args.push(format!("%{}%", sql_like(&encoding_aes_key_like)).into());
    }
  }
  // 消息加解密方式
  {
    let encoding_type: Option<Vec<WxoAppEncodingType>> = match search {
      Some(item) => item.encoding_type.clone(),
      None => None,
    };
    if let Some(encoding_type) = encoding_type {
      let arg = {
        if encoding_type.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(encoding_type.len());
          for item in encoding_type {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.encoding_type in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  // 授权作用域
  {
    let scope: Option<Vec<WxoAppScope>> = match search {
      Some(item) => item.scope.clone(),
      None => None,
    };
    if let Some(scope) = scope {
      let arg = {
        if scope.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(scope.len());
          for item in scope {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.scope in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  // 网页授权域名
  {
    let domain_id: Option<Vec<DomainId>> = match search {
      Some(item) => item.domain_id.clone(),
      None => None,
    };
    if let Some(domain_id) = domain_id {
      let arg = {
        if domain_id.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(domain_id.len());
          for item in domain_id {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.domain_id in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let domain_id_is_null: bool = match search {
      Some(item) => item.domain_id_is_null.unwrap_or(false),
      None => false,
    };
    if domain_id_is_null {
      where_query.push_str(" and t.domain_id is null");
    }
  }
  {
    let domain_id_lbl: Option<Vec<String>> = match search {
      Some(item) => item.domain_id_lbl.clone(),
      None => None,
    };
    if let Some(domain_id_lbl) = domain_id_lbl {
      let arg = {
        if domain_id_lbl.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(domain_id_lbl.len());
          for item in domain_id_lbl {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and domain_id_lbl.lbl in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let domain_id_lbl_like = match search {
      Some(item) => item.domain_id_lbl_like.clone(),
      None => None,
    };
    if let Some(domain_id_lbl_like) = domain_id_lbl_like {
      where_query.push_str(" and domain_id_lbl.lbl like ?");
      args.push(format!("%{}%", sql_like(&domain_id_lbl_like)).into());
    }
  }
  // 默认角色
  {
    let default_role_codes = match search {
      Some(item) => item.default_role_codes.clone(),
      None => None,
    };
    if let Some(default_role_codes) = default_role_codes {
      where_query.push_str(" and t.default_role_codes=?");
      args.push(default_role_codes.into());
    }
    let default_role_codes_like = match search {
      Some(item) => item.default_role_codes_like.clone(),
      None => None,
    };
    if let Some(default_role_codes_like) = default_role_codes_like && !default_role_codes_like.is_empty() {
      where_query.push_str(" and t.default_role_codes like ?");
      args.push(format!("%{}%", sql_like(&default_role_codes_like)).into());
    }
  }
  // 锁定
  {
    let is_locked: Option<Vec<u8>> = match search {
      Some(item) => item.is_locked.clone(),
      None => None,
    };
    if let Some(is_locked) = is_locked {
      let arg = {
        if is_locked.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(is_locked.len());
          for item in is_locked {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.is_locked in (");
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
  Ok(where_query)
}

#[allow(unused_variables)]
async fn get_from_query(
  args: &mut QueryArgs,
  search: Option<&WxoAppSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let from_query = r#"wx_wxo_app t
  left join base_domain domain_id_lbl on domain_id_lbl.id=t.domain_id"#.to_owned();
  Ok(from_query)
}

// MARK: find_all_wxo_app
/// 根据搜索条件和分页查找公众号设置列表
#[allow(unused_mut)]
pub async fn find_all_wxo_app(
  search: Option<WxoAppSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxoAppModel>> {
  
  let table = get_table_name_wxo_app();
  let method = "find_all_wxo_app";
  
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
  // 消息加解密方式
  if let Some(search) = &search && search.encoding_type.is_some() {
    let len = search.encoding_type.as_ref().unwrap().len();
    if len == 0 {
      return Ok(vec![]);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.encoding_type.length > {ids_limit}"));
    }
  }
  // 授权作用域
  if let Some(search) = &search && search.scope.is_some() {
    let len = search.scope.as_ref().unwrap().len();
    if len == 0 {
      return Ok(vec![]);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.scope.length > {ids_limit}"));
    }
  }
  // 网页授权域名
  if let Some(search) = &search && search.domain_id.is_some() {
    let len = search.domain_id.as_ref().unwrap().len();
    if len == 0 {
      return Ok(vec![]);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.domain_id.length > {ids_limit}"));
    }
  }
  // 锁定
  if let Some(search) = &search && search.is_locked.is_some() {
    let len = search.is_locked.as_ref().unwrap().len();
    if len == 0 {
      return Ok(vec![]);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.is_locked.length > {ids_limit}"));
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
  let is_result_limit = page.as_ref()
    .and_then(|item| item.is_result_limit)
    .unwrap_or(true);
  let page_query = get_page_query(page);
  
  let sql = format!(r#"select f.* from (select t.*
  ,domain_id_lbl.lbl domain_id_lbl
  from {from_query} where {where_query} group by t.id{order_by_query}) f {page_query}"#);
  
  let args = args.into();
  
  let options = Options::from(options);
  
  let options = options.set_cache_key(table, &sql, &args);
  
  let mut res: Vec<WxoAppModel> = query(
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
    "wxo_app_encoding_type",
    "wxo_app_scope",
    "is_locked",
    "is_enabled",
  ]).await?;
  let [
    encoding_type_dict,
    scope_dict,
    is_locked_dict,
    is_enabled_dict,
  ]: [Vec<_>; 4] = dict_vec
    .try_into()
    .map_err(|err| eyre!("{:#?}", err))?;
  
  #[allow(unused_variables)]
  for model in &mut res {
    
    // 消息加解密方式
    model.encoding_type_lbl = {
      encoding_type_dict
        .iter()
        .find(|item| item.val == model.encoding_type.as_str())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.encoding_type.to_string())
    };
    
    // 授权作用域
    model.scope_lbl = {
      scope_dict
        .iter()
        .find(|item| item.val == model.scope.as_str())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.scope.to_string())
    };
    
    // 锁定
    model.is_locked_lbl = {
      is_locked_dict
        .iter()
        .find(|item| item.val == model.is_locked.to_string())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.is_locked.to_string())
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

// MARK: find_count_wxo_app
/// 根据条件查找公众号设置总数
pub async fn find_count_wxo_app(
  search: Option<WxoAppSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_wxo_app();
  let method = "find_count_wxo_app";
  
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
  // 消息加解密方式
  if let Some(search) = &search && search.encoding_type.is_some() {
    let len = search.encoding_type.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.encoding_type.length > {ids_limit}"));
    }
  }
  // 授权作用域
  if let Some(search) = &search && search.scope.is_some() {
    let len = search.scope.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.scope.length > {ids_limit}"));
    }
  }
  // 网页授权域名
  if let Some(search) = &search && search.domain_id.is_some() {
    let len = search.domain_id.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.domain_id.length > {ids_limit}"));
    }
  }
  // 锁定
  if let Some(search) = &search && search.is_locked.is_some() {
    let len = search.is_locked.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.is_locked.length > {ids_limit}"));
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

// MARK: get_field_comments_wxo_app
/// 获取公众号设置字段注释
#[allow(unused_mut)]
pub async fn get_field_comments_wxo_app(
  _options: Option<Options>,
) -> Result<WxoAppFieldComment> {
  
  let mut field_comments = WxoAppFieldComment {
    id: "ID".into(),
    code: "原始ID".into(),
    lbl: "名称".into(),
    appid: "开发者ID".into(),
    appsecret: "开发者密码".into(),
    token: "令牌".into(),
    encoding_aes_key: "消息加解密密钥".into(),
    encoding_type: "消息加解密方式".into(),
    encoding_type_lbl: "消息加解密方式".into(),
    scope: "授权作用域".into(),
    scope_lbl: "授权作用域".into(),
    domain_id: "网页授权域名".into(),
    domain_id_lbl: "网页授权域名".into(),
    default_role_codes: "默认角色".into(),
    is_locked: "锁定".into(),
    is_locked_lbl: "锁定".into(),
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

// MARK: find_one_ok_wxo_app
/// 根据条件查找第一个公众号设置, 如果不存在则抛错
#[allow(dead_code)]
pub async fn find_one_ok_wxo_app(
  search: Option<WxoAppSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<WxoAppModel> {
  
  let table = get_table_name_wxo_app();
  let method = "find_one_ok_wxo_app";
  
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
  
  let wxo_app_model = find_one_wxo_app(
    search,
    sort,
    options,
  ).await?;
  
  let Some(wxo_app_model) = wxo_app_model else {
    let err_msg = "此 公众号设置 已被删除";
    return Err(eyre!(err_msg));
  };
  
  Ok(wxo_app_model)
}

// MARK: find_one_wxo_app
/// 根据条件查找第一个公众号设置
#[allow(dead_code)]
pub async fn find_one_wxo_app(
  search: Option<WxoAppSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<WxoAppModel>> {
  
  let table = get_table_name_wxo_app();
  let method = "find_one_wxo_app";
  
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
  
  let res = find_all_wxo_app(
    search,
    page,
    sort,
    options,
  ).await?;
  
  let model: Option<WxoAppModel> = res.into_iter().next();
  
  Ok(model)
}

// MARK: find_by_id_ok_wxo_app
/// 根据 id 查找公众号设置, 如果不存在则抛错
#[allow(dead_code)]
pub async fn find_by_id_ok_wxo_app(
  id: WxoAppId,
  options: Option<Options>,
) -> Result<WxoAppModel> {
  
  let table = get_table_name_wxo_app();
  let method = "find_by_id_ok_wxo_app";
  
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
  
  let wxo_app_model = find_by_id_wxo_app(
    id,
    options,
  ).await?;
  
  let Some(wxo_app_model) = wxo_app_model else {
    let err_msg = "此 公众号设置 已被删除";
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
  
  Ok(wxo_app_model)
}

// MARK: find_by_id_wxo_app
/// 根据 id 查找公众号设置
pub async fn find_by_id_wxo_app(
  id: WxoAppId,
  options: Option<Options>,
) -> Result<Option<WxoAppModel>> {
  
  let table = get_table_name_wxo_app();
  let method = "find_by_id_wxo_app";
  
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
  
  let search = WxoAppSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let wxo_app_model = find_one_wxo_app(
    search,
    None,
    options,
  ).await?;
  
  Ok(wxo_app_model)
}

// MARK: find_by_ids_ok_wxo_app
/// 根据 ids 查找公众号设置, 出现查询不到的 id 则报错
#[allow(dead_code)]
pub async fn find_by_ids_ok_wxo_app(
  ids: Vec<WxoAppId>,
  options: Option<Options>,
) -> Result<Vec<WxoAppModel>> {
  
  let table = get_table_name_wxo_app();
  let method = "find_by_ids_ok_wxo_app";
  
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
  
  let wxo_app_models = find_by_ids_wxo_app(
    ids.clone(),
    options,
  ).await?;
  
  if wxo_app_models.len() != len {
    let err_msg = "此 公众号设置 已被删除";
    return Err(eyre!(err_msg));
  }
  
  let wxo_app_models = ids
    .into_iter()
    .map(|id| {
      let model = wxo_app_models
        .iter()
        .find(|item| item.id == id);
      if let Some(model) = model {
        return Ok(model.clone());
      }
      let err_msg = "此 公众号设置 已经被删除";
      Err(eyre!(err_msg))
    })
    .collect::<Result<Vec<WxoAppModel>>>()?;
  
  Ok(wxo_app_models)
}

// MARK: find_by_ids_wxo_app
/// 根据 ids 查找公众号设置
#[allow(dead_code)]
pub async fn find_by_ids_wxo_app(
  ids: Vec<WxoAppId>,
  options: Option<Options>,
) -> Result<Vec<WxoAppModel>> {
  
  let table = get_table_name_wxo_app();
  let method = "find_by_ids_wxo_app";
  
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
  
  let search = WxoAppSearch {
    ids: Some(ids.clone()),
    ..Default::default()
  }.into();
  
  let wxo_app_models = find_all_wxo_app(
    search,
    None,
    None,
    options,
  ).await?;
  
  let wxo_app_models = ids
    .into_iter()
    .filter_map(|id| {
      wxo_app_models
        .iter()
        .find(|item| item.id == id)
        .cloned()
    })
    .collect::<Vec<WxoAppModel>>();
  
  Ok(wxo_app_models)
}

// MARK: exists_wxo_app
/// 根据搜索条件判断公众号设置是否存在
#[allow(dead_code)]
pub async fn exists_wxo_app(
  search: Option<WxoAppSearch>,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = get_table_name_wxo_app();
  let method = "exists_wxo_app";
  
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
  // 消息加解密方式
  if let Some(search) = &search && search.encoding_type.is_some() {
    let len = search.encoding_type.as_ref().unwrap().len();
    if len == 0 {
      return Ok(false);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.encoding_type.length > {ids_limit}"));
    }
  }
  // 授权作用域
  if let Some(search) = &search && search.scope.is_some() {
    let len = search.scope.as_ref().unwrap().len();
    if len == 0 {
      return Ok(false);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.scope.length > {ids_limit}"));
    }
  }
  // 网页授权域名
  if let Some(search) = &search && search.domain_id.is_some() {
    let len = search.domain_id.as_ref().unwrap().len();
    if len == 0 {
      return Ok(false);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.domain_id.length > {ids_limit}"));
    }
  }
  // 锁定
  if let Some(search) = &search && search.is_locked.is_some() {
    let len = search.is_locked.as_ref().unwrap().len();
    if len == 0 {
      return Ok(false);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.is_locked.length > {ids_limit}"));
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

// MARK: exists_by_id_wxo_app
/// 根据 id 判断公众号设置是否存在
#[allow(dead_code)]
pub async fn exists_by_id_wxo_app(
  id: WxoAppId,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = get_table_name_wxo_app();
  let method = "exists_by_id_wxo_app";
  
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
  
  let search = WxoAppSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let exists = exists_wxo_app(
    search,
    options,
  ).await?;
  
  Ok(exists)
}

// MARK: find_by_unique_wxo_app
/// 通过唯一约束获得数据列表
#[allow(unused_variables)]
pub async fn find_by_unique_wxo_app(
  search: WxoAppSearch,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<WxoAppModel>> {
  
  let table = get_table_name_wxo_app();
  let method = "find_by_unique_wxo_app";
  
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
    let model = find_by_id_wxo_app(
      id,
      options.clone(),
    ).await?;
    return Ok(model.map_or_else(Vec::new, |m| vec![m]));
  }
  
  let mut models: Vec<WxoAppModel> = vec![];
  
  let mut models_tmp = {
    if
      search.code.is_none()
    {
      return Ok(vec![]);
    }
    
    let search = WxoAppSearch {
      code: search.code.clone(),
      ..Default::default()
    };
    
    find_all_wxo_app(
      search.into(),
      None,
      sort.clone(),
      options.clone(),
    ).await?
  };
  models.append(&mut models_tmp);
  
  let mut models_tmp = {
    if
      search.lbl.is_none()
    {
      return Ok(vec![]);
    }
    
    let search = WxoAppSearch {
      lbl: search.lbl.clone(),
      ..Default::default()
    };
    
    find_all_wxo_app(
      search.into(),
      None,
      sort.clone(),
      options.clone(),
    ).await?
  };
  models.append(&mut models_tmp);
  
  let mut models_tmp = {
    if
      search.appid.is_none()
    {
      return Ok(vec![]);
    }
    
    let search = WxoAppSearch {
      appid: search.appid.clone(),
      ..Default::default()
    };
    
    find_all_wxo_app(
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
  input: &WxoAppInput,
  model: &WxoAppModel,
) -> bool {
  if input.id.as_ref().is_some() {
    return input.id.as_ref().unwrap() == &model.id;
  }
  
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
  
  if
    input.appid.as_ref().is_some() && input.appid.as_ref().unwrap() == &model.appid
  {
    return true;
  }
  false
}

// MARK: check_by_unique_wxo_app
/// 通过唯一约束检查数据是否已经存在
#[allow(unused_variables)]
pub async fn check_by_unique_wxo_app(
  input: WxoAppInput,
  model: WxoAppModel,
  options: Option<Options>,
) -> Result<Option<WxoAppId>> {
  
  let table = get_table_name_wxo_app();
  let method = "check_by_unique_wxo_app";
  
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
    let id = update_by_id_wxo_app(
      model.id,
      input,
      options,
    ).await?;
    return Ok(id.into());
  }
  if unique_type == UniqueType::Throw {
    let err_msg = "公众号设置 重复";
    return Err(eyre!(err_msg));
  }
  Ok(None)
}

// MARK: set_id_by_lbl_wxo_app
/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(unused_variables, dead_code)]
pub async fn set_id_by_lbl_wxo_app(
  input: WxoAppInput,
) -> Result<WxoAppInput> {
  
  #[allow(unused_mut)]
  let mut input = input;
  
  let dict_vec = get_dict(&[
    "wxo_app_encoding_type",
    "wxo_app_scope",
    "is_locked",
    "is_enabled",
  ]).await?;
  
  // 消息加解密方式
  if input.encoding_type.is_none() {
    let encoding_type_dict = &dict_vec[0];
    if let Some(encoding_type_lbl) = input.encoding_type_lbl.clone() {
      input.encoding_type = encoding_type_dict
        .iter()
        .find(|item| {
          item.lbl == encoding_type_lbl
        })
        .map(|item| {
          item.val.parse().unwrap_or_default()
        });
    }
  }
  
  // 授权作用域
  if input.scope.is_none() {
    let scope_dict = &dict_vec[1];
    if let Some(scope_lbl) = input.scope_lbl.clone() {
      input.scope = scope_dict
        .iter()
        .find(|item| {
          item.lbl == scope_lbl
        })
        .map(|item| {
          item.val.parse().unwrap_or_default()
        });
    }
  }
  
  // 锁定
  if input.is_locked.is_none() {
    let is_locked_dict = &dict_vec[2];
    if let Some(is_locked_lbl) = input.is_locked_lbl.clone() {
      input.is_locked = is_locked_dict
        .iter()
        .find(|item| {
          item.lbl == is_locked_lbl
        })
        .map(|item| {
          item.val.parse().unwrap_or_default()
        });
    }
  }
  
  // 启用
  if input.is_enabled.is_none() {
    let is_enabled_dict = &dict_vec[3];
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
  
  // 消息加解密方式
  if
    input.encoding_type_lbl.is_some() && !input.encoding_type_lbl.as_ref().unwrap().is_empty()
    && input.encoding_type.is_none()
  {
    let encoding_type_dict = &dict_vec[0];
    let dict_model = encoding_type_dict.iter().find(|item| {
      item.lbl == input.encoding_type_lbl.clone().unwrap_or_default()
    });
    let val = dict_model.map(|item| item.val.to_string());
    if let Some(val) = val {
      input.encoding_type = val.parse::<WxoAppEncodingType>()?.into();
    }
  } else if
    (input.encoding_type_lbl.is_none() || input.encoding_type_lbl.as_ref().unwrap().is_empty())
    && input.encoding_type.is_some()
  {
    let encoding_type_dict = &dict_vec[0];
    let dict_model = encoding_type_dict.iter().find(|item| {
      item.val == input.encoding_type.unwrap_or_default().to_string()
    });
    let lbl = dict_model.map(|item| item.lbl.to_string());
    input.encoding_type_lbl = lbl;
  }
  
  // 授权作用域
  if
    input.scope_lbl.is_some() && !input.scope_lbl.as_ref().unwrap().is_empty()
    && input.scope.is_none()
  {
    let scope_dict = &dict_vec[1];
    let dict_model = scope_dict.iter().find(|item| {
      item.lbl == input.scope_lbl.clone().unwrap_or_default()
    });
    let val = dict_model.map(|item| item.val.to_string());
    if let Some(val) = val {
      input.scope = val.parse::<WxoAppScope>()?.into();
    }
  } else if
    (input.scope_lbl.is_none() || input.scope_lbl.as_ref().unwrap().is_empty())
    && input.scope.is_some()
  {
    let scope_dict = &dict_vec[1];
    let dict_model = scope_dict.iter().find(|item| {
      item.val == input.scope.unwrap_or_default().to_string()
    });
    let lbl = dict_model.map(|item| item.lbl.to_string());
    input.scope_lbl = lbl;
  }
  
  // 网页授权域名
  if input.domain_id_lbl.is_some()
    && !input.domain_id_lbl.as_ref().unwrap().is_empty()
    && input.domain_id.is_none()
  {
    input.domain_id_lbl = input.domain_id_lbl.map(|item| 
      item.trim().to_owned()
    );
    let model = crate::base::domain::domain_dao::find_one_domain(
      crate::base::domain::domain_model::DomainSearch {
        lbl: input.domain_id_lbl.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(model) = model {
      input.domain_id = model.id.into();
    }
  } else if
    (input.domain_id_lbl.is_none() || input.domain_id_lbl.as_ref().unwrap().is_empty())
    && input.domain_id.is_some()
  {
    let domain_model = crate::base::domain::domain_dao::find_one_domain(
      crate::base::domain::domain_model::DomainSearch {
        id: input.domain_id.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(domain_model) = domain_model {
      input.domain_id_lbl = domain_model.lbl.into();
    }
  }
  
  // 锁定
  if
    input.is_locked_lbl.is_some() && !input.is_locked_lbl.as_ref().unwrap().is_empty()
    && input.is_locked.is_none()
  {
    let is_locked_dict = &dict_vec[2];
    let dict_model = is_locked_dict.iter().find(|item| {
      item.lbl == input.is_locked_lbl.clone().unwrap_or_default()
    });
    let val = dict_model.map(|item| item.val.to_string());
    if let Some(val) = val {
      input.is_locked = val.parse::<u8>()?.into();
    }
  } else if
    (input.is_locked_lbl.is_none() || input.is_locked_lbl.as_ref().unwrap().is_empty())
    && input.is_locked.is_some()
  {
    let is_locked_dict = &dict_vec[2];
    let dict_model = is_locked_dict.iter().find(|item| {
      item.val == input.is_locked.unwrap_or_default().to_string()
    });
    let lbl = dict_model.map(|item| item.lbl.to_string());
    input.is_locked_lbl = lbl;
  }
  
  // 启用
  if
    input.is_enabled_lbl.is_some() && !input.is_enabled_lbl.as_ref().unwrap().is_empty()
    && input.is_enabled.is_none()
  {
    let is_enabled_dict = &dict_vec[3];
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
    let is_enabled_dict = &dict_vec[3];
    let dict_model = is_enabled_dict.iter().find(|item| {
      item.val == input.is_enabled.unwrap_or_default().to_string()
    });
    let lbl = dict_model.map(|item| item.lbl.to_string());
    input.is_enabled_lbl = lbl;
  }
  
  Ok(input)
}

// MARK: creates_return_wxo_app
/// 批量创建公众号设置并返回
#[allow(dead_code)]
pub async fn creates_return_wxo_app(
  inputs: Vec<WxoAppInput>,
  options: Option<Options>,
) -> Result<Vec<WxoAppModel>> {
  
  let table = get_table_name_wxo_app();
  let method = "creates_return_wxo_app";
  
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
  
  let models_wxo_app = find_by_ids_wxo_app(
    ids,
    options,
  ).await?;
  
  Ok(models_wxo_app)
}

// MARK: creates_wxo_app
/// 批量创建公众号设置
pub async fn creates_wxo_app(
  inputs: Vec<WxoAppInput>,
  options: Option<Options>,
) -> Result<Vec<WxoAppId>> {
  
  let table = get_table_name_wxo_app();
  let method = "creates_wxo_app";
  
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

/// 批量创建公众号设置
#[allow(unused_variables, clippy::redundant_locals)]
async fn _creates(
  inputs: Vec<WxoAppInput>,
  options: Option<Options>,
) -> Result<Vec<WxoAppId>> {
  
  let table = get_table_name_wxo_app();
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  
  let unique_type = options.as_ref()
    .and_then(|item|
      item.get_unique_type()
    )
    .unwrap_or_default();
  
  let mut ids2: Vec<WxoAppId> = vec![];
  let mut inputs2: Vec<WxoAppInput> = vec![];
  
  for input in inputs {
  
    if input.id.is_some() {
      return Err(eyre!("Can not set id when create in dao: {table}"));
    }
    
    let old_models = find_by_unique_wxo_app(
      input.clone().into(),
      None,
      options.clone(),
    ).await?;
    
    if !old_models.is_empty() {
      let mut id: Option<WxoAppId> = None;
      
      for old_model in old_models {
        let options = Options::from(options.clone())
          .set_unique_type(unique_type);
        
        id = check_by_unique_wxo_app(
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
  let mut sql_fields = String::with_capacity(80 * 21 + 20);
  
  sql_fields += "id";
  sql_fields += ",create_time";
  sql_fields += ",update_time";
  sql_fields += ",create_usr_id";
  sql_fields += ",create_usr_id_lbl";
  sql_fields += ",update_usr_id";
  sql_fields += ",update_usr_id_lbl";
  sql_fields += ",tenant_id";
  // 原始ID
  sql_fields += ",code";
  // 名称
  sql_fields += ",lbl";
  // 开发者ID
  sql_fields += ",appid";
  // 开发者密码
  sql_fields += ",appsecret";
  // 令牌
  sql_fields += ",token";
  // 消息加解密密钥
  sql_fields += ",encoding_aes_key";
  // 消息加解密方式
  sql_fields += ",encoding_type";
  // 授权作用域
  sql_fields += ",scope";
  // 网页授权域名
  sql_fields += ",domain_id";
  // 默认角色
  sql_fields += ",default_role_codes";
  // 锁定
  sql_fields += ",is_locked";
  // 启用
  sql_fields += ",is_enabled";
  // 排序
  sql_fields += ",order_by";
  // 备注
  sql_fields += ",rem";
  
  let inputs2_len = inputs2.len();
  let mut sql_values = String::with_capacity((2 * 21 + 3) * inputs2_len);
  let mut inputs2_ids = vec![];
  
  for (i, input) in inputs2
    .clone()
    .into_iter()
    .enumerate()
  {
    
    let id: WxoAppId = get_short_uuid().into();
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
    // 原始ID
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
    if let Some(token) = input.token {
      sql_values += ",?";
      args.push(token.into());
    } else {
      sql_values += ",default";
    }
    // 消息加解密密钥
    if let Some(encoding_aes_key) = input.encoding_aes_key {
      sql_values += ",?";
      args.push(encoding_aes_key.into());
    } else {
      sql_values += ",default";
    }
    // 消息加解密方式
    if let Some(encoding_type) = input.encoding_type {
      sql_values += ",?";
      args.push(encoding_type.into());
    } else {
      sql_values += ",default";
    }
    // 授权作用域
    if let Some(scope) = input.scope {
      sql_values += ",?";
      args.push(scope.into());
    } else {
      sql_values += ",default";
    }
    // 网页授权域名
    if let Some(domain_id) = input.domain_id {
      sql_values += ",?";
      args.push(domain_id.into());
    } else {
      sql_values += ",default";
    }
    // 默认角色
    if let Some(default_role_codes) = input.default_role_codes {
      sql_values += ",?";
      args.push(default_role_codes.into());
    } else {
      sql_values += ",default";
    }
    // 锁定
    if let Some(is_locked) = input.is_locked {
      sql_values += ",?";
      args.push(is_locked.into());
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

// MARK: create_return_wxo_app
/// 创建公众号设置并返回
#[allow(dead_code)]
pub async fn create_return_wxo_app(
  #[allow(unused_mut)]
  mut input: WxoAppInput,
  options: Option<Options>,
) -> Result<WxoAppModel> {
  
  let id = create_wxo_app(
    input.clone(),
    options.clone(),
  ).await?;
  
  let model_wxo_app = find_by_id_wxo_app(
    id,
    options,
  ).await?;
  
  let model_wxo_app = match model_wxo_app {
    Some(model) => model,
    None => {
      let err_msg = "create_return_wxo_app: model_wxo_app.is_none()";
      return Err(eyre!(
        ServiceException {
          message: err_msg.to_owned(),
          trace: true,
          ..Default::default()
        },
      ));
    }
  };
  
  Ok(model_wxo_app)
}

// MARK: create_wxo_app
/// 创建公众号设置
#[allow(dead_code)]
pub async fn create_wxo_app(
  #[allow(unused_mut)]
  mut input: WxoAppInput,
  options: Option<Options>,
) -> Result<WxoAppId> {
  
  let table = get_table_name_wxo_app();
  let method = "create_wxo_app";
  
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

// MARK: update_tenant_by_id_wxo_app
/// 公众号设置根据id修改租户id
pub async fn update_tenant_by_id_wxo_app(
  id: WxoAppId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  let table = get_table_name_wxo_app();
  let method = "update_tenant_by_id_wxo_app";
  
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

// MARK: update_by_id_wxo_app
/// 根据 id 修改公众号设置
#[allow(unused_mut)]
#[allow(unused_variables)]
pub async fn update_by_id_wxo_app(
  id: WxoAppId,
  mut input: WxoAppInput,
  options: Option<Options>,
) -> Result<WxoAppId> {
  
  let table = get_table_name_wxo_app();
  let method = "update_by_id_wxo_app";
  
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
  
  let old_model = find_by_id_wxo_app(
    id,
    options.clone(),
  ).await?;
  
  let old_model = match old_model {
    Some(model) => model,
    None => {
      let err_msg = "编辑失败, 此 公众号设置 已被删除";
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
    
    let models = find_by_unique_wxo_app(
      input.into(),
      None,
      options.clone(),
    ).await?;
    
    let models = models.into_iter()
      .filter(|item| 
        item.id != id
      )
      .collect::<Vec<WxoAppModel>>();
    
    if !models.is_empty() {
      let unique_type = options
        .as_ref()
        .and_then(|item| item.get_unique_type())
        .unwrap_or(UniqueType::Throw);
      if unique_type == UniqueType::Throw {
        let err_msg = "公众号设置 重复";
        return Err(eyre!(err_msg));
      } else if unique_type == UniqueType::Ignore {
        return Ok(id);
      }
    }
  }
  
  let mut args = QueryArgs::new();
  
  let mut sql_fields = String::with_capacity(80 * 21 + 20);
  
  let mut field_num: usize = 0;
  
  if let Some(tenant_id) = input.tenant_id {
    field_num += 1;
    sql_fields += "tenant_id=?,";
    args.push(tenant_id.into());
  }
  // 原始ID
  if let Some(code) = input.code {
    field_num += 1;
    sql_fields += "code=?,";
    args.push(code.into());
  }
  // 名称
  if let Some(lbl) = input.lbl {
    field_num += 1;
    sql_fields += "lbl=?,";
    args.push(lbl.into());
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
  if let Some(token) = input.token {
    field_num += 1;
    sql_fields += "token=?,";
    args.push(token.into());
  }
  // 消息加解密密钥
  if let Some(encoding_aes_key) = input.encoding_aes_key {
    field_num += 1;
    sql_fields += "encoding_aes_key=?,";
    args.push(encoding_aes_key.into());
  }
  // 消息加解密方式
  if let Some(encoding_type) = input.encoding_type {
    field_num += 1;
    sql_fields += "encoding_type=?,";
    args.push(encoding_type.into());
  }
  // 授权作用域
  if let Some(scope) = input.scope {
    field_num += 1;
    sql_fields += "scope=?,";
    args.push(scope.into());
  }
  // 网页授权域名
  if let Some(domain_id) = input.domain_id {
    field_num += 1;
    sql_fields += "domain_id=?,";
    args.push(domain_id.into());
  }
  // 默认角色
  if let Some(default_role_codes) = input.default_role_codes {
    field_num += 1;
    sql_fields += "default_role_codes=?,";
    args.push(default_role_codes.into());
  }
  // 锁定
  if let Some(is_locked) = input.is_locked {
    field_num += 1;
    sql_fields += "is_locked=?,";
    args.push(is_locked.into());
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
  let table = get_table_name_wxo_app();
  vec![
    table,
  ]
}

// MARK: del_cache_wxo_app
/// 清空缓存
#[allow(dead_code)]
pub async fn del_cache_wxo_app() -> Result<()> {
  let cache_key1s = get_cache_tables();
  del_caches(
    cache_key1s.as_slice(),
  ).await?;
  Ok(())
}

// MARK: delete_by_ids_wxo_app
/// 根据 ids 删除公众号设置
#[allow(unused_variables)]
pub async fn delete_by_ids_wxo_app(
  ids: Vec<WxoAppId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_wxo_app();
  let method = "delete_by_ids_wxo_app";
  
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
    
    let old_model = find_by_id_wxo_app(
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
  }
  
  if num > MAX_SAFE_INTEGER {
    return Err(eyre!("num: {} > MAX_SAFE_INTEGER", num));
  }
  
  Ok(num)
}

// MARK: get_is_enabled_by_id_wxo_app
/// 根据 id 查找公众号设置是否已启用
/// 记录不存在则返回 false
pub async fn get_is_enabled_by_id_wxo_app(
  id: WxoAppId,
  options: Option<Options>,
) -> Result<bool> {
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let model = find_by_id_wxo_app(
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

// MARK: enable_by_ids_wxo_app
/// 根据 ids 启用或者禁用公众号设置
pub async fn enable_by_ids_wxo_app(
  ids: Vec<WxoAppId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_wxo_app();
  let method = "enable_by_ids_wxo_app";
  
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

// MARK: get_is_locked_by_id_wxo_app
/// 根据 id 查找公众号设置是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
pub async fn get_is_locked_by_id_wxo_app(
  id: WxoAppId,
  options: Option<Options>,
) -> Result<bool> {
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let model = find_by_id_wxo_app(
    id,
    options,
  ).await?;
  
  let is_locked = {
    if let Some(model) = model {
      model.is_locked == 1
    } else {
      false
    }
  };
  
  Ok(is_locked)
}

// MARK: lock_by_ids_wxo_app
/// 根据 ids 锁定或者解锁公众号设置
pub async fn lock_by_ids_wxo_app(
  ids: Vec<WxoAppId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_wxo_app();
  let method = "lock_by_ids_wxo_app";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    msg += &format!(" ids: {:?}", &ids);
    msg += &format!(" is_locked: {:?}", &is_locked);
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
  
  let options = Options::from(options);
  
  let options = options.set_del_cache_key1s(get_cache_tables());
  
  let mut num = 0;
  for id in ids {
    let mut args = QueryArgs::new();
    
    let sql = format!("update {table} set is_locked=? where id=? limit 1");
    
    args.push(is_locked.into());
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

// MARK: revert_by_ids_wxo_app
/// 根据 ids 还原公众号设置
pub async fn revert_by_ids_wxo_app(
  ids: Vec<WxoAppId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_wxo_app();
  let method = "revert_by_ids_wxo_app";
  
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
    
    args.push(id.into());
    
    let args: Vec<_> = args.into();
    
    let mut old_model = find_one_wxo_app(
      WxoAppSearch {
        id: Some(id),
        is_deleted: Some(1),
        ..Default::default()
      }.into(),
      None,
      options.clone(),
    ).await?;
    
    if old_model.is_none() {
      old_model = find_by_id_wxo_app(
        id,
        options.clone(),
      ).await?;
    }
    
    let old_model = match old_model {
      Some(model) => model,
      None => continue,
    };
    
    {
      let mut input: WxoAppInput = old_model.clone().into();
      input.id = None;
      
      let models = find_by_unique_wxo_app(
        input.into(),
        None,
        options.clone(),
      ).await?;
      
      let models: Vec<WxoAppModel> = models
        .into_iter()
        .filter(|item| 
          item.id != id
        )
        .collect();
      
      if !models.is_empty() {
        let err_msg = "公众号设置 重复";
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

// MARK: force_delete_by_ids_wxo_app
/// 根据 ids 彻底删除公众号设置
#[allow(unused_variables)]
pub async fn force_delete_by_ids_wxo_app(
  ids: Vec<WxoAppId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_wxo_app();
  let method = "force_delete_by_ids_wxo_app";
  
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
    
    let old_model = find_one_wxo_app(
      Some(WxoAppSearch {
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
    
    num += execute(
      sql,
      args,
      options.clone(),
    ).await?;
  }
  
  Ok(num)
}

// MARK: find_last_order_by_wxo_app
/// 查找 公众号设置 order_by 字段的最大值
pub async fn find_last_order_by_wxo_app(
  search: Option<WxoAppSearch>,
  options: Option<Options>,
) -> Result<u32> {
  
  let table = get_table_name_wxo_app();
  let method = "find_last_order_by_wxo_app";
  
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

// MARK: validate_is_enabled_wxo_app
/// 校验公众号设置是否启用
#[allow(dead_code)]
pub async fn validate_is_enabled_wxo_app(
  model: &WxoAppModel,
) -> Result<()> {
  if model.is_enabled == 0 {
    let err_msg = "公众号设置已禁用";
    return Err(eyre!(err_msg));
  }
  Ok(())
}

// MARK: validate_option_wxo_app
/// 校验公众号设置是否存在
#[allow(dead_code)]
pub async fn validate_option_wxo_app(
  model: Option<WxoAppModel>,
) -> Result<WxoAppModel> {
  
  let model = match model {
    Some(model) => model,
    None => {
      let err_msg = "公众号设置不存在";
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
