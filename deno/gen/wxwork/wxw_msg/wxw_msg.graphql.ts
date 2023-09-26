import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./wxw_msg.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `

type WxwMsgModel {
  "ID"
  id: String!
  "企微应用"
  wxw_app_id: String!
  "企微应用"
  wxw_app_id_lbl: String
  "发送状态"
  errcode: String!
  "发送状态"
  errcode_lbl: String
  "成员ID"
  touser: String!
  "标题"
  title: String!
  "描述"
  description: String!
  "链接"
  url: String!
  "按钮文字"
  btntxt: String!
  "创建时间"
  create_time: NaiveDateTime
  "创建时间"
  create_time_lbl: String!
  "错误信息"
  errmsg: String!
  "消息ID"
  msgid: String!
  "是否已删除"
  is_deleted: Int!
}
type WxwMsgFieldComment {
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
  "创建时间"
  create_time: String!
  "创建时间"
  create_time_lbl: String!
  "错误信息"
  errmsg: String!
}
input WxwMsgInput {
  ""
  id: String
  "企微应用"
  wxw_app_id: String
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
  "链接"
  url: String
  "按钮文字"
  btntxt: String
  "创建时间"
  create_time: NaiveDateTime
  "创建时间"
  create_time_lbl: String
  "错误信息"
  errmsg: String
  "消息ID"
  msgid: String
}
input WxwMsgSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [String]
  "String"
  id: String
  "企微应用"
  wxw_app_id: [String!]
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
  "链接"
  url: String
  url_like: String
  "按钮文字"
  btntxt: String
  btntxt_like: String
  "创建时间"
  create_time: [NaiveDateTime!]
  "错误信息"
  errmsg: String
  errmsg_like: String
  "消息ID"
  msgid: String
  msgid_like: String
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
  findByIdWxwMsg(id: String!): WxwMsgModel
}
type Mutation {
  "根据 ids 删除数据"
  deleteByIdsWxwMsg(ids: [String!]!): Int!
  "根据 ids 还原数据"
  revertByIdsWxwMsg(ids: [String!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsWxwMsg(ids: [String!]!): Int!
}

`);
