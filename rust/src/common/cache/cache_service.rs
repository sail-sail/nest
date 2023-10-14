use anyhow::Result;

use crate::common::context::Ctx;

use super::cache_dao;

/// 清空缓存
pub async fn clear_cache<'a>(
  _ctx: &mut Ctx<'a>,
) -> Result<bool> {
  cache_dao::flash_db().await?;
  Ok(true)
}
