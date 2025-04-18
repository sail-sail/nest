use color_eyre::eyre::Result;
use async_graphql::{Context, Object};

use crate::common::context::Ctx;

use super::app_service;

#[derive(Default)]
pub struct AppQuery;

#[Object]
impl AppQuery {
  
  /// 生成 id 主键
  async fn generate_id(
    &self,
    ctx: &Context<'_>,
  ) -> Result<String> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        app_service::generate_id()
      }).await
  }
  
  /// 检查是否已经登录
  async fn check_login(
    &self,
    ctx: &Context<'_>,
  ) -> Result<bool> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        app_service::check_login()
      }).await
  }
  
}
