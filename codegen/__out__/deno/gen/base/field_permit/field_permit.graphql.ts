import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./field_permit.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar FieldPermitId

"字段权限类型"
scalar FieldPermitType

type FieldPermitModel {
  "ID"
  id: String!
  "菜单"
  menu_id: String!
  "菜单"
  menu_id_lbl: MenuId
  "编码"
  code: String!
  "名称"
  lbl: String!
  "类型"
  type: FieldPermitType
  "类型"
  type_lbl: String!
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
  "类型"
  type: String!
  "类型"
  type_lbl: String!
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
  ""
  id: FieldPermitId
  "菜单"
  menu_id: String
  "菜单"
  menu_id_lbl: MenuId
  "编码"
  code: String
  "名称"
  lbl: String
  "类型"
  type: FieldPermitType
  "类型"
  type_lbl: String
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
input FieldPermitSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [String]
  "ID"
  id: FieldPermitId
  "菜单"
  menu_id: [MenuId!]
  menu_id_is_null: Boolean
  "编码"
  code: String
  code_like: String
  "名称"
  lbl: String
  lbl_like: String
  "类型"
  type: [String!]
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
  findCountFieldPermit(search: FieldPermitSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllFieldPermit(search: FieldPermitSearch, page: PageInput, sort: [SortInput!]): [FieldPermitModel!]!
  "获取字段对应的名称"
  getFieldCommentsFieldPermit: FieldPermitFieldComment!
  "根据条件查找第一条数据"
  findOneFieldPermit(search: FieldPermitSearch, sort: [SortInput!]): FieldPermitModel
  "根据id查找一条数据"
  findByIdFieldPermit(id: String!): FieldPermitModel
}
type Mutation {
  "创建一条数据"
  createFieldPermit(model: FieldPermitInput!, unique_type: UniqueType): String!
  "根据id修改一条数据"
  updateByIdFieldPermit(id: String!, model: FieldPermitInput!): String!
  "根据 ids 删除数据"
  deleteByIdsFieldPermit(ids: [String!]!): Int!
  "根据 ids 还原数据"
  revertByIdsFieldPermit(ids: [String!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsFieldPermit(ids: [String!]!): Int!
}

`);
