import { defineGraphql } from "/lib/context.ts";

import * as dict_detailResolver from "./dict_detail.resolver.ts";

defineGraphql(dict_detailResolver, /* GraphQL */ `

type DictDetailModel {
  "ID"
  id: ID!
  "系统字典"
  dict_id: ID!
  "系统字典"
  dict_id_lbl: String
  "名称"
  lbl: String!
  "值"
  val: String!
  "排序"
  order_by: Int!
  "启用"
  is_enabled: Int!
  "启用"
  is_enabled_lbl: String
  "备注"
  rem: String!
  "锁定"
  is_locked: Int!
  "锁定"
  is_locked_lbl: String
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
  "排序"
  order_by: String!
  "启用"
  is_enabled: String!
  "启用"
  is_enabled_lbl: String!
  "备注"
  rem: String!
  "锁定"
  is_locked: String!
  "锁定"
  is_locked_lbl: String!
}
input DictDetailInput {
  "租户ID"
  tenant_id: String
  ""
  id: ID
  "系统字典"
  dict_id: ID
  "系统字典"
  dict_id_lbl: String
  "名称"
  lbl: String
  "值"
  val: String
  "排序"
  order_by: Int
  "启用"
  is_enabled: Int
  "启用"
  is_enabled_lbl: String
  "备注"
  rem: String
  "锁定"
  is_locked: Int
  "锁定"
  is_locked_lbl: String
}
input DictDetailSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [ID]
  "ID"
  id: ID
  "系统字典"
  dict_id: [String!]
  dict_id_lbl: [String!]
  dict_id_is_null: Boolean
  "名称"
  lbl: String
  lbl_like: String
  "值"
  val: String
  val_like: String
  "排序"
  order_by: [Int!]
  "启用"
  is_enabled: [Int!]
  "备注"
  rem: String
  rem_like: String
  "锁定"
  is_locked: [Int!]
}
type Query {
  "根据条件查找据数总数"
  findCountDict_detail(search: DictDetailSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllDict_detail(search: DictDetailSearch, page: PageInput, sort: [SortInput!]): [DictDetailModel!]!
  "获取字段对应的名称"
  getFieldCommentsDict_detail: DictDetailFieldComment!
  "根据条件查找第一条数据"
  findOneDict_detail(search: DictDetailSearch, sort: [SortInput!]): DictDetailModel
  "根据id查找一条数据"
  findByIdDict_detail(id: ID!): DictDetailModel
  "查找order_by字段的最大值"
  findLastOrderByDict_detail: Int!
}
type Mutation {
  "创建一条数据"
  createDict_detail(model: DictDetailInput!): ID!
  "根据id修改一条数据"
  updateByIdDict_detail(id: ID!, model: DictDetailInput!): ID!
  "批量导入"
  importModelsDict_detail(models: [DictDetailInput!]!): String
  "根据 ids 删除数据"
  deleteByIdsDict_detail(ids: [ID!]!): Int!
  "根据 ids 锁定或者解锁数据"
  lockByIdsDict_detail(ids: [ID!]!, is_locked: Int!): Int!
  "根据 ids 还原数据"
  revertByIdsDict_detail(ids: [ID!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsDict_detail(ids: [ID!]!): Int!
}

`);
