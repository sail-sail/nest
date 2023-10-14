use crate::common::context::{
  Ctx,
  get_short_uuid,
};

/// 清空缓存
pub fn generate_id<'a>(
  _ctx: &mut Ctx<'a>,
) -> String {
  get_short_uuid()
}

/// 检查是否已经登录
pub fn check_login<'a>(
  ctx: &mut Ctx<'a>,
) -> bool {
  ctx.get_auth_model().is_some()
}
