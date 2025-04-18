use color_eyre::eyre::Result;
use async_graphql::{Context, Object};

use crate::common::context::Ctx;

use super::role_resolver;

#[derive(Default)]
pub struct RoleQuery;

#[Object(rename_args = "snake_case")]
impl RoleQuery {
  
  /// 获取当前角色的首页轮播图路由
  async fn get_home_urls(
    &self,
    ctx: &Context<'_>,
  ) -> Result<Vec<String>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        role_resolver::get_home_urls()
      }).await
  }
  
}
