use color_eyre::eyre::Result;
use tracing::info;

use crate::common::context::get_req_id;

use super::role_service;

/// 获取当前角色的首页轮播图路由
#[function_name::named]
pub async fn get_home_urls() -> Result<Vec<String>> {
  
  info!(
    "{req_id} {function_name}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );
  
  let urls = role_service::get_home_urls().await?;
  
  Ok(urls)
}
