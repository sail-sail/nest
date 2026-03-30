use color_eyre::eyre::Result;
use async_graphql::{Context, Object};

use smol_str::SmolStr;

use crate::common::context::Ctx;

use super::app_resolver;

#[derive(Default)]
pub struct AppQuery;

#[Object]
impl AppQuery {
  
  /// 生成 id 主键
  #[graphql(name = "generateId")]
  async fn generate_id(
    &self,
    ctx: &Context<'_>,
  ) -> Result<SmolStr> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        app_resolver::generate_id()
      }).await
  }
  
  /// 检查是否已经登录
  #[graphql(name = "checkLogin")]
  async fn check_login(
    &self,
    ctx: &Context<'_>,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        app_resolver::check_login()
      }).await
  }
  
  /// 根据 appid 获取租户 id
  #[graphql(name = "getTenantIdByAppid")]
  async fn get_tenant_id_by_appid(
    &self,
    ctx: &Context<'_>,
    platform: SmolStr,
    appid: SmolStr,
  ) -> Result<SmolStr> {
    Ctx::builder(ctx)
      .build()
      .scope({
        app_resolver::get_tenant_id_by_appid(
          platform,
          appid,
        )
      }).await
  }
  
}
