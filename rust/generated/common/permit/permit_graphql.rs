use color_eyre::eyre::Result;
use async_graphql::{Context, Object};

use crate::common::context::Ctx;

use super::permit_resolver;
use super::permit_model::GetUsrPermits;

#[derive(Default)]
pub struct PermitQuery;

#[Object(rename_args = "snake_case")]
impl PermitQuery {
  
  /// 根据当前用户获取权限列表
  async fn get_usr_permits(
    &self,
    ctx: &Context<'_>,
  ) -> Result<Vec<GetUsrPermits>> {
    Ctx::builder(ctx)
      .with_auth()?
      .build()
      .scope({
        permit_resolver::get_usr_permits()
      }).await
  }
  
}
