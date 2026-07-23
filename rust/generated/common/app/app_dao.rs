use smol_str::SmolStr;

use crate::common::context::{
  has_auth_model,
  get_short_uuid,
  id_to_smolstr,
};

/// 清空缓存
pub fn generate_id() -> SmolStr {
  id_to_smolstr(&get_short_uuid())
}

/// 检查是否已经登录
pub fn check_login() -> bool {
  has_auth_model()
}
