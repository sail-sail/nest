import { defineGraphql } from "/lib/context.ts";

import * as deptResolver from "./dept.resolver.ts";

defineGraphql(deptResolver, /* GraphQL */ `

type DeptModel {
  "ID"
  id: ID!
  "父部门"
  parent_id: ID!
  "父部门"
  parent_id_lbl: String
  "名称"
  lbl: String!
  "排序"
  order_by: Int!
  "启用"
  is_enabled: Int!
  "启用"
  is_enabled_lbl: String
  "备注"
  rem: String!
  "锁定"
  is_locked: Int!
  "锁定"
  is_locked_lbl: String
  "创建人"
  create_usr_id: ID!
  "创建人"
  create_usr_id_lbl: String
  "创建时间"
  create_time: NaiveDateTime
  "创建时间"
  create_time_lbl: String
  "更新人"
  update_usr_id: ID!
  "更新人"
  update_usr_id_lbl: String
  "更新时间"
  update_time: NaiveDateTime
  "更新时间"
  update_time_lbl: String
}
type DeptFieldComment {
  "父部门"
  parent_id: String!
  "父部门"
  parent_id_lbl: String!
  "名称"
  lbl: String!
  "排序"
  order_by: String!
  "启用"
  is_enabled: String!
  "启用"
  is_enabled_lbl: String!
  "备注"
  rem: String!
  "锁定"
  is_locked: String!
  "锁定"
  is_locked_lbl: String!
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
input DeptInput {
  "租户ID"
  tenant_id: String
  ""
  id: ID
  "父部门"
  parent_id: ID
  "父部门"
  parent_id_lbl: String
  "名称"
  lbl: String
  "排序"
  order_by: Int
  "启用"
  is_enabled: Int
  "启用"
  is_enabled_lbl: String
  "备注"
  rem: String
  "锁定"
  is_locked: Int
  "锁定"
  is_locked_lbl: String
  "创建人"
  create_usr_id: ID
  "创建人"
  create_usr_id_lbl: String
  "创建时间"
  create_time: NaiveDateTime
  "更新人"
  update_usr_id: ID
  "更新人"
  update_usr_id_lbl: String
  "更新时间"
  update_time: NaiveDateTime
}
input DeptSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [ID]
  "ID"
  id: ID
  "父部门"
  parent_id: [String!]
  parent_id_lbl: [String!]
  parent_id_is_null: Boolean
  "名称"
  lbl: String
  lbl_like: String
  "排序"
  order_by: [Int!]
  "启用"
  is_enabled: [Int!]
  "备注"
  rem: String
  rem_like: String
  "锁定"
  is_locked: [Int!]
  "创建人"
  create_usr_id: [String!]
  create_usr_id_lbl: [String!]
  create_usr_id_is_null: Boolean
  "创建时间"
  create_time: [NaiveDateTime!]
  create_time_lbl: String
  "更新人"
  update_usr_id: [String!]
  update_usr_id_lbl: [String!]
  update_usr_id_is_null: Boolean
  "更新时间"
  update_time: [NaiveDateTime!]
  update_time_lbl: String
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
  findByIdDept(id: ID!): DeptModel
  "查找order_by字段的最大值"
  findLastOrderByDept: Int!
}
type Mutation {
  "创建一条数据"
  createDept(model: DeptInput!): ID!
  "根据id修改一条数据"
  updateByIdDept(id: ID!, model: DeptInput!): ID!
  "批量导入"
  importModelsDept(models: [DeptInput!]!): String
  "根据 ids 删除数据"
  deleteByIdsDept(ids: [ID!]!): Int!
  "根据 ids 锁定或者解锁数据"
  lockByIdsDept(ids: [ID!]!, is_locked: Int!): Int!
  "根据 ids 还原数据"
  revertByIdsDept(ids: [ID!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsDept(ids: [ID!]!): Int!
}

`);
