import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  CronJobInput as CronJobInputType,
  CronJobModel as CronJobModelType,
  CronJobSearch as CronJobSearchType,
  CronJobFieldComment as CronJobFieldCommentType,
} from "/gen/types.ts";

export const cronJobId = Symbol.for("CronJobId");
export type CronJobId = typeof cronJobId;

export interface CronJobSearch extends CronJobSearchType {
  tenant_id?: string | null;
  $extra?: SearchExtra[];
}

export interface CronJobModel extends CronJobModelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
  tenant_id: string;
}

export interface CronJobInput extends CronJobInputType {
  create_usr_id?: string | null;
  create_time?: string | null;
  update_usr_id?: string | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: string | null;
}

export type { CronJobFieldCommentType as CronJobFieldComment };
