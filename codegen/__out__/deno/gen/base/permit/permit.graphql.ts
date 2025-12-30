import { defineGraphql } from "/lib/context.ts";

import type { } from "./permit.model.ts";
import * as resolver from "./permit.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar PermitId

type PermitModel {
  "ID"
  id: PermitId!
  "菜单"
  menu_id: MenuId!
  "菜单"
  menu_id_lbl: String!
  "编码"
  code: String!
  "名称"
  lbl: String!
  "排序"
  order_by: Int!
  "备注"
  rem: String!
  "系统字段"
  is_sys: Int!
}
type PermitFieldComment {
  "ID"
  id: String!
  "菜单"
  menu_id: String!
  "菜单"
  menu_id_lbl: String!
  "编码"
  code: String!
  "名称"
  lbl: String!
  "排序"
  order_by: String!
  "备注"
  rem: String!
}
input PermitInput {
  "ID"
  id: PermitId
  "菜单"
  menu_id: MenuId
  "菜单"
  menu_id_lbl: String
  "编码"
  code: String
  "名称"
  lbl: String
  "排序"
  order_by: Int
  "备注"
  rem: String
}
input PermitSearch {
  "ID列表"
  ids: [PermitId!]
  "ID"
  id: PermitId
  "菜单"
  menu_id: [MenuId!]
  "菜单"
  menu_id_is_null: Boolean
  "菜单"
  menu_id_lbl: [String!]
  "菜单"
  menu_id_lbl_like: String
  "编码"
  code: String
  code_like: String
  "名称"
  lbl: String
  lbl_like: String
}
type Query {
  "根据条件查找按钮权限总数"
  findCountPermit(search: PermitSearch): Int!
  "根据搜索条件和分页查找按钮权限列表"
  findAllPermit(search: PermitSearch, page: PageInput, sort: [SortInput!]): [PermitModel!]!
  "获取按钮权限字段注释"
  getFieldCommentsPermit: PermitFieldComment!
  "根据条件查找第一个按钮权限"
  findOnePermit(search: PermitSearch, sort: [SortInput!]): PermitModel
  "根据 id 查找按钮权限"
  findByIdPermit(id: PermitId!): PermitModel
  "根据 ids 查找按钮权限"
  findByIdsPermit(ids: [PermitId!]!): [PermitModel]!
  "查找按钮权限 order_by 字段的最大值"
  findLastOrderByPermit(search: PermitSearch): Int!
}
type Mutation {
  "根据 id 修改按钮权限"
  updateByIdPermit(id: PermitId!, input: PermitInput!): PermitId!
}

`);
