use std::fmt::{Display, Debug};

use anyhow::{Ok, Result, anyhow};
use tracing::info;

use crate::common::context::{Ctx, QueryArgs};
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

pub async fn find_all<'a>(
  ctx: &mut Ctx<'a>,
  search: Option<&UsrSearch>,
  page: Option<&PageInput>,
  sort: Option<&Vec<SortInput>>,
) -> Result<String> {
  Ok("".to_owned())
}

#[cfg(test)]
mod test {
  
  #[test]
  fn test() {
    
  }
  
}
