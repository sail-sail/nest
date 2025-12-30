import { defineGraphql } from "/lib/context.ts";

import type { } from "./lang.model.ts";
import * as resolver from "./lang.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar LangId

type LangModel {
  "ID"
  id: LangId!
  "编码"
  code: String!
  "名称"
  lbl: String!
  "启用"
  is_enabled: Int!
  "启用"
  is_enabled_lbl: String!
  "排序"
  order_by: Int!
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
  "系统字段"
  is_sys: Int!
}
type LangFieldComment {
  "ID"
  id: String!
  "编码"
  code: String!
  "名称"
  lbl: String!
  "启用"
  is_enabled: String!
  "启用"
  is_enabled_lbl: String!
  "排序"
  order_by: String!
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
input LangInput {
  "ID"
  id: LangId
  "编码"
  code: String
  "名称"
  lbl: String
  "启用"
  is_enabled: Int
  "启用"
  is_enabled_lbl: String
  "排序"
  order_by: Int
  "备注"
  rem: String
}
input LangSearch {
  "已删除"
  is_deleted: Int
  "ID列表"
  ids: [LangId!]
  "ID"
  id: LangId
  "编码"
  code: String
  code_like: String
  "名称"
  lbl: String
  lbl_like: String
  "启用"
  is_enabled: [Int!]
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
  "根据条件查找语言总数"
  findCountLang(search: LangSearch): Int!
  "根据搜索条件和分页查找语言列表"
  findAllLang(search: LangSearch, page: PageInput, sort: [SortInput!]): [LangModel!]!
  "获取语言字段注释"
  getFieldCommentsLang: LangFieldComment!
  "根据条件查找第一个语言"
  findOneLang(search: LangSearch, sort: [SortInput!]): LangModel
  "根据 id 查找语言"
  findByIdLang(id: LangId!): LangModel
  "根据 ids 查找语言"
  findByIdsLang(ids: [LangId!]!): [LangModel]!
  "查找语言 order_by 字段的最大值"
  findLastOrderByLang(search: LangSearch): Int!
}
type Mutation {
  "批量创建语言"
  createsLang(inputs: [LangInput!]!, unique_type: UniqueType): [LangId!]!
  "根据 id 修改语言"
  updateByIdLang(id: LangId!, input: LangInput!): LangId!
  "根据 ids 删除语言"
  deleteByIdsLang(ids: [LangId!]!): Int!
  "根据 ids 启用或者禁用语言"
  enableByIdsLang(ids: [LangId!]!, is_enabled: Int!): Int!
  "根据 ids 还原语言"
  revertByIdsLang(ids: [LangId!]!): Int!
  "根据 ids 彻底删除语言"
  forceDeleteByIdsLang(ids: [LangId!]!): Int!
}

`);
