import { defineGraphql } from "/lib/context.ts";

import type { } from "./role.model.ts";
import * as resolver from "./role.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar RoleId

type RoleModel {
  "ID"
  id: RoleId!
  "编码"
  code: String!
  "名称"
  lbl: String!
  "首页"
  home_url: String!
  "菜单权限"
  menu_ids: [MenuId!]!
  "菜单权限"
  menu_ids_lbl: [String!]!
  "按钮权限"
  permit_ids: [PermitId!]!
  "按钮权限"
  permit_ids_lbl: [String!]!
  "数据权限"
  data_permit_ids: [DataPermitId!]!
  "字段权限"
  field_permit_ids: [FieldPermitId!]!
  "字段权限"
  field_permit_ids_lbl: [String!]!
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
  "已删除"
  is_deleted: Int!
  "系统字段"
  is_sys: Int!
}
type RoleFieldComment {
  "ID"
  id: String!
  "编码"
  code: String!
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
  "字段权限"
  field_permit_ids: String!
  "字段权限"
  field_permit_ids_lbl: String!
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
  "ID"
  id: RoleId
  "编码"
  code: String
  "名称"
  lbl: String
  "首页"
  home_url: String
  "菜单权限"
  menu_ids: [MenuId!]
  "菜单权限"
  menu_ids_lbl: [String!]
  "按钮权限"
  permit_ids: [PermitId!]
  "按钮权限"
  permit_ids_lbl: [String!]
  "数据权限"
  data_permit_ids: [DataPermitId!]
  "字段权限"
  field_permit_ids: [FieldPermitId!]
  "字段权限"
  field_permit_ids_lbl: [String!]
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
}
input RoleSearch {
  "已删除"
  is_deleted: Int
  "ID列表"
  ids: [RoleId!]
  "ID"
  id: RoleId
  "编码"
  code: String
  code_like: String
  "名称"
  lbl: String
  lbl_like: String
  "菜单权限"
  menu_ids: [MenuId!]
  "菜单权限"
  menu_ids_is_null: Boolean
  "菜单权限"
  menu_ids_lbl: [String!]
  "菜单权限"
  menu_ids_lbl_like: String
  "按钮权限"
  permit_ids: [PermitId!]
  "按钮权限"
  permit_ids_is_null: Boolean
  "按钮权限"
  permit_ids_lbl: [String!]
  "按钮权限"
  permit_ids_lbl_like: String
  "数据权限"
  data_permit_ids: [DataPermitId!]
  "数据权限"
  data_permit_ids_is_null: Boolean
  "字段权限"
  field_permit_ids: [FieldPermitId!]
  "字段权限"
  field_permit_ids_is_null: Boolean
  "字段权限"
  field_permit_ids_lbl: [String!]
  "字段权限"
  field_permit_ids_lbl_like: String
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
  "根据条件查找角色总数"
  findCountRole(search: RoleSearch): Int!
  "根据搜索条件和分页查找角色列表"
  findAllRole(search: RoleSearch, page: PageInput, sort: [SortInput!]): [RoleModel!]!
  "获取角色字段注释"
  getFieldCommentsRole: RoleFieldComment!
  "根据条件查找第一个角色"
  findOneRole(search: RoleSearch, sort: [SortInput!]): RoleModel
  "根据 id 查找角色"
  findByIdRole(id: RoleId!): RoleModel
  "根据 ids 查找角色"
  findByIdsRole(ids: [RoleId!]!): [RoleModel]!
  "查找角色 order_by 字段的最大值"
  findLastOrderByRole: Int!
}
type Mutation {
  "批量创建角色"
  createsRole(inputs: [RoleInput!]!, unique_type: UniqueType): [RoleId!]!
  "根据 id 修改角色"
  updateByIdRole(id: RoleId!, input: RoleInput!): RoleId!
  "根据 ids 删除角色"
  deleteByIdsRole(ids: [RoleId!]!): Int!
  "根据 ids 启用或者禁用角色"
  enableByIdsRole(ids: [RoleId!]!, is_enabled: Int!): Int!
  "根据 ids 锁定或者解锁角色"
  lockByIdsRole(ids: [RoleId!]!, is_locked: Int!): Int!
  "根据 ids 还原角色"
  revertByIdsRole(ids: [RoleId!]!): Int!
  "根据 ids 彻底删除角色"
  forceDeleteByIdsRole(ids: [RoleId!]!): Int!
}

`);
