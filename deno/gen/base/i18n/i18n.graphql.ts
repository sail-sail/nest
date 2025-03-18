import { defineGraphql } from "/lib/context.ts";

import type { } from "./i18n.model.ts";
import * as resolver from "./i18n.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar I18nId

type I18nModel {
  "ID"
  id: I18nId!
  "语言"
  lang_id: LangId!
  "语言"
  lang_id_lbl: String!
  "菜单"
  menu_id: MenuId!
  "菜单"
  menu_id_lbl: String!
  "编码"
  code: String!
  "名称"
  lbl: String!
  "备注"
  rem: String!
  "创建人"
  create_usr_id: UsrId!
  "创建人"
  create_usr_id_lbl: String!
  "创建时间"
  create_time: NaiveDateTime
  "创建时间"
  create_time_lbl: String!
  "更新人"
  update_usr_id: UsrId!
  "更新人"
  update_usr_id_lbl: String!
  "更新时间"
  update_time: NaiveDateTime
  "更新时间"
  update_time_lbl: String!
  "已删除"
  is_deleted: Int!
}
type I18nFieldComment {
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
input I18nInput {
  "ID"
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
}
input I18nSearch {
  "已删除"
  is_deleted: Int
  "ID列表"
  ids: [I18nId!]
  "ID"
  id: I18nId
  "语言"
  lang_id: [LangId!]
  "语言"
  lang_id_is_null: Boolean
  "语言"
  lang_id_lbl: [String!]
  "语言"
  lang_id_lbl_like: String
  "菜单"
  menu_id: [MenuId!]
  "菜单"
  menu_id_is_null: Boolean
  "菜单"
  menu_id_lbl: [String!]
  "菜单"
  menu_id_lbl_like: String
  "编码"
  code: String
  code_like: String
  "名称"
  lbl: String
  lbl_like: String
  "创建人"
  create_usr_id: [UsrId!]
  "创建人"
  create_usr_id_is_null: Boolean
  "创建人"
  create_usr_id_lbl: [String!]
  "创建人"
  create_usr_id_lbl_like: String
  "更新人"
  update_usr_id: [UsrId!]
  "更新人"
  update_usr_id_is_null: Boolean
  "更新人"
  update_usr_id_lbl: [String!]
  "更新人"
  update_usr_id_lbl_like: String
}
type Query {
  "根据条件查找国际化总数"
  findCountI18n(search: I18nSearch): Int!
  "根据搜索条件和分页查找国际化列表"
  findAllI18n(search: I18nSearch, page: PageInput, sort: [SortInput!]): [I18nModel!]!
  "获取国际化字段注释"
  getFieldCommentsI18n: I18nFieldComment!
  "根据条件查找第一个国际化"
  findOneI18n(search: I18nSearch, sort: [SortInput!]): I18nModel
  "根据 id 查找国际化"
  findByIdI18n(id: I18nId!): I18nModel
  "根据 ids 查找国际化"
  findByIdsI18n(ids: [I18nId!]!): [I18nModel]!
}
type Mutation {
  "批量创建国际化"
  createsI18n(inputs: [I18nInput!]!, unique_type: UniqueType): [I18nId!]!
  "根据 id 修改国际化"
  updateByIdI18n(id: I18nId!, input: I18nInput!): I18nId!
  "根据 ids 删除国际化"
  deleteByIdsI18n(ids: [I18nId!]!): Int!
  "根据 ids 还原国际化"
  revertByIdsI18n(ids: [I18nId!]!): Int!
  "根据 ids 彻底删除国际化"
  forceDeleteByIdsI18n(ids: [I18nId!]!): Int!
}

`);
