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
    let mut is_deleted = "0".to_owned();
    if let Some(search) = search {
      if let Some(is_deleted0) = search.is_deleted {
        is_deleted = is_deleted0.to_string();
      }
    }
    where_query += &format!(" t.is_deleted = {}", args.push(is_deleted));
  }
  {
    let mut tenant_id: Option<String> = None;
    if let Some(search) = search {
      tenant_id = search.tenant_id.to_owned();
    }
    if tenant_id.is_none() {
      let auth_model = get_auth_model(ctx).await?;
      if let Some(auth_model) = auth_model {
        tenant_id = auth_model.tenant_id;
      }
    }
    if let Some(tenant_id) = tenant_id {
      if !tenant_id.is_empty() && tenant_id != "-" {
        where_query += &format!(" and t.tenant_id = {}", args.push(tenant_id));
      }
    }
  }
  print!("where_query: {:?}", search);
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
  let from_query = format!(" from {} t ", table);
  let where_query = get_where_query(ctx, &mut args, search).await?;
  let order_by_query = get_order_by_query(sort);
  let sql = format!("#
    select
      t.*
    from
      {from_query}
    where
      {where_query}{order_by_query}
  #");
  Ok(vec![])
}

#[cfg(test)]
mod test {
  
  #[test]
  fn test() {
    
  }
  
}
