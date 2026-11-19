pub mod chars_max_length;
pub mod chars_min_length;
pub mod maximum;
pub mod minimum;
pub mod max_items;
pub mod min_items;
pub mod multiple_of;
pub mod regex;
pub mod email;
pub mod url;
pub mod ip;
pub mod required;

/// 校验模式
/// 生成代码里的 validate_xxx 都是同步函数, 不允许出现 .await,
/// 所以这里的校验器也全部是同步的(提示文案不走 i18n)
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
pub enum ValidateMode {
  /// 修改: 只校验已传入的字段
  #[default]
  Update,
  /// 新增: 额外校验必填字段
  Create,
}
