import {
  type OperationRecordInput,
} from "/gen/base/operation_record/operation_record.model.ts";

/**
 * 记录系统日志
 */
export async function log(
  input: OperationRecordInput,
) {
  const {
    create,
  } = await import("/gen/base/operation_record/operation_record.dao.ts");
  
  const id = await create(input);
  return id;
}
