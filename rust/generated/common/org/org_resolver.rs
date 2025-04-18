use color_eyre::eyre::Result;
use tracing::info;

use crate::common::context::{Ctx, get_req_id};

use super::org_service;

use crate::base::org::org_model::OrgId;

#[function_name::named]
pub async fn org_login_select(
  ctx: &mut Ctx,
  org_id: OrgId,
) -> Result<String> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let res = org_service::org_login_select(
    ctx,
    org_id,
  ).await?;
  
  Ok(res)
}
