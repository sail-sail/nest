import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  OperationRecordInput as OperationRecordInputType,
  OperationRecordModel as OperationRecordModelType,
  OperationRecordSearch as OperationRecordSearchType,
  OperationRecordFieldComment as OperationRecordFieldCommentType,
} from "/gen/types.ts";

export const operationRecordId = Symbol.for("OperationRecordId");
export type OperationRecordId = typeof operationRecordId;

export interface OperationRecordSearch extends OperationRecordSearchType {
  tenant_id?: string | null;
  $extra?: SearchExtra[];
}

export interface OperationRecordModel extends OperationRecordModelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
  tenant_id: string;
}

export interface OperationRecordInput extends OperationRecordInputType {
  create_usr_id?: string | null;
  create_time?: string | null;
  update_usr_id?: string | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: string | null;
}

export type { OperationRecordFieldCommentType as OperationRecordFieldComment };
