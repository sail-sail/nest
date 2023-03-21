import { defineGraphql } from "/lib/context.ts";

import * as operation_recordResolver from "./operation_record.resolver.ts";

defineGraphql(operation_recordResolver, /* GraphQL */ `

type Operation_RecordModel {
  "ID"
  id: ID!
  "模块"
  mod: String!
  "模块名称"
  mod_lbl: String!
  "方法"
  method: String!
  "方法名称"
  method_lbl: String!
  "操作"
  lbl: String!
  "备注"
  rem: String!
  "创建人ID"
  create_usr_id: ID!
  "创建人名称"
  _create_usr_id: String
  "创建时间"
  create_time: String
  "更新人ID"
  update_usr_id: ID!
  "更新人名称"
  _update_usr_id: String
  "更新时间"
  update_time: String
}
input Operation_RecordInput {
  "租户ID"
  tenant_id: String
  ""
  id: ID
  "模块"
  mod: String
  "模块名称"
  mod_lbl: String
  "方法"
  method: String
  "方法名称"
  method_lbl: String
  "操作"
  lbl: String
  "备注"
  rem: String
  "创建人ID"
  create_usr_id: ID
  "创建人名称"
  _create_usr_id: String
  "创建时间"
  create_time: String
  "更新人ID"
  update_usr_id: ID
  "更新人名称"
  _update_usr_id: String
  "更新时间"
  update_time: String
}
input Operation_RecordSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [ID]
  "ID"
  id: ID
  "模块"
  mod: String
  modLike: String
  "模块名称"
  mod_lbl: String
  mod_lblLike: String
  "方法"
  method: String
  methodLike: String
  "方法名称"
  method_lbl: String
  method_lblLike: String
  "操作"
  lbl: String
  lblLike: String
  "备注"
  rem: String
  remLike: String
  "创建人"
  create_usr_id: [String]
  _create_usr_id: [String]
  "创建时间"
  create_time: [String]
  "更新人"
  update_usr_id: [String]
  _update_usr_id: [String]
  "更新时间"
  update_time: [String]
}
type Query {
  "根据条件查找据数总数"
  findCountOperation_record(search: Operation_RecordSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllOperation_record(search: Operation_RecordSearch, page: PageInput, sort: [SortInput]): [Operation_RecordModel!]!
  "根据搜索条件导出"
  exportExcelOperation_record(search: Operation_RecordSearch, sort: [SortInput]): String!
  "根据条件查找第一条数据"
  findOneOperation_record(search: Operation_RecordSearch): Operation_RecordModel
  "根据id查找一条数据"
  findByIdOperation_record(id: ID!): Operation_RecordModel
}
type Mutation {
  "根据 ids 删除数据"
  deleteByIdsOperation_record(ids: [ID!]!): Int!
  "根据 ids 还原数据"
  revertByIdsOperation_record(ids: [ID!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsOperation_record(ids: [ID!]!): Int!
}

`);
