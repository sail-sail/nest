import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./wxw_app_token.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `

type WxwAppTokenModel {
  "ID"
  id: String!
  "企微应用"
  wxw_app_id: String!
  "企微应用"
  wxw_app_id_lbl: String
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
type WxwAppTokenFieldComment {
  "企微应用"
  wxw_app_id: String!
  "企微应用"
  wxw_app_id_lbl: String!
  "令牌"
  access_token: String!
  "令牌创建时间"
  token_time: String!
  "令牌创建时间"
  token_time_lbl: String!
  "令牌超时时间"
  expires_in: String!
}
input WxwAppTokenInput {
  ""
  id: String
  "企微应用"
  wxw_app_id: String
  "企微应用"
  wxw_app_id_lbl: String
  "令牌"
  access_token: String
  "令牌创建时间"
  token_time: NaiveDateTime
  "令牌创建时间"
  token_time_lbl: String
  "令牌超时时间"
  expires_in: Int
}
input WxwAppTokenSearch {
  "是否已删除"
  is_deleted: Int
  "ID列表"
  ids: [String]
  "String"
  id: String
  "企微应用"
  wxw_app_id: [String!]
  wxw_app_id_is_null: Boolean
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
  findCountWxwAppToken(search: WxwAppTokenSearch): Int!
  "根据搜索条件和分页查找数据"
  findAllWxwAppToken(search: WxwAppTokenSearch, page: PageInput, sort: [SortInput!]): [WxwAppTokenModel!]!
  "获取字段对应的名称"
  getFieldCommentsWxwAppToken: WxwAppTokenFieldComment!
  "根据条件查找第一条数据"
  findOneWxwAppToken(search: WxwAppTokenSearch, sort: [SortInput!]): WxwAppTokenModel
  "根据id查找一条数据"
  findByIdWxwAppToken(id: String!): WxwAppTokenModel
}
type Mutation {
  "创建一条数据"
  createWxwAppToken(model: WxwAppTokenInput!, unique_type: UniqueType): String!
  "根据id修改一条数据"
  updateByIdWxwAppToken(id: String!, model: WxwAppTokenInput!): String!
  "根据 ids 删除数据"
  deleteByIdsWxwAppToken(ids: [String!]!): Int!
  "根据 ids 还原数据"
  revertByIdsWxwAppToken(ids: [String!]!): Int!
  "根据 ids 彻底删除数据"
  forceDeleteByIdsWxwAppToken(ids: [String!]!): Int!
}

`);
