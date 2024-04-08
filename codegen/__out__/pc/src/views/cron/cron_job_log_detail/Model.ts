import type {
  CronJobLogDetailInput as CronJobLogDetailInputType,
  CronJobLogDetailModel as CronJobLogDetailModelType,
  CronJobLogDetailSearch as CronJobLogDetailSearchType,
  CronJobLogDetailFieldComment as CronJobLogDetailFieldCommentType,
} from "#/types";

export interface CronJobLogDetailModel extends CronJobLogDetailModelType {
}

export interface CronJobLogDetailInput extends CronJobLogDetailInputType {
}

export interface CronJobLogDetailSearch extends CronJobLogDetailSearchType {
}

export interface CronJobLogDetailFieldComment extends CronJobLogDetailFieldCommentType {
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
