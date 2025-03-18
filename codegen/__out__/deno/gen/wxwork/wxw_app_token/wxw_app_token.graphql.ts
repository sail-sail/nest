import { defineGraphql } from "/lib/context.ts";

import type { } from "./wxw_app_token.model.ts";
import * as resolver from "./wxw_app_token.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar WxwAppTokenId

type WxwAppTokenModel {
  "ID"
  id: WxwAppTokenId!
  "企微应用"
  wxw_app_id: WxwAppId!
  "企微应用"
  wxw_app_id_lbl: String!
  "类型corp和contact"
  type: String!
  "令牌"
  access_token: String!
  "令牌创建时间"
  token_time: NaiveDateTime
  "令牌创建时间"
  token_time_lbl: String!
  "令牌超时时间"
  expires_in: Int!
  "企业jsapi_ticket"
  jsapi_ticket: String!
  "企业jsapi_ticket创建时间"
  jsapi_ticket_time: NaiveDateTime
  "企业jsapi_ticket创建时间"
  jsapi_ticket_time_lbl: String!
  "企业jsapi_ticket超时时间"
  jsapi_ticket_expires_in: Int!
  "应用jsapi_ticket"
  jsapi_ticket_agent_config: String!
  "应用jsapi_ticket创建时间"
  jsapi_ticket_agent_config_time: NaiveDateTime
  "应用jsapi_ticket创建时间"
  jsapi_ticket_agent_config_time_lbl: String!
  "应用jsapi_ticket超时时间"
  jsapi_ticket_agent_config_expires_in: Int!
  "已删除"
  is_deleted: Int!
}
type WxwAppTokenFieldComment {
  "ID"
  id: String!
  "企微应用"
  wxw_app_id: String!
  "企微应用"
  wxw_app_id_lbl: String!
  "类型corp和contact"
  type: String!
  "令牌"
  access_token: String!
  "令牌创建时间"
  token_time: String!
  "令牌创建时间"
  token_time_lbl: String!
  "令牌超时时间"
  expires_in: String!
  "企业jsapi_ticket"
  jsapi_ticket: String!
  "企业jsapi_ticket创建时间"
  jsapi_ticket_time: String!
  "企业jsapi_ticket创建时间"
  jsapi_ticket_time_lbl: String!
  "企业jsapi_ticket超时时间"
  jsapi_ticket_expires_in: String!
  "应用jsapi_ticket"
  jsapi_ticket_agent_config: String!
  "应用jsapi_ticket创建时间"
  jsapi_ticket_agent_config_time: String!
  "应用jsapi_ticket创建时间"
  jsapi_ticket_agent_config_time_lbl: String!
  "应用jsapi_ticket超时时间"
  jsapi_ticket_agent_config_expires_in: String!
}
input WxwAppTokenInput {
  "ID"
  id: WxwAppTokenId
  "企微应用"
  wxw_app_id: WxwAppId
  "企微应用"
  wxw_app_id_lbl: String
  "类型corp和contact"
  type: String
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
  "企业jsapi_ticket"
  jsapi_ticket: String
  "企业jsapi_ticket创建时间"
  jsapi_ticket_time: NaiveDateTime
  "企业jsapi_ticket创建时间"
  jsapi_ticket_time_lbl: String
  "企业jsapi_ticket创建时间"
  jsapi_ticket_time_save_null: Boolean
  "企业jsapi_ticket超时时间"
  jsapi_ticket_expires_in: Int
  "应用jsapi_ticket"
  jsapi_ticket_agent_config: String
  "应用jsapi_ticket创建时间"
  jsapi_ticket_agent_config_time: NaiveDateTime
  "应用jsapi_ticket创建时间"
  jsapi_ticket_agent_config_time_lbl: String
  "应用jsapi_ticket创建时间"
  jsapi_ticket_agent_config_time_save_null: Boolean
  "应用jsapi_ticket超时时间"
  jsapi_ticket_agent_config_expires_in: Int
}
input WxwAppTokenSearch {
  "已删除"
  is_deleted: Int
  "ID列表"
  ids: [WxwAppTokenId!]
  "ID"
  id: WxwAppTokenId
  "企微应用"
  wxw_app_id: [WxwAppId!]
  "企微应用"
  wxw_app_id_is_null: Boolean
  "企微应用"
  wxw_app_id_lbl: [String!]
  "企微应用"
  wxw_app_id_lbl_like: String
}
type Query {
  "根据条件查找企微应用接口凭据总数"
  findCountWxwAppToken(search: WxwAppTokenSearch): Int!
  "根据搜索条件和分页查找企微应用接口凭据列表"
  findAllWxwAppToken(search: WxwAppTokenSearch, page: PageInput, sort: [SortInput!]): [WxwAppTokenModel!]!
  "获取企微应用接口凭据字段注释"
  getFieldCommentsWxwAppToken: WxwAppTokenFieldComment!
  "根据条件查找第一个企微应用接口凭据"
  findOneWxwAppToken(search: WxwAppTokenSearch, sort: [SortInput!]): WxwAppTokenModel
  "根据 id 查找企微应用接口凭据"
  findByIdWxwAppToken(id: WxwAppTokenId!): WxwAppTokenModel
  "根据 ids 查找企微应用接口凭据"
  findByIdsWxwAppToken(ids: [WxwAppTokenId!]!): [WxwAppTokenModel]!
}
type Mutation {
  "批量创建企微应用接口凭据"
  createsWxwAppToken(inputs: [WxwAppTokenInput!]!, unique_type: UniqueType): [WxwAppTokenId!]!
  "根据 id 修改企微应用接口凭据"
  updateByIdWxwAppToken(id: WxwAppTokenId!, input: WxwAppTokenInput!): WxwAppTokenId!
  "根据 ids 删除企微应用接口凭据"
  deleteByIdsWxwAppToken(ids: [WxwAppTokenId!]!): Int!
  "根据 ids 还原企微应用接口凭据"
  revertByIdsWxwAppToken(ids: [WxwAppTokenId!]!): Int!
  "根据 ids 彻底删除企微应用接口凭据"
  forceDeleteByIdsWxwAppToken(ids: [WxwAppTokenId!]!): Int!
}

`);
