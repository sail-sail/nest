import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  JobInput as JobInputType,
  JobModel as JobModelType,
  JobSearch as JobSearchType,
  JobFieldComment as JobFieldCommentType,
} from "/gen/types.ts";

import type {
  TenantId,
} from "/gen/base/tenant/tenant.model.ts";

import type {
  UsrId,
} from "/gen/base/usr/usr.model.ts";

declare const jobId: unique symbol;
export type JobId = Distinct<string, typeof jobId>;

export interface JobSearch extends JobSearchType {
  tenant_id?: string | null;
  $extra?: SearchExtra[];
}

export interface JobModel extends JobModelType {
  /** 系统字段 */
  is_sys: number;
  create_usr_id: UsrId;
  create_time?: string | null;
  update_usr_id: UsrId;
  update_time?: string | null;
  tenant_id: TenantId;
}

export interface JobInput extends JobInputType {
  /** 系统字段 */
  is_sys?: number;
  create_usr_id?: UsrId | null;
  create_time?: string | null;
  update_usr_id?: UsrId | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: TenantId | null;
}

export type { JobFieldCommentType as JobFieldComment };
