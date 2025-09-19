import { defineGraphql } from "/lib/context.ts";

import type { } from "./optbiz.model.ts";
import * as resolver from "./optbiz.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar OptbizId

type OptbizModel {
  "ID"
  id: OptbizId!
  "名称"
  lbl: String!
  "键"
  ky: String!
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
  "版本号"
  version: Int!
  "已删除"
  is_deleted: Int!
  "系统字段"
  is_sys: Int!
}
type OptbizFieldComment {
  "ID"
  id: String!
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
  "ID"
  id: OptbizId
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
}
input OptbizSearch {
  "已删除"
  is_deleted: Int
  "ID列表"
  ids: [OptbizId!]
  "关键字"
  keyword: String
  "ID"
  id: OptbizId
  "名称"
  lbl: String
  lbl_like: String
  "键"
  ky: String
  ky_like: String
  "值"
  val: String
  val_like: String
  "启用"
  is_enabled: [Int!]
  "备注"
  rem: String
  rem_like: String
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
  "根据条件查找业务选项总数"
  findCountOptbiz(search: OptbizSearch): Int!
  "根据搜索条件和分页查找业务选项列表"
  findAllOptbiz(search: OptbizSearch, page: PageInput, sort: [SortInput!]): [OptbizModel!]!
  "获取业务选项字段注释"
  getFieldCommentsOptbiz: OptbizFieldComment!
  "根据条件查找第一个业务选项"
  findOneOptbiz(search: OptbizSearch, sort: [SortInput!]): OptbizModel
  "根据 id 查找业务选项"
  findByIdOptbiz(id: OptbizId!): OptbizModel
  "根据 ids 查找业务选项"
  findByIdsOptbiz(ids: [OptbizId!]!): [OptbizModel]!
  "查找业务选项 order_by 字段的最大值"
  findLastOrderByOptbiz: Int!
}
type Mutation {
  "批量创建业务选项"
  createsOptbiz(inputs: [OptbizInput!]!, unique_type: UniqueType): [OptbizId!]!
  "根据 id 修改业务选项"
  updateByIdOptbiz(id: OptbizId!, input: OptbizInput!): OptbizId!
  "根据 ids 删除业务选项"
  deleteByIdsOptbiz(ids: [OptbizId!]!): Int!
  "根据 ids 启用或者禁用业务选项"
  enableByIdsOptbiz(ids: [OptbizId!]!, is_enabled: Int!): Int!
  "根据 ids 锁定或者解锁业务选项"
  lockByIdsOptbiz(ids: [OptbizId!]!, is_locked: Int!): Int!
  "根据 ids 还原业务选项"
  revertByIdsOptbiz(ids: [OptbizId!]!): Int!
  "根据 ids 彻底删除业务选项"
  forceDeleteByIdsOptbiz(ids: [OptbizId!]!): Int!
}

`);
