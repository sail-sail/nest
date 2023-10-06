use anyhow::Result;

use crate::common::context::Ctx;

use super::payslip_service;

/// 发送企微工资条
pub async fn send_msg_wxw<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
) -> Result<i32> {
  
  let res = payslip_service::send_msg_wxw(
    ctx,
    ids,
  ).await?;
  
  Ok(res)
}
