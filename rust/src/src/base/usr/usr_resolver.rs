use tracing::instrument;
use anyhow::Result;

use crate::common::context::Ctx;

use super::usr_service;

use super::usr_model::{
  Login,
  GetLoginInfo,
};

/// 登录, 获得token
#[instrument(skip(ctx))]
pub async fn login<'a>(
  ctx: &mut impl Ctx<'a>,
  username: String,
  password: String,
  tenant_id: String,
  org_id: Option<String>,
  lang: String,
) -> Result<Login> {
  
  let res = usr_service::login(
    ctx,
    username,
    password,
    tenant_id,
    org_id,
    lang,
  ).await?;
  
  Ok(res)
}

/// 选择语言
#[instrument(skip(ctx))]
pub async fn select_lang<'a>(
  ctx: &mut impl Ctx<'a>,
  lang: String,
) -> Result<String> {
  
  let res = usr_service::select_lang(
    ctx,
    lang,
  ).await?;
  
  Ok(res)
}

#[instrument(skip(ctx))]
pub async fn get_login_info<'a>(
  ctx: &mut impl Ctx<'a>,
) -> Result<GetLoginInfo> {
  
  let res = usr_service::get_login_info(
    ctx,
  ).await?;
  
  Ok(res)
}
