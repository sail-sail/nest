use std::collections::HashMap;
use std::fmt::Display;
use anyhow::Result;
use std::ops::Rem;

use num_traits::{AsPrimitive, Zero};

use crate::common::context::Ctx;
use crate::common::context::SrvErr;
use crate::src::base::i18n::i18n_dao;

#[allow(dead_code)]
pub async fn multiple_of<T, N>(
  ctx: &mut impl Ctx<'_>,
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
  
  let mut map: HashMap<String, String> = HashMap::new();
  map.insert("0".to_owned(), n.to_string());
  
  let msg = i18n_dao::ns(
    ctx,
    "必须为 {0} 的整数倍".to_owned(),
    map.into(),
  ).await?;
  
  let mut err_msg = String::new();
  err_msg.push_str(label);
  err_msg.push(' ');
  err_msg.push_str(&msg);
  let err_msg = err_msg;
  
  Err(SrvErr::msg(err_msg).into())
}
