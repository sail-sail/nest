/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  CronJobLogDetailInput as CronJobLogDetailInputType,
  CronJobLogDetailModel as CronJobLogDetailModelType,
  CronJobLogDetailSearch as CronJobLogDetailSearchType,
  CronJobLogDetailFieldComment as CronJobLogDetailFieldCommentType,
} from "#/types.ts";

declare global {
  
  /** 定时任务日志明细 */
  interface CronJobLogDetailModel extends CronJobLogDetailModelType {
  }
  
  /** 定时任务日志明细 */
  interface CronJobLogDetailInput extends CronJobLogDetailInputType {
  }
  
  /** 定时任务日志明细 */
  interface CronJobLogDetailSearch extends CronJobLogDetailSearchType {
    is_deleted?: 0 | 1 | null;
  }
  
  /** 定时任务日志明细 */
  interface CronJobLogDetailFieldComment extends CronJobLogDetailFieldCommentType {
  }
  
}

export const cronJobLogDetailFields = [
  // ID
  "id",
  // 定时任务日志
  "cron_job_log_id",
  // 日志明细
  "lbl",
  // 创建时间
  "create_time",
  "create_time_lbl",
  "is_deleted",
];

export const cronJobLogDetailQueryField = `
  ${ cronJobLogDetailFields.join(" ") }
`;
