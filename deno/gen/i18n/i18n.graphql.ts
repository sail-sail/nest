import { defineGraphql } from "/lib/context.ts";

import * as i18nResolver from "./i18n.resolver.ts";

defineGraphql(i18nResolver, /* GraphQL */ `

type I18nModel {
  "ID"
  id: ID!
  "语言"
  lang_id: ID!
  "语言"
  _lang_id: String
  "菜单"
  menu_id: ID!
  "菜单"
  _menu_id: String
  "编码"
  code: String!
  "名称"
  lbl: String!
  "备注"
  rem: String!
}
type I18nFieldComment {
  "语言"
  lang_id: String!
  "语言"
  _lang_id: String!
  "菜单"
  menu_id: String!
  "菜单"
  _menu_id: String!
  "编码"
  code: String!
  "名称"
  lbl: String!
  "备注"
  rem: String!
}
input I18nInput {
  "租户ID"
  tenant_id: String
  ""
  id: ID
  "语言"
  lang_id: ID
  "语言"
  _lang_id: String
  "菜单"
  menu_id: ID
  "菜单"
  _menu_id: String
  "编码"
  code: String
  "名称"
  lbl: String
  "备注"
  rem: String
}
input I18nSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [ID]
  "ID"
  id: ID
  "语言"
  lang_id: [String]
  _lang_id: [String]
  "菜单"
  menu_id: [String]
  _menu_id: [String]
  "编码"
  code: String
  codeLike: String
  "名称"
  lbl: String
  lblLike: String
  "备注"
  rem: String
  remLike: String
}
type Query {
  "根据条件查找据数总数"
  findCountI18n(search: I18nSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllI18n(search: I18nSearch, page: PageInput, sort: [SortInput]): [I18nModel!]!
  "获取字段对应的名称"
  getFieldCommentsI18n: I18nFieldComment!
  "根据条件查找第一条数据"
  findOneI18n(search: I18nSearch): I18nModel
  "根据id查找一条数据"
  findByIdI18n(id: ID!): I18nModel
}
type Mutation {
  "创建一条数据"
  createI18n(model: I18nInput!): ID!
  "根据id修改一条数据"
  updateByIdI18n(id: ID!, model: I18nInput!): ID!
  "导入文件"
  importFileI18n(id: ID!): String
  "根据 ids 删除数据"
  deleteByIdsI18n(ids: [ID!]!): Int!
  "根据 ids 还原数据"
  revertByIdsI18n(ids: [ID!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsI18n(ids: [ID!]!): Int!
}

`);
