use anyhow::Result;

use crate::common::context::Ctx;

use super::payslip_service;

/// 发送企微工资条
pub async fn send_msg_wxw<'a>(
  ctx: &mut impl Ctx<'a>,
  host: String,
  ids: Vec<String>,
) -> Result<i32> {
  
  let res = payslip_service::send_msg_wxw(
    ctx,
    host,
    ids,
  ).await?;
  
  Ok(res)
}

/// 一键发送企微工资条
pub async fn send_msg_wxw_one_key<'a>(
  ctx: &mut impl Ctx<'a>,
  host: String,
) -> Result<i32> {
  
  let res = payslip_service::send_msg_wxw_one_key(
    ctx,
    host,
  ).await?;
  
  Ok(res)
}

/// 确认工资条
pub async fn confirm_payslip<'a>(
  ctx: &mut impl Ctx<'a>,
  id: String,
) -> Result<i32> {
  
  let res = payslip_service::confirm_payslip(
    ctx,
    id,
  ).await?;
  
  Ok(res)
}
