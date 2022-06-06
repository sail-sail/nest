import { defineGraphql } from "/lib/context.ts";
import * as resolvers from "./menu.resolver.ts";

defineGraphql(resolvers, /* GraphQL */ `type FindAllMenu {
  ""
  id: ID
  "类型ID"
  type: String
  "类型名称"
  _type: String
  "父菜单ID"
  menu_id: ID
  "父菜单名称"
  _menu_id: String
  "名称"
  lbl: String
  "路由"
  route_path: String
  "参数"
  route_query: JSON
  "启用ID"
  is_enabled: Int
  "启用名称"
  _is_enabled: String
  "排序"
  order_by: Int
  "备注"
  rem: String
}
input MenuInput {
  ""
  id: ID
  "类型ID"
  type: String
  "类型名称"
  _type: String
  "父菜单ID"
  menu_id: ID
  "父菜单名称"
  _menu_id: String
  "名称"
  lbl: String
  "路由"
  route_path: String
  "参数"
  route_query: JSON
  "启用ID"
  is_enabled: Int
  "启用名称"
  _is_enabled: String
  "排序"
  order_by: Int
  "备注"
  rem: String
}
input MenuSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [ID]
  "ID"
  id: ID
  "类型"
  type: [String]
  "父菜单"
  menu_id: [String]
  _menu_id: [String]
  "名称"
  lbl: String
  lblLike: String
  "路由"
  route_path: String
  route_pathLike: String
  "参数"
  route_query: String
  route_queryLike: String
  "启用"
  is_enabled: [Int]
  "排序"
  order_by: [Int]
  "备注"
  rem: String
  remLike: String
}
type Query {
  "根据条件查找据数总数"
  findCountMenu(search: MenuSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllMenu(search: MenuSearch, page: PageInput, sort: [SortInput]): [FindAllMenu]!
  "根据搜索条件导出"
  exportExcelMenu(search: MenuSearch, sort: [SortInput]): String!
  "根据条件查找第一条数据"
  findOneMenu(search: MenuSearch): FindAllMenu
  "根据id查找一条数据"
  findByIdMenu(id: ID!): FindAllMenu
  "查找order_by字段的最大值"
  findLastOrderByMenu: Int!
}
type Mutation {
  "创建一条数据"
  createMenu(model: MenuInput!): ID!
  "根据id修改一条数据"
  updateByIdMenu(id: ID!, model: MenuInput!): ID!
  "导入文件"
  importFileMenu(id: ID!): String
  "根据ids删除数据"
  deleteByIdsMenu(ids: [ID]!): Int!
  "根据ids还原数据"
  revertByIdsMenu(ids: [ID]!): Int!
}
`);
