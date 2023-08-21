use std::str::FromStr;
use anyhow::Result;
use http::uri::Uri;

use crate::common::context::Ctx;
use crate::common::context::SrvErr;
use crate::src::base::i18n::i18n_dao;

#[allow(dead_code)]
pub async fn url<T: AsRef<str>>(
  ctx: &mut impl Ctx<'_>,
  value: Option<&T>,
  label: impl AsRef<str>,
) -> Result<()> {
  
  if value.is_none() {
    return Ok(());
  }
  let value = value.unwrap();
  
  if Uri::from_str(value.as_ref())
    .map(|uri| uri.scheme().is_some() && uri.authority().is_some())
    .is_ok()
  {
    return Ok(());
  }
  
  let err_msg = i18n_dao::ns(
    ctx,
    "网址格式不正确".to_owned(),
    None,
  ).await?;
  
  let err_msg = format!("{} {}", label.as_ref(), err_msg);
  
  return Err(SrvErr::msg(err_msg).into());
}
