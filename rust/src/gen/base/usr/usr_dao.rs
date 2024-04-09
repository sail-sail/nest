#[allow(unused_imports)]
use std::collections::HashMap;
#[allow(unused_imports)]
use std::collections::HashSet;

use anyhow::Result;
use tracing::{info, error};
use crate::common::auth::auth_dao::get_password;
#[allow(unused_imports)]
use crate::common::util::string::*;

use crate::common::util::dao::{
  many2many_update,
  ManyOpts,
};

#[allow(unused_imports)]
use crate::common::context::{
  get_auth_model,
  get_auth_id,
  get_auth_tenant_id,
  get_auth_org_id,
  execute,
  query,
  query_one,
  get_now,
  get_req_id,
  QueryArgs,
  Options,
  CountModel,
  UniqueType,
  SrvErr,
  OrderByModel,
  get_short_uuid,
  get_order_by_query,
  get_page_query,
  del_caches,
  IS_DEBUG,
};

use crate::src::base::i18n::i18n_dao;

use crate::common::gql::model::{
  PageInput,
  SortInput,
};

use crate::src::base::dict_detail::dict_detail_dao::get_dict;

use super::usr_model::*;

use crate::gen::base::tenant::tenant_model::TenantId;
use crate::gen::base::org::org_model::OrgId;
use crate::gen::base::dept::dept_model::DeptId;
use crate::gen::base::role::role_model::RoleId;

