use color_eyre::eyre::Result;

use super::cache_service;

/// 清空缓存
pub async fn clear_cache(
) -> Result<bool> {
  let res = cache_service::clear_cache().await?;
  Ok(res)
}
