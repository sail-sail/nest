use std::str::FromStr;
use color_eyre::eyre::{Result, eyre};
use http::uri::Uri;

/// 校验网址格式
#[allow(dead_code)]
pub fn url(
  value: Option<String>,
  label: &str,
) -> Result<()> {
  
  if value.is_none() {
    return Ok(());
  }
  let value = value.unwrap();
  
  if Uri::from_str(&value)
    .map(|uri| uri.scheme().is_some() && uri.authority().is_some())
    .is_ok()
  {
    return Ok(());
  }
  
  let err_msg = format!(
    "{label} 网址格式不正确",
  );
  
  Err(eyre!(err_msg))
}
