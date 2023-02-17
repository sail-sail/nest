import {
  type SearchExtra,
} from "/lib/util/dao_util.ts";

import {
  type RoleModel as RoleModelType,
  type RoleSearch as RoleSearchType,
} from "/gen/types.ts";

export interface RoleSearch extends RoleSearchType {
  $extra?: SearchExtra[],
  tenant_id?: string | null;
}

export interface RoleModel extends RoleModelType {
  tenant_id?: string | null;
}
