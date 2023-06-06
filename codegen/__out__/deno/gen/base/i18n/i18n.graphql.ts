import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./i18n.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `

type I18Nmodel {
  "ID"
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
type I18NfieldComment {
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
input I18Ninput {
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
input I18Nsearch {
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
  findCountI18N(search: I18Nsearch): Int!
  "根据搜索条件和分页查找数据"
  findAllI18N(search: I18Nsearch, page: PageInput, sort: [SortInput!]): [I18Nmodel!]!
  "获取字段对应的名称"
  getFieldCommentsI18N: I18NfieldComment!
  "根据条件查找第一条数据"
  findOneI18N(search: I18Nsearch, sort: [SortInput!]): I18Nmodel
  "根据id查找一条数据"
  findByIdI18N(id: String!): I18Nmodel
}
type Mutation {
  "创建一条数据"
  createI18N(model: I18Ninput!): String!
  "根据id修改一条数据"
  updateByIdI18N(id: String!, model: I18Ninput!): String!
  "根据 ids 删除数据"
  deleteByIdsI18N(ids: [String!]!): Int!
  "根据 ids 还原数据"
  revertByIdsI18N(ids: [String!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsI18N(ids: [String!]!): Int!
}

`);
