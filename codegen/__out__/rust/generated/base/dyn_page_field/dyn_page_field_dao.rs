
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

use super::dyn_page_field_model::*;

use crate::base::tenant::tenant_model::TenantId;
use crate::base::dyn_page::dyn_page_model::DynPageId;
use crate::base::usr::usr_model::UsrId;

use crate::base::usr::usr_dao::find_by_id_usr;

#[allow(unused_variables)]
async fn get_where_query(
  args: &mut QueryArgs,
  search: Option<&DynPageFieldSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let is_deleted = search
    .and_then(|item| item.is_deleted)
    .unwrap_or(0);
  
  let mut where_query = String::with_capacity(80 * 20 * 2);
  
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
    let ids: Option<Vec<DynPageFieldId>> = match search {
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
  // 动态页面
  {
    let dyn_page_id: Option<Vec<DynPageId>> = match search {
      Some(item) => item.dyn_page_id.clone(),
      None => None,
    };
    if let Some(dyn_page_id) = dyn_page_id {
      let arg = {
        if dyn_page_id.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(dyn_page_id.len());
          for item in dyn_page_id {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.dyn_page_id in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let dyn_page_id_is_null: bool = match search {
      Some(item) => item.dyn_page_id_is_null.unwrap_or(false),
      None => false,
    };
    if dyn_page_id_is_null {
      where_query.push_str(" and t.dyn_page_id is null");
    }
  }
  {
    let dyn_page_id_lbl: Option<Vec<String>> = match search {
      Some(item) => item.dyn_page_id_lbl.clone(),
      None => None,
    };
    if let Some(dyn_page_id_lbl) = dyn_page_id_lbl {
      let arg = {
        if dyn_page_id_lbl.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(dyn_page_id_lbl.len());
          for item in dyn_page_id_lbl {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and dyn_page_id_lbl.lbl in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let dyn_page_id_lbl_like = match search {
      Some(item) => item.dyn_page_id_lbl_like.clone(),
      None => None,
    };
    if let Some(dyn_page_id_lbl_like) = dyn_page_id_lbl_like {
      where_query.push_str(" and dyn_page_id_lbl.lbl like ?");
      args.push(format!("%{}%", sql_like(&dyn_page_id_lbl_like)).into());
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
  // 类型
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
    if let Some(type_like) = type_like && !type_like.is_empty() {
      where_query.push_str(" and t.type like ?");
      args.push(format!("%{}%", sql_like(&type_like)).into());
    }
  }
  // 属性
  {
    let attrs = match search {
      Some(item) => item.attrs.clone(),
      None => None,
    };
    if let Some(attrs) = attrs {
      where_query.push_str(" and t.attrs=?");
      args.push(attrs.into());
    }
    let attrs_like = match search {
      Some(item) => item.attrs_like.clone(),
      None => None,
    };
    if let Some(attrs_like) = attrs_like && !attrs_like.is_empty() {
      where_query.push_str(" and t.attrs like ?");
      args.push(format!("%{}%", sql_like(&attrs_like)).into());
    }
  }
  // 计算公式
  {
    let formula = match search {
      Some(item) => item.formula.clone(),
      None => None,
    };
    if let Some(formula) = formula {
      where_query.push_str(" and t.formula=?");
      args.push(formula.into());
    }
    let formula_like = match search {
      Some(item) => item.formula_like.clone(),
      None => None,
    };
    if let Some(formula_like) = formula_like && !formula_like.is_empty() {
      where_query.push_str(" and t.formula like ?");
      args.push(format!("%{}%", sql_like(&formula_like)).into());
    }
  }
  // 必填
  {
    let is_required: Option<Vec<u8>> = match search {
      Some(item) => item.is_required.clone(),
      None => None,
    };
    if let Some(is_required) = is_required {
      let arg = {
        if is_required.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(is_required.len());
          for item in is_required {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.is_required in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  // 查询条件
  {
    let is_search: Option<Vec<u8>> = match search {
      Some(item) => item.is_search.clone(),
      None => None,
    };
    if let Some(is_search) = is_search {
      let arg = {
        if is_search.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(is_search.len());
          for item in is_search {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.is_search in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  // 宽度
  {
    let mut width = match search {
      Some(item) => item.width.unwrap_or_default(),
      None => Default::default(),
    };
    let width_gt = width[0].take();
    let width_lt = width[1].take();
    if let Some(width_gt) = width_gt {
      where_query.push_str(" and t.width >= ?");
      args.push(width_gt.into());
    }
    if let Some(width_lt) = width_lt {
      where_query.push_str(" and t.width <= ?");
      args.push(width_lt.into());
    }
  }
  // 对齐方式
  {
    let align: Option<Vec<DynPageFieldAlign>> = match search {
      Some(item) => item.align.clone(),
      None => None,
    };
    if let Some(align) = align {
      let arg = {
        if align.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(align.len());
          for item in align {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.align in (");
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
  search: Option<&DynPageFieldSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let from_query = r#"base_dyn_page_field t
  left join base_dyn_page dyn_page_id_lbl on dyn_page_id_lbl.id=t.dyn_page_id"#.to_owned();
  Ok(from_query)
}

// MARK: find_all_dyn_page_field
/// 根据搜索条件和分页查找动态页面字段列表
#[allow(unused_mut)]
pub async fn find_all_dyn_page_field(
  search: Option<DynPageFieldSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<DynPageFieldModel>> {
  
  let table = get_table_name_dyn_page_field();
  let method = "find_all_dyn_page_field";
  
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
  // 动态页面
  if let Some(search) = &search && search.dyn_page_id.is_some() {
    let len = search.dyn_page_id.as_ref().unwrap().len();
    if len == 0 {
      return Ok(vec![]);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.dyn_page_id.length > {ids_limit}"));
    }
  }
  // 必填
  if let Some(search) = &search && search.is_required.is_some() {
    let len = search.is_required.as_ref().unwrap().len();
    if len == 0 {
      return Ok(vec![]);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.is_required.length > {ids_limit}"));
    }
  }
  // 查询条件
  if let Some(search) = &search && search.is_search.is_some() {
    let len = search.is_search.as_ref().unwrap().len();
    if len == 0 {
      return Ok(vec![]);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.is_search.length > {ids_limit}"));
    }
  }
  // 对齐方式
  if let Some(search) = &search && search.align.is_some() {
    let len = search.align.as_ref().unwrap().len();
    if len == 0 {
      return Ok(vec![]);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.align.length > {ids_limit}"));
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
  let page_query = get_page_query(page);
  
  let sql = format!(r#"select f.* from (select t.*
  ,dyn_page_id_lbl.lbl dyn_page_id_lbl
  from {from_query} where {where_query} group by t.id{order_by_query}) f {page_query}"#);
  
  let args = args.into();
  
  let options = Options::from(options);
  
  let mut res: Vec<DynPageFieldModel> = query(
    sql,
    args,
    Some(options),
  ).await?;
  
  let dict_vec = get_dict(&[
    "yes_no",
    "yes_no",
    "dyn_page_field_align",
    "is_enabled",
  ]).await?;
  let [
    is_required_dict,
    is_search_dict,
    align_dict,
    is_enabled_dict,
  ]: [Vec<_>; 4] = dict_vec
    .try_into()
    .map_err(|err| eyre!("{:#?}", err))?;
  
  #[allow(unused_variables)]
  for model in &mut res {
    
    // 必填
    model.is_required_lbl = {
      is_required_dict
        .iter()
        .find(|item| item.val == model.is_required.to_string())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.is_required.to_string())
    };
    
    // 查询条件
    model.is_search_lbl = {
      is_search_dict
        .iter()
        .find(|item| item.val == model.is_search.to_string())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.is_search.to_string())
    };
    
    // 对齐方式
    model.align_lbl = {
      align_dict
        .iter()
        .find(|item| item.val == model.align.as_str())
        .map(|item| item.lbl.clone())
        .unwrap_or_else(|| model.align.to_string())
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

// MARK: find_count_dyn_page_field
/// 根据条件查找动态页面字段总数
pub async fn find_count_dyn_page_field(
  search: Option<DynPageFieldSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_dyn_page_field();
  let method = "find_count_dyn_page_field";
  
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
  // 动态页面
  if let Some(search) = &search && search.dyn_page_id.is_some() {
    let len = search.dyn_page_id.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.dyn_page_id.length > {ids_limit}"));
    }
  }
  // 必填
  if let Some(search) = &search && search.is_required.is_some() {
    let len = search.is_required.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.is_required.length > {ids_limit}"));
    }
  }
  // 查询条件
  if let Some(search) = &search && search.is_search.is_some() {
    let len = search.is_search.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.is_search.length > {ids_limit}"));
    }
  }
  // 对齐方式
  if let Some(search) = &search && search.align.is_some() {
    let len = search.align.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.align.length > {ids_limit}"));
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

// MARK: get_field_comments_dyn_page_field
/// 获取动态页面字段字段注释
#[allow(unused_mut)]
pub async fn get_field_comments_dyn_page_field(
  _options: Option<Options>,
) -> Result<DynPageFieldFieldComment> {
  
  let mut field_comments = DynPageFieldFieldComment {
    id: "ID".into(),
    code: "编码".into(),
    dyn_page_id: "动态页面".into(),
    dyn_page_id_lbl: "动态页面".into(),
    lbl: "名称".into(),
    r#type: "类型".into(),
    attrs: "属性".into(),
    formula: "计算公式".into(),
    is_required: "必填".into(),
    is_required_lbl: "必填".into(),
    is_search: "查询条件".into(),
    is_search_lbl: "查询条件".into(),
    width: "宽度".into(),
    align: "对齐方式".into(),
    align_lbl: "对齐方式".into(),
    is_enabled: "启用".into(),
    is_enabled_lbl: "启用".into(),
    order_by: "排序".into(),
  };
  Ok(field_comments)
}

// MARK: find_one_ok_dyn_page_field
/// 根据条件查找第一个动态页面字段, 如果不存在则抛错
#[allow(dead_code)]
pub async fn find_one_ok_dyn_page_field(
  search: Option<DynPageFieldSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<DynPageFieldModel> {
  
  let table = get_table_name_dyn_page_field();
  let method = "find_one_ok_dyn_page_field";
  
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
  
  let dyn_page_field_model = find_one_dyn_page_field(
    search,
    sort,
    options,
  ).await?;
  
  let Some(dyn_page_field_model) = dyn_page_field_model else {
    let err_msg = "此 动态页面字段 已被删除";
    return Err(eyre!(err_msg));
  };
  
  Ok(dyn_page_field_model)
}

// MARK: find_one_dyn_page_field
/// 根据条件查找第一个动态页面字段
#[allow(dead_code)]
pub async fn find_one_dyn_page_field(
  search: Option<DynPageFieldSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<DynPageFieldModel>> {
  
  let table = get_table_name_dyn_page_field();
  let method = "find_one_dyn_page_field";
  
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
  
  let res = find_all_dyn_page_field(
    search,
    page,
    sort,
    options,
  ).await?;
  
  let model: Option<DynPageFieldModel> = res.into_iter().next();
  
  Ok(model)
}

// MARK: find_by_id_ok_dyn_page_field
/// 根据 id 查找动态页面字段, 如果不存在则抛错
#[allow(dead_code)]
pub async fn find_by_id_ok_dyn_page_field(
  id: DynPageFieldId,
  options: Option<Options>,
) -> Result<DynPageFieldModel> {
  
  let table = get_table_name_dyn_page_field();
  let method = "find_by_id_ok_dyn_page_field";
  
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
  
  let dyn_page_field_model = find_by_id_dyn_page_field(
    id,
    options,
  ).await?;
  
  let Some(dyn_page_field_model) = dyn_page_field_model else {
    let err_msg = "此 动态页面字段 已被删除";
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
  
  Ok(dyn_page_field_model)
}

// MARK: find_by_id_dyn_page_field
/// 根据 id 查找动态页面字段
pub async fn find_by_id_dyn_page_field(
  id: DynPageFieldId,
  options: Option<Options>,
) -> Result<Option<DynPageFieldModel>> {
  
  let table = get_table_name_dyn_page_field();
  let method = "find_by_id_dyn_page_field";
  
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
  
  let search = DynPageFieldSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let dyn_page_field_model = find_one_dyn_page_field(
    search,
    None,
    options,
  ).await?;
  
  Ok(dyn_page_field_model)
}

// MARK: find_by_ids_ok_dyn_page_field
/// 根据 ids 查找动态页面字段, 出现查询不到的 id 则报错
#[allow(dead_code)]
pub async fn find_by_ids_ok_dyn_page_field(
  ids: Vec<DynPageFieldId>,
  options: Option<Options>,
) -> Result<Vec<DynPageFieldModel>> {
  
  let table = get_table_name_dyn_page_field();
  let method = "find_by_ids_ok_dyn_page_field";
  
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
  
  let dyn_page_field_models = find_by_ids_dyn_page_field(
    ids.clone(),
    options,
  ).await?;
  
  if dyn_page_field_models.len() != len {
    let err_msg = "此 动态页面字段 已被删除";
    return Err(eyre!(err_msg));
  }
  
  let dyn_page_field_models = ids
    .into_iter()
    .map(|id| {
      let model = dyn_page_field_models
        .iter()
        .find(|item| item.id == id);
      if let Some(model) = model {
        return Ok(model.clone());
      }
      let err_msg = "此 动态页面字段 已经被删除";
      Err(eyre!(err_msg))
    })
    .collect::<Result<Vec<DynPageFieldModel>>>()?;
  
  Ok(dyn_page_field_models)
}

// MARK: find_by_ids_dyn_page_field
/// 根据 ids 查找动态页面字段
#[allow(dead_code)]
pub async fn find_by_ids_dyn_page_field(
  ids: Vec<DynPageFieldId>,
  options: Option<Options>,
) -> Result<Vec<DynPageFieldModel>> {
  
  let table = get_table_name_dyn_page_field();
  let method = "find_by_ids_dyn_page_field";
  
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
  
  let search = DynPageFieldSearch {
    ids: Some(ids.clone()),
    ..Default::default()
  }.into();
  
  let dyn_page_field_models = find_all_dyn_page_field(
    search,
    None,
    None,
    options,
  ).await?;
  
  let dyn_page_field_models = ids
    .into_iter()
    .filter_map(|id| {
      dyn_page_field_models
        .iter()
        .find(|item| item.id == id)
        .cloned()
    })
    .collect::<Vec<DynPageFieldModel>>();
  
  Ok(dyn_page_field_models)
}

// MARK: exists_dyn_page_field
/// 根据搜索条件判断动态页面字段是否存在
#[allow(dead_code)]
pub async fn exists_dyn_page_field(
  search: Option<DynPageFieldSearch>,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = get_table_name_dyn_page_field();
  let method = "exists_dyn_page_field";
  
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
  // 动态页面
  if let Some(search) = &search && search.dyn_page_id.is_some() {
    let len = search.dyn_page_id.as_ref().unwrap().len();
    if len == 0 {
      return Ok(false);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.dyn_page_id.length > {ids_limit}"));
    }
  }
  // 必填
  if let Some(search) = &search && search.is_required.is_some() {
    let len = search.is_required.as_ref().unwrap().len();
    if len == 0 {
      return Ok(false);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.is_required.length > {ids_limit}"));
    }
  }
  // 查询条件
  if let Some(search) = &search && search.is_search.is_some() {
    let len = search.is_search.as_ref().unwrap().len();
    if len == 0 {
      return Ok(false);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.is_search.length > {ids_limit}"));
    }
  }
  // 对齐方式
  if let Some(search) = &search && search.align.is_some() {
    let len = search.align.as_ref().unwrap().len();
    if len == 0 {
      return Ok(false);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.align.length > {ids_limit}"));
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
  
  let res: Option<(bool,)> = query_one(
    sql,
    args,
    options,
  ).await?;
  
  Ok(res
    .map(|item| item.0)
    .unwrap_or_default())
}

// MARK: exists_by_id_dyn_page_field
/// 根据 id 判断动态页面字段是否存在
#[allow(dead_code)]
pub async fn exists_by_id_dyn_page_field(
  id: DynPageFieldId,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = get_table_name_dyn_page_field();
  let method = "exists_by_id_dyn_page_field";
  
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
  
  let search = DynPageFieldSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let exists = exists_dyn_page_field(
    search,
    options,
  ).await?;
  
  Ok(exists)
}

// MARK: find_by_unique_dyn_page_field
/// 通过唯一约束获得数据列表
#[allow(unused_variables)]
pub async fn find_by_unique_dyn_page_field(
  search: DynPageFieldSearch,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<DynPageFieldModel>> {
  
  let table = get_table_name_dyn_page_field();
  let method = "find_by_unique_dyn_page_field";
  
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
    let model = find_by_id_dyn_page_field(
      id,
      options.clone(),
    ).await?;
    return Ok(model.map_or_else(Vec::new, |m| vec![m]));
  }
  
  let mut models: Vec<DynPageFieldModel> = vec![];
  
  let mut models_tmp = {
    if
      search.dyn_page_id.is_none() ||
      search.lbl.is_none()
    {
      return Ok(vec![]);
    }
    
    let search = DynPageFieldSearch {
      dyn_page_id: search.dyn_page_id.clone(),
      lbl: search.lbl.clone(),
      ..Default::default()
    };
    
    find_all_dyn_page_field(
      search.into(),
      None,
      sort.clone(),
      options.clone(),
    ).await?
  };
  models.append(&mut models_tmp);
  
  let mut models_tmp = {
    if
      search.code.is_none()
    {
      return Ok(vec![]);
    }
    
    let search = DynPageFieldSearch {
      code: search.code.clone(),
      ..Default::default()
    };
    
    find_all_dyn_page_field(
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
  input: &DynPageFieldInput,
  model: &DynPageFieldModel,
) -> bool {
  if input.id.as_ref().is_some() {
    return input.id.as_ref().unwrap() == &model.id;
  }
  
  if
    input.dyn_page_id.as_ref().is_some() && input.dyn_page_id.as_ref().unwrap() == &model.dyn_page_id &&
    input.lbl.as_ref().is_some() && input.lbl.as_ref().unwrap() == &model.lbl
  {
    return true;
  }
  
  if
    input.code.as_ref().is_some() && input.code.as_ref().unwrap() == &model.code
  {
    return true;
  }
  false
}

// MARK: check_by_unique_dyn_page_field
/// 通过唯一约束检查数据是否已经存在
#[allow(unused_variables)]
pub async fn check_by_unique_dyn_page_field(
  input: DynPageFieldInput,
  model: DynPageFieldModel,
  options: Option<Options>,
) -> Result<Option<DynPageFieldId>> {
  
  let table = get_table_name_dyn_page_field();
  let method = "check_by_unique_dyn_page_field";
  
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
    let id = update_by_id_dyn_page_field(
      model.id,
      input,
      options,
    ).await?;
    return Ok(id.into());
  }
  if unique_type == UniqueType::Throw {
    let err_msg = "动态页面字段 重复";
    return Err(eyre!(err_msg));
  }
  Ok(None)
}

// MARK: set_id_by_lbl_dyn_page_field
/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(unused_variables, dead_code)]
pub async fn set_id_by_lbl_dyn_page_field(
  input: DynPageFieldInput,
) -> Result<DynPageFieldInput> {
  
  #[allow(unused_mut)]
  let mut input = input;
  
  let dict_vec = get_dict(&[
    "yes_no",
    "yes_no",
    "dyn_page_field_align",
    "is_enabled",
  ]).await?;
  
  // 必填
  if input.is_required.is_none() {
    let is_required_dict = &dict_vec[0];
    if let Some(is_required_lbl) = input.is_required_lbl.clone() {
      input.is_required = is_required_dict
        .iter()
        .find(|item| {
          item.lbl == is_required_lbl
        })
        .map(|item| {
          item.val.parse().unwrap_or_default()
        });
    }
  }
  
  // 查询条件
  if input.is_search.is_none() {
    let is_search_dict = &dict_vec[1];
    if let Some(is_search_lbl) = input.is_search_lbl.clone() {
      input.is_search = is_search_dict
        .iter()
        .find(|item| {
          item.lbl == is_search_lbl
        })
        .map(|item| {
          item.val.parse().unwrap_or_default()
        });
    }
  }
  
  // 对齐方式
  if input.align.is_none() {
    let align_dict = &dict_vec[2];
    if let Some(align_lbl) = input.align_lbl.clone() {
      input.align = align_dict
        .iter()
        .find(|item| {
          item.lbl == align_lbl
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
  
  // 动态页面
  if input.dyn_page_id_lbl.is_some()
    && !input.dyn_page_id_lbl.as_ref().unwrap().is_empty()
    && input.dyn_page_id.is_none()
  {
    input.dyn_page_id_lbl = input.dyn_page_id_lbl.map(|item| 
      item.trim().to_owned()
    );
    let model = crate::base::dyn_page::dyn_page_dao::find_one_dyn_page(
      crate::base::dyn_page::dyn_page_model::DynPageSearch {
        lbl: input.dyn_page_id_lbl.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(model) = model {
      input.dyn_page_id = model.id.into();
    }
  } else if
    (input.dyn_page_id_lbl.is_none() || input.dyn_page_id_lbl.as_ref().unwrap().is_empty())
    && input.dyn_page_id.is_some()
  {
    let dyn_page_model = crate::base::dyn_page::dyn_page_dao::find_one_dyn_page(
      crate::base::dyn_page::dyn_page_model::DynPageSearch {
        id: input.dyn_page_id.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(dyn_page_model) = dyn_page_model {
      input.dyn_page_id_lbl = dyn_page_model.lbl.into();
    }
  }
  
  // 必填
  if
    input.is_required_lbl.is_some() && !input.is_required_lbl.as_ref().unwrap().is_empty()
    && input.is_required.is_none()
  {
    let is_required_dict = &dict_vec[0];
    let dict_model = is_required_dict.iter().find(|item| {
      item.lbl == input.is_required_lbl.clone().unwrap_or_default()
    });
    let val = dict_model.map(|item| item.val.to_string());
    if let Some(val) = val {
      input.is_required = val.parse::<u8>()?.into();
    }
  } else if
    (input.is_required_lbl.is_none() || input.is_required_lbl.as_ref().unwrap().is_empty())
    && input.is_required.is_some()
  {
    let is_required_dict = &dict_vec[0];
    let dict_model = is_required_dict.iter().find(|item| {
      item.val == input.is_required.unwrap_or_default().to_string()
    });
    let lbl = dict_model.map(|item| item.lbl.to_string());
    input.is_required_lbl = lbl;
  }
  
  // 查询条件
  if
    input.is_search_lbl.is_some() && !input.is_search_lbl.as_ref().unwrap().is_empty()
    && input.is_search.is_none()
  {
    let is_search_dict = &dict_vec[1];
    let dict_model = is_search_dict.iter().find(|item| {
      item.lbl == input.is_search_lbl.clone().unwrap_or_default()
    });
    let val = dict_model.map(|item| item.val.to_string());
    if let Some(val) = val {
      input.is_search = val.parse::<u8>()?.into();
    }
  } else if
    (input.is_search_lbl.is_none() || input.is_search_lbl.as_ref().unwrap().is_empty())
    && input.is_search.is_some()
  {
    let is_search_dict = &dict_vec[1];
    let dict_model = is_search_dict.iter().find(|item| {
      item.val == input.is_search.unwrap_or_default().to_string()
    });
    let lbl = dict_model.map(|item| item.lbl.to_string());
    input.is_search_lbl = lbl;
  }
  
  // 对齐方式
  if
    input.align_lbl.is_some() && !input.align_lbl.as_ref().unwrap().is_empty()
    && input.align.is_none()
  {
    let align_dict = &dict_vec[2];
    let dict_model = align_dict.iter().find(|item| {
      item.lbl == input.align_lbl.clone().unwrap_or_default()
    });
    let val = dict_model.map(|item| item.val.to_string());
    if let Some(val) = val {
      input.align = val.parse::<DynPageFieldAlign>()?.into();
    }
  } else if
    (input.align_lbl.is_none() || input.align_lbl.as_ref().unwrap().is_empty())
    && input.align.is_some()
  {
    let align_dict = &dict_vec[2];
    let dict_model = align_dict.iter().find(|item| {
      item.val == input.align.unwrap_or_default().to_string()
    });
    let lbl = dict_model.map(|item| item.lbl.to_string());
    input.align_lbl = lbl;
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

// MARK: creates_return_dyn_page_field
/// 批量创建动态页面字段并返回
#[allow(dead_code)]
pub async fn creates_return_dyn_page_field(
  inputs: Vec<DynPageFieldInput>,
  options: Option<Options>,
) -> Result<Vec<DynPageFieldModel>> {
  
  let table = get_table_name_dyn_page_field();
  let method = "creates_return_dyn_page_field";
  
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
  
  let models_dyn_page_field = find_by_ids_dyn_page_field(
    ids,
    options,
  ).await?;
  
  Ok(models_dyn_page_field)
}

// MARK: creates_dyn_page_field
/// 批量创建动态页面字段
pub async fn creates_dyn_page_field(
  inputs: Vec<DynPageFieldInput>,
  options: Option<Options>,
) -> Result<Vec<DynPageFieldId>> {
  
  let table = get_table_name_dyn_page_field();
  let method = "creates_dyn_page_field";
  
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

/// 批量创建动态页面字段
#[allow(unused_variables, clippy::redundant_locals)]
async fn _creates(
  inputs: Vec<DynPageFieldInput>,
  options: Option<Options>,
) -> Result<Vec<DynPageFieldId>> {
  
  let table = get_table_name_dyn_page_field();
  
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
    ) = find_auto_code_dyn_page_field(options.clone()).await?;
    input.code_seq = Some(code_seq);
    input.code = Some(code);
  }
  
  let mut ids2: Vec<DynPageFieldId> = vec![];
  let mut inputs2: Vec<DynPageFieldInput> = vec![];
  
  for input in inputs {
  
    if input.id.is_some() {
      return Err(eyre!("Can not set id when create in dao: {table}"));
    }
    
    let old_models = find_by_unique_dyn_page_field(
      input.clone().into(),
      None,
      options.clone(),
    ).await?;
    
    if !old_models.is_empty() {
      let mut id: Option<DynPageFieldId> = None;
      
      for old_model in old_models {
        let options = Options::from(options.clone())
          .set_unique_type(unique_type);
        
        id = check_by_unique_dyn_page_field(
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
  let mut sql_fields = String::with_capacity(80 * 20 + 20);
  
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
  // 动态页面
  sql_fields += ",dyn_page_id";
  // 名称
  sql_fields += ",lbl";
  // 类型
  sql_fields += ",type";
  // 属性
  sql_fields += ",attrs";
  // 计算公式
  sql_fields += ",formula";
  // 必填
  sql_fields += ",is_required";
  // 查询条件
  sql_fields += ",is_search";
  // 宽度
  sql_fields += ",width";
  // 对齐方式
  sql_fields += ",align";
  // 启用
  sql_fields += ",is_enabled";
  // 排序
  sql_fields += ",order_by";
  
  let inputs2_len = inputs2.len();
  let mut sql_values = String::with_capacity((2 * 20 + 3) * inputs2_len);
  let mut inputs2_ids = vec![];
  
  for (i, input) in inputs2
    .clone()
    .into_iter()
    .enumerate()
  {
    
    let id: DynPageFieldId = get_short_uuid().into();
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
    // 动态页面
    if let Some(dyn_page_id) = input.dyn_page_id {
      sql_values += ",?";
      args.push(dyn_page_id.into());
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
    // 类型
    if let Some(r#type) = input.r#type {
      sql_values += ",?";
      args.push(r#type.into());
    } else {
      sql_values += ",default";
    }
    // 属性
    if let Some(attrs) = input.attrs {
      sql_values += ",?";
      args.push(attrs.into());
    } else {
      sql_values += ",default";
    }
    // 计算公式
    if let Some(formula) = input.formula {
      sql_values += ",?";
      args.push(formula.into());
    } else {
      sql_values += ",default";
    }
    // 必填
    if let Some(is_required) = input.is_required {
      sql_values += ",?";
      args.push(is_required.into());
    } else {
      sql_values += ",default";
    }
    // 查询条件
    if let Some(is_search) = input.is_search {
      sql_values += ",?";
      args.push(is_search.into());
    } else {
      sql_values += ",default";
    }
    // 宽度
    if let Some(width) = input.width {
      sql_values += ",?";
      args.push(width.into());
    } else {
      sql_values += ",default";
    }
    // 对齐方式
    if let Some(align) = input.align {
      sql_values += ",?";
      args.push(align.into());
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

// MARK: find_auto_code_dyn_page_field
/// 获得 动态页面字段 自动编码
pub async fn find_auto_code_dyn_page_field(
  options: Option<Options>,
) -> Result<(u32, String)> {
  
  let table = get_table_name_dyn_page_field();
  let method = "find_auto_code_dyn_page_field";
  
  let is_debug = get_is_debug(options.as_ref());
  
  if is_debug {
    let mut msg = format!("{table}.{method}:");
    if let Some(options) = &options {
      msg += &format!(" options: {:?}", &options);
    }
    info!(
      "{req_id} {msg}",
      req_id = get_req_id(),
    );
  }
  
  let model = find_one_dyn_page_field(
    None,
    Some(vec![
      SortInput {
        prop: "code_seq".to_owned(),
        order: SortOrderEnum::Desc,
      },
    ]),
    options.clone(),
  ).await?;
  
  let code_seq = model
    .as_ref()
    .map_or(0, |item| item.code_seq) + 1;
  
  let model_deleted = find_one_dyn_page_field(
    Some(DynPageFieldSearch {
      is_deleted: Some(1),
      ..Default::default()
    }),
    Some(vec![
      SortInput {
        prop: "code_seq".to_owned(),
        order: SortOrderEnum::Desc,
      },
    ]),
    options.clone(),
  ).await?;
  
  let code_seq_deleted = model_deleted
    .as_ref()
    .map_or(0, |item| item.code_seq) + 1;
  
  let code_seq = if code_seq_deleted > code_seq {
    code_seq_deleted
  } else {
    code_seq
  };
  
  let code = format!("fld_{code_seq:0}");
  
  Ok((code_seq, code))
}

// MARK: create_return_dyn_page_field
/// 创建动态页面字段并返回
#[allow(dead_code)]
pub async fn create_return_dyn_page_field(
  #[allow(unused_mut)]
  mut input: DynPageFieldInput,
  options: Option<Options>,
) -> Result<DynPageFieldModel> {
  
  let id = create_dyn_page_field(
    input.clone(),
    options.clone(),
  ).await?;
  
  let model_dyn_page_field = find_by_id_dyn_page_field(
    id,
    options,
  ).await?;
  
  let model_dyn_page_field = match model_dyn_page_field {
    Some(model) => model,
    None => {
      let err_msg = "create_return_dyn_page_field: model_dyn_page_field.is_none()";
      return Err(eyre!(
        ServiceException {
          message: err_msg.to_owned(),
          trace: true,
          ..Default::default()
        },
      ));
    }
  };
  
  Ok(model_dyn_page_field)
}

// MARK: create_dyn_page_field
/// 创建动态页面字段
#[allow(dead_code)]
pub async fn create_dyn_page_field(
  #[allow(unused_mut)]
  mut input: DynPageFieldInput,
  options: Option<Options>,
) -> Result<DynPageFieldId> {
  
  let table = get_table_name_dyn_page_field();
  let method = "create_dyn_page_field";
  
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

// MARK: update_tenant_by_id_dyn_page_field
/// 动态页面字段根据id修改租户id
pub async fn update_tenant_by_id_dyn_page_field(
  id: DynPageFieldId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  let table = get_table_name_dyn_page_field();
  let method = "update_tenant_by_id_dyn_page_field";
  
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

// MARK: update_by_id_dyn_page_field
/// 根据 id 修改动态页面字段
#[allow(unused_mut)]
#[allow(unused_variables)]
pub async fn update_by_id_dyn_page_field(
  id: DynPageFieldId,
  mut input: DynPageFieldInput,
  options: Option<Options>,
) -> Result<DynPageFieldId> {
  
  let table = get_table_name_dyn_page_field();
  let method = "update_by_id_dyn_page_field";
  
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
  
  let old_model = find_by_id_dyn_page_field(
    id,
    options.clone(),
  ).await?;
  
  let old_model = match old_model {
    Some(model) => model,
    None => {
      let err_msg = "编辑失败, 此 动态页面字段 已被删除";
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
    
    let models = find_by_unique_dyn_page_field(
      input.into(),
      None,
      options.clone(),
    ).await?;
    
    let models = models.into_iter()
      .filter(|item| 
        item.id != id
      )
      .collect::<Vec<DynPageFieldModel>>();
    
    if !models.is_empty() {
      let unique_type = options
        .as_ref()
        .and_then(|item| item.get_unique_type())
        .unwrap_or(UniqueType::Throw);
      if unique_type == UniqueType::Throw {
        let err_msg = "动态页面字段 重复";
        return Err(eyre!(err_msg));
      } else if unique_type == UniqueType::Ignore {
        return Ok(id);
      }
    }
  }
  
  let mut args = QueryArgs::new();
  
  let mut sql_fields = String::with_capacity(80 * 20 + 20);
  
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
  if let Some(code) = input.code {
    field_num += 1;
    sql_fields += "code=?,";
    args.push(code.into());
  }
  // 动态页面
  if let Some(dyn_page_id) = input.dyn_page_id {
    field_num += 1;
    sql_fields += "dyn_page_id=?,";
    args.push(dyn_page_id.into());
  }
  // 名称
  if let Some(lbl) = input.lbl {
    field_num += 1;
    sql_fields += "lbl=?,";
    args.push(lbl.into());
  }
  // 类型
  if let Some(r#type) = input.r#type {
    field_num += 1;
    sql_fields += "type=?,";
    args.push(r#type.into());
  }
  // 属性
  if let Some(attrs) = input.attrs {
    field_num += 1;
    sql_fields += "attrs=?,";
    args.push(attrs.into());
  }
  // 计算公式
  if let Some(formula) = input.formula {
    field_num += 1;
    sql_fields += "formula=?,";
    args.push(formula.into());
  }
  // 必填
  if let Some(is_required) = input.is_required {
    field_num += 1;
    sql_fields += "is_required=?,";
    args.push(is_required.into());
  }
  // 查询条件
  if let Some(is_search) = input.is_search {
    field_num += 1;
    sql_fields += "is_search=?,";
    args.push(is_search.into());
  }
  // 宽度
  if let Some(width) = input.width {
    field_num += 1;
    sql_fields += "width=?,";
    args.push(width.into());
  }
  // 对齐方式
  if let Some(align) = input.align {
    field_num += 1;
    sql_fields += "align=?,";
    args.push(align.into());
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
  let table = get_table_name_dyn_page_field();
  vec![
    table,
  ]
}

// MARK: del_cache_dyn_page_field
/// 清空缓存
#[allow(dead_code)]
pub async fn del_cache_dyn_page_field() -> Result<()> {
  let cache_key1s = get_cache_tables();
  del_caches(
    cache_key1s.as_slice(),
  ).await?;
  Ok(())
}

// MARK: delete_by_ids_dyn_page_field
/// 根据 ids 删除动态页面字段
#[allow(unused_variables)]
pub async fn delete_by_ids_dyn_page_field(
  ids: Vec<DynPageFieldId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_dyn_page_field();
  let method = "delete_by_ids_dyn_page_field";
  
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
    
    let old_model = find_by_id_dyn_page_field(
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

// MARK: get_is_enabled_by_id_dyn_page_field
/// 根据 id 查找动态页面字段是否已启用
/// 记录不存在则返回 false
pub async fn get_is_enabled_by_id_dyn_page_field(
  id: DynPageFieldId,
  options: Option<Options>,
) -> Result<bool> {
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let model = find_by_id_dyn_page_field(
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

// MARK: enable_by_ids_dyn_page_field
/// 根据 ids 启用或者禁用动态页面字段
pub async fn enable_by_ids_dyn_page_field(
  ids: Vec<DynPageFieldId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_dyn_page_field();
  let method = "enable_by_ids_dyn_page_field";
  
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

// MARK: revert_by_ids_dyn_page_field
/// 根据 ids 还原动态页面字段
pub async fn revert_by_ids_dyn_page_field(
  ids: Vec<DynPageFieldId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_dyn_page_field();
  let method = "revert_by_ids_dyn_page_field";
  
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
    
    let mut old_model = find_one_dyn_page_field(
      DynPageFieldSearch {
        id: Some(id),
        is_deleted: Some(1),
        ..Default::default()
      }.into(),
      None,
      options.clone(),
    ).await?;
    
    if old_model.is_none() {
      old_model = find_by_id_dyn_page_field(
        id,
        options.clone(),
      ).await?;
    }
    
    let old_model = match old_model {
      Some(model) => model,
      None => continue,
    };
    
    {
      let mut input: DynPageFieldInput = old_model.clone().into();
      input.id = None;
      
      let models = find_by_unique_dyn_page_field(
        input.into(),
        None,
        options.clone(),
      ).await?;
      
      let models: Vec<DynPageFieldModel> = models
        .into_iter()
        .filter(|item| 
          item.id != id
        )
        .collect();
      
      if !models.is_empty() {
        let err_msg = "动态页面字段 重复";
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

// MARK: force_delete_by_ids_dyn_page_field
/// 根据 ids 彻底删除动态页面字段
#[allow(unused_variables)]
pub async fn force_delete_by_ids_dyn_page_field(
  ids: Vec<DynPageFieldId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_dyn_page_field();
  let method = "force_delete_by_ids_dyn_page_field";
  
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
    
    let old_model = find_one_dyn_page_field(
      Some(DynPageFieldSearch {
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
    
    let options = Some(options);
    
    num += execute(
      sql,
      args,
      options.clone(),
    ).await?;
  }
  
  Ok(num)
}

// MARK: find_last_order_by_dyn_page_field
/// 查找 动态页面字段 order_by 字段的最大值
pub async fn find_last_order_by_dyn_page_field(
  search: Option<DynPageFieldSearch>,
  options: Option<Options>,
) -> Result<u32> {
  
  let table = get_table_name_dyn_page_field();
  let method = "find_last_order_by_dyn_page_field";
  
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

// MARK: validate_is_enabled_dyn_page_field
/// 校验动态页面字段是否启用
#[allow(dead_code)]
pub async fn validate_is_enabled_dyn_page_field(
  model: &DynPageFieldModel,
) -> Result<()> {
  if model.is_enabled == 0 {
    let err_msg = "动态页面字段已禁用";
    return Err(eyre!(err_msg));
  }
  Ok(())
}

// MARK: validate_option_dyn_page_field
/// 校验动态页面字段是否存在
#[allow(dead_code)]
pub async fn validate_option_dyn_page_field(
  model: Option<DynPageFieldModel>,
) -> Result<DynPageFieldModel> {
  
  let model = match model {
    Some(model) => model,
    None => {
      let err_msg = "动态页面字段不存在";
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
