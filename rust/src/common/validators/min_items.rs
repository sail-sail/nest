use std::collections::HashMap;
use std::ops::Deref;
use anyhow::{Result,anyhow};

use crate::src::base::i18n::i18n_dao;

#[allow(dead_code)]
pub async fn min_items<T: Deref<Target = [E]>, E>(
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
  
  let mut map: HashMap<String, String> = HashMap::new();
  map.insert("0".to_owned(), len.to_string());
  
  let msg = i18n_dao::ns(
    "数量不能小于 {0}".to_owned(),
    map.into(),
  ).await?;
  
  let mut err_msg = String::new();
  err_msg.push_str(label);
  err_msg.push(' ');
  err_msg.push_str(&msg);
  let err_msg = err_msg;
  
  Err(anyhow!(err_msg))
}
