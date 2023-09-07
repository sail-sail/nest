use anyhow::Result;
use fast_chemail::is_valid_email;

use crate::common::context::Ctx;
use crate::common::context::SrvErr;
use crate::src::base::i18n::i18n_dao::ns;

#[allow(dead_code)]
pub async fn email<'a>(
  ctx: &mut impl Ctx<'a>,
  value: Option<String>,
  label: &str,
) -> Result<()> {
  
  if value.is_none() {
    return Ok(());
  }
  let value = value.unwrap();
  
  if is_valid_email(&value) {
    return Ok(());
  }
  
  let err_msg = ns(
    ctx,
    "邮件格式不正确".to_owned(),
    None,
  ).await?;
  
  let err_msg = format!("{} {}", label, err_msg);
  
  return Err(SrvErr::msg(err_msg).into());
}
