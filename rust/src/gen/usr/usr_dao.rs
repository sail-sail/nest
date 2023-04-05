use std::fmt::{Display, Debug};

use anyhow::{Ok, Result, anyhow};
use tracing::info;

use crate::common::context::{Ctx, QueryArgs, QueryOptions, get_order_by_query};
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

/**
 * 根据搜索条件和分页查找数据
 */
pub async fn find_all<'a>(
  ctx: &mut Ctx<'a>,
  search: Option<&UsrSearch>,
  page: Option<&PageInput>,
  sort: Option<Vec<SortInput>>,
  options: Option<QueryOptions>,
) -> Result<Vec<UsrModel>> {
  let table = "usr";
  let method = "findAll";
  
  let mut args = QueryArgs::new();
  let from_query = format!(" {} t ", table);
  let where_query = get_where_query(ctx, &mut args, search).await?;
  let order_by_query = get_order_by_query(sort);
  
  // 分页
  let mut page_query = String::from("");
  if let Some(page) = page {
    let pg_size = page.pg_size;
    if let Some(pg_size) = pg_size {
      let pg_offset = page.pg_offset.unwrap_or(0);
      page_query = format!(" limit {}, {} ", pg_offset, pg_size);
    }
  }
  
  let sql = format!("#
    select
      t.*
    from
      {from_query}
    where
      {where_query}{order_by_query}{page_query}
  #");
  
  let sql: &'a mut str = Box::leak(sql.into_boxed_str()).into();
  
  // 缓存
  let cache_key1 = format!("dao.sql.{}", table);
  let cache_key2 = serde_json::json!({
    "sql": &sql,
    "args": &args.value,
  });
  
  let res = ctx.query_with::<_, UsrModel>(
    sql,
    args.value,
    None, // TODO
  ).await?;
  
  Ok(res)
}

#[cfg(test)]
mod test {
  
  #[test]
  fn test() {
    
  }
  
}
