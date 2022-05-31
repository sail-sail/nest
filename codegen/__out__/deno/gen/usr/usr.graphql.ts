import { defineGraphql } from "/lib/context.ts";
import * as resolvers from "./usr.resolver.ts";

defineGraphql(resolvers, /* GraphQL */ `type FindAllUsr {
  ""
  id: ID
  "名称"
  lbl: String
  "用户名"
  username: String
  "密码"
  password: String
  "启用ID"
  is_enabled: Int
  "启用名称"
  _is_enabled: String
  "角色ID"
  role_ids: [ID]
  "角色名称"
  _role_ids: [String]
  "备注"
  rem: String
}
input UsrInput {
  ""
  id: ID
  "名称"
  lbl: String
  "用户名"
  username: String
  "密码"
  password: String
  "启用ID"
  is_enabled: Int
  "启用名称"
  _is_enabled: String
  "角色ID"
  role_ids: [ID]
  "角色名称"
  _role_ids: [String]
  "备注"
  rem: String
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
  "密码"
  password: String
  passwordLike: String
  "启用"
  is_enabled: [Int]
  "角色"
  role_ids: [String]
  _role_ids: [String]
  "备注"
  rem: String
  remLike: String
}
type Query {
  "根据条件查找据数总数"
  findCountUsr(search: UsrSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllUsr(search: UsrSearch, page: PageInput, sort: [SortInput]): [FindAllUsr]!
  "根据搜索条件导出"
  exportExcelUsr(search: UsrSearch, sort: [SortInput]): String!
  "根据条件查找第一条数据"
  findOneUsr(search: UsrSearch): FindAllUsr
  "根据id查找一条数据"
  findByIdUsr(id: ID!): FindAllUsr
}
type Mutation {
  "创建一条数据"
  createUsr(model: UsrInput!): ID!
  "根据id修改一条数据"
  updateByIdUsr(id: ID!, model: UsrInput!): ID!
  "导入文件"
  importFileUsr(id: ID!): String
  "根据ids删除数据"
  deleteByIdsUsr(ids: [ID]!): Int!
  "根据ids还原数据"
  revertByIdsUsr(ids: [ID]!): Int!
}
`);
