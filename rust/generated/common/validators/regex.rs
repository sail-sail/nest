use color_eyre::eyre::{Result, eyre};
use regex::Regex;

/// 校验字符串匹配正则表达式
#[allow(dead_code)]
pub fn regex(
  value: Option<String>,
  regex_str: &'static str,
  label: &str,
) -> Result<()> {
  
  if value.is_none() {
    return Ok(());
  }
  let value = value.unwrap();
  let regex = Regex::new(regex_str)?;
  if regex.is_match(&value) {
    return Ok(());
  }
  
  let err_msg = format!(
    "{label} 格式不正确",
  );
  
  Err(eyre!(err_msg))
}
