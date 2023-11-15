use anyhow::Result;
use crate::common::context::Ctx;
use crate::common::id::ID;

use super::org_service;

pub async fn org_login_select(
  ctx: &mut Ctx,
  org_id: ID,
) -> Result<String> {
  
  let res = org_service::org_login_select(
    ctx,
    org_id,
  ).await?;
  
  Ok(res)
}
