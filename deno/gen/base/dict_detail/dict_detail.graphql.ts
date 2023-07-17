import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./dict_detail.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `

type DictDetailModel {
  "ID"
  id: String!
  "系统字典"
  dict_id: String!
  "系统字典"
  dict_id_lbl: String
  "名称"
  lbl: String!
  "值"
  val: String!
  "锁定"
  is_locked: Int!
  "锁定"
  is_locked_lbl: String
  "启用"
  is_enabled: Int!
  "启用"
  is_enabled_lbl: String
  "排序"
  order_by: Int!
  "备注"
  rem: String!
  "系统字段"
  is_sys: Int!
  "系统字段"
  is_sys_lbl: String
  "是否已删除"
  is_deleted: Int!
}
type DictDetailFieldComment {
  "系统字典"
  dict_id: String!
  "系统字典"
  dict_id_lbl: String!
  "名称"
  lbl: String!
  "值"
  val: String!
  "锁定"
  is_locked: String!
  "锁定"
  is_locked_lbl: String!
  "启用"
  is_enabled: String!
  "启用"
  is_enabled_lbl: String!
  "排序"
  order_by: String!
  "备注"
  rem: String!
}
input DictDetailInput {
  ""
  id: String
  "系统字典"
  dict_id: String
  "系统字典"
  dict_id_lbl: String
  "名称"
  lbl: String
  "值"
  val: String
  "锁定"
  is_locked: Int
  "锁定"
  is_locked_lbl: String
  "启用"
  is_enabled: Int
  "启用"
  is_enabled_lbl: String
  "排序"
  order_by: Int
  "备注"
  rem: String
  "系统字段"
  is_sys: Int
  "系统字段"
  is_sys_lbl: String
}
input DictDetailSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [String]
  "String"
  id: String
  "系统字典"
  dict_id: [String!]
  dict_id_is_null: Boolean
  "名称"
  lbl: String
  lbl_like: String
  "值"
  val: String
  val_like: String
  "锁定"
  is_locked: [Int!]
  "启用"
  is_enabled: [Int!]
  "排序"
  order_by: [Int!]
  "备注"
  rem: String
  rem_like: String
  "系统字段"
  is_sys: [Int!]
}
type Query {
  "根据条件查找据数总数"
  findCountDictDetail(search: DictDetailSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllDictDetail(search: DictDetailSearch, page: PageInput, sort: [SortInput!]): [DictDetailModel!]!
  "获取字段对应的名称"
  getFieldCommentsDictDetail: DictDetailFieldComment!
  "根据条件查找第一条数据"
  findOneDictDetail(search: DictDetailSearch, sort: [SortInput!]): DictDetailModel
  "根据id查找一条数据"
  findByIdDictDetail(id: String!): DictDetailModel
  "查找order_by字段的最大值"
  findLastOrderByDictDetail: Int!
}
type Mutation {
  "创建一条数据"
  createDictDetail(model: DictDetailInput!): String!
  "根据id修改一条数据"
  updateByIdDictDetail(id: String!, model: DictDetailInput!): String!
  "根据 ids 删除数据"
  deleteByIdsDictDetail(ids: [String!]!): Int!
  "根据 ids 启用或者禁用数据"
  enableByIdsDictDetail(ids: [String!]!, is_enabled: Int!): Int!
  "根据 ids 锁定或者解锁数据"
  lockByIdsDictDetail(ids: [String!]!, is_locked: Int!): Int!
  "根据 ids 还原数据"
  revertByIdsDictDetail(ids: [String!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsDictDetail(ids: [String!]!): Int!
}

`);
