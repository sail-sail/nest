import { defineGraphql } from "/lib/context.ts";

import type { } from "./background_task.model.ts";
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
  id: BackgroundTaskId!
  "名称"
  lbl: String!
  "状态"
  state: BackgroundTaskState!
  "状态"
  state_lbl: String!
  "类型"
  type: BackgroundTaskType!
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
  "ID"
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
  "开始时间"
  begin_time_save_null: Boolean
  "结束时间"
  end_time: NaiveDateTime
  "结束时间"
  end_time_lbl: String
  "结束时间"
  end_time_save_null: Boolean
  "备注"
  rem: String
}
input BackgroundTaskSearch {
  "已删除"
  is_deleted: Int
  "ID列表"
  ids: [BackgroundTaskId!]
  "ID"
  id: BackgroundTaskId
  "名称"
  lbl: String
  lbl_like: String
  "状态"
  state: [BackgroundTaskState!]
  "类型"
  type: [BackgroundTaskType!]
  "开始时间"
  begin_time: [NaiveDateTime]
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
  "根据条件查找后台任务总数"
  findCountBackgroundTask(search: BackgroundTaskSearch): Int!
  "根据搜索条件和分页查找后台任务列表"
  findAllBackgroundTask(search: BackgroundTaskSearch, page: PageInput, sort: [SortInput!]): [BackgroundTaskModel!]!
  "获取后台任务字段注释"
  getFieldCommentsBackgroundTask: BackgroundTaskFieldComment!
  "根据条件查找第一个后台任务"
  findOneBackgroundTask(search: BackgroundTaskSearch, sort: [SortInput!]): BackgroundTaskModel
  "根据 id 查找后台任务"
  findByIdBackgroundTask(id: BackgroundTaskId!): BackgroundTaskModel
  "根据 ids 查找后台任务"
  findByIdsBackgroundTask(ids: [BackgroundTaskId!]!): [BackgroundTaskModel]!
}
type Mutation {
  "根据 ids 删除后台任务"
  deleteByIdsBackgroundTask(ids: [BackgroundTaskId!]!): Int!
  "根据 ids 还原后台任务"
  revertByIdsBackgroundTask(ids: [BackgroundTaskId!]!): Int!
  "根据 ids 彻底删除后台任务"
  forceDeleteByIdsBackgroundTask(ids: [BackgroundTaskId!]!): Int!
}

`);
