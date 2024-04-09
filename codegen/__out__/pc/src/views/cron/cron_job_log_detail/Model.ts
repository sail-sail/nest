import type {
  CronJobLogDetailInput as CronJobLogDetailInputType,
  CronJobLogDetailModel as CronJobLogDetailModelType,
  CronJobLogDetailSearch as CronJobLogDetailSearchType,
  CronJobLogDetailFieldComment as CronJobLogDetailFieldCommentType,
} from "#/types";

declare global {
  
  interface CronJobLogDetailModel extends CronJobLogDetailModelType {
  }

  interface CronJobLogDetailInput extends CronJobLogDetailInputType {
  }

  interface CronJobLogDetailSearch extends CronJobLogDetailSearchType {
  }

  interface CronJobLogDetailFieldComment extends CronJobLogDetailFieldCommentType {
  }
  
}

export const cronJobLogDetailFields = [
  // ID
  "id",
  // 任务执行日志
  "cron_job_log_id",
  "cron_job_log_id_lbl",
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
