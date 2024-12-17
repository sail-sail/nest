/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  OperationRecordInput as OperationRecordInputType,
  OperationRecordModel as OperationRecordModelType,
  OperationRecordSearch as OperationRecordSearchType,
  OperationRecordFieldComment as OperationRecordFieldCommentType,
} from "#/types";

declare global {
  
  interface OperationRecordModel extends OperationRecordModelType {
  }

  interface OperationRecordInput extends OperationRecordInputType {
  }

  interface OperationRecordSearch extends OperationRecordSearchType {
  }

  interface OperationRecordFieldComment extends OperationRecordFieldCommentType {
  }
  
}

export const operationRecordFields = [
  // ID
  "id",
  // 模块
  "module",
  // 模块名称
  "module_lbl",
  // 方法
  "method",
  // 方法名称
  "method_lbl",
  // 操作
  "lbl",
  // 耗时(毫秒)
  "time",
  // 操作前数据
  "old_data",
  // 操作后数据
  "new_data",
  // 操作人
  "create_usr_id",
  "create_usr_id_lbl",
  // 操作时间
  "create_time",
  "create_time_lbl",
  "is_deleted",
];

export const operationRecordQueryField = `
  ${ operationRecordFields.join(" ") }
`;
