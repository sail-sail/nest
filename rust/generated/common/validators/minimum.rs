use std::fmt::Display;
use color_eyre::eyre::{Result, eyre};

/// 校验数字不能小于 n
#[allow(dead_code)]
pub fn minimum<T>(
  value: Option<T>,
  n: T,
  label: &str,
) -> Result<()>
where
  T: PartialOrd + Display + Copy + 'static,
{
  
  if value.is_none() {
    return Ok(());
  }
  let value = value.unwrap();
  
  if value >= n {
    return Ok(());
  }
  
  let err_msg = format!(
    "{label} 不能小于 {n}",
  );
  
  Err(eyre!(err_msg))
}
