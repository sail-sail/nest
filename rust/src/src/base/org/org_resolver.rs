use anyhow::Result;
use crate::common::context::Ctx;

use super::org_service;

pub async fn org_login_select<'a>(
  ctx: &mut Ctx<'a>,
  org_id: String,
) -> Result<String> {
  let res = org_service::org_login_select(ctx, org_id).await?;
  Ok(res)
}
