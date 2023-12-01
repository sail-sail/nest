import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./dict.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar DictId

"系统字典数据类型"
enum DictType {
  "字符串"
  string
  "数值"
  number
  "日期"
  date
  "日期时间"
  datetime
  "时间"
  time
  "布尔"
  boolean
}

type DictModel {
  "ID"
  id: DictId!
  "编码"
  code: String!
  "名称"
  lbl: String!
  "数据类型"
  type: DictType
  "数据类型"
  type_lbl: String!
  "锁定"
  is_locked: Int!
  "锁定"
  is_locked_lbl: String!
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
  create_usr_id_lbl: String
  "创建时间"
  create_time: NaiveDateTime
  "创建时间"
  create_time_lbl: String!
  "更新人"
  update_usr_id: UsrId!
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
  "ID"
  id: String!
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
  id: DictId
  "编码"
  code: String
  "名称"
  lbl: String
  "数据类型"
  type: DictType
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
  create_usr_id: UsrId
  "创建人"
  create_usr_id_lbl: String
  "创建时间"
  create_time: NaiveDateTime
  "创建时间"
  create_time_lbl: String
  "更新人"
  update_usr_id: UsrId
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
  ids: [DictId!]
  "ID"
  id: DictId
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
  create_usr_id: [UsrId!]
  create_usr_id_is_null: Boolean
  "创建时间"
  create_time: [NaiveDateTime!]
  "更新人"
  update_usr_id: [UsrId!]
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
  findByIdDict(id: DictId!): DictModel
  "查找order_by字段的最大值"
  findLastOrderByDict: Int!
}
type Mutation {
  "创建一条数据"
  createDict(model: DictInput!, unique_type: UniqueType): DictId!
  "根据id修改一条数据"
  updateByIdDict(id: DictId!, model: DictInput!): DictId!
  "根据 ids 删除数据"
  deleteByIdsDict(ids: [DictId!]!): Int!
  "根据 ids 启用或者禁用数据"
  enableByIdsDict(ids: [DictId!]!, is_enabled: Int!): Int!
  "根据 ids 锁定或者解锁数据"
  lockByIdsDict(ids: [DictId!]!, is_locked: Int!): Int!
  "根据 ids 还原数据"
  revertByIdsDict(ids: [DictId!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsDict(ids: [DictId!]!): Int!
}

`);
