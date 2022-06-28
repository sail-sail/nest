import { defineGraphql } from "/lib/context.ts";
import * as resolvers from "./permit.resolver.ts";

defineGraphql(resolvers, /* GraphQL */ `type PermitModel {
  "ID"
  id: ID!
  "菜单ID"
  menu_id: ID!
  "菜单名称"
  _menu_id: String
  "名称"
  lbl: String!
  "备注"
  rem: String!
}
input PermitInput {
  ""
  id: ID
  "菜单ID"
  menu_id: ID
  "菜单名称"
  _menu_id: String
  "名称"
  lbl: String
  "备注"
  rem: String
}
input PermitSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [ID]
  "ID"
  id: ID
  "菜单"
  menu_id: [String]
  _menu_id: [String]
  "名称"
  lbl: String
  lblLike: String
  "备注"
  rem: String
  remLike: String
}
type Query {
  "根据条件查找据数总数"
  findCountPermit(search: PermitSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllPermit(search: PermitSearch, page: PageInput, sort: [SortInput]): [PermitModel!]!
  "根据搜索条件导出"
  exportExcelPermit(search: PermitSearch, sort: [SortInput]): String!
  "根据条件查找第一条数据"
  findOnePermit(search: PermitSearch): PermitModel
  "根据id查找一条数据"
  findByIdPermit(id: ID!): PermitModel
}
type Mutation {
  "创建一条数据"
  createPermit(model: PermitInput!): ID!
  "根据id修改一条数据"
  updateByIdPermit(id: ID!, model: PermitInput!): ID!
  "导入文件"
  importFilePermit(id: ID!): String
  "根据ids删除数据"
  deleteByIdsPermit(ids: [ID]!): Int!
  "根据ids还原数据"
  revertByIdsPermit(ids: [ID]!): Int!
}
`);
