import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  CronJobLogInput as CronJobLogInputType,
  CronJobLogModel as CronJobLogModelType,
  CronJobLogSearch as CronJobLogSearchType,
  CronJobLogFieldComment as CronJobLogFieldCommentType,
} from "/gen/types.ts";

import type {
  TenantId,
} from "/gen/base/tenant/tenant.model.ts";

import type {
  UsrId,
} from "/gen/base/usr/usr.model.ts";

declare const cronJobLogId: unique symbol;
export type CronJobLogId = Distinct<string, typeof cronJobLogId>;

export interface CronJobLogSearch extends CronJobLogSearchType {
  tenant_id?: string | null;
  $extra?: SearchExtra[];
}

export interface CronJobLogModel extends CronJobLogModelType {
  create_usr_id: UsrId;
  create_time?: string | null;
  update_usr_id: UsrId;
  update_time?: string | null;
  tenant_id: TenantId;
}

export interface CronJobLogInput extends CronJobLogInputType {
  create_usr_id?: UsrId | null;
  create_time?: string | null;
  update_usr_id?: UsrId | null;
  update_time?: string | null;
  is_deleted?: number | null;
  tenant_id?: TenantId | null;
}

export type { CronJobLogFieldCommentType as CronJobLogFieldComment };