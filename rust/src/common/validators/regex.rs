use anyhow::Result;
use regex::Regex;

use crate::common::context::Ctx;
use crate::common::context::SrvErr;
use crate::src::base::i18n::i18n_dao;

#[allow(dead_code)]
pub async fn regex<T: AsRef<str>>(
  ctx: &mut impl Ctx<'_>,
  value: Option<&T>,
  regex_str: &'static str,
  label: impl AsRef<str>,
) -> Result<()> {
  
  if value.is_none() {
    return Ok(());
  }
  let value = value.unwrap();
  let regex = Regex::new(regex_str)?;
  if regex.is_match(value.as_ref()) {
    return Ok(());
  }
  
  let err_msg = i18n_dao::ns(
    ctx,
    "格式不正确".to_owned(),
    None,
  ).await?;
  
  let err_msg = format!("{} {}", label.as_ref(), err_msg);
  
  return Err(SrvErr::msg(err_msg).into());
}
