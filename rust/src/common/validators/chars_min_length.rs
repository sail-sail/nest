use std::collections::HashMap;
use anyhow::Result;

use crate::common::context::Ctx;
use crate::common::context::SrvErr;
use crate::src::base::i18n::i18n_dao::ns;

#[allow(dead_code)]
pub async fn chars_min_length<'a>(
  ctx: &mut impl Ctx<'a>,
  value: Option<String>,
  len: usize,
  label: &str,
) -> Result<()> {
  
  if value.is_none() {
    return Ok(());
  }
  let value = value.unwrap();
  
  let value_len = value.chars().count();
  
  if value_len >= len {
    return Ok(());
  }
  
  let mut map: HashMap<String, String> = HashMap::new();
  map.insert("0".to_owned(), len.to_string());
  
  let msg = ns(
    ctx,
    "长度不能小于 {0}".to_owned(),
    map.into(),
  ).await?;
  
  let mut err_msg = String::new();
  err_msg.push_str(label);
  err_msg.push_str(" ");
  err_msg.push_str(&msg);
  let err_msg = err_msg;
  
  return Err(SrvErr::msg(err_msg).into());
}
