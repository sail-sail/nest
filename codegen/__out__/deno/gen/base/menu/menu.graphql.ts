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
  parent_id_lbl: String!
  "名称"
  lbl: String!
  "路由"
  route_path: String!
  "参数"
  route_query: String!
  "首页隐藏"
  is_home_hide: Int!
  "首页隐藏"
  is_home_hide_lbl: String!
  "动态页面"
  is_dyn_page: Int!
  "动态页面"
  is_dyn_page_lbl: String!
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
  "首页隐藏"
  is_home_hide: String!
  "首页隐藏"
  is_home_hide_lbl: String!
  "动态页面"
  is_dyn_page: String!
  "动态页面"
  is_dyn_page_lbl: String!
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
  "首页隐藏"
  is_home_hide: Int
  "首页隐藏"
  is_home_hide_lbl: String
  "动态页面"
  is_dyn_page: Int
  "动态页面"
  is_dyn_page_lbl: String
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
  "已删除"
  is_deleted: Int
  "ID列表"
  ids: [MenuId!]
  "ID"
  id: MenuId
  "父菜单"
  parent_id: [MenuId!]
  "父菜单"
  parent_id_is_null: Boolean
  "父菜单"
  parent_id_lbl: [String!]
  "父菜单"
  parent_id_lbl_like: String
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
  "根据 ids 查找菜单"
  findByIdsMenu(ids: [MenuId!]!): [MenuModel]!
  "查找菜单 order_by 字段的最大值"
  findLastOrderByMenu: Int!
}
type Mutation {
  "批量创建菜单"
  createsMenu(inputs: [MenuInput!]!, unique_type: UniqueType): [MenuId!]!
  "根据 id 修改菜单"
  updateByIdMenu(id: MenuId!, input: MenuInput!): MenuId!
  "根据 ids 删除菜单"
  deleteByIdsMenu(ids: [MenuId!]!): Int!
  "根据 ids 启用或者禁用菜单"
  enableByIdsMenu(ids: [MenuId!]!, is_enabled: Int!): Int!
  "根据 ids 还原菜单"
  revertByIdsMenu(ids: [MenuId!]!): Int!
  "根据 ids 彻底删除菜单"
  forceDeleteByIdsMenu(ids: [MenuId!]!): Int!
}

`);
