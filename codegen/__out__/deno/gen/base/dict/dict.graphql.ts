import { defineGraphql } from "/lib/context.ts";

import * as dictResolver from "./dict.resolver.ts";

defineGraphql(dictResolver, /* GraphQL */ `

type DictModel {
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
type DictFieldComment {
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
input DictInput {
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
input DictSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [ID]
  "ID"
  id: ID
  "编码"
  code: String
  code_like: String
  "名称"
  lbl: String
  lbl_like: String
  "数据类型"
  type: [String!]
  "排序"
  order_by: [Int!]
  "启用"
  is_enabled: [Int!]
  "备注"
  rem: String
  rem_like: String
  "锁定"
  is_locked: [Int!]
  "创建人"
  create_usr_id: [String!]
  create_usr_id_lbl: [String!]
  create_usr_id_is_null: Boolean
  "创建时间"
  create_time: [String!]
  "更新人"
  update_usr_id: [String!]
  update_usr_id_lbl: [String!]
  update_usr_id_is_null: Boolean
  "更新时间"
  update_time: [String!]
}
type Query {
  "根据条件查找据数总数"
  findCountDict(search: DictSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllDict(search: DictSearch, page: PageInput, sort: [SortInput]): [DictModel!]!
  "获取字段对应的名称"
  getFieldCommentsDict: DictFieldComment!
  "根据条件查找第一条数据"
  findOneDict(search: DictSearch, sort: [SortInput]): DictModel
  "根据id查找一条数据"
  findByIdDict(id: ID!): DictModel
  "查找order_by字段的最大值"
  findLastOrderByDict: Int!
}
type Mutation {
  "创建一条数据"
  createDict(model: DictInput!): ID!
  "根据id修改一条数据"
  updateByIdDict(id: ID!, model: DictInput!): ID!
  "批量导入"
  importModelsDict(models: [DictInput!]!): String
  "根据 ids 删除数据"
  deleteByIdsDict(ids: [ID!]!): Int!
  "根据 ids 锁定或者解锁数据"
  lockByIdsDict(ids: [ID!]!, is_locked: Int!): Int!
  "根据 ids 还原数据"
  revertByIdsDict(ids: [ID!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsDict(ids: [ID!]!): Int!
}

`);
