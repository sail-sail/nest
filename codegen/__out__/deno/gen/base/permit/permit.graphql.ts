import { defineGraphql } from "/lib/context.ts";

import type { } from "./permit.model.ts";
import * as resolver from "./permit.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar PermitId

type PermitModel {
  "ID"
  id: PermitId!
  "菜单"
  menu_id: MenuId!
  "菜单"
  menu_id_lbl: String!
  "编码"
  code: String!
  "名称"
  lbl: String!
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
  "是否已删除"
  is_deleted: Int!
}
type PermitFieldComment {
  "ID"
  id: String!
  "菜单"
  menu_id: String!
  "菜单"
  menu_id_lbl: String!
  "编码"
  code: String!
  "名称"
  lbl: String!
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
input PermitInput {
  "ID"
  id: PermitId
  "菜单"
  menu_id: MenuId
  "菜单"
  menu_id_lbl: String
  "编码"
  code: String
  "名称"
  lbl: String
  "备注"
  rem: String
}
input PermitSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [PermitId!]
  "ID"
  id: PermitId
  "菜单"
  menu_id: [MenuId!]
  "菜单"
  menu_id_is_null: Boolean
  "编码"
  code: String
  code_like: String
  "名称"
  lbl: String
  lbl_like: String
  "创建人"
  create_usr_id: [UsrId!]
  "创建人"
  create_usr_id_is_null: Boolean
  "创建人"
  create_usr_id_lbl: [String!]
  "更新人"
  update_usr_id: [UsrId!]
  "更新人"
  update_usr_id_is_null: Boolean
  "更新人"
  update_usr_id_lbl: [String!]
}
type Query {
  "根据条件查找按钮权限总数"
  findCountPermit(search: PermitSearch): Int!
  "根据搜索条件和分页查找按钮权限列表"
  findAllPermit(search: PermitSearch, page: PageInput, sort: [SortInput!]): [PermitModel!]!
  "获取按钮权限字段注释"
  getFieldCommentsPermit: PermitFieldComment!
  "根据条件查找第一个按钮权限"
  findOnePermit(search: PermitSearch, sort: [SortInput!]): PermitModel
  "根据 id 查找按钮权限"
  findByIdPermit(id: PermitId!): PermitModel
}
type Mutation {
  "批量创建按钮权限"
  createsPermit(inputs: [PermitInput!]!, unique_type: UniqueType): [PermitId!]!
  "根据 id 修改按钮权限"
  updateByIdPermit(id: PermitId!, input: PermitInput!): PermitId!
  "根据 ids 删除按钮权限"
  deleteByIdsPermit(ids: [PermitId!]!): Int!
  "根据 ids 还原按钮权限"
  revertByIdsPermit(ids: [PermitId!]!): Int!
  "根据 ids 彻底删除按钮权限"
  forceDeleteByIdsPermit(ids: [PermitId!]!): Int!
}

`);
