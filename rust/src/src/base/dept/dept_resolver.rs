use anyhow::Result;
use async_graphql::{Context, Object};

use crate::common::context::{CtxImpl, Ctx};

use super::dept_service;

#[derive(Default)]
pub struct DeptMutation;

#[Object]
impl DeptMutation {
  
  async fn dept_login_select<'a>(
    &self,
    ctx: &Context<'a>,
    dept_id: String,
  ) -> Result<String> {
    let mut ctx = CtxImpl::with_tran(&ctx).auth()?;
    let res = dept_service::dept_login_select(&mut ctx, dept_id).await;
    ctx.ok(res).await
  }
  
}
