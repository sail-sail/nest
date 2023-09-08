use std::collections::HashMap;
use std::ops::Deref;
use anyhow::Result;

use crate::common::context::Ctx;
use crate::common::context::SrvErr;
use crate::src::base::i18n::i18n_dao;

#[allow(dead_code)]
pub async fn max_items<T: Deref<Target = [E]>, E>(
  ctx: &mut impl Ctx<'_>,
  value: Option<&T>,
  len: usize,
  label: &str,
) -> Result<()> {
  
  if value.is_none() {
    return Ok(());
  }
  let value = value.unwrap();
  
  if value.deref().len() <= len {
    return Ok(());
  }
  
  let mut map: HashMap<String, String> = HashMap::new();
  map.insert("0".to_owned(), len.to_string());
  
  let msg = i18n_dao::ns(
    ctx,
    "数量不能超过 {0}".to_owned(),
    map.into(),
  ).await?;
  
  let mut err_msg = String::new();
  err_msg.push_str(label);
  err_msg.push_str(" ");
  err_msg.push_str(&msg);
  let err_msg = err_msg;
  
  return Err(SrvErr::msg(err_msg).into());
}
