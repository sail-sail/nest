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
    Ctx::builder(ctx)
      .build()
      .scope({
        wxw_usr_resolver::wxw_get_appid(host)
      }).await
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
    Ctx::builder(ctx)
      .build()
      .scope({
        wxw_usr_resolver::wxw_login_by_code(input)
      }).await
  }
  
  /// 同步企业微信用户
  async fn wxw_sync_usr<'a>(
    &self,
    ctx: &Context<'a>,
    host: String,
  ) -> Result<i32> {
    Ctx::builder(ctx)
      .build()
      .scope({
        wxw_usr_resolver::wxw_sync_usr(host)
      }).await
  }
  
}
