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
  "根据条件查找据数总数"
  findCountI18N(search: I18Nsearch): Int!
  "根据搜索条件和分页查找数据"
  findAllI18N(search: I18Nsearch, page: PageInput, sort: [SortInput!]): [I18Nmodel!]!
  "获取字段对应的名称"
  getFieldCommentsI18N: I18NfieldComment!
  "根据条件查找第一条数据"
  findOneI18N(search: I18Nsearch, sort: [SortInput!]): I18Nmodel
  "根据id查找一条数据"
  findByIdI18N(id: I18nId!): I18Nmodel
}
type Mutation {
  "创建一条数据"
  createI18N(model: I18Ninput!, unique_type: UniqueType): I18nId!
  "根据id修改一条数据"
  updateByIdI18N(id: I18nId!, model: I18Ninput!): I18nId!
  "根据 ids 删除数据"
  deleteByIdsI18N(ids: [I18nId!]!): Int!
  "根据 ids 还原数据"
  revertByIdsI18N(ids: [I18nId!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsI18N(ids: [I18nId!]!): Int!
}

`);
