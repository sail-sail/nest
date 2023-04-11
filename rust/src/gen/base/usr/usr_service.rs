use anyhow::{Result, anyhow};
use tracing::info;

use crate::common::context::Ctx;

use super::usr_model::UsrModel;
use crate::gen::base::usr::usr_dao;

pub async fn hello<'a>(
  ctx: &mut impl Ctx<'a>,
) -> Result<Vec<UsrModel>> {
  
  let res = usr_dao::find_all(ctx, None, None, None, None).await?;
  
  Ok(res)
}
