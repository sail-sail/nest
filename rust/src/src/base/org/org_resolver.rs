use color_eyre::eyre::Result;
use crate::common::context::Ctx;

use super::org_service;

use crate::r#gen::base::org::org_model::OrgId;

pub async fn org_login_select(
  ctx: &mut Ctx,
  org_id: OrgId,
) -> Result<String> {
  
  let res = org_service::org_login_select(
    ctx,
    org_id,
  ).await?;
  
  Ok(res)
}
