use anyhow::Result;
use regex::Regex;

use crate::common::context::Ctx;
use crate::common::context::SrvErr;
use crate::src::base::i18n::i18n_dao;

#[allow(dead_code)]
pub async fn regex<'a>(
  ctx: &mut impl Ctx<'a>,
  value: Option<String>,
  regex_str: &'static str,
  label: &str,
) -> Result<()> {
  
  if value.is_none() {
    return Ok(());
  }
  let value = value.unwrap();
  let regex = Regex::new(regex_str)?;
  if regex.is_match(&value) {
    return Ok(());
  }
  
  let err_msg = i18n_dao::ns(
    ctx,
    "格式不正确".to_owned(),
    None,
  ).await?;
  
  let err_msg = format!("{} {}", label, err_msg);
  
  return Err(SrvErr::msg(err_msg).into());
}
