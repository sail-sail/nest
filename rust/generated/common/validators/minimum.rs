use std::collections::HashMap;
use std::fmt::Display;
use color_eyre::eyre::{Result, eyre};

use smol_str::SmolStr;

use crate::common::i18n::i18n_dao;

#[allow(dead_code)]
pub async fn minimum<T>(
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
  
  let mut map: HashMap<SmolStr, SmolStr> = HashMap::new();
  map.insert("0".into(), n.to_string().into());
  
  let msg = i18n_dao::ns(
    "不能小于 {0}".into(),
    map.into(),
  ).await?;
  
  let mut err_msg = String::new();
  err_msg.push_str(label);
  err_msg.push(' ');
  err_msg.push_str(&msg);
  let err_msg = err_msg;
  
  Err(eyre!(err_msg))
}
