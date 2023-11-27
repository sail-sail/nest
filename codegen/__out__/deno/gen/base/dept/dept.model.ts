import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  DeptInput as DeptInputType,
  DeptModel as DeptModelType,
  DeptSearch as DeptSearchType,
  DeptFieldComment as DeptFieldCommentType,
} from "/gen/types.ts";

export const deptId = Symbol.for("DeptId");
export type DeptId = typeof deptId;

export interface DeptSearch extends DeptSearchType {
  tenant_id?: string | null;
  org_id?: string | null;
  $extra?: SearchExtra[];
}

export interface DeptModel extends DeptModelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
  tenant_id: string;
  org_id: string;
}

export interface DeptInput extends DeptInputType {
  create_usr_id?: string | null;
  create_time?: string | null;
  update_usr_id?: string | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: string | null;
  org_id?: string | null;
}

export type { DeptFieldCommentType as DeptFieldComment };
