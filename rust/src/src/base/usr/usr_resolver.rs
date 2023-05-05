use anyhow::Result;
use async_graphql::{Context, Object};

use crate::common::context::{CtxImpl, Ctx};

use super::usr_service;
use super::usr_model::{Login, GetLoginInfo};

#[derive(Default)]
pub struct UsrMutation;

#[Object]
impl UsrMutation {
  
  /// 登录, 获得token
  async fn login<'a>(
    &self,
    ctx: &Context<'a>,
    username: String,
    password: String,
    tenant_id: String,
    dept_id: Option<String>,
    lang: String,
  ) -> Result<Login> {
    let mut ctx = CtxImpl::new(ctx);
    
    let res = usr_service::login(
      &mut ctx,
      username,
      password,
      tenant_id,
      dept_id,
      lang,
    ).await?;
    
    Ok(res)
  }
  
  /// 选择语言
  async fn select_lang<'a>(
    &self,
    ctx: &Context<'a>,
    lang: String,
  ) -> Result<String> {
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = usr_service::select_lang(
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
    let mut ctx = CtxImpl::new(&ctx).auth()?;
    
    let res = usr_service::get_login_info(
      &mut ctx,
    ).await?;
    
    Ok(res)
  }
  
}
