import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./role.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `

type RoleModel {
  "ID"
  id: String!
  "名称"
  lbl: String!
  "菜单"
  menu_ids: [String!]
  "菜单"
  menu_ids_lbl: [String!]
  "锁定"
  is_locked: Int!
  "锁定"
  is_locked_lbl: String
  "启用"
  is_enabled: Int!
  "启用"
  is_enabled_lbl: String
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
type RoleFieldComment {
  "名称"
  lbl: String!
  "菜单"
  menu_ids: String!
  "菜单"
  menu_ids_lbl: String!
  "锁定"
  is_locked: String!
  "锁定"
  is_locked_lbl: String!
  "启用"
  is_enabled: String!
  "启用"
  is_enabled_lbl: String!
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
input RoleInput {
  ""
  id: String
  "名称"
  lbl: String
  "菜单"
  menu_ids: [String!]
  "菜单"
  menu_ids_lbl: [String!]
  "锁定"
  is_locked: Int
  "锁定"
  is_locked_lbl: String
  "启用"
  is_enabled: Int
  "启用"
  is_enabled_lbl: String
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
input RoleSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [String]
  "String"
  id: String
  "名称"
  lbl: String
  lbl_like: String
  "菜单"
  menu_ids: [String!]
  menu_ids_is_null: Boolean
  "锁定"
  is_locked: [Int!]
  "启用"
  is_enabled: [Int!]
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
  findCountRole(search: RoleSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllRole(search: RoleSearch, page: PageInput, sort: [SortInput!]): [RoleModel!]!
  "获取字段对应的名称"
  getFieldCommentsRole: RoleFieldComment!
  "根据条件查找第一条数据"
  findOneRole(search: RoleSearch, sort: [SortInput!]): RoleModel
  "根据id查找一条数据"
  findByIdRole(id: String!): RoleModel
}
type Mutation {
  "创建一条数据"
  createRole(model: RoleInput!): String!
  "根据id修改一条数据"
  updateByIdRole(id: String!, model: RoleInput!): String!
  "根据 ids 删除数据"
  deleteByIdsRole(ids: [String!]!): Int!
  "根据 ids 启用或者禁用数据"
  enableByIdsRole(ids: [String!]!, is_enabled: Int!): Int!
  "根据 ids 锁定或者解锁数据"
  lockByIdsRole(ids: [String!]!, is_locked: Int!): Int!
  "根据 ids 还原数据"
  revertByIdsRole(ids: [String!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsRole(ids: [String!]!): Int!
}

`);
