use std::net::IpAddr;
use std::str::FromStr;
use color_eyre::eyre::{Result,eyre};

use crate::common::i18n::i18n_dao::ns;

#[allow(dead_code)]
pub async fn ip(
  value: Option<String>,
  label: &str,
) -> Result<()> {
  
  if value.is_none() {
    return Ok(());
  }
  let value = value.unwrap();
  
  if IpAddr::from_str(&value).is_ok() {
    return Ok(());
  }
  
  let msg = ns(
    "IP地址格式不正确".to_owned(),
    None,
  ).await?;
  
  let mut err_msg = String::new();
  err_msg.push_str(label);
  err_msg.push(' ');
  err_msg.push_str(&msg);
  let err_msg = err_msg;
  
  Err(eyre!(err_msg))
}
