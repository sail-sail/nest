use std::collections::HashMap;
use std::fmt::Display;
use color_eyre::eyre::{Result,eyre};

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
  
  let mut map: HashMap<String, String> = HashMap::new();
  map.insert("0".to_owned(), n.to_string());
  
  let msg = i18n_dao::ns(
    "不能小于 {0}".to_owned(),
    map.into(),
  ).await?;
  
  let mut err_msg = String::new();
  err_msg.push_str(label);
  err_msg.push(' ');
  err_msg.push_str(&msg);
  let err_msg = err_msg;
  
  Err(eyre!(err_msg))
}
