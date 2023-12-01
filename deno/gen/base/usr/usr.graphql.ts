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
  ""
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
  "根据条件查找据数总数"
  findCountUsr(search: UsrSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllUsr(search: UsrSearch, page: PageInput, sort: [SortInput!]): [UsrModel!]!
  "获取字段对应的名称"
  getFieldCommentsUsr: UsrFieldComment!
  "根据条件查找第一条数据"
  findOneUsr(search: UsrSearch, sort: [SortInput!]): UsrModel
  "根据id查找一条数据"
  findByIdUsr(id: UsrId!): UsrModel
  "查找order_by字段的最大值"
  findLastOrderByUsr: Int!
}
type Mutation {
  "创建一条数据"
  createUsr(model: UsrInput!, unique_type: UniqueType): UsrId!
  "根据id修改一条数据"
  updateByIdUsr(id: UsrId!, model: UsrInput!): UsrId!
  "根据 ids 删除数据"
  deleteByIdsUsr(ids: [UsrId!]!): Int!
  "根据 ids 启用或者禁用数据"
  enableByIdsUsr(ids: [UsrId!]!, is_enabled: Int!): Int!
  "根据 ids 锁定或者解锁数据"
  lockByIdsUsr(ids: [UsrId!]!, is_locked: Int!): Int!
  "根据 ids 还原数据"
  revertByIdsUsr(ids: [UsrId!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsUsr(ids: [UsrId!]!): Int!
}

`);
