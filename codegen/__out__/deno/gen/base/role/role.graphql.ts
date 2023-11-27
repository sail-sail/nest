import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./role.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar RoleId


type RoleModel {
  "ID"
  id: String!
  "名称"
  lbl: String!
  "首页"
  home_url: String!
  "菜单权限"
  menu_ids: [String!]
  "菜单权限"
  menu_ids_lbl: [MenuId!]
  "按钮权限"
  permit_ids: [String!]
  "按钮权限"
  permit_ids_lbl: [PermitId!]
  "数据权限"
  data_permit_ids: [String!]
  "数据权限"
  data_permit_ids_lbl: [DataPermitId!]
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
type RoleFieldComment {
  "ID"
  id: String!
  "名称"
  lbl: String!
  "首页"
  home_url: String!
  "菜单权限"
  menu_ids: String!
  "菜单权限"
  menu_ids_lbl: String!
  "按钮权限"
  permit_ids: String!
  "按钮权限"
  permit_ids_lbl: String!
  "数据权限"
  data_permit_ids: String!
  "数据权限"
  data_permit_ids_lbl: String!
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
input RoleInput {
  ""
  id: RoleId
  "名称"
  lbl: String
  "首页"
  home_url: String
  "菜单权限"
  menu_ids: [String!]
  "菜单权限"
  menu_ids_lbl: [MenuId!]
  "按钮权限"
  permit_ids: [String!]
  "按钮权限"
  permit_ids_lbl: [PermitId!]
  "数据权限"
  data_permit_ids: [String!]
  "数据权限"
  data_permit_ids_lbl: [DataPermitId!]
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
input RoleSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [String]
  "ID"
  id: RoleId
  "名称"
  lbl: String
  lbl_like: String
  "首页"
  home_url: String
  home_url_like: String
  "菜单权限"
  menu_ids: [MenuId!]
  menu_ids_is_null: Boolean
  "按钮权限"
  permit_ids: [PermitId!]
  permit_ids_is_null: Boolean
  "数据权限"
  data_permit_ids: [DataPermitId!]
  data_permit_ids_is_null: Boolean
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
  findCountRole(search: RoleSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllRole(search: RoleSearch, page: PageInput, sort: [SortInput!]): [RoleModel!]!
  "获取字段对应的名称"
  getFieldCommentsRole: RoleFieldComment!
  "根据条件查找第一条数据"
  findOneRole(search: RoleSearch, sort: [SortInput!]): RoleModel
  "根据id查找一条数据"
  findByIdRole(id: String!): RoleModel
  "查找order_by字段的最大值"
  findLastOrderByRole: Int!
}
type Mutation {
  "创建一条数据"
  createRole(model: RoleInput!, unique_type: UniqueType): String!
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
