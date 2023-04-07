use std::fmt::{Display, Debug};

use anyhow::{Ok, Result, anyhow};
use tracing::info;

use crate::common::context::{Ctx, QueryArgs, Options, get_order_by_query};
use crate::common::gql::model::{PageInput, SortInput};
use crate::common::auth::auth_dao::get_auth_model;

use super::usr_model::{UsrModel, UsrSearch};

pub async fn hello<'a>(
  ctx: &mut Ctx<'a>,
) -> Result<Vec<UsrModel>> {
  let vec = vec![ "1" ];
  
  let res = ctx.query_with::<_, UsrModel>(
    "#
      select
        *
      from
        usr
      where
        id != ?
    #",
    vec,
    None,
  ).await?;
  Ok(res)
}

async fn get_where_query<'a>(
  ctx: &mut Ctx<'a>,
  args: &mut QueryArgs,
  search: Option<&UsrSearch>,
) -> Result<String> {
  let mut where_query = String::from("");
  {
    let is_deleted = search
      .and_then(|item| item.is_deleted)
      .unwrap_or(0);
    where_query += &format!(" t.is_deleted = {}", args.push(is_deleted.into()));
  }
  {
    let tenant_id = {
      let tenant_id = search
        .and_then(|item| item.tenant_id.to_owned());
      if tenant_id.is_some() {
        tenant_id
      } else {
        let auth_model = get_auth_model(ctx).await?;
        if let Some(auth_model) = auth_model {
          auth_model.tenant_id
        } else {
          None
        }
      }
    };
    if let Some(tenant_id) = tenant_id {
      if !tenant_id.is_empty() && tenant_id != "-" {
        where_query += &format!(" and t.tenant_id = {}", args.push(tenant_id.into()));
      }
    }
  }
  Ok(where_query)
}

fn get_from_query() -> String {
  let from_query = "#
    usr t
    left join dept _default_dept_id
      on _default_dept_id.id = t.default_dept_id
    left join usr_dept
      on usr_dept.usr_id = t.id
      and usr_dept.is_deleted = 0
    left join dept
      on usr_dept.dept_id = dept.id
      and dept.is_deleted = 0
    left join (
      select
        json_arrayagg(dept.id) dept_ids,
        json_arrayagg(dept.lbl) _dept_ids,
        usr.id usr_id
      from usr_dept
      inner join dept
        on dept.id = usr_dept.dept_id
        and dept.is_deleted = 0
      inner join usr
        on usr.id = usr_dept.usr_id
        and usr.is_deleted = 0
      where
      usr_dept.is_deleted = 0
      group by usr_id
    ) _dept
      on _dept.usr_id = t.id
    left join usr_role
      on usr_role.usr_id = t.id
      and usr_role.is_deleted = 0
    left join role
      on usr_role.role_id = role.id
      and role.is_deleted = 0
    left join (
      select
        json_arrayagg(role.id) role_ids,
        json_arrayagg(role.lbl) _role_ids,
        usr.id usr_id
      from usr_role
      inner join role
        on role.id = usr_role.role_id
        and role.is_deleted = 0
      inner join usr
        on usr.id = usr_role.usr_id
        and usr.is_deleted = 0
      where
      usr_role.is_deleted = 0
      group by usr_id
    ) _role
      on _role.usr_id = t.id
  #";
  from_query.to_owned()
}

fn get_page_query(page: Option<&PageInput>) -> String {
  let mut page_query = String::from("");
  if let Some(page) = page {
    let pg_size = page.pg_size;
    if let Some(pg_size) = pg_size {
      let pg_offset = page.pg_offset.unwrap_or(0);
      page_query = format!(" limit {}, {} ", pg_offset, pg_size);
    }
  }
  page_query
}

/**
 * 根据搜索条件和分页查找数据
 */
pub async fn find_all<'a>(
  ctx: &mut Ctx<'a>,
  search: Option<&UsrSearch>,
  page: Option<&PageInput>,
  sort: Option<Vec<SortInput>>,
  options0: Option<Options>,
) -> Result<Vec<UsrModel>> {
  let table = "usr";
  let method = "findAll";
  
  let mut args = QueryArgs::new();
  
  let from_query = get_from_query();
  let where_query = get_where_query(ctx, &mut args, search).await?;
  let order_by_query = get_order_by_query(sort);
  let page_query = get_page_query(page);
  
  let sql = format!("#
    select
      t.*
    from
      {from_query}
    where
      {where_query}{order_by_query}{page_query}
  #");
  
  let sql: &'a mut str = Box::leak(sql.into_boxed_str()).into();
  
  let mut options = Options::new();
  if options0.is_some() {
    options.is_debug = options0.unwrap().is_debug;
  }
  
  options.cache_key1 = Some(format!("dao.sql.{}", table));
  
  options.cache_key2 = Some(serde_json::json!({
    "sql": &sql,
    "args": &args.value,
  }).to_string());
  
  let res = ctx.query_with::<_, UsrModel>(
    sql,
    args.value,
    Some(options),
  ).await?;
  
  Ok(res)
}
