import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./dept.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar DeptId


type DeptModel {
  "ID"
  id: DeptId!
  "父部门"
  parent_id: DeptId!
  "父部门"
  parent_id_lbl: String
  "名称"
  lbl: String!
  "部门负责人"
  usr_ids: [UsrId!]
  "部门负责人"
  usr_ids_lbl: [String!]
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
  create_usr_id_lbl: String
  "创建时间"
  create_time: NaiveDateTime
  "创建时间"
  create_time_lbl: String!
  "更新人"
  update_usr_id: UsrId!
  "更新人"
  update_usr_id_lbl: String
  "更新时间"
  update_time: NaiveDateTime
  "更新时间"
  update_time_lbl: String!
  "是否已删除"
  is_deleted: Int!
}
type DeptFieldComment {
  "ID"
  id: String!
  "父部门"
  parent_id: String!
  "父部门"
  parent_id_lbl: String!
  "名称"
  lbl: String!
  "部门负责人"
  usr_ids: String!
  "部门负责人"
  usr_ids_lbl: String!
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
input DeptInput {
  ""
  id: DeptId
  "父部门"
  parent_id: DeptId
  "父部门"
  parent_id_lbl: String
  "名称"
  lbl: String
  "部门负责人"
  usr_ids: [UsrId!]
  "部门负责人"
  usr_ids_lbl: [String!]
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
  create_usr_id: UsrId
  "创建人"
  create_usr_id_lbl: String
  "创建时间"
  create_time: NaiveDateTime
  "创建时间"
  create_time_lbl: String
  "更新人"
  update_usr_id: UsrId
  "更新人"
  update_usr_id_lbl: String
  "更新时间"
  update_time: NaiveDateTime
  "更新时间"
  update_time_lbl: String
}
input DeptSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [DeptId!]
  "ID"
  id: DeptId
  "父部门"
  parent_id: [DeptId!]
  parent_id_is_null: Boolean
  "名称"
  lbl: String
  lbl_like: String
  "部门负责人"
  usr_ids: [UsrId!]
  usr_ids_is_null: Boolean
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
  findCountDept(search: DeptSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllDept(search: DeptSearch, page: PageInput, sort: [SortInput!]): [DeptModel!]!
  "获取字段对应的名称"
  getFieldCommentsDept: DeptFieldComment!
  "根据条件查找第一条数据"
  findOneDept(search: DeptSearch, sort: [SortInput!]): DeptModel
  "根据id查找一条数据"
  findByIdDept(id: DeptId!): DeptModel
  "查找order_by字段的最大值"
  findLastOrderByDept: Int!
}
type Mutation {
  "创建一条数据"
  createDept(model: DeptInput!, unique_type: UniqueType): DeptId!
  "根据id修改一条数据"
  updateByIdDept(id: DeptId!, model: DeptInput!): DeptId!
  "根据 ids 删除数据"
  deleteByIdsDept(ids: [DeptId!]!): Int!
  "根据 ids 启用或者禁用数据"
  enableByIdsDept(ids: [DeptId!]!, is_enabled: Int!): Int!
  "根据 ids 锁定或者解锁数据"
  lockByIdsDept(ids: [DeptId!]!, is_locked: Int!): Int!
  "根据 ids 还原数据"
  revertByIdsDept(ids: [DeptId!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsDept(ids: [DeptId!]!): Int!
}

`);
