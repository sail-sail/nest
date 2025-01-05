use color_eyre::eyre::Result;

use super::permit_service;
use super::permit_model::GetUsrPermits;

/// 根据当前用户获取权限列表
pub async fn get_usr_permits() -> Result<Vec<GetUsrPermits>> {
  
  let permits = permit_service::get_usr_permits().await?;
  
  Ok(permits)
}
