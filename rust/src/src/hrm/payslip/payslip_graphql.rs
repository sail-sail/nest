use anyhow::Result;
use async_graphql::{Context, Object};

use crate::common::context::{
  CtxImpl,
  Ctx,
};

use super::payslip_resolver;

#[derive(Default)]
pub struct PayslipMutation;

#[Object(rename_args = "snake_case")]
impl PayslipMutation {
  
  /// 发送企微工资条
  async fn send_msg_wxw<'a>(
    &self,
    ctx: &Context<'a>,
    ids: Vec<String>,
  ) -> Result<i32> {
    let mut ctx = CtxImpl::new(ctx).auth()?;
    
    let res = payslip_resolver::send_msg_wxw(
      &mut ctx,
      ids,
    ).await?;
    
    Ok(res)
  }
  
}
