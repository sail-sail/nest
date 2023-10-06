use anyhow::Result;

use crate::common::context::Ctx;

/// 发送企微工资条
pub async fn send_msg_wxw<'a>(
  ctx: &mut impl Ctx<'a>,
  ids: Vec<String>,
) -> Result<i32> {
  
  todo!()
}
