use color_eyre::eyre::{Result, eyre};

/// 校验必填
/// is_empty 为 true 表示没有填写(空字符串/空数组/空id 都算未填写)
#[allow(dead_code)]
pub fn required(
  is_empty: bool,
  label: &str,
) -> Result<()> {
  
  if !is_empty {
    return Ok(());
  }
  
  let err_msg = format!(
    "{label} 不能为空",
  );
  
  Err(eyre!(err_msg))
}
