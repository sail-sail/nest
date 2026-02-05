use std::collections::HashMap;
use std::fmt::Display;
use color_eyre::eyre::{Result, eyre};
use std::ops::Rem;

use smol_str::SmolStr;

use num_traits::{AsPrimitive, Zero};

use crate::common::i18n::i18n_dao;

#[allow(dead_code)]
pub async fn multiple_of<T, N>(
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
  
  let mut map: HashMap<SmolStr, SmolStr> = HashMap::new();
  map.insert("0".into(), n.to_string().into());
  
  let msg = i18n_dao::ns(
    "必须为 {0} 的整数倍".into(),
    map.into(),
  ).await?;
  
  let mut err_msg = String::new();
  err_msg.push_str(label);
  err_msg.push(' ');
  err_msg.push_str(&msg);
  let err_msg = err_msg;
  
  Err(eyre!(err_msg))
}
