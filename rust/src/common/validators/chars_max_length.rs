use anyhow::Result;

use crate::common::context::SrvErr;

#[allow(dead_code)]
pub fn chars_max_length<'a>(
  value: Option<String>,
  len: usize,
  label: &str,
) -> Result<()> {
  
  if value.is_none() {
    return Ok(());
  }
  let value = value.unwrap();
  
  let value_len = value.chars().count();
  
  if value_len <= len {
    return Ok(());
  }
  
  let err_msg = format!(
    "The {label} length cannot greater than {len}",
  );
  
  return Err(SrvErr::msg(err_msg).into());
}
