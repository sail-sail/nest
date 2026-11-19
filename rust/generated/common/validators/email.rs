use color_eyre::eyre::{Result, eyre};
use fast_chemail::is_valid_email;

/// 校验邮箱格式
#[allow(dead_code)]
pub fn email(
  value: Option<String>,
  label: &str,
) -> Result<()> {
  
  if value.is_none() {
    return Ok(());
  }
  let value = value.unwrap();
  
  if is_valid_email(&value) {
    return Ok(());
  }
  
  let err_msg = format!(
    "{label} 邮件格式不正确",
  );
  
  Err(eyre!(err_msg))
}
