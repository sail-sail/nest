import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  OperationRecordInput as OperationRecordInputType,
  OperationRecordModel as OperationRecordModelType,
  OperationRecordSearch as OperationRecordSearchType,
  OperationRecordFieldComment as OperationRecordFieldCommentType,
} from "/gen/types.ts";

import type {
  TenantId,
} from "/gen/base/tenant/tenant.model.ts";

import type {
  UsrId,
} from "/gen/base/usr/usr.model.ts";

declare const operationRecordId: unique symbol;
export type OperationRecordId = Distinct<string, typeof operationRecordId>;

export interface OperationRecordSearch extends OperationRecordSearchType {
  tenant_id?: string | null;
  $extra?: SearchExtra[];
}

export interface OperationRecordModel extends OperationRecordModelType {
  create_usr_id: UsrId;
  create_time?: string | null;
  update_usr_id: UsrId;
  update_time?: string | null;
  tenant_id: TenantId;
}

export interface OperationRecordInput extends OperationRecordInputType {
  create_usr_id?: UsrId | null;
  create_time?: string | null;
  update_usr_id?: UsrId | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: TenantId | null;
}

export type { OperationRecordFieldCommentType as OperationRecordFieldComment };
