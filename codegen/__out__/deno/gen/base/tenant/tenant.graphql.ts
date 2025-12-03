import { defineGraphql } from "/lib/context.ts";

import type { } from "./tenant.model.ts";
import * as resolver from "./tenant.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar TenantId

type TenantModel {
  "ID"
  id: TenantId!
  "编码"
  code: String!
  "名称"
  lbl: String!
  "所属域名"
  domain_ids: [DomainId!]!
  "所属域名"
  domain_ids_lbl: [String!]!
  "菜单权限"
  menu_ids: [MenuId!]!
  "菜单权限"
  menu_ids_lbl: [String!]!
  "标题"
  title: String!
  "简介"
  info: String!
  "语言"
  lang_id: LangId!
  "语言"
  lang_id_lbl: String!
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
  "系统字段"
  is_sys: Int!
}
type TenantFieldComment {
  "ID"
  id: String!
  "编码"
  code: String!
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
  "标题"
  title: String!
  "简介"
  info: String!
  "语言"
  lang_id: String!
  "语言"
  lang_id_lbl: String!
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
  "ID"
  id: TenantId
  "编码"
  code: String
  "名称"
  lbl: String
  "所属域名"
  domain_ids: [DomainId!]
  "所属域名"
  domain_ids_lbl: [String!]
  "菜单权限"
  menu_ids: [MenuId!]
  "菜单权限"
  menu_ids_lbl: [String!]
  "标题"
  title: String
  "简介"
  info: String
  "语言"
  lang_id: LangId
  "语言"
  lang_id_lbl: String
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
input TenantSearch {
  "已删除"
  is_deleted: Int
  "ID列表"
  ids: [TenantId!]
  "ID"
  id: TenantId
  "编码"
  code: String
  code_like: String
  "名称"
  lbl: String
  lbl_like: String
  "所属域名"
  domain_ids: [DomainId!]
  "所属域名"
  domain_ids_is_null: Boolean
  "所属域名"
  domain_ids_lbl: [String!]
  "所属域名"
  domain_ids_lbl_like: String
  "菜单权限"
  menu_ids: [MenuId!]
  "菜单权限"
  menu_ids_is_null: Boolean
  "菜单权限"
  menu_ids_lbl: [String!]
  "菜单权限"
  menu_ids_lbl_like: String
  "语言"
  lang_id: [LangId!]
  "语言"
  lang_id_is_null: Boolean
  "语言"
  lang_id_lbl: [String!]
  "语言"
  lang_id_lbl_like: String
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
  "根据条件查找租户总数"
  findCountTenant(search: TenantSearch): Int!
  "根据搜索条件和分页查找租户列表"
  findAllTenant(search: TenantSearch, page: PageInput, sort: [SortInput!]): [TenantModel!]!
  "获取租户字段注释"
  getFieldCommentsTenant: TenantFieldComment!
  "根据条件查找第一个租户"
  findOneTenant(search: TenantSearch, sort: [SortInput!]): TenantModel
  "根据 id 查找租户"
  findByIdTenant(id: TenantId!): TenantModel
  "根据 ids 查找租户"
  findByIdsTenant(ids: [TenantId!]!): [TenantModel]!
  "查找租户 order_by 字段的最大值"
  findLastOrderByTenant(search: TenantSearch): Int!
}
type Mutation {
  "批量创建租户"
  createsTenant(inputs: [TenantInput!]!, unique_type: UniqueType): [TenantId!]!
  "根据 id 修改租户"
  updateByIdTenant(id: TenantId!, input: TenantInput!): TenantId!
  "根据 ids 删除租户"
  deleteByIdsTenant(ids: [TenantId!]!): Int!
  "根据 ids 启用或者禁用租户"
  enableByIdsTenant(ids: [TenantId!]!, is_enabled: Int!): Int!
  "根据 ids 锁定或者解锁租户"
  lockByIdsTenant(ids: [TenantId!]!, is_locked: Int!): Int!
  "根据 ids 还原租户"
  revertByIdsTenant(ids: [TenantId!]!): Int!
  "根据 ids 彻底删除租户"
  forceDeleteByIdsTenant(ids: [TenantId!]!): Int!
}

`);
