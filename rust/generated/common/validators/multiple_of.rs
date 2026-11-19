use std::fmt::Display;
use std::ops::Rem;
use color_eyre::eyre::{Result, eyre};

use num_traits::{AsPrimitive, Zero};

/// 校验数字必须是 n 的整数倍
#[allow(dead_code)]
pub fn multiple_of<T, N>(
  value: Option<T>,
  n: N,
  label: &str,
) -> Result<()>
where
  T: AsPrimitive<N>,
  N: Rem<Output = N> + Zero + Display + Copy + PartialEq + 'static,
{
  if value.is_none() {
    return Ok(());
  }
  let value = value.unwrap().as_();
  
  if !value.is_zero() && value % n == N::zero() {
    return Ok(());
  }
  
  let err_msg = format!(
    "{label} 必须为 {n} 的整数倍",
  );
  
  Err(eyre!(err_msg))
}
