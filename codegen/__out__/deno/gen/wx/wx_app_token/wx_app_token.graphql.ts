import { defineGraphql } from "/lib/context.ts";

import type { } from "./wx_app_token.model.ts";
import * as resolver from "./wx_app_token.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar WxAppTokenId

type WxAppTokenModel {
  "ID"
  id: WxAppTokenId!
  "小程序设置"
  wx_app_id: WxAppId!
  "小程序设置"
  wx_app_id_lbl: String!
  "令牌"
  access_token: String!
  "令牌创建时间"
  token_time: NaiveDateTime
  "令牌创建时间"
  token_time_lbl: String!
  "令牌超时时间"
  expires_in: Int!
  "已删除"
  is_deleted: Int!
}
type WxAppTokenFieldComment {
  "ID"
  id: String!
  "小程序设置"
  wx_app_id: String!
  "小程序设置"
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
  "ID"
  id: WxAppTokenId
  "小程序设置"
  wx_app_id: WxAppId
  "小程序设置"
  wx_app_id_lbl: String
  "令牌"
  access_token: String
  "令牌创建时间"
  token_time: NaiveDateTime
  "令牌创建时间"
  token_time_lbl: String
  "令牌创建时间"
  token_time_save_null: Boolean
  "令牌超时时间"
  expires_in: Int
}
input WxAppTokenSearch {
  "已删除"
  is_deleted: Int
  "ID列表"
  ids: [WxAppTokenId!]
  "ID"
  id: WxAppTokenId
  "小程序设置"
  wx_app_id: [WxAppId!]
  "小程序设置"
  wx_app_id_is_null: Boolean
  "小程序设置"
  wx_app_id_lbl: [String!]
  "小程序设置"
  wx_app_id_lbl_like: String
}
type Query {
  "根据条件查找小程序接口凭据总数"
  findCountWxAppToken(search: WxAppTokenSearch): Int!
  "根据搜索条件和分页查找小程序接口凭据列表"
  findAllWxAppToken(search: WxAppTokenSearch, page: PageInput, sort: [SortInput!]): [WxAppTokenModel!]!
  "获取小程序接口凭据字段注释"
  getFieldCommentsWxAppToken: WxAppTokenFieldComment!
  "根据条件查找第一个小程序接口凭据"
  findOneWxAppToken(search: WxAppTokenSearch, sort: [SortInput!]): WxAppTokenModel
  "根据 id 查找小程序接口凭据"
  findByIdWxAppToken(id: WxAppTokenId!): WxAppTokenModel
  "根据 ids 查找小程序接口凭据"
  findByIdsWxAppToken(ids: [WxAppTokenId!]!): [WxAppTokenModel]!
}
type Mutation {
  "批量创建小程序接口凭据"
  createsWxAppToken(inputs: [WxAppTokenInput!]!, unique_type: UniqueType): [WxAppTokenId!]!
  "根据 id 修改小程序接口凭据"
  updateByIdWxAppToken(id: WxAppTokenId!, input: WxAppTokenInput!): WxAppTokenId!
  "根据 ids 删除小程序接口凭据"
  deleteByIdsWxAppToken(ids: [WxAppTokenId!]!): Int!
  "根据 ids 还原小程序接口凭据"
  revertByIdsWxAppToken(ids: [WxAppTokenId!]!): Int!
  "根据 ids 彻底删除小程序接口凭据"
  forceDeleteByIdsWxAppToken(ids: [WxAppTokenId!]!): Int!
}

`);
