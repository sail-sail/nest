use std::collections::HashMap;
use std::fmt::Display;
use anyhow::Result;

use crate::common::context::Ctx;
use crate::common::context::SrvErr;
use crate::src::base::i18n::i18n_dao;

#[allow(dead_code)]
pub async fn minimum<T>(
  ctx: &mut impl Ctx<'_>,
  value: Option<T>,
  n: T,
  label: impl AsRef<str>,
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
  
  let err_msg = i18n_dao::ns(
    ctx,
    "不能小于 {0}".to_owned(),
    map.into(),
  ).await?;
  
  let err_msg = format!("{} {}", label.as_ref(), err_msg);
  
  return Err(SrvErr::msg(err_msg).into());
}
