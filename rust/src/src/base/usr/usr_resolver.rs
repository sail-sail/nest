use anyhow::Result;

use crate::common::context::Ctx;

use super::usr_service;

use super::usr_model::{
  LoginInput,
  Login,
  GetLoginInfo,
  ChangePasswordInput,
};

/// 登录, 获得token
pub async fn login(
  ctx: &Ctx,
  input: LoginInput,
) -> Result<Login> {
  
  let res = usr_service::login(
    ctx,
    input,
  ).await?;
  
  Ok(res)
}

/// 选择语言
pub async fn select_lang(
  ctx: &mut Ctx,
  lang: String,
) -> Result<String> {
  
  let res = usr_service::select_lang(
    ctx,
    lang,
  ).await?;
  
  Ok(res)
}

/// 修改密码
pub async fn change_password(
  ctx: &Ctx,
  input: ChangePasswordInput,
) -> Result<bool> {
  
  let res = usr_service::change_password(
    ctx,
    input,
  ).await?;
  
  Ok(res)
}

pub async fn get_login_info(
  ctx: &Ctx,
) -> Result<GetLoginInfo> {
  
  let res = usr_service::get_login_info(
    ctx,
  ).await?;
  
  Ok(res)
}
