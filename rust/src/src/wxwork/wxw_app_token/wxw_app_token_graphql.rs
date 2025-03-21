use color_eyre::eyre::Result;
use async_graphql::{Context, Object};

use crate::common::context::Ctx;

use super::wxw_app_token_model::WxwGetConfigSignature;
use super::wxw_app_token_resolver;

#[derive(Default)]
pub struct WxwAppTokenQuery;

#[Object(rename_args = "snake_case")]
impl WxwAppTokenQuery {
  
  /// 通过 appid, agentid, url 生成企业签名
  async fn wxw_get_config_signature(
    &self,
    ctx: &Context<'_>,
    appid: String,
    agentid: String,
    url: String,
  ) -> Result<WxwGetConfigSignature> {
    Ctx::builder(ctx)
      .build()
      .scope({
        wxw_app_token_resolver::wxw_get_config_signature(
          appid,
          agentid,
          url,
        )
      }).await
  }
  
  /// 通过 appid, agentid, url 生成应用签名
  async fn wxw_get_agent_config_signature(
    &self,
    ctx: &Context<'_>,
    appid: String,
    agentid: String,
    url: String,
  ) -> Result<WxwGetConfigSignature> {
    Ctx::builder(ctx)
      .build()
      .scope({
        wxw_app_token_resolver::wxw_get_agent_config_signature(
          appid,
          agentid,
          url,
        )
      }).await
  }
  
}
