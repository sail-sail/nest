import { defineGraphql } from "/lib/context.ts";

import type { } from "./field_permit.model.ts";
import * as resolver from "./field_permit.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar FieldPermitId

type FieldPermitModel {
  "ID"
  id: FieldPermitId!
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
type FieldPermitFieldComment {
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
input FieldPermitInput {
  "ID"
  id: FieldPermitId
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
input FieldPermitSearch {
  "ID列表"
  ids: [FieldPermitId!]
  "ID"
  id: FieldPermitId
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
  "根据条件查找字段权限总数"
  findCountFieldPermit(search: FieldPermitSearch): Int!
  "根据搜索条件和分页查找字段权限列表"
  findAllFieldPermit(search: FieldPermitSearch, page: PageInput, sort: [SortInput!]): [FieldPermitModel!]!
  "获取字段权限字段注释"
  getFieldCommentsFieldPermit: FieldPermitFieldComment!
  "根据条件查找第一个字段权限"
  findOneFieldPermit(search: FieldPermitSearch, sort: [SortInput!]): FieldPermitModel
  "根据 id 查找字段权限"
  findByIdFieldPermit(id: FieldPermitId!): FieldPermitModel
  "根据 ids 查找字段权限"
  findByIdsFieldPermit(ids: [FieldPermitId!]!): [FieldPermitModel]!
  "查找字段权限 order_by 字段的最大值"
  findLastOrderByFieldPermit: Int!
}
type Mutation {
  "根据 id 修改字段权限"
  updateByIdFieldPermit(id: FieldPermitId!, input: FieldPermitInput!): FieldPermitId!
}

`);
