import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./data_permit.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar DataPermitId

"数据权限范围"
scalar DataPermitScope
"数据权限类型"
scalar DataPermitType

type DataPermitModel {
  "ID"
  id: String!
  "菜单"
  menu_id: String!
  "菜单"
  menu_id_lbl: MenuId
  "名称"
  lbl: String!
  "范围"
  scope: DataPermitScope
  "范围"
  scope_lbl: String!
  "类型"
  type: DataPermitType
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
type DataPermitFieldComment {
  "ID"
  id: String!
  "菜单"
  menu_id: String!
  "菜单"
  menu_id_lbl: String!
  "名称"
  lbl: String!
  "范围"
  scope: String!
  "范围"
  scope_lbl: String!
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
input DataPermitInput {
  ""
  id: DataPermitId
  "菜单"
  menu_id: String
  "菜单"
  menu_id_lbl: MenuId
  "名称"
  lbl: String
  "范围"
  scope: DataPermitScope
  "范围"
  scope_lbl: String
  "类型"
  type: DataPermitType
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
input DataPermitSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [String]
  "ID"
  id: DataPermitId
  "菜单"
  menu_id: [MenuId!]
  menu_id_is_null: Boolean
  "名称"
  lbl: String
  lbl_like: String
  "范围"
  scope: [String!]
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
  findCountDataPermit(search: DataPermitSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllDataPermit(search: DataPermitSearch, page: PageInput, sort: [SortInput!]): [DataPermitModel!]!
  "获取字段对应的名称"
  getFieldCommentsDataPermit: DataPermitFieldComment!
  "根据条件查找第一条数据"
  findOneDataPermit(search: DataPermitSearch, sort: [SortInput!]): DataPermitModel
  "根据id查找一条数据"
  findByIdDataPermit(id: String!): DataPermitModel
}
type Mutation {
  "创建一条数据"
  createDataPermit(model: DataPermitInput!, unique_type: UniqueType): String!
  "根据id修改一条数据"
  updateByIdDataPermit(id: String!, model: DataPermitInput!): String!
  "根据 ids 删除数据"
  deleteByIdsDataPermit(ids: [String!]!): Int!
  "根据 ids 还原数据"
  revertByIdsDataPermit(ids: [String!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsDataPermit(ids: [String!]!): Int!
}

`);
