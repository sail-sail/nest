use anyhow::Result;
use crate::common::context::Ctx;

use super::dept_service;

pub async fn dept_login_select<'a>(
  ctx: &mut impl Ctx<'a>,
  dept_id: String,
) -> Result<String> {
  let res = dept_service::dept_login_select(ctx, dept_id).await?;
  Ok(res)
}
