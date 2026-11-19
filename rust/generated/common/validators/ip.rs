use std::net::IpAddr;
use std::str::FromStr;
use color_eyre::eyre::{Result, eyre};

/// 校验 IP 地址格式
#[allow(dead_code)]
pub fn ip(
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
  
  let err_msg = format!(
    "{label} IP地址格式不正确",
  );
  
  Err(eyre!(err_msg))
}
