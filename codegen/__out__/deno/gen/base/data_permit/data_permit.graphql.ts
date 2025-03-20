import { defineGraphql } from "/lib/context.ts";

import type { } from "./data_permit.model.ts";
import * as resolver from "./data_permit.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar DataPermitId

"数据权限范围"
enum DataPermitScope {
  "创建人"
  create
  "本部门"
  dept
  "本部门及其所有上级"
  dept_parent
  "本角色"
  role
  "本租户"
  tenant
}

"数据权限类型"
enum DataPermitType {
  "可见不可改且不可删"
  readonly
  "可见可改且可删"
  editable
}

type DataPermitModel {
  "ID"
  id: DataPermitId!
  "菜单"
  menu_id: MenuId!
  "菜单"
  menu_id_lbl: String!
  "范围"
  scope: DataPermitScope!
  "范围"
  scope_lbl: String!
  "类型"
  type: DataPermitType!
  "类型"
  type_lbl: String!
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
type DataPermitFieldComment {
  "ID"
  id: String!
  "菜单"
  menu_id: String!
  "菜单"
  menu_id_lbl: String!
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
  "ID"
  id: DataPermitId
  "菜单"
  menu_id: MenuId
  "菜单"
  menu_id_lbl: String
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
}
input DataPermitSearch {
  "已删除"
  is_deleted: Int
  "ID列表"
  ids: [DataPermitId!]
  "ID"
  id: DataPermitId
  "菜单"
  menu_id: [MenuId!]
  "菜单"
  menu_id_is_null: Boolean
  "菜单"
  menu_id_lbl: [String!]
  "菜单"
  menu_id_lbl_like: String
  "范围"
  scope: [DataPermitScope!]
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
  "根据条件查找数据权限总数"
  findCountDataPermit(search: DataPermitSearch): Int!
  "根据搜索条件和分页查找数据权限列表"
  findAllDataPermit(search: DataPermitSearch, page: PageInput, sort: [SortInput!]): [DataPermitModel!]!
  "获取数据权限字段注释"
  getFieldCommentsDataPermit: DataPermitFieldComment!
  "根据条件查找第一个数据权限"
  findOneDataPermit(search: DataPermitSearch, sort: [SortInput!]): DataPermitModel
  "根据 id 查找数据权限"
  findByIdDataPermit(id: DataPermitId!): DataPermitModel
  "根据 ids 查找数据权限"
  findByIdsDataPermit(ids: [DataPermitId!]!): [DataPermitModel]!
}
type Mutation {
  "批量创建数据权限"
  createsDataPermit(inputs: [DataPermitInput!]!, unique_type: UniqueType): [DataPermitId!]!
  "根据 id 修改数据权限"
  updateByIdDataPermit(id: DataPermitId!, input: DataPermitInput!): DataPermitId!
  "根据 ids 删除数据权限"
  deleteByIdsDataPermit(ids: [DataPermitId!]!): Int!
  "根据 ids 还原数据权限"
  revertByIdsDataPermit(ids: [DataPermitId!]!): Int!
  "根据 ids 彻底删除数据权限"
  forceDeleteByIdsDataPermit(ids: [DataPermitId!]!): Int!
}

`);
