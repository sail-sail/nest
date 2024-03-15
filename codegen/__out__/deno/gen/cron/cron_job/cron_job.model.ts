

import type {
  CronJobInput as CronJobInputType,
  CronJobModel as CronJobModelType,
  CronJobSearch as CronJobSearchType,
  CronJobFieldComment as CronJobFieldCommentType,
} from "/gen/types.ts";

import type {
  TenantId,
} from "/gen/base/tenant/tenant.model.ts";

import type {
  UsrId,
} from "/gen/base/usr/usr.model.ts";

declare const cronJobId: unique symbol;
export type CronJobId = Distinct<string, typeof cronJobId>;

export interface CronJobSearch extends CronJobSearchType {
  tenant_id?: string | null;
}

export interface CronJobModel extends CronJobModelType {
  create_usr_id: UsrId;
  create_usr_id_lbl: string;
  create_time?: string | null;
  create_time_lbl: string;
  update_usr_id: UsrId;
  update_time?: string | null;
  update_time_lbl: string;
  tenant_id: TenantId;
}

export interface CronJobInput extends CronJobInputType {
  create_usr_id?: UsrId | null;
  create_usr_id_lbl?: string | null;
  create_time?: string | null;
  create_time_lbl?: string | null;
  update_usr_id?: UsrId | null;
  update_usr_id_lbl?: string | null;
  update_time?: string | null;
  update_time_lbl?: string | null;
  is_deleted?: number | null;
  tenant_id?: TenantId | null;
}

export type { CronJobFieldCommentType as CronJobFieldComment };
