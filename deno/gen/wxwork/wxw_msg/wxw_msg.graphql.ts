import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./wxw_msg.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar WxwMsgId


type WxwMsgModel {
  "ID"
  id: WxwMsgId!
  "企微应用"
  wxw_app_id: WxwAppId!
  "企微应用"
  wxw_app_id_lbl: String
  "发送状态"
  errcode: String!
  "发送状态"
  errcode_lbl: String!
  "成员ID"
  touser: String!
  "标题"
  title: String!
  "描述"
  description: String!
  "按钮文字"
  btntxt: String!
  "发送时间"
  create_time: NaiveDateTime
  "发送时间"
  create_time_lbl: String!
  "错误信息"
  errmsg: String!
  "是否已删除"
  is_deleted: Int!
}
type WxwMsgFieldComment {
  "ID"
  id: String!
  "企微应用"
  wxw_app_id: String!
  "企微应用"
  wxw_app_id_lbl: String!
  "发送状态"
  errcode: String!
  "发送状态"
  errcode_lbl: String!
  "成员ID"
  touser: String!
  "标题"
  title: String!
  "描述"
  description: String!
  "按钮文字"
  btntxt: String!
  "发送时间"
  create_time: String!
  "发送时间"
  create_time_lbl: String!
  "错误信息"
  errmsg: String!
}
input WxwMsgInput {
  ""
  id: WxwMsgId
  "企微应用"
  wxw_app_id: WxwAppId
  "企微应用"
  wxw_app_id_lbl: String
  "发送状态"
  errcode: String
  "发送状态"
  errcode_lbl: String
  "成员ID"
  touser: String
  "标题"
  title: String
  "描述"
  description: String
  "按钮文字"
  btntxt: String
  "发送时间"
  create_time: NaiveDateTime
  "发送时间"
  create_time_lbl: String
  "错误信息"
  errmsg: String
}
input WxwMsgSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [WxwMsgId!]
  "ID"
  id: WxwMsgId
  "企微应用"
  wxw_app_id: [WxwAppId!]
  wxw_app_id_is_null: Boolean
  "发送状态"
  errcode: [String!]
  "成员ID"
  touser: String
  touser_like: String
  "标题"
  title: String
  title_like: String
  "描述"
  description: String
  description_like: String
  "按钮文字"
  btntxt: String
  btntxt_like: String
  "发送时间"
  create_time: [NaiveDateTime!]
  "错误信息"
  errmsg: String
  errmsg_like: String
}
type Query {
  "根据条件查找据数总数"
  findCountWxwMsg(search: WxwMsgSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllWxwMsg(search: WxwMsgSearch, page: PageInput, sort: [SortInput!]): [WxwMsgModel!]!
  "获取字段对应的名称"
  getFieldCommentsWxwMsg: WxwMsgFieldComment!
  "根据条件查找第一条数据"
  findOneWxwMsg(search: WxwMsgSearch, sort: [SortInput!]): WxwMsgModel
  "根据id查找一条数据"
  findByIdWxwMsg(id: WxwMsgId!): WxwMsgModel
}
type Mutation {
  "根据 ids 删除数据"
  deleteByIdsWxwMsg(ids: [WxwMsgId!]!): Int!
  "根据 ids 还原数据"
  revertByIdsWxwMsg(ids: [WxwMsgId!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsWxwMsg(ids: [WxwMsgId!]!): Int!
}

`);
