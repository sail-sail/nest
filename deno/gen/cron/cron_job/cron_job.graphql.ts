import { defineGraphql } from "/lib/context.ts";

import type { } from "./cron_job.model.ts";
import * as resolver from "./cron_job.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar CronJobId

type CronJobModel {
  "ID"
  id: CronJobId!
  "名称"
  lbl: String!
  "任务"
  job_id: JobId!
  "任务"
  job_id_lbl: String!
  "Cron表达式"
  cron: String!
  "时区"
  timezone: String!
  "时区"
  timezone_lbl: String!
  "锁定"
  is_locked: Int!
  "锁定"
  is_locked_lbl: String!
  "启用"
  is_enabled: Int!
  "启用"
  is_enabled_lbl: String!
  "排序"
  order_by: Int!
  "备注"
  rem: String!
  "创建人"
  create_usr_id: UsrId!
  "创建人"
  create_usr_id_lbl: String!
  "创建时间"
  create_time: NaiveDateTime
  "创建时间"
  create_time_lbl: String!
  "更新人"
  update_usr_id: UsrId!
  "更新人"
  update_usr_id_lbl: String!
  "更新时间"
  update_time: NaiveDateTime
  "更新时间"
  update_time_lbl: String!
  "已删除"
  is_deleted: Int!
}
type CronJobFieldComment {
  "ID"
  id: String!
  "名称"
  lbl: String!
  "任务"
  job_id: String!
  "任务"
  job_id_lbl: String!
  "Cron表达式"
  cron: String!
  "时区"
  timezone: String!
  "时区"
  timezone_lbl: String!
  "锁定"
  is_locked: String!
  "锁定"
  is_locked_lbl: String!
  "启用"
  is_enabled: String!
  "启用"
  is_enabled_lbl: String!
  "排序"
  order_by: String!
  "备注"
  rem: String!
  "创建人"
  create_usr_id: String!
  "创建人"
  create_usr_id_lbl: String!
  "创建时间"
  create_time: String!
  "创建时间"
  create_time_lbl: String!
  "更新人"
  update_usr_id: String!
  "更新人"
  update_usr_id_lbl: String!
  "更新时间"
  update_time: String!
  "更新时间"
  update_time_lbl: String!
}
input CronJobInput {
  "ID"
  id: CronJobId
  "名称"
  lbl: String
  "任务"
  job_id: JobId
  "任务"
  job_id_lbl: String
  "Cron表达式"
  cron: String
  "时区"
  timezone: String
  "时区"
  timezone_lbl: String
  "锁定"
  is_locked: Int
  "锁定"
  is_locked_lbl: String
  "启用"
  is_enabled: Int
  "启用"
  is_enabled_lbl: String
  "排序"
  order_by: Int
  "备注"
  rem: String
}
input CronJobSearch {
  "已删除"
  is_deleted: Int
  "ID列表"
  ids: [CronJobId!]
  "ID"
  id: CronJobId
  "名称"
  lbl: String
  lbl_like: String
  "任务"
  job_id: [JobId!]
  "任务"
  job_id_is_null: Boolean
  "任务"
  job_id_lbl: [String!]
  "任务"
  job_id_lbl_like: String
  "启用"
  is_enabled: [Int!]
  "创建人"
  create_usr_id: [UsrId!]
  "创建人"
  create_usr_id_is_null: Boolean
  "创建人"
  create_usr_id_lbl: [String!]
  "创建人"
  create_usr_id_lbl_like: String
  "更新人"
  update_usr_id: [UsrId!]
  "更新人"
  update_usr_id_is_null: Boolean
  "更新人"
  update_usr_id_lbl: [String!]
  "更新人"
  update_usr_id_lbl_like: String
}
type Query {
  "根据条件查找定时任务总数"
  findCountCronJob(search: CronJobSearch): Int!
  "根据搜索条件和分页查找定时任务列表"
  findAllCronJob(search: CronJobSearch, page: PageInput, sort: [SortInput!]): [CronJobModel!]!
  "获取定时任务字段注释"
  getFieldCommentsCronJob: CronJobFieldComment!
  "根据条件查找第一个定时任务"
  findOneCronJob(search: CronJobSearch, sort: [SortInput!]): CronJobModel
  "根据 id 查找定时任务"
  findByIdCronJob(id: CronJobId!): CronJobModel
  "根据 ids 查找定时任务"
  findByIdsCronJob(ids: [CronJobId!]!): [CronJobModel]!
  "查找定时任务 order_by 字段的最大值"
  findLastOrderByCronJob: Int!
}
type Mutation {
  "批量创建定时任务"
  createsCronJob(inputs: [CronJobInput!]!, unique_type: UniqueType): [CronJobId!]!
  "根据 id 修改定时任务"
  updateByIdCronJob(id: CronJobId!, input: CronJobInput!): CronJobId!
  "根据 ids 删除定时任务"
  deleteByIdsCronJob(ids: [CronJobId!]!): Int!
  "根据 ids 启用或者禁用定时任务"
  enableByIdsCronJob(ids: [CronJobId!]!, is_enabled: Int!): Int!
  "根据 ids 锁定或者解锁定时任务"
  lockByIdsCronJob(ids: [CronJobId!]!, is_locked: Int!): Int!
  "根据 ids 还原定时任务"
  revertByIdsCronJob(ids: [CronJobId!]!): Int!
  "根据 ids 彻底删除定时任务"
  forceDeleteByIdsCronJob(ids: [CronJobId!]!): Int!
}

`);
