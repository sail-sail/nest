import { defineGraphql } from "/lib/context.ts";

import type { } from "./dept.model.ts";
import * as resolver from "./dept.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar DeptId

type DeptModel {
  "ID"
  id: DeptId!
  "父部门"
  parent_id: DeptId!
  "父部门"
  parent_id_lbl: String!
  "名称"
  lbl: String!
  "部门负责人"
  usr_ids: [UsrId!]!
  "部门负责人"
  usr_ids_lbl: [String!]!
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
  "组织"
  org_id: OrgId!
  "组织"
  org_id_lbl: String!
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
}
type DeptFieldComment {
  "ID"
  id: String!
  "父部门"
  parent_id: String!
  "父部门"
  parent_id_lbl: String!
  "名称"
  lbl: String!
  "部门负责人"
  usr_ids: String!
  "部门负责人"
  usr_ids_lbl: String!
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
  "组织"
  org_id: String!
  "组织"
  org_id_lbl: String!
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
input DeptInput {
  "ID"
  id: DeptId
  "父部门"
  parent_id: DeptId
  "父部门"
  parent_id_lbl: String
  "名称"
  lbl: String
  "部门负责人"
  usr_ids: [UsrId!]
  "部门负责人"
  usr_ids_lbl: [String!]
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
  "组织"
  org_id: OrgId
  "组织"
  org_id_lbl: String
  "备注"
  rem: String
}
input DeptSearch {
  "已删除"
  is_deleted: Int
  "ID列表"
  ids: [DeptId!]
  "ID"
  id: DeptId
  "父部门"
  parent_id: [DeptId!]
  "父部门"
  parent_id_is_null: Boolean
  "父部门"
  parent_id_lbl: [String!]
  "父部门"
  parent_id_lbl_like: String
  "名称"
  lbl: String
  lbl_like: String
  "部门负责人"
  usr_ids: [UsrId!]
  "部门负责人"
  usr_ids_is_null: Boolean
  "部门负责人"
  usr_ids_lbl: [String!]
  "部门负责人"
  usr_ids_lbl_like: String
  "启用"
  is_enabled: [Int!]
  "组织"
  org_id: [OrgId!]
  "组织"
  org_id_is_null: Boolean
  "组织"
  org_id_lbl: [String!]
  "组织"
  org_id_lbl_like: String
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
  "根据条件查找部门总数"
  findCountDept(search: DeptSearch): Int!
  "根据搜索条件和分页查找部门列表"
  findAllDept(search: DeptSearch, page: PageInput, sort: [SortInput!]): [DeptModel!]!
  "获取部门字段注释"
  getFieldCommentsDept: DeptFieldComment!
  "根据条件查找第一个部门"
  findOneDept(search: DeptSearch, sort: [SortInput!]): DeptModel
  "根据 id 查找部门"
  findByIdDept(id: DeptId!): DeptModel
  "根据 ids 查找部门"
  findByIdsDept(ids: [DeptId!]!): [DeptModel]!
  "查找部门 order_by 字段的最大值"
  findLastOrderByDept: Int!
}
type Mutation {
  "批量创建部门"
  createsDept(inputs: [DeptInput!]!, unique_type: UniqueType): [DeptId!]!
  "根据 id 修改部门"
  updateByIdDept(id: DeptId!, input: DeptInput!): DeptId!
  "根据 ids 删除部门"
  deleteByIdsDept(ids: [DeptId!]!): Int!
  "根据 ids 启用或者禁用部门"
  enableByIdsDept(ids: [DeptId!]!, is_enabled: Int!): Int!
  "根据 ids 锁定或者解锁部门"
  lockByIdsDept(ids: [DeptId!]!, is_locked: Int!): Int!
  "根据 ids 还原部门"
  revertByIdsDept(ids: [DeptId!]!): Int!
  "根据 ids 彻底删除部门"
  forceDeleteByIdsDept(ids: [DeptId!]!): Int!
}

`);
