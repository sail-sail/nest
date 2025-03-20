import { defineGraphql } from "/lib/context.ts";

import type { } from "./wxw_msg.model.ts";
import * as resolver from "./wxw_msg.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar WxwMsgId

type WxwMsgModel {
  "ID"
  id: WxwMsgId!
  "企微应用"
  wxw_app_id: WxwAppId!
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
  create_time: NaiveDateTime
  "发送时间"
  create_time_lbl: String!
  "错误信息"
  errmsg: String!
  "已删除"
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
  "ID"
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
  "错误信息"
  errmsg: String
}
input WxwMsgSearch {
  "已删除"
  is_deleted: Int
  "ID列表"
  ids: [WxwMsgId!]
  "ID"
  id: WxwMsgId
  "企微应用"
  wxw_app_id: [WxwAppId!]
  "企微应用"
  wxw_app_id_is_null: Boolean
  "企微应用"
  wxw_app_id_lbl: [String!]
  "企微应用"
  wxw_app_id_lbl_like: String
  "发送状态"
  errcode: [String!]
  "发送时间"
  create_time: [NaiveDateTime]
}
type Query {
  "根据条件查找企微消息总数"
  findCountWxwMsg(search: WxwMsgSearch): Int!
  "根据搜索条件和分页查找企微消息列表"
  findAllWxwMsg(search: WxwMsgSearch, page: PageInput, sort: [SortInput!]): [WxwMsgModel!]!
  "获取企微消息字段注释"
  getFieldCommentsWxwMsg: WxwMsgFieldComment!
  "根据条件查找第一个企微消息"
  findOneWxwMsg(search: WxwMsgSearch, sort: [SortInput!]): WxwMsgModel
  "根据 id 查找企微消息"
  findByIdWxwMsg(id: WxwMsgId!): WxwMsgModel
  "根据 ids 查找企微消息"
  findByIdsWxwMsg(ids: [WxwMsgId!]!): [WxwMsgModel]!
}
type Mutation {
  "根据 ids 删除企微消息"
  deleteByIdsWxwMsg(ids: [WxwMsgId!]!): Int!
  "根据 ids 还原企微消息"
  revertByIdsWxwMsg(ids: [WxwMsgId!]!): Int!
  "根据 ids 彻底删除企微消息"
  forceDeleteByIdsWxwMsg(ids: [WxwMsgId!]!): Int!
}

`);
