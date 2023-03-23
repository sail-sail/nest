import { defineGraphql } from "/lib/context.ts";

import * as deptResolver from "./dept.resolver.ts";

defineGraphql(deptResolver, /* GraphQL */ `

type DeptModel {
  "ID"
  id: ID!
  "父部门"
  parent_id: ID!
  "父部门"
  _parent_id: String
  "名称"
  lbl: String!
  "排序"
  order_by: Int!
  "启用"
  is_enabled: Int!
  "启用"
  _is_enabled: String
  "备注"
  rem: String!
  "锁定"
  is_locked: Int!
  "锁定"
  _is_locked: String
  "创建人"
  create_usr_id: ID!
  "创建人"
  _create_usr_id: String
  "创建时间"
  create_time: String
  "更新人"
  update_usr_id: ID!
  "更新人"
  _update_usr_id: String
  "更新时间"
  update_time: String
}
type DeptFieldComment {
  "父部门"
  parent_id: String!
  "父部门"
  _parent_id: String!
  "名称"
  lbl: String!
  "排序"
  order_by: String!
  "启用"
  is_enabled: String!
  "启用"
  _is_enabled: String!
  "备注"
  rem: String!
  "锁定"
  is_locked: String!
  "锁定"
  _is_locked: String!
  "创建人"
  create_usr_id: String!
  "创建人"
  _create_usr_id: String!
  "创建时间"
  create_time: String!
  "更新人"
  update_usr_id: String!
  "更新人"
  _update_usr_id: String!
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
  _parent_id: String
  "名称"
  lbl: String
  "排序"
  order_by: Int
  "启用"
  is_enabled: Int
  "启用"
  _is_enabled: String
  "备注"
  rem: String
  "锁定"
  is_locked: Int
  "锁定"
  _is_locked: String
  "创建人"
  create_usr_id: ID
  "创建人"
  _create_usr_id: String
  "创建时间"
  create_time: String
  "更新人"
  update_usr_id: ID
  "更新人"
  _update_usr_id: String
  "更新时间"
  update_time: String
}
input DeptSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [ID]
  "ID"
  id: ID
  "父部门"
  parent_id: [String]
  _parent_id: [String]
  "名称"
  lbl: String
  lblLike: String
  "排序"
  order_by: [Int]
  "启用"
  is_enabled: [Int]
  "备注"
  rem: String
  remLike: String
  "锁定"
  is_locked: [Int]
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
  findCountDept(search: DeptSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllDept(search: DeptSearch, page: PageInput, sort: [SortInput]): [DeptModel!]!
  "获取字段对应的名称"
  getFieldCommentsDept: DeptFieldComment!
  "根据条件查找第一条数据"
  findOneDept(search: DeptSearch, sort: [SortInput]): DeptModel
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
  "导入文件"
  importFileDept(id: ID!): String
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
