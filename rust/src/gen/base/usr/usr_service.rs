use anyhow::{Result, anyhow};
use tracing::info;

use crate::common::context::Ctx;

use super::usr_model::{UsrModel, UsrSearch};
use super::usr_dao;

pub async fn hello<'a>(
  ctx: &mut impl Ctx<'a>,
) -> Result<Vec<UsrModel>> {
  
  let search = UsrSearch {
    is_deleted: 1.into(),
    ..Default::default()
  }.into();
  
  let res = usr_dao::find_all(ctx, search, None, None, None).await?;
  
  Ok(res)
}
