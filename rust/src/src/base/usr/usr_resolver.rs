use anyhow::Result;
use async_graphql::{Context, Object};

use crate::common::context::CtxImpl;

use super::usr_service;
use super::usr_model::Login;

#[derive(Default)]
pub struct UsrQuery;

#[Object]
impl UsrQuery {
  
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
  
}
