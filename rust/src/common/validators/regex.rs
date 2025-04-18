use color_eyre::eyre::{Result,eyre};
use regex::Regex;

use crate::common::i18n::i18n_dao::ns;

#[allow(dead_code)]
pub async fn regex(
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
  
  let msg = ns(
    "格式不正确".to_owned(),
    None,
  ).await?;
  
  let mut err_msg = String::new();
  err_msg.push_str(label);
  err_msg.push(' ');
  err_msg.push_str(&msg);
  let err_msg = err_msg;
  
  Err(eyre!(err_msg))
}
