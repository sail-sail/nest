import { defineGraphql } from "/lib/context.ts";

import {
  _internals as optionResolver,
} from "./option.resolver.ts";

defineGraphql(optionResolver, /* GraphQL */ `

type OptionModel {
  "ID"
  id: ID!
  "名称"
  lbl: String!
  "键"
  ky: String!
  "值"
  val: String!
  "启用ID"
  is_enabled: Int!
  "启用名称"
  _is_enabled: String
  "备注"
  rem: String!
}
input OptionInput {
  "租户ID"
  tenant_id: String
  ""
  id: ID
  "名称"
  lbl: String
  "键"
  ky: String
  "值"
  val: String
  "启用ID"
  is_enabled: Int
  "启用名称"
  _is_enabled: String
  "备注"
  rem: String
}
input OptionSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [ID]
  "ID"
  id: ID
  "名称"
  lbl: String
  lblLike: String
  "键"
  ky: String
  kyLike: String
  "值"
  val: String
  valLike: String
  "启用"
  is_enabled: [Int]
  "备注"
  rem: String
  remLike: String
}
type Query {
  "根据条件查找据数总数"
  findCountOption(search: OptionSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllOption(search: OptionSearch, page: PageInput, sort: [SortInput]): [OptionModel!]!
  "根据搜索条件导出"
  exportExcelOption(search: OptionSearch, sort: [SortInput]): String!
  "根据条件查找第一条数据"
  findOneOption(search: OptionSearch): OptionModel
  "根据id查找一条数据"
  findByIdOption(id: ID!): OptionModel
}
type Mutation {
  "创建一条数据"
  createOption(model: OptionInput!): ID!
  "根据id修改一条数据"
  updateByIdOption(id: ID!, model: OptionInput!): ID!
  "导入文件"
  importFileOption(id: ID!): String
  "根据 ids 删除数据"
  deleteByIdsOption(ids: [ID!]!): Int!
  "根据 ids 还原数据"
  revertByIdsOption(ids: [ID!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsOption(ids: [ID!]!): Int!
}

`);
