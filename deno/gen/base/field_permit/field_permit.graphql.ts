import { defineGraphql } from "/lib/context.ts";

import type { } from "./field_permit.model.ts";
import * as resolver from "./field_permit.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar FieldPermitId

type FieldPermitModel {
  "ID"
  id: FieldPermitId!
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
type FieldPermitFieldComment {
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
input FieldPermitInput {
  "ID"
  id: FieldPermitId
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
input FieldPermitSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [FieldPermitId!]
  "ID"
  id: FieldPermitId
  "菜单"
  menu_id: [MenuId!]
  "菜单"
  menu_id_is_null: Boolean
  "菜单"
  menu_id_lbl: [String!]
  "菜单"
  menu_id_lbl_like: String
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
  "根据条件查找字段权限总数"
  findCountFieldPermit(search: FieldPermitSearch): Int!
  "根据搜索条件和分页查找字段权限列表"
  findAllFieldPermit(search: FieldPermitSearch, page: PageInput, sort: [SortInput!]): [FieldPermitModel!]!
  "获取字段权限字段注释"
  getFieldCommentsFieldPermit: FieldPermitFieldComment!
  "根据条件查找第一个字段权限"
  findOneFieldPermit(search: FieldPermitSearch, sort: [SortInput!]): FieldPermitModel
  "根据 id 查找字段权限"
  findByIdFieldPermit(id: FieldPermitId!): FieldPermitModel
}
type Mutation {
  "批量创建字段权限"
  createsFieldPermit(inputs: [FieldPermitInput!]!, unique_type: UniqueType): [FieldPermitId!]!
  "根据 id 修改字段权限"
  updateByIdFieldPermit(id: FieldPermitId!, input: FieldPermitInput!): FieldPermitId!
  "根据 ids 删除字段权限"
  deleteByIdsFieldPermit(ids: [FieldPermitId!]!): Int!
  "根据 ids 还原字段权限"
  revertByIdsFieldPermit(ids: [FieldPermitId!]!): Int!
  "根据 ids 彻底删除字段权限"
  forceDeleteByIdsFieldPermit(ids: [FieldPermitId!]!): Int!
}

`);
