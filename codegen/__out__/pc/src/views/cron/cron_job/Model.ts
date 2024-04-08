import type {
  CronJobInput as CronJobInputType,
  CronJobModel as CronJobModelType,
  CronJobSearch as CronJobSearchType,
  CronJobFieldComment as CronJobFieldCommentType,
} from "#/types";

export interface CronJobModel extends CronJobModelType {
}

export interface CronJobInput extends CronJobInputType {
}

export interface CronJobSearch extends CronJobSearchType {
}

export interface CronJobFieldComment extends CronJobFieldCommentType {
}

export const cronJobFields = [
  // ID
  "id",
  // 名称
  "lbl",
  // 任务
  "job_id",
  "job_id_lbl",
  // Cron表达式
  "cron",
  // 时区
  "timezone",
  "timezone_lbl",
  // 锁定
  "is_locked",
  "is_locked_lbl",
  // 启用
  "is_enabled",
  "is_enabled_lbl",
  // 排序
  "order_by",
  // 备注
  "rem",
  // 创建人
  "create_usr_id",
  "create_usr_id_lbl",
  // 创建时间
  "create_time",
  "create_time_lbl",
  // 更新人
  "update_usr_id",
  "update_usr_id_lbl",
  // 更新时间
  "update_time",
  "update_time_lbl",
  "is_deleted",
];

export const cronJobQueryField = `
  ${ cronJobFields.join(" ") }
`;
