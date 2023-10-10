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
    host: String,
    ids: Vec<String>,
  ) -> Result<i32> {
    let mut ctx = CtxImpl::new(ctx).auth()?;
    
    let res = payslip_resolver::send_msg_wxw(
      &mut ctx,
      host,
      ids,
    ).await?;
    
    Ok(res)
  }
  
  /// 一键发送企微工资条
  async fn send_msg_wxw_one_key<'a>(
    &self,
    ctx: &Context<'a>,
    host: String,
  ) -> Result<i32> {
    let mut ctx = CtxImpl::new(ctx).auth()?;
    
    let res = payslip_resolver::send_msg_wxw_one_key(
      &mut ctx,
      host,
    ).await?;
    
    Ok(res)
  }
  
  /// 确认工资条
  async fn confirm_payslip<'a>(
    &self,
    ctx: &Context<'a>,
    id: String,
  ) -> Result<i32> {
    let mut ctx = CtxImpl::new(ctx).auth()?;
    
    let res = payslip_resolver::confirm_payslip(
      &mut ctx,
      id,
    ).await?;
    
    Ok(res)
  }
  
}
