import { defineGraphql } from "/lib/context.ts";

import * as operation_recordResolver from "./operation_record.resolver.ts";

defineGraphql(operation_recordResolver, /* GraphQL */ `

type OperationRecordModel {
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
  "创建人"
  create_usr_id: ID!
  "创建人"
  create_usr_id_lbl: String
  "创建时间"
  create_time: String
  "更新人"
  update_usr_id: ID!
  "更新人"
  update_usr_id_lbl: String
  "更新时间"
  update_time: String
}
type OperationRecordFieldComment {
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
  "创建人"
  create_usr_id: String!
  "创建人"
  create_usr_id_lbl: String!
  "创建时间"
  create_time: String!
  "更新人"
  update_usr_id: String!
  "更新人"
  update_usr_id_lbl: String!
  "更新时间"
  update_time: String!
}
input OperationRecordInput {
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
  "创建人"
  create_usr_id: ID
  "创建人"
  create_usr_id_lbl: String
  "创建时间"
  create_time: String
  "更新人"
  update_usr_id: ID
  "更新人"
  update_usr_id_lbl: String
  "更新时间"
  update_time: String
}
input OperationRecordSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [ID]
  "ID"
  id: ID
  "模块"
  mod: String
  mod_like: String
  "模块名称"
  mod_lbl: String
  mod_lbl_like: String
  "方法"
  method: String
  method_like: String
  "方法名称"
  method_lbl: String
  method_lbl_like: String
  "操作"
  lbl: String
  lbl_like: String
  "备注"
  rem: String
  rem_like: String
  "创建人"
  create_usr_id: [String!]
  create_usr_id_lbl: [String!]
  "创建时间"
  create_time: [String!]
  "更新人"
  update_usr_id: [String!]
  update_usr_id_lbl: [String!]
  "更新时间"
  update_time: [String!]
}
type Query {
  "根据条件查找据数总数"
  findCountOperation_record(search: OperationRecordSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllOperation_record(search: OperationRecordSearch, page: PageInput, sort: [SortInput]): [OperationRecordModel!]!
  "获取字段对应的名称"
  getFieldCommentsOperation_record: OperationRecordFieldComment!
  "根据条件查找第一条数据"
  findOneOperation_record(search: OperationRecordSearch, sort: [SortInput]): OperationRecordModel
  "根据id查找一条数据"
  findByIdOperation_record(id: ID!): OperationRecordModel
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
