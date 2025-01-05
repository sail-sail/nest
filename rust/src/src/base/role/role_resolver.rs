use color_eyre::eyre::Result;

use super::role_service;

/// 获取当前角色的首页轮播图路由
pub async fn get_home_urls() -> Result<Vec<String>> {
  
  let urls = role_service::get_home_urls().await?;
  
  Ok(urls)
}
