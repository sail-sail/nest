use anyhow::Result;
use crate::common::context::Ctx;

use crate::gen::base::operation_record::operation_record_dao;
use crate::gen::base::operation_record::operation_record_model::OperationRecordInput;

#[allow(dead_code)]
pub async fn log<'a>(
  ctx: &Ctx<'a>,
  input: OperationRecordInput,
) -> Result<()> {
  operation_record_dao::create(
    ctx,
    input,
    None,
  ).await?;
  Ok(())
}
