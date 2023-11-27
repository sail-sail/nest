import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./tenant.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar TenantId


type TenantModel {
  "ID"
  id: String!
  "名称"
  lbl: String!
  "所属域名"
  domain_ids: [String!]
  "所属域名"
  domain_ids_lbl: [DomainId!]
  "菜单权限"
  menu_ids: [String!]
  "菜单权限"
  menu_ids_lbl: [MenuId!]
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
type TenantFieldComment {
  "ID"
  id: String!
  "名称"
  lbl: String!
  "所属域名"
  domain_ids: String!
  "所属域名"
  domain_ids_lbl: String!
  "菜单权限"
  menu_ids: String!
  "菜单权限"
  menu_ids_lbl: String!
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
input TenantInput {
  ""
  id: TenantId
  "名称"
  lbl: String
  "所属域名"
  domain_ids: [String!]
  "所属域名"
  domain_ids_lbl: [DomainId!]
  "菜单权限"
  menu_ids: [String!]
  "菜单权限"
  menu_ids_lbl: [MenuId!]
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
input TenantSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [String]
  "ID"
  id: TenantId
  "名称"
  lbl: String
  lbl_like: String
  "所属域名"
  domain_ids: [DomainId!]
  domain_ids_is_null: Boolean
  "菜单权限"
  menu_ids: [MenuId!]
  menu_ids_is_null: Boolean
  "锁定"
  is_locked: [Int!]
  "启用"
  is_enabled: [Int!]
  "排序"
  order_by: [Int!]
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
  findCountTenant(search: TenantSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllTenant(search: TenantSearch, page: PageInput, sort: [SortInput!]): [TenantModel!]!
  "获取字段对应的名称"
  getFieldCommentsTenant: TenantFieldComment!
  "根据条件查找第一条数据"
  findOneTenant(search: TenantSearch, sort: [SortInput!]): TenantModel
  "根据id查找一条数据"
  findByIdTenant(id: String!): TenantModel
  "查找order_by字段的最大值"
  findLastOrderByTenant: Int!
}
type Mutation {
  "创建一条数据"
  createTenant(model: TenantInput!, unique_type: UniqueType): String!
  "根据id修改一条数据"
  updateByIdTenant(id: String!, model: TenantInput!): String!
  "根据 ids 删除数据"
  deleteByIdsTenant(ids: [String!]!): Int!
  "根据 ids 启用或者禁用数据"
  enableByIdsTenant(ids: [String!]!, is_enabled: Int!): Int!
  "根据 ids 锁定或者解锁数据"
  lockByIdsTenant(ids: [String!]!, is_locked: Int!): Int!
  "根据 ids 还原数据"
  revertByIdsTenant(ids: [String!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsTenant(ids: [String!]!): Int!
}

`);
