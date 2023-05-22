import { defineGraphql } from "/lib/context.ts";

import * as langResolver from "./lang.resolver.ts";

defineGraphql(langResolver, /* GraphQL */ `

type LangModel {
  "ID"
  id: String!
  "编码"
  code: String!
  "名称"
  lbl: String!
  "备注"
  rem: String!
  "启用"
  is_enabled: Int!
  "启用"
  is_enabled_lbl: String
  "排序"
  order_by: Int!
}
type LangFieldComment {
  "编码"
  code: String!
  "名称"
  lbl: String!
  "备注"
  rem: String!
  "启用"
  is_enabled: String!
  "启用"
  is_enabled_lbl: String!
  "排序"
  order_by: String!
}
input LangInput {
  ""
  id: String
  "编码"
  code: String
  "名称"
  lbl: String
  "备注"
  rem: String
  "启用"
  is_enabled: Int
  "启用"
  is_enabled_lbl: String
  "排序"
  order_by: Int
}
input LangSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [String]
  "String"
  id: String
  "编码"
  code: String
  code_like: String
  "名称"
  lbl: String
  lbl_like: String
  "备注"
  rem: String
  rem_like: String
  "启用"
  is_enabled: [Int!]
  "排序"
  order_by: [Int!]
}
type Query {
  "根据条件查找据数总数"
  findCountLang(search: LangSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllLang(search: LangSearch, page: PageInput, sort: [SortInput!]): [LangModel!]!
  "获取字段对应的名称"
  getFieldCommentsLang: LangFieldComment!
  "根据条件查找第一条数据"
  findOneLang(search: LangSearch, sort: [SortInput!]): LangModel
  "根据id查找一条数据"
  findByIdLang(id: String!): LangModel
  "查找order_by字段的最大值"
  findLastOrderByLang: Int!
}
type Mutation {
  "创建一条数据"
  createLang(model: LangInput!): String!
  "根据id修改一条数据"
  updateByIdLang(id: String!, model: LangInput!): String!
  "根据 ids 删除数据"
  deleteByIdsLang(ids: [String!]!): Int!
  "根据 ids 还原数据"
  revertByIdsLang(ids: [String!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsLang(ids: [String!]!): Int!
}

`);
