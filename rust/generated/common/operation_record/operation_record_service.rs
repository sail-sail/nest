use color_eyre::eyre::Result;

use crate::base::operation_record::operation_record_dao;
use crate::base::operation_record::operation_record_model::OperationRecordInput;

#[allow(dead_code)]
pub async fn log(
  input: OperationRecordInput,
) -> Result<()> {
  operation_record_dao::create_operation_record(
    input,
    None,
  ).await?;
  Ok(())
}
