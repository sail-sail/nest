use anyhow::Result;
use crate::common::context::Ctx;

use super::role_service;

/// 获取当前角色的首页轮播图路由
pub async fn get_home_urls<'a>(
  ctx: &Ctx<'a>,
) -> Result<Vec<String>> {
  
  let urls = role_service::get_home_urls(
    ctx,
  ).await?;
  
  Ok(urls)
}
