import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  type OperationRecordModel as OperationRecordModelType,
  type OperationRecordSearch as OperationRecordSearchType,
} from "/gen/types.ts";

export interface OperationRecordSearch extends OperationRecordSearchType {
  tenant_id?: string | null;
  $extra?: SearchExtra[];
}

export interface OperationRecordModel extends OperationRecordModelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
  tenant_id?: string | null;
}
