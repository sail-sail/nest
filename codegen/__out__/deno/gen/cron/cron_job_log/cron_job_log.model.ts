import type {
  SearchExtra,
} from "/lib/util/dao_util.ts";

import type {
  CronJobLogInput as CronJobLogInputType,
  CronJobLogModel as CronJobLogModelType,
  CronJobLogSearch as CronJobLogSearchType,
} from "/gen/types.ts";

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

export interface CronJobLogFieldComment {
  id: string;
  cron_job_id: string;
  cron_job_id_lbl: string;
  exec_state: string;
  exec_state_lbl: string;
  exec_result: string;
  begin_time: string;
  begin_time_lbl: string;
  end_time: string;
  end_time_lbl: string;
  rem: string;
  create_time: string;
  create_time_lbl: string;
}
