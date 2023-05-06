use anyhow::Result;

use crate::common::context::Ctx;

use super::app_dao;

/// 清空缓存
pub async fn generate_id<'a>(
  ctx: &mut impl Ctx<'a>,
) -> Result<String> {
  Ok(app_dao::generate_id(ctx))
}

/// 检查是否已经登录
pub async fn check_login<'a>(
  ctx: &mut impl Ctx<'a>,
) -> Result<bool> {
  Ok(app_dao::check_login(ctx))
}
