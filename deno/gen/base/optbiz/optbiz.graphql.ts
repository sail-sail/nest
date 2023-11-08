import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./optbiz.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `

type OptbizModel {
  "ID"
  id: String!
  "名称"
  lbl: String!
  "键"
  ky: String!
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
  "版本号"
  version: Int!
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
type OptbizFieldComment {
  "名称"
  lbl: String!
  "键"
  ky: String!
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
  "版本号"
  version: String!
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
input OptbizInput {
  ""
  id: String
  "名称"
  lbl: String
  "键"
  ky: String
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
  "版本号"
  version: Int
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
input OptbizSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [String]
  "String"
  id: String
  "名称"
  lbl: String
  lbl_like: String
  "键"
  ky: String
  ky_like: String
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
  "版本号"
  version: [Int!]
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
  findCountOptbiz(search: OptbizSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllOptbiz(search: OptbizSearch, page: PageInput, sort: [SortInput!]): [OptbizModel!]!
  "获取字段对应的名称"
  getFieldCommentsOptbiz: OptbizFieldComment!
  "根据条件查找第一条数据"
  findOneOptbiz(search: OptbizSearch, sort: [SortInput!]): OptbizModel
  "根据id查找一条数据"
  findByIdOptbiz(id: String!): OptbizModel
  "查找order_by字段的最大值"
  findLastOrderByOptbiz: Int!
}
type Mutation {
  "创建一条数据"
  createOptbiz(model: OptbizInput!, unique_type: UniqueType): String!
  "根据id修改一条数据"
  updateByIdOptbiz(id: String!, model: OptbizInput!): String!
  "根据 ids 删除数据"
  deleteByIdsOptbiz(ids: [String!]!): Int!
  "根据 ids 启用或者禁用数据"
  enableByIdsOptbiz(ids: [String!]!, is_enabled: Int!): Int!
  "根据 ids 锁定或者解锁数据"
  lockByIdsOptbiz(ids: [String!]!, is_locked: Int!): Int!
  "根据 ids 还原数据"
  revertByIdsOptbiz(ids: [String!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsOptbiz(ids: [String!]!): Int!
}

`);
