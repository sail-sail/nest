use color_eyre::eyre::Result;
use async_graphql::{Context, Object};

use crate::common::context::Ctx;

use super::app_resolver;
use crate::base::tenant::tenant_model::TenantId;

#[derive(Default)]
pub struct AppQuery;

#[Object]
impl AppQuery {
  
  /// 生成 id 主键
  #[graphql(name = "generateId")]
  async fn generate_id(
    &self,
    ctx: &Context<'_>,
  ) -> Result<String> {
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
    platform: String,
    appid: String,
    agentid: Option<String>,
  ) -> Result<TenantId> {
    Ctx::builder(ctx)
      .build()
      .scope({
        app_resolver::get_tenant_id_by_appid(
          platform,
          appid,
          agentid,
          None,
        )
      }).await
  }
  
}
