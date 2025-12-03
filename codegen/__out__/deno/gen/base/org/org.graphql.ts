import { defineGraphql } from "/lib/context.ts";

import type { } from "./org.model.ts";
import * as resolver from "./org.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar OrgId

type OrgModel {
  "ID"
  id: OrgId!
  "名称"
  lbl: String!
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
type OrgFieldComment {
  "ID"
  id: String!
  "名称"
  lbl: String!
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
input OrgInput {
  "ID"
  id: OrgId
  "名称"
  lbl: String
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
  "备注"
  rem: String
}
input OrgSearch {
  "已删除"
  is_deleted: Int
  "ID列表"
  ids: [OrgId!]
  "ID"
  id: OrgId
  "名称"
  lbl: String
  lbl_like: String
  "启用"
  is_enabled: [Int!]
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
  "根据条件查找组织总数"
  findCountOrg(search: OrgSearch): Int!
  "根据搜索条件和分页查找组织列表"
  findAllOrg(search: OrgSearch, page: PageInput, sort: [SortInput!]): [OrgModel!]!
  "获取组织字段注释"
  getFieldCommentsOrg: OrgFieldComment!
  "根据条件查找第一个组织"
  findOneOrg(search: OrgSearch, sort: [SortInput!]): OrgModel
  "根据 id 查找组织"
  findByIdOrg(id: OrgId!): OrgModel
  "根据 ids 查找组织"
  findByIdsOrg(ids: [OrgId!]!): [OrgModel]!
  "查找组织 order_by 字段的最大值"
  findLastOrderByOrg(search: OrgSearch): Int!
}
type Mutation {
  "批量创建组织"
  createsOrg(inputs: [OrgInput!]!, unique_type: UniqueType): [OrgId!]!
  "根据 id 修改组织"
  updateByIdOrg(id: OrgId!, input: OrgInput!): OrgId!
  "根据 ids 删除组织"
  deleteByIdsOrg(ids: [OrgId!]!): Int!
  "根据 ids 启用或者禁用组织"
  enableByIdsOrg(ids: [OrgId!]!, is_enabled: Int!): Int!
  "根据 ids 锁定或者解锁组织"
  lockByIdsOrg(ids: [OrgId!]!, is_locked: Int!): Int!
  "根据 ids 还原组织"
  revertByIdsOrg(ids: [OrgId!]!): Int!
  "根据 ids 彻底删除组织"
  forceDeleteByIdsOrg(ids: [OrgId!]!): Int!
}

`);
