#[allow(unused_imports)]
use serde::{Serialize, Deserialize};
#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use std::collections::HashSet;

use color_eyre::eyre::{Result, eyre};
#[allow(unused_imports)]
use tracing::{info, error};
use crate::common::auth::auth_dao::get_password;
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

use super::usr_model::*;

use crate::base::tenant::tenant_model::TenantId;
use crate::base::role::role_model::RoleId;
use crate::base::dept::dept_model::DeptId;
use crate::base::org::org_model::OrgId;

#[allow(unused_variables)]
async fn get_where_query(
  args: &mut QueryArgs,
  search: Option<&UsrSearch>,
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
    let ids: Option<Vec<UsrId>> = match search {
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
      match tenant_id {
        None => get_auth_tenant_id(),
        Some(item) => match item.as_str() {
          "-" => None,
          _ => item.into(),
        },
      }
    };
    if let Some(tenant_id) = tenant_id {
      where_query.push_str(" and t.tenant_id=?");
      args.push(tenant_id.into());
    }
  }
  // 头像
  {
    let img = match search {
      Some(item) => item.img.clone(),
      None => None,
    };
    if let Some(img) = img {
      where_query.push_str(" and t.img=?");
      args.push(img.into());
    }
    let img_like = match search {
      Some(item) => item.img_like.clone(),
      None => None,
    };
    if let Some(img_like) = img_like {
      where_query.push_str(" and t.img like ?");
      args.push(format!("%{}%", sql_like(&img_like)).into());
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
  // 用户名
  {
    let username = match search {
      Some(item) => item.username.clone(),
      None => None,
    };
    if let Some(username) = username {
      where_query.push_str(" and t.username=?");
      args.push(username.into());
    }
    let username_like = match search {
      Some(item) => item.username_like.clone(),
      None => None,
    };
    if let Some(username_like) = username_like {
      where_query.push_str(" and t.username like ?");
      args.push(format!("%{}%", sql_like(&username_like)).into());
    }
  }
  // 所属角色
  {
    let role_ids: Option<Vec<RoleId>> = match search {
      Some(item) => item.role_ids.clone(),
      None => None,
    };
    if let Some(role_ids) = role_ids {
      let arg = {
        if role_ids.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(role_ids.len());
          for item in role_ids {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and base_role.id in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let role_ids_is_null: bool = match search {
      Some(item) => item.role_ids_is_null.unwrap_or(false),
      None => false,
    };
    if role_ids_is_null {
      where_query.push_str(" and t.role_ids is null");
    }
  }
  // 所属角色
  {
    let role_codes: Option<Vec<String>> = match search {
      Some(item) => item.role_codes.clone(),
      None => None,
    };
    if let Some(role_codes) = role_codes {
      let arg = {
        if role_codes.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(role_codes.len());
          for item in role_codes {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and base_role.code in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  // 所属部门
  {
    let dept_ids: Option<Vec<DeptId>> = match search {
      Some(item) => item.dept_ids.clone(),
      None => None,
    };
    if let Some(dept_ids) = dept_ids {
      let arg = {
        if dept_ids.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(dept_ids.len());
          for item in dept_ids {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and base_dept.id in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let dept_ids_is_null: bool = match search {
      Some(item) => item.dept_ids_is_null.unwrap_or(false),
      None => false,
    };
    if dept_ids_is_null {
      where_query.push_str(" and t.dept_ids is null");
    }
  }
  // 所属组织
  {
    let org_ids: Option<Vec<OrgId>> = match search {
      Some(item) => item.org_ids.clone(),
      None => None,
    };
    if let Some(org_ids) = org_ids {
      let arg = {
        if org_ids.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(org_ids.len());
          for item in org_ids {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and base_org.id in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let org_ids_is_null: bool = match search {
      Some(item) => item.org_ids_is_null.unwrap_or(false),
      None => false,
    };
    if org_ids_is_null {
      where_query.push_str(" and t.org_ids is null");
    }
  }
  // 默认组织
  {
    let default_org_id: Option<Vec<OrgId>> = match search {
      Some(item) => item.default_org_id.clone(),
      None => None,
    };
    if let Some(default_org_id) = default_org_id {
      let arg = {
        if default_org_id.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(default_org_id.len());
          for item in default_org_id {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.default_org_id in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let default_org_id_is_null: bool = match search {
      Some(item) => item.default_org_id_is_null.unwrap_or(false),
      None => false,
    };
    if default_org_id_is_null {
      where_query.push_str(" and t.default_org_id is null");
    }
  }
  {
    let default_org_id_lbl: Option<Vec<String>> = match search {
      Some(item) => item.default_org_id_lbl.clone(),
      None => None,
    };
    if let Some(default_org_id_lbl) = default_org_id_lbl {
      let arg = {
        if default_org_id_lbl.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(default_org_id_lbl.len());
          for item in default_org_id_lbl {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and default_org_id_lbl.lbl in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  {
    let default_org_id_lbl_like = match search {
      Some(item) => item.default_org_id_lbl_like.clone(),
      None => None,
    };
    if let Some(default_org_id_lbl_like) = default_org_id_lbl_like {
      where_query.push_str(" and default_org_id_lbl.lbl like ?");
      args.push(format!("%{}%", sql_like(&default_org_id_lbl_like)).into());
    }
  }
  // 类型
  {
    let r#type: Option<Vec<UsrType>> = match search {
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
  // 隐藏记录
  {
    let is_hidden: Option<Vec<u8>> = match search {
      Some(item) => item.is_hidden.clone(),
      None => Default::default(),
    };
    if let Some(is_hidden) = is_hidden {
      let arg = {
        if is_hidden.is_empty() {
          "null".to_string()
        } else {
          let mut items = Vec::with_capacity(is_hidden.len());
          for item in is_hidden {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        }
      };
      where_query.push_str(" and t.is_hidden in (");
      where_query.push_str(&arg);
      where_query.push(')');
    }
  }
  Ok(where_query)
}

#[allow(unused_variables)]
async fn get_from_query(
  args: &mut QueryArgs,
  search: Option<&UsrSearch>,
  options: Option<&Options>,
) -> Result<String> {
  
  let is_deleted = search
    .and_then(|item| item.is_deleted)
    .unwrap_or(0);
  
  let from_query = r#"base_usr t
  left join base_usr_role on base_usr_role.usr_id=t.id and base_usr_role.is_deleted=?
  left join base_role on base_usr_role.role_id=base_role.id and base_role.is_deleted=?
  left join (select json_objectagg(base_usr_role.order_by,base_role.id) role_ids,
  json_objectagg(base_usr_role.order_by,base_role.lbl) role_ids_lbl,
  base_usr.id usr_id from base_usr_role
  inner join base_role on base_role.id=base_usr_role.role_id
  inner join base_usr on base_usr.id=base_usr_role.usr_id where base_usr_role.is_deleted=?
  group by usr_id) _role on _role.usr_id=t.id
  left join base_usr_dept on base_usr_dept.usr_id=t.id and base_usr_dept.is_deleted=?
  left join base_dept on base_usr_dept.dept_id=base_dept.id and base_dept.is_deleted=?
  left join (select json_objectagg(base_usr_dept.order_by,base_dept.id) dept_ids,
  json_objectagg(base_usr_dept.order_by,base_dept.lbl) dept_ids_lbl,
  base_usr.id usr_id from base_usr_dept
  inner join base_dept on base_dept.id=base_usr_dept.dept_id
  inner join base_usr on base_usr.id=base_usr_dept.usr_id where base_usr_dept.is_deleted=?
  group by usr_id) _dept on _dept.usr_id=t.id
  left join base_usr_org on base_usr_org.usr_id=t.id and base_usr_org.is_deleted=?
  left join base_org on base_usr_org.org_id=base_org.id and base_org.is_deleted=?
  left join (select json_objectagg(base_usr_org.order_by,base_org.id) org_ids,
  json_objectagg(base_usr_org.order_by,base_org.lbl) org_ids_lbl,
  base_usr.id usr_id from base_usr_org
  inner join base_org on base_org.id=base_usr_org.org_id
  inner join base_usr on base_usr.id=base_usr_org.usr_id where base_usr_org.is_deleted=?
  group by usr_id) _org on _org.usr_id=t.id
  left join base_org default_org_id_lbl on default_org_id_lbl.id=t.default_org_id"#.to_owned();
  for _ in 0..9 {
    args.push(is_deleted.into());
  }
  Ok(from_query)
}

// MARK: find_all_usr
/// 根据搜索条件和分页查找用户列表
#[allow(unused_mut)]
pub async fn find_all_usr(
  search: Option<UsrSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<UsrModel>> {
  
  let table = "base_usr";
  let method = "find_all_usr";
  
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
  // 所属角色
  if let Some(search) = &search {
    if search.role_ids.is_some() {
      let len = search.role_ids.as_ref().unwrap().len();
      if len == 0 {
        return Ok(vec![]);
      }
      let ids_limit = options
        .as_ref()
        .and_then(|x| x.get_ids_limit())
        .unwrap_or(FIND_ALL_IDS_LIMIT);
      if len > ids_limit {
        return Err(eyre!("search.role_ids.length > {ids_limit}"));
      }
    }
  }
  // 所属角色
  if let Some(search) = &search {
    if search.role_codes.is_some() {
      let len = search.role_codes.as_ref().unwrap().len();
      if len == 0 {
        return Ok(vec![]);
      }
      let ids_limit = options
        .as_ref()
        .and_then(|x| x.get_ids_limit())
        .unwrap_or(FIND_ALL_IDS_LIMIT);
      if len > ids_limit {
        return Err(eyre!("search.role_codes.length > {ids_limit}"));
      }
    }
  }
  // 所属部门
  if let Some(search) = &search {
    if search.dept_ids.is_some() {
      let len = search.dept_ids.as_ref().unwrap().len();
      if len == 0 {
        return Ok(vec![]);
      }
      let ids_limit = options
        .as_ref()
        .and_then(|x| x.get_ids_limit())
        .unwrap_or(FIND_ALL_IDS_LIMIT);
      if len > ids_limit {
        return Err(eyre!("search.dept_ids.length > {ids_limit}"));
      }
    }
  }
  // 所属组织
  if let Some(search) = &search {
    if search.org_ids.is_some() {
      let len = search.org_ids.as_ref().unwrap().len();
      if len == 0 {
        return Ok(vec![]);
      }
      let ids_limit = options
        .as_ref()
        .and_then(|x| x.get_ids_limit())
        .unwrap_or(FIND_ALL_IDS_LIMIT);
      if len > ids_limit {
        return Err(eyre!("search.org_ids.length > {ids_limit}"));
      }
    }
  }
  // 默认组织
  if let Some(search) = &search {
    if search.default_org_id.is_some() {
      let len = search.default_org_id.as_ref().unwrap().len();
      if len == 0 {
        return Ok(vec![]);
      }
      let ids_limit = options
        .as_ref()
        .and_then(|x| x.get_ids_limit())
        .unwrap_or(FIND_ALL_IDS_LIMIT);
      if len > ids_limit {
        return Err(eyre!("search.default_org_id.length > {ids_limit}"));
      }
    }
  }
  // 类型
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
        return Err(eyre!("search.type.length > {ids_limit}"));
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
  // 隐藏记录
  if let Some(search) = &search {
    if search.is_hidden.is_some() {
      let len = search.is_hidden.as_ref().unwrap().len();
      if len == 0 {
        return Ok(vec![]);
      }
      let ids_limit = options
        .as_ref()
        .and_then(|x| x.get_ids_limit())
        .unwrap_or(FIND_ALL_IDS_LIMIT);
      if len > ids_limit {
        return Err(eyre!("search.is_hidden.length > {ids_limit}"));
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
      prop: "create_time".to_string(),
      order: SortOrderEnum::Asc,
    });
  }
  
  let order_by_query = get_order_by_query(Some(sort));
  let page_query = get_page_query(page);
  
  let sql = format!(r#"select f.* from (select t.*
  ,max(role_ids) role_ids
  ,max(role_ids_lbl) role_ids_lbl
  ,max(dept_ids) dept_ids
  ,max(dept_ids_lbl) dept_ids_lbl
  ,max(org_ids) org_ids
  ,max(org_ids_lbl) org_ids_lbl
  ,default_org_id_lbl.lbl default_org_id_lbl
  from {from_query} where {where_query} group by t.id{order_by_query}) f {page_query}"#);
  
  let args = args.into();
  
  let options = Options::from(options);
  
  let options = options.set_cache_key(table, &sql, &args);
  
  let mut res: Vec<UsrModel> = query(
    sql,
    args,
    Some(options),
  ).await?;
  
  let dict_vec = get_dict(&[
    "usr_type",
    "is_locked",
    "is_enabled",
  ]).await?;
  let [
    type_dict,
    is_locked_dict,
    is_enabled_dict,
  ]: [Vec<_>; 3] = dict_vec
    .try_into()
    .map_err(|err| eyre!("{:#?}", err))?;
  
  #[allow(unused_variables)]
  for model in &mut res {
    
    // 类型
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
    
  }
  
  Ok(res)
}

// MARK: find_count_usr
/// 根据条件查找用户总数
pub async fn find_count_usr(
  search: Option<UsrSearch>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_usr";
  let method = "find_count_usr";
  
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
  // 所属角色
  if let Some(search) = &search {
    if search.role_ids.is_some() {
      let len = search.role_ids.as_ref().unwrap().len();
      if len == 0 {
        return Ok(0);
      }
      let ids_limit = options
        .as_ref()
        .and_then(|x| x.get_ids_limit())
        .unwrap_or(FIND_ALL_IDS_LIMIT);
      if len > ids_limit {
        return Err(eyre!("search.role_ids.length > {ids_limit}"));
      }
    }
  }
  // 所属部门
  if let Some(search) = &search {
    if search.dept_ids.is_some() {
      let len = search.dept_ids.as_ref().unwrap().len();
      if len == 0 {
        return Ok(0);
      }
      let ids_limit = options
        .as_ref()
        .and_then(|x| x.get_ids_limit())
        .unwrap_or(FIND_ALL_IDS_LIMIT);
      if len > ids_limit {
        return Err(eyre!("search.dept_ids.length > {ids_limit}"));
      }
    }
  }
  // 所属组织
  if let Some(search) = &search {
    if search.org_ids.is_some() {
      let len = search.org_ids.as_ref().unwrap().len();
      if len == 0 {
        return Ok(0);
      }
      let ids_limit = options
        .as_ref()
        .and_then(|x| x.get_ids_limit())
        .unwrap_or(FIND_ALL_IDS_LIMIT);
      if len > ids_limit {
        return Err(eyre!("search.org_ids.length > {ids_limit}"));
      }
    }
  }
  // 默认组织
  if let Some(search) = &search {
    if search.default_org_id.is_some() {
      let len = search.default_org_id.as_ref().unwrap().len();
      if len == 0 {
        return Ok(0);
      }
      let ids_limit = options
        .as_ref()
        .and_then(|x| x.get_ids_limit())
        .unwrap_or(FIND_ALL_IDS_LIMIT);
      if len > ids_limit {
        return Err(eyre!("search.default_org_id.length > {ids_limit}"));
      }
    }
  }
  // 类型
  if let Some(search) = &search {
    if search.r#type.is_some() {
      let len = search.r#type.as_ref().unwrap().len();
      if len == 0 {
        return Ok(0);
      }
      let ids_limit = options
        .as_ref()
        .and_then(|x| x.get_ids_limit())
        .unwrap_or(FIND_ALL_IDS_LIMIT);
      if len > ids_limit {
        return Err(eyre!("search.type.length > {ids_limit}"));
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
  // 隐藏记录
  if let Some(search) = &search {
    if search.is_hidden.is_some() {
      let len = search.is_hidden.as_ref().unwrap().len();
      if len == 0 {
        return Ok(0);
      }
      let ids_limit = options
        .as_ref()
        .and_then(|x| x.get_ids_limit())
        .unwrap_or(FIND_ALL_IDS_LIMIT);
      if len > ids_limit {
        return Err(eyre!("search.is_hidden.length > {ids_limit}"));
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

// MARK: get_field_comments_usr
/// 获取用户字段注释
pub async fn get_field_comments_usr(
  _options: Option<Options>,
) -> Result<UsrFieldComment> {
  
  let field_comments = UsrFieldComment {
    id: "ID".into(),
    img: "头像".into(),
    lbl: "名称".into(),
    username: "用户名".into(),
    role_ids: "所属角色".into(),
    role_ids_lbl: "所属角色".into(),
    dept_ids: "所属部门".into(),
    dept_ids_lbl: "所属部门".into(),
    org_ids: "所属组织".into(),
    org_ids_lbl: "所属组织".into(),
    default_org_id: "默认组织".into(),
    default_org_id_lbl: "默认组织".into(),
    r#type: "类型".into(),
    type_lbl: "类型".into(),
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

// MARK: find_one_ok_usr
/// 根据条件查找第一个用户, 如果不存在则抛错
#[allow(dead_code)]
pub async fn find_one_ok_usr(
  search: Option<UsrSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<UsrModel> {
  
  let table = "base_usr";
  let method = "find_one_ok_usr";
  
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
  
  let usr_model = find_one_usr(
    search,
    sort,
    options,
  ).await?;
  
  let Some(usr_model) = usr_model else {
    let err_msg = "此 用户 已被删除";
    return Err(eyre!(err_msg));
  };
  
  Ok(usr_model)
}

// MARK: find_one_usr
/// 根据条件查找第一个用户
#[allow(dead_code)]
pub async fn find_one_usr(
  search: Option<UsrSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<UsrModel>> {
  
  let table = "base_usr";
  let method = "find_one_usr";
  
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
  
  let res = find_all_usr(
    search,
    page,
    sort,
    options,
  ).await?;
  
  let model: Option<UsrModel> = res.into_iter().next();
  
  Ok(model)
}

// MARK: find_by_id_ok_usr
/// 根据 id 查找用户, 如果不存在则抛错
#[allow(dead_code)]
pub async fn find_by_id_ok_usr(
  id: UsrId,
  options: Option<Options>,
) -> Result<UsrModel> {
  
  let table = "base_usr";
  let method = "find_by_id_ok_usr";
  
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
  
  let usr_model = find_by_id_usr(
    id,
    options,
  ).await?;
  
  let Some(usr_model) = usr_model else {
    let err_msg = "此 用户 已被删除";
    return Err(eyre!(err_msg));
  };
  
  Ok(usr_model)
}

// MARK: find_by_id_usr
/// 根据 id 查找用户
pub async fn find_by_id_usr(
  id: UsrId,
  options: Option<Options>,
) -> Result<Option<UsrModel>> {
  
  let table = "base_usr";
  let method = "find_by_id_usr";
  
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
  
  let search = UsrSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let usr_model = find_one_usr(
    search,
    None,
    options,
  ).await?;
  
  Ok(usr_model)
}

// MARK: find_by_ids_ok_usr
/// 根据 ids 查找用户, 出现查询不到的 id 则报错
#[allow(dead_code)]
pub async fn find_by_ids_ok_usr(
  ids: Vec<UsrId>,
  options: Option<Options>,
) -> Result<Vec<UsrModel>> {
  
  let table = "base_usr";
  let method = "find_by_ids_ok_usr";
  
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
  
  let usr_models = find_by_ids_usr(
    ids.clone(),
    options,
  ).await?;
  
  if usr_models.len() != len {
    let err_msg = "此 用户 已被删除";
    return Err(eyre!(err_msg));
  }
  
  let usr_models = ids
    .into_iter()
    .map(|id| {
      let model = usr_models
        .iter()
        .find(|item| item.id == id);
      if let Some(model) = model {
        return Ok(model.clone());
      }
      let err_msg = "此 用户 已经被删除";
      Err(eyre!(err_msg))
    })
    .collect::<Result<Vec<UsrModel>>>()?;
  
  Ok(usr_models)
}

// MARK: find_by_ids_usr
/// 根据 ids 查找用户
#[allow(dead_code)]
pub async fn find_by_ids_usr(
  ids: Vec<UsrId>,
  options: Option<Options>,
) -> Result<Vec<UsrModel>> {
  
  let table = "base_usr";
  let method = "find_by_ids_usr";
  
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
  
  let search = UsrSearch {
    ids: Some(ids.clone()),
    ..Default::default()
  }.into();
  
  let usr_models = find_all_usr(
    search,
    None,
    None,
    options,
  ).await?;
  
  Ok(usr_models)
}

// MARK: exists_usr
/// 根据搜索条件判断用户是否存在
#[allow(dead_code)]
pub async fn exists_usr(
  search: Option<UsrSearch>,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = "base_usr";
  let method = "exists_usr";
  
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
  // 所属角色
  if let Some(search) = &search {
    if search.role_ids.is_some() {
      let len = search.role_ids.as_ref().unwrap().len();
      if len == 0 {
        return Ok(false);
      }
      let ids_limit = options
        .as_ref()
        .and_then(|x| x.get_ids_limit())
        .unwrap_or(FIND_ALL_IDS_LIMIT);
      if len > ids_limit {
        return Err(eyre!("search.role_ids.length > {ids_limit}"));
      }
    }
  }
  // 所属部门
  if let Some(search) = &search {
    if search.dept_ids.is_some() {
      let len = search.dept_ids.as_ref().unwrap().len();
      if len == 0 {
        return Ok(false);
      }
      let ids_limit = options
        .as_ref()
        .and_then(|x| x.get_ids_limit())
        .unwrap_or(FIND_ALL_IDS_LIMIT);
      if len > ids_limit {
        return Err(eyre!("search.dept_ids.length > {ids_limit}"));
      }
    }
  }
  // 所属组织
  if let Some(search) = &search {
    if search.org_ids.is_some() {
      let len = search.org_ids.as_ref().unwrap().len();
      if len == 0 {
        return Ok(false);
      }
      let ids_limit = options
        .as_ref()
        .and_then(|x| x.get_ids_limit())
        .unwrap_or(FIND_ALL_IDS_LIMIT);
      if len > ids_limit {
        return Err(eyre!("search.org_ids.length > {ids_limit}"));
      }
    }
  }
  // 默认组织
  if let Some(search) = &search {
    if search.default_org_id.is_some() {
      let len = search.default_org_id.as_ref().unwrap().len();
      if len == 0 {
        return Ok(false);
      }
      let ids_limit = options
        .as_ref()
        .and_then(|x| x.get_ids_limit())
        .unwrap_or(FIND_ALL_IDS_LIMIT);
      if len > ids_limit {
        return Err(eyre!("search.default_org_id.length > {ids_limit}"));
      }
    }
  }
  // 类型
  if let Some(search) = &search {
    if search.r#type.is_some() {
      let len = search.r#type.as_ref().unwrap().len();
      if len == 0 {
        return Ok(false);
      }
      let ids_limit = options
        .as_ref()
        .and_then(|x| x.get_ids_limit())
        .unwrap_or(FIND_ALL_IDS_LIMIT);
      if len > ids_limit {
        return Err(eyre!("search.type.length > {ids_limit}"));
      }
    }
  }
  // 锁定
  if let Some(search) = &search {
    if search.is_locked.is_some() {
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
  }
  // 启用
  if let Some(search) = &search {
    if search.is_enabled.is_some() {
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
  // 隐藏记录
  if let Some(search) = &search {
    if search.is_hidden.is_some() {
      let len = search.is_hidden.as_ref().unwrap().len();
      if len == 0 {
        return Ok(false);
      }
      let ids_limit = options
        .as_ref()
        .and_then(|x| x.get_ids_limit())
        .unwrap_or(FIND_ALL_IDS_LIMIT);
      if len > ids_limit {
        return Err(eyre!("search.is_hidden.length > {ids_limit}"));
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

// MARK: exists_by_id_usr
/// 根据 id 判断用户是否存在
#[allow(dead_code)]
pub async fn exists_by_id_usr(
  id: UsrId,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = "base_usr";
  let method = "exists_by_id_usr";
  
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
  
  let search = UsrSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let exists = exists_usr(
    search,
    options,
  ).await?;
  
  Ok(exists)
}

// MARK: find_by_unique_usr
/// 通过唯一约束获得数据列表
#[allow(unused_variables)]
pub async fn find_by_unique_usr(
  search: UsrSearch,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<UsrModel>> {
  
  let table = "base_usr";
  let method = "find_by_unique_usr";
  
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
    let model = find_by_id_usr(
      id,
      options.clone(),
    ).await?;
    return Ok(model.map_or_else(Vec::new, |m| vec![m]));
  }
  
  let mut models: Vec<UsrModel> = vec![];
  
  let mut models_tmp = {
    if
      search.lbl.is_none()
    {
      return Ok(vec![]);
    }
    
    let search = UsrSearch {
      lbl: search.lbl.clone(),
      ..Default::default()
    };
    
    find_all_usr(
      search.into(),
      None,
      sort.clone(),
      options.clone(),
    ).await?
  };
  models.append(&mut models_tmp);
  
  let mut models_tmp = {
    if
      search.username.is_none()
    {
      return Ok(vec![]);
    }
    
    let search = UsrSearch {
      username: search.username.clone(),
      ..Default::default()
    };
    
    find_all_usr(
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
  input: &UsrInput,
  model: &UsrModel,
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
    input.username.as_ref().is_some() && input.username.as_ref().unwrap() == &model.username
  {
    return true;
  }
  false
}

// MARK: check_by_unique_usr
/// 通过唯一约束检查数据是否已经存在
#[allow(unused_variables)]
pub async fn check_by_unique_usr(
  input: UsrInput,
  model: UsrModel,
  options: Option<Options>,
) -> Result<Option<UsrId>> {
  
  let table = "base_usr";
  let method = "check_by_unique_usr";
  
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
    let id = update_by_id_usr(
      model.id.clone(),
      input,
      options,
    ).await?;
    return Ok(id.into());
  }
  if unique_type == UniqueType::Throw {
    let err_msg = "此 用户 已经存在";
    return Err(eyre!(err_msg));
  }
  Ok(None)
}

// MARK: set_id_by_lbl_usr
/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(unused_variables, dead_code)]
pub async fn set_id_by_lbl_usr(
  input: UsrInput,
) -> Result<UsrInput> {
  
  #[allow(unused_mut)]
  let mut input = input;
  
  let dict_vec = get_dict(&[
    "usr_type",
    "is_locked",
    "is_enabled",
  ]).await?;
  
  // 类型
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
  
  // 所属角色
  if input.role_ids_lbl.is_some() && input.role_ids.is_none() {
    input.role_ids_lbl = input.role_ids_lbl.map(|item| 
      item.into_iter()
        .map(|item| item.trim().to_owned())
        .filter(|item| !item.is_empty())
        .collect::<Vec<String>>()
    );
    input.role_ids_lbl = input.role_ids_lbl.map(|item| {
      let mut set = HashSet::new();
      item.into_iter()
        .filter(|item| set.insert(item.clone()))
        .collect::<Vec<String>>()
    });
    let mut models = vec![];
    for lbl in input.role_ids_lbl.clone().unwrap_or_default() {
      let model = crate::base::role::role_dao::find_one_role(
        crate::base::role::role_model::RoleSearch {
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
    input.role_ids = models.into_iter()
      .map(|item| item.id)
      .collect::<Vec<RoleId>>()
      .into();
  }
  
  // 所属部门
  if input.dept_ids_lbl.is_some() && input.dept_ids.is_none() {
    input.dept_ids_lbl = input.dept_ids_lbl.map(|item| 
      item.into_iter()
        .map(|item| item.trim().to_owned())
        .filter(|item| !item.is_empty())
        .collect::<Vec<String>>()
    );
    input.dept_ids_lbl = input.dept_ids_lbl.map(|item| {
      let mut set = HashSet::new();
      item.into_iter()
        .filter(|item| set.insert(item.clone()))
        .collect::<Vec<String>>()
    });
    let mut models = vec![];
    for lbl in input.dept_ids_lbl.clone().unwrap_or_default() {
      let model = crate::base::dept::dept_dao::find_one_dept(
        crate::base::dept::dept_model::DeptSearch {
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
    input.dept_ids = models.into_iter()
      .map(|item| item.id)
      .collect::<Vec<DeptId>>()
      .into();
  }
  
  // 所属组织
  if input.org_ids_lbl.is_some() && input.org_ids.is_none() {
    input.org_ids_lbl = input.org_ids_lbl.map(|item| 
      item.into_iter()
        .map(|item| item.trim().to_owned())
        .filter(|item| !item.is_empty())
        .collect::<Vec<String>>()
    );
    input.org_ids_lbl = input.org_ids_lbl.map(|item| {
      let mut set = HashSet::new();
      item.into_iter()
        .filter(|item| set.insert(item.clone()))
        .collect::<Vec<String>>()
    });
    let mut models = vec![];
    for lbl in input.org_ids_lbl.clone().unwrap_or_default() {
      let model = crate::base::org::org_dao::find_one_org(
        crate::base::org::org_model::OrgSearch {
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
    input.org_ids = models.into_iter()
      .map(|item| item.id)
      .collect::<Vec<OrgId>>()
      .into();
  }
  
  // 默认组织
  if input.default_org_id_lbl.is_some()
    && !input.default_org_id_lbl.as_ref().unwrap().is_empty()
    && input.default_org_id.is_none()
  {
    input.default_org_id_lbl = input.default_org_id_lbl.map(|item| 
      item.trim().to_owned()
    );
    let model = crate::base::org::org_dao::find_one_org(
      crate::base::org::org_model::OrgSearch {
        lbl: input.default_org_id_lbl.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(model) = model {
      input.default_org_id = model.id.into();
    }
  } else if
    (input.default_org_id_lbl.is_none() || input.default_org_id_lbl.as_ref().unwrap().is_empty())
    && input.default_org_id.is_some()
  {
    let org_model = crate::base::org::org_dao::find_one_org(
      crate::base::org::org_model::OrgSearch {
        id: input.default_org_id.clone(),
        ..Default::default()
      }.into(),
      None,
      Some(Options::new().set_is_debug(Some(false))),
    ).await?;
    if let Some(org_model) = org_model {
      input.default_org_id_lbl = org_model.lbl.into();
    }
  }
  
  // 类型
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
      input.r#type = val.parse::<UsrType>()?.into();
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

// MARK: creates_return_usr
/// 批量创建用户并返回
#[allow(dead_code)]
pub async fn creates_return_usr(
  inputs: Vec<UsrInput>,
  options: Option<Options>,
) -> Result<Vec<UsrModel>> {
  
  let table = "base_usr";
  let method = "creates_return_usr";
  
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
  
  let models_usr = find_by_ids_usr(
    ids,
    options,
  ).await?;
  
  Ok(models_usr)
}

// MARK: creates_usr
/// 批量创建用户
pub async fn creates_usr(
  inputs: Vec<UsrInput>,
  options: Option<Options>,
) -> Result<Vec<UsrId>> {
  
  let table = "base_usr";
  let method = "creates_usr";
  
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

/// 批量创建用户
#[allow(unused_variables, clippy::redundant_locals)]
async fn _creates(
  inputs: Vec<UsrInput>,
  options: Option<Options>,
) -> Result<Vec<UsrId>> {
  
  let table = "base_usr";
  
  let is_silent_mode = get_is_silent_mode(options.as_ref());
  
  let unique_type = options.as_ref()
    .and_then(|item|
      item.get_unique_type()
    )
    .unwrap_or_default();
  
  let mut ids2: Vec<UsrId> = vec![];
  let mut inputs2: Vec<UsrInput> = vec![];
  
  for input in inputs {
  
    if input.id.is_some() {
      return Err(eyre!("Can not set id when create in dao: {table}"));
    }
    
    let old_models = find_by_unique_usr(
      input.clone().into(),
      None,
      options.clone(),
    ).await?;
    
    if !old_models.is_empty() {
      let mut id: Option<UsrId> = None;
      
      for old_model in old_models {
        let options = Options::from(options.clone())
          .set_unique_type(unique_type);
        
        id = check_by_unique_usr(
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
  // 头像
  sql_fields += ",img";
  // 名称
  sql_fields += ",lbl";
  // 用户名
  sql_fields += ",username";
  // 密码
  sql_fields += ",password";
  // 默认组织
  sql_fields += ",default_org_id";
  // 类型
  sql_fields += ",type";
  // 锁定
  sql_fields += ",is_locked";
  // 启用
  sql_fields += ",is_enabled";
  // 排序
  sql_fields += ",order_by";
  // 备注
  sql_fields += ",rem";
  // 隐藏记录
  sql_fields += ",is_hidden";
  
  let inputs2_len = inputs2.len();
  let mut sql_values = String::with_capacity((2 * 21 + 3) * inputs2_len);
  let mut inputs2_ids = vec![];
  
  for (i, input) in inputs2
    .clone()
    .into_iter()
    .enumerate()
  {
    
    let id: UsrId = get_short_uuid().into();
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
    // 头像
    if let Some(img) = input.img {
      sql_values += ",?";
      args.push(img.into());
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
    // 用户名
    if let Some(username) = input.username {
      sql_values += ",?";
      args.push(username.into());
    } else {
      sql_values += ",default";
    }
    // 密码
    if let Some(password) = input.password {
      if !password.is_empty() {
        sql_values += ",?";
        args.push(get_password(password)?.into());
      } else {
        sql_values += ",default";
      }
    } else {
      sql_values += ",default";
    }
    // 默认组织
    if let Some(default_org_id) = input.default_org_id {
      sql_values += ",?";
      args.push(default_org_id.into());
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
    // 隐藏记录
    if let Some(is_hidden) = input.is_hidden {
      sql_values += ",?";
      args.push(is_hidden.into());
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
    
    // 所属角色
    if let Some(role_ids) = input.role_ids {
      many2many_update(
        id.clone().into(),
        role_ids
          .iter()
          .map(|item| item.clone().into())
          .collect(),
        ManyOpts {
          r#mod: "base",
          table: "usr_role",
          column1: "usr_id",
          column2: "role_id",
        },
      ).await?;
    }
    
    // 所属部门
    if let Some(dept_ids) = input.dept_ids {
      many2many_update(
        id.clone().into(),
        dept_ids
          .iter()
          .map(|item| item.clone().into())
          .collect(),
        ManyOpts {
          r#mod: "base",
          table: "usr_dept",
          column1: "usr_id",
          column2: "dept_id",
        },
      ).await?;
    }
    
    // 所属组织
    if let Some(org_ids) = input.org_ids {
      many2many_update(
        id.clone().into(),
        org_ids
          .iter()
          .map(|item| item.clone().into())
          .collect(),
        ManyOpts {
          r#mod: "base",
          table: "usr_org",
          column1: "usr_id",
          column2: "org_id",
        },
      ).await?;
    }
  }
  
  Ok(ids2)
}

// MARK: create_return_usr
/// 创建用户并返回
#[allow(dead_code)]
pub async fn create_return_usr(
  #[allow(unused_mut)]
  mut input: UsrInput,
  options: Option<Options>,
) -> Result<UsrModel> {
  
  let id = create_usr(
    input.clone(),
    options.clone(),
  ).await?;
  
  let model_usr = find_by_id_usr(
    id,
    options,
  ).await?;
  
  if model_usr.is_none() {
    let err_msg = "create_return_usr: model_usr.is_none()";
    return Err(eyre!(
      ServiceException {
        message: err_msg.to_owned(),
        trace: true,
        ..Default::default()
      },
    ));
  }
  let model_usr = model_usr.unwrap();
  
  Ok(model_usr)
}

// MARK: create_usr
/// 创建用户
#[allow(dead_code)]
pub async fn create_usr(
  #[allow(unused_mut)]
  mut input: UsrInput,
  options: Option<Options>,
) -> Result<UsrId> {
  
  let table = "base_usr";
  let method = "create_usr";
  
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

// MARK: update_tenant_by_id_usr
/// 用户根据id修改租户id
pub async fn update_tenant_by_id_usr(
  id: UsrId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  let table = "base_usr";
  let method = "update_tenant_by_id_usr";
  
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

// MARK: update_by_id_usr
/// 根据 id 修改用户
#[allow(unused_mut)]
#[allow(unused_variables)]
pub async fn update_by_id_usr(
  id: UsrId,
  mut input: UsrInput,
  options: Option<Options>,
) -> Result<UsrId> {
  
  let table = "base_usr";
  let method = "update_by_id_usr";
  
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
  
  let old_model = find_by_id_usr(
    id.clone(),
    options.clone(),
  ).await?;
  
  if old_model.is_none() {
    let err_msg = "编辑失败, 此 用户 已被删除";
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
    
    let models = find_by_unique_usr(
      input.into(),
      None,
      options.clone(),
    ).await?;
    
    let models = models.into_iter()
      .filter(|item| 
        item.id != id
      )
      .collect::<Vec<UsrModel>>();
    
    if !models.is_empty() {
      let unique_type = options
        .as_ref()
        .and_then(|item| item.get_unique_type())
        .unwrap_or(UniqueType::Throw);
      if unique_type == UniqueType::Throw {
        let err_msg = "此 用户 已经存在";
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
  // 头像
  if let Some(img) = input.img {
    field_num += 1;
    sql_fields += "img=?,";
    args.push(img.into());
  }
  // 名称
  if let Some(lbl) = input.lbl {
    field_num += 1;
    sql_fields += "lbl=?,";
    args.push(lbl.into());
  }
  // 用户名
  if let Some(username) = input.username {
    field_num += 1;
    sql_fields += "username=?,";
    args.push(username.into());
  }
  // 密码
  if let Some(password) = input.password {
    if !password.is_empty() {
      field_num += 1;
      sql_fields += "password=?,";
      args.push(get_password(password)?.into());
    }
  }
  // 默认组织
  if let Some(default_org_id) = input.default_org_id {
    field_num += 1;
    sql_fields += "default_org_id=?,";
    args.push(default_org_id.into());
  }
  // 类型
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
    sql_fields += "rem=?,";
    args.push(rem.into());
  }
  // 隐藏记录
  if let Some(is_hidden) = input.is_hidden {
    field_num += 1;
    sql_fields += "is_hidden=?,";
    args.push(is_hidden.into());
  }
  
  // 所属角色
  if input.role_ids.is_some() {
    field_num += 1;
  }
  
  // 所属部门
  if input.dept_ids.is_some() {
    field_num += 1;
  }
  
  // 所属组织
  if input.org_ids.is_some() {
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
  
  // 所属角色
  if let Some(role_ids) = input.role_ids {
    many2many_update(
      id.clone().into(),
      role_ids
        .iter()
        .map(|item| item.clone().into())
        .collect(),
      ManyOpts {
        r#mod: "base",
        table: "usr_role",
        column1: "usr_id",
        column2: "role_id",
      },
    ).await?;
  }
  
  // 所属部门
  if let Some(dept_ids) = input.dept_ids {
    many2many_update(
      id.clone().into(),
      dept_ids
        .iter()
        .map(|item| item.clone().into())
        .collect(),
      ManyOpts {
        r#mod: "base",
        table: "usr_dept",
        column1: "usr_id",
        column2: "dept_id",
      },
    ).await?;
  }
  
  // 所属组织
  if let Some(org_ids) = input.org_ids {
    many2many_update(
      id.clone().into(),
      org_ids
        .iter()
        .map(|item| item.clone().into())
        .collect(),
      ManyOpts {
        r#mod: "base",
        table: "usr_org",
        column1: "usr_id",
        column2: "org_id",
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
  let table = "base_usr";
  vec![
    table,
  ]
}

// MARK: del_cache_usr
/// 清空缓存
#[allow(dead_code)]
pub async fn del_cache_usr() -> Result<()> {
  let cache_key1s = get_cache_tables();
  del_caches(
    cache_key1s.as_slice(),
  ).await?;
  Ok(())
}

// MARK: delete_by_ids_usr
/// 根据 ids 删除用户
#[allow(unused_variables)]
pub async fn delete_by_ids_usr(
  ids: Vec<UsrId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_usr";
  let method = "delete_by_ids_usr";
  
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
    
    let old_model = find_by_id_usr(
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
      let role_ids = old_model.role_ids.clone();
      if !role_ids.is_empty() {
        let mut args = QueryArgs::new();
        let mut sql = "update base_usr_role set is_deleted=1 where usr_id=? and".to_owned();
        args.push(id.clone().into());
        let arg = {
          let mut items = Vec::with_capacity(role_ids.len());
          for item in role_ids {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        };
        sql.push_str(" role_id in (");
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
      let dept_ids = old_model.dept_ids.clone();
      if !dept_ids.is_empty() {
        let mut args = QueryArgs::new();
        let mut sql = "update base_usr_dept set is_deleted=1 where usr_id=? and".to_owned();
        args.push(id.clone().into());
        let arg = {
          let mut items = Vec::with_capacity(dept_ids.len());
          for item in dept_ids {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        };
        sql.push_str(" dept_id in (");
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
      let org_ids = old_model.org_ids.clone();
      if !org_ids.is_empty() {
        let mut args = QueryArgs::new();
        let mut sql = "update base_usr_org set is_deleted=1 where usr_id=? and".to_owned();
        args.push(id.clone().into());
        let arg = {
          let mut items = Vec::with_capacity(org_ids.len());
          for item in org_ids {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        };
        sql.push_str(" org_id in (");
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
      let sql = "update base_dept_usr set is_deleted=1 where usr_id=? and is_deleted=0".to_owned();
      args.push(id.clone().into());
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

// MARK: get_is_enabled_by_id_usr
/// 根据 id 查找用户是否已启用
/// 记录不存在则返回 false
pub async fn get_is_enabled_by_id_usr(
  id: UsrId,
  options: Option<Options>,
) -> Result<bool> {
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let model = find_by_id_usr(
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

// MARK: enable_by_ids_usr
/// 根据 ids 启用或者禁用用户
pub async fn enable_by_ids_usr(
  ids: Vec<UsrId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_usr";
  let method = "enable_by_ids_usr";
  
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

// MARK: get_is_locked_by_id_usr
/// 根据 id 查找用户是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
pub async fn get_is_locked_by_id_usr(
  id: UsrId,
  options: Option<Options>,
) -> Result<bool> {
  
  let options = Options::from(options)
    .set_is_debug(Some(false));
  let options = Some(options);
  
  let model = find_by_id_usr(
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

// MARK: lock_by_ids_usr
/// 根据 ids 锁定或者解锁用户
pub async fn lock_by_ids_usr(
  ids: Vec<UsrId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_usr";
  let method = "lock_by_ids_usr";
  
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

// MARK: revert_by_ids_usr
/// 根据 ids 还原用户
pub async fn revert_by_ids_usr(
  ids: Vec<UsrId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_usr";
  let method = "revert_by_ids_usr";
  
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
    
    let mut old_model = find_one_usr(
      UsrSearch {
        id: Some(id.clone()),
        is_deleted: Some(1),
        ..Default::default()
      }.into(),
      None,
      options.clone(),
    ).await?;
    
    if old_model.is_none() {
      old_model = find_by_id_usr(
        id.clone(),
        options.clone(),
      ).await?;
    }
    
    if old_model.is_none() {
      continue;
    }
    let old_model = old_model.unwrap();
    
    {
      let mut input: UsrInput = old_model.clone().into();
      input.id = None;
      
      let models = find_by_unique_usr(
        input.into(),
        None,
        options.clone(),
      ).await?;
      
      let models: Vec<UsrModel> = models
        .into_iter()
        .filter(|item| 
          item.id != id
        )
        .collect();
      
      if !models.is_empty() {
        let err_msg = "此 用户 已经存在";
        return Err(eyre!(err_msg));
      }
    }
    
    num += execute(
      sql,
      args,
      options.clone(),
    ).await?;
    {
      let role_ids = old_model.role_ids.clone();
      if !role_ids.is_empty() {
        let mut args = QueryArgs::new();
        let mut sql = "update base_usr_role set is_deleted=0 where usr_id=? and".to_owned();
        args.push(id.clone().into());
        let arg = {
          let mut items = Vec::with_capacity(role_ids.len());
          for item in role_ids {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        };
        sql.push_str(" role_id in (");
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
      let dept_ids = old_model.dept_ids.clone();
      if !dept_ids.is_empty() {
        let mut args = QueryArgs::new();
        let mut sql = "update base_usr_dept set is_deleted=0 where usr_id=? and".to_owned();
        args.push(id.clone().into());
        let arg = {
          let mut items = Vec::with_capacity(dept_ids.len());
          for item in dept_ids {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        };
        sql.push_str(" dept_id in (");
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
      let org_ids = old_model.org_ids.clone();
      if !org_ids.is_empty() {
        let mut args = QueryArgs::new();
        let mut sql = "update base_usr_org set is_deleted=0 where usr_id=? and".to_owned();
        args.push(id.clone().into());
        let arg = {
          let mut items = Vec::with_capacity(org_ids.len());
          for item in org_ids {
            args.push(item.into());
            items.push("?");
          }
          items.join(",")
        };
        sql.push_str(" org_id in (");
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

// MARK: force_delete_by_ids_usr
/// 根据 ids 彻底删除用户
#[allow(unused_variables)]
pub async fn force_delete_by_ids_usr(
  ids: Vec<UsrId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_usr";
  let method = "force_delete_by_ids_usr";
  
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
    
    let old_model = find_all_usr(
      UsrSearch {
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
      let role_ids = old_model.role_ids.clone();
      if !role_ids.is_empty() {
        let mut args = QueryArgs::new();
        let mut sql = "delete from base_usr_role where usr_id=? and".to_owned();
        args.push(id.clone().into());
        let mut items = Vec::with_capacity(role_ids.len());
        for item in role_ids {
          items.push("?");
          args.push(item.clone().into());
        }
        sql.push_str(" role_id in (");
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
      let dept_ids = old_model.dept_ids.clone();
      if !dept_ids.is_empty() {
        let mut args = QueryArgs::new();
        let mut sql = "delete from base_usr_dept where usr_id=? and".to_owned();
        args.push(id.clone().into());
        let mut items = Vec::with_capacity(dept_ids.len());
        for item in dept_ids {
          items.push("?");
          args.push(item.clone().into());
        }
        sql.push_str(" dept_id in (");
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
      let org_ids = old_model.org_ids.clone();
      if !org_ids.is_empty() {
        let mut args = QueryArgs::new();
        let mut sql = "delete from base_usr_org where usr_id=? and".to_owned();
        args.push(id.clone().into());
        let mut items = Vec::with_capacity(org_ids.len());
        for item in org_ids {
          items.push("?");
          args.push(item.clone().into());
        }
        sql.push_str(" org_id in (");
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
      let sql = "delete from base_dept_usr where usr_id=?".to_owned();
      args.push(id.clone().into());
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

// MARK: find_last_order_by_usr
/// 查找 用户 order_by 字段的最大值
pub async fn find_last_order_by_usr(
  options: Option<Options>,
) -> Result<u32> {
  
  let table = "base_usr";
  let method = "find_last_order_by_usr";
  
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

// MARK: validate_is_enabled_usr
/// 校验用户是否启用
#[allow(dead_code)]
pub async fn validate_is_enabled_usr(
  model: &UsrModel,
) -> Result<()> {
  if model.is_enabled == 0 {
    let err_msg = "用户已禁用";
    return Err(eyre!(err_msg));
  }
  Ok(())
}

// MARK: validate_option_usr
/// 校验用户是否存在
#[allow(dead_code)]
pub async fn validate_option_usr(
  model: Option<UsrModel>,
) -> Result<UsrModel> {
  if model.is_none() {
    let err_msg = "用户不存在";
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
