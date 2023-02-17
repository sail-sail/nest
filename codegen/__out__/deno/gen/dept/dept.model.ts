import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  type DeptModel as DeptModelType,
  type DeptSearch as DeptSearchType,
} from "/gen/types.ts";

export interface DeptSearch extends DeptSearchType {
  $extra?: SearchExtra[],
  tenant_id?: string | null;
}

export interface DeptModel extends DeptModelType {
  tenant_id?: string | null;
}
