import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  RoleInput as RoleInputType,
  RoleModel as RoleModelType,
  RoleSearch as RoleSearchType,
} from "/gen/types.ts";

export interface RoleSearch extends RoleSearchType {
  tenant_id?: string | null;
  $extra?: SearchExtra[];
}

export interface RoleModel extends RoleModelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
  tenant_id?: string | null;
}

export interface RoleInput extends RoleInputType {
  create_usr_id?: string;
  create_time?: string | null;
  update_usr_id?: string;
  update_time?: string | null;
  tenant_id?: string | null;
}
