import { defineGraphql } from "/lib/context.ts";

import * as dictbiz_detailResolver from "./dictbiz_detail.resolver.ts";

defineGraphql(dictbiz_detailResolver, /* GraphQL */ `

type DictbizDetailModel {
  "ID"
  id: ID!
  "业务字典"
  dictbiz_id: ID!
  "业务字典"
  dictbiz_id_lbl: String
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
type DictbizDetailFieldComment {
  "业务字典"
  dictbiz_id: String!
  "业务字典"
  dictbiz_id_lbl: String!
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
input DictbizDetailInput {
  "租户ID"
  tenant_id: String
  ""
  id: ID
  "业务字典"
  dictbiz_id: ID
  "业务字典"
  dictbiz_id_lbl: String
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
input DictbizDetailSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [ID]
  "ID"
  id: ID
  "业务字典"
  dictbiz_id: [String!]
  dictbiz_id_lbl: [String!]
  dictbiz_id_is_null: Boolean
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
  findCountDictbiz_detail(search: DictbizDetailSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllDictbiz_detail(search: DictbizDetailSearch, page: PageInput, sort: [SortInput]): [DictbizDetailModel!]!
  "获取字段对应的名称"
  getFieldCommentsDictbiz_detail: DictbizDetailFieldComment!
  "根据条件查找第一条数据"
  findOneDictbiz_detail(search: DictbizDetailSearch, sort: [SortInput]): DictbizDetailModel
  "根据id查找一条数据"
  findByIdDictbiz_detail(id: ID!): DictbizDetailModel
  "查找order_by字段的最大值"
  findLastOrderByDictbiz_detail: Int!
}
type Mutation {
  "创建一条数据"
  createDictbiz_detail(model: DictbizDetailInput!): ID!
  "根据id修改一条数据"
  updateByIdDictbiz_detail(id: ID!, model: DictbizDetailInput!): ID!
  "批量导入"
  importModelsDictbiz_detail(models: [DictbizDetailInput!]!): String
  "根据 ids 删除数据"
  deleteByIdsDictbiz_detail(ids: [ID!]!): Int!
  "根据 ids 锁定或者解锁数据"
  lockByIdsDictbiz_detail(ids: [ID!]!, is_locked: Int!): Int!
  "根据 ids 还原数据"
  revertByIdsDictbiz_detail(ids: [ID!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsDictbiz_detail(ids: [ID!]!): Int!
}

`);
