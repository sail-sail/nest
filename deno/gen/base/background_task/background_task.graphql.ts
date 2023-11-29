import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./background_task.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar BackgroundTaskId

"后台任务状态"
enum BackgroundTaskState {
  "运行中"
  running
  "成功"
  success
  "失败"
  fail
  "取消"
  cancel
}
"后台任务类型"
enum BackgroundTaskType {
  "文本"
  text
  "下载"
  download
  "查看"
  inline
  "标签"
  tag
}

type BackgroundTaskModel {
  "ID"
  id: String!
  "名称"
  lbl: String!
  "状态"
  state: BackgroundTaskState
  "状态"
  state_lbl: String!
  "类型"
  type: BackgroundTaskType
  "类型"
  type_lbl: String!
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
  create_usr_id_lbl: UsrId
  "创建时间"
  create_time: NaiveDateTime
  "创建时间"
  create_time_lbl: String!
  "更新人"
  update_usr_id: String!
  "更新人"
  update_usr_id_lbl: UsrId
  "更新时间"
  update_time: NaiveDateTime
  "更新时间"
  update_time_lbl: String!
  "是否已删除"
  is_deleted: Int!
}
type BackgroundTaskFieldComment {
  "ID"
  id: String!
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
input BackgroundTaskInput {
  ""
  id: BackgroundTaskId
  "名称"
  lbl: String
  "状态"
  state: BackgroundTaskState
  "状态"
  state_lbl: String
  "类型"
  type: BackgroundTaskType
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
  create_usr_id_lbl: UsrId
  "创建时间"
  create_time: NaiveDateTime
  "创建时间"
  create_time_lbl: String
  "更新人"
  update_usr_id: String
  "更新人"
  update_usr_id_lbl: UsrId
  "更新时间"
  update_time: NaiveDateTime
  "更新时间"
  update_time_lbl: String
}
input BackgroundTaskSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [String]
  "ID"
  id: BackgroundTaskId
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
  create_usr_id: [UsrId!]
  create_usr_id_is_null: Boolean
  "创建时间"
  create_time: [NaiveDateTime!]
  "更新人"
  update_usr_id: [UsrId!]
  update_usr_id_is_null: Boolean
  "更新时间"
  update_time: [NaiveDateTime!]
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
