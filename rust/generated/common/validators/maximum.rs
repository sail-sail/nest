use std::fmt::Display;
use color_eyre::eyre::{Result, eyre};

/// 校验数字不能大于 n
#[allow(dead_code)]
pub fn maximum<T>(
  value: Option<T>,
  n: T,
  label: &str,
) -> Result<()>
where
  T: PartialOrd + Display + Copy,
{
  
  if value.is_none() {
    return Ok(());
  }
  let value = value.unwrap();
  
  if value <= n {
    return Ok(());
  }
  
  let err_msg = format!(
    "{label} 不能大于 {n}",
  );
  
  Err(eyre!(err_msg))
}
