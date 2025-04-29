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

use crate::common::util::dao::{
  many2many_update,
  ManyOpts,
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

use super::tenant_model::*;
use crate::base::domain::domain_model::DomainId;
use crate::base::menu::menu_model::MenuId;
use crate::base::lang::lang_model::LangId;
use crate::base::usr::usr_model::UsrId;

use crate::base::usr::usr_dao::find_by_id_usr;

#[allow(unused_variables)]
async fn get_where_query(
  args: &mut QueryArgs,
  search: Option<&TenantSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let is_deleted = search
    .and_then(|item| item.is_deleted)
    .unwrap_or(0);
  
  let mut where_query = String::with_capacity(80 * 19 * 2);
  
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
    let ids: Option<Vec<TenantId>> = match search {
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
      where_query.push_str(" and t.lbl=?");
      args.push(lbl.into());
    }
    let lbl_like = match search {
      Some(item) => item.lbl_like.clone(),
      None => None,
    };
    if let Some(lbl_like) = lbl_like {
      where_query.push_str(" and t.lbl like ?");
      args.push(format!("%{}%", sql_like(&lbl_like)).into());
    }
  }
  // 所属域名
  {
    let domain_ids: Option<Vec<DomainId>> = match search {
      Some(item) => item.domain_ids.clone(),
      None => None,
    };
    if let Some(domain_ids) = domain_ids {
      let arg = {
        if domain_ids.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(domain_ids.len());
          for item in domain_ids {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and base_domain.id in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let domain_ids_is_null: bool = match search {
      Some(item) => item.domain_ids_is_null.unwrap_or(false),
      None => false,
    };
    if domain_ids_is_null {
      where_query.push_str(" and t.domain_ids is null");
    }
  }
  // 菜单权限
  {
    let menu_ids: Option<Vec<MenuId>> = match search {
      Some(item) => item.menu_ids.clone(),
      None => None,
    };
    if let Some(menu_ids) = menu_ids {
      let arg = {
        if menu_ids.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(menu_ids.len());
          for item in menu_ids {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and base_menu.id in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let menu_ids_is_null: bool = match search {
      Some(item) => item.menu_ids_is_null.unwrap_or(false),
      None => false,
    };
    if menu_ids_is_null {
      where_query.push_str(" and t.menu_ids is null");
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
    if let Some(title_like) = title_like {
      where_query.push_str(" and t.title like ?");
      args.push(format!("%{}%", sql_like(&title_like)).into());
    }
  }
  // 简介
  {
    let info = match search {
      Some(item) => item.info.clone(),
      None => None,
    };
    if let Some(info) = info {
      where_query.push_str(" and t.info=?");
      args.push(info.into());
    }
    let info_like = match search {
      Some(item) => item.info_like.clone(),
      None => None,
    };
    if let Some(info_like) = info_like {
      where_query.push_str(" and t.info like ?");
      args.push(format!("%{}%", sql_like(&info_like)).into());
    }
  }
  // 语言
  {
    let lang_id: Option<Vec<LangId>> = match search {
      Some(item) => item.lang_id.clone(),
      None => None,
    };
    if let Some(lang_id) = lang_id {
      let arg = {
        if lang_id.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(lang_id.len());
          for item in lang_id {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.lang_id in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let lang_id_is_null: bool = match search {
      Some(item) => item.lang_id_is_null.unwrap_or(false),
      None => false,
    };
    if lang_id_is_null {
      where_query.push_str(" and t.lang_id is null");
    }
  }
  {
    let lang_id_lbl: Option<Vec<String>> = match search {
      Some(item) => item.lang_id_lbl.clone(),
      None => None,
    };
    if let Some(lang_id_lbl) = lang_id_lbl {
      let arg = {
        if lang_id_lbl.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(lang_id_lbl.len());
          for item in lang_id_lbl {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.lang_id_lbl in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
    {
      let lang_id_lbl_like = match search {
        Some(item) => item.lang_id_lbl_like.clone(),
        None => None,
      };
      if let Some(lang_id_lbl_like) = lang_id_lbl_like {
        if !lang_id_lbl_like.is_empty() {
          where_query.push_str(" and lang_id_lbl like ?");
          args.push(format!("%{}%", sql_like(&lang_id_lbl_like)).into());
        }
      }
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
    if let Some(rem_like) = rem_like {
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
  search: Option<&TenantSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let is_deleted = search
    .and_then(|item| item.is_deleted)
    .unwrap_or(0);
  
  let from_query = r#"base_tenant t
  left join base_tenant_domain on base_tenant_domain.tenant_id=t.id and base_tenant_domain.is_deleted=?
  left join base_domain on base_tenant_domain.domain_id=base_domain.id and base_domain.is_deleted=?
  left join (select json_objectagg(base_tenant_domain.order_by,base_domain.id) domain_ids,
  json_objectagg(base_tenant_domain.order_by,base_domain.lbl) domain_ids_lbl,
  base_tenant.id tenant_id from base_tenant_domain
  inner join base_domain on base_domain.id=base_tenant_domain.domain_id
  inner join base_tenant on base_tenant.id=base_tenant_domain.tenant_id where base_tenant_domain.is_deleted=?
  group by tenant_id) _domain on _domain.tenant_id=t.id
  left join base_tenant_menu on base_tenant_menu.tenant_id=t.id and base_tenant_menu.is_deleted=?
  left join base_menu on base_tenant_menu.menu_id=base_menu.id and base_menu.is_deleted=?
  left join (select json_objectagg(base_tenant_menu.order_by,base_menu.id) menu_ids,
  json_objectagg(base_tenant_menu.order_by,base_menu.lbl) menu_ids_lbl,
  base_tenant.id tenant_id from base_tenant_menu
  inner join base_menu on base_menu.id=base_tenant_menu.menu_id
  inner join base_tenant on base_tenant.id=base_tenant_menu.tenant_id where base_tenant_menu.is_deleted=?
  group by tenant_id) _menu on _menu.tenant_id=t.id"#.to_owned();
  for _ in 0..6 {
    args.push(is_deleted.into());
  }
  Ok(from_query)
}

// MARK: find_all_tenant
/// 根据搜索条件和分页查找租户列表
#[allow(unused_mut)]
pub async fn find_all_tenant(
  search: Option<TenantSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<TenantModel>> {
  
  let table = "base_tenant";
  let method = "find_all_tenant";
  
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
  // 所属域名
  if let Some(search) = &search {
    if search.domain_ids.is_some() {
      let len = search.domain_ids.as_ref().unwrap().len();
      if len == 0 {
        return Ok(vec![]);
      }
      let ids_limit = options
        .as_ref()
        .and_then(|x| x.get_ids_limit())
        .unwrap_or(FIND_ALL_IDS_LIMIT);
      if len > ids_limit {
        return Err(eyre!("search.domain_ids.length > {ids_limit}"));
      }
    }
  }
  // 菜单权限
  if let Some(search) = &search {
    if search.menu_ids.is_some() {
      let len = search.menu_ids.as_ref().unwrap().len();
      if len == 0 {
        return Ok(vec![]);
      }
      let ids_limit = options
        .as_ref()
        .and_then(|x| x.get_ids_limit())
        .unwrap_or(FIND_ALL_IDS_LIMIT);
      if len > ids_limit {
        return Err(eyre!("search.menu_ids.length > {ids_limit}"));
      }
    }
  }
  // 语言
  if let Some(search) = &search {
    if search.lang_id.is_some() {
      let len = search.lang_id.as_ref().unwrap().len();
      if len == 0 {
        return Ok(vec![]);
      }
      let ids_limit = options
        .as_ref()
        .and_then(|x| x.get_ids_limit())
        .unwrap_or(FIND_ALL_IDS_LIMIT);
      if len > ids_limit {
        return Err(eyre!("search.lang_id.length > {ids_limit}"));
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
        return Err(eyre!("search.is_locked.length > {ids_limit}"));
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
        return Err(eyre!("search.is_enabled.length > {ids_limit}"));
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
  ,max(domain_ids) domain_ids
  ,max(domain_ids_lbl) domain_ids_lbl
  ,max(menu_ids) menu_ids
  ,max(menu_ids_lbl) menu_ids_lbl
  from {from_query} where {where_query} group by t.id{order_by_query}) f {page_query}"#);
  
  let args = args.into();
  
  let options = Options::from(options);
  
  let options = options.set_cache_key(table, &sql, &args);
  
  let mut res: Vec<TenantModel> = query(
    sql,
    args,
    Some(options),
  ).await?;
  
  let dict_vec = get_dict(&[
    "is_locked",
    "is_enabled",
  ]).await?;
  let [
    is_locked_dict,
    is_enabled_dict,
  ]: [Vec<_>; 2] = dict_vec
    .try_into()
    .map_err(|err| eyre!("{:#?}", err))?;
  
  #[allow(unused_variables)]
  for model in &mut res {
    
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

// MARK: find_count_tenant
/// 根据条件查找租户总数
pub async fn find_count_tenant(
  search: Option<TenantSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_tenant";
  let method = "find_count_tenant";
  
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
  // 所属域名
  if let Some(search) = &search {
    if search.domain_ids.is_some() {
      let len = search.domain_ids.as_ref().unwrap().len();
      if len == 0 {
        return Ok(0);
      }
      let ids_limit = options
        .as_ref()
        .and_then(|x| x.get_ids_limit())
        .unwrap_or(FIND_ALL_IDS_LIMIT);
      if len > ids_limit {
        return Err(eyre!("search.domain_ids.length > {ids_limit}"));
      }
    }
  }
  // 菜单权限
  if let Some(search) = &search {
    if search.menu_ids.is_some() {
      let len = search.menu_ids.as_ref().unwrap().len();
      if len == 0 {
        return Ok(0);
      }
      let ids_limit = options
        .as_ref()
        .and_then(|x| x.get_ids_limit())
        .unwrap_or(FIND_ALL_IDS_LIMIT);
      if len > ids_limit {
        return Err(eyre!("search.menu_ids.length > {ids_limit}"));
      }
    }
  }
  // 语言
  if let Some(search) = &search {
    if search.lang_id.is_some() {
      let len = search.lang_id.as_ref().unwrap().len();
      if len == 0 {
        return Ok(0);
      }
      let ids_limit = options
        .as_ref()
        .and_then(|x| x.get_ids_limit())
        .unwrap_or(FIND_ALL_IDS_LIMIT);
      if len > ids_limit {
        return Err(eyre!("search.lang_id.length > {ids_limit}"));
      }
    }
  }
  // 锁定
  if let Some(search) = &search {
    if search.is_locked.is_some() {
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
  }
  // 启用
  if let Some(search) = &search {
    if search.is_enabled.is_some() {
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

// MARK: get_field_comments_tenant
/// 获取租户字段注释
pub async fn get_field_comments_tenant(
  _options: Option<Options>,
) -> Result<TenantFieldComment> {
  
  let field_comments = TenantFieldComment {
    id: "ID".into(),
    code: "编码".into(),
    lbl: "名称".into(),
    domain_ids: "所属域名".into(),
    domain_ids_lbl: "所属域名".into(),
    menu_ids: "菜单权限".into(),
    menu_ids_lbl: "菜单权限".into(),
    title: "标题".into(),
    info: "简介".into(),
    lang_id: "语言".into(),
    lang_id_lbl: "语言".into(),
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

// MARK: find_one_ok_tenant
/// 根据条件查找第一个租户
#[allow(dead_code)]
pub async fn find_one_ok_tenant(
  search: Option<TenantSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<TenantModel> {
  
  let table = "base_tenant";
  let method = "find_one_ok_tenant";
  
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
  
  let tenant_model = validate_option_tenant(
    find_one_tenant(
      search,
      sort,
      options,
    ).await?,
  ).await?;
  
  Ok(tenant_model)
}

// MARK: find_one_tenant
/// 根据条件查找第一个租户
#[allow(dead_code)]
pub async fn find_one_tenant(
  search: Option<TenantSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<TenantModel>> {
  
  let table = "base_tenant";
  let method = "find_one_tenant";
  
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
  
  let res = find_all_tenant(
    search,
    page,
    sort,
    options,
  ).await?;
  
  let model: Option<TenantModel> = res.into_iter().next();
  
  Ok(model)
}

// MARK: find_by_id_ok_tenant
/// 根据 id 查找租户
#[allow(dead_code)]
pub async fn find_by_id_ok_tenant(
  id: TenantId,
  options: Option<Options>,
) -> Result<TenantModel> {
  
  let table = "base_tenant";
  let method = "find_by_id_ok_tenant";
  
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
  
  let tenant_model = validate_option_tenant(
    find_by_id_tenant(
      id,
      options,
    ).await?,
  ).await?;
  
  Ok(tenant_model)
}

// MARK: find_by_id_tenant
/// 根据 id 查找租户
pub async fn find_by_id_tenant(
  id: TenantId,
  options: Option<Options>,
) -> Result<Option<TenantModel>> {
  
  let table = "base_tenant";
  let method = "find_by_id_tenant";
  
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
  
  let search = TenantSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let tenant_model = find_one_tenant(
    search,
    None,
    options,
  ).await?;
  
  Ok(tenant_model)
}

// MARK: find_by_ids_tenant
/// 根据 ids 查找租户
#[allow(dead_code)]
pub async fn find_by_ids_tenant(
  ids: Vec<TenantId>,
  options: Option<Options>,
) -> Result<Vec<TenantModel>> {
  
  let table = "base_tenant";
  let method = "find_by_ids_tenant";
  
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
  
  let search = TenantSearch {
    ids: Some(ids.clone()),
    ..Default::default()
  }.into();
  
  let models = find_all_tenant(
    search,
    None,
    None,
    options,
  ).await?;
  
  if models.len() != len {
    let err_msg = "此 租户 已被删除";
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
      let err_msg = "此 租户 已经被删除";
      Err(eyre!(err_msg))
    })
    .collect::<Result<Vec<TenantModel>>>()?;
  
  Ok(models)
}

// MARK: exists_tenant
/// 根据搜索条件判断租户是否存在
#[allow(dead_code)]
pub async fn exists_tenant(
  search: Option<TenantSearch>,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = "base_tenant";
  let method = "exists_tenant";
  
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
  
  let total = find_count_tenant(
    search,
    options,
  ).await?;
  
  Ok(total > 0)
}

// MARK: exists_by_id_tenant
/// 根据 id 判断租户是否存在
#[allow(dead_code)]
pub async fn exists_by_id_tenant(
  id: TenantId,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = "base_tenant";
  let method = "exists_by_id_tenant";
  
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
  
  let search = TenantSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let res = exists_tenant(
    search,
    options,
  ).await?;
  
  Ok(res)
}

// MARK: find_by_unique_tenant
/// 通过唯一约束获得数据列表
#[allow(unused_variables)]
pub async fn find_by_unique_tenant(
  search: TenantSearch,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<TenantModel>> {
  
  let table = "base_tenant";
  let method = "find_by_unique_tenant";
  
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
    let model = find_by_id_tenant(
      id,
      options.clone(),
    ).await?;
    return Ok(model.map_or_else(Vec::new, |m| vec![m]));
  }
  
  let mut models: Vec<TenantModel> = vec![];
  
  let mut models_tmp = {
    if
      search.lbl.is_none()
    {
      return Ok(vec![]);
    }
    
    let search = TenantSearch {
      lbl: search.lbl.clone(),
      ..Default::default()
    };
    
    find_all_tenant(
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
    
    let search = TenantSearch {
      code: search.code.clone(),
      ..Default::default()
    };
    
    find_all_tenant(
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
  input: &TenantInput,
  model: &TenantModel,
) -> bool {
  if input.id.as_ref().is_some() {
    return input.id.as_ref().unwrap() == &model.id;
  }
  
  if
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

// MARK: check_by_unique_tenant
/// 通过唯一约束检查数据是否已经存在
#[allow(unused_variables)]
pub async fn check_by_unique_tenant(
  input: TenantInput,
  model: TenantModel,
  options: Option<Options>,
) -> Result<Option<TenantId>> {
  
  let table = "base_tenant";
  let method = "check_by_unique_tenant";
  
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
    let id = update_by_id_tenant(
      model.id.clone(),
      input,
      options,
    ).await?;
    return Ok(id.into());
  }
  if unique_type == UniqueType::Throw {
    let err_msg = "此 租户 已经存在";
    return Err(eyre!(err_msg));
  }
  Ok(None)
}

// MARK: set_id_by_lbl_tenant
/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(unused_variables, dead_code)]
pub async fn set_id_by_lbl_tenant(
  input: TenantInput,
) -> Result<TenantInput> {
  
  #[allow(unused_mut)]
  let mut input = input;
  
  let dict_vec = get_dict(&[
    "is_locked",
    "is_enabled",
  ]).await?;
  
  // 锁定
  if input.is_locked.is_none() {
    let is_locked_dict = &dict_vec[0];
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
  
  // 所属域名
  if input.domain_ids_lbl.is_some() && input.domain_ids.is_none() {
    input.domain_ids_lbl = input.domain_ids_lbl.map(|item| 
      item.into_iter()
        .map(|item| item.trim().to_owned())
        .filter(|item| !item.is_empty())
        .collect::<Vec<String>>()
    );
    input.domain_ids_lbl = input.domain_ids_lbl.map(|item| {
      let mut set = HashSet::new();
      item.into_iter()
        .filter(|item| set.insert(item.clone()))
        .collect::<Vec<String>>()
    });
    let mut models = vec![];
    for lbl in input.domain_ids_lbl.clone().unwrap_or_default() {
      let model = crate::base::domain::domain_dao::find_one_domain(
        crate::base::domain::domain_model::DomainSearch {
          lbl: lbl.into(),
          ..Default::default()
        }.into(),
        None,
        Some(Options::new().set_is_debug(Some(false))),
      ).await?;
      if let Some(model) = model {
        models.push(model);
      }
    }
    input.domain_ids = models.into_iter()
      .map(|item| item.id)
      .collect::<Vec<DomainId>>()
      .into();
  }
  
  // 菜单权限
  if input.menu_ids_lbl.is_some() && input.menu_ids.is_none() {
    input.menu_ids_lbl = input.menu_ids_lbl.map(|item| 
      item.into_iter()
        .map(|item| item.trim().to_owned())
        .filter(|item| !item.is_empty())
        .collect::<Vec<String>>()
    );
    input.menu_ids_lbl = input.menu_ids_lbl.map(|item| {
      let mut set = HashSet::new();
      item.into_iter()
        .filter(|item| set.insert(item.clone()))
        .collect::<Vec<String>>()
    });
    let mut models = vec![];
    for lbl in input.menu_ids_lbl.clone().unwrap_or_default() {
      let model = crate::base::menu::menu_dao::find_one_menu(
        crate::base::menu::menu_model::MenuSearch {
          lbl: lbl.into(),
          ..Default::default()
        }.into(),
        None,
        Some(Options::new().set_is_debug(Some(false))),
      ).await?;
      if let Some(model) = model {
        models.push(model);
      }
    }
    input.menu_ids = models.into_iter()
      .map(|item| item.id)
      .collect::<Vec<MenuId>>()
      .into();
  }
  
  // 语言
  if input.lang_id_lbl.is_some()
    && !input.lang_id_lbl.as_ref().unwrap().is_empty()
    && input.lang_id.is_none()
  {
    input.lang_id_lbl = input.lang_id_lbl.map(|item| 
      item.trim().to_owned()
    );
    let model = crate::base::lang::lang_dao::find_one_lang(
      crate::base::lang::lang_model::LangSearch {
        lbl: input.lang_id_lbl.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(model) = model {
      input.lang_id = model.id.into();
    }
  } else if
    (input.lang_id_lbl.is_none() || input.lang_id_lbl.as_ref().unwrap().is_empty())
    && input.lang_id.is_some()
  {
    let lang_model = crate::base::lang::lang_dao::find_one_lang(
      crate::base::lang::lang_model::LangSearch {
        id: input.lang_id.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(lang_model) = lang_model {
      input.lang_id_lbl = lang_model.lbl.into();
    }
  }
  
  // 锁定
  if
    input.is_locked_lbl.is_some() && !input.is_locked_lbl.as_ref().unwrap().is_empty()
    && input.is_locked.is_none()
  {
    let is_locked_dict = &dict_vec[0];
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
    let is_locked_dict = &dict_vec[0];
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
    let is_enabled_dict = &dict_vec[1];
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
    let is_enabled_dict = &dict_vec[1];
    let dict_model = is_enabled_dict.iter().find(|item| {
      item.val == input.is_enabled.unwrap_or_default().to_string()
    });
    let lbl = dict_model.map(|item| item.lbl.to_string());
    input.is_enabled_lbl = lbl;
  }
  
  Ok(input)
}

// MARK: creates_return_tenant
/// 批量创建租户并返回
#[allow(dead_code)]
pub async fn creates_return_tenant(
  inputs: Vec<TenantInput>,
  options: Option<Options>,
) -> Result<Vec<TenantModel>> {
  
  let table = "base_tenant";
  let method = "creates_return_tenant";
  
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
  
  let models_tenant = find_by_ids_tenant(
    ids,
    options,
  ).await?;
  
  Ok(models_tenant)
}

// MARK: creates_tenant
/// 批量创建租户
pub async fn creates_tenant(
  inputs: Vec<TenantInput>,
  options: Option<Options>,
) -> Result<Vec<TenantId>> {
  
  let table = "base_tenant";
  let method = "creates_tenant";
  
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

/// 批量创建租户
#[allow(unused_variables, clippy::redundant_locals)]
async fn _creates(
  inputs: Vec<TenantInput>,
  options: Option<Options>,
) -> Result<Vec<TenantId>> {
  
  let table = "base_tenant";
  
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
    ) = find_auto_code_tenant(options.clone()).await?;
    input.code_seq = Some(code_seq);
    input.code = Some(code);
  }
  
  let mut ids2: Vec<TenantId> = vec![];
  let mut inputs2: Vec<TenantInput> = vec![];
  
  for input in inputs {
  
    if input.id.is_some() {
      return Err(eyre!("Can not set id when create in dao: {table}"));
    }
    
    let old_models = find_by_unique_tenant(
      input.clone().into(),
      None,
      options.clone(),
    ).await?;
    
    if !old_models.is_empty() {
      let mut id: Option<TenantId> = None;
      
      for old_model in old_models {
        let options = Options::from(options.clone())
          .set_unique_type(unique_type);
        
        id = check_by_unique_tenant(
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
  let mut sql_fields = String::with_capacity(80 * 19 + 20);
  
  sql_fields += "id";
  sql_fields += ",create_time";
  sql_fields += ",update_time";
  sql_fields += ",create_usr_id";
  sql_fields += ",create_usr_id_lbl";
  sql_fields += ",update_usr_id";
  sql_fields += ",update_usr_id_lbl";
  // 编码-序列号
  sql_fields += ",code_seq";
  // 编码
  sql_fields += ",code";
  // 名称
  sql_fields += ",lbl";
  // 标题
  sql_fields += ",title";
  // 简介
  sql_fields += ",info";
  // 语言
  sql_fields += ",lang_id_lbl";
  // 语言
  sql_fields += ",lang_id";
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
  let mut sql_values = String::with_capacity((2 * 19 + 3) * inputs2_len);
  let mut inputs2_ids = vec![];
  
  for (i, input) in inputs2
    .clone()
    .into_iter()
    .enumerate()
  {
    
    let id: TenantId = get_short_uuid().into();
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
    // 名称
    if let Some(lbl) = input.lbl {
      sql_values += ",?";
      args.push(lbl.into());
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
    // 简介
    if let Some(info) = input.info {
      sql_values += ",?";
      args.push(info.into());
    } else {
      sql_values += ",default";
    }
    // 语言
    if let Some(lang_id_lbl) = input.lang_id_lbl {
      if !lang_id_lbl.is_empty() {
        sql_values += ",?";
        args.push(lang_id_lbl.into());
      } else {
        sql_values += ",default";
      }
    } else {
      sql_values += ",default";
    }
    // 语言
    if let Some(lang_id) = input.lang_id {
      sql_values += ",?";
      args.push(lang_id.into());
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
  
  del_caches(
    vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
  ).await?;
  
  let affected_rows = execute(
    sql,
    args,
    options.clone(),
  ).await?;
  
  del_caches(
    vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
  ).await?;
  
  if affected_rows != inputs2_len as u64 {
    return Err(eyre!("affectedRows: {affected_rows} != {inputs2_len}"));
  }
  
  for (i, input) in inputs2
    .into_iter()
    .enumerate()
  {
    let id = inputs2_ids.get(i).unwrap().clone();
    
    // 所属域名
    if let Some(domain_ids) = input.domain_ids {
      many2many_update(
        id.clone().into(),
        domain_ids
          .iter()
          .map(|item| item.clone().into())
          .collect(),
        ManyOpts {
          r#mod: "base",
          table: "tenant_domain",
          column1: "tenant_id",
          column2: "domain_id",
        },
      ).await?;
    }
    
    // 菜单权限
    if let Some(menu_ids) = input.menu_ids {
      many2many_update(
        id.clone().into(),
        menu_ids
          .iter()
          .map(|item| item.clone().into())
          .collect(),
        ManyOpts {
          r#mod: "base",
          table: "tenant_menu",
          column1: "tenant_id",
          column2: "menu_id",
        },
      ).await?;
    }
  }
  
  Ok(ids2)
}

// MARK: find_auto_code_tenant
/// 获得 租户 自动编码
pub async fn find_auto_code_tenant(
  options: Option<Options>,
) -> Result<(u32, String)> {
  
  let table = "base_tenant";
  let method = "find_auto_code_tenant";
  
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
  
  let model = find_one_tenant(
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
  
  let model_deleted = find_one_tenant(
    Some(TenantSearch {
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
  
  let code = format!("ZH{:03}", code_seq);
  
  Ok((code_seq, code))
}

// MARK: create_return_tenant
/// 创建租户并返回
#[allow(dead_code)]
pub async fn create_return_tenant(
  #[allow(unused_mut)]
  mut input: TenantInput,
  options: Option<Options>,
) -> Result<TenantModel> {
  
  let id = create_tenant(
    input.clone(),
    options.clone(),
  ).await?;
  
  let model_tenant = find_by_id_tenant(
    id,
    options,
  ).await?;
  
  if model_tenant.is_none() {
    let err_msg = "create_return_tenant: model_tenant.is_none()";
    return Err(eyre!(
      ServiceException {
        code: String::new(),
        message: err_msg.to_owned(),
        trace: true,
        ..Default::default()
      },
    ));
  }
  let model_tenant = model_tenant.unwrap();
  
  Ok(model_tenant)
}

// MARK: create_tenant
/// 创建租户
#[allow(dead_code)]
pub async fn create_tenant(
  #[allow(unused_mut)]
  mut input: TenantInput,
  options: Option<Options>,
) -> Result<TenantId> {
  
  let table = "base_tenant";
  let method = "create_tenant";
  
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

// MARK: update_by_id_tenant
/// 根据 id 修改租户
#[allow(unused_mut)]
#[allow(unused_variables)]
pub async fn update_by_id_tenant(
  id: TenantId,
  mut input: TenantInput,
  options: Option<Options>,
) -> Result<TenantId> {
  
  let table = "base_tenant";
  let method = "update_by_id_tenant";
  
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
  
  let old_model = find_by_id_tenant(
    id.clone(),
    options.clone(),
  ).await?;
  
  if old_model.is_none() {
    let err_msg = "编辑失败, 此 租户 已被删除";
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
    
    let models = find_by_unique_tenant(
      input.into(),
      None,
      options.clone(),
    ).await?;
    
    let models = models.into_iter()
      .filter(|item| 
        item.id != id
      )
      .collect::<Vec<TenantModel>>();
    
    if !models.is_empty() {
      let unique_type = options
        .as_ref()
        .and_then(|item| item.get_unique_type())
        .unwrap_or(UniqueType::Throw);
      if unique_type == UniqueType::Throw {
        let err_msg = "此 租户 已经存在";
        return Err(eyre!(err_msg));
      } else if unique_type == UniqueType::Ignore {
        return Ok(id);
      }
    }
  }
  
  let mut args = QueryArgs::new();
  
  let mut sql_fields = String::with_capacity(80 * 19 + 20);
  
  let mut field_num: usize = 0;
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
  // 名称
  if let Some(lbl) = input.lbl {
    field_num += 1;
    sql_fields += "lbl=?,";
    args.push(lbl.into());
  }
  // 标题
  if let Some(title) = input.title {
    field_num += 1;
    sql_fields += "title=?,";
    args.push(title.into());
  }
  // 简介
  if let Some(info) = input.info {
    field_num += 1;
    sql_fields += "info=?,";
    args.push(info.into());
  }
  // 语言
  if let Some(lang_id_lbl) = input.lang_id_lbl {
    if !lang_id_lbl.is_empty() {
      field_num += 1;
      sql_fields += "lang_id_lbl=?,";
      args.push(lang_id_lbl.into());
    }
  }
  // 语言
  if let Some(lang_id) = input.lang_id {
    field_num += 1;
    sql_fields += "lang_id=?,";
    args.push(lang_id.into());
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
  // 系统字段
  if let Some(is_sys) = input.is_sys {
    field_num += 1;
    sql_fields += "is_sys=?,";
    args.push(is_sys.into());
  }
  
  // 所属域名
  if input.domain_ids.is_some() {
    field_num += 1;
  }
  
  // 菜单权限
  if input.menu_ids.is_some() {
    field_num += 1;
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
    
    del_caches(
      vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
    ).await?;
    
    execute(
      sql,
      args,
      options.clone(),
    ).await?;
    
    del_caches(
      vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
    ).await?;
    
  }
  
  // 所属域名
  if let Some(domain_ids) = input.domain_ids {
    many2many_update(
      id.clone().into(),
      domain_ids
        .iter()
        .map(|item| item.clone().into())
        .collect(),
      ManyOpts {
        r#mod: "base",
        table: "tenant_domain",
        column1: "tenant_id",
        column2: "domain_id",
      },
    ).await?;
  }
  
  // 菜单权限
  if let Some(menu_ids) = input.menu_ids {
    many2many_update(
      id.clone().into(),
      menu_ids
        .iter()
        .map(|item| item.clone().into())
        .collect(),
      ManyOpts {
        r#mod: "base",
        table: "tenant_menu",
        column1: "tenant_id",
        column2: "menu_id",
      },
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
  let table = "base_tenant";
  vec![
    table,
  ]
}

// MARK: del_cache_tenant
/// 清空缓存
#[allow(dead_code)]
pub async fn del_cache_tenant() -> Result<()> {
  let cache_key1s = get_cache_tables();
  del_caches(
    cache_key1s.as_slice(),
  ).await?;
  Ok(())
}

// MARK: delete_by_ids_tenant
/// 根据 ids 删除租户
#[allow(unused_variables)]
pub async fn delete_by_ids_tenant(
  ids: Vec<TenantId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_tenant";
  let method = "delete_by_ids_tenant";
  
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
  
  del_caches(
    vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
  ).await?;
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let mut num = 0;
  for id in ids.clone() {
    
    let old_model = find_by_id_tenant(
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
    {
      let domain_ids = old_model.domain_ids.clone();
      if !domain_ids.is_empty() {
        let mut args = QueryArgs::new();
        let mut sql = "update base_tenant_domain set is_deleted=1 where tenant_id=? and".to_owned();
        args.push(id.clone().into());
        let arg = {
          let mut items = Vec::with_capacity(domain_ids.len());
          for item in domain_ids {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        };
        sql.push_str(" domain_id in (");
        sql.push_str(&arg);
        sql.push(')');
        sql.push_str(" and is_deleted=0");
        let sql = sql;
        let args: Vec<_> = args.into();
        execute(
          sql,
          args,
          options.clone(),
        ).await?;
      }
    }
    {
      let menu_ids = old_model.menu_ids.clone();
      if !menu_ids.is_empty() {
        let mut args = QueryArgs::new();
        let mut sql = "update base_tenant_menu set is_deleted=1 where tenant_id=? and".to_owned();
        args.push(id.clone().into());
        let arg = {
          let mut items = Vec::with_capacity(menu_ids.len());
          for item in menu_ids {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        };
        sql.push_str(" menu_id in (");
        sql.push_str(&arg);
        sql.push(')');
        sql.push_str(" and is_deleted=0");
        let sql = sql;
        let args: Vec<_> = args.into();
        execute(
          sql,
          args,
          options.clone(),
        ).await?;
      }
    }
  }
  
  if num > MAX_SAFE_INTEGER {
    return Err(eyre!("num: {} > MAX_SAFE_INTEGER", num));
  }
  
  del_caches(
    vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
  ).await?;
  
  Ok(num)
}

// MARK: get_is_enabled_by_id_tenant
/// 根据 id 查找租户是否已启用
/// 记录不存在则返回 false
pub async fn get_is_enabled_by_id_tenant(
  id: TenantId,
  options: Option<Options>,
) -> Result<bool> {
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let model = find_by_id_tenant(
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

// MARK: enable_by_ids_tenant
/// 根据 ids 启用或者禁用租户
pub async fn enable_by_ids_tenant(
  ids: Vec<TenantId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_tenant";
  let method = "enable_by_ids_tenant";
  
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
  
  del_caches(
    vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
  ).await?;
  
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
  
  del_caches(
    vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
  ).await?;
  
  Ok(num)
}

// MARK: get_is_locked_by_id_tenant
/// 根据 id 查找租户是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
pub async fn get_is_locked_by_id_tenant(
  id: TenantId,
  options: Option<Options>,
) -> Result<bool> {
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let model = find_by_id_tenant(
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

// MARK: lock_by_ids_tenant
/// 根据 ids 锁定或者解锁租户
pub async fn lock_by_ids_tenant(
  ids: Vec<TenantId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_tenant";
  let method = "lock_by_ids_tenant";
  
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
  
  del_caches(
    vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
  ).await?;
  
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
  
  del_caches(
    vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
  ).await?;
  
  Ok(num)
}

// MARK: revert_by_ids_tenant
/// 根据 ids 还原租户
pub async fn revert_by_ids_tenant(
  ids: Vec<TenantId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_tenant";
  let method = "revert_by_ids_tenant";
  
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
  
  del_caches(
    vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
  ).await?;
  
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
    
    let mut old_model = find_one_tenant(
      TenantSearch {
        id: Some(id.clone()),
        is_deleted: Some(1),
        ..Default::default()
      }.into(),
      None,
      options.clone(),
    ).await?;
    
    if old_model.is_none() {
      old_model = find_by_id_tenant(
        id.clone(),
        options.clone(),
      ).await?;
    }
    
    if old_model.is_none() {
      continue;
    }
    let old_model = old_model.unwrap();
    
    {
      let mut input: TenantInput = old_model.clone().into();
      input.id = None;
      
      let models = find_by_unique_tenant(
        input.into(),
        None,
        options.clone(),
      ).await?;
      
      let models: Vec<TenantModel> = models
        .into_iter()
        .filter(|item| 
          item.id != id
        )
        .collect();
      
      if !models.is_empty() {
        let err_msg = "此 租户 已经存在";
        return Err(eyre!(err_msg));
      }
    }
    
    num += execute(
      sql,
      args,
      options.clone(),
    ).await?;
    {
      let domain_ids = old_model.domain_ids.clone();
      if !domain_ids.is_empty() {
        let mut args = QueryArgs::new();
        let mut sql = "update base_tenant_domain set is_deleted=0 where tenant_id=? and".to_owned();
        args.push(id.clone().into());
        let arg = {
          let mut items = Vec::with_capacity(domain_ids.len());
          for item in domain_ids {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        };
        sql.push_str(" domain_id in (");
        sql.push_str(&arg);
        sql.push(')');
        sql.push_str(" and is_deleted=1");
        let sql = sql;
        let args: Vec<_> = args.into();
        execute(
          sql,
          args,
          options.clone(),
        ).await?;
      }
    }
    {
      let menu_ids = old_model.menu_ids.clone();
      if !menu_ids.is_empty() {
        let mut args = QueryArgs::new();
        let mut sql = "update base_tenant_menu set is_deleted=0 where tenant_id=? and".to_owned();
        args.push(id.clone().into());
        let arg = {
          let mut items = Vec::with_capacity(menu_ids.len());
          for item in menu_ids {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        };
        sql.push_str(" menu_id in (");
        sql.push_str(&arg);
        sql.push(')');
        sql.push_str(" and is_deleted=1");
        let sql = sql;
        let args: Vec<_> = args.into();
        execute(
          sql,
          args,
          options.clone(),
        ).await?;
      }
    }
    
  }
  
  del_caches(
    vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
  ).await?;
  
  Ok(num)
}

// MARK: force_delete_by_ids_tenant
/// 根据 ids 彻底删除租户
#[allow(unused_variables)]
pub async fn force_delete_by_ids_tenant(
  ids: Vec<TenantId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_tenant";
  let method = "force_delete_by_ids_tenant";
  
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
    
    let old_model = find_all_tenant(
      TenantSearch {
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
    
    del_caches(
      vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
    ).await?;
    
    num += execute(
      sql,
      args,
      options.clone(),
    ).await?;
    {
      let domain_ids = old_model.domain_ids.clone();
      if !domain_ids.is_empty() {
        let mut args = QueryArgs::new();
        let mut sql = "delete from base_tenant_domain where tenant_id=? and".to_owned();
        args.push(id.clone().into());
        let mut items = Vec::with_capacity(domain_ids.len());
        for item in domain_ids {
          items.push("?");
          args.push(item.clone().into());
        }
        sql.push_str(" domain_id in (");
        sql.push_str(&items.join(","));
        sql.push(')');
        let args: Vec<_> = args.into();
        execute(
          sql,
          args,
          options.clone(),
        ).await?;
      }
    }
    {
      let menu_ids = old_model.menu_ids.clone();
      if !menu_ids.is_empty() {
        let mut args = QueryArgs::new();
        let mut sql = "delete from base_tenant_menu where tenant_id=? and".to_owned();
        args.push(id.clone().into());
        let mut items = Vec::with_capacity(menu_ids.len());
        for item in menu_ids {
          items.push("?");
          args.push(item.clone().into());
        }
        sql.push_str(" menu_id in (");
        sql.push_str(&items.join(","));
        sql.push(')');
        let args: Vec<_> = args.into();
        execute(
          sql,
          args,
          options.clone(),
        ).await?;
      }
    }
    
    del_caches(
      vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
    ).await?;
  }
  
  Ok(num)
}

// MARK: find_last_order_by_tenant
/// 查找 租户 order_by 字段的最大值
pub async fn find_last_order_by_tenant(
  options: Option<Options>,
) -> Result<u32> {
  
  let table = "base_tenant";
  let method = "find_last_order_by_tenant";
  
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

// MARK: validate_is_enabled_tenant
/// 校验租户是否启用
#[allow(dead_code)]
pub async fn validate_is_enabled_tenant(
  model: &TenantModel,
) -> Result<()> {
  if model.is_enabled == 0 {
    let err_msg = "租户已禁用";
    return Err(eyre!(err_msg));
  }
  Ok(())
}

// MARK: validate_option_tenant
/// 校验租户是否存在
#[allow(dead_code)]
pub async fn validate_option_tenant(
  model: Option<TenantModel>,
) -> Result<TenantModel> {
  if model.is_none() {
    let err_msg = "租户不存在";
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
