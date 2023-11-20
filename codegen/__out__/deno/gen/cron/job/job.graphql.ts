import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./job.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `

type JobModel {
  "ID"
  id: String!
  "编码"
  code: String!
  "名称"
  lbl: String!
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
type JobFieldComment {
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
  ""
  id: String
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
input JobSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [String]
  "String"
  id: String
  "编码"
  code: String
  code_like: String
  "名称"
  lbl: String
  lbl_like: String
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
  findCountJob(search: JobSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllJob(search: JobSearch, page: PageInput, sort: [SortInput!]): [JobModel!]!
  "获取字段对应的名称"
  getFieldCommentsJob: JobFieldComment!
  "根据条件查找第一条数据"
  findOneJob(search: JobSearch, sort: [SortInput!]): JobModel
  "根据id查找一条数据"
  findByIdJob(id: String!): JobModel
  "查找order_by字段的最大值"
  findLastOrderByJob: Int!
}
type Mutation {
  "创建一条数据"
  createJob(model: JobInput!, unique_type: UniqueType): String!
  "根据id修改一条数据"
  updateByIdJob(id: String!, model: JobInput!): String!
  "根据 ids 删除数据"
  deleteByIdsJob(ids: [String!]!): Int!
  "根据 ids 启用或者禁用数据"
  enableByIdsJob(ids: [String!]!, is_enabled: Int!): Int!
  "根据 ids 锁定或者解锁数据"
  lockByIdsJob(ids: [String!]!, is_locked: Int!): Int!
  "根据 ids 还原数据"
  revertByIdsJob(ids: [String!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsJob(ids: [String!]!): Int!
}

`);
