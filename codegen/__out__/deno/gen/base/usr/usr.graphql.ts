import { defineGraphql } from "/lib/context.ts";

import * as usrResolver from "./usr.resolver.ts";

defineGraphql(usrResolver, /* GraphQL */ `

type UsrModel {
  "ID"
  id: ID!
  "名称"
  lbl: String!
  "用户名"
  username: String!
  "密码"
  password: String!
  "默认部门"
  default_dept_id: ID!
  "默认部门"
  _default_dept_id: String
  "启用"
  is_enabled: Int!
  "启用"
  _is_enabled: String
  "备注"
  rem: String!
  "拥有部门"
  dept_ids: [ID!]
  "拥有部门"
  _dept_ids: [String!]
  "锁定"
  is_locked: Int!
  "锁定"
  _is_locked: String
  "拥有角色"
  role_ids: [ID!]
  "拥有角色"
  _role_ids: [String!]
}
type UsrFieldComment {
  "名称"
  lbl: String!
  "用户名"
  username: String!
  "默认部门"
  default_dept_id: String!
  "默认部门"
  _default_dept_id: String!
  "启用"
  is_enabled: String!
  "启用"
  _is_enabled: String!
  "备注"
  rem: String!
  "拥有部门"
  dept_ids: String!
  "拥有部门"
  _dept_ids: String!
  "锁定"
  is_locked: String!
  "锁定"
  _is_locked: String!
  "拥有角色"
  role_ids: String!
  "拥有角色"
  _role_ids: String!
}
input UsrInput {
  "租户ID"
  tenant_id: String
  ""
  id: ID
  "名称"
  lbl: String
  "用户名"
  username: String
  "密码"
  password: String
  "默认部门"
  default_dept_id: ID
  "默认部门"
  _default_dept_id: String
  "启用"
  is_enabled: Int
  "启用"
  _is_enabled: String
  "备注"
  rem: String
  "拥有部门"
  dept_ids: [ID!]
  "拥有部门"
  _dept_ids: [String!]
  "锁定"
  is_locked: Int
  "锁定"
  _is_locked: String
  "拥有角色"
  role_ids: [ID!]
  "拥有角色"
  _role_ids: [String!]
}
input UsrSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [ID]
  "ID"
  id: ID
  "名称"
  lbl: String
  lblLike: String
  "用户名"
  username: String
  usernameLike: String
  "默认部门"
  default_dept_id: [String]
  _default_dept_id: [String]
  "启用"
  is_enabled: [Int]
  "备注"
  rem: String
  remLike: String
  "拥有部门"
  dept_ids: [String]
  _dept_ids: [String]
  "锁定"
  is_locked: [Int]
  "拥有角色"
  role_ids: [String]
  _role_ids: [String]
}
type Query {
  "根据条件查找据数总数"
  findCountUsr(search: UsrSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllUsr(search: UsrSearch, page: PageInput, sort: [SortInput]): [UsrModel!]!
  "获取字段对应的名称"
  getFieldCommentsUsr: UsrFieldComment!
  "根据条件查找第一条数据"
  findOneUsr(search: UsrSearch, sort: [SortInput]): UsrModel
  "根据id查找一条数据"
  findByIdUsr(id: ID!): UsrModel
}
type Mutation {
  "创建一条数据"
  createUsr(model: UsrInput!): ID!
  "根据id修改一条数据"
  updateByIdUsr(id: ID!, model: UsrInput!): ID!
  "批量导入"
  importModelsUsr(models: [UsrInput!]!): String
  "根据 ids 删除数据"
  deleteByIdsUsr(ids: [ID!]!): Int!
  "根据 ids 锁定或者解锁数据"
  lockByIdsUsr(ids: [ID!]!, is_locked: Int!): Int!
  "根据 ids 还原数据"
  revertByIdsUsr(ids: [ID!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsUsr(ids: [ID!]!): Int!
}

`);
