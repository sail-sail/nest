import { defineGraphql } from "/lib/context.ts";

import * as tenantResolver from "./tenant.resolver.ts";

defineGraphql(tenantResolver, /* GraphQL */ `

type TenantModel {
  "ID"
  id: ID!
  "名称"
  lbl: String!
  "域名绑定"
  host: String!
  "到期日"
  expiration: String
  "最大用户数"
  max_usr_num: Int!
  "启用"
  is_enabled: Int!
  "启用"
  is_enabled_lbl: String
  "菜单"
  menu_ids: [ID!]
  "菜单"
  menu_ids_lbl: [String!]
  "排序"
  order_by: Int!
  "备注"
  rem: String!
}
type TenantFieldComment {
  "名称"
  lbl: String!
  "域名绑定"
  host: String!
  "到期日"
  expiration: String!
  "最大用户数"
  max_usr_num: String!
  "启用"
  is_enabled: String!
  "启用"
  is_enabled_lbl: String!
  "菜单"
  menu_ids: String!
  "菜单"
  menu_ids_lbl: String!
  "排序"
  order_by: String!
  "备注"
  rem: String!
}
input TenantInput {
  "租户ID"
  tenant_id: String
  ""
  id: ID
  "名称"
  lbl: String
  "域名绑定"
  host: String
  "到期日"
  expiration: String
  "最大用户数"
  max_usr_num: Int
  "启用"
  is_enabled: Int
  "启用"
  is_enabled_lbl: String
  "菜单"
  menu_ids: [ID!]
  "菜单"
  menu_ids_lbl: [String!]
  "排序"
  order_by: Int
  "备注"
  rem: String
}
input TenantSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [ID]
  "ID"
  id: ID
  "名称"
  lbl: String
  lbl_like: String
  "域名绑定"
  host: String
  host_like: String
  "到期日"
  expiration: [String!]
  "最大用户数"
  max_usr_num: [Int!]
  "启用"
  is_enabled: [Int!]
  "菜单"
  menu_ids: [String!]
  menu_ids_lbl: [String!]
  menu_ids_is_null: Boolean
  "排序"
  order_by: [Int!]
  "备注"
  rem: String
  rem_like: String
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
  findByIdTenant(id: ID!): TenantModel
  "查找order_by字段的最大值"
  findLastOrderByTenant: Int!
}
type Mutation {
  "创建一条数据"
  createTenant(model: TenantInput!): ID!
  "根据id修改一条数据"
  updateByIdTenant(id: ID!, model: TenantInput!): ID!
  "批量导入"
  importModelsTenant(models: [TenantInput!]!): String
  "根据 ids 删除数据"
  deleteByIdsTenant(ids: [ID!]!): Int!
  "根据 ids 还原数据"
  revertByIdsTenant(ids: [ID!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsTenant(ids: [ID!]!): Int!
}

`);
