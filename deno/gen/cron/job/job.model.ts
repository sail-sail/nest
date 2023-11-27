import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  JobInput as JobInputType,
  JobModel as JobModelType,
  JobSearch as JobSearchType,
  JobFieldComment as JobFieldCommentType,
} from "/gen/types.ts";

export const jobId = Symbol.for("JobId");
export type JobId = typeof jobId;

export interface JobSearch extends JobSearchType {
  tenant_id?: string | null;
  $extra?: SearchExtra[];
}

export interface JobModel extends JobModelType {
  /** 系统字段 */
  is_sys: number;
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
  tenant_id: string;
}

export interface JobInput extends JobInputType {
  /** 系统字段 */
  is_sys?: number;
  create_usr_id?: string | null;
  create_time?: string | null;
  update_usr_id?: string | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: string | null;
}

export type { JobFieldCommentType as JobFieldComment };
