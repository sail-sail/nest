import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./dict_detail.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar DictDetailId


type DictDetailModel {
  "ID"
  id: DictDetailId!
  "系统字典"
  dict_id: DictId!
  "系统字典"
  dict_id_lbl: String
  "名称"
  lbl: String!
  "值"
  val: String!
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
}
type DictDetailFieldComment {
  "ID"
  id: String!
  "系统字典"
  dict_id: String!
  "系统字典"
  dict_id_lbl: String!
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
input DictDetailInput {
  ""
  id: DictDetailId
  "系统字典"
  dict_id: DictId
  "系统字典"
  dict_id_lbl: String
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
}
input DictDetailSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [DictDetailId!]
  "ID"
  id: DictDetailId
  "系统字典"
  dict_id: [DictId!]
  dict_id_is_null: Boolean
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
  findCountDictDetail(search: DictDetailSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllDictDetail(search: DictDetailSearch, page: PageInput, sort: [SortInput!]): [DictDetailModel!]!
  "获取字段对应的名称"
  getFieldCommentsDictDetail: DictDetailFieldComment!
  "根据条件查找第一条数据"
  findOneDictDetail(search: DictDetailSearch, sort: [SortInput!]): DictDetailModel
  "根据id查找一条数据"
  findByIdDictDetail(id: DictDetailId!): DictDetailModel
  "查找order_by字段的最大值"
  findLastOrderByDictDetail: Int!
}
type Mutation {
  "创建一条数据"
  createDictDetail(model: DictDetailInput!, unique_type: UniqueType): DictDetailId!
  "根据id修改一条数据"
  updateByIdDictDetail(id: DictDetailId!, model: DictDetailInput!): DictDetailId!
  "根据 ids 删除数据"
  deleteByIdsDictDetail(ids: [DictDetailId!]!): Int!
  "根据 ids 启用或者禁用数据"
  enableByIdsDictDetail(ids: [DictDetailId!]!, is_enabled: Int!): Int!
  "根据 ids 锁定或者解锁数据"
  lockByIdsDictDetail(ids: [DictDetailId!]!, is_locked: Int!): Int!
  "根据 ids 还原数据"
  revertByIdsDictDetail(ids: [DictDetailId!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsDictDetail(ids: [DictDetailId!]!): Int!
}

`);
