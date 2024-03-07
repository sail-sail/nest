import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./usr.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar UsrId


type UsrModel {
  "ID"
  id: UsrId!
  "头像"
  img: String!
  "名称"
  lbl: String!
  "用户名"
  username: String!
  "密码"
  password: String!
  "所属组织"
  org_ids: [OrgId!]
  "所属组织"
  org_ids_lbl: [String!]
  "默认组织"
  default_org_id: OrgId!
  "默认组织"
  default_org_id_lbl: String
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
  "所属部门"
  dept_ids: [DeptId!]
  "所属部门"
  dept_ids_lbl: [String!]
  "拥有角色"
  role_ids: [RoleId!]
  "拥有角色"
  role_ids_lbl: [String!]
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
type UsrFieldComment {
  "ID"
  id: String!
  "头像"
  img: String!
  "名称"
  lbl: String!
  "用户名"
  username: String!
  "所属组织"
  org_ids: String!
  "所属组织"
  org_ids_lbl: String!
  "默认组织"
  default_org_id: String!
  "默认组织"
  default_org_id_lbl: String!
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
  "所属部门"
  dept_ids: String!
  "所属部门"
  dept_ids_lbl: String!
  "拥有角色"
  role_ids: String!
  "拥有角色"
  role_ids_lbl: String!
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
input UsrInput {
  "ID"
  id: UsrId
  "头像"
  img: String
  "名称"
  lbl: String
  "用户名"
  username: String
  "密码"
  password: String
  "所属组织"
  org_ids: [OrgId!]
  "所属组织"
  org_ids_lbl: [String!]
  "默认组织"
  default_org_id: OrgId
  "默认组织"
  default_org_id_lbl: String
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
  "所属部门"
  dept_ids: [DeptId!]
  "所属部门"
  dept_ids_lbl: [String!]
  "拥有角色"
  role_ids: [RoleId!]
  "拥有角色"
  role_ids_lbl: [String!]
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
input UsrSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [UsrId!]
  "ID"
  id: UsrId
  "头像"
  img: String
  img_like: String
  "名称"
  lbl: String
  lbl_like: String
  "用户名"
  username: String
  username_like: String
  "所属组织"
  org_ids: [OrgId!]
  org_ids_is_null: Boolean
  "默认组织"
  default_org_id: [OrgId!]
  default_org_id_is_null: Boolean
  "锁定"
  is_locked: [Int!]
  "启用"
  is_enabled: [Int!]
  "排序"
  order_by: [Int!]
  "所属部门"
  dept_ids: [DeptId!]
  dept_ids_is_null: Boolean
  "拥有角色"
  role_ids: [RoleId!]
  role_ids_is_null: Boolean
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
  "根据条件查找用户总数"
  findCountUsr(search: UsrSearch): Int!
  "根据搜索条件和分页查找用户列表"
  findAllUsr(search: UsrSearch, page: PageInput, sort: [SortInput!]): [UsrModel!]!
  "获取用户字段注释"
  getFieldCommentsUsr: UsrFieldComment!
  "根据条件查找第一个用户"
  findOneUsr(search: UsrSearch, sort: [SortInput!]): UsrModel
  "根据 id 查找用户"
  findByIdUsr(id: UsrId!): UsrModel
  "查找 用户 order_by 字段的最大值"
  findLastOrderByUsr: Int!
}
type Mutation {
  "创建用户"
  createUsr(input: UsrInput!, unique_type: UniqueType): UsrId!
  "根据 id 修改用户"
  updateByIdUsr(id: UsrId!, input: UsrInput!): UsrId!
  "根据 ids 删除用户"
  deleteByIdsUsr(ids: [UsrId!]!): Int!
  "根据 ids 启用或者禁用用户"
  enableByIdsUsr(ids: [UsrId!]!, is_enabled: Int!): Int!
  "根据 ids 锁定或者解锁用户"
  lockByIdsUsr(ids: [UsrId!]!, is_locked: Int!): Int!
  "根据 ids 还原用户"
  revertByIdsUsr(ids: [UsrId!]!): Int!
  "根据 ids 彻底删除用户"
  forceDeleteByIdsUsr(ids: [UsrId!]!): Int!
}

`);
