import { defineGraphql } from "/lib/context.ts";

import type { } from "./wxo_app_token.model.ts";
import * as resolver from "./wxo_app_token.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar WxoAppTokenId

type WxoAppTokenModel {
  "ID"
  id: WxoAppTokenId!
  "小程序设置"
  wxo_app_id: WxoAppId!
  "小程序设置"
  wxo_app_id_lbl: String!
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
type WxoAppTokenFieldComment {
  "ID"
  id: String!
  "小程序设置"
  wxo_app_id: String!
  "小程序设置"
  wxo_app_id_lbl: String!
  "令牌"
  access_token: String!
  "令牌创建时间"
  token_time: String!
  "令牌创建时间"
  token_time_lbl: String!
  "令牌超时时间"
  expires_in: String!
}
input WxoAppTokenInput {
  "ID"
  id: WxoAppTokenId
  "小程序设置"
  wxo_app_id: WxoAppId
  "小程序设置"
  wxo_app_id_lbl: String
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
input WxoAppTokenSearch {
  "已删除"
  is_deleted: Int
  "ID列表"
  ids: [WxoAppTokenId!]
  "ID"
  id: WxoAppTokenId
  "小程序设置"
  wxo_app_id: [WxoAppId!]
  "小程序设置"
  wxo_app_id_is_null: Boolean
  "小程序设置"
  wxo_app_id_lbl: [String!]
  "小程序设置"
  wxo_app_id_lbl_like: String
}
type Query {
  "根据条件查找小程序接口凭据总数"
  findCountWxoAppToken(search: WxoAppTokenSearch): Int!
  "根据搜索条件和分页查找小程序接口凭据列表"
  findAllWxoAppToken(search: WxoAppTokenSearch, page: PageInput, sort: [SortInput!]): [WxoAppTokenModel!]!
  "获取小程序接口凭据字段注释"
  getFieldCommentsWxoAppToken: WxoAppTokenFieldComment!
  "根据条件查找第一个小程序接口凭据"
  findOneWxoAppToken(search: WxoAppTokenSearch, sort: [SortInput!]): WxoAppTokenModel
  "根据 id 查找小程序接口凭据"
  findByIdWxoAppToken(id: WxoAppTokenId!): WxoAppTokenModel
  "根据 ids 查找小程序接口凭据"
  findByIdsWxoAppToken(ids: [WxoAppTokenId!]!): [WxoAppTokenModel]!
}
type Mutation {
  "批量创建小程序接口凭据"
  createsWxoAppToken(inputs: [WxoAppTokenInput!]!, unique_type: UniqueType): [WxoAppTokenId!]!
  "根据 id 修改小程序接口凭据"
  updateByIdWxoAppToken(id: WxoAppTokenId!, input: WxoAppTokenInput!): WxoAppTokenId!
  "根据 ids 删除小程序接口凭据"
  deleteByIdsWxoAppToken(ids: [WxoAppTokenId!]!): Int!
  "根据 ids 还原小程序接口凭据"
  revertByIdsWxoAppToken(ids: [WxoAppTokenId!]!): Int!
  "根据 ids 彻底删除小程序接口凭据"
  forceDeleteByIdsWxoAppToken(ids: [WxoAppTokenId!]!): Int!
}

`);
