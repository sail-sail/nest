import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./menu.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar MenuId

"菜单类型"
enum MenuType {
  "电脑端"
  pc
  "手机端"
  mobile
}

type MenuModel {
  "ID"
  id: MenuId!
  "类型"
  type: MenuType
  "类型"
  type_lbl: String!
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
  "类型"
  type: String!
  "类型"
  type_lbl: String!
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
  ""
  id: MenuId
  "类型"
  type: MenuType
  "类型"
  type_lbl: String
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
  "创建人"
  create_usr_id: UsrId
  "创建人"
  create_usr_id_lbl: String
  "创建时间"
  create_time: NaiveDateTime
  "创建时间"
  create_time_lbl: String
  "更新人"
  update_usr_id: UsrId
  "更新人"
  update_usr_id_lbl: String
  "更新时间"
  update_time: NaiveDateTime
  "更新时间"
  update_time_lbl: String
}
input MenuSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [MenuId!]
  "ID"
  id: MenuId
  "类型"
  type: [String!]
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
  findCountMenu(search: MenuSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllMenu(search: MenuSearch, page: PageInput, sort: [SortInput!]): [MenuModel!]!
  "获取字段对应的名称"
  getFieldCommentsMenu: MenuFieldComment!
  "根据条件查找第一条数据"
  findOneMenu(search: MenuSearch, sort: [SortInput!]): MenuModel
  "根据id查找一条数据"
  findByIdMenu(id: MenuId!): MenuModel
  "查找order_by字段的最大值"
  findLastOrderByMenu: Int!
}
type Mutation {
  "创建一条数据"
  createMenu(model: MenuInput!, unique_type: UniqueType): MenuId!
  "根据id修改一条数据"
  updateByIdMenu(id: MenuId!, model: MenuInput!): MenuId!
  "根据 ids 删除数据"
  deleteByIdsMenu(ids: [MenuId!]!): Int!
  "根据 ids 启用或者禁用数据"
  enableByIdsMenu(ids: [MenuId!]!, is_enabled: Int!): Int!
  "根据 ids 锁定或者解锁数据"
  lockByIdsMenu(ids: [MenuId!]!, is_locked: Int!): Int!
  "根据 ids 还原数据"
  revertByIdsMenu(ids: [MenuId!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsMenu(ids: [MenuId!]!): Int!
}

`);
