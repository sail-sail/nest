use color_eyre::eyre::Result;

use crate::common::context::Ctx;

use smol_str::SmolStr;

use super::usr_service;

use super::usr_model::{
  LoginInput,
  LoginModel,
  GetLoginInfo,
  ChangePasswordInput,
};

/// 登录, 获得token
pub async fn login(
  ip: SmolStr,
  input: LoginInput,
) -> Result<LoginModel> {
  
  let res = usr_service::login(
    ip,
    input,
  ).await?;
  
  Ok(res)
}

/// 选择语言
pub async fn select_lang(
  ctx: &mut Ctx,
  lang: SmolStr,
) -> Result<SmolStr> {
  
  let res = usr_service::select_lang(
    ctx,
    lang,
  ).await?;
  
  Ok(res)
}

/// 修改密码
pub async fn change_password(
  input: ChangePasswordInput,
) -> Result<bool> {
  
  let res = usr_service::change_password(
    input,
  ).await?;
  
  Ok(res)
}

pub async fn get_login_info() -> Result<GetLoginInfo> {
  
  let res = usr_service::get_login_info().await?;
  
  Ok(res)
}
