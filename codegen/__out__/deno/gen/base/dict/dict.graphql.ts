import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./dict.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `

type DictModel {
  "ID"
  id: String!
  "编码"
  code: String!
  "名称"
  lbl: String!
  "数据类型"
  type: String!
  "数据类型"
  type_lbl: String
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
  "是否已删除"
  is_deleted: Int!
  "系统字典明细"
  dict_detail_models: [DictDetailModel!]
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
input DictInput {
  ""
  id: String
  "编码"
  code: String
  "名称"
  lbl: String
  "数据类型"
  type: String
  "数据类型"
  type_lbl: String
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
  "系统字典明细"
  dict_detail_models: [DictDetailInput!]
}
input DictSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [String]
  "ID"
  id: String
  "编码"
  code: String
  code_like: String
  "名称"
  lbl: String
  lbl_like: String
  "数据类型"
  type: [String!]
  "锁定"
  is_locked: [Int!]
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
}
type Query {
  "根据条件查找据数总数"
  findCountDict(search: DictSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllDict(search: DictSearch, page: PageInput, sort: [SortInput!]): [DictModel!]!
  "获取字段对应的名称"
  getFieldCommentsDict: DictFieldComment!
  "根据条件查找第一条数据"
  findOneDict(search: DictSearch, sort: [SortInput!]): DictModel
  "根据id查找一条数据"
  findByIdDict(id: String!): DictModel
  "查找order_by字段的最大值"
  findLastOrderByDict: Int!
}
type Mutation {
  "创建一条数据"
  createDict(model: DictInput!, unique_type: UniqueType): String!
  "根据id修改一条数据"
  updateByIdDict(id: String!, model: DictInput!): String!
  "根据 ids 删除数据"
  deleteByIdsDict(ids: [String!]!): Int!
  "根据 ids 启用或者禁用数据"
  enableByIdsDict(ids: [String!]!, is_enabled: Int!): Int!
  "根据 ids 锁定或者解锁数据"
  lockByIdsDict(ids: [String!]!, is_locked: Int!): Int!
  "根据 ids 还原数据"
  revertByIdsDict(ids: [String!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsDict(ids: [String!]!): Int!
}

`);
