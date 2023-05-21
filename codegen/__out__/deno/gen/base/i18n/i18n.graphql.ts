import { defineGraphql } from "/lib/context.ts";

import * as i18nResolver from "./i18n.resolver.ts";

defineGraphql(i18nResolver, /* GraphQL */ `

type I18nModel {
  "String"
  id: String!
  "语言"
  lang_id: String!
  "语言"
  lang_id_lbl: String
  "菜单"
  menu_id: String!
  "菜单"
  menu_id_lbl: String
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
  lang_id_lbl: String!
  "菜单"
  menu_id: String!
  "菜单"
  menu_id_lbl: String!
  "编码"
  code: String!
  "名称"
  lbl: String!
  "备注"
  rem: String!
}
input I18nInput {
  ""
  id: String
  "语言"
  lang_id: String
  "语言"
  lang_id_lbl: String
  "菜单"
  menu_id: String
  "菜单"
  menu_id_lbl: String
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
  ids: [String]
  "String"
  id: String
  "语言"
  lang_id: [String!]
  lang_id_is_null: Boolean
  "菜单"
  menu_id: [String!]
  menu_id_is_null: Boolean
  "编码"
  code: String
  code_like: String
  "名称"
  lbl: String
  lbl_like: String
  "备注"
  rem: String
  rem_like: String
}
type Query {
  "根据条件查找据数总数"
  findCountI18n(search: I18nSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllI18n(search: I18nSearch, page: PageInput, sort: [SortInput!]): [I18nModel!]!
  "获取字段对应的名称"
  getFieldCommentsI18n: I18nFieldComment!
  "根据条件查找第一条数据"
  findOneI18n(search: I18nSearch, sort: [SortInput!]): I18nModel
  "根据id查找一条数据"
  findByIdI18n(id: String!): I18nModel
}
type Mutation {
  "创建一条数据"
  createI18n(model: I18nInput!): String!
  "根据id修改一条数据"
  updateByIdI18n(id: String!, model: I18nInput!): String!
  "根据 ids 删除数据"
  deleteByIdsI18n(ids: [String!]!): Int!
  "根据 ids 还原数据"
  revertByIdsI18n(ids: [String!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsI18n(ids: [String!]!): Int!
}

`);
