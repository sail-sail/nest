import { defineGraphql } from "/lib/context.ts";

import type { } from "./menu.model.ts";
import * as resolver from "./menu.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar MenuId


type MenuModel {
  "ID"
  id: MenuId!
  "父菜单"
  parent_id: MenuId!
  "父菜单"
  parent_id_lbl: String
  "名称"
  lbl: String!
  "路由"
  route_path: String!
  "参数"
  route_query: String!
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
  create_usr_id_lbl: String
  "创建时间"
  create_time: NaiveDateTime
  "创建时间"
  create_time_lbl: String!
  "更新人"
  update_usr_id: UsrId!
  "更新人"
  update_usr_id_lbl: String
  "更新时间"
  update_time: NaiveDateTime
  "更新时间"
  update_time_lbl: String!
  "是否已删除"
  is_deleted: Int!
}
type MenuFieldComment {
  "ID"
  id: String!
  "父菜单"
  parent_id: String!
  "父菜单"
  parent_id_lbl: String!
  "名称"
  lbl: String!
  "路由"
  route_path: String!
  "参数"
  route_query: String!
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
input MenuInput {
  "ID"
  id: MenuId
  "父菜单"
  parent_id: MenuId
  "父菜单"
  parent_id_lbl: String
  "名称"
  lbl: String
  "路由"
  route_path: String
  "参数"
  route_query: String
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
input MenuSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [MenuId!]
  "ID"
  id: MenuId
  "父菜单"
  parent_id: [MenuId!]
  parent_id_is_null: Boolean
  "名称"
  lbl: String
  lbl_like: String
  "路由"
  route_path: String
  route_path_like: String
  "参数"
  route_query: String
  route_query_like: String
  "锁定"
  is_locked: [Int!]
  "启用"
  is_enabled: [Int!]
  "排序"
  order_by: [Int]
  "备注"
  rem: String
  rem_like: String
  "创建人"
  create_usr_id: [UsrId!]
  create_usr_id_is_null: Boolean
  "创建时间"
  create_time: [NaiveDateTime]
  "更新人"
  update_usr_id: [UsrId!]
  update_usr_id_is_null: Boolean
  "更新时间"
  update_time: [NaiveDateTime]
}
type Query {
  "根据条件查找菜单总数"
  findCountMenu(search: MenuSearch): Int!
  "根据搜索条件和分页查找菜单列表"
  findAllMenu(search: MenuSearch, page: PageInput, sort: [SortInput!]): [MenuModel!]!
  "获取菜单字段注释"
  getFieldCommentsMenu: MenuFieldComment!
  "根据条件查找第一个菜单"
  findOneMenu(search: MenuSearch, sort: [SortInput!]): MenuModel
  "根据 id 查找菜单"
  findByIdMenu(id: MenuId!): MenuModel
  "查找 菜单 order_by 字段的最大值"
  findLastOrderByMenu: Int!
}
type Mutation {
  "创建菜单"
  createMenu(input: MenuInput!, unique_type: UniqueType): MenuId!
  "根据 id 修改菜单"
  updateByIdMenu(id: MenuId!, input: MenuInput!): MenuId!
  "根据 ids 删除菜单"
  deleteByIdsMenu(ids: [MenuId!]!): Int!
  "根据 ids 启用或者禁用菜单"
  enableByIdsMenu(ids: [MenuId!]!, is_enabled: Int!): Int!
  "根据 ids 锁定或者解锁菜单"
  lockByIdsMenu(ids: [MenuId!]!, is_locked: Int!): Int!
  "根据 ids 还原菜单"
  revertByIdsMenu(ids: [MenuId!]!): Int!
  "根据 ids 彻底删除菜单"
  forceDeleteByIdsMenu(ids: [MenuId!]!): Int!
}

`);
