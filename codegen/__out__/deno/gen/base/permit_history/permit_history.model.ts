import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  type PermitHistoryInput as PermitHistoryInputType,
  type PermitHistoryModel as PermitHistoryModelType,
  type PermitHistorySearch as PermitHistorySearchType,
} from "/gen/types.ts";

export interface PermitHistorySearch extends PermitHistorySearchType {
  tenant_id?: string | null;
  $extra?: SearchExtra[];
}

export interface PermitHistoryModel extends PermitHistoryModelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
  tenant_id?: string | null;
}

export interface PermitHistoryInput extends PermitHistoryInputType {
  create_usr_id?: string;
  create_time?: string | null;
  update_usr_id?: string;
  update_time?: string | null;
  tenant_id?: string | null;
}
