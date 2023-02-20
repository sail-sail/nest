import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  type DeptModel as DeptModelType,
  type DeptSearch as DeptSearchType,
} from "/gen/types.ts";

export interface DeptSearch extends DeptSearchType {
  tenant_id?: string | null;
  $extra?: SearchExtra[];
}

export interface DeptModel extends DeptModelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
  tenant_id?: string | null;
}
