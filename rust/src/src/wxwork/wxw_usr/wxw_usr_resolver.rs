use anyhow::Result;

use crate::common::context::Ctx;

use super::wxw_usr_service;

use super::wxw_usr_model::{
  WxwLoginByCodeInput,
  WxwLoginByCode,
};

/// 微信企业号登录
pub async fn wxw_login_by_code<'a>(
  ctx: &mut impl Ctx<'a>,
  input: WxwLoginByCodeInput,
) -> Result<WxwLoginByCode> {
  
  let res = wxw_usr_service::wxw_login_by_code(
    ctx,
    input,
  ).await?;
  
  Ok(res)
}

/// 同步企业微信用户
pub async fn wxw_sync_usr<'a>(
  ctx: &mut impl Ctx<'a>,
  host: String,
) -> Result<i32> {
  
  let res = wxw_usr_service::wxw_sync_usr(
    ctx,
    host,
  ).await?;
  
  Ok(res)
}
