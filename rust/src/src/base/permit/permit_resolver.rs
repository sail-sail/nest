use anyhow::Result;
use crate::common::context::Ctx;

use super::permit_service;
use super::permit_model::GetUsrPermits;

/// 根据当前用户获取权限列表
pub async fn get_usr_permits(
  ctx: &Ctx,
) -> Result<Vec<GetUsrPermits>> {
  
  let permits = permit_service::get_usr_permits(
    ctx,
  ).await?;
  
  Ok(permits)
}
