use anyhow::Result;
use async_graphql::{Context, Object};

use crate::common::context::Ctx;

use super::wxw_usr_resolver;

use super::wxw_usr_model::{
  WxwGetAppid,
  WxwLoginByCodeInput,
  WxwLoginByCode,
};

#[derive(Default)]
pub struct WxwUsrQuery;

#[Object(rename_args = "snake_case")]
impl WxwUsrQuery {
  
  /// 通过host获取appid, agentid
  async fn wxw_get_appid<'a>(
    &self,
    ctx: &Context<'a>,
    host: String,
  ) -> Result<WxwGetAppid> {
    let mut ctx = Ctx::builder(ctx)
      .build();
    
    let res = wxw_usr_resolver::wxw_get_appid(
      &mut ctx,
      host,
    ).await;
    
    ctx.ok(res).await
  }
  
}

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
    let mut ctx = Ctx::builder(ctx)
      .build();
    
    let res = wxw_usr_resolver::wxw_login_by_code(
      &mut ctx,
      input
    ).await;
    
    ctx.ok(res).await
  }
  
  /// 同步企业微信用户
  async fn wxw_sync_usr<'a>(
    &self,
    ctx: &Context<'a>,
    host: String,
  ) -> Result<i32> {
    let mut ctx = Ctx::builder(ctx)
      .with_auth()?
      .build();
    
    let res = wxw_usr_resolver::wxw_sync_usr(
      &mut ctx,
      host,
    ).await;
    
    ctx.ok(res).await
  }
  
}

