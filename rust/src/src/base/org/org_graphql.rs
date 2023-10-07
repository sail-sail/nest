use anyhow::Result;
use async_graphql::{Context, Object};

use crate::common::context::{CtxImpl, Ctx};

use super::org_resolver;

#[derive(Default)]
pub struct OrgMutation;

#[Object(rename_args = "snake_case")]
impl OrgMutation {
  
  async fn org_login_select<'a>(
    &self,
    ctx: &Context<'a>,
    org_id: String,
  ) -> Result<String> {
    let mut ctx = CtxImpl::with_tran(ctx).auth()?;
    let res = org_resolver::org_login_select(&mut ctx, org_id).await;
    ctx.ok(res).await
  }
  
}
