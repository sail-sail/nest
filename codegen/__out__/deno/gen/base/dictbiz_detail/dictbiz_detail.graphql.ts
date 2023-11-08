import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./dictbiz_detail.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `

type DictbizDetailModel {
  "ID"
  id: String!
  "业务字典"
  dictbiz_id: String!
  "业务字典"
  dictbiz_id_lbl: String
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
input DictbizDetailInput {
  ""
  id: String
  "业务字典"
  dictbiz_id: String
  "业务字典"
  dictbiz_id_lbl: String
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
}
input DictbizDetailSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [String]
  "String"
  id: String
  "业务字典"
  dictbiz_id: [String!]
  dictbiz_id_is_null: Boolean
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
  findCountDictbizDetail(search: DictbizDetailSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllDictbizDetail(search: DictbizDetailSearch, page: PageInput, sort: [SortInput!]): [DictbizDetailModel!]!
  "获取字段对应的名称"
  getFieldCommentsDictbizDetail: DictbizDetailFieldComment!
  "根据条件查找第一条数据"
  findOneDictbizDetail(search: DictbizDetailSearch, sort: [SortInput!]): DictbizDetailModel
  "根据id查找一条数据"
  findByIdDictbizDetail(id: String!): DictbizDetailModel
  "查找order_by字段的最大值"
  findLastOrderByDictbizDetail: Int!
}
type Mutation {
  "创建一条数据"
  createDictbizDetail(model: DictbizDetailInput!, unique_type: UniqueType): String!
  "根据id修改一条数据"
  updateByIdDictbizDetail(id: String!, model: DictbizDetailInput!): String!
  "根据 ids 删除数据"
  deleteByIdsDictbizDetail(ids: [String!]!): Int!
  "根据 ids 启用或者禁用数据"
  enableByIdsDictbizDetail(ids: [String!]!, is_enabled: Int!): Int!
  "根据 ids 锁定或者解锁数据"
  lockByIdsDictbizDetail(ids: [String!]!, is_locked: Int!): Int!
  "根据 ids 还原数据"
  revertByIdsDictbizDetail(ids: [String!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsDictbizDetail(ids: [String!]!): Int!
}

`);
