import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./usr.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `

type UsrModel {
  "ID"
  id: String!
  "头像"
  img: String!
  "名称"
  lbl: String!
  "用户名"
  username: String!
  "密码"
  password: String!
  "默认组织"
  default_org_id: String!
  "默认组织"
  default_org_id_lbl: String
  "锁定"
  is_locked: Int!
  "锁定"
  is_locked_lbl: String
  "启用"
  is_enabled: Int!
  "启用"
  is_enabled_lbl: String
  "所属组织"
  org_ids: [String!]
  "所属组织"
  org_ids_lbl: [String!]
  "所属部门"
  dept_ids: [String!]
  "所属部门"
  dept_ids_lbl: [String!]
  "拥有角色"
  role_ids: [String!]
  "拥有角色"
  role_ids_lbl: [String!]
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
type UsrFieldComment {
  "头像"
  img: String!
  "名称"
  lbl: String!
  "用户名"
  username: String!
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
  "所属组织"
  org_ids: String!
  "所属组织"
  org_ids_lbl: String!
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
  id: String
  "头像"
  img: String
  "名称"
  lbl: String
  "用户名"
  username: String
  "密码"
  password: String
  "默认组织"
  default_org_id: String
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
  "所属组织"
  org_ids: [String!]
  "所属组织"
  org_ids_lbl: [String!]
  "所属部门"
  dept_ids: [String!]
  "所属部门"
  dept_ids_lbl: [String!]
  "拥有角色"
  role_ids: [String!]
  "拥有角色"
  role_ids_lbl: [String!]
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
input UsrSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [String]
  "String"
  id: String
  "头像"
  img: String
  img_like: String
  "名称"
  lbl: String
  lbl_like: String
  "用户名"
  username: String
  username_like: String
  "默认组织"
  default_org_id: [String!]
  default_org_id_is_null: Boolean
  "锁定"
  is_locked: [Int!]
  "启用"
  is_enabled: [Int!]
  "所属组织"
  org_ids: [String!]
  org_ids_is_null: Boolean
  "所属部门"
  dept_ids: [String!]
  dept_ids_is_null: Boolean
  "拥有角色"
  role_ids: [String!]
  role_ids_is_null: Boolean
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
  findCountUsr(search: UsrSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllUsr(search: UsrSearch, page: PageInput, sort: [SortInput!]): [UsrModel!]!
  "获取字段对应的名称"
  getFieldCommentsUsr: UsrFieldComment!
  "根据条件查找第一条数据"
  findOneUsr(search: UsrSearch, sort: [SortInput!]): UsrModel
  "根据id查找一条数据"
  findByIdUsr(id: String!): UsrModel
}
type Mutation {
  "创建一条数据"
  createUsr(model: UsrInput!, unique_type: UniqueType): String!
  "根据id修改一条数据"
  updateByIdUsr(id: String!, model: UsrInput!): String!
  "根据 ids 删除数据"
  deleteByIdsUsr(ids: [String!]!): Int!
  "根据 ids 启用或者禁用数据"
  enableByIdsUsr(ids: [String!]!, is_enabled: Int!): Int!
  "根据 ids 锁定或者解锁数据"
  lockByIdsUsr(ids: [String!]!, is_locked: Int!): Int!
  "根据 ids 还原数据"
  revertByIdsUsr(ids: [String!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsUsr(ids: [String!]!): Int!
}

`);
