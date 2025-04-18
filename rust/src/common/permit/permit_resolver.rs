use color_eyre::eyre::Result;
use tracing::info;

use crate::common::context::get_req_id;

use super::permit_service;
use super::permit_model::GetUsrPermits;

/// 根据当前用户获取权限列表
#[function_name::named]
pub async fn get_usr_permits() -> Result<Vec<GetUsrPermits>> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let permits = permit_service::get_usr_permits().await?;
  
  Ok(permits)
}