#[allow(unused_variables)]
async fn get_where_query(
  args: &mut QueryArgs,
  search: Option<&UsrSearch>,
  options: Option<&Options>,
) -> Result<String> {
  let is_deleted = search
    .and_then(|item| item.is_deleted)
    .unwrap_or(0);
  let mut where_query = String::with_capacity(80 * 20 * 2);
  where_query.push_str(" t.is_deleted = ?");
  args.push(is_deleted.into());
  {
    let id = match search {
      Some(item) => item.id.as_ref(),
      None => None,
    };
    if let Some(id) = id {
      where_query.push_str(" and t.id = ?");
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
      where_query.push_str(" and t.tenant_id = ?");
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
      where_query.push_str(" and t.img = ?");
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
      where_query.push_str(" and t.lbl = ?");
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
      where_query.push_str(" and t.username = ?");
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
      where_query.push_str(" and org_ids_lbl.id is null");
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
      where_query.push_str(" and default_org_id_lbl.id in (");
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
      where_query.push_str(" and default_org_id_lbl.id is null");
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
      where_query.push_str(" and dept_ids_lbl.id is null");
    }
  }
  // 拥有角色
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
      where_query.push_str(" and role_ids_lbl.id is null");
    }
  }
  // 备注
  {
    let rem = match search {
      Some(item) => item.rem.clone(),
      None => None,
    };
    if let Some(rem) = rem {
      where_query.push_str(" and t.rem = ?");
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
      where_query.push_str(" and create_usr_id_lbl.id in (");
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
      where_query.push_str(" and create_usr_id_lbl.id is null");
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
      where_query.push_str(" and update_usr_id_lbl.id in (");
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
      where_query.push_str(" and update_usr_id_lbl.id is null");
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
    left join base_usr_org
      on base_usr_org.usr_id = t.id
      and base_usr_org.is_deleted = ?
    left join base_org
      on base_usr_org.org_id = base_org.id
      and base_org.is_deleted = ?
    left join (
      select
        json_objectagg(base_usr_org.order_by, base_org.id) org_ids,
        json_objectagg(base_usr_org.order_by, base_org.lbl) org_ids_lbl,
        base_usr.id usr_id
      from base_usr_org
      inner join base_org
        on base_org.id = base_usr_org.org_id
      inner join base_usr
        on base_usr.id = base_usr_org.usr_id
      where
        base_usr_org.is_deleted = ?
      group by usr_id
    ) _org
      on _org.usr_id = t.id
    left join base_org default_org_id_lbl
      on default_org_id_lbl.id = t.default_org_id
    left join base_usr_dept
      on base_usr_dept.usr_id = t.id
      and base_usr_dept.is_deleted = ?
    left join base_dept
      on base_usr_dept.dept_id = base_dept.id
      and base_dept.is_deleted = ?
    left join (
      select
        json_objectagg(base_usr_dept.order_by, base_dept.id) dept_ids,
        json_objectagg(base_usr_dept.order_by, base_dept.lbl) dept_ids_lbl,
        base_usr.id usr_id
      from base_usr_dept
      inner join base_dept
        on base_dept.id = base_usr_dept.dept_id
      inner join base_usr
        on base_usr.id = base_usr_dept.usr_id
      where
        base_usr_dept.is_deleted = ?
      group by usr_id
    ) _dept
      on _dept.usr_id = t.id
    left join base_usr_role
      on base_usr_role.usr_id = t.id
      and base_usr_role.is_deleted = ?
    left join base_role
      on base_usr_role.role_id = base_role.id
      and base_role.is_deleted = ?
    left join (
      select
        json_objectagg(base_usr_role.order_by, base_role.id) role_ids,
        json_objectagg(base_usr_role.order_by, base_role.lbl) role_ids_lbl,
        base_usr.id usr_id
      from base_usr_role
      inner join base_role
        on base_role.id = base_usr_role.role_id
      inner join base_usr
        on base_usr.id = base_usr_role.usr_id
      where
        base_usr_role.is_deleted = ?
      group by usr_id
    ) _role
      on _role.usr_id = t.id
    left join base_usr create_usr_id_lbl
      on create_usr_id_lbl.id = t.create_usr_id
    left join base_usr update_usr_id_lbl
      on update_usr_id_lbl.id = t.update_usr_id"#.to_owned();
  args.push(is_deleted.into());
  args.push(is_deleted.into());
  args.push(is_deleted.into());
  args.push(is_deleted.into());
  args.push(is_deleted.into());
  args.push(is_deleted.into());
  args.push(is_deleted.into());
  args.push(is_deleted.into());
  args.push(is_deleted.into());
  Ok(from_query)
}

/// 根据搜索条件和分页查找用户列表
#[allow(unused_mut)]
pub async fn find_all(
  search: Option<UsrSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<UsrModel>> {
  
  let table = "base_usr";
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
  // 所属组织
  if let Some(search) = &search {
    if search.org_ids.is_some() && search.org_ids.as_ref().unwrap().is_empty() {
      return Ok(vec![]);
    }
  }
  // 默认组织
  if let Some(search) = &search {
    if search.default_org_id.is_some() && search.default_org_id.as_ref().unwrap().is_empty() {
      return Ok(vec![]);
    }
  }
  // 锁定
  if let Some(search) = &search {
    if search.is_locked.is_some() && search.is_locked.as_ref().unwrap().is_empty() {
      return Ok(vec![]);
    }
  }
  // 启用
  if let Some(search) = &search {
    if search.is_enabled.is_some() && search.is_enabled.as_ref().unwrap().is_empty() {
      return Ok(vec![]);
    }
  }
  // 所属部门
  if let Some(search) = &search {
    if search.dept_ids.is_some() && search.dept_ids.as_ref().unwrap().is_empty() {
      return Ok(vec![]);
    }
  }
  // 拥有角色
  if let Some(search) = &search {
    if search.role_ids.is_some() && search.role_ids.as_ref().unwrap().is_empty() {
      return Ok(vec![]);
    }
  }
  // 创建人
  if let Some(search) = &search {
    if search.create_usr_id.is_some() && search.create_usr_id.as_ref().unwrap().is_empty() {
      return Ok(vec![]);
    }
  }
  // 更新人
  if let Some(search) = &search {
    if search.update_usr_id.is_some() && search.update_usr_id.as_ref().unwrap().is_empty() {
      return Ok(vec![]);
    }
  }
  // 隐藏记录
  if let Some(search) = &search {
    if search.is_hidden.is_some() && search.is_hidden.as_ref().unwrap().is_empty() {
      return Ok(vec![]);
    }
  }
  
  let options = Options::from(options)
    .set_is_debug(false);
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
      order: "asc".into(),
    });
  }
  
  if !sort.iter().any(|item| item.prop == "create_time") {
    sort.push(SortInput {
      prop: "create_time".into(),
      order: "asc".into(),
    });
  }
  
  let sort = sort.into();
  
  let order_by_query = get_order_by_query(sort);
  let page_query = get_page_query(page);
  
  let sql = format!(r#"
    select f.* from (
    select t.*
      ,max(org_ids) org_ids
      ,max(org_ids_lbl) org_ids_lbl
      ,default_org_id_lbl.lbl default_org_id_lbl
      ,max(dept_ids) dept_ids
      ,max(dept_ids_lbl) dept_ids_lbl
      ,max(role_ids) role_ids
      ,max(role_ids_lbl) role_ids_lbl
      ,create_usr_id_lbl.lbl create_usr_id_lbl
      ,update_usr_id_lbl.lbl update_usr_id_lbl
    from
      {from_query}
    where
      {where_query}
    group by t.id{order_by_query}) f {page_query}
  "#);
  
  let args = args.into();
  
  let options = Options::from(options);
  
  let options = options.set_cache_key(table, &sql, &args);
  
  let options = options.into();
  
  let mut res: Vec<UsrModel> = query(
    sql,
    args,
    options,
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
    .map_err(|err| anyhow::anyhow!(format!("{:#?}", err)))?;
  
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

/// 根据条件查找用户总数
pub async fn find_count(
  search: Option<UsrSearch>,
  options: Option<Options>,
) -> Result<i64> {
  
  let table = "base_usr";
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
    .set_is_debug(false);
  let options = Some(options);
  
  let mut args = QueryArgs::new();
  
  let from_query = get_from_query(&mut args, search.as_ref(), options.as_ref()).await?;
  let where_query = get_where_query(&mut args, search.as_ref(), options.as_ref()).await?;
  
  let sql = format!(r#"
    select
      count(1) total
    from
      (
        select
          1
        from
          {from_query}
        where
          {where_query}
        group by t.id
      ) t
  "#);
  
  let args = args.into();
  
  let options = Options::from(options);
  
  let options = options.set_cache_key(table, &sql, &args);
  
  let options = options.into();
  
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

/// 获取路由地址
pub fn get_route_path() -> String {
  "/base/usr".to_owned()
}

/// 获取当前路由的国际化
pub fn get_n_route() -> i18n_dao::NRoute {
  i18n_dao::NRoute {
    route_path: get_route_path().into(),
  }
}

/// 获取用户字段注释
pub async fn get_field_comments(
  _options: Option<Options>,
) -> Result<UsrFieldComment> {
  
  let n_route = get_n_route();
  
  let i18n_code_maps: Vec<i18n_dao::I18nCodeMap> = vec![
    "ID".into(),
    "头像".into(),
    "名称".into(),
    "用户名".into(),
    "所属组织".into(),
    "所属组织".into(),
    "默认组织".into(),
    "默认组织".into(),
    "锁定".into(),
    "锁定".into(),
    "启用".into(),
    "启用".into(),
    "排序".into(),
    "所属部门".into(),
    "所属部门".into(),
    "拥有角色".into(),
    "拥有角色".into(),
    "备注".into(),
    "创建人".into(),
    "创建人".into(),
    "创建时间".into(),
    "创建时间".into(),
    "更新人".into(),
    "更新人".into(),
    "更新时间".into(),
    "更新时间".into(),
    "隐藏记录".into(),
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
  
  let field_comments = UsrFieldComment {
    id: vec[0].to_owned(),
    img: vec[1].to_owned(),
    lbl: vec[2].to_owned(),
    username: vec[3].to_owned(),
    org_ids: vec[4].to_owned(),
    org_ids_lbl: vec[5].to_owned(),
    default_org_id: vec[6].to_owned(),
    default_org_id_lbl: vec[7].to_owned(),
    is_locked: vec[8].to_owned(),
    is_locked_lbl: vec[9].to_owned(),
    is_enabled: vec[10].to_owned(),
    is_enabled_lbl: vec[11].to_owned(),
    order_by: vec[12].to_owned(),
    dept_ids: vec[13].to_owned(),
    dept_ids_lbl: vec[14].to_owned(),
    role_ids: vec[15].to_owned(),
    role_ids_lbl: vec[16].to_owned(),
    rem: vec[17].to_owned(),
    create_usr_id: vec[18].to_owned(),
    create_usr_id_lbl: vec[19].to_owned(),
    create_time: vec[20].to_owned(),
    create_time_lbl: vec[21].to_owned(),
    update_usr_id: vec[22].to_owned(),
    update_usr_id_lbl: vec[23].to_owned(),
    update_time: vec[24].to_owned(),
    update_time_lbl: vec[25].to_owned(),
  };
  Ok(field_comments)
}

/// 根据条件查找第一个用户
pub async fn find_one(
  search: Option<UsrSearch>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Option<UsrModel>> {
  
  let table = "base_usr";
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
    .set_is_debug(false);
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
  
  let model: Option<UsrModel> = res.into_iter().next();
  
  Ok(model)
}

/// 根据 id 查找用户
pub async fn find_by_id(
  id: UsrId,
  options: Option<Options>,
) -> Result<Option<UsrModel>> {
  
  let table = "base_usr";
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
    .set_is_debug(false);
  let options = Some(options);
  
  let search = UsrSearch {
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

/// 根据搜索条件判断用户是否存在
pub async fn exists(
  search: Option<UsrSearch>,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = "base_usr";
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
    .set_is_debug(false);
  let options = Some(options);
  
  let total = find_count(
    search,
    options,
  ).await?;
  
  Ok(total > 0)
}

/// 根据 id 判断用户是否存在
pub async fn exists_by_id(
  id: UsrId,
  options: Option<Options>,
) -> Result<bool> {
  
  let table = "base_usr";
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
    .set_is_debug(false);
  let options = Some(options);
  
  let search = UsrSearch {
    id: Some(id),
    ..Default::default()
  }.into();
  
  let res = exists(
    search,
    options,
  ).await?;
  
  Ok(res)
}

/// 通过唯一约束获得数据列表
#[allow(unused_variables)]
pub async fn find_by_unique(
  search: UsrSearch,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<UsrModel>> {
  
  let table = "base_usr";
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
    .set_is_debug(false);
  let options = Some(options);
  
  if let Some(id) = search.id {
    let model = find_by_id(
      id,
      None,
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
      lbl: search.lbl,
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
      search.username.is_none()
    {
      return Ok(vec![]);
    }
    
    let search = UsrSearch {
      username: search.username,
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

/// 通过唯一约束检查数据是否已经存在
#[allow(unused_variables)]
pub async fn check_by_unique(
  input: UsrInput,
  model: UsrModel,
  options: Option<Options>,
) -> Result<Option<UsrId>> {
  
  let table = "base_usr";
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
    .set_is_debug(false);
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
      "用户".to_owned(),
      None,
    ).await?;
    let map = HashMap::from([
      ("0".to_owned(), table_comment),
    ]);
    let err_msg = i18n_dao::ns(
      "此 {0} 已经存在".to_owned(),
      map.into(),
    ).await?;
    return Err(SrvErr::msg(err_msg).into());
  }
  Ok(None)
}

/// 根据lbl翻译业务字典, 外键关联id, 日期
#[allow(unused_variables)]
pub async fn set_id_by_lbl(
  input: UsrInput,
) -> Result<UsrInput> {
  
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
      let model = crate::gen::base::org::org_dao::find_one(
        crate::gen::base::org::org_model::OrgSearch {
          lbl: lbl.into(),
          ..Default::default()
        }.into(),
        None,
        None,
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
    let model = crate::gen::base::org::org_dao::find_one(
      crate::gen::base::org::org_model::OrgSearch {
        lbl: input.default_org_id_lbl.clone(),
        ..Default::default()
      }.into(),
      None,
      None,
    ).await?;
    if let Some(model) = model {
      input.default_org_id = model.id.into();
    }
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
      let model = crate::gen::base::dept::dept_dao::find_one(
        crate::gen::base::dept::dept_model::DeptSearch {
          lbl: lbl.into(),
          ..Default::default()
        }.into(),
        None,
        None,
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
  
  // 拥有角色
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
      let model = crate::gen::base::role::role_dao::find_one(
        crate::gen::base::role::role_model::RoleSearch {
          lbl: lbl.into(),
          ..Default::default()
        }.into(),
        None,
        None,
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
  
  Ok(input)
}

pub fn get_is_debug(
  options: Option<&Options>,
) -> bool {
  let mut is_debug: bool = *IS_DEBUG;
  if let Some(options) = &options {
    is_debug = options.get_is_debug();
  }
  is_debug
}

/// 创建用户
pub async fn create(
  #[allow(unused_mut)]
  mut input: UsrInput,
  options: Option<Options>,
) -> Result<UsrId> {
  
  let table = "base_usr";
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
  
  let options = Options::from(options)
    .set_is_debug(false);
  let options = Some(options);
  
  if input.id.is_some() {
    return Err(SrvErr::msg(
      format!("Can not set id when create in dao: {table}")
    ).into());
  }
  
  let old_models = find_by_unique(
    input.clone().into(),
    None,
    None,
  ).await?;
  
  if !old_models.is_empty() {
    
    let unique_type = options.as_ref()
      .and_then(|item|
        item.get_unique_type()
      )
      .unwrap_or_default();
    
    let mut id: Option<UsrId> = None;
    
    for old_model in old_models {
      
      let options = Options::from(options.clone())
        .set_unique_type(unique_type);
      let options = Some(options);
      
      id = check_by_unique(
        input.clone(),
        old_model,
        options,
      ).await?;
      
      if id.is_some() {
        break;
      }
    }
    
    if let Some(id) = id {
      return Ok(id);
    }
  }
  
  let mut id: UsrId;
  loop {
    id = get_short_uuid().into();
    let is_exist = exists_by_id(
      id.clone(),
      None,
    ).await?;
    if !is_exist {
      break;
    }
    error!(
      "{req_id} ID_COLLIDE: {table} {id}",
      req_id = get_req_id(),
    );
  }
  let id = id;
  
  let mut args = QueryArgs::new();
  
  let mut sql_fields = String::with_capacity(80 * 20 + 20);
  let mut sql_values = String::with_capacity(2 * 20 + 2);
  
  sql_fields += "id";
  sql_values += "?";
  args.push(id.clone().into());
  
  if let Some(create_time) = input.create_time {
    sql_fields += ",create_time";
    sql_values += ",?";
    args.push(create_time.into());
  } else {
    sql_fields += ",create_time";
    sql_values += ",?";
    args.push(get_now().into());
  }
  
  if input.create_usr_id.is_some() && input.create_usr_id.as_ref().unwrap() != "-" {
    let create_usr_id = input.create_usr_id.clone().unwrap();
    sql_fields += ",create_usr_id";
    sql_values += ",?";
    args.push(create_usr_id.into());
  } else {
    let usr_id = get_auth_id();
    if let Some(usr_id) = usr_id {
      sql_fields += ",create_usr_id";
      sql_values += ",?";
      args.push(usr_id.into());
    }
  }
  
  if let Some(tenant_id) = input.tenant_id {
    sql_fields += ",tenant_id";
    sql_values += ",?";
    args.push(tenant_id.into());
  } else if let Some(tenant_id) = get_auth_tenant_id() {
    sql_fields += ",tenant_id";
    sql_values += ",?";
    args.push(tenant_id.into());
  }
  // 头像
  if let Some(img) = input.img {
    sql_fields += ",img";
    sql_values += ",?";
    args.push(img.into());
  }
  // 名称
  if let Some(lbl) = input.lbl {
    sql_fields += ",lbl";
    sql_values += ",?";
    args.push(lbl.into());
  }
  // 用户名
  if let Some(username) = input.username {
    sql_fields += ",username";
    sql_values += ",?";
    args.push(username.into());
  }
  // 密码
  if let Some(password) = input.password {
    if !password.is_empty() {
      sql_fields += ",password";
      sql_values += ",?";
      args.push(get_password(password)?.into());
    }
  }
  // 默认组织
  if let Some(default_org_id) = input.default_org_id {
    sql_fields += ",default_org_id";
    sql_values += ",?";
    args.push(default_org_id.into());
  }
  // 锁定
  if let Some(is_locked) = input.is_locked {
    sql_fields += ",is_locked";
    sql_values += ",?";
    args.push(is_locked.into());
  }
  // 启用
  if let Some(is_enabled) = input.is_enabled {
    sql_fields += ",is_enabled";
    sql_values += ",?";
    args.push(is_enabled.into());
  }
  // 排序
  if let Some(order_by) = input.order_by {
    sql_fields += ",order_by";
    sql_values += ",?";
    args.push(order_by.into());
  }
  // 备注
  if let Some(rem) = input.rem {
    sql_fields += ",rem";
    sql_values += ",?";
    args.push(rem.into());
  }
  // 更新人
  if let Some(update_usr_id) = input.update_usr_id {
    sql_fields += ",update_usr_id";
    sql_values += ",?";
    args.push(update_usr_id.into());
  }
  // 更新时间
  if let Some(update_time) = input.update_time {
    sql_fields += ",update_time";
    sql_values += ",?";
    args.push(update_time.into());
  }
  // 隐藏记录
  if let Some(is_hidden) = input.is_hidden {
    sql_fields += ",is_hidden";
    sql_values += ",?";
    args.push(is_hidden.into());
  }
  
  let sql = format!(
    "insert into {} ({}) values ({})",
    table,
    sql_fields,
    sql_values,
  );
  
  let args = args.into();
  
  let options = Options::from(options);
  
  let options = options.set_del_cache_key1s(get_cache_tables());
  
  let options = options.into();
  
  del_caches(
    vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
  ).await?;
  
  execute(
    sql,
    args,
    options,
  ).await?;
  
  del_caches(
    vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
  ).await?;
  
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
  
  // 拥有角色
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
  
  Ok(id)
}

/// 用户根据id修改租户id
pub async fn update_tenant_by_id(
  id: UsrId,
  tenant_id: TenantId,
  options: Option<Options>,
) -> Result<u64> {
  let table = "base_usr";
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
    .set_is_debug(false);
  let options = options.into();
  
  let mut args = QueryArgs::new();
  
  let sql_fields = "tenant_id = ?";
  args.push(tenant_id.into());
  
  let sql_where = "id = ?";
  args.push(id.into());
  
  let sql = format!(
    "update {} set {} where {}",
    table,
    sql_fields,
    sql_where,
  );
  
  let args = args.into();
  
  let options = Options::from(options);
  
  let options = options.into();
  
  let num = execute(
    sql,
    args,
    options,
  ).await?;
  
  Ok(num)
}

/// 根据 id 修改用户
#[allow(unused_mut)]
pub async fn update_by_id(
  id: UsrId,
  mut input: UsrInput,
  options: Option<Options>,
) -> Result<UsrId> {
  
  let old_model = find_by_id(
    id.clone(),
    None,
  ).await?;
  
  if old_model.is_none() {
    let table_comment = i18n_dao::ns(
      "用户".to_owned(),
      None,
    ).await?;
    let map = HashMap::from([
      ("0".to_owned(), table_comment),
    ]);
    let err_msg = i18n_dao::ns(
      "编辑失败, 此 {0} 已被删除".to_owned(),
      map.into(),
    ).await?;
    return Err(SrvErr::msg(err_msg).into());
  }
  
  {
    let mut input = input.clone();
    input.id = None;
    
    let models = find_by_unique(
      input.into(),
      None,
      None,
    ).await?;
    
    let models = models.into_iter()
      .filter(|item| 
        item.id != id
      )
      .collect::<Vec<UsrModel>>();
    
    if !models.is_empty() {
      let unique_type = {
        if let Some(options) = options.as_ref() {
          options.get_unique_type()
            .unwrap_or(UniqueType::Throw)
        } else {
          UniqueType::Throw
        }
      };
      if unique_type == UniqueType::Throw {
        let table_comment = i18n_dao::ns(
          "用户".to_owned(),
          None,
        ).await?;
        let map = HashMap::from([
          ("0".to_owned(), table_comment),
        ]);
        let err_msg = i18n_dao::ns(
          "此 {0} 已经存在".to_owned(),
          map.into(),
        ).await?;
        return Err(SrvErr::msg(err_msg).into());
      } else if unique_type == UniqueType::Ignore {
        return Ok(id);
      }
    }
  }
  
  let table = "base_usr";
  let method = "update_by_id";
  
  let is_debug = get_is_debug(options.as_ref());
  
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
    .set_is_debug(false);
  let options = Some(options);
  
  let mut args = QueryArgs::new();
  
  let mut sql_fields = String::with_capacity(80 * 20 + 20);
  
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
  
  if field_num > 0 {
    
    if input.update_usr_id.is_some() && input.update_usr_id.as_ref().unwrap() != "-" {
      let update_usr_id = input.update_usr_id.clone().unwrap();
      sql_fields += "update_usr_id=?,";
      args.push(update_usr_id.into());
    } else {
      let usr_id = get_auth_id();
      if let Some(usr_id) = usr_id {
        sql_fields += "update_usr_id=?,";
        args.push(usr_id.into());
      }
    }
    
    if let Some(update_time) = input.update_time {
      sql_fields += "update_time=?,";
      args.push(update_time.into());
    } else {
      sql_fields += "update_time=?,";
      args.push(get_now().into());
    }
    
    if sql_fields.ends_with(',') {
      sql_fields.pop();
    }
    
    let sql_where = "id=?";
    args.push(id.clone().into());
    
    let sql = format!(
      "update {} set {} where {} limit 1",
      table,
      sql_fields,
      sql_where,
    );
    
    let args = args.into();
    
    let options = Options::from(options);
    
    let options = options.set_del_cache_key1s(get_cache_tables());
    
    let options = options.into();
    
    del_caches(
      vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
    ).await?;
    
    execute(
      sql,
      args,
      options,
    ).await?;
    
    del_caches(
      vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
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
    
    field_num += 1;
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
    
    field_num += 1;
  }
  
  // 拥有角色
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
    
    field_num += 1;
  }
  
  if field_num > 0 {
    let options = Options::from(None);
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

/// 清空缓存
#[allow(dead_code)]
pub async fn del_cache() -> Result<()> {
  let cache_key1s = get_cache_tables();
  del_caches(
    cache_key1s.as_slice(),
  ).await?;
  Ok(())
}

/// 根据 ids 删除用户
pub async fn delete_by_ids(
  ids: Vec<UsrId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_usr";
  let method = "delete_by_ids";
  
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
    .set_is_debug(false);
  
  let mut num = 0;
  for id in ids.clone() {
    
    let old_model = find_by_id(
      id.clone(),
      None,
    ).await?;
    if old_model.is_none() {
      continue;
    }
    
    let mut args = QueryArgs::new();
    
    let sql = format!(
      "update {} set is_deleted=1,delete_time=? where id=? limit 1",
      table,
    );
    
    args.push(get_now().into());
    args.push(id.into());
    
    let args = args.into();
    
    let options = options.clone();
    
    let options = options.set_del_cache_key1s(get_cache_tables());
    
    let options = options.into();
    
    del_caches(
      vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
    ).await?;
    
    num += execute(
      sql,
      args,
      options,
    ).await?;
    
    del_caches(
      vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
    ).await?;
  }
  
  Ok(num)
}

/// 根据 id 查找用户是否已启用
/// 记录不存在则返回 false
pub async fn get_is_enabled_by_id(
  id: UsrId,
  options: Option<Options>,
) -> Result<bool> {
  
  let model = find_by_id(id, options).await?;
  
  let is_enabled = {
    if let Some(model) = model {
      model.is_enabled == 1
    } else {
      false
    }
  };
  
  Ok(is_enabled)
}

/// 根据 ids 启用或者禁用用户
pub async fn enable_by_ids(
  ids: Vec<UsrId>,
  is_enabled: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_usr";
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
  
  let options = Options::from(options)
    .set_is_debug(false);
  
  let options = options.set_del_cache_key1s(get_cache_tables());
  
  let mut num = 0;
  for id in ids {
    let mut args = QueryArgs::new();
    
    let sql = format!(
      "update {} set is_enabled=? where id=? limit 1",
      table,
    );
    
    args.push(is_enabled.into());
    args.push(id.into());
    
    let args = args.into();
    
    let options = options.clone().into();
    
    del_caches(
      vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
    ).await?;
    
    num += execute(
      sql,
      args,
      options,
    ).await?;
    
    del_caches(
      vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
    ).await?;
  }
  
  Ok(num)
}

/// 根据 id 查找用户是否已锁定
/// 已锁定的记录不能修改和删除
/// 记录不存在则返回 false
pub async fn get_is_locked_by_id(
  id: UsrId,
  options: Option<Options>,
) -> Result<bool> {
  
  let model = find_by_id(id, options).await?;
  
  let is_locked = {
    if let Some(model) = model {
      model.is_locked == 1
    } else {
      false
    }
  };
  
  Ok(is_locked)
}

/// 根据 ids 锁定或者解锁用户
pub async fn lock_by_ids(
  ids: Vec<UsrId>,
  is_locked: u8,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_usr";
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
    
    let sql = format!(
      "update {} set is_locked=? where id=? limit 1",
      table,
    );
    
    args.push(is_locked.into());
    args.push(id.into());
    
    let args = args.into();
    
    let options = options.clone().into();
    
    del_caches(
      vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
    ).await?;
    
    num += execute(
      sql,
      args,
      options,
    ).await?;
    
    del_caches(
      vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
    ).await?;
  }
  
  Ok(num)
}

/// 根据 ids 还原用户
pub async fn revert_by_ids(
  ids: Vec<UsrId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_usr";
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
    .set_is_debug(false);
  
  let mut num = 0;
  for id in ids.clone() {
    let mut args = QueryArgs::new();
    
    let sql = format!(
      "update {} set is_deleted=0 where id=? limit 1",
      table,
    );
    
    args.push(id.clone().into());
    
    let args = args.into();
    
    let options = options.clone();
    
    let options = options.set_del_cache_key1s(get_cache_tables());
    
    let options = options.into();
    
    del_caches(
      vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
    ).await?;
    
    num += execute(
      sql,
      args,
      options,
    ).await?;
    
    del_caches(
      vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
    ).await?;
    
    // 检查数据的唯一索引
    {
      let old_model = find_by_id(
        id.clone(),
        None,
      ).await?;
      
      if old_model.is_none() {
        continue;
      }
      let old_model = old_model.unwrap();
      
      let mut input: UsrInput = old_model.into();
      input.id = None;
      
      let models = find_by_unique(
        input.into(),
        None,
        None,
      ).await?;
      
      let models: Vec<UsrModel> = models.into_iter()
        .filter(|item| 
          item.id != id
        )
        .collect();
      
      if !models.is_empty() {
        let table_comment = i18n_dao::ns(
          "用户".to_owned(),
          None,
        ).await?;
        let map = HashMap::from([
          ("0".to_owned(), table_comment),
        ]);
        let err_msg = i18n_dao::ns(
          "此 {0} 已经存在".to_owned(),
          map.into(),
        ).await?;
        return Err(SrvErr::msg(err_msg).into());
      }
    }
    
  }
  
  Ok(num)
}

/// 根据 ids 彻底删除用户
pub async fn force_delete_by_ids(
  ids: Vec<UsrId>,
  options: Option<Options>,
) -> Result<u64> {
  
  let table = "base_usr";
  let method = "force_delete_by_ids";
  
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
    .set_is_debug(false);
  
  let mut num = 0;
  for id in ids.clone() {
    
    let model = find_all(
      UsrSearch {
        id: id.clone().into(),
        is_deleted: 1.into(),
        ..Default::default()
      }.into(),
      None,
      None, 
      options.clone().into(),
    ).await?.into_iter().next();
    
    if model.is_none() {
      continue;
    }
    
    info!("force_delete_by_ids: {}", serde_json::to_string(&model)?);
    
    let mut args = QueryArgs::new();
    
    let sql = format!(
      "delete from {table} where id=? and is_deleted = 1 limit 1",
    );
    
    args.push(id.into());
    
    let args = args.into();
    
    let options = options.clone();
    
    let options = options.set_del_cache_key1s(get_cache_tables());
    
    let options = options.into();
    
    del_caches(
      vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
    ).await?;
    
    num += execute(
      sql,
      args,
      options,
    ).await?;
    
    del_caches(
      vec![ "dao.sql.base_menu._getMenus" ].as_slice(),
    ).await?;
  }
  
  Ok(num)
}

/// 查找 用户 order_by 字段的最大值
pub async fn find_last_order_by(
  options: Option<Options>,
) -> Result<u32> {
  
  let table = "base_usr";
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
    .set_is_debug(false);
  let options = Some(options);
  
  #[allow(unused_mut)]
  let mut args = QueryArgs::new();
  let mut sql_where = "".to_owned();
  
  sql_where += "t.is_deleted = 0";
  
  if let Some(tenant_id) = get_auth_tenant_id() {
    sql_where += " and t.tenant_id = ?";
    args.push(tenant_id.into());
  }
  
  let sql = format!(
    "select t.order_by order_by from {} t where {} order by t.order_by desc limit 1",
    table,
    sql_where,
  );
  
  let args = args.into();
  
  let options = Options::from(options);
  
  let options = options.set_cache_key(table, &sql, &args);
  
  let options = options.into();
  
  let model = query_one::<OrderByModel>(
    sql,
    args,
    options,
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

/// 校验用户是否启用
#[function_name::named]
#[allow(dead_code)]
pub async fn validate_is_enabled(
  model: &UsrModel,
) -> Result<()> {
  if model.is_enabled == 0 {
    let table_comment = i18n_dao::ns(
      "用户".to_owned(),
      None,
    ).await?;
    let msg1 = i18n_dao::ns(
      "已禁用".to_owned(),
      None,
    ).await?;
    let err_msg = table_comment + &msg1;
    return Err(SrvErr::new(function_name!().to_owned(), err_msg).into());
  }
  Ok(())
}

/// 校验用户是否存在
#[allow(dead_code)]
pub async fn validate_option<T>(
  model: Option<T>,
) -> Result<T> {
  if model.is_none() {
    let table_comment = i18n_dao::ns(
      "用户".to_owned(),
      None,
    ).await?;
    let msg1 = i18n_dao::ns(
      "不存在".to_owned(),
      None,
    ).await?;
    let err_msg = table_comment + &msg1;
    return Err(SrvErr::msg(err_msg).into());
  }
  Ok(model.unwrap())
}
