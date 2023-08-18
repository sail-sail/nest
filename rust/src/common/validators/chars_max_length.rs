use std::collections::HashMap;
use anyhow::Result;

use crate::common::context::Ctx;
use crate::common::context::SrvErr;
use crate::src::base::i18n::i18n_dao;

pub async fn chars_max_length<T: AsRef<str>>(
  ctx: &mut impl Ctx<'_>,
  value: Option<&T>,
  len: usize,
  label: impl AsRef<str>,
) -> Result<()> {
  
  if value.is_none() {
    return Ok(());
  }
  let value = value.unwrap();
  
  let value_len = value.as_ref().chars().count();
  
  if value_len <= len {
    return Ok(());
  }
  
  let mut map: HashMap<String, String> = HashMap::new();
  map.insert("0".to_owned(), label.as_ref().to_owned());
  map.insert("1".to_owned(), len.to_string());
  
  let err_msg = i18n_dao::ns(
    ctx,
    "{0} 长度不能超过 {1}".to_owned(),
    map.into(),
  ).await?;
  
  return Err(SrvErr::msg(err_msg).into());
}
