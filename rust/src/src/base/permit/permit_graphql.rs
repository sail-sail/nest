use anyhow::Result;
use async_graphql::{Context, Object};

use crate::common::context::{CtxImpl, Ctx};

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
    
    let mut ctx = CtxImpl::new(ctx).auth()?;
    
    let res = permit_resolver::get_usr_permits(
      &mut ctx,
    ).await;
    
    ctx.ok(res).await
  }
  
}
