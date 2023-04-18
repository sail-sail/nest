import { defineGraphql } from "/lib/context.ts";

import * as dictbizResolver from "./dictbiz.resolver.ts";

defineGraphql(dictbizResolver, /* GraphQL */ `

type DictbizModel {
  "ID"
  id: ID!
  "编码"
  code: String!
  "名称"
  lbl: String!
  "数据类型"
  type: String!
  "数据类型"
  type_lbl: String
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
  "创建人"
  create_usr_id: ID!
  "创建人"
  create_usr_id_lbl: String
  "创建时间"
  create_time: String
  "更新人"
  update_usr_id: ID!
  "更新人"
  update_usr_id_lbl: String
  "更新时间"
  update_time: String
}
type DictbizFieldComment {
  "编码"
  code: String!
  "名称"
  lbl: String!
  "数据类型"
  type: String!
  "数据类型"
  type_lbl: String!
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
  "创建人"
  create_usr_id: String!
  "创建人"
  create_usr_id_lbl: String!
  "创建时间"
  create_time: String!
  "更新人"
  update_usr_id: String!
  "更新人"
  update_usr_id_lbl: String!
  "更新时间"
  update_time: String!
}
input DictbizInput {
  "租户ID"
  tenant_id: String
  ""
  id: ID
  "编码"
  code: String
  "名称"
  lbl: String
  "数据类型"
  type: String
  "数据类型"
  type_lbl: String
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
  "创建人"
  create_usr_id: ID
  "创建人"
  create_usr_id_lbl: String
  "创建时间"
  create_time: String
  "更新人"
  update_usr_id: ID
  "更新人"
  update_usr_id_lbl: String
  "更新时间"
  update_time: String
}
input DictbizSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [ID]
  "ID"
  id: ID
  "编码"
  code: String
  codeLike: String
  "名称"
  lbl: String
  lblLike: String
  "数据类型"
  type: [String]
  "排序"
  order_by: [Int]
  "启用"
  is_enabled: [Int]
  "备注"
  rem: String
  remLike: String
  "锁定"
  is_locked: [Int]
  "创建人"
  create_usr_id: [String]
  create_usr_id_lbl: [String]
  "创建时间"
  create_time: [String]
  "更新人"
  update_usr_id: [String]
  update_usr_id_lbl: [String]
  "更新时间"
  update_time: [String]
}
type Query {
  "根据条件查找据数总数"
  findCountDictbiz(search: DictbizSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllDictbiz(search: DictbizSearch, page: PageInput, sort: [SortInput]): [DictbizModel!]!
  "获取字段对应的名称"
  getFieldCommentsDictbiz: DictbizFieldComment!
  "根据条件查找第一条数据"
  findOneDictbiz(search: DictbizSearch, sort: [SortInput]): DictbizModel
  "根据id查找一条数据"
  findByIdDictbiz(id: ID!): DictbizModel
  "查找order_by字段的最大值"
  findLastOrderByDictbiz: Int!
}
type Mutation {
  "创建一条数据"
  createDictbiz(model: DictbizInput!): ID!
  "根据id修改一条数据"
  updateByIdDictbiz(id: ID!, model: DictbizInput!): ID!
  "批量导入"
  importModelsDictbiz(models: [DictbizInput!]!): String
  "根据 ids 删除数据"
  deleteByIdsDictbiz(ids: [ID!]!): Int!
  "根据 ids 锁定或者解锁数据"
  lockByIdsDictbiz(ids: [ID!]!, is_locked: Int!): Int!
  "根据 ids 还原数据"
  revertByIdsDictbiz(ids: [ID!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsDictbiz(ids: [ID!]!): Int!
}

`);
