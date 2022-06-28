import { defineGraphql } from "/lib/context.ts";
import * as resolvers from "./background_task.resolver.ts";

defineGraphql(resolvers, /* GraphQL */ `
type Background_TaskModel {
  "ID"
  id: ID!
  "名称"
  lbl: String!
  "状态ID"
  state: String!
  "状态名称"
  _state: String
  "类型ID"
  type: String!
  "类型名称"
  _type: String
  "执行结果"
  result: String!
  "错误信息"
  err_msg: String!
  "开始时间"
  begin_time: String
  "结束时间"
  end_time: String
  "备注"
  rem: String!
}
input Background_TaskInput {
  ""
  id: ID
  "名称"
  lbl: String
  "状态ID"
  state: String
  "状态名称"
  _state: String
  "类型ID"
  type: String
  "类型名称"
  _type: String
  "执行结果"
  result: String
  "错误信息"
  err_msg: String
  "开始时间"
  begin_time: String
  "结束时间"
  end_time: String
  "备注"
  rem: String
}
input Background_TaskSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [ID]
  "ID"
  id: ID
  "名称"
  lbl: String
  lblLike: String
  "状态"
  state: [String]
  "类型"
  type: [String]
  "执行结果"
  result: String
  resultLike: String
  "错误信息"
  err_msg: String
  err_msgLike: String
  "开始时间"
  begin_time: [String]
  "结束时间"
  end_time: [String]
  "备注"
  rem: String
  remLike: String
  "创建人"
  create_usr_id: [String]
  _create_usr_id: [String]
}
type Query {
  "根据条件查找据数总数"
  findCountBackground_task(search: Background_TaskSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllBackground_task(search: Background_TaskSearch, page: PageInput, sort: [SortInput]): [Background_TaskModel!]!
  "根据搜索条件导出"
  exportExcelBackground_task(search: Background_TaskSearch, sort: [SortInput]): String!
  "根据条件查找第一条数据"
  findOneBackground_task(search: Background_TaskSearch): Background_TaskModel
  "根据id查找一条数据"
  findByIdBackground_task(id: ID!): Background_TaskModel
}
type Mutation {
  "创建一条数据"
  createBackground_task(model: Background_TaskInput!): ID!
  "根据id修改一条数据"
  updateByIdBackground_task(id: ID!, model: Background_TaskInput!): ID!
  "导入文件"
  importFileBackground_task(id: ID!): String
  "根据ids删除数据"
  deleteByIdsBackground_task(ids: [ID]!): Int!
  "根据ids还原数据"
  revertByIdsBackground_task(ids: [ID]!): Int!
}
`);
