import { defineGraphql } from "/lib/context.ts";

import * as optionsResolver from "./options.resolver.ts";

defineGraphql(optionsResolver, /* GraphQL */ `

type OptionsModel {
  "ID"
  id: ID!
  "名称"
  lbl: String!
  "键"
  ky: String!
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
  "版本号"
  version: Int!
  "创建人"
  create_usr_id: ID!
  "创建人"
  create_usr_id_lbl: String
  "创建时间"
  create_time: NaiveDateTime
  "创建时间"
  create_time_lbl: String
  "更新人"
  update_usr_id: ID!
  "更新人"
  update_usr_id_lbl: String
  "更新时间"
  update_time: NaiveDateTime
  "更新时间"
  update_time_lbl: String
}
type OptionsFieldComment {
  "名称"
  lbl: String!
  "键"
  ky: String!
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
  "版本号"
  version: String!
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
input OptionsInput {
  "租户ID"
  tenant_id: String
  ""
  id: ID
  "名称"
  lbl: String
  "键"
  ky: String
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
  "版本号"
  version: Int
  "创建人"
  create_usr_id: ID
  "创建人"
  create_usr_id_lbl: String
  "创建时间"
  create_time: NaiveDateTime
  "更新人"
  update_usr_id: ID
  "更新人"
  update_usr_id_lbl: String
  "更新时间"
  update_time: NaiveDateTime
}
input OptionsSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [ID]
  "ID"
  id: ID
  "名称"
  lbl: String
  lbl_like: String
  "键"
  ky: String
  ky_like: String
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
  "版本号"
  version: [Int!]
  "创建人"
  create_usr_id: [String!]
  create_usr_id_lbl: [String!]
  create_usr_id_is_null: Boolean
  "创建时间"
  create_time: [NaiveDateTime!]
  create_time_lbl: String
  "更新人"
  update_usr_id: [String!]
  update_usr_id_lbl: [String!]
  update_usr_id_is_null: Boolean
  "更新时间"
  update_time: [NaiveDateTime!]
  update_time_lbl: String
}
type Query {
  "根据条件查找据数总数"
  findCountOptions(search: OptionsSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllOptions(search: OptionsSearch, page: PageInput, sort: [SortInput!]): [OptionsModel!]!
  "获取字段对应的名称"
  getFieldCommentsOptions: OptionsFieldComment!
  "根据条件查找第一条数据"
  findOneOptions(search: OptionsSearch, sort: [SortInput!]): OptionsModel
  "根据id查找一条数据"
  findByIdOptions(id: ID!): OptionsModel
  "查找order_by字段的最大值"
  findLastOrderByOptions: Int!
}
type Mutation {
  "创建一条数据"
  createOptions(model: OptionsInput!): ID!
  "根据id修改一条数据"
  updateByIdOptions(id: ID!, model: OptionsInput!): ID!
  "批量导入"
  importModelsOptions(models: [OptionsInput!]!): String
  "根据 ids 删除数据"
  deleteByIdsOptions(ids: [ID!]!): Int!
  "根据 ids 锁定或者解锁数据"
  lockByIdsOptions(ids: [ID!]!, is_locked: Int!): Int!
  "根据 ids 还原数据"
  revertByIdsOptions(ids: [ID!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsOptions(ids: [ID!]!): Int!
}

`);
