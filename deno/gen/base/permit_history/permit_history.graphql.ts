import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./permit_history.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `

type PermitHistoryModel {
  "ID"
  id: String!
  "权限"
  permit_id: String!
  "权限"
  permit_id_lbl: String
  "角色"
  role_id: String!
  "角色"
  role_id_lbl: String
  "菜单"
  menu_id: String!
  "菜单"
  menu_id_lbl: String
  "编码"
  code: String!
  "名称"
  lbl: String!
  "可见"
  is_visible: Int!
  "可见"
  is_visible_lbl: String
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
type PermitHistoryFieldComment {
  "权限"
  permit_id: String!
  "权限"
  permit_id_lbl: String!
  "角色"
  role_id: String!
  "角色"
  role_id_lbl: String!
  "菜单"
  menu_id: String!
  "菜单"
  menu_id_lbl: String!
  "编码"
  code: String!
  "名称"
  lbl: String!
  "可见"
  is_visible: String!
  "可见"
  is_visible_lbl: String!
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
input PermitHistoryInput {
  ""
  id: String
  "权限"
  permit_id: String
  "权限"
  permit_id_lbl: String
  "角色"
  role_id: String
  "角色"
  role_id_lbl: String
  "菜单"
  menu_id: String
  "菜单"
  menu_id_lbl: String
  "编码"
  code: String
  "名称"
  lbl: String
  "可见"
  is_visible: Int
  "可见"
  is_visible_lbl: String
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
input PermitHistorySearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [String]
  "String"
  id: String
  "权限"
  permit_id: [String!]
  permit_id_is_null: Boolean
  "角色"
  role_id: [String!]
  role_id_is_null: Boolean
  "菜单"
  menu_id: [String!]
  menu_id_is_null: Boolean
  "编码"
  code: String
  code_like: String
  "名称"
  lbl: String
  lbl_like: String
  "可见"
  is_visible: [Int!]
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
  findCountPermitHistory(search: PermitHistorySearch): Int!
  "根据搜索条件和分页查找数据"
  findAllPermitHistory(search: PermitHistorySearch, page: PageInput, sort: [SortInput!]): [PermitHistoryModel!]!
  "获取字段对应的名称"
  getFieldCommentsPermitHistory: PermitHistoryFieldComment!
  "根据条件查找第一条数据"
  findOnePermitHistory(search: PermitHistorySearch, sort: [SortInput!]): PermitHistoryModel
  "根据id查找一条数据"
  findByIdPermitHistory(id: String!): PermitHistoryModel
}
type Mutation {
  "创建一条数据"
  createPermitHistory(model: PermitHistoryInput!): String!
  "根据id修改一条数据"
  updateByIdPermitHistory(id: String!, model: PermitHistoryInput!): String!
  "根据 ids 删除数据"
  deleteByIdsPermitHistory(ids: [String!]!): Int!
  "根据 ids 还原数据"
  revertByIdsPermitHistory(ids: [String!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsPermitHistory(ids: [String!]!): Int!
}

`);
