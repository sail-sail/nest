use serde_json::json;

use anyhow::{Result, anyhow};
use tracing::info;

use crate::common::context::{Ctx, CtxImpl, QueryArgs, Options, get_order_by_query, get_page_query};
use crate::common::gql::model::{PageInput, SortInput};
use crate::common::util::string::is_empty;

use super::usr_model::{UsrModel, UsrSearch};

pub async fn hello<'a>(
  ctx: &mut CtxImpl<'a>,
) -> Result<Vec<UsrModel>> {
  let vec = vec![ "1" ];
  
  let res = ctx.query_with::<_, UsrModel>(
    r#"
      select
        *
      from
        base_usr
      where
        id != ?
    "#.to_owned(),
    vec,
    None,
  ).await?;
  Ok(res)
}

fn get_where_query<'a>(
  ctx: &mut impl Ctx<'a>,
  args: &mut QueryArgs,
  search: Option<UsrSearch>,
) -> String {
  let mut where_query = String::from("");
  {
    let is_deleted = search.as_ref()
      .and_then(|item| item.is_deleted)
      .unwrap_or(0);
    where_query += &format!(" t.is_deleted = {}", args.push(is_deleted.into()));
  }
  {
    let tenant_id = {
      let tenant_id = search.as_ref()
        .and_then(|item| item.tenant_id.to_owned());
      if is_empty(&tenant_id) {
        match ctx.get_auth_model() {
          Some(item) => item.tenant_id,
          None => None,
        }
      } else {
        tenant_id
      }
    };
    if !is_empty(&tenant_id) && tenant_id != "-".to_owned().into() {
      where_query += &format!(" and t.tenant_id = {}", args.push(tenant_id.into()));
    }
  }
  where_query
}

fn get_from_query() -> &'static str {
  let from_query = r#"base_usr t
    left join base_dept _default_dept_id
      on _default_dept_id.id = t.default_dept_id
    left join base_usr_dept
      on base_usr_dept.usr_id = t.id
      and base_usr_dept.is_deleted = 0
    left join base_dept
      on base_usr_dept.dept_id = base_dept.id
      and base_dept.is_deleted = 0
    left join (
      select
        json_arrayagg(base_dept.id) dept_ids,
        json_arrayagg(base_dept.lbl) _dept_ids,
        base_usr.id usr_id
      from base_usr_dept
      inner join base_dept
        on base_dept.id = base_usr_dept.dept_id
        and base_dept.is_deleted = 0
      inner join base_usr
        on base_usr.id = base_usr_dept.usr_id
        and base_usr.is_deleted = 0
      where
      base_usr_dept.is_deleted = 0
      group by usr_id
    ) _dept
      on _dept.usr_id = t.id
    left join base_usr_role
      on base_usr_role.usr_id = t.id
      and base_usr_role.is_deleted = 0
    left join base_role
      on base_usr_role.role_id = base_role.id
      and base_role.is_deleted = 0
    left join (
      select
        json_arrayagg(base_role.id) role_ids,
        json_arrayagg(base_role.lbl) _role_ids,
        base_usr.id usr_id
      from base_usr_role
      inner join base_role
        on base_role.id = base_usr_role.role_id
        and base_role.is_deleted = 0
      inner join base_usr
        on base_usr.id = base_usr_role.usr_id
        and base_usr.is_deleted = 0
      where
      base_usr_role.is_deleted = 0
      group by usr_id
    ) _role
      on _role.usr_id = t.id"#;
  from_query
}

/**
 * 根据搜索条件和分页查找数据
 */
pub async fn find_all<'a>(
  ctx: &mut impl Ctx<'a>,
  search: Option<UsrSearch>,
  page: Option<PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<Options>,
) -> Result<Vec<UsrModel>> {
  let table = "base_usr";
  let _method = "findAll";
  
  let mut args = QueryArgs::new();
  
  let from_query = get_from_query();
  let where_query = get_where_query(ctx, &mut args, search);
  let order_by_query = get_order_by_query(sort);
  let page_query = get_page_query(page);
  
  let sql = format!(r#"
    select
      t.*
    from
      {from_query}
    where
      {where_query}{order_by_query}{page_query}
  "#);
  
  let args = args.value;
  
  let options = Options::from(options);
  
  let options = options.set_cache_key(table, &sql, &args);
  
  let options = options.into();
  
  let res: Vec<UsrModel> = ctx.query_with(
    sql,
    args,
    options,
  ).await?;
  
  Ok(res)
}
