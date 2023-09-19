import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./lang.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `

type LangModel {
  "ID"
  id: String!
  "编码"
  code: String!
  "名称"
  lbl: String!
  "启用"
  is_enabled: Int!
  "启用"
  is_enabled_lbl: String
  "排序"
  order_by: Int!
  "备注"
  rem: String!
  "创建人"
  create_usr_id: String!
  "创建人"
  create_usr_id_lbl: String
  "创建时间"
  create_time: NaiveDateTime
  "创建时间"
  create_time_lbl: String!
  "更新人"
  update_usr_id: String!
  "更新人"
  update_usr_id_lbl: String
  "更新时间"
  update_time: NaiveDateTime
  "更新时间"
  update_time_lbl: String!
  "系统字段"
  is_sys: Int!
  "系统字段"
  is_sys_lbl: String
  "是否已删除"
  is_deleted: Int!
}
type LangFieldComment {
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
  ""
  id: String
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
  "创建人"
  create_usr_id: String
  "创建人"
  create_usr_id_lbl: String
  "创建时间"
  create_time: NaiveDateTime
  "创建时间"
  create_time_lbl: String
  "更新人"
  update_usr_id: String
  "更新人"
  update_usr_id_lbl: String
  "更新时间"
  update_time: NaiveDateTime
  "更新时间"
  update_time_lbl: String
  "系统字段"
  is_sys: Int
  "系统字段"
  is_sys_lbl: String
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
  "启用"
  is_enabled: [Int!]
  "排序"
  order_by: [Int!]
  "备注"
  rem: String
  rem_like: String
  "创建人"
  create_usr_id: [String!]
  create_usr_id_is_null: Boolean
  "创建时间"
  create_time: [NaiveDateTime!]
  "更新人"
  update_usr_id: [String!]
  update_usr_id_is_null: Boolean
  "更新时间"
  update_time: [NaiveDateTime!]
  "系统字段"
  is_sys: [Int!]
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
  createLang(model: LangInput!, unique_type: UniqueType): String!
  "根据id修改一条数据"
  updateByIdLang(id: String!, model: LangInput!): String!
  "根据 ids 删除数据"
  deleteByIdsLang(ids: [String!]!): Int!
  "根据 ids 启用或者禁用数据"
  enableByIdsLang(ids: [String!]!, is_enabled: Int!): Int!
  "根据 ids 还原数据"
  revertByIdsLang(ids: [String!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsLang(ids: [String!]!): Int!
}

`);
