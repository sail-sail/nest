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
  OrderByModel,
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

use crate::src::base::dict_detail::dict_detail_dao::get_dict;

use crate::src::base::lang::lang_dao::get_lang_id;
use crate::r#gen::base::lang::lang_model::LangId;
use crate::src::base::i18n::i18n_dao::get_server_i18n_enable;

use super::dict_model::*;

// 系统字典明细
use crate::r#gen::base::dict_detail::dict_detail_dao::{
  find_all as find_all_dict_detail,
  create as create_dict_detail,
  delete_by_ids as delete_by_ids_dict_detail,
  revert_by_ids as revert_by_ids_dict_detail,
  update_by_id as update_by_id_dict_detail,
  force_delete_by_ids as force_delete_by_ids_dict_detail,
};

// 系统字典明细
use crate::r#gen::base::dict_detail::dict_detail_model::*;
use crate::r#gen::base::usr::usr_model::UsrId;

use crate::r#gen::base::usr::usr_dao::find_by_id as find_by_id_usr;

#[allow(unused_variables)]
async fn get_where_query(
  args: &mut QueryArgs,
  search: Option<&DictSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let server_i18n_enable = get_server_i18n_enable();
  
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
    let ids: Option<Vec<DictId>> = match search {
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
    if let Some(code_like) = code_like {
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
      if server_i18n_enable {
        where_query.push_str(" and (t.lbl=? or base_dict_lang.lbl=?)");
        args.push(lbl.as_str().into());
        args.push(lbl.as_str().into());
      } else {
        where_query.push_str(" and t.lbl=?");
        args.push(lbl.into());
      }
    }
    let lbl_like = match search {
      Some(item) => item.lbl_like.clone(),
      None => None,
    };
    if let Some(lbl_like) = lbl_like {
      if server_i18n_enable {
        where_query.push_str(" and (t.lbl like ? or base_dict_lang.lbl like ?)");
        let like_str = format!("%{}%", sql_like(&lbl_like));
        args.push(like_str.as_str().into());
        args.push(like_str.as_str().into());
      } else {
        where_query.push_str(" and t.lbl like ?");
        args.push(format!("%{}%", sql_like(&lbl_like)).into());
      }
    }
  }
  // 数据类型
  {
    let r#type: Option<Vec<DictType>> = match search {
      Some(item) => item.r#type.clone(),
      None => None,
    };
    if let Some(r#type) = r#type {
      let arg = {
        if r#type.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(r#type.len());
          for item in r#type {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.type in (");
      where_query.push_str(&arg);
      where_query.push(')');
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
      if server_i18n_enable {
        where_query.push_str(" and (t.rem=? or base_dict_lang.rem=?)");
        args.push(rem.as_str().into());
        args.push(rem.as_str().into());
      } else {
        where_query.push_str(" and t.rem=?");
        args.push(rem.into());
      }
    }
    let rem_like = match search {
      Some(item) => item.rem_like.clone(),
      None => None,
    };
    if let Some(rem_like) = rem_like {
      if server_i18n_enable {
        where_query.push_str(" and (t.rem like ? or base_dict_lang.rem like ?)");
        let like_str = format!("%{}%", sql_like(&rem_like));
        args.push(like_str.as_str().into());
        args.push(like_str.as_str().into());
      } else {
        where_query.push_str(" and t.rem like ?");
        args.push(format!("%{}%", sql_like(&rem_like)).into());
      }
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
  search: Option<&DictSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let server_i18n_enable = get_server_i18n_enable();
  
  let mut from_query = r#"base_dict t"#.to_owned();
  if server_i18n_enable {
    from_query += " left join base_dict_lang on base_dict_lang.dict_id=t.id and base_dict_lang.lang_id=?";
    args.push(get_lang_id().await?.unwrap_or_default().to_string().into());
  }
  Ok(from_query)
}

// MARK: find_all
/// 根据搜索条件和分页查找系统字典列表
#[allow(unused_mut)]
pub async fn find_all(
  search: Option<DictSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<DictModel>> {
  
  let table = "base_dict";
  let method = "find_all";
  
  let server_i18n_enable= get_server_i18n_enable();
  
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
  // 数据类型
  if let Some(search) = &search {
    if search.r#type.is_some() {
      let len = search.r#type.as_ref().unwrap().len();
      if len == 0 {
        return Ok(vec![]);
      }
      let ids_limit = options
        .as_ref()
        .and_then(|x| x.get_ids_limit())
        .unwrap_or(FIND_ALL_IDS_LIMIT);
      if len > ids_limit {
        return Err(anyhow!("search.type.length > {ids_limit}"));
      }
    }
  }
  // 锁定
  if let Some(search) = &search {
    if search.is_locked.is_some() {
      let len = search.is_locked.as_ref().unwrap().len();
      if len == 0 {
        return Ok(vec![]);
      }
      let ids_limit = options
        .as_ref()
        .and_then(|x| x.get_ids_limit())
        .unwrap_or(FIND_ALL_IDS_LIMIT);
      if len > ids_limit {
        return Err(anyhow!("search.is_locked.length > {ids_limit}"));
      }
    }
  }
  // 启用
  if let Some(search) = &search {
    if search.is_enabled.is_some() {
      let len = search.is_enabled.as_ref().unwrap().len();
      if len == 0 {
        return Ok(vec![]);
      }
      let ids_limit = options
        .as_ref()
        .and_then(|x| x.get_ids_limit())
        .unwrap_or(FIND_ALL_IDS_LIMIT);
      if len > ids_limit {
        return Err(anyhow!("search.is_enabled.length > {ids_limit}"));
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
  
  let lang_sql = {
    let mut lang_sql = String::new();
    if server_i18n_enable {
      lang_sql += ",max(base_dict_lang.lbl) lbl_lang";
      lang_sql += ",max(base_dict_lang.rem) rem_lang";
    }
    lang_sql
  };
  
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
  
  let sort = sort.into();
  
  let order_by_query = get_order_by_query(sort);
  let page_query = get_page_query(page);
  
  let sql = format!(r#"select f.* from (select t.*
  {lang_sql}
  from {from_query} where {where_query} group by t.id{order_by_query}) f {page_query}"#);
  
  let args = args.into();
  
  let options = Options::from(options);
  
  let options = options.set_cache_key(table, &sql, &args);
  
  let mut res: Vec<DictModel> = query(
    sql,
    args,
    Some(options),
  ).await?;
  
  let dict_vec = get_dict(&[
    "dict_type",
    "is_locked",
    "is_enabled",
  ]).await?;
  let [
    type_dict,
    is_locked_dict,
    is_enabled_dict,
  ]: [Vec<_>; 3] = dict_vec
    .try_into()
    .map_err(|err| anyhow!("{:#?}", err))?;
  
  // 系统字典明细
  let dict_detail_models = find_all_dict_detail(
    DictDetailSearch {
      dict_id: res
        .iter()
        .map(|item| item.id.clone())
        .collect::<Vec<DictId>>()
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
    
    // 数据类型
    model.r#type_lbl = {
      r#type_dict
        .iter()
        .find(|item| item.val == model.r#type.as_str())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.r#type.to_string())
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
    
    // 系统字典明细
    model.dict_detail = dict_detail_models
      .clone()
      .into_iter()
      .filter(|item|
        item.dict_id == model.id
      )
      .collect();
    
  }
  
  Ok(res)
}

// MARK: find_count
/// 根据条件查找系统字典总数
pub async fn find_count(
  search: Option<DictSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_dict";
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
    route_path: get_route_path_dict().into(),
  }
}

// MARK: get_field_comments
/// 获取系统字典字段注释
pub async fn get_field_comments(
  _options: Option<Options>,
) -> Result<DictFieldComment> {
  
  let n_route = get_n_route();
  
  let i18n_code_maps: Vec<i18n_dao::I18nCodeMap> = vec![
    "ID".into(),
    "编码".into(),
    "名称".into(),
    "数据类型".into(),
    "数据类型".into(),
    "锁定".into(),
    "锁定".into(),
    "启用".into(),
    "启用".into(),
    "排序".into(),
    "备注".into(),
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
  
  let field_comments = DictFieldComment {
    id: vec[0].to_owned(),
    code: vec[1].to_owned(),
    lbl: vec[2].to_owned(),
    r#type: vec[3].to_owned(),
    type_lbl: vec[4].to_owned(),
    is_locked: vec[5].to_owned(),
    is_locked_lbl: vec[6].to_owned(),
    is_enabled: vec[7].to_owned(),
    is_enabled_lbl: vec[8].to_owned(),
    order_by: vec[9].to_owned(),
    rem: vec[10].to_owned(),
    create_usr_id: vec[11].to_owned(),
    create_usr_id_lbl: vec[12].to_owned(),
    create_time: vec[13].to_owned(),
    create_time_lbl: vec[14].to_owned(),
    update_usr_id: vec[15].to_owned(),
    update_usr_id_lbl: vec[16].to_owned(),
    update_time: vec[17].to_owned(),
    update_time_lbl: vec[18].to_owned(),
  };
  Ok(field_comments)
}

// MARK: find_one
/// 根据条件查找第一个系统字典
pub async fn find_one(
  search: Option<DictSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<DictModel>> {
  
  let table = "base_dict";
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
  
  let model: Option<DictModel> = res.into_iter().next();
  
  Ok(model)
}

// MARK: find_by_id
/// 根据 id 查找系统字典
pub async fn find_by_id(
  id: DictId,
  options: Option<Options>,
) -> Result<Option<DictModel>> {
  
  let table = "base_dict";
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
  
  let search = DictSearch {
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
/// 根据 ids 查找系统字典
#[allow(dead_code)]
pub async fn find_by_ids(
  ids: Vec<DictId>,
  options: Option<Options>,
) -> Result<Vec<DictModel>> {
  
  let table = "base_dict";
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
  
  let search = DictSearch {
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
    .collect::<Result<Vec<DictModel>>>()?;
  
  Ok(models)
}

// MARK: exists
/// 根据搜索条件判断系统字典是否存在
#[allow(dead_code)]
pub async fn exists(
  search: Option<DictSearch>,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = "base_dict";
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
/// 根据 id 判断系统字典是否存在
#[allow(dead_code)]
pub async fn exists_by_id(
  id: DictId,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = "base_dict";
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
  
  let search = DictSearch {
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
  search: DictSearch,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<DictModel>> {
  
  let table = "base_dict";
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
  
  let mut models: Vec<DictModel> = vec![];
  
  let mut models_tmp = {
    if
      search.code.is_none()
    {
      return Ok(vec![]);
    }
    
    let search = DictSearch {
      code: search.code.clone(),
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
      search.lbl.is_none()
    {
      return Ok(vec![]);
    }
    
    let search = DictSearch {
      lbl: search.lbl.clone(),
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
  input: &DictInput,
  model: &DictModel,
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
  false
}

// MARK: check_by_unique
/// 通过唯一约束检查数据是否已经存在
#[allow(unused_variables)]
pub async fn check_by_unique(
  input: DictInput,
  model: DictModel,
  options: Option<Options>,
) -> Result<Option<DictId>> {
  
  let table = "base_dict";
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
      "系统字典".to_owned(),
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
  input: DictInput,
) -> Result<DictInput> {
  
  #[allow(unused_mut)]
  let mut input = input;
  
  let dict_vec = get_dict(&[
    "dict_type",
    "is_locked",
    "is_enabled",
  ]).await?;
  
  // 数据类型
  if input.r#type.is_none() {
    let type_dict = &dict_vec[0];
    if let Some(type_lbl) = input.type_lbl.clone() {
      input.r#type = type_dict
        .iter()
        .find(|item| {
          item.lbl == type_lbl
        })
        .map(|item| {
          item.val.parse().unwrap_or_default()
        });
    }
  }
  
  // 锁定
  if input.is_locked.is_none() {
    let is_locked_dict = &dict_vec[1];
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
    let is_enabled_dict = &dict_vec[2];
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
  
  // 数据类型
  if
    input.type_lbl.is_some() && !input.type_lbl.as_ref().unwrap().is_empty()
    && input.r#type.is_none()
  {
    let type_dict = &dict_vec[0];
    let dict_model = type_dict.iter().find(|item| {
      item.lbl == input.type_lbl.clone().unwrap_or_default()
    });
    let val = dict_model.map(|item| item.val.to_string());
    if let Some(val) = val {
      input.r#type = val.parse::<DictType>()?.into();
    }
  } else if
    (input.type_lbl.is_none() || input.type_lbl.as_ref().unwrap().is_empty())
    && input.r#type.is_some()
  {
    let type_dict = &dict_vec[0];
    let dict_model = type_dict.iter().find(|item| {
      item.val == input.r#type.unwrap_or_default().to_string()
    });
    let lbl = dict_model.map(|item| item.lbl.to_string());
    input.type_lbl = lbl;
  }
  
  // 锁定
  if
    input.is_locked_lbl.is_some() && !input.is_locked_lbl.as_ref().unwrap().is_empty()
    && input.is_locked.is_none()
  {
    let is_locked_dict = &dict_vec[1];
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
    let is_locked_dict = &dict_vec[1];
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
    let is_enabled_dict = &dict_vec[2];
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
    let is_enabled_dict = &dict_vec[2];
    let dict_model = is_enabled_dict.iter().find(|item| {
      item.val == input.is_enabled.unwrap_or_default().to_string()
    });
    let lbl = dict_model.map(|item| item.lbl.to_string());
    input.is_enabled_lbl = lbl;
  }
  
  Ok(input)
}

// MARK: creates_return
/// 批量创建系统字典并返回
#[allow(dead_code)]
pub async fn creates_return(
  inputs: Vec<DictInput>,
  options: Option<Options>,
) -> Result<Vec<DictModel>> {
  
  let table = "base_dict";
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
/// 批量创建系统字典
pub async fn creates(
  inputs: Vec<DictInput>,
  options: Option<Options>,
) -> Result<Vec<DictId>> {
  
  let table = "base_dict";
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

/// 批量创建系统字典
#[allow(unused_variables)]
async fn _creates(
  inputs: Vec<DictInput>,
  options: Option<Options>,
) -> Result<Vec<DictId>> {
  
  let table = "base_dict";
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  
  let unique_type = options.as_ref()
    .and_then(|item|
      item.get_unique_type()
    )
    .unwrap_or_default();
  
  let mut ids2: Vec<DictId> = vec![];
  let mut inputs2: Vec<DictInput> = vec![];
  
  for input in inputs.clone() {
  
    if input.id.is_some() {
      return Err(anyhow!("Can not set id when create in dao: {table}"));
    }
    
    let old_models = find_by_unique(
      input.clone().into(),
      None,
      options.clone(),
    ).await?;
    
    if !old_models.is_empty() {
      let mut id: Option<DictId> = None;
      
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
  let mut sql_fields = String::with_capacity(80 * 14 + 20);
  
  sql_fields += "id";
  sql_fields += ",create_time";
  sql_fields += ",update_time";
  sql_fields += ",create_usr_id";
  sql_fields += ",create_usr_id_lbl";
  sql_fields += ",update_usr_id";
  sql_fields += ",update_usr_id_lbl";
  // 编码
  sql_fields += ",code";
  // 名称
  sql_fields += ",lbl";
  // 数据类型
  sql_fields += ",type";
  // 锁定
  sql_fields += ",is_locked";
  // 启用
  sql_fields += ",is_enabled";
  // 排序
  sql_fields += ",order_by";
  // 备注
  sql_fields += ",rem";
  // 系统字段
  sql_fields += ",is_sys";
  
  let inputs2_len = inputs2.len();
  let mut sql_values = String::with_capacity((2 * 14 + 3) * inputs2_len);
  let mut inputs2_ids = vec![];
  
  for (i, input) in inputs2
    .clone()
    .into_iter()
    .enumerate()
  {
    
    let id: DictId = get_short_uuid().into();
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
    // 编码
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
    // 数据类型
    if let Some(r#type) = input.r#type {
      sql_values += ",?";
      args.push(r#type.into());
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
    // 系统字段
    if let Some(is_sys) = input.is_sys {
      sql_values += ",?";
      args.push(is_sys.into());
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
  for input in inputs.iter() {
    refresh_lang_by_input(input, options.clone()).await?;
  }
  
  for (i, input) in inputs2
    .into_iter()
    .enumerate()
  {
    let id = inputs2_ids.get(i).unwrap().clone();
    
    // 系统字典明细
    if let Some(dict_detail) = input.dict_detail {
      for mut model in dict_detail {
        model.dict_id = id.clone().into();
        create_dict_detail(
          model,
          options.clone(),
        ).await?;
      }
    }
  }
  
  Ok(ids2)
}

// MARK: create_return
/// 创建系统字典并返回
#[allow(dead_code)]
pub async fn create_return(
  #[allow(unused_mut)]
  mut input: DictInput,
  options: Option<Options>,
) -> Result<DictModel> {
  
  let table = "base_dict";
  
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
/// 创建系统字典
#[allow(dead_code)]
pub async fn create(
  #[allow(unused_mut)]
  mut input: DictInput,
  options: Option<Options>,
) -> Result<DictId> {
  
  let table = "base_dict";
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

#[allow(unused_variables)]
async fn refresh_lang_by_input(
  input: &DictInput,
  options: Option<Options>,
) -> Result<()> {
  
  if input.id.is_none() || input.id.as_ref().unwrap().is_empty() {
    return Err(anyhow!("refresh_lang_by_input: input.id is empty"));
  }
  
  let server_i18n_enable = get_server_i18n_enable();
  
  if !server_i18n_enable {
    return Ok(());
  }
  #[derive(Serialize, Deserialize, sqlx::FromRow)]
  struct ResultTmp {
    id: String,
  }
  let lang_sql = "select id from base_dict_lang where lang_id=? and dict_id=?".to_owned();
  let mut lang_args = QueryArgs::new();
  lang_args.push(get_lang_id().await?.unwrap_or_default().to_string().into());
  lang_args.push(input.id.clone().unwrap_or_default().clone().into());
  let model = query_one::<ResultTmp>(
    lang_sql,
    lang_args.into(),
    options.clone(),
  ).await?;
  let lang_id: Option<LangId> = model.map(|item| item.id).map(|item| item.into());
  if let Some(lang_id) = lang_id {
    let mut lang_sql = "update base_dict_lang set ".to_owned();
    let mut lang_args = QueryArgs::new();
    // 名称
    if input.lbl.is_some() {
      lang_sql += "lbl=?,";
      lang_args.push(input.lbl.clone().unwrap_or_default().into());
    }
    // 备注
    if input.rem.is_some() {
      lang_sql += "rem=?,";
      lang_args.push(input.rem.clone().unwrap_or_default().into());
    }
    lang_sql.pop();
    lang_sql += " where id=?";
    lang_args.push(lang_id.into());
    execute(
      lang_sql,
      lang_args.into(),
      options.clone(),
    ).await?;
  } else {
    let mut sql_fields: Vec<&'static str> = vec![];
    let mut lang_args = QueryArgs::new();
    let id: LangId = get_short_uuid().into();
    lang_args.push(id.into());
    lang_args.push(get_lang_id().await?.unwrap_or_default().to_string().into());
    lang_args.push(input.id.clone().unwrap_or_default().clone().into());
    // 名称
    if input.lbl.is_some() {
      sql_fields.push("lbl");
      lang_args.push(input.lbl.clone().unwrap_or_default().into());
    }
    // 备注
    if input.rem.is_some() {
      sql_fields.push("rem");
      lang_args.push(input.rem.clone().unwrap_or_default().into());
    }
    let mut lang_sql = "insert into base_dict_lang(id,lang_id,dict_id".to_owned();
    let sql_fields_len = sql_fields.len();
    for sql_field in sql_fields {
      lang_sql += ",";
      lang_sql += sql_field;
    }
    lang_sql += ")values(?,?,?";
    for _ in 0..sql_fields_len {
      lang_sql += ",?";
    }
    lang_sql += ")";
    execute(
      lang_sql,
      lang_args.into(),
      options.clone(),
    ).await?;
  }
  
  Ok(())
}

// MARK: update_by_id
/// 根据 id 修改系统字典
#[allow(unused_mut)]
#[allow(unused_variables)]
pub async fn update_by_id(
  id: DictId,
  mut input: DictInput,
  options: Option<Options>,
) -> Result<DictId> {
  
  let table = "base_dict";
  let method = "update_by_id";
  
  let is_debug = get_is_debug(options.as_ref());
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  let is_creating = get_is_creating(options.as_ref());
  
  let server_i18n_enable = get_server_i18n_enable();
  
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
      "系统字典".to_owned(),
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
  
  if server_i18n_enable {
    let mut input = input.clone();
    input.id = Some(id.clone());
    refresh_lang_by_input(
      &input,
      options.clone(),
    ).await?;
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
      .collect::<Vec<DictModel>>();
    
    if !models.is_empty() {
      let unique_type = options
        .as_ref()
        .and_then(|item| item.get_unique_type())
        .unwrap_or(UniqueType::Throw);
      if unique_type == UniqueType::Throw {
        let table_comment = i18n_dao::ns(
          "系统字典".to_owned(),
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
  
  let mut sql_fields = String::with_capacity(80 * 14 + 20);
  
  let mut field_num: usize = 0;
  // 编码
  if let Some(code) = input.code {
    field_num += 1;
    sql_fields += "code=?,";
    args.push(code.into());
  }
  // 名称
  if let Some(lbl) = input.lbl {
    field_num += 1;
    if !server_i18n_enable {
      sql_fields += "lbl=?,";
      args.push(lbl.into());
    }
  }
  // 数据类型
  if let Some(r#type) = input.r#type {
    field_num += 1;
    sql_fields += "type=?,";
    args.push(r#type.into());
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
    if !server_i18n_enable {
      sql_fields += "rem=?,";
      args.push(rem.into());
    }
  }
  // 系统字段
  if let Some(is_sys) = input.is_sys {
    field_num += 1;
    sql_fields += "is_sys=?,";
    args.push(is_sys.into());
  }
  
  // 系统字典明细
  if let Some(dict_detail_input) = input.dict_detail {
    let dict_detail_models = find_all_dict_detail(
      DictDetailSearch {
        dict_id: vec![id.clone()].into(),
        is_deleted: 0.into(),
        ..Default::default()
      }.into(),
      None,
      None,
      options.clone(),
    ).await?;
    if !dict_detail_models.is_empty() && !dict_detail_input.is_empty() {
      field_num += 1;
    }
    for model in dict_detail_models.clone() {
      if dict_detail_input
        .iter()
        .filter(|item| item.id.is_some())
        .any(|item| item.id == Some(model.id.clone()))
      {
        continue;
      }
      delete_by_ids_dict_detail(
        vec![model.id],
        options.clone(),
      ).await?;
    }
    for mut input in dict_detail_input {
      if input.id.is_none() {
        input.dict_id = id.clone().into();
        create_dict_detail(
          input,
          options.clone(),
        ).await?;
        continue;
      }
      let id = input.id.clone().unwrap();
      if !dict_detail_models
        .iter()
        .any(|item| item.id == id)
      {
        revert_by_ids_dict_detail(
          vec![id.clone()],
          options.clone(),
        ).await?;
      }
      input.id = None;
      update_by_id_dict_detail(
        id.clone(),
        input,
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
  let table = "base_dict";
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
/// 根据 ids 删除系统字典
#[allow(unused_variables)]
pub async fn delete_by_ids(
  ids: Vec<DictId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_dict";
  let method = "delete_by_ids";
  
  let is_debug = get_is_debug(options.as_ref());
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  let is_creating = get_is_creating(options.as_ref());
  let server_i18n_enable = get_server_i18n_enable();
  
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
    
    if server_i18n_enable {
      let sql = "update base_dict_lang set is_deleted=1 where dict_id=?".to_owned();
      let mut args = QueryArgs::new();
      args.push(id.clone().into());
      execute(
        sql,
        args.into(),
        options.clone(),
      ).await?;
    }
  }
  
  if num > MAX_SAFE_INTEGER {
    return Err(anyhow!("num: {} > MAX_SAFE_INTEGER", num));
  }
  
  // 系统字典明细
  let dict_detail_models = find_all_dict_detail(
    DictDetailSearch {
      dict_id: ids.clone().into(),
      is_deleted: 0.into(),
      ..Default::default()
    }.into(),
    None,
    None,
    options.clone(),
  ).await?;
  
  delete_by_ids_dict_detail(
    dict_detail_models.into_iter()
      .map(|item| item.id)
      .collect::<Vec<DictDetailId>>(),
    options.clone(),
  ).await?;
  
  Ok(num)
}

// MARK: get_is_enabled_by_id
/// 根据 id 查找系统字典是否已启用
/// 记录不存在则返回 false
pub async fn get_is_enabled_by_id(
  id: DictId,
  options: Option<Options>,
) -> Result<bool> {
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let model = find_by_id(
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

// MARK: enable_by_ids
/// 根据 ids 启用或者禁用系统字典
pub async fn enable_by_ids(
  ids: Vec<DictId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_dict";
  let method = "enable_by_ids";
  
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

// MARK: get_is_locked_by_id
/// 根据 id 查找系统字典是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
pub async fn get_is_locked_by_id(
  id: DictId,
  options: Option<Options>,
) -> Result<bool> {
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let model = find_by_id(
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

// MARK: lock_by_ids
/// 根据 ids 锁定或者解锁系统字典
pub async fn lock_by_ids(
  ids: Vec<DictId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_dict";
  let method = "lock_by_ids";
  
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

// MARK: revert_by_ids
/// 根据 ids 还原系统字典
pub async fn revert_by_ids(
  ids: Vec<DictId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_dict";
  let method = "revert_by_ids";
  
  let is_debug = get_is_debug(options.as_ref());
  let server_i18n_enable = get_server_i18n_enable();
  
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
      DictSearch {
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
      let mut input: DictInput = old_model.clone().into();
      input.id = None;
      
      let models = find_by_unique(
        input.into(),
        None,
        options.clone(),
      ).await?;
      
      let models: Vec<DictModel> = models
        .into_iter()
        .filter(|item| 
          item.id != id
        )
        .collect();
      
      if !models.is_empty() {
        let table_comment = i18n_dao::ns(
          "系统字典".to_owned(),
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
    
    if server_i18n_enable {
      let sql = "update base_dict_lang set is_deleted=0 where dict_id=?".to_owned();
      let mut args = QueryArgs::new();
      args.push(id.clone().into());
      execute(
        sql,
        args.into(),
        options.clone(),
      ).await?;
    }
    
  }
  
  // 系统字典明细
  let dict_detail_models = find_all_dict_detail(
    DictDetailSearch {
      dict_id: ids.clone().into(),
      is_deleted: 1.into(),
      ..Default::default()
    }.into(),
    None,
    None,
    options.clone(),
  ).await?;
  
  revert_by_ids_dict_detail(
    dict_detail_models
      .into_iter()
      .map(|item| item.id)
      .collect::<Vec<DictDetailId>>(),
    options.clone(),
  ).await?;
  
  Ok(num)
}

// MARK: force_delete_by_ids
/// 根据 ids 彻底删除系统字典
#[allow(unused_variables)]
pub async fn force_delete_by_ids(
  ids: Vec<DictId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_dict";
  let method = "force_delete_by_ids";
  
  let is_debug = get_is_debug(options.as_ref());
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  let server_i18n_enable = get_server_i18n_enable();
  
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
      DictSearch {
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
    
    if server_i18n_enable {
      let sql = "delete from base_dict_lang where dict_id=?".to_owned();
      let mut args = QueryArgs::new();
      args.push(id.clone().into());
      execute(
        sql,
        args.into(),
        options.clone(),
      ).await?;
    }
  }
  
  // 系统字典明细
  let dict_detail_models = find_all_dict_detail(
    DictDetailSearch {
      dict_id: ids.clone().into(),
      is_deleted: 0.into(),
      ..Default::default()
    }.into(),
    None,
    None,
    options.clone(),
  ).await?;
  
  force_delete_by_ids_dict_detail(
    dict_detail_models.into_iter()
      .map(|item| item.id)
      .collect::<Vec<DictDetailId>>(),
    options.clone(),
  ).await?;
  
  Ok(num)
}

// MARK: find_last_order_by
/// 查找 系统字典 order_by 字段的最大值
pub async fn find_last_order_by(
  options: Option<Options>,
) -> Result<u32> {
  
  let table = "base_dict";
  let method = "find_last_order_by";
  
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

// MARK: validate_is_enabled
/// 校验系统字典是否启用
#[allow(dead_code)]
pub async fn validate_is_enabled(
  model: &DictModel,
) -> Result<()> {
  if model.is_enabled == 0 {
    let table_comment = i18n_dao::ns(
      "系统字典".to_owned(),
      None,
    ).await?;
    let msg1 = i18n_dao::ns(
      "已禁用".to_owned(),
      None,
    ).await?;
    let err_msg = table_comment + msg1.as_str();
    return Err(anyhow!(err_msg));
  }
  Ok(())
}

// MARK: validate_option
/// 校验系统字典是否存在
#[allow(dead_code)]
pub async fn validate_option<T>(
  model: Option<T>,
) -> Result<T> {
  if model.is_none() {
    let table_comment = i18n_dao::ns(
      "系统字典".to_owned(),
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
