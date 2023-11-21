import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  CronJobInput as CronJobInputType,
  CronJobModel as CronJobModelType,
  CronJobSearch as CronJobSearchType,
} from "/gen/types.ts";

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

export interface CronJobFieldComment {
  id: string;
  lbl: string;
  job_id: string;
  job_id_lbl: string;
  cron: string;
  timezone: string;
  timezone_lbl: string;
  is_locked: string;
  is_locked_lbl: string;
  is_enabled: string;
  is_enabled_lbl: string;
  order_by: string;
  rem: string;
  create_usr_id: string;
  create_usr_id_lbl: string;
  create_time: string;
  create_time_lbl: string;
  update_usr_id: string;
  update_usr_id_lbl: string;
  update_time: string;
  update_time_lbl: string;
}
