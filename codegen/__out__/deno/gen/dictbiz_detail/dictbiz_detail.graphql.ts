import { defineGraphql } from "/lib/context.ts";

import {
  _internals as dictbiz_detailResolver,
} from "./dictbiz_detail.resolver.ts";

defineGraphql(dictbiz_detailResolver, /* GraphQL */ `

type Dictbiz_DetailModel {
  "ID"
  id: ID!
  "业务字典ID"
  dictbiz_id: ID!
  "业务字典名称"
  _dictbiz_id: String
  "名称"
  lbl: String!
  "值"
  val: String!
  "排序"
  order_by: Int!
  "启用ID"
  is_enabled: Int!
  "启用名称"
  _is_enabled: String
  "备注"
  rem: String!
  "锁定ID"
  is_locked: Int!
  "锁定名称"
  _is_locked: String
}
input Dictbiz_DetailInput {
  "租户ID"
  tenant_id: String
  ""
  id: ID
  "业务字典ID"
  dictbiz_id: ID
  "业务字典名称"
  _dictbiz_id: String
  "名称"
  lbl: String
  "值"
  val: String
  "排序"
  order_by: Int
  "启用ID"
  is_enabled: Int
  "启用名称"
  _is_enabled: String
  "备注"
  rem: String
  "锁定ID"
  is_locked: Int
  "锁定名称"
  _is_locked: String
}
input Dictbiz_DetailSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [ID]
  "ID"
  id: ID
  "业务字典"
  dictbiz_id: [String]
  _dictbiz_id: [String]
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
  findCountDictbiz_detail(search: Dictbiz_DetailSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllDictbiz_detail(search: Dictbiz_DetailSearch, page: PageInput, sort: [SortInput]): [Dictbiz_DetailModel!]!
  "根据搜索条件导出"
  exportExcelDictbiz_detail(search: Dictbiz_DetailSearch, sort: [SortInput]): String!
  "根据条件查找第一条数据"
  findOneDictbiz_detail(search: Dictbiz_DetailSearch): Dictbiz_DetailModel
  "根据id查找一条数据"
  findByIdDictbiz_detail(id: ID!): Dictbiz_DetailModel
  "查找order_by字段的最大值"
  findLastOrderByDictbiz_detail: Int!
}
type Mutation {
  "创建一条数据"
  createDictbiz_detail(model: Dictbiz_DetailInput!): ID!
  "根据id修改一条数据"
  updateByIdDictbiz_detail(id: ID!, model: Dictbiz_DetailInput!): ID!
  "导入文件"
  importFileDictbiz_detail(id: ID!): String
  "根据 ids 删除数据"
  deleteByIdsDictbiz_detail(ids: [ID!]!): Int!
  "根据 ids 锁定或者解锁数据"
  lockByIdsDictbiz_detail(ids: [ID!]!, is_locked: Int!): Int!
  "根据 ids 还原数据"
  revertByIdsDictbiz_detail(ids: [ID!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsDictbiz_detail(ids: [ID!]!): Int!
}

`);
