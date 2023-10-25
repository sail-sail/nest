use anyhow::Result;

use crate::gen::base::operation_record::operation_record_dao;
use crate::gen::base::operation_record::operation_record_model::OperationRecordInput;

#[allow(dead_code)]
pub async fn log(
  input: OperationRecordInput,
) -> Result<()> {
  operation_record_dao::create(
    input,
    None,
  ).await?;
  Ok(())
}
