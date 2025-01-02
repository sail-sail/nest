import type {
  CronJobInput as CronJobInputType,
  CronJobModel as CronJobModelType,
  CronJobSearch as CronJobSearchType,
  CronJobFieldComment as CronJobFieldCommentType,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

export const route_path = "/cron/cron_job";

declare const cronJobId: unique symbol;

declare global {
  
  type CronJobId = Distinct<string, typeof cronJobId>;

  interface CronJobSearch extends CronJobSearchType {
    /** 序号 */
    seq?: [(number|undefined|null), (number|undefined|null)];
    /** Cron表达式 */
    cron?: string;
    cron_like?: string;
    /** 时区 */
    timezone?: string[];
    /** 锁定 */
    is_locked?: number[];
    /** 排序 */
    order_by?: [(number|undefined|null), (number|undefined|null)];
    /** 备注 */
    rem?: string;
    rem_like?: string;
    /** 创建时间 */
    create_time?: [(string|undefined|null), (string|undefined|null)];
    /** 更新时间 */
    update_time?: [(string|undefined|null), (string|undefined|null)];
    tenant_id?: TenantId | null;
  }

  interface CronJobModel extends CronJobModelType {
    /** 序号 */
    seq: number;
    create_usr_id: UsrId;
    create_usr_id_lbl: string;
    create_time?: string | null;
    create_time_lbl: string;
    update_usr_id: UsrId;
    update_usr_id_lbl: string;
    update_time?: string | null;
    update_time_lbl: string;
    tenant_id: TenantId;
  }

  interface CronJobInput extends CronJobInputType {
    /** 序号 */
    seq?: number | null;
    create_usr_id?: UsrId | null;
    create_usr_id_lbl?: string | null;
    create_time?: string | null;
    create_time_lbl?: string | null;
    create_time_save_null?: boolean | null;
    update_usr_id?: UsrId | null;
    update_usr_id_lbl?: string | null;
    update_time?: string | null;
    update_time_lbl?: string | null;
    update_time_save_null?: boolean | null;
    is_deleted?: number | null;
    tenant_id?: TenantId | null;
  }

  interface CronJobFieldComment extends CronJobFieldCommentType {
  }
  
}

/** 定时任务 前端允许排序的字段 */
export const canSortInApiCronJob = {
  // 排序
  "order_by": true,
  // 创建时间
  "create_time": true,
  // 更新时间
  "update_time": true,
};

/** 定时任务 检测字段是否允许前端排序 */
export function checkSortCronJob(sort?: SortInput[]) {
  if (!sort) {
    return;
  }
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortCronJob: ${ JSON.stringify(item) }`);
    }
    if (!item.prop) {
      continue;
    }
    const prop = item.prop as keyof typeof canSortInApiCronJob;
    if (!canSortInApiCronJob[prop]) {
      throw new Error(`checkSortCronJob: ${ JSON.stringify(item) }`);
    }
  }
}
