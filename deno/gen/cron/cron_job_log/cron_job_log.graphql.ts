import { defineGraphql } from "/lib/context.ts";

import type { } from "./cron_job_log.model.ts";
import * as resolver from "./cron_job_log.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar CronJobLogId

"任务执行日志执行状态"
enum CronJobLogExecState {
  "执行中"
  running
  "成功"
  success
  "失败"
  fail
}

type CronJobLogModel {
  "ID"
  id: CronJobLogId!
  "定时任务"
  cron_job_id: CronJobId!
  "定时任务"
  cron_job_id_lbl: String!
  "执行状态"
  exec_state: CronJobLogExecState!
  "执行状态"
  exec_state_lbl: String!
  "执行结果"
  exec_result: String!
  "开始时间"
  begin_time: NaiveDateTime
  "开始时间"
  begin_time_lbl: String!
  "结束时间"
  end_time: NaiveDateTime
  "结束时间"
  end_time_lbl: String!
  "备注"
  rem: String!
  "创建时间"
  create_time: NaiveDateTime
  "创建时间"
  create_time_lbl: String!
  "是否已删除"
  is_deleted: Int!
}
type CronJobLogFieldComment {
  "ID"
  id: String!
  "定时任务"
  cron_job_id: String!
  "定时任务"
  cron_job_id_lbl: String!
  "执行状态"
  exec_state: String!
  "执行状态"
  exec_state_lbl: String!
  "执行结果"
  exec_result: String!
  "开始时间"
  begin_time: String!
  "开始时间"
  begin_time_lbl: String!
  "结束时间"
  end_time: String!
  "结束时间"
  end_time_lbl: String!
  "备注"
  rem: String!
  "创建时间"
  create_time: String!
  "创建时间"
  create_time_lbl: String!
}
input CronJobLogInput {
  "ID"
  id: CronJobLogId
  "定时任务"
  cron_job_id: CronJobId
  "定时任务"
  cron_job_id_lbl: String
  "执行状态"
  exec_state: CronJobLogExecState
  "执行状态"
  exec_state_lbl: String
  "执行结果"
  exec_result: String
  "开始时间"
  begin_time: NaiveDateTime
  "开始时间"
  begin_time_lbl: String
  "开始时间"
  begin_time_save_null: Int
  "结束时间"
  end_time: NaiveDateTime
  "结束时间"
  end_time_lbl: String
  "结束时间"
  end_time_save_null: Int
  "备注"
  rem: String
}
input CronJobLogSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [CronJobLogId!]
  "ID"
  id: CronJobLogId
  "定时任务"
  cron_job_id: [CronJobId!]
  "定时任务"
  cron_job_id_is_null: Boolean
  "执行状态"
  exec_state: [CronJobLogExecState!]
  "开始时间"
  begin_time: [NaiveDateTime]
}
type Query {
  "根据条件查找任务执行日志总数"
  findCountCronJobLog(search: CronJobLogSearch): Int!
  "根据搜索条件和分页查找任务执行日志列表"
  findAllCronJobLog(search: CronJobLogSearch, page: PageInput, sort: [SortInput!]): [CronJobLogModel!]!
  "获取任务执行日志字段注释"
  getFieldCommentsCronJobLog: CronJobLogFieldComment!
  "根据条件查找第一个任务执行日志"
  findOneCronJobLog(search: CronJobLogSearch, sort: [SortInput!]): CronJobLogModel
  "根据 id 查找任务执行日志"
  findByIdCronJobLog(id: CronJobLogId!): CronJobLogModel
}
type Mutation {
  "根据 ids 删除任务执行日志"
  deleteByIdsCronJobLog(ids: [CronJobLogId!]!): Int!
  "根据 ids 还原任务执行日志"
  revertByIdsCronJobLog(ids: [CronJobLogId!]!): Int!
  "根据 ids 彻底删除任务执行日志"
  forceDeleteByIdsCronJobLog(ids: [CronJobLogId!]!): Int!
}

`);
