import { defineGraphql } from "/lib/context.ts";

import type { } from "./cron_job_log_detail.model.ts";
import * as resolver from "./cron_job_log_detail.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar CronJobLogDetailId

type CronJobLogDetailModel {
  "ID"
  id: CronJobLogDetailId!
  "定时任务日志"
  cron_job_log_id: CronJobLogId!
  "日志明细"
  lbl: String!
  "创建时间"
  create_time: NaiveDateTime
  "创建时间"
  create_time_lbl: String!
  "已删除"
  is_deleted: Int!
}
type CronJobLogDetailFieldComment {
  "ID"
  id: String!
  "定时任务日志"
  cron_job_log_id: String!
  "定时任务日志"
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
  "定时任务日志"
  cron_job_log_id: CronJobLogId
  "日志明细"
  lbl: String
}
input CronJobLogDetailSearch {
  "已删除"
  is_deleted: Int
  "ID列表"
  ids: [CronJobLogDetailId!]
  "ID"
  id: CronJobLogDetailId
  "定时任务日志"
  cron_job_log_id: [CronJobLogId!]
  "定时任务日志"
  cron_job_log_id_is_null: Boolean
  "日志明细"
  lbl: String
  lbl_like: String
  "创建时间"
  create_time: [NaiveDateTime]
}
type Query {
  "根据条件查找定时任务日志明细总数"
  findCountCronJobLogDetail(search: CronJobLogDetailSearch): Int!
  "根据搜索条件和分页查找定时任务日志明细列表"
  findAllCronJobLogDetail(search: CronJobLogDetailSearch, page: PageInput, sort: [SortInput!]): [CronJobLogDetailModel!]!
  "获取定时任务日志明细字段注释"
  getFieldCommentsCronJobLogDetail: CronJobLogDetailFieldComment!
  "根据条件查找第一个定时任务日志明细"
  findOneCronJobLogDetail(search: CronJobLogDetailSearch, sort: [SortInput!]): CronJobLogDetailModel
  "根据 id 查找定时任务日志明细"
  findByIdCronJobLogDetail(id: CronJobLogDetailId!): CronJobLogDetailModel
  "根据 ids 查找定时任务日志明细"
  findByIdsCronJobLogDetail(ids: [CronJobLogDetailId!]!): [CronJobLogDetailModel]!
}
type Mutation {
  "根据 ids 删除定时任务日志明细"
  deleteByIdsCronJobLogDetail(ids: [CronJobLogDetailId!]!): Int!
  "根据 ids 还原定时任务日志明细"
  revertByIdsCronJobLogDetail(ids: [CronJobLogDetailId!]!): Int!
  "根据 ids 彻底删除定时任务日志明细"
  forceDeleteByIdsCronJobLogDetail(ids: [CronJobLogDetailId!]!): Int!
}

`);
