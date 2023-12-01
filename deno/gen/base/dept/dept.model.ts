import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  DeptInput as DeptInputType,
  DeptModel as DeptModelType,
  DeptSearch as DeptSearchType,
  DeptFieldComment as DeptFieldCommentType,
} from "/gen/types.ts";

declare const deptId: unique symbol;
export type DeptId = typeof deptId;

import type {
  TenantId,
} from "/gen/base/tenant/tenant.model.ts";

import type {
  OrgId,
} from "/gen/base/org/org.model.ts";

import type {
  UsrId,
} from "/gen/base/usr/usr.model.ts";

export interface DeptSearch extends DeptSearchType {
  tenant_id?: string | null;
  org_id?: string | null;
  $extra?: SearchExtra[];
}

export interface DeptModel extends DeptModelType {
  create_usr_id: UsrId;
  create_time?: string | null;
  update_usr_id: UsrId;
  update_time?: string | null;
  tenant_id: TenantId;
  org_id: OrgId;
}

export interface DeptInput extends DeptInputType {
  create_usr_id?: UsrId | null;
  create_time?: string | null;
  update_usr_id?: UsrId | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: TenantId | null;
  org_id?: OrgId | null;
}

export type { DeptFieldCommentType as DeptFieldComment };
