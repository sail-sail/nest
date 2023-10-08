use anyhow::Result;
use async_graphql::{Context, Object};

use crate::common::context::{
  CtxImpl,
  Ctx,
};

use super::wxw_usr_resolver;

use super::wxw_usr_model::{
  WxwLoginByCodeInput,
  WxwLoginByCode,
};

#[derive(Default)]
pub struct WxwUsrMutation;

#[Object(rename_args = "snake_case")]
impl WxwUsrMutation {
  
  /// 微信企业号登录
  async fn wxw_login_by_code<'a>(
    &self,
    ctx: &Context<'a>,
    input: WxwLoginByCodeInput,
  ) -> Result<WxwLoginByCode> {
    let mut ctx = CtxImpl::with_tran(ctx);
    
    let res = wxw_usr_resolver::wxw_login_by_code(
      &mut ctx,
      input
    ).await?;
    
    Ok(res)
  }
  
  /// 同步企业微信用户
  async fn wxw_sync_usr<'a>(
    &self,
    ctx: &Context<'a>,
    host: String,
  ) -> Result<i32> {
    let mut ctx = CtxImpl::new(ctx).auth()?;
    
    let res = wxw_usr_resolver::wxw_sync_usr(
      &mut ctx,
      host,
    ).await?;
    
    Ok(res)
  }
  
}

