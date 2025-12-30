import { defineGraphql } from "/lib/context.ts";

import type { } from "./wx_app.model.ts";
import * as resolver from "./wx_app.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar WxAppId

type WxAppModel {
  "ID"
  id: WxAppId!
  "原始ID"
  code: String!
  "名称"
  lbl: String!
  "开发者ID"
  appid: String!
  "开发者密码"
  appsecret: String!
  "默认角色"
  default_role_codes: String!
  "默认角色"
  default_role_ids: [RoleId!]!
  "默认角色"
  default_role_ids_lbl: String!
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
type WxAppFieldComment {
  "ID"
  id: String!
  "原始ID"
  code: String!
  "名称"
  lbl: String!
  "开发者ID"
  appid: String!
  "开发者密码"
  appsecret: String!
  "默认角色"
  default_role_codes: String!
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
input WxAppInput {
  "ID"
  id: WxAppId
  "原始ID"
  code: String
  "名称"
  lbl: String
  "开发者ID"
  appid: String
  "开发者密码"
  appsecret: String
  "默认角色"
  default_role_codes: String
  "默认角色"
  default_role_ids: [RoleId!]
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
input WxAppSearch {
  "已删除"
  is_deleted: Int
  "ID列表"
  ids: [WxAppId!]
  "ID"
  id: WxAppId
  "原始ID"
  code: String
  code_like: String
  "名称"
  lbl: String
  lbl_like: String
  "开发者ID"
  appid: String
  appid_like: String
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
  "根据条件查找小程序设置总数"
  findCountWxApp(search: WxAppSearch): Int!
  "根据搜索条件和分页查找小程序设置列表"
  findAllWxApp(search: WxAppSearch, page: PageInput, sort: [SortInput!]): [WxAppModel!]!
  "获取小程序设置字段注释"
  getFieldCommentsWxApp: WxAppFieldComment!
  "根据条件查找第一个小程序设置"
  findOneWxApp(search: WxAppSearch, sort: [SortInput!]): WxAppModel
  "根据 id 查找小程序设置"
  findByIdWxApp(id: WxAppId!): WxAppModel
  "根据 ids 查找小程序设置"
  findByIdsWxApp(ids: [WxAppId!]!): [WxAppModel]!
  "查找小程序设置 order_by 字段的最大值"
  findLastOrderByWxApp(search: WxAppSearch): Int!
}
type Mutation {
  "批量创建小程序设置"
  createsWxApp(inputs: [WxAppInput!]!, unique_type: UniqueType): [WxAppId!]!
  "根据 id 修改小程序设置"
  updateByIdWxApp(id: WxAppId!, input: WxAppInput!): WxAppId!
  "根据 ids 删除小程序设置"
  deleteByIdsWxApp(ids: [WxAppId!]!): Int!
  "根据 ids 启用或者禁用小程序设置"
  enableByIdsWxApp(ids: [WxAppId!]!, is_enabled: Int!): Int!
  "根据 ids 锁定或者解锁小程序设置"
  lockByIdsWxApp(ids: [WxAppId!]!, is_locked: Int!): Int!
  "根据 ids 还原小程序设置"
  revertByIdsWxApp(ids: [WxAppId!]!): Int!
  "根据 ids 彻底删除小程序设置"
  forceDeleteByIdsWxApp(ids: [WxAppId!]!): Int!
}

`);
