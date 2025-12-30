import { defineGraphql } from "/lib/context.ts";

import type { } from "./dict_detail.model.ts";
import * as resolver from "./dict_detail.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar DictDetailId

type DictDetailModel {
  "ID"
  id: DictDetailId!
  "系统字典"
  dict_id: DictId!
  "系统字典"
  dict_id_lbl: String!
  "名称"
  lbl: String!
  "值"
  val: String!
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
  create_usr_id_lbl: String!
  "创建时间"
  create_time: NaiveDateTime
  "创建时间"
  create_time_lbl: String!
  "更新人"
  update_usr_id: UsrId!
  "更新人"
  update_usr_id_lbl: String!
  "更新时间"
  update_time: NaiveDateTime
  "更新时间"
  update_time_lbl: String!
  "已删除"
  is_deleted: Int!
  "系统字段"
  is_sys: Int!
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
  "ID"
  id: DictDetailId
  "系统字典"
  dict_id: DictId
  "系统字典"
  dict_id_lbl: String
  "名称"
  lbl: String
  "值"
  val: String
  "启用"
  is_enabled: Int
  "启用"
  is_enabled_lbl: String
  "排序"
  order_by: Int
  "备注"
  rem: String
}
input DictDetailSearch {
  "已删除"
  is_deleted: Int
  "ID列表"
  ids: [DictDetailId!]
  "ID"
  id: DictDetailId
  "系统字典"
  dict_id: [DictId!]
  "系统字典"
  dict_id_is_null: Boolean
  "系统字典"
  dict_id_lbl: [String!]
  "系统字典"
  dict_id_lbl_like: String
  "名称"
  lbl: String
  lbl_like: String
  "值"
  val: String
  val_like: String
  "启用"
  is_enabled: [Int!]
  "创建人"
  create_usr_id: [UsrId!]
  "创建人"
  create_usr_id_is_null: Boolean
  "创建人"
  create_usr_id_lbl: [String!]
  "创建人"
  create_usr_id_lbl_like: String
  "更新人"
  update_usr_id: [UsrId!]
  "更新人"
  update_usr_id_is_null: Boolean
  "更新人"
  update_usr_id_lbl: [String!]
  "更新人"
  update_usr_id_lbl_like: String
}
type Query {
  "根据条件查找系统字典明细总数"
  findCountDictDetail(search: DictDetailSearch): Int!
  "根据搜索条件和分页查找系统字典明细列表"
  findAllDictDetail(search: DictDetailSearch, page: PageInput, sort: [SortInput!]): [DictDetailModel!]!
  "获取系统字典明细字段注释"
  getFieldCommentsDictDetail: DictDetailFieldComment!
  "根据条件查找第一个系统字典明细"
  findOneDictDetail(search: DictDetailSearch, sort: [SortInput!]): DictDetailModel
  "根据 id 查找系统字典明细"
  findByIdDictDetail(id: DictDetailId!): DictDetailModel
  "根据 ids 查找系统字典明细"
  findByIdsDictDetail(ids: [DictDetailId!]!): [DictDetailModel]!
  "查找系统字典明细 order_by 字段的最大值"
  findLastOrderByDictDetail(search: DictDetailSearch): Int!
}
type Mutation {
  "批量创建系统字典明细"
  createsDictDetail(inputs: [DictDetailInput!]!, unique_type: UniqueType): [DictDetailId!]!
  "根据 id 修改系统字典明细"
  updateByIdDictDetail(id: DictDetailId!, input: DictDetailInput!): DictDetailId!
  "根据 ids 删除系统字典明细"
  deleteByIdsDictDetail(ids: [DictDetailId!]!): Int!
  "根据 ids 启用或者禁用系统字典明细"
  enableByIdsDictDetail(ids: [DictDetailId!]!, is_enabled: Int!): Int!
  "根据 ids 还原系统字典明细"
  revertByIdsDictDetail(ids: [DictDetailId!]!): Int!
  "根据 ids 彻底删除系统字典明细"
  forceDeleteByIdsDictDetail(ids: [DictDetailId!]!): Int!
}

`);
