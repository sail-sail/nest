import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./wx_app.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar WxAppId


type WxAppModel {
  "ID"
  id: String!
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
type WxAppFieldComment {
  "ID"
  id: String!
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
input WxAppSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [String]
  "ID"
  id: WxAppId
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
  "根据条件查找据数总数"
  findCountWxApp(search: WxAppSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllWxApp(search: WxAppSearch, page: PageInput, sort: [SortInput!]): [WxAppModel!]!
  "获取字段对应的名称"
  getFieldCommentsWxApp: WxAppFieldComment!
  "根据条件查找第一条数据"
  findOneWxApp(search: WxAppSearch, sort: [SortInput!]): WxAppModel
  "根据id查找一条数据"
  findByIdWxApp(id: String!): WxAppModel
  "查找order_by字段的最大值"
  findLastOrderByWxApp: Int!
}
type Mutation {
  "创建一条数据"
  createWxApp(model: WxAppInput!, unique_type: UniqueType): String!
  "根据id修改一条数据"
  updateByIdWxApp(id: String!, model: WxAppInput!): String!
  "根据 ids 删除数据"
  deleteByIdsWxApp(ids: [String!]!): Int!
  "根据 ids 启用或者禁用数据"
  enableByIdsWxApp(ids: [String!]!, is_enabled: Int!): Int!
  "根据 ids 锁定或者解锁数据"
  lockByIdsWxApp(ids: [String!]!, is_locked: Int!): Int!
  "根据 ids 还原数据"
  revertByIdsWxApp(ids: [String!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsWxApp(ids: [String!]!): Int!
}

`);
