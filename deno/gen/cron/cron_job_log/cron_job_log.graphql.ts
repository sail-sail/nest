import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./cron_job_log.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `

type CronJobLogModel {
  "ID"
  id: String!
  "定时任务"
  cron_job_id: String!
  "定时任务"
  cron_job_id_lbl: String
  "执行状态"
  exec_state: String!
  "执行状态"
  exec_state_lbl: String
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
  ""
  id: String
  "定时任务"
  cron_job_id: String
  "定时任务"
  cron_job_id_lbl: String
  "执行状态"
  exec_state: String
  "执行状态"
  exec_state_lbl: String
  "执行结果"
  exec_result: String
  "开始时间"
  begin_time: NaiveDateTime
  "开始时间"
  begin_time_lbl: String
  "结束时间"
  end_time: NaiveDateTime
  "结束时间"
  end_time_lbl: String
  "备注"
  rem: String
  "创建时间"
  create_time: NaiveDateTime
  "创建时间"
  create_time_lbl: String
}
input CronJobLogSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [String]
  "String"
  id: String
  "定时任务"
  cron_job_id: [String!]
  cron_job_id_is_null: Boolean
  "执行状态"
  exec_state: [String!]
  "执行结果"
  exec_result: String
  exec_result_like: String
  "开始时间"
  begin_time: [NaiveDateTime!]
  "结束时间"
  end_time: [NaiveDateTime!]
  "备注"
  rem: String
  rem_like: String
  "创建时间"
  create_time: [NaiveDateTime!]
}
type Query {
  "根据条件查找据数总数"
  findCountCronJobLog(search: CronJobLogSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllCronJobLog(search: CronJobLogSearch, page: PageInput, sort: [SortInput!]): [CronJobLogModel!]!
  "获取字段对应的名称"
  getFieldCommentsCronJobLog: CronJobLogFieldComment!
  "根据条件查找第一条数据"
  findOneCronJobLog(search: CronJobLogSearch, sort: [SortInput!]): CronJobLogModel
  "根据id查找一条数据"
  findByIdCronJobLog(id: String!): CronJobLogModel
}
type Mutation {
  "根据 ids 删除数据"
  deleteByIdsCronJobLog(ids: [String!]!): Int!
  "根据 ids 还原数据"
  revertByIdsCronJobLog(ids: [String!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsCronJobLog(ids: [String!]!): Int!
}

`);
