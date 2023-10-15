use anyhow::Result;
use async_graphql::{Context, Object};

use crate::common::context::Ctx;

use super::permit_resolver;
use super::permit_model::GetUsrPermits;

#[derive(Default)]
pub struct PermitQuery;

#[Object(rename_args = "snake_case")]
impl PermitQuery {
  
  /// 根据当前用户获取权限列表
  async fn get_usr_permits<'a>(
    &self,
    ctx: &Context<'a>,
  ) -> Result<Vec<GetUsrPermits>> {
    
    let ctx = Ctx::builder(ctx)
      .with_auth()?
      .build();
    
    let res = permit_resolver::get_usr_permits(
      &ctx,
    ).await;
    
    ctx.ok(res).await
  }
  
}
