import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./permit.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar PermitId


type PermitModel {
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
type PermitFieldComment {
  "菜单"
  menu_id: String!
  "编码"
  code: String!
  "名称"
  lbl: String!
  "备注"
  rem: String!
  "创建人"
  create_usr_id: String!
  "创建时间"
  create_time: String!
  "创建时间"
  create_time_lbl: String!
  "更新人"
  update_usr_id: String!
  "更新时间"
  update_time: String!
  "更新时间"
  update_time_lbl: String!
}
input PermitInput {
  ""
  id: PermitId
  "菜单"
  menu_id: String
  "菜单"
  menu_id_lbl: MenuId
  "编码"
  code: String
  "名称"
  lbl: String
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
input PermitSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [String]
  "ID"
  id: PermitId
  "菜单"
  menu_id: [MenuId!]
  menu_id_is_null: Boolean
  "编码"
  code: String
  code_like: String
  "名称"
  lbl: String
  lbl_like: String
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
  findCountPermit(search: PermitSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllPermit(search: PermitSearch, page: PageInput, sort: [SortInput!]): [PermitModel!]!
  "获取字段对应的名称"
  getFieldCommentsPermit: PermitFieldComment!
  "根据条件查找第一条数据"
  findOnePermit(search: PermitSearch, sort: [SortInput!]): PermitModel
  "根据id查找一条数据"
  findByIdPermit(id: String!): PermitModel
}
type Mutation {
  "创建一条数据"
  createPermit(model: PermitInput!, unique_type: UniqueType): String!
  "根据id修改一条数据"
  updateByIdPermit(id: String!, model: PermitInput!): String!
  "根据 ids 删除数据"
  deleteByIdsPermit(ids: [String!]!): Int!
  "根据 ids 还原数据"
  revertByIdsPermit(ids: [String!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsPermit(ids: [String!]!): Int!
}

`);
