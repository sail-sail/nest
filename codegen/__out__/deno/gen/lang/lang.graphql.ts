import { defineGraphql } from "/lib/context.ts";

import * as langResolver from "./lang.resolver.ts";

defineGraphql(langResolver, /* GraphQL */ `

type LangModel {
  "ID"
  id: ID!
  "编码"
  code: String!
  "名称"
  lbl: String!
  "备注"
  rem: String!
  "启用"
  is_enabled: Int!
  "启用"
  _is_enabled: String
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
  _is_enabled: String!
  "排序"
  order_by: String!
}
input LangInput {
  "租户ID"
  tenant_id: String
  ""
  id: ID
  "编码"
  code: String
  "名称"
  lbl: String
  "备注"
  rem: String
  "启用"
  is_enabled: Int
  "启用"
  _is_enabled: String
  "排序"
  order_by: Int
}
input LangSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [ID]
  "ID"
  id: ID
  "编码"
  code: String
  codeLike: String
  "名称"
  lbl: String
  lblLike: String
  "备注"
  rem: String
  remLike: String
  "启用"
  is_enabled: [Int]
  "排序"
  order_by: [Int]
}
type Query {
  "根据条件查找据数总数"
  findCountLang(search: LangSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllLang(search: LangSearch, page: PageInput, sort: [SortInput]): [LangModel!]!
  "获取字段对应的名称"
  getFieldCommentsLang: LangFieldComment!
  "根据条件查找第一条数据"
  findOneLang(search: LangSearch): LangModel
  "根据id查找一条数据"
  findByIdLang(id: ID!): LangModel
  "查找order_by字段的最大值"
  findLastOrderByLang: Int!
}
type Mutation {
  "创建一条数据"
  createLang(model: LangInput!): ID!
  "根据id修改一条数据"
  updateByIdLang(id: ID!, model: LangInput!): ID!
  "导入文件"
  importFileLang(id: ID!): String
  "根据 ids 删除数据"
  deleteByIdsLang(ids: [ID!]!): Int!
  "根据 ids 还原数据"
  revertByIdsLang(ids: [ID!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsLang(ids: [ID!]!): Int!
}

`);
