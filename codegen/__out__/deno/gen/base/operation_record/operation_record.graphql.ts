import { defineGraphql } from "/lib/context.ts";

import * as operation_recordResolver from "./operation_record.resolver.ts";

defineGraphql(operation_recordResolver, /* GraphQL */ `

type OperationRecordModel {
  "ID"
  id: String!
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
input OperationRecordInput {
  ""
  id: String
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
input OperationRecordSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [String]
  "String"
  id: String
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
  findCountOperationRecord(search: OperationRecordSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllOperationRecord(search: OperationRecordSearch, page: PageInput, sort: [SortInput!]): [OperationRecordModel!]!
  "获取字段对应的名称"
  getFieldCommentsOperationRecord: OperationRecordFieldComment!
  "根据条件查找第一条数据"
  findOneOperationRecord(search: OperationRecordSearch, sort: [SortInput!]): OperationRecordModel
  "根据id查找一条数据"
  findByIdOperationRecord(id: String!): OperationRecordModel
}
type Mutation {
  "根据 ids 删除数据"
  deleteByIdsOperationRecord(ids: [String!]!): Int!
  "根据 ids 还原数据"
  revertByIdsOperationRecord(ids: [String!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsOperationRecord(ids: [String!]!): Int!
}

`);
