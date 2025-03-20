import { defineGraphql } from "/lib/context.ts";

import type { } from "./job.model.ts";
import * as resolver from "./job.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar JobId

type JobModel {
  "ID"
  id: JobId!
  "编码"
  code: String!
  "名称"
  lbl: String!
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
  "系统字段"
  is_sys: Int!
}
type JobFieldComment {
  "ID"
  id: String!
  "编码"
  code: String!
  "名称"
  lbl: String!
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
input JobInput {
  "ID"
  id: JobId
  "编码"
  code: String
  "名称"
  lbl: String
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
input JobSearch {
  "已删除"
  is_deleted: Int
  "ID列表"
  ids: [JobId!]
  "ID"
  id: JobId
  "编码"
  code: String
  code_like: String
  "名称"
  lbl: String
  lbl_like: String
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
  "根据条件查找任务总数"
  findCountJob(search: JobSearch): Int!
  "根据搜索条件和分页查找任务列表"
  findAllJob(search: JobSearch, page: PageInput, sort: [SortInput!]): [JobModel!]!
  "获取任务字段注释"
  getFieldCommentsJob: JobFieldComment!
  "根据条件查找第一个任务"
  findOneJob(search: JobSearch, sort: [SortInput!]): JobModel
  "根据 id 查找任务"
  findByIdJob(id: JobId!): JobModel
  "根据 ids 查找任务"
  findByIdsJob(ids: [JobId!]!): [JobModel]!
  "查找任务 order_by 字段的最大值"
  findLastOrderByJob: Int!
}
type Mutation {
  "批量创建任务"
  createsJob(inputs: [JobInput!]!, unique_type: UniqueType): [JobId!]!
  "根据 id 修改任务"
  updateByIdJob(id: JobId!, input: JobInput!): JobId!
  "根据 ids 删除任务"
  deleteByIdsJob(ids: [JobId!]!): Int!
  "根据 ids 启用或者禁用任务"
  enableByIdsJob(ids: [JobId!]!, is_enabled: Int!): Int!
  "根据 ids 锁定或者解锁任务"
  lockByIdsJob(ids: [JobId!]!, is_locked: Int!): Int!
  "根据 ids 还原任务"
  revertByIdsJob(ids: [JobId!]!): Int!
  "根据 ids 彻底删除任务"
  forceDeleteByIdsJob(ids: [JobId!]!): Int!
}

`);
