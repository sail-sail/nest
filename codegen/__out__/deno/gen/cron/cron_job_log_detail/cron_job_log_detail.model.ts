import type {
  CronJobLogDetailInput as CronJobLogDetailInputType,
  CronJobLogDetailModel as CronJobLogDetailModelType,
  CronJobLogDetailSearch as CronJobLogDetailSearchType,
  CronJobLogDetailFieldComment as CronJobLogDetailFieldCommentType,
  SortInput,
} from "/gen/types.ts";

import {
  SortOrderEnum,
} from "/gen/types.ts";

export const route_path = "/cron/cron_job_log_detail";

declare const cronJobLogDetailId: unique symbol;

declare global {
  
  /** 定时任务日志明细 */
  type CronJobLogDetailId = Distinct<string, typeof cronJobLogDetailId>;
  
  /** 定时任务日志明细 */
  interface CronJobLogDetailSearch extends CronJobLogDetailSearchType {
    /** 创建人 */
    create_usr_id?: UsrId[];
    /** 创建人 */
    create_usr_id_is_null?: boolean;
    /** 创建人 */
    create_usr_id_lbl?: string[];
    /** 创建人 */
    create_usr_id_lbl_like?: string;
    /** 更新人 */
    update_usr_id?: UsrId[];
    /** 更新人 */
    update_usr_id_is_null?: boolean;
    /** 更新人 */
    update_usr_id_lbl?: string[];
    /** 更新人 */
    update_usr_id_lbl_like?: string;
    /** 更新时间 */
    update_time?: [(string|undefined|null), (string|undefined|null)];
    tenant_id?: TenantId | null;
  }

  interface CronJobLogDetailModel extends CronJobLogDetailModelType {
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

  interface CronJobLogDetailInput extends CronJobLogDetailInputType {
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

  interface CronJobLogDetailFieldComment extends CronJobLogDetailFieldCommentType {
  }
  
}

/** 定时任务日志明细 前端允许排序的字段 */
export const canSortInApiCronJobLogDetail = {
  // 创建时间
  "create_time": true,
  // 更新时间
  "update_time": true,
};

/** 定时任务日志明细 检测字段是否允许前端排序 */
export function checkSortCronJobLogDetail(sort?: SortInput[]) {
  if (!sort) {
    return;
  }
  for (const item of sort) {
    const order = item.order;
    if (
      order !== SortOrderEnum.Asc && order !== SortOrderEnum.Desc &&
      order !== SortOrderEnum.Ascending && order !== SortOrderEnum.Descending
    ) {
      throw new Error(`checkSortCronJobLogDetail: ${ JSON.stringify(item) }`);
    }
    if (!item.prop) {
      continue;
    }
    const prop = item.prop as keyof typeof canSortInApiCronJobLogDetail;
    if (!canSortInApiCronJobLogDetail[prop]) {
      throw new Error(`checkSortCronJobLogDetail: ${ JSON.stringify(item) }`);
    }
  }
}
