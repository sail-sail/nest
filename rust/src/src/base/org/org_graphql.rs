use anyhow::Result;
use async_graphql::{Context, Object};

use crate::common::context::Ctx;

use super::org_resolver;

#[derive(Default)]
pub struct OrgMutation;

#[Object(rename_args = "snake_case")]
impl OrgMutation {
  
  /// 切换组织
  async fn org_login_select(
    &self,
    ctx: &Context<'_>,
    org_id: String,
  ) -> Result<String> {
    
    let mut ctx = Ctx::builder(ctx)
      .with_tran()?
      .with_auth()?
      .build();
    
    let res = org_resolver::org_login_select(
      &mut ctx,
      org_id,
    ).await;
    
    ctx.ok(res).await
  }
  
}
