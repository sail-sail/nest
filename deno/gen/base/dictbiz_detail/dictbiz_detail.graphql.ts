import { defineGraphql } from "/lib/context.ts";

import type { } from "./dictbiz_detail.model.ts";
import * as resolver from "./dictbiz_detail.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar DictbizDetailId

type DictbizDetailModel {
  "ID"
  id: DictbizDetailId!
  "业务字典"
  dictbiz_id: DictbizId!
  "业务字典"
  dictbiz_id_lbl: String!
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
type DictbizDetailFieldComment {
  "ID"
  id: String!
  "业务字典"
  dictbiz_id: String!
  "业务字典"
  dictbiz_id_lbl: String!
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
input DictbizDetailInput {
  "ID"
  id: DictbizDetailId
  "业务字典"
  dictbiz_id: DictbizId
  "业务字典"
  dictbiz_id_lbl: String
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
input DictbizDetailSearch {
  "已删除"
  is_deleted: Int
  "ID列表"
  ids: [DictbizDetailId!]
  "ID"
  id: DictbizDetailId
  "业务字典"
  dictbiz_id: [DictbizId!]
  "业务字典"
  dictbiz_id_is_null: Boolean
  "业务字典"
  dictbiz_id_lbl: [String!]
  "业务字典"
  dictbiz_id_lbl_like: String
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
  "根据条件查找业务字典明细总数"
  findCountDictbizDetail(search: DictbizDetailSearch): Int!
  "根据搜索条件和分页查找业务字典明细列表"
  findAllDictbizDetail(search: DictbizDetailSearch, page: PageInput, sort: [SortInput!]): [DictbizDetailModel!]!
  "获取业务字典明细字段注释"
  getFieldCommentsDictbizDetail: DictbizDetailFieldComment!
  "根据条件查找第一个业务字典明细"
  findOneDictbizDetail(search: DictbizDetailSearch, sort: [SortInput!]): DictbizDetailModel
  "根据 id 查找业务字典明细"
  findByIdDictbizDetail(id: DictbizDetailId!): DictbizDetailModel
  "根据 ids 查找业务字典明细"
  findByIdsDictbizDetail(ids: [DictbizDetailId!]!): [DictbizDetailModel]!
  "查找业务字典明细 order_by 字段的最大值"
  findLastOrderByDictbizDetail: Int!
}
type Mutation {
  "批量创建业务字典明细"
  createsDictbizDetail(inputs: [DictbizDetailInput!]!, unique_type: UniqueType): [DictbizDetailId!]!
  "根据 id 修改业务字典明细"
  updateByIdDictbizDetail(id: DictbizDetailId!, input: DictbizDetailInput!): DictbizDetailId!
  "根据 ids 删除业务字典明细"
  deleteByIdsDictbizDetail(ids: [DictbizDetailId!]!): Int!
  "根据 ids 启用或者禁用业务字典明细"
  enableByIdsDictbizDetail(ids: [DictbizDetailId!]!, is_enabled: Int!): Int!
  "根据 ids 还原业务字典明细"
  revertByIdsDictbizDetail(ids: [DictbizDetailId!]!): Int!
  "根据 ids 彻底删除业务字典明细"
  forceDeleteByIdsDictbizDetail(ids: [DictbizDetailId!]!): Int!
}

`);
