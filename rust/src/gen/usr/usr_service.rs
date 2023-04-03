use anyhow::{Ok, Result};
use tracing::info;

use crate::common::context::ReqContext;

use super::usr_model::UsrModel;

pub async fn hello<'a>(
  ctx: &mut ReqContext<'a>,
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
    vec.clone(),
    None,
  ).await?;
  
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