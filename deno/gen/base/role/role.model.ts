import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  RoleInput as RoleInputType,
  RoleModel as RoleModelType,
  RoleSearch as RoleSearchType,
  RoleFieldComment as RoleFieldCommentType,
} from "/gen/types.ts";

export const roleId = Symbol.for("RoleId");
export type RoleId = typeof roleId;

import type {
  TenantId,
} from "/gen/base/tenant/tenant.model.ts";

import type {
  UsrId,
} from "/gen/base/usr/usr.model.ts";

export interface RoleSearch extends RoleSearchType {
  tenant_id?: string | null;
  $extra?: SearchExtra[];
}

export interface RoleModel extends RoleModelType {
  create_usr_id: UsrId;
  create_time?: string | null;
  update_usr_id: UsrId;
  update_time?: string | null;
  tenant_id: TenantId;
}

export interface RoleInput extends RoleInputType {
  create_usr_id?: UsrId | null;
  create_time?: string | null;
  update_usr_id?: UsrId | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: TenantId | null;
}

export type { RoleFieldCommentType as RoleFieldComment };
