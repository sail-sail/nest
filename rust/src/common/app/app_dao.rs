use crate::common::context::{
  Ctx,
  get_short_uuid,
};

/// 清空缓存
pub fn generate_id(
  _ctx: &Ctx,
) -> String {
  get_short_uuid()
}

/// 检查是否已经登录
pub fn check_login(
  ctx: &Ctx,
) -> bool {
  ctx.has_auth_model()
}
