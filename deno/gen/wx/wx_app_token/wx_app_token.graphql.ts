import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./wx_app_token.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `

type WxAppTokenModel {
  "ID"
  id: String!
  "微信小程序"
  wx_app_id: String!
  "微信小程序"
  wx_app_id_lbl: String
  "令牌"
  access_token: String!
  "令牌创建时间"
  token_time: NaiveDateTime
  "令牌创建时间"
  token_time_lbl: String!
  "令牌超时时间"
  expires_in: Int!
  "是否已删除"
  is_deleted: Int!
}
type WxAppTokenFieldComment {
  "微信小程序"
  wx_app_id: String!
  "微信小程序"
  wx_app_id_lbl: String!
  "令牌"
  access_token: String!
  "令牌创建时间"
  token_time: String!
  "令牌创建时间"
  token_time_lbl: String!
  "令牌超时时间"
  expires_in: String!
}
input WxAppTokenInput {
  ""
  id: String
  "微信小程序"
  wx_app_id: String
  "微信小程序"
  wx_app_id_lbl: String
  "令牌"
  access_token: String
  "令牌创建时间"
  token_time: NaiveDateTime
  "令牌创建时间"
  token_time_lbl: String
  "令牌超时时间"
  expires_in: Int
}
input WxAppTokenSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [String]
  "String"
  id: String
  "微信小程序"
  wx_app_id: [String!]
  wx_app_id_is_null: Boolean
  "令牌"
  access_token: String
  access_token_like: String
  "令牌创建时间"
  token_time: [NaiveDateTime!]
  "令牌超时时间"
  expires_in: [Int!]
}
type Query {
  "根据条件查找据数总数"
  findCountWxAppToken(search: WxAppTokenSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllWxAppToken(search: WxAppTokenSearch, page: PageInput, sort: [SortInput!]): [WxAppTokenModel!]!
  "获取字段对应的名称"
  getFieldCommentsWxAppToken: WxAppTokenFieldComment!
  "根据条件查找第一条数据"
  findOneWxAppToken(search: WxAppTokenSearch, sort: [SortInput!]): WxAppTokenModel
  "根据id查找一条数据"
  findByIdWxAppToken(id: String!): WxAppTokenModel
}
type Mutation {
  "创建一条数据"
  createWxAppToken(model: WxAppTokenInput!, unique_type: UniqueType): String!
  "根据id修改一条数据"
  updateByIdWxAppToken(id: String!, model: WxAppTokenInput!): String!
  "根据 ids 删除数据"
  deleteByIdsWxAppToken(ids: [String!]!): Int!
  "根据 ids 还原数据"
  revertByIdsWxAppToken(ids: [String!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsWxAppToken(ids: [String!]!): Int!
}

`);
