use std::ops::Deref;
use color_eyre::eyre::{Result, eyre};

/// 校验数组的最小数量
#[allow(dead_code)]
pub fn min_items<T: Deref<Target = [E]>, E>(
  value: Option<&T>,
  len: usize,
  label: &str,
) -> Result<()> {
  
  if value.is_none() {
    return Ok(());
  }
  let value = value.unwrap();
  
  if value.deref().len() >= len {
    return Ok(());
  }
  
  let err_msg = format!(
    "{label} 数量不能小于 {len}",
  );
  
  Err(eyre!(err_msg))
}
