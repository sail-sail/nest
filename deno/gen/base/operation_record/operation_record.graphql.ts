import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./operation_record.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar OperationRecordId


type OperationRecordModel {
  "ID"
  id: OperationRecordId!
  "模块"
  module: String!
  "模块名称"
  module_lbl: String!
  "方法"
  method: String!
  "方法名称"
  method_lbl: String!
  "操作"
  lbl: String!
  "耗时(毫秒)"
  time: Int!
  "操作前数据"
  old_data: String
  "操作后数据"
  new_data: String
  "创建人"
  create_usr_id: UsrId!
  "创建人"
  create_usr_id_lbl: String
  "创建时间"
  create_time: NaiveDateTime
  "创建时间"
  create_time_lbl: String!
  "是否已删除"
  is_deleted: Int!
}
type OperationRecordFieldComment {
  "ID"
  id: String!
  "模块"
  module: String!
  "模块名称"
  module_lbl: String!
  "方法"
  method: String!
  "方法名称"
  method_lbl: String!
  "操作"
  lbl: String!
  "耗时(毫秒)"
  time: String!
  "操作前数据"
  old_data: String!
  "操作后数据"
  new_data: String!
  "创建人"
  create_usr_id: String!
  "创建人"
  create_usr_id_lbl: String!
  "创建时间"
  create_time: String!
  "创建时间"
  create_time_lbl: String!
}
input OperationRecordInput {
  "ID"
  id: OperationRecordId
  "模块"
  module: String
  "模块名称"
  module_lbl: String
  "方法"
  method: String
  "方法名称"
  method_lbl: String
  "操作"
  lbl: String
  "耗时(毫秒)"
  time: Int
  "操作前数据"
  old_data: String
  "操作后数据"
  new_data: String
  "创建人"
  create_usr_id: UsrId
  "创建人"
  create_usr_id_lbl: String
  "创建时间"
  create_time: NaiveDateTime
  "创建时间"
  create_time_lbl: String
}
input OperationRecordSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [OperationRecordId!]
  "ID"
  id: OperationRecordId
  "模块"
  module: String
  module_like: String
  "模块名称"
  module_lbl: String
  module_lbl_like: String
  "方法"
  method: String
  method_like: String
  "方法名称"
  method_lbl: String
  method_lbl_like: String
  "操作"
  lbl: String
  lbl_like: String
  "耗时(毫秒)"
  time: [Int!]
  "操作前数据"
  old_data: String
  old_data_like: String
  "操作后数据"
  new_data: String
  new_data_like: String
  "创建人"
  create_usr_id: [UsrId!]
  create_usr_id_is_null: Boolean
  "创建时间"
  create_time: [NaiveDateTime!]
}
type Query {
  "根据条件查找操作记录总数"
  findCountOperationRecord(search: OperationRecordSearch): Int!
  "根据搜索条件和分页查找操作记录列表"
  findAllOperationRecord(search: OperationRecordSearch, page: PageInput, sort: [SortInput!]): [OperationRecordModel!]!
  "获取操作记录字段注释"
  getFieldCommentsOperationRecord: OperationRecordFieldComment!
  "根据条件查找第一个操作记录"
  findOneOperationRecord(search: OperationRecordSearch, sort: [SortInput!]): OperationRecordModel
  "根据 id 查找操作记录"
  findByIdOperationRecord(id: OperationRecordId!): OperationRecordModel
}
type Mutation {
  "根据 ids 删除操作记录"
  deleteByIdsOperationRecord(ids: [OperationRecordId!]!): Int!
  "根据 ids 还原操作记录"
  revertByIdsOperationRecord(ids: [OperationRecordId!]!): Int!
  "根据 ids 彻底删除操作记录"
  forceDeleteByIdsOperationRecord(ids: [OperationRecordId!]!): Int!
}

`);
