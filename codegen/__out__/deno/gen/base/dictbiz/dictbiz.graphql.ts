import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./dictbiz.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar DictbizId

"业务字典数据类型"
enum DictbizType {
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

type DictbizModel {
  "ID"
  id: String!
  "编码"
  code: String!
  "名称"
  lbl: String!
  "数据类型"
  type: DictbizType
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
  create_usr_id: String!
  "创建人"
  create_usr_id_lbl: UsrId
  "创建时间"
  create_time: NaiveDateTime
  "创建时间"
  create_time_lbl: String!
  "更新人"
  update_usr_id: String!
  "更新人"
  update_usr_id_lbl: UsrId
  "更新时间"
  update_time: NaiveDateTime
  "更新时间"
  update_time_lbl: String!
  "是否已删除"
  is_deleted: Int!
  "业务字典明细"
  dictbiz_detail_models: [DictbizDetailModel!]
}
type DictbizFieldComment {
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
input DictbizInput {
  ""
  id: DictbizId
  "编码"
  code: String
  "名称"
  lbl: String
  "数据类型"
  type: DictbizType
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
  create_usr_id_lbl: UsrId
  "创建时间"
  create_time: NaiveDateTime
  "创建时间"
  create_time_lbl: String
  "更新人"
  update_usr_id: String
  "更新人"
  update_usr_id_lbl: UsrId
  "更新时间"
  update_time: NaiveDateTime
  "更新时间"
  update_time_lbl: String
  "业务字典明细"
  dictbiz_detail_models: [DictbizDetailInput!]
}
input DictbizSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [String]
  "ID"
  id: DictbizId
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
  findCountDictbiz(search: DictbizSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllDictbiz(search: DictbizSearch, page: PageInput, sort: [SortInput!]): [DictbizModel!]!
  "获取字段对应的名称"
  getFieldCommentsDictbiz: DictbizFieldComment!
  "根据条件查找第一条数据"
  findOneDictbiz(search: DictbizSearch, sort: [SortInput!]): DictbizModel
  "根据id查找一条数据"
  findByIdDictbiz(id: String!): DictbizModel
  "查找order_by字段的最大值"
  findLastOrderByDictbiz: Int!
}
type Mutation {
  "创建一条数据"
  createDictbiz(model: DictbizInput!, unique_type: UniqueType): String!
  "根据id修改一条数据"
  updateByIdDictbiz(id: String!, model: DictbizInput!): String!
  "根据 ids 删除数据"
  deleteByIdsDictbiz(ids: [String!]!): Int!
  "根据 ids 启用或者禁用数据"
  enableByIdsDictbiz(ids: [String!]!, is_enabled: Int!): Int!
  "根据 ids 锁定或者解锁数据"
  lockByIdsDictbiz(ids: [String!]!, is_locked: Int!): Int!
  "根据 ids 还原数据"
  revertByIdsDictbiz(ids: [String!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsDictbiz(ids: [String!]!): Int!
}

`);
