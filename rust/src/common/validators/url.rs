use std::str::FromStr;
use anyhow::Result;
use http::uri::Uri;

use crate::common::context::Ctx;
use crate::common::context::SrvErr;
use crate::src::base::i18n::i18n_dao::ns;

#[allow(dead_code)]
pub async fn url<'a>(
  ctx: &mut impl Ctx<'a>,
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
  
  let err_msg = ns(
    ctx,
    "网址格式不正确".to_owned(),
    None,
  ).await?;
  
  let err_msg = format!("{} {}", label, err_msg);
  
  return Err(SrvErr::msg(err_msg).into());
}
