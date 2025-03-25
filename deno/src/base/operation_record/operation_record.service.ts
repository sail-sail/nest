
/**
 * 记录系统日志
 */
export async function log(
  input: OperationRecordInput,
) {
  const {
    createOperationRecord,
  } = await import("/gen/base/operation_record/operation_record.dao.ts");
  
  const id = await createOperationRecord(input);
  return id;
}
