/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  CronJobLogInput as CronJobLogInputType,
  CronJobLogModel as CronJobLogModelType,
  CronJobLogSearch as CronJobLogSearchType,
  CronJobLogFieldComment as CronJobLogFieldCommentType,
} from "#/types.ts";

declare global {
  
  /** 定时任务日志 */
  interface CronJobLogModel extends CronJobLogModelType {
  }
  
  /** 定时任务日志 */
  interface CronJobLogInput extends CronJobLogInputType {
  }
  
  /** 定时任务日志 */
  interface CronJobLogSearch extends CronJobLogSearchType {
    is_deleted?: 0 | 1 | null;
  }
  
  /** 定时任务日志 */
  interface CronJobLogFieldComment extends CronJobLogFieldCommentType {
  }
  
}

export const cronJobLogFields = [
  // ID
  "id",
  // 定时任务
  "cron_job_id",
  "cron_job_id_lbl",
  // 执行状态
  "exec_state",
  "exec_state_lbl",
  // 执行结果
  "exec_result",
  // 开始时间
  "begin_time",
  "begin_time_lbl",
  // 结束时间
  "end_time",
  "end_time_lbl",
  // 备注
  "rem",
  // 创建时间
  "create_time",
  "create_time_lbl",
  "is_deleted",
];

export const cronJobLogQueryField = `
  ${ cronJobLogFields.join(" ") }
`;
