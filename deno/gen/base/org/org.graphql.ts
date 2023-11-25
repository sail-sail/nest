import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./org.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar OrgId


type OrgModel {
  "ID"
  id: String!
  "名称"
  lbl: String!
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
}
type OrgFieldComment {
  "名称"
  lbl: String!
  "锁定"
  is_locked: String!
  "启用"
  is_enabled: String!
  "排序"
  order_by: String!
  "备注"
  rem: String!
  "创建人"
  create_usr_id: String!
  "创建时间"
  create_time: String!
  "创建时间"
  create_time_lbl: String!
  "更新人"
  update_usr_id: String!
  "更新时间"
  update_time: String!
  "更新时间"
  update_time_lbl: String!
}
input OrgInput {
  ""
  id: OrgId
  "名称"
  lbl: String
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
}
input OrgSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [String]
  "ID"
  id: OrgId
  "名称"
  lbl: String
  lbl_like: String
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
  findCountOrg(search: OrgSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllOrg(search: OrgSearch, page: PageInput, sort: [SortInput!]): [OrgModel!]!
  "获取字段对应的名称"
  getFieldCommentsOrg: OrgFieldComment!
  "根据条件查找第一条数据"
  findOneOrg(search: OrgSearch, sort: [SortInput!]): OrgModel
  "根据id查找一条数据"
  findByIdOrg(id: String!): OrgModel
  "查找order_by字段的最大值"
  findLastOrderByOrg: Int!
}
type Mutation {
  "创建一条数据"
  createOrg(model: OrgInput!, unique_type: UniqueType): String!
  "根据id修改一条数据"
  updateByIdOrg(id: String!, model: OrgInput!): String!
  "根据 ids 删除数据"
  deleteByIdsOrg(ids: [String!]!): Int!
  "根据 ids 启用或者禁用数据"
  enableByIdsOrg(ids: [String!]!, is_enabled: Int!): Int!
  "根据 ids 锁定或者解锁数据"
  lockByIdsOrg(ids: [String!]!, is_locked: Int!): Int!
  "根据 ids 还原数据"
  revertByIdsOrg(ids: [String!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsOrg(ids: [String!]!): Int!
}

`);
