
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


use crate::base::dyn_page::dyn_page_model::DynPageSearch;
use crate::base::dyn_page::dyn_page_dao::{
  find_one_dyn_page,
};

use crate::base::dyn_page_val::dyn_page_val_model::{
  DynPageValInput,
  DynPageValSearch,
};
use crate::base::dyn_page_val::dyn_page_val_dao::{
  find_all_dyn_page_val,
  update_by_id_dyn_page_val,
  create_dyn_page_val,
};

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

use super::dyn_page_data_model::*;

use crate::base::tenant::tenant_model::TenantId;
use crate::base::usr::usr_model::UsrId;

use crate::base::usr::usr_dao::find_by_id_usr;

use crate::common::gql::model::JSONObject;

#[allow(unused_variables)]
async fn get_where_query(
  args: &mut QueryArgs,
  search: Option<&DynPageDataSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let is_deleted = search
    .and_then(|item| item.is_deleted)
    .unwrap_or(0);
  
  let mut where_query = String::with_capacity(80 * 8 * 2);
  
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
    let ids: Option<Vec<DynPageDataId>> = match search {
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
  // 关联页面路由
  {
    let ref_code = match search {
      Some(item) => item.ref_code.clone(),
      None => None,
    };
    if let Some(ref_code) = ref_code {
      where_query.push_str(" and t.ref_code=?");
      args.push(ref_code.into());
    }
    let ref_code_like = match search {
      Some(item) => item.ref_code_like.clone(),
      None => None,
    };
    if let Some(ref_code_like) = ref_code_like && !ref_code_like.is_empty() {
      where_query.push_str(" and t.ref_code like ?");
      args.push(format!("%{}%", sql_like(&ref_code_like)).into());
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
  search: Option<&DynPageDataSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let from_query = r#"base_dyn_page_data t"#.to_owned();
  Ok(from_query)
}

// MARK: set_dyn_page_data_dyn_page_data
/// 设置动态页面数据
pub async fn set_dyn_page_data_dyn_page_data(
  models: &mut [DynPageDataModel],
  options: Option<Options>,
) -> Result<()> {
  
  let page_path = get_page_path_dyn_page_data();
  
  let dyn_page_model = find_one_dyn_page(
    Some(DynPageSearch {
      code: Some(page_path.to_string()),
      is_enabled: Some(vec![1]),
      ..Default::default()
    }),
    None,
    options.clone(),
  ).await?;
  
  let dyn_page_model = match dyn_page_model {
    Some(x) => x,
    None => return Ok(()),
  };
  
  let dyn_page_field_models = dyn_page_model.dyn_page_field;
  
  if dyn_page_field_models.is_empty() {
    return Ok(());
  }
  
  let ids: Vec<DynPageDataId> = models
    .iter()
    .map(|item| item.id.clone())
    .collect();
  
  let dyn_page_val_models = find_all_dyn_page_val(
    Some(DynPageValSearch {
      ref_code: Some(page_path.to_string()),
      ref_ids: Some(
        ids
          .into_iter()
          .map(|item| item.to_string())
          .collect::<Vec<String>>()
      ),
      ..Default::default()
    }),
    None,
    None,
    options.clone(),
  ).await?;
  
  for model in models.iter_mut() {
    
    model.dyn_page_data = JSONObject::default();
    
    for field in dyn_page_field_models.iter() {
      
      let val_model_opt = dyn_page_val_models.iter()
        .find(|item| item.ref_id == model.id.as_str() && item.code == field.code);
      
      let mut val: Option<serde_json::Value> = None;
      if let Some(val_model) = val_model_opt {
        val = Some(serde_json::json!(val_model.lbl));
      }
      if [
        "CustomCheckbox",
        "CustomInputNumber",
        "CustomSwitch",
      ].contains(&field.r#type.as_str()) {
        if let Some(v) = &val {
          if !v.is_null() {
            val = Some(serde_json::json!(v.as_str().unwrap_or_default().parse::<i64>().unwrap_or_default()));
          }
        }
      }
      if val.is_none() || val.as_ref().unwrap().is_null() {
        val = Some(serde_json::json!(""));
      }
      
      model
        .dyn_page_data.0
        .insert(field.code.clone(), val.unwrap_or_default());
    }
  }
  
  Ok(())
}

// MARK: find_all_dyn_page_data
/// 根据搜索条件和分页查找动态页面数据列表
#[allow(unused_mut)]
pub async fn find_all_dyn_page_data(
  search: Option<DynPageDataSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<DynPageDataModel>> {
  
  let table = get_table_name_dyn_page_data();
  let method = "find_all_dyn_page_data";
  
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
  
  if !sort.iter().any(|item| item.prop == "create_time") {
    sort.push(SortInput {
      prop: "create_time".into(),
      order: SortOrderEnum::Desc,
    });
  }
  
  let order_by_query = get_order_by_query(Some(sort));
  let page_query = get_page_query(page);
  
  let sql = format!(r#"select f.* from (select t.*
  from {from_query} where {where_query} group by t.id{order_by_query}) f {page_query}"#);
  
  let args = args.into();
  
  let options = Options::from(options);
  
  let mut res: Vec<DynPageDataModel> = query(
    sql,
    args,
    Some(options.clone()),
  ).await?;
  
  set_dyn_page_data_dyn_page_data(
    &mut res,
    Some(options.clone()),
  ).await?;
  
  
  #[allow(unused_variables)]
  for model in &mut res {
    
  }
  
  Ok(res)
}

// MARK: find_count_dyn_page_data
/// 根据条件查找动态页面数据总数
pub async fn find_count_dyn_page_data(
  search: Option<DynPageDataSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_dyn_page_data();
  let method = "find_count_dyn_page_data";
  
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

// MARK: get_field_comments_dyn_page_data
/// 获取动态页面数据字段注释
#[allow(unused_mut)]
pub async fn get_field_comments_dyn_page_data(
  options: Option<Options>,
) -> Result<DynPageDataFieldComment> {
  
  let page_path = get_page_path_dyn_page_data();
  
  let mut field_comments = DynPageDataFieldComment {
    id: "ID".into(),
    ref_code: "关联页面路由".into(),
    create_usr_id: "创建人".into(),
    create_usr_id_lbl: "创建人".into(),
    create_time: "创建时间".into(),
    create_time_lbl: "创建时间".into(),
    update_usr_id: "更新人".into(),
    update_usr_id_lbl: "更新人".into(),
    update_time: "更新时间".into(),
    update_time_lbl: "更新时间".into(),
    dyn_page_data: JSONObject::default(),
  };
  
  let dyn_page_model = find_one_dyn_page(
    Some(DynPageSearch {
      code: Some(page_path.to_string()),
      is_enabled: Some(vec![1]),
      ..Default::default()
    }),
    None,
    options.clone(),
  ).await?;
  
  if let Some(dyn_page_model) = dyn_page_model {
    
    let dyn_page_field_models = dyn_page_model.dyn_page_field;
    
    for dyn_page_field_model in dyn_page_field_models {
      let field_code = &dyn_page_field_model.code;
      let field_lbl = &dyn_page_field_model.lbl;
      
      field_comments
        .dyn_page_data
        .0
        .insert(field_code.clone(), serde_json::json!(field_lbl));
    }
    
  }
  Ok(field_comments)
}

// MARK: find_one_ok_dyn_page_data
/// 根据条件查找第一个动态页面数据, 如果不存在则抛错
#[allow(dead_code)]
pub async fn find_one_ok_dyn_page_data(
  search: Option<DynPageDataSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<DynPageDataModel> {
  
  let table = get_table_name_dyn_page_data();
  let method = "find_one_ok_dyn_page_data";
  
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
  
  let dyn_page_data_model = find_one_dyn_page_data(
    search,
    sort,
    options,
  ).await?;
  
  let Some(dyn_page_data_model) = dyn_page_data_model else {
    let err_msg = "此 动态页面数据 已被删除";
    return Err(eyre!(err_msg));
  };
  
  Ok(dyn_page_data_model)
}

// MARK: find_one_dyn_page_data
/// 根据条件查找第一个动态页面数据
#[allow(dead_code)]
pub async fn find_one_dyn_page_data(
  search: Option<DynPageDataSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<DynPageDataModel>> {
  
  let table = get_table_name_dyn_page_data();
  let method = "find_one_dyn_page_data";
  
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
  
  let page = PageInput {
    pg_offset: 0.into(),
    pg_size: 1.into(),
  }.into();
  
  let res = find_all_dyn_page_data(
    search,
    page,
    sort,
    options,
  ).await?;
  
  let model: Option<DynPageDataModel> = res.into_iter().next();
  
  Ok(model)
}

// MARK: find_by_id_ok_dyn_page_data
/// 根据 id 查找动态页面数据, 如果不存在则抛错
#[allow(dead_code)]
pub async fn find_by_id_ok_dyn_page_data(
  id: DynPageDataId,
  options: Option<Options>,
) -> Result<DynPageDataModel> {
  
  let table = get_table_name_dyn_page_data();
  let method = "find_by_id_ok_dyn_page_data";
  
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
  
  let dyn_page_data_model = find_by_id_dyn_page_data(
    id,
    options,
  ).await?;
  
  let Some(dyn_page_data_model) = dyn_page_data_model else {
    let err_msg = "此 动态页面数据 已被删除";
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
  
  Ok(dyn_page_data_model)
}

// MARK: find_by_id_dyn_page_data
/// 根据 id 查找动态页面数据
pub async fn find_by_id_dyn_page_data(
  id: DynPageDataId,
  options: Option<Options>,
) -> Result<Option<DynPageDataModel>> {
  
  let table = get_table_name_dyn_page_data();
  let method = "find_by_id_dyn_page_data";
  
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
  
  let search = DynPageDataSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let dyn_page_data_model = find_one_dyn_page_data(
    search,
    None,
    options,
  ).await?;
  
  Ok(dyn_page_data_model)
}

// MARK: find_by_ids_ok_dyn_page_data
/// 根据 ids 查找动态页面数据, 出现查询不到的 id 则报错
#[allow(dead_code)]
pub async fn find_by_ids_ok_dyn_page_data(
  ids: Vec<DynPageDataId>,
  options: Option<Options>,
) -> Result<Vec<DynPageDataModel>> {
  
  let table = get_table_name_dyn_page_data();
  let method = "find_by_ids_ok_dyn_page_data";
  
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
  
  let dyn_page_data_models = find_by_ids_dyn_page_data(
    ids.clone(),
    options,
  ).await?;
  
  if dyn_page_data_models.len() != len {
    let err_msg = "此 动态页面数据 已被删除";
    return Err(eyre!(err_msg));
  }
  
  let dyn_page_data_models = ids
    .into_iter()
    .map(|id| {
      let model = dyn_page_data_models
        .iter()
        .find(|item| item.id == id);
      if let Some(model) = model {
        return Ok(model.clone());
      }
      let err_msg = "此 动态页面数据 已经被删除";
      Err(eyre!(err_msg))
    })
    .collect::<Result<Vec<DynPageDataModel>>>()?;
  
  Ok(dyn_page_data_models)
}

// MARK: find_by_ids_dyn_page_data
/// 根据 ids 查找动态页面数据
#[allow(dead_code)]
pub async fn find_by_ids_dyn_page_data(
  ids: Vec<DynPageDataId>,
  options: Option<Options>,
) -> Result<Vec<DynPageDataModel>> {
  
  let table = get_table_name_dyn_page_data();
  let method = "find_by_ids_dyn_page_data";
  
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
  
  let search = DynPageDataSearch {
    ids: Some(ids.clone()),
    ..Default::default()
  }.into();
  
  let dyn_page_data_models = find_all_dyn_page_data(
    search,
    None,
    None,
    options,
  ).await?;
  
  let dyn_page_data_models = ids
    .into_iter()
    .filter_map(|id| {
      dyn_page_data_models
        .iter()
        .find(|item| item.id == id)
        .cloned()
    })
    .collect::<Vec<DynPageDataModel>>();
  
  Ok(dyn_page_data_models)
}

// MARK: exists_dyn_page_data
/// 根据搜索条件判断动态页面数据是否存在
#[allow(dead_code)]
pub async fn exists_dyn_page_data(
  search: Option<DynPageDataSearch>,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = get_table_name_dyn_page_data();
  let method = "exists_dyn_page_data";
  
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
  
  let res: Option<(bool,)> = query_one(
    sql,
    args,
    options,
  ).await?;
  
  Ok(res
    .map(|item| item.0)
    .unwrap_or_default())
}

// MARK: exists_by_id_dyn_page_data
/// 根据 id 判断动态页面数据是否存在
#[allow(dead_code)]
pub async fn exists_by_id_dyn_page_data(
  id: DynPageDataId,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = get_table_name_dyn_page_data();
  let method = "exists_by_id_dyn_page_data";
  
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
  
  let search = DynPageDataSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let exists = exists_dyn_page_data(
    search,
    options,
  ).await?;
  
  Ok(exists)
}

// MARK: find_by_unique_dyn_page_data
/// 通过唯一约束获得数据列表
#[allow(unused_variables)]
pub async fn find_by_unique_dyn_page_data(
  search: DynPageDataSearch,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<DynPageDataModel>> {
  
  let table = get_table_name_dyn_page_data();
  let method = "find_by_unique_dyn_page_data";
  
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
    let model = find_by_id_dyn_page_data(
      id,
      options.clone(),
    ).await?;
    return Ok(model.map_or_else(Vec::new, |m| vec![m]));
  }
  
  Ok(vec![])
}

/// 根据唯一约束对比对象是否相等
#[allow(dead_code)]
pub fn equals_by_unique(
  input: &DynPageDataInput,
  model: &DynPageDataModel,
) -> bool {
  if input.id.as_ref().is_some() {
    return input.id.as_ref().unwrap() == &model.id;
  }
  false
}

// MARK: check_by_unique_dyn_page_data
/// 通过唯一约束检查数据是否已经存在
#[allow(unused_variables)]
pub async fn check_by_unique_dyn_page_data(
  input: DynPageDataInput,
  model: DynPageDataModel,
  options: Option<Options>,
) -> Result<Option<DynPageDataId>> {
  
  let table = get_table_name_dyn_page_data();
  let method = "check_by_unique_dyn_page_data";
  
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
    let id = update_by_id_dyn_page_data(
      model.id,
      input,
      options,
    ).await?;
    return Ok(id.into());
  }
  if unique_type == UniqueType::Throw {
    let err_msg = "动态页面数据 重复";
    return Err(eyre!(err_msg));
  }
  Ok(None)
}

// MARK: set_id_by_lbl_dyn_page_data
/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(unused_variables, dead_code)]
pub async fn set_id_by_lbl_dyn_page_data(
  input: DynPageDataInput,
) -> Result<DynPageDataInput> {
  
  #[allow(unused_mut)]
  let mut input = input;
  
  Ok(input)
}

// MARK: creates_return_dyn_page_data
/// 批量创建动态页面数据并返回
#[allow(dead_code)]
pub async fn creates_return_dyn_page_data(
  inputs: Vec<DynPageDataInput>,
  options: Option<Options>,
) -> Result<Vec<DynPageDataModel>> {
  
  let table = get_table_name_dyn_page_data();
  let method = "creates_return_dyn_page_data";
  
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
  
  let models_dyn_page_data = find_by_ids_dyn_page_data(
    ids,
    options,
  ).await?;
  
  Ok(models_dyn_page_data)
}

// MARK: creates_dyn_page_data
/// 批量创建动态页面数据
pub async fn creates_dyn_page_data(
  inputs: Vec<DynPageDataInput>,
  options: Option<Options>,
) -> Result<Vec<DynPageDataId>> {
  
  let table = get_table_name_dyn_page_data();
  let method = "creates_dyn_page_data";
  
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

/// 批量创建动态页面数据
#[allow(unused_variables, clippy::redundant_locals)]
async fn _creates(
  inputs: Vec<DynPageDataInput>,
  options: Option<Options>,
) -> Result<Vec<DynPageDataId>> {
  
  let table = get_table_name_dyn_page_data();
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  
  let unique_type = options.as_ref()
    .and_then(|item|
      item.get_unique_type()
    )
    .unwrap_or_default();
  
  let mut ids2: Vec<DynPageDataId> = vec![];
  let mut inputs2: Vec<DynPageDataInput> = vec![];
  
  for input in inputs {
  
    if input.id.is_some() {
      return Err(eyre!("Can not set id when create in dao: {table}"));
    }
    
    let old_models = find_by_unique_dyn_page_data(
      input.clone().into(),
      None,
      options.clone(),
    ).await?;
    
    if !old_models.is_empty() {
      let mut id: Option<DynPageDataId> = None;
      
      for old_model in old_models {
        let options = Options::from(options.clone())
          .set_unique_type(unique_type);
        
        id = check_by_unique_dyn_page_data(
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
  
  // 重新获取动态字段
  let page_path = get_page_path_dyn_page_data();
  
  let dyn_page_model = find_one_dyn_page(
    Some(DynPageSearch {
      code: Some(page_path.to_string()),
      is_enabled: Some(vec![1]),
      ..Default::default()
    }),
    None,
    options.clone(),
  ).await?;
  
  if let Some(dyn_page_model) = dyn_page_model {
    
    let dyn_page_field_models = dyn_page_model.dyn_page_field;
    
    let dyn_page_val_models = find_all_dyn_page_val(
      Some(DynPageValSearch {
        ref_code: Some(page_path.to_string()),
        ref_ids: Some(ids2.iter().map(|id| id.to_string()).collect()),
        ..Default::default()
      }),
      None,
      None,
      options.clone(),
    ).await?;
    
    for (i, id) in ids2.iter().enumerate() {
      let input = &mut inputs2[i];
      let mut dyn_page_data: JSONObject = JSONObject::default();
      
      for dyn_page_field_model in &dyn_page_field_models {
        let field_code = &dyn_page_field_model.code;
        let field_type = &dyn_page_field_model.r#type;
        let dyn_page_val_model_opt = dyn_page_val_models
          .iter()
          .find(|m| m.code == *field_code && m.ref_id == id.as_str());
        if let Some(dyn_page_val_model) = dyn_page_val_model_opt {
          let lbl = &dyn_page_val_model.lbl;
          if [
            "CustomCheckbox",
            "CustomInputNumber",
            "CustomSwitch",
          ].contains(&field_type.as_str()) {
            if let Ok(num) = lbl.parse::<i32>() {
              dyn_page_data.insert(field_code.clone(), serde_json::Value::Number(num.into()));
            }
          } else {
            dyn_page_data.insert(field_code.clone(), serde_json::Value::String(lbl.clone()));
          }
        }
      }
      
      input.dyn_page_data = Some(dyn_page_data);
    }
    
  }
    
  let mut args = QueryArgs::new();
  let mut sql_fields = String::with_capacity(80 * 8 + 20);
  
  sql_fields += "id";
  sql_fields += ",create_time";
  sql_fields += ",update_time";
  sql_fields += ",create_usr_id";
  sql_fields += ",create_usr_id_lbl";
  sql_fields += ",update_usr_id";
  sql_fields += ",update_usr_id_lbl";
  sql_fields += ",tenant_id";
  // 关联页面路由
  sql_fields += ",ref_code";
  
  let inputs2_len = inputs2.len();
  let mut sql_values = String::with_capacity((2 * 8 + 3) * inputs2_len);
  let mut inputs2_ids = vec![];
  
  for (i, input) in inputs2
    .clone()
    .into_iter()
    .enumerate()
  {
    
    let id: DynPageDataId = get_short_uuid().into();
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
    // 关联页面路由
    if let Some(ref_code) = input.ref_code {
      sql_values += ",?";
      args.push(ref_code.into());
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

// MARK: create_return_dyn_page_data
/// 创建动态页面数据并返回
#[allow(dead_code)]
pub async fn create_return_dyn_page_data(
  #[allow(unused_mut)]
  mut input: DynPageDataInput,
  options: Option<Options>,
) -> Result<DynPageDataModel> {
  
  let id = create_dyn_page_data(
    input.clone(),
    options.clone(),
  ).await?;
  
  let model_dyn_page_data = find_by_id_dyn_page_data(
    id,
    options,
  ).await?;
  
  if model_dyn_page_data.is_none() {
    let err_msg = "create_return_dyn_page_data: model_dyn_page_data.is_none()";
    return Err(eyre!(
      ServiceException {
        message: err_msg.to_owned(),
        trace: true,
        ..Default::default()
      },
    ));
  }
  let model_dyn_page_data = model_dyn_page_data.unwrap();
  
  Ok(model_dyn_page_data)
}

// MARK: create_dyn_page_data
/// 创建动态页面数据
#[allow(dead_code)]
pub async fn create_dyn_page_data(
  #[allow(unused_mut)]
  mut input: DynPageDataInput,
  options: Option<Options>,
) -> Result<DynPageDataId> {
  
  let table = get_table_name_dyn_page_data();
  let method = "create_dyn_page_data";
  
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

// MARK: update_tenant_by_id_dyn_page_data
/// 动态页面数据根据id修改租户id
pub async fn update_tenant_by_id_dyn_page_data(
  id: DynPageDataId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  let table = get_table_name_dyn_page_data();
  let method = "update_tenant_by_id_dyn_page_data";
  
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

// MARK: update_by_id_dyn_page_data
/// 根据 id 修改动态页面数据
#[allow(unused_mut)]
#[allow(unused_variables)]
pub async fn update_by_id_dyn_page_data(
  id: DynPageDataId,
  mut input: DynPageDataInput,
  options: Option<Options>,
) -> Result<DynPageDataId> {
  
  let table = get_table_name_dyn_page_data();
  let method = "update_by_id_dyn_page_data";
  
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
  
  let old_model = find_by_id_dyn_page_data(
    id,
    options.clone(),
  ).await?;
  
  if old_model.is_none() {
    let err_msg = "编辑失败, 此 动态页面数据 已被删除";
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
    
    let models = find_by_unique_dyn_page_data(
      input.into(),
      None,
      options.clone(),
    ).await?;
    
    let models = models.into_iter()
      .filter(|item| 
        item.id != id
      )
      .collect::<Vec<DynPageDataModel>>();
    
    if !models.is_empty() {
      let unique_type = options
        .as_ref()
        .and_then(|item| item.get_unique_type())
        .unwrap_or(UniqueType::Throw);
      if unique_type == UniqueType::Throw {
        let err_msg = "动态页面数据 重复";
        return Err(eyre!(err_msg));
      } else if unique_type == UniqueType::Ignore {
        return Ok(id);
      }
    }
  }
  
  let mut args = QueryArgs::new();
  
  let mut sql_fields = String::with_capacity(80 * 8 + 20);
  
  let mut field_num: usize = 0;
  
  if let Some(tenant_id) = input.tenant_id {
    field_num += 1;
    sql_fields += "tenant_id=?,";
    args.push(tenant_id.into());
  }
  // 关联页面路由
  if let Some(ref_code) = input.ref_code {
    field_num += 1;
    sql_fields += "ref_code=?,";
    args.push(ref_code.into());
  }
  
  // 更新动态字段
  let dyn_page_data = input.dyn_page_data.clone();
  if let Some(dyn_page_data) = dyn_page_data {
    
    let page_path = get_page_path_dyn_page_data();
    
    let dyn_page_model = find_one_dyn_page(
      Some(DynPageSearch {
        code: Some(page_path.to_string()),
        is_enabled: Some(vec![1]),
        ..Default::default()
      }),
      None,
      options.clone(),
    ).await?;
    
    if let Some(dyn_page_model) = dyn_page_model {
      
      let dyn_page_field_models = dyn_page_model.dyn_page_field;
      
      let dyn_page_val_models = find_all_dyn_page_val(
        Some(DynPageValSearch {
          ref_code: Some(page_path.to_string()),
          ref_ids: Some(vec![ id.to_string() ]),
          ..Default::default()
        }),
        None,
        None,
        options.clone(),
      ).await?;
      
      for dyn_page_field_model in dyn_page_field_models {
        
        let field_code = dyn_page_field_model.code;
        let field_type = dyn_page_field_model.r#type;
        let new_value0 = dyn_page_data.0.get(&field_code);
        let mut new_value: Option<serde_json::Value> = None;
        if [
          "CustomCheckbox",
          "CustomInputNumber",
          "CustomSwitch",
        ].contains(&field_type.as_str()) {
          if let Some(new_value0) = new_value0 && !new_value0.is_null() {
            new_value = Some(serde_json::json!(new_value0.as_str().unwrap_or_default().parse::<i64>().unwrap_or_default()));
          }
        }
        if new_value.is_none() {
          if let Some(new_value0) = new_value0 && !new_value0.is_null() {
            new_value = Some(new_value0.to_owned());
          } else {
            new_value = Some(serde_json::json!(""));
          }
        }
        let new_value = new_value.unwrap_or_default().to_string();
        
        let old_value_model = dyn_page_val_models.iter()
          .find(|m| m.code == field_code);
        
        if let Some(old_value_model) = old_value_model {
          let old_value = old_value_model.lbl.as_str();
          if new_value.as_str() != old_value {
            update_by_id_dyn_page_val(
              old_value_model.id,
              DynPageValInput {
                lbl: Some(new_value.clone()),
                ..Default::default()
              },
              options.clone(),
            ).await?;
            field_num += 1;
          }
        } else {
          create_dyn_page_val(
            DynPageValInput {
              ref_code: Some(page_path.to_string()),
              ref_id: Some(id.to_string()),
              code: Some(field_code),
              lbl: Some(new_value.clone()),
              ..Default::default()
            },
            options.clone(),
          ).await?;
          field_num += 1;
        }
        
      }
      
    }
    
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
    
    let options = Some(options);
    
    execute(
      sql,
      args,
      options.clone(),
    ).await?;
    
  }
  
  Ok(id)
}

/// 获取需要清空缓存的表名
#[allow(dead_code)]
fn get_cache_tables() -> Vec<&'static str> {
  let table = get_table_name_dyn_page_data();
  vec![
    table,
  ]
}

// MARK: del_cache_dyn_page_data
/// 清空缓存
#[allow(dead_code)]
pub async fn del_cache_dyn_page_data() -> Result<()> {
  let cache_key1s = get_cache_tables();
  del_caches(
    cache_key1s.as_slice(),
  ).await?;
  Ok(())
}

// MARK: delete_by_ids_dyn_page_data
/// 根据 ids 删除动态页面数据
#[allow(unused_variables)]
pub async fn delete_by_ids_dyn_page_data(
  ids: Vec<DynPageDataId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_dyn_page_data();
  let method = "delete_by_ids_dyn_page_data";
  
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
    
    let old_model = find_by_id_dyn_page_data(
      id,
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
    
    let options = Some(options);
    
    num += execute(
      sql,
      args,
      options.clone(),
    ).await?;
    
    // 删除动态页面值
    {
      let page_path = get_page_path_dyn_page_data();
      let mut args = QueryArgs::new();
      args.push(page_path.into());
      args.push(id.into());
      let sql = "update base_dyn_page_val set is_deleted=1 where ref_code=? and ref_id=? and is_deleted=0".to_owned();
      execute(
        sql,
        args.into(),
        options.clone(),
      ).await?;
    }
  }
  
  if num > MAX_SAFE_INTEGER {
    return Err(eyre!("num: {} > MAX_SAFE_INTEGER", num));
  }
  
  Ok(num)
}

// MARK: revert_by_ids_dyn_page_data
/// 根据 ids 还原动态页面数据
pub async fn revert_by_ids_dyn_page_data(
  ids: Vec<DynPageDataId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_dyn_page_data();
  let method = "revert_by_ids_dyn_page_data";
  
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
  let options = Some(options);
  
  let mut num = 0;
  for id in ids.clone() {
    let mut args = QueryArgs::new();
    
    let sql = format!("update {table} set is_deleted=0 where id=? limit 1");
    
    args.push(id.into());
    
    let args: Vec<_> = args.into();
    
    let mut old_model = find_one_dyn_page_data(
      DynPageDataSearch {
        id: Some(id),
        is_deleted: Some(1),
        ..Default::default()
      }.into(),
      None,
      options.clone(),
    ).await?;
    
    if old_model.is_none() {
      old_model = find_by_id_dyn_page_data(
        id,
        options.clone(),
      ).await?;
    }
    
    if old_model.is_none() {
      continue;
    }
    let old_model = old_model.unwrap();
    
    {
      let mut input: DynPageDataInput = old_model.clone().into();
      input.id = None;
      
      let models = find_by_unique_dyn_page_data(
        input.into(),
        None,
        options.clone(),
      ).await?;
      
      let models: Vec<DynPageDataModel> = models
        .into_iter()
        .filter(|item| 
          item.id != id
        )
        .collect();
      
      if !models.is_empty() {
        let err_msg = "动态页面数据 重复";
        return Err(eyre!(err_msg));
      }
    }
    
    num += execute(
      sql,
      args,
      options.clone(),
    ).await?;
    // 还原动态页面值
    {
      let page_path = get_page_path_dyn_page_data();
      let mut args = QueryArgs::new();
      args.push(page_path.into());
      args.push(id.into());
      let sql = "update base_dyn_page_val set is_deleted=0 where ref_code=? and ref_id=? and is_deleted=1".to_owned();
      execute(
        sql,
        args.into(),
        options.clone(),
      ).await?;
    }
    
  }
  
  Ok(num)
}

// MARK: force_delete_by_ids_dyn_page_data
/// 根据 ids 彻底删除动态页面数据
#[allow(unused_variables)]
pub async fn force_delete_by_ids_dyn_page_data(
  ids: Vec<DynPageDataId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_dyn_page_data();
  let method = "force_delete_by_ids_dyn_page_data";
  
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
    
    let old_model = find_all_dyn_page_data(
      DynPageDataSearch {
        id: id.into(),
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
    
    args.push(id.into());
    
    let args: Vec<_> = args.into();
    
    let options = Options::from(options.clone());
    
    let options = Some(options);
    
    num += execute(
      sql,
      args,
      options.clone(),
    ).await?;
    // 彻底删除动态页面值
    {
      let page_path = get_page_path_dyn_page_data();
      let mut args = QueryArgs::new();
      args.push(page_path.into());
      args.push(id.into());
      let sql = "delete from base_dyn_page_val where ref_code=? and ref_id=?".to_owned();
      execute(
        sql,
        args.into(),
        options.clone(),
      ).await?;
    }
  }
  
  Ok(num)
}

// MARK: validate_option_dyn_page_data
/// 校验动态页面数据是否存在
#[allow(dead_code)]
pub async fn validate_option_dyn_page_data(
  model: Option<DynPageDataModel>,
) -> Result<DynPageDataModel> {
  if model.is_none() {
    let err_msg = "动态页面数据不存在";
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
  }
  let model = model.unwrap();
  Ok(model)
}
