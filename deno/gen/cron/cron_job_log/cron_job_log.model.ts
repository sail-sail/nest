import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  CronJobLogInput as CronJobLogInputType,
  CronJobLogModel as CronJobLogModelType,
  CronJobLogSearch as CronJobLogSearchType,
  CronJobLogFieldComment as CronJobLogFieldCommentType,
} from "/gen/types.ts";

export const cronJobLogId = Symbol.for("CronJobLogId");
export type CronJobLogId = typeof cronJobLogId;

export interface CronJobLogSearch extends CronJobLogSearchType {
  tenant_id?: string | null;
  $extra?: SearchExtra[];
}

export interface CronJobLogModel extends CronJobLogModelType {
  create_usr_id: string;
  create_time?: string | null;
  update_usr_id: string;
  update_time?: string | null;
  tenant_id: string;
}

export interface CronJobLogInput extends CronJobLogInputType {
  create_usr_id?: string | null;
  create_time?: string | null;
  update_usr_id?: string | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: string | null;
}

export type { CronJobLogFieldCommentType as CronJobLogFieldComment };
