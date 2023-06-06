import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./background_task.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `

type BackgroundTaskModel {
  "ID"
  id: String!
  "名称"
  lbl: String!
  "状态"
  state: String!
  "状态"
  state_lbl: String
  "类型"
  type: String!
  "类型"
  type_lbl: String
  "执行结果"
  result: String!
  "错误信息"
  err_msg: String!
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
  "创建人"
  create_usr_id: String!
  "创建人"
  create_usr_id_lbl: String
}
type BackgroundTaskFieldComment {
  "名称"
  lbl: String!
  "状态"
  state: String!
  "状态"
  state_lbl: String!
  "类型"
  type: String!
  "类型"
  type_lbl: String!
  "执行结果"
  result: String!
  "错误信息"
  err_msg: String!
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
  "创建人"
  create_usr_id: String!
  "创建人"
  create_usr_id_lbl: String!
}
input BackgroundTaskInput {
  ""
  id: String
  "名称"
  lbl: String
  "状态"
  state: String
  "状态"
  state_lbl: String
  "类型"
  type: String
  "类型"
  type_lbl: String
  "执行结果"
  result: String
  "错误信息"
  err_msg: String
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
  "创建人"
  create_usr_id: String
  "创建人"
  create_usr_id_lbl: String
}
input BackgroundTaskSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [String]
  "String"
  id: String
  "名称"
  lbl: String
  lbl_like: String
  "状态"
  state: [String!]
  "类型"
  type: [String!]
  "执行结果"
  result: String
  result_like: String
  "错误信息"
  err_msg: String
  err_msg_like: String
  "开始时间"
  begin_time: [NaiveDateTime!]
  "结束时间"
  end_time: [NaiveDateTime!]
  "备注"
  rem: String
  rem_like: String
  "创建人"
  create_usr_id: [String!]
  create_usr_id_is_null: Boolean
}
type Query {
  "根据条件查找据数总数"
  findCountBackgroundTask(search: BackgroundTaskSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllBackgroundTask(search: BackgroundTaskSearch, page: PageInput, sort: [SortInput!]): [BackgroundTaskModel!]!
  "获取字段对应的名称"
  getFieldCommentsBackgroundTask: BackgroundTaskFieldComment!
  "根据条件查找第一条数据"
  findOneBackgroundTask(search: BackgroundTaskSearch, sort: [SortInput!]): BackgroundTaskModel
  "根据id查找一条数据"
  findByIdBackgroundTask(id: String!): BackgroundTaskModel
}
type Mutation {
  "根据 ids 删除数据"
  deleteByIdsBackgroundTask(ids: [String!]!): Int!
  "根据 ids 还原数据"
  revertByIdsBackgroundTask(ids: [String!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsBackgroundTask(ids: [String!]!): Int!
}

`);
