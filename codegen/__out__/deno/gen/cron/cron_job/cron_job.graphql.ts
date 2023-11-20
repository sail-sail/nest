import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./cron_job.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `

type CronJobModel {
  "ID"
  id: String!
  "任务"
  job_id: String!
  "任务"
  job_id_lbl: String
  "Cron表达式"
  cron: String!
  "时区"
  timezone: String!
  "时区"
  timezone_lbl: String
  "锁定"
  is_locked: Int!
  "锁定"
  is_locked_lbl: String
  "启用"
  is_enabled: Int!
  "启用"
  is_enabled_lbl: String
  "排序"
  order_by: Int!
  "备注"
  rem: String!
  "创建人"
  create_usr_id: String!
  "创建人"
  create_usr_id_lbl: String
  "创建时间"
  create_time: NaiveDateTime
  "创建时间"
  create_time_lbl: String!
  "更新人"
  update_usr_id: String!
  "更新人"
  update_usr_id_lbl: String
  "更新时间"
  update_time: NaiveDateTime
  "更新时间"
  update_time_lbl: String!
  "是否已删除"
  is_deleted: Int!
}
type CronJobFieldComment {
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
  ""
  id: String
  "任务"
  job_id: String
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
  "创建人"
  create_usr_id: String
  "创建人"
  create_usr_id_lbl: String
  "创建时间"
  create_time: NaiveDateTime
  "创建时间"
  create_time_lbl: String
  "更新人"
  update_usr_id: String
  "更新人"
  update_usr_id_lbl: String
  "更新时间"
  update_time: NaiveDateTime
  "更新时间"
  update_time_lbl: String
}
input CronJobSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [String]
  "String"
  id: String
  "任务"
  job_id: [String!]
  job_id_is_null: Boolean
  "Cron表达式"
  cron: String
  cron_like: String
  "时区"
  timezone: [String!]
  "锁定"
  is_locked: [Int!]
  "启用"
  is_enabled: [Int!]
  "排序"
  order_by: [Int!]
  "备注"
  rem: String
  rem_like: String
  "创建人"
  create_usr_id: [String!]
  create_usr_id_is_null: Boolean
  "创建时间"
  create_time: [NaiveDateTime!]
  "更新人"
  update_usr_id: [String!]
  update_usr_id_is_null: Boolean
  "更新时间"
  update_time: [NaiveDateTime!]
}
type Query {
  "根据条件查找据数总数"
  findCountCronJob(search: CronJobSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllCronJob(search: CronJobSearch, page: PageInput, sort: [SortInput!]): [CronJobModel!]!
  "获取字段对应的名称"
  getFieldCommentsCronJob: CronJobFieldComment!
  "根据条件查找第一条数据"
  findOneCronJob(search: CronJobSearch, sort: [SortInput!]): CronJobModel
  "根据id查找一条数据"
  findByIdCronJob(id: String!): CronJobModel
  "查找order_by字段的最大值"
  findLastOrderByCronJob: Int!
}
type Mutation {
  "创建一条数据"
  createCronJob(model: CronJobInput!, unique_type: UniqueType): String!
  "根据id修改一条数据"
  updateByIdCronJob(id: String!, model: CronJobInput!): String!
  "根据 ids 删除数据"
  deleteByIdsCronJob(ids: [String!]!): Int!
  "根据 ids 启用或者禁用数据"
  enableByIdsCronJob(ids: [String!]!, is_enabled: Int!): Int!
  "根据 ids 锁定或者解锁数据"
  lockByIdsCronJob(ids: [String!]!, is_locked: Int!): Int!
  "根据 ids 还原数据"
  revertByIdsCronJob(ids: [String!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsCronJob(ids: [String!]!): Int!
}

`);
