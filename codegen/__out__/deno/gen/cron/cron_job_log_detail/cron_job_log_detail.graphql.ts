import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./cron_job_log_detail.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar CronJobLogDetailId


type CronJobLogDetailModel {
  "ID"
  id: CronJobLogDetailId!
  "任务执行日志"
  cron_job_log_id: CronJobLogId!
  "任务执行日志"
  cron_job_log_id_lbl: String
  "日志明细"
  lbl: String!
  "创建时间"
  create_time: NaiveDateTime
  "创建时间"
  create_time_lbl: String!
  "是否已删除"
  is_deleted: Int!
}
type CronJobLogDetailFieldComment {
  "ID"
  id: String!
  "任务执行日志"
  cron_job_log_id: String!
  "任务执行日志"
  cron_job_log_id_lbl: String!
  "日志明细"
  lbl: String!
  "创建时间"
  create_time: String!
  "创建时间"
  create_time_lbl: String!
}
input CronJobLogDetailInput {
  "ID"
  id: CronJobLogDetailId
  "任务执行日志"
  cron_job_log_id: CronJobLogId
  "任务执行日志"
  cron_job_log_id_lbl: String
  "日志明细"
  lbl: String
}
input CronJobLogDetailSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [CronJobLogDetailId!]
  "ID"
  id: CronJobLogDetailId
  "任务执行日志"
  cron_job_log_id: [CronJobLogId!]
  cron_job_log_id_is_null: Boolean
  "日志明细"
  lbl: String
  lbl_like: String
  "创建时间"
  create_time: [NaiveDateTime]
}
type Query {
  "根据条件查找任务执行日志明细总数"
  findCountCronJobLogDetail(search: CronJobLogDetailSearch): Int!
  "根据搜索条件和分页查找任务执行日志明细列表"
  findAllCronJobLogDetail(search: CronJobLogDetailSearch, page: PageInput, sort: [SortInput!]): [CronJobLogDetailModel!]!
  "获取任务执行日志明细字段注释"
  getFieldCommentsCronJobLogDetail: CronJobLogDetailFieldComment!
  "根据条件查找第一个任务执行日志明细"
  findOneCronJobLogDetail(search: CronJobLogDetailSearch, sort: [SortInput!]): CronJobLogDetailModel
  "根据 id 查找任务执行日志明细"
  findByIdCronJobLogDetail(id: CronJobLogDetailId!): CronJobLogDetailModel
}
type Mutation {
  "根据 ids 删除任务执行日志明细"
  deleteByIdsCronJobLogDetail(ids: [CronJobLogDetailId!]!): Int!
  "根据 ids 还原任务执行日志明细"
  revertByIdsCronJobLogDetail(ids: [CronJobLogDetailId!]!): Int!
  "根据 ids 彻底删除任务执行日志明细"
  forceDeleteByIdsCronJobLogDetail(ids: [CronJobLogDetailId!]!): Int!
}

`);
