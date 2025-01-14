use color_eyre::eyre::Result;

use crate::r#gen::base::operation_record::operation_record_dao;
use crate::r#gen::base::operation_record::operation_record_model::OperationRecordInput;

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
