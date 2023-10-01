use std::net::IpAddr;
use std::str::FromStr;
use anyhow::Result;

use crate::common::context::Ctx;
use crate::common::context::SrvErr;
use crate::src::base::i18n::i18n_dao::ns;

#[allow(dead_code)]
pub async fn ip<'a>(
  ctx: &mut impl Ctx<'a>,
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
    ctx,
    "IP地址格式不正确".to_owned(),
    None,
  ).await?;
  
  let mut err_msg = String::new();
  err_msg.push_str(label);
  err_msg.push_str(" ");
  err_msg.push_str(&msg);
  let err_msg = err_msg;
  
  return Err(SrvErr::msg(err_msg).into());
}
