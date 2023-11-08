import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  OperationRecordInput as OperationRecordInputType,
  OperationRecordModel as OperationRecordModelType,
  OperationRecordSearch as OperationRecordSearchType,
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

export interface OperationRecordFieldComment {
  id: string;
  module: string;
  module_lbl: string;
  method: string;
  method_lbl: string;
  lbl: string;
  old_data: string;
  new_data: string;
  rem: string;
  create_usr_id: string;
  create_usr_id_lbl: string;
  create_time: string;
  create_time_lbl: string;
  update_usr_id: string;
  update_usr_id_lbl: string;
  update_time: string;
  update_time_lbl: string;
}
