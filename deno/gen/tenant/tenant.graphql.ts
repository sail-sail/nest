import { defineGraphql } from "/lib/context.ts";
import * as resolvers from "./tenant.resolver.ts";

defineGraphql(resolvers, /* GraphQL */ `type TenantModel {
  "ID"
  id: ID!
  "名称"
  lbl: String!
  "域名绑定"
  host: String!
  "到期日"
  expiration: String
  "最大用户数"
  max_usr_num: Int!
  "启用ID"
  is_enabled: Int!
  "启用名称"
  _is_enabled: String
  "菜单ID"
  menu_ids: [ID]!
  "菜单名称"
  _menu_ids: [String]
  "排序"
  order_by: Int!
  "备注"
  rem: String!
}
input TenantInput {
  ""
  id: ID
  "名称"
  lbl: String
  "域名绑定"
  host: String
  "到期日"
  expiration: String
  "最大用户数"
  max_usr_num: Int
  "启用ID"
  is_enabled: Int
  "启用名称"
  _is_enabled: String
  "菜单ID"
  menu_ids: [ID]
  "菜单名称"
  _menu_ids: [String]
  "排序"
  order_by: Int
  "备注"
  rem: String
}
input TenantSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [ID]
  "ID"
  id: ID
  "名称"
  lbl: String
  lblLike: String
  "域名绑定"
  host: String
  hostLike: String
  "到期日"
  expiration: [String]
  "最大用户数"
  max_usr_num: [Int]
  "启用"
  is_enabled: [Int]
  "菜单"
  menu_ids: [String]
  _menu_ids: [String]
  "排序"
  order_by: [Int]
  "备注"
  rem: String
  remLike: String
}
type Query {
  "根据条件查找据数总数"
  findCountTenant(search: TenantSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllTenant(search: TenantSearch, page: PageInput, sort: [SortInput]): [TenantModel!]!
  "根据搜索条件导出"
  exportExcelTenant(search: TenantSearch, sort: [SortInput]): String!
  "根据条件查找第一条数据"
  findOneTenant(search: TenantSearch): TenantModel
  "根据id查找一条数据"
  findByIdTenant(id: ID!): TenantModel
  "查找order_by字段的最大值"
  findLastOrderByTenant: Int!
}
type Mutation {
  "创建一条数据"
  createTenant(model: TenantInput!): ID!
  "根据id修改一条数据"
  updateByIdTenant(id: ID!, model: TenantInput!): ID!
  "导入文件"
  importFileTenant(id: ID!): String
  "根据ids删除数据"
  deleteByIdsTenant(ids: [ID]!): Int!
  "根据ids还原数据"
  revertByIdsTenant(ids: [ID]!): Int!
}
`);
