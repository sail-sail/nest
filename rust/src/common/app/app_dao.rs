use smol_str::SmolStr;

use crate::common::context::{
  has_auth_model,
  get_short_uuid,
};

/// 清空缓存
pub fn generate_id() -> SmolStr {
  get_short_uuid()
}

/// 检查是否已经登录
pub fn check_login() -> bool {
  has_auth_model()
}
