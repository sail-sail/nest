
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

use super::role_model::*;

use crate::base::tenant::tenant_model::TenantId;
use crate::base::menu::menu_model::MenuId;
use crate::base::permit::permit_model::PermitId;
use crate::base::data_permit::data_permit_model::DataPermitId;
use crate::base::field_permit::field_permit_model::FieldPermitId;
use crate::base::usr::usr_model::UsrId;

use crate::base::usr::usr_dao::find_by_id_usr;

#[allow(unused_variables)]
async fn get_where_query(
  args: &mut QueryArgs,
  search: Option<&RoleSearch>,
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
    let ids: Option<Vec<RoleId>> = match search {
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
  {
    let keyword: Option<String> = match search {
      Some(item) => item.keyword.clone(),
      None => None,
    };
    if let Some(keyword) = keyword && !keyword.is_empty() {
      where_query.push_str(" and (");
      where_query.push_str(" t.code like ?");
      args.push(format!("%{}%", sql_like(&keyword)).into());
        
      where_query.push_str(" or");
      where_query.push_str(" t.lbl like ?");
      args.push(format!("%{}%", sql_like(&keyword)).into());
        
      where_query.push_str(" or");
      where_query.push_str(" t.rem like ?");
      args.push(format!("%{}%", sql_like(&keyword)).into());
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
  // 首页
  {
    let home_url = match search {
      Some(item) => item.home_url.clone(),
      None => None,
    };
    if let Some(home_url) = home_url {
      where_query.push_str(" and t.home_url=?");
      args.push(home_url.into());
    }
    let home_url_like = match search {
      Some(item) => item.home_url_like.clone(),
      None => None,
    };
    if let Some(home_url_like) = home_url_like && !home_url_like.is_empty() {
      where_query.push_str(" and t.home_url like ?");
      args.push(format!("%{}%", sql_like(&home_url_like)).into());
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
  {
    let menu_ids_lbl_like = match search {
      Some(item) => item.menu_ids_lbl_like.clone(),
      None => None,
    };
    if let Some(menu_ids_lbl_like) = menu_ids_lbl_like && !menu_ids_lbl_like.is_empty() {
      where_query.push_str(" and base_menu.lbl like ?");
      args.push(format!("%{}%", sql_like(&menu_ids_lbl_like)).into());
    }
  }
  // 按钮权限
  {
    let permit_ids: Option<Vec<PermitId>> = match search {
      Some(item) => item.permit_ids.clone(),
      None => None,
    };
    if let Some(permit_ids) = permit_ids {
      let arg = {
        if permit_ids.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(permit_ids.len());
          for item in permit_ids {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and base_permit.id in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let permit_ids_is_null: bool = match search {
      Some(item) => item.permit_ids_is_null.unwrap_or(false),
      None => false,
    };
    if permit_ids_is_null {
      where_query.push_str(" and t.permit_ids is null");
    }
  }
  {
    let permit_ids_lbl_like = match search {
      Some(item) => item.permit_ids_lbl_like.clone(),
      None => None,
    };
    if let Some(permit_ids_lbl_like) = permit_ids_lbl_like && !permit_ids_lbl_like.is_empty() {
      where_query.push_str(" and base_permit.lbl like ?");
      args.push(format!("%{}%", sql_like(&permit_ids_lbl_like)).into());
    }
  }
  // 数据权限
  {
    let data_permit_ids: Option<Vec<DataPermitId>> = match search {
      Some(item) => item.data_permit_ids.clone(),
      None => None,
    };
    if let Some(data_permit_ids) = data_permit_ids {
      let arg = {
        if data_permit_ids.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(data_permit_ids.len());
          for item in data_permit_ids {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and base_data_permit.id in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let data_permit_ids_is_null: bool = match search {
      Some(item) => item.data_permit_ids_is_null.unwrap_or(false),
      None => false,
    };
    if data_permit_ids_is_null {
      where_query.push_str(" and t.data_permit_ids is null");
    }
  }
  // 字段权限
  {
    let field_permit_ids: Option<Vec<FieldPermitId>> = match search {
      Some(item) => item.field_permit_ids.clone(),
      None => None,
    };
    if let Some(field_permit_ids) = field_permit_ids {
      let arg = {
        if field_permit_ids.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(field_permit_ids.len());
          for item in field_permit_ids {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and base_field_permit.id in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let field_permit_ids_is_null: bool = match search {
      Some(item) => item.field_permit_ids_is_null.unwrap_or(false),
      None => false,
    };
    if field_permit_ids_is_null {
      where_query.push_str(" and t.field_permit_ids is null");
    }
  }
  {
    let field_permit_ids_lbl_like = match search {
      Some(item) => item.field_permit_ids_lbl_like.clone(),
      None => None,
    };
    if let Some(field_permit_ids_lbl_like) = field_permit_ids_lbl_like && !field_permit_ids_lbl_like.is_empty() {
      where_query.push_str(" and base_field_permit.lbl like ?");
      args.push(format!("%{}%", sql_like(&field_permit_ids_lbl_like)).into());
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
  search: Option<&RoleSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let is_deleted = search
    .and_then(|item| item.is_deleted)
    .unwrap_or(0);
  
  let from_query = r#"base_role t
  left join base_role_menu on base_role_menu.role_id=t.id and base_role_menu.is_deleted=?
  left join base_menu on base_role_menu.menu_id=base_menu.id and base_menu.is_deleted=?
  left join (select json_objectagg(base_role_menu.order_by,base_menu.id) menu_ids,
  json_objectagg(base_role_menu.order_by,base_menu.lbl) menu_ids_lbl,
  base_role.id role_id from base_role_menu
  inner join base_menu on base_menu.id=base_role_menu.menu_id
  inner join base_role on base_role.id=base_role_menu.role_id where base_role_menu.is_deleted=?
  group by role_id) _menu on _menu.role_id=t.id
  left join base_role_permit on base_role_permit.role_id=t.id and base_role_permit.is_deleted=?
  left join base_permit on base_role_permit.permit_id=base_permit.id
  left join (select json_objectagg(base_role_permit.order_by,base_permit.id) permit_ids,
  json_objectagg(base_role_permit.order_by,base_permit.lbl) permit_ids_lbl,
  base_role.id role_id from base_role_permit
  inner join base_permit on base_permit.id=base_role_permit.permit_id
  inner join base_role on base_role.id=base_role_permit.role_id where base_role_permit.is_deleted=?
  group by role_id) _permit on _permit.role_id=t.id
  left join base_role_data_permit on base_role_data_permit.role_id=t.id and base_role_data_permit.is_deleted=?
  left join base_data_permit on base_role_data_permit.data_permit_id=base_data_permit.id and base_data_permit.is_deleted=?
  left join (select json_objectagg(base_role_data_permit.order_by,base_data_permit.id) data_permit_ids,
  base_role.id role_id from base_role_data_permit
  inner join base_data_permit on base_data_permit.id=base_role_data_permit.data_permit_id
  inner join base_role on base_role.id=base_role_data_permit.role_id where base_role_data_permit.is_deleted=?
  group by role_id) _data_permit on _data_permit.role_id=t.id
  left join base_role_field_permit on base_role_field_permit.role_id=t.id and base_role_field_permit.is_deleted=?
  left join base_field_permit on base_role_field_permit.field_permit_id=base_field_permit.id
  left join (select json_objectagg(base_role_field_permit.order_by,base_field_permit.id) field_permit_ids,
  json_objectagg(base_role_field_permit.order_by,base_field_permit.lbl) field_permit_ids_lbl,
  base_role.id role_id from base_role_field_permit
  inner join base_field_permit on base_field_permit.id=base_role_field_permit.field_permit_id
  inner join base_role on base_role.id=base_role_field_permit.role_id where base_role_field_permit.is_deleted=?
  group by role_id) _field_permit on _field_permit.role_id=t.id"#.to_owned();
  for _ in 0..10 {
    args.push(is_deleted.into());
  }
  Ok(from_query)
}

// MARK: find_all_role
/// 根据搜索条件和分页查找角色列表
#[allow(unused_mut)]
pub async fn find_all_role(
  search: Option<RoleSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<RoleModel>> {
  
  let table = get_table_name_role();
  let method = "find_all_role";
  
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
  // 菜单权限
  if let Some(search) = &search && search.menu_ids.is_some() {
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
  // 按钮权限
  if let Some(search) = &search && search.permit_ids.is_some() {
    let len = search.permit_ids.as_ref().unwrap().len();
    if len == 0 {
      return Ok(vec![]);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.permit_ids.length > {ids_limit}"));
    }
  }
  // 数据权限
  if let Some(search) = &search && search.data_permit_ids.is_some() {
    let len = search.data_permit_ids.as_ref().unwrap().len();
    if len == 0 {
      return Ok(vec![]);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.data_permit_ids.length > {ids_limit}"));
    }
  }
  // 字段权限
  if let Some(search) = &search && search.field_permit_ids.is_some() {
    let len = search.field_permit_ids.as_ref().unwrap().len();
    if len == 0 {
      return Ok(vec![]);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.field_permit_ids.length > {ids_limit}"));
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
  let page_query = get_page_query(page);
  
  let sql = format!(r#"select f.* from (select t.*
  ,max(menu_ids) menu_ids
  ,max(menu_ids_lbl) menu_ids_lbl
  ,max(permit_ids) permit_ids
  ,max(permit_ids_lbl) permit_ids_lbl
  ,max(data_permit_ids) data_permit_ids
  ,max(field_permit_ids) field_permit_ids
  ,max(field_permit_ids_lbl) field_permit_ids_lbl
  from {from_query} where {where_query} group by t.id{order_by_query}) f {page_query}"#);
  
  let args = args.into();
  
  let options = Options::from(options);
  
  let options = options.set_cache_key(table, &sql, &args);
  
  let mut res: Vec<RoleModel> = query(
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

// MARK: find_count_role
/// 根据条件查找角色总数
pub async fn find_count_role(
  search: Option<RoleSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_role();
  let method = "find_count_role";
  
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
  // 菜单权限
  if let Some(search) = &search && search.menu_ids.is_some() {
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
  // 按钮权限
  if let Some(search) = &search && search.permit_ids.is_some() {
    let len = search.permit_ids.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.permit_ids.length > {ids_limit}"));
    }
  }
  // 数据权限
  if let Some(search) = &search && search.data_permit_ids.is_some() {
    let len = search.data_permit_ids.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.data_permit_ids.length > {ids_limit}"));
    }
  }
  // 字段权限
  if let Some(search) = &search && search.field_permit_ids.is_some() {
    let len = search.field_permit_ids.as_ref().unwrap().len();
    if len == 0 {
      return Ok(0);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.field_permit_ids.length > {ids_limit}"));
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

// MARK: get_field_comments_role
/// 获取角色字段注释
#[allow(unused_mut)]
pub async fn get_field_comments_role(
  _options: Option<Options>,
) -> Result<RoleFieldComment> {
  
  let mut field_comments = RoleFieldComment {
    id: "ID".into(),
    code: "编码".into(),
    lbl: "名称".into(),
    home_url: "首页".into(),
    menu_ids: "菜单权限".into(),
    menu_ids_lbl: "菜单权限".into(),
    permit_ids: "按钮权限".into(),
    permit_ids_lbl: "按钮权限".into(),
    data_permit_ids: "数据权限".into(),
    data_permit_ids_lbl: "数据权限".into(),
    field_permit_ids: "字段权限".into(),
    field_permit_ids_lbl: "字段权限".into(),
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

// MARK: find_one_ok_role
/// 根据条件查找第一个角色, 如果不存在则抛错
#[allow(dead_code)]
pub async fn find_one_ok_role(
  search: Option<RoleSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<RoleModel> {
  
  let table = get_table_name_role();
  let method = "find_one_ok_role";
  
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
  
  let role_model = find_one_role(
    search,
    sort,
    options,
  ).await?;
  
  let Some(role_model) = role_model else {
    let err_msg = "此 角色 已被删除";
    return Err(eyre!(err_msg));
  };
  
  Ok(role_model)
}

// MARK: find_one_role
/// 根据条件查找第一个角色
#[allow(dead_code)]
pub async fn find_one_role(
  search: Option<RoleSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<RoleModel>> {
  
  let table = get_table_name_role();
  let method = "find_one_role";
  
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
  
  let res = find_all_role(
    search,
    page,
    sort,
    options,
  ).await?;
  
  let model: Option<RoleModel> = res.into_iter().next();
  
  Ok(model)
}

// MARK: find_by_id_ok_role
/// 根据 id 查找角色, 如果不存在则抛错
#[allow(dead_code)]
pub async fn find_by_id_ok_role(
  id: RoleId,
  options: Option<Options>,
) -> Result<RoleModel> {
  
  let table = get_table_name_role();
  let method = "find_by_id_ok_role";
  
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
  
  let role_model = find_by_id_role(
    id,
    options,
  ).await?;
  
  let Some(role_model) = role_model else {
    let err_msg = "此 角色 已被删除";
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
  
  Ok(role_model)
}

// MARK: find_by_id_role
/// 根据 id 查找角色
pub async fn find_by_id_role(
  id: RoleId,
  options: Option<Options>,
) -> Result<Option<RoleModel>> {
  
  let table = get_table_name_role();
  let method = "find_by_id_role";
  
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
  
  let search = RoleSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let role_model = find_one_role(
    search,
    None,
    options,
  ).await?;
  
  Ok(role_model)
}

// MARK: find_by_ids_ok_role
/// 根据 ids 查找角色, 出现查询不到的 id 则报错
#[allow(dead_code)]
pub async fn find_by_ids_ok_role(
  ids: Vec<RoleId>,
  options: Option<Options>,
) -> Result<Vec<RoleModel>> {
  
  let table = get_table_name_role();
  let method = "find_by_ids_ok_role";
  
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
  
  let role_models = find_by_ids_role(
    ids.clone(),
    options,
  ).await?;
  
  if role_models.len() != len {
    let err_msg = "此 角色 已被删除";
    return Err(eyre!(err_msg));
  }
  
  let role_models = ids
    .into_iter()
    .map(|id| {
      let model = role_models
        .iter()
        .find(|item| item.id == id);
      if let Some(model) = model {
        return Ok(model.clone());
      }
      let err_msg = "此 角色 已经被删除";
      Err(eyre!(err_msg))
    })
    .collect::<Result<Vec<RoleModel>>>()?;
  
  Ok(role_models)
}

// MARK: find_by_ids_role
/// 根据 ids 查找角色
#[allow(dead_code)]
pub async fn find_by_ids_role(
  ids: Vec<RoleId>,
  options: Option<Options>,
) -> Result<Vec<RoleModel>> {
  
  let table = get_table_name_role();
  let method = "find_by_ids_role";
  
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
  
  let search = RoleSearch {
    ids: Some(ids.clone()),
    ..Default::default()
  }.into();
  
  let role_models = find_all_role(
    search,
    None,
    None,
    options,
  ).await?;
  
  let role_models = ids
    .into_iter()
    .filter_map(|id| {
      role_models
        .iter()
        .find(|item| item.id == id)
        .cloned()
    })
    .collect::<Vec<RoleModel>>();
  
  Ok(role_models)
}

// MARK: exists_role
/// 根据搜索条件判断角色是否存在
#[allow(dead_code)]
pub async fn exists_role(
  search: Option<RoleSearch>,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = get_table_name_role();
  let method = "exists_role";
  
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
  // 菜单权限
  if let Some(search) = &search && search.menu_ids.is_some() {
    let len = search.menu_ids.as_ref().unwrap().len();
    if len == 0 {
      return Ok(false);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.menu_ids.length > {ids_limit}"));
    }
  }
  // 按钮权限
  if let Some(search) = &search && search.permit_ids.is_some() {
    let len = search.permit_ids.as_ref().unwrap().len();
    if len == 0 {
      return Ok(false);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.permit_ids.length > {ids_limit}"));
    }
  }
  // 数据权限
  if let Some(search) = &search && search.data_permit_ids.is_some() {
    let len = search.data_permit_ids.as_ref().unwrap().len();
    if len == 0 {
      return Ok(false);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.data_permit_ids.length > {ids_limit}"));
    }
  }
  // 字段权限
  if let Some(search) = &search && search.field_permit_ids.is_some() {
    let len = search.field_permit_ids.as_ref().unwrap().len();
    if len == 0 {
      return Ok(false);
    }
    let ids_limit = options
      .as_ref()
      .and_then(|x| x.get_ids_limit())
      .unwrap_or(FIND_ALL_IDS_LIMIT);
    if len > ids_limit {
      return Err(eyre!("search.field_permit_ids.length > {ids_limit}"));
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

// MARK: exists_by_id_role
/// 根据 id 判断角色是否存在
#[allow(dead_code)]
pub async fn exists_by_id_role(
  id: RoleId,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = get_table_name_role();
  let method = "exists_by_id_role";
  
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
  
  let search = RoleSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let exists = exists_role(
    search,
    options,
  ).await?;
  
  Ok(exists)
}

// MARK: find_by_unique_role
/// 通过唯一约束获得数据列表
#[allow(unused_variables)]
pub async fn find_by_unique_role(
  search: RoleSearch,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<RoleModel>> {
  
  let table = get_table_name_role();
  let method = "find_by_unique_role";
  
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
    let model = find_by_id_role(
      id,
      options.clone(),
    ).await?;
    return Ok(model.map_or_else(Vec::new, |m| vec![m]));
  }
  
  let mut models: Vec<RoleModel> = vec![];
  
  let mut models_tmp = {
    if
      search.lbl.is_none()
    {
      return Ok(vec![]);
    }
    
    let search = RoleSearch {
      lbl: search.lbl.clone(),
      ..Default::default()
    };
    
    find_all_role(
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
    
    let search = RoleSearch {
      code: search.code.clone(),
      ..Default::default()
    };
    
    find_all_role(
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
  input: &RoleInput,
  model: &RoleModel,
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

// MARK: check_by_unique_role
/// 通过唯一约束检查数据是否已经存在
#[allow(unused_variables)]
pub async fn check_by_unique_role(
  input: RoleInput,
  model: RoleModel,
  options: Option<Options>,
) -> Result<Option<RoleId>> {
  
  let table = get_table_name_role();
  let method = "check_by_unique_role";
  
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
    let id = update_by_id_role(
      model.id,
      input,
      options,
    ).await?;
    return Ok(id.into());
  }
  if unique_type == UniqueType::Throw {
    let err_msg = "角色 重复";
    return Err(eyre!(err_msg));
  }
  Ok(None)
}

// MARK: set_id_by_lbl_role
/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(unused_variables, dead_code)]
pub async fn set_id_by_lbl_role(
  input: RoleInput,
) -> Result<RoleInput> {
  
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
  
  // 按钮权限
  if input.permit_ids_lbl.is_some() && input.permit_ids.is_none() {
    input.permit_ids_lbl = input.permit_ids_lbl.map(|item| 
      item.into_iter()
        .map(|item| item.trim().to_owned())
        .filter(|item| !item.is_empty())
        .collect::<Vec<String>>()
    );
    input.permit_ids_lbl = input.permit_ids_lbl.map(|item| {
      let mut set = HashSet::new();
      item.into_iter()
        .filter(|item| set.insert(item.clone()))
        .collect::<Vec<String>>()
    });
    let mut models = vec![];
    for lbl in input.permit_ids_lbl.clone().unwrap_or_default() {
      let model = crate::base::permit::permit_dao::find_one_permit(
        crate::base::permit::permit_model::PermitSearch {
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
    input.permit_ids = models.into_iter()
      .map(|item| item.id)
      .collect::<Vec<PermitId>>()
      .into();
  }
  
  // 字段权限
  if input.field_permit_ids_lbl.is_some() && input.field_permit_ids.is_none() {
    input.field_permit_ids_lbl = input.field_permit_ids_lbl.map(|item| 
      item.into_iter()
        .map(|item| item.trim().to_owned())
        .filter(|item| !item.is_empty())
        .collect::<Vec<String>>()
    );
    input.field_permit_ids_lbl = input.field_permit_ids_lbl.map(|item| {
      let mut set = HashSet::new();
      item.into_iter()
        .filter(|item| set.insert(item.clone()))
        .collect::<Vec<String>>()
    });
    let mut models = vec![];
    for lbl in input.field_permit_ids_lbl.clone().unwrap_or_default() {
      let model = crate::base::field_permit::field_permit_dao::find_one_field_permit(
        crate::base::field_permit::field_permit_model::FieldPermitSearch {
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
    input.field_permit_ids = models.into_iter()
      .map(|item| item.id)
      .collect::<Vec<FieldPermitId>>()
      .into();
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

// MARK: creates_return_role
/// 批量创建角色并返回
#[allow(dead_code)]
pub async fn creates_return_role(
  inputs: Vec<RoleInput>,
  options: Option<Options>,
) -> Result<Vec<RoleModel>> {
  
  let table = get_table_name_role();
  let method = "creates_return_role";
  
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
  
  let models_role = find_by_ids_role(
    ids,
    options,
  ).await?;
  
  Ok(models_role)
}

// MARK: creates_role
/// 批量创建角色
pub async fn creates_role(
  inputs: Vec<RoleInput>,
  options: Option<Options>,
) -> Result<Vec<RoleId>> {
  
  let table = get_table_name_role();
  let method = "creates_role";
  
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

/// 批量创建角色
#[allow(unused_variables, clippy::redundant_locals)]
async fn _creates(
  inputs: Vec<RoleInput>,
  options: Option<Options>,
) -> Result<Vec<RoleId>> {
  
  let table = get_table_name_role();
  
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
    ) = find_auto_code_role(options.clone()).await?;
    input.code_seq = Some(code_seq);
    input.code = Some(code);
  }
  
  let mut ids2: Vec<RoleId> = vec![];
  let mut inputs2: Vec<RoleInput> = vec![];
  
  for input in inputs {
  
    if input.id.is_some() {
      return Err(eyre!("Can not set id when create in dao: {table}"));
    }
    
    let mut input = input;
    if input.menu_ids.is_some() {
      input.menu_ids = crate::common::tenant::tenant_dao::filter_menu_ids_by_tenant(
        input.menu_ids.unwrap(),
      ).await?.into();
    }
    let input = input;
    
    let old_models = find_by_unique_role(
      input.clone().into(),
      None,
      options.clone(),
    ).await?;
    
    if !old_models.is_empty() {
      let mut id: Option<RoleId> = None;
      
      for old_model in old_models {
        let options = Options::from(options.clone())
          .set_unique_type(unique_type);
        
        id = check_by_unique_role(
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
  // 名称
  sql_fields += ",lbl";
  // 首页
  sql_fields += ",home_url";
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
  let mut sql_values = String::with_capacity((2 * 20 + 3) * inputs2_len);
  let mut inputs2_ids = vec![];
  
  for (i, input) in inputs2
    .clone()
    .into_iter()
    .enumerate()
  {
    
    let id: RoleId = get_short_uuid().into();
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
    // 名称
    if let Some(lbl) = input.lbl {
      sql_values += ",?";
      args.push(lbl.into());
    } else {
      sql_values += ",default";
    }
    // 首页
    if let Some(home_url) = input.home_url {
      sql_values += ",?";
      args.push(home_url.into());
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
    
    // 菜单权限
    if let Some(menu_ids) = input.menu_ids {
      many2many_update(
        id.into(),
        menu_ids
          .into_iter()
          .map(|item| item.into())
          .collect(),
        ManyOpts {
          r#mod: "base",
          table: "role_menu",
          column1: "role_id",
          column2: "menu_id",
        },
      ).await?;
    }
    
    // 按钮权限
    if let Some(permit_ids) = input.permit_ids {
      many2many_update(
        id.into(),
        permit_ids
          .into_iter()
          .map(|item| item.into())
          .collect(),
        ManyOpts {
          r#mod: "base",
          table: "role_permit",
          column1: "role_id",
          column2: "permit_id",
        },
      ).await?;
    }
    
    // 数据权限
    if let Some(data_permit_ids) = input.data_permit_ids {
      many2many_update(
        id.into(),
        data_permit_ids
          .into_iter()
          .map(|item| item.into())
          .collect(),
        ManyOpts {
          r#mod: "base",
          table: "role_data_permit",
          column1: "role_id",
          column2: "data_permit_id",
        },
      ).await?;
    }
    
    // 字段权限
    if let Some(field_permit_ids) = input.field_permit_ids {
      many2many_update(
        id.into(),
        field_permit_ids
          .into_iter()
          .map(|item| item.into())
          .collect(),
        ManyOpts {
          r#mod: "base",
          table: "role_field_permit",
          column1: "role_id",
          column2: "field_permit_id",
        },
      ).await?;
    }
  }
  
  Ok(ids2)
}

// MARK: find_auto_code_role
/// 获得 角色 自动编码
pub async fn find_auto_code_role(
  options: Option<Options>,
) -> Result<(u32, String)> {
  
  let table = get_table_name_role();
  let method = "find_auto_code_role";
  
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
  
  let model = find_one_role(
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
  
  let model_deleted = find_one_role(
    Some(RoleSearch {
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
  
  let code = format!("JS{code_seq:03}");
  
  Ok((code_seq, code))
}

// MARK: create_return_role
/// 创建角色并返回
#[allow(dead_code)]
pub async fn create_return_role(
  #[allow(unused_mut)]
  mut input: RoleInput,
  options: Option<Options>,
) -> Result<RoleModel> {
  
  let id = create_role(
    input.clone(),
    options.clone(),
  ).await?;
  
  let model_role = find_by_id_role(
    id,
    options,
  ).await?;
  
  if model_role.is_none() {
    let err_msg = "create_return_role: model_role.is_none()";
    return Err(eyre!(
      ServiceException {
        message: err_msg.to_owned(),
        trace: true,
        ..Default::default()
      },
    ));
  }
  let model_role = model_role.unwrap();
  
  Ok(model_role)
}

// MARK: create_role
/// 创建角色
#[allow(dead_code)]
pub async fn create_role(
  #[allow(unused_mut)]
  mut input: RoleInput,
  options: Option<Options>,
) -> Result<RoleId> {
  
  let table = get_table_name_role();
  let method = "create_role";
  
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

// MARK: update_tenant_by_id_role
/// 角色根据id修改租户id
pub async fn update_tenant_by_id_role(
  id: RoleId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  let table = get_table_name_role();
  let method = "update_tenant_by_id_role";
  
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

// MARK: update_by_id_role
/// 根据 id 修改角色
#[allow(unused_mut)]
#[allow(unused_variables)]
pub async fn update_by_id_role(
  id: RoleId,
  mut input: RoleInput,
  options: Option<Options>,
) -> Result<RoleId> {
  
  let table = get_table_name_role();
  let method = "update_by_id_role";
  
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
  
  if input.menu_ids.is_some() {
    input.menu_ids = crate::common::tenant::tenant_dao::filter_menu_ids_by_tenant(
      input.menu_ids.unwrap(),
    ).await?.into();
  }
  
  let old_model = find_by_id_role(
    id,
    options.clone(),
  ).await?;
  
  if old_model.is_none() {
    let err_msg = "编辑失败, 此 角色 已被删除";
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
    
    let models = find_by_unique_role(
      input.into(),
      None,
      options.clone(),
    ).await?;
    
    let models = models.into_iter()
      .filter(|item| 
        item.id != id
      )
      .collect::<Vec<RoleModel>>();
    
    if !models.is_empty() {
      let unique_type = options
        .as_ref()
        .and_then(|item| item.get_unique_type())
        .unwrap_or(UniqueType::Throw);
      if unique_type == UniqueType::Throw {
        let err_msg = "角色 重复";
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
  // 名称
  if let Some(lbl) = input.lbl {
    field_num += 1;
    sql_fields += "lbl=?,";
    args.push(lbl.into());
  }
  // 首页
  if let Some(home_url) = input.home_url {
    field_num += 1;
    sql_fields += "home_url=?,";
    args.push(home_url.into());
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
  
  // 菜单权限
  if input.menu_ids.is_some() {
    field_num += 1;
  }
  
  // 按钮权限
  if input.permit_ids.is_some() {
    field_num += 1;
  }
  
  // 数据权限
  if input.data_permit_ids.is_some() {
    field_num += 1;
  }
  
  // 字段权限
  if input.field_permit_ids.is_some() {
    field_num += 1;
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
  
  // 菜单权限
  if let Some(menu_ids) = input.menu_ids {
    many2many_update(
      id.into(),
      menu_ids
        .into_iter()
        .map(|item| item.into())
        .collect(),
      ManyOpts {
        r#mod: "base",
        table: "role_menu",
        column1: "role_id",
        column2: "menu_id",
      },
    ).await?;
  }
  
  // 按钮权限
  if let Some(permit_ids) = input.permit_ids {
    many2many_update(
      id.into(),
      permit_ids
        .into_iter()
        .map(|item| item.into())
        .collect(),
      ManyOpts {
        r#mod: "base",
        table: "role_permit",
        column1: "role_id",
        column2: "permit_id",
      },
    ).await?;
  }
  
  // 数据权限
  if let Some(data_permit_ids) = input.data_permit_ids {
    many2many_update(
      id.into(),
      data_permit_ids
        .into_iter()
        .map(|item| item.into())
        .collect(),
      ManyOpts {
        r#mod: "base",
        table: "role_data_permit",
        column1: "role_id",
        column2: "data_permit_id",
      },
    ).await?;
  }
  
  // 字段权限
  if let Some(field_permit_ids) = input.field_permit_ids {
    many2many_update(
      id.into(),
      field_permit_ids
        .into_iter()
        .map(|item| item.into())
        .collect(),
      ManyOpts {
        r#mod: "base",
        table: "role_field_permit",
        column1: "role_id",
        column2: "field_permit_id",
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
  let table = get_table_name_role();
  vec![
    table,
  ]
}

// MARK: del_cache_role
/// 清空缓存
#[allow(dead_code)]
pub async fn del_cache_role() -> Result<()> {
  let cache_key1s = get_cache_tables();
  del_caches(
    cache_key1s.as_slice(),
  ).await?;
  Ok(())
}

// MARK: delete_by_ids_role
/// 根据 ids 删除角色
#[allow(unused_variables)]
pub async fn delete_by_ids_role(
  ids: Vec<RoleId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_role();
  let method = "delete_by_ids_role";
  
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
    
    let old_model = find_by_id_role(
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
    {
      let menu_ids = old_model.menu_ids.clone();
      if !menu_ids.is_empty() {
        let mut args = QueryArgs::new();
        let mut sql = "update base_role_menu set is_deleted=1 where role_id=? and".to_owned();
        args.push(id.into());
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
    {
      let permit_ids = old_model.permit_ids.clone();
      if !permit_ids.is_empty() {
        let mut args = QueryArgs::new();
        let mut sql = "update base_role_permit set is_deleted=1 where role_id=? and".to_owned();
        args.push(id.into());
        let arg = {
          let mut items = Vec::with_capacity(permit_ids.len());
          for item in permit_ids {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        };
        sql.push_str(" permit_id in (");
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
      let data_permit_ids = old_model.data_permit_ids.clone();
      if !data_permit_ids.is_empty() {
        let mut args = QueryArgs::new();
        let mut sql = "update base_role_data_permit set is_deleted=1 where role_id=? and".to_owned();
        args.push(id.into());
        let arg = {
          let mut items = Vec::with_capacity(data_permit_ids.len());
          for item in data_permit_ids {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        };
        sql.push_str(" data_permit_id in (");
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
      let field_permit_ids = old_model.field_permit_ids.clone();
      if !field_permit_ids.is_empty() {
        let mut args = QueryArgs::new();
        let mut sql = "update base_role_field_permit set is_deleted=1 where role_id=? and".to_owned();
        args.push(id.into());
        let arg = {
          let mut items = Vec::with_capacity(field_permit_ids.len());
          for item in field_permit_ids {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        };
        sql.push_str(" field_permit_id in (");
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
      let mut args = QueryArgs::new();
      let sql = "update base_usr_role set is_deleted=1 where role_id=? and is_deleted=0".to_owned();
      args.push(id.into());
      let args: Vec<_> = args.into();
      execute(
        sql,
        args,
        options.clone(),
      ).await?;
    }
    {
      let mut args = QueryArgs::new();
      let sql = "update base_dyn_page_role set is_deleted=1 where role_id=? and is_deleted=0".to_owned();
      args.push(id.into());
      let args: Vec<_> = args.into();
      execute(
        sql,
        args,
        options.clone(),
      ).await?;
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

// MARK: get_is_enabled_by_id_role
/// 根据 id 查找角色是否已启用
/// 记录不存在则返回 false
pub async fn get_is_enabled_by_id_role(
  id: RoleId,
  options: Option<Options>,
) -> Result<bool> {
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let model = find_by_id_role(
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

// MARK: enable_by_ids_role
/// 根据 ids 启用或者禁用角色
pub async fn enable_by_ids_role(
  ids: Vec<RoleId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_role();
  let method = "enable_by_ids_role";
  
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

// MARK: get_is_locked_by_id_role
/// 根据 id 查找角色是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
pub async fn get_is_locked_by_id_role(
  id: RoleId,
  options: Option<Options>,
) -> Result<bool> {
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let model = find_by_id_role(
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

// MARK: lock_by_ids_role
/// 根据 ids 锁定或者解锁角色
pub async fn lock_by_ids_role(
  ids: Vec<RoleId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_role();
  let method = "lock_by_ids_role";
  
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

// MARK: revert_by_ids_role
/// 根据 ids 还原角色
pub async fn revert_by_ids_role(
  ids: Vec<RoleId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_role();
  let method = "revert_by_ids_role";
  
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
    
    args.push(id.into());
    
    let args: Vec<_> = args.into();
    
    let mut old_model = find_one_role(
      RoleSearch {
        id: Some(id),
        is_deleted: Some(1),
        ..Default::default()
      }.into(),
      None,
      options.clone(),
    ).await?;
    
    if old_model.is_none() {
      old_model = find_by_id_role(
        id,
        options.clone(),
      ).await?;
    }
    
    let old_model = match old_model {
      Some(model) => model,
      None => continue,
    };
    
    {
      let mut input: RoleInput = old_model.clone().into();
      input.id = None;
      
      let models = find_by_unique_role(
        input.into(),
        None,
        options.clone(),
      ).await?;
      
      let models: Vec<RoleModel> = models
        .into_iter()
        .filter(|item| 
          item.id != id
        )
        .collect();
      
      if !models.is_empty() {
        let err_msg = "角色 重复";
        return Err(eyre!(err_msg));
      }
    }
    
    num += execute(
      sql,
      args,
      options.clone(),
    ).await?;
    {
      let menu_ids = old_model.menu_ids.clone();
      if !menu_ids.is_empty() {
        let mut args = QueryArgs::new();
        let mut sql = "update base_role_menu set is_deleted=0 where role_id=? and".to_owned();
        args.push(id.into());
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
    {
      let permit_ids = old_model.permit_ids.clone();
      if !permit_ids.is_empty() {
        let mut args = QueryArgs::new();
        let mut sql = "update base_role_permit set is_deleted=0 where role_id=? and".to_owned();
        args.push(id.into());
        let arg = {
          let mut items = Vec::with_capacity(permit_ids.len());
          for item in permit_ids {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        };
        sql.push_str(" permit_id in (");
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
      let data_permit_ids = old_model.data_permit_ids.clone();
      if !data_permit_ids.is_empty() {
        let mut args = QueryArgs::new();
        let mut sql = "update base_role_data_permit set is_deleted=0 where role_id=? and".to_owned();
        args.push(id.into());
        let arg = {
          let mut items = Vec::with_capacity(data_permit_ids.len());
          for item in data_permit_ids {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        };
        sql.push_str(" data_permit_id in (");
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
      let field_permit_ids = old_model.field_permit_ids.clone();
      if !field_permit_ids.is_empty() {
        let mut args = QueryArgs::new();
        let mut sql = "update base_role_field_permit set is_deleted=0 where role_id=? and".to_owned();
        args.push(id.into());
        let arg = {
          let mut items = Vec::with_capacity(field_permit_ids.len());
          for item in field_permit_ids {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        };
        sql.push_str(" field_permit_id in (");
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

// MARK: force_delete_by_ids_role
/// 根据 ids 彻底删除角色
#[allow(unused_variables)]
pub async fn force_delete_by_ids_role(
  ids: Vec<RoleId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = get_table_name_role();
  let method = "force_delete_by_ids_role";
  
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
    
    let old_model = find_one_role(
      Some(RoleSearch {
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
    
    del_caches(
      vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
    ).await?;
    
    num += execute(
      sql,
      args,
      options.clone(),
    ).await?;
    {
      let menu_ids = old_model.menu_ids.clone();
      if !menu_ids.is_empty() {
        let mut args = QueryArgs::new();
        let mut sql = "delete from base_role_menu where role_id=? and".to_owned();
        args.push(id.into());
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
    {
      let permit_ids = old_model.permit_ids.clone();
      if !permit_ids.is_empty() {
        let mut args = QueryArgs::new();
        let mut sql = "delete from base_role_permit where role_id=? and".to_owned();
        args.push(id.into());
        let mut items = Vec::with_capacity(permit_ids.len());
        for item in permit_ids {
          items.push("?");
          args.push(item.clone().into());
        }
        sql.push_str(" permit_id in (");
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
      let data_permit_ids = old_model.data_permit_ids.clone();
      if !data_permit_ids.is_empty() {
        let mut args = QueryArgs::new();
        let mut sql = "delete from base_role_data_permit where role_id=? and".to_owned();
        args.push(id.into());
        let mut items = Vec::with_capacity(data_permit_ids.len());
        for item in data_permit_ids {
          items.push("?");
          args.push(item.clone().into());
        }
        sql.push_str(" data_permit_id in (");
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
      let field_permit_ids = old_model.field_permit_ids.clone();
      if !field_permit_ids.is_empty() {
        let mut args = QueryArgs::new();
        let mut sql = "delete from base_role_field_permit where role_id=? and".to_owned();
        args.push(id.into());
        let mut items = Vec::with_capacity(field_permit_ids.len());
        for item in field_permit_ids {
          items.push("?");
          args.push(item.clone().into());
        }
        sql.push_str(" field_permit_id in (");
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
      let mut args = QueryArgs::new();
      let sql = "delete from base_usr_role where role_id=?".to_owned();
      args.push(id.into());
      let args: Vec<_> = args.into();
      execute(
        sql,
        args,
        options.clone(),
      ).await?;
    }
    {
      let mut args = QueryArgs::new();
      let sql = "delete from base_dyn_page_role where role_id=?".to_owned();
      args.push(id.into());
      let args: Vec<_> = args.into();
      execute(
        sql,
        args,
        options.clone(),
      ).await?;
    }
    
    del_caches(
      vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
    ).await?;
  }
  
  Ok(num)
}

// MARK: find_last_order_by_role
/// 查找 角色 order_by 字段的最大值
pub async fn find_last_order_by_role(
  options: Option<Options>,
) -> Result<u32> {
  
  let table = get_table_name_role();
  let method = "find_last_order_by_role";
  
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
  
  if let Some(tenant_id) = get_auth_tenant_id() {
    sql_wheres.push("t.tenant_id=?");
    args.push(tenant_id.into());
  }
  
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

// MARK: validate_is_enabled_role
/// 校验角色是否启用
#[allow(dead_code)]
pub async fn validate_is_enabled_role(
  model: &RoleModel,
) -> Result<()> {
  if model.is_enabled == 0 {
    let err_msg = "角色已禁用";
    return Err(eyre!(err_msg));
  }
  Ok(())
}

// MARK: validate_option_role
/// 校验角色是否存在
#[allow(dead_code)]
pub async fn validate_option_role(
  model: Option<RoleModel>,
) -> Result<RoleModel> {
  if model.is_none() {
    let err_msg = "角色不存在";
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
