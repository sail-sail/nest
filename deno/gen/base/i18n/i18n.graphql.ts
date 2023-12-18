import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./i18n.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar I18nId


type I18Nmodel {
  "ID"
  id: I18nId!
  "语言"
  lang_id: LangId!
  "语言"
  lang_id_lbl: String
  "菜单"
  menu_id: MenuId!
  "菜单"
  menu_id_lbl: String
  "编码"
  code: String!
  "名称"
  lbl: String!
  "备注"
  rem: String!
  "创建人"
  create_usr_id: UsrId!
  "创建人"
  create_usr_id_lbl: String
  "创建时间"
  create_time: NaiveDateTime
  "创建时间"
  create_time_lbl: String!
  "更新人"
  update_usr_id: UsrId!
  "更新人"
  update_usr_id_lbl: String
  "更新时间"
  update_time: NaiveDateTime
  "更新时间"
  update_time_lbl: String!
  "是否已删除"
  is_deleted: Int!
}
type I18NfieldComment {
  "ID"
  id: String!
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
  "创建人"
  create_usr_id: String!
  "创建人"
  create_usr_id_lbl: String!
  "创建时间"
  create_time: String!
  "创建时间"
  create_time_lbl: String!
  "更新人"
  update_usr_id: String!
  "更新人"
  update_usr_id_lbl: String!
  "更新时间"
  update_time: String!
  "更新时间"
  update_time_lbl: String!
}
input I18Ninput {
  ""
  id: I18nId
  "语言"
  lang_id: LangId
  "语言"
  lang_id_lbl: String
  "菜单"
  menu_id: MenuId
  "菜单"
  menu_id_lbl: String
  "编码"
  code: String
  "名称"
  lbl: String
  "备注"
  rem: String
  "创建人"
  create_usr_id: UsrId
  "创建人"
  create_usr_id_lbl: String
  "创建时间"
  create_time: NaiveDateTime
  "创建时间"
  create_time_lbl: String
  "更新人"
  update_usr_id: UsrId
  "更新人"
  update_usr_id_lbl: String
  "更新时间"
  update_time: NaiveDateTime
  "更新时间"
  update_time_lbl: String
}
input I18Nsearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [I18nId!]
  "ID"
  id: I18nId
  "语言"
  lang_id: [LangId!]
  lang_id_is_null: Boolean
  "菜单"
  menu_id: [MenuId!]
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
  "创建人"
  create_usr_id: [UsrId!]
  create_usr_id_is_null: Boolean
  "创建时间"
  create_time: [NaiveDateTime!]
  "更新人"
  update_usr_id: [UsrId!]
  update_usr_id_is_null: Boolean
  "更新时间"
  update_time: [NaiveDateTime!]
}
type Query {
  "根据条件查找国际化总数"
  findCountI18N(search: I18Nsearch): Int!
  "根据搜索条件和分页查找国际化列表"
  findAllI18N(search: I18Nsearch, page: PageInput, sort: [SortInput!]): [I18Nmodel!]!
  "获取国际化字段注释"
  getFieldCommentsI18N: I18NfieldComment!
  "根据条件查找第一个国际化"
  findOneI18N(search: I18Nsearch, sort: [SortInput!]): I18Nmodel
  "根据 id 查找国际化"
  findByIdI18N(id: I18nId!): I18Nmodel
}
type Mutation {
  "创建国际化"
  createI18N(model: I18Ninput!, unique_type: UniqueType): I18nId!
  "根据 id 修改国际化"
  updateByIdI18N(id: I18nId!, model: I18Ninput!): I18nId!
  "根据 ids 删除国际化"
  deleteByIdsI18N(ids: [I18nId!]!): Int!
  "根据 ids 还原国际化"
  revertByIdsI18N(ids: [I18nId!]!): Int!
  "根据 ids 彻底删除国际化"
  forceDeleteByIdsI18N(ids: [I18nId!]!): Int!
}

`);
