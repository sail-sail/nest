import { defineGraphql } from "/lib/context.ts";

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
  "appid"
  appid: String!
  "appsecret"
  appsecret: String!
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
type WxAppFieldComment {
  "ID"
  id: String!
  "原始ID"
  code: String!
  "名称"
  lbl: String!
  "appid"
  appid: String!
  "appsecret"
  appsecret: String!
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
  ""
  id: WxAppId
  "原始ID"
  code: String
  "名称"
  lbl: String
  "appid"
  appid: String
  "appsecret"
  appsecret: String
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
input WxAppSearch {
  "是否已删除"
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
  "appid"
  appid: String
  appid_like: String
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
  "根据条件查找微信小程序总数"
  findCountWxApp(search: WxAppSearch): Int!
  "根据搜索条件和分页查找微信小程序列表"
  findAllWxApp(search: WxAppSearch, page: PageInput, sort: [SortInput!]): [WxAppModel!]!
  "获取微信小程序字段注释"
  getFieldCommentsWxApp: WxAppFieldComment!
  "根据条件查找第一个微信小程序"
  findOneWxApp(search: WxAppSearch, sort: [SortInput!]): WxAppModel
  "根据 id 查找微信小程序"
  findByIdWxApp(id: WxAppId!): WxAppModel
  "查找 微信小程序 order_by 字段的最大值"
  findLastOrderByWxApp: Int!
}
type Mutation {
  "创建微信小程序"
  createWxApp(model: WxAppInput!, unique_type: UniqueType): WxAppId!
  "根据 id 修改微信小程序"
  updateByIdWxApp(id: WxAppId!, model: WxAppInput!): WxAppId!
  "根据 ids 删除微信小程序"
  deleteByIdsWxApp(ids: [WxAppId!]!): Int!
  "根据 ids 启用或者禁用微信小程序"
  enableByIdsWxApp(ids: [WxAppId!]!, is_enabled: Int!): Int!
  "根据 ids 锁定或者解锁微信小程序"
  lockByIdsWxApp(ids: [WxAppId!]!, is_locked: Int!): Int!
  "根据 ids 还原微信小程序"
  revertByIdsWxApp(ids: [WxAppId!]!): Int!
  "根据 ids 彻底删除微信小程序"
  forceDeleteByIdsWxApp(ids: [WxAppId!]!): Int!
}

`);
