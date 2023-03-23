import { defineGraphql } from "/lib/context.ts";

import * as dict_detailResolver from "./dict_detail.resolver.ts";

defineGraphql(dict_detailResolver, /* GraphQL */ `

type Dict_DetailModel {
  "ID"
  id: ID!
  "系统字典"
  dict_id: ID!
  "系统字典"
  _dict_id: String
  "名称"
  lbl: String!
  "值"
  val: String!
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
}
type Dict_DetailFieldComment {
  "系统字典"
  dict_id: String!
  "系统字典"
  _dict_id: String!
  "名称"
  lbl: String!
  "值"
  val: String!
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
}
input Dict_DetailInput {
  "租户ID"
  tenant_id: String
  ""
  id: ID
  "系统字典"
  dict_id: ID
  "系统字典"
  _dict_id: String
  "名称"
  lbl: String
  "值"
  val: String
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
}
input Dict_DetailSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [ID]
  "ID"
  id: ID
  "系统字典"
  dict_id: [String]
  _dict_id: [String]
  "名称"
  lbl: String
  lblLike: String
  "值"
  val: String
  valLike: String
  "排序"
  order_by: [Int]
  "启用"
  is_enabled: [Int]
  "备注"
  rem: String
  remLike: String
  "锁定"
  is_locked: [Int]
}
type Query {
  "根据条件查找据数总数"
  findCountDict_detail(search: Dict_DetailSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllDict_detail(search: Dict_DetailSearch, page: PageInput, sort: [SortInput]): [Dict_DetailModel!]!
  "获取字段对应的名称"
  getFieldCommentsDict_detail: Dict_DetailFieldComment!
  "根据条件查找第一条数据"
  findOneDict_detail(search: Dict_DetailSearch, sort: [SortInput]): Dict_DetailModel
  "根据id查找一条数据"
  findByIdDict_detail(id: ID!): Dict_DetailModel
  "查找order_by字段的最大值"
  findLastOrderByDict_detail: Int!
}
type Mutation {
  "创建一条数据"
  createDict_detail(model: Dict_DetailInput!): ID!
  "根据id修改一条数据"
  updateByIdDict_detail(id: ID!, model: Dict_DetailInput!): ID!
  "导入文件"
  importFileDict_detail(id: ID!): String
  "根据 ids 删除数据"
  deleteByIdsDict_detail(ids: [ID!]!): Int!
  "根据 ids 锁定或者解锁数据"
  lockByIdsDict_detail(ids: [ID!]!, is_locked: Int!): Int!
  "根据 ids 还原数据"
  revertByIdsDict_detail(ids: [ID!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsDict_detail(ids: [ID!]!): Int!
}

`);
