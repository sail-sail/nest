import { defineGraphql } from "/lib/context.ts";

import * as roleResolver from "./role.resolver.ts";

defineGraphql(roleResolver, /* GraphQL */ `

type RoleModel {
  "ID"
  id: ID!
  "名称"
  lbl: String!
  "备注"
  rem: String!
  "启用"
  is_enabled: Int!
  "启用"
  _is_enabled: String
  "菜单"
  menu_ids: [ID!]
  "菜单"
  _menu_ids: [String!]
}
type RoleFieldComment {
  "名称"
  lbl: String!
  "备注"
  rem: String!
  "启用"
  is_enabled: String!
  "启用"
  _is_enabled: String!
  "菜单"
  menu_ids: String!
  "菜单"
  _menu_ids: String!
}
input RoleInput {
  "租户ID"
  tenant_id: String
  ""
  id: ID
  "名称"
  lbl: String
  "备注"
  rem: String
  "启用"
  is_enabled: Int
  "启用"
  _is_enabled: String
  "菜单"
  menu_ids: [ID!]
  "菜单"
  _menu_ids: [String!]
}
input RoleSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [ID]
  "ID"
  id: ID
  "名称"
  lbl: String
  lblLike: String
  "备注"
  rem: String
  remLike: String
  "启用"
  is_enabled: [Int]
  "菜单"
  menu_ids: [String]
  _menu_ids: [String]
}
type Query {
  "根据条件查找据数总数"
  findCountRole(search: RoleSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllRole(search: RoleSearch, page: PageInput, sort: [SortInput]): [RoleModel!]!
  "获取字段对应的名称"
  getFieldCommentsRole: RoleFieldComment!
  "根据条件查找第一条数据"
  findOneRole(search: RoleSearch, sort: [SortInput]): RoleModel
  "根据id查找一条数据"
  findByIdRole(id: ID!): RoleModel
}
type Mutation {
  "创建一条数据"
  createRole(model: RoleInput!): ID!
  "根据id修改一条数据"
  updateByIdRole(id: ID!, model: RoleInput!): ID!
  "批量导入"
  importModelsRole(models: [RoleInput!]!): String
  "根据 ids 删除数据"
  deleteByIdsRole(ids: [ID!]!): Int!
  "根据 ids 还原数据"
  revertByIdsRole(ids: [ID!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsRole(ids: [ID!]!): Int!
}

`);
