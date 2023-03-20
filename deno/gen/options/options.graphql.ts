import { defineGraphql } from "/lib/context.ts";

import {
  _internals as optionsResolver,
} from "./options.resolver.ts";

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
  "启用ID"
  is_enabled: Int!
  "启用名称"
  _is_enabled: String
  "备注"
  rem: String!
  "锁定ID"
  is_locked: Int!
  "锁定名称"
  _is_locked: String
  "版本号"
  version: Int!
  "创建人ID"
  create_usr_id: ID!
  "创建人名称"
  _create_usr_id: String
  "创建时间"
  create_time: String
  "更新人ID"
  update_usr_id: ID!
  "更新人名称"
  _update_usr_id: String
  "更新时间"
  update_time: String
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
  "启用ID"
  is_enabled: Int
  "启用名称"
  _is_enabled: String
  "备注"
  rem: String
  "锁定ID"
  is_locked: Int
  "锁定名称"
  _is_locked: String
  "版本号"
  version: Int
  "创建人ID"
  create_usr_id: ID
  "创建人名称"
  _create_usr_id: String
  "创建时间"
  create_time: String
  "更新人ID"
  update_usr_id: ID
  "更新人名称"
  _update_usr_id: String
  "更新时间"
  update_time: String
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
  lblLike: String
  "键"
  ky: String
  kyLike: String
  "值"
  val: String
  valLike: String
  "排序"
  order_by: [Int]
  "启用"
  is_enabled: [Int]
  "备注"
  rem: String
  remLike: String
  "锁定"
  is_locked: [Int]
  "版本号"
  version: [Int]
  "创建人"
  create_usr_id: [String]
  _create_usr_id: [String]
  "创建时间"
  create_time: [String]
  "更新人"
  update_usr_id: [String]
  _update_usr_id: [String]
  "更新时间"
  update_time: [String]
}
type Query {
  "根据条件查找据数总数"
  findCountOptions(search: OptionsSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllOptions(search: OptionsSearch, page: PageInput, sort: [SortInput]): [OptionsModel!]!
  "根据搜索条件导出"
  exportExcelOptions(search: OptionsSearch, sort: [SortInput]): String!
  "根据条件查找第一条数据"
  findOneOptions(search: OptionsSearch): OptionsModel
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
  "导入文件"
  importFileOptions(id: ID!): String
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
