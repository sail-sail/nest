use anyhow::Result;

use crate::common::context::Ctx;

use super::usr_service;

use super::usr_model::{
  LoginInput,
  Login,
  GetLoginInfo,
};

/// 登录, 获得token
pub async fn login<'a>(
  ctx: &Ctx<'a>,
  input: LoginInput,
) -> Result<Login> {
  
  let res = usr_service::login(
    ctx,
    input,
  ).await?;
  
  Ok(res)
}

/// 选择语言
pub async fn select_lang<'a>(
  ctx: &mut Ctx<'a>,
  lang: String,
) -> Result<String> {
  
  let res = usr_service::select_lang(
    ctx,
    lang,
  ).await?;
  
  Ok(res)
}

pub async fn get_login_info<'a>(
  ctx: &Ctx<'a>,
) -> Result<GetLoginInfo> {
  
  let res = usr_service::get_login_info(
    ctx,
  ).await?;
  
  Ok(res)
}
