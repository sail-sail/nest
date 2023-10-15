use anyhow::Result;
use async_graphql::{Context, Object};

use crate::common::context::Ctx;

use super::usr_resolver;

use super::usr_model::{
  LoginInput,
  Login,
  GetLoginInfo,
};

#[derive(Default)]
pub struct UsrMutation;

#[Object(rename_args = "snake_case")]
impl UsrMutation {
  
  /// 登录, 获得token
  async fn login<'a>(
    &self,
    ctx: &Context<'a>,
    input: LoginInput,
  ) -> Result<Login> {
    let ctx = Ctx::builder(ctx)
      .with_tran()?
      .build();
    
    let res = usr_resolver::login(
      &ctx,
      input
    ).await?;
    
    Ok(res)
  }
  
  /// 选择语言
  async fn select_lang<'a>(
    &self,
    ctx: &Context<'a>,
    lang: String,
  ) -> Result<String> {
    let mut ctx = Ctx::builder(ctx)
      .with_auth()?
      .build();
    
    let res = usr_resolver::select_lang(
      &mut ctx,
      lang,
    ).await?;
    
    Ok(res)
  }
  
}

#[derive(Default)]
pub struct UsrQuery;

#[Object]
impl UsrQuery {
  
  /// 获取当前登录用户信息
  async fn get_login_info<'a>(
    &self,
    ctx: &Context<'a>,
  ) -> Result<GetLoginInfo> {
    let ctx = Ctx::builder(ctx)
      .with_auth()?
      .build();
    
    let res = usr_resolver::get_login_info(
      &ctx,
    ).await;
    
    ctx.ok(res).await
  }
  
}
