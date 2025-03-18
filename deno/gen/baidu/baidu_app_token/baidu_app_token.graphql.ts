import { defineGraphql } from "/lib/context.ts";

import type { } from "./baidu_app_token.model.ts";
import * as resolver from "./baidu_app_token.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar BaiduAppTokenId

type BaiduAppTokenModel {
  "ID"
  id: BaiduAppTokenId!
  "百度应用"
  baidu_app_id: BaiduAppId!
  "百度应用"
  baidu_app_id_lbl: String!
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
type BaiduAppTokenFieldComment {
  "ID"
  id: String!
  "百度应用"
  baidu_app_id: String!
  "百度应用"
  baidu_app_id_lbl: String!
  "令牌"
  access_token: String!
  "令牌创建时间"
  token_time: String!
  "令牌创建时间"
  token_time_lbl: String!
  "令牌超时时间"
  expires_in: String!
}
input BaiduAppTokenInput {
  "ID"
  id: BaiduAppTokenId
  "百度应用"
  baidu_app_id: BaiduAppId
  "百度应用"
  baidu_app_id_lbl: String
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
input BaiduAppTokenSearch {
  "已删除"
  is_deleted: Int
  "ID列表"
  ids: [BaiduAppTokenId!]
  "ID"
  id: BaiduAppTokenId
  "百度应用"
  baidu_app_id: [BaiduAppId!]
  "百度应用"
  baidu_app_id_is_null: Boolean
  "百度应用"
  baidu_app_id_lbl: [String!]
  "百度应用"
  baidu_app_id_lbl_like: String
}
type Query {
  "根据条件查找百度接口凭据总数"
  findCountBaiduAppToken(search: BaiduAppTokenSearch): Int!
  "根据搜索条件和分页查找百度接口凭据列表"
  findAllBaiduAppToken(search: BaiduAppTokenSearch, page: PageInput, sort: [SortInput!]): [BaiduAppTokenModel!]!
  "获取百度接口凭据字段注释"
  getFieldCommentsBaiduAppToken: BaiduAppTokenFieldComment!
  "根据条件查找第一个百度接口凭据"
  findOneBaiduAppToken(search: BaiduAppTokenSearch, sort: [SortInput!]): BaiduAppTokenModel
  "根据 id 查找百度接口凭据"
  findByIdBaiduAppToken(id: BaiduAppTokenId!): BaiduAppTokenModel
  "根据 ids 查找百度接口凭据"
  findByIdsBaiduAppToken(ids: [BaiduAppTokenId!]!): [BaiduAppTokenModel]!
}
type Mutation {
  "批量创建百度接口凭据"
  createsBaiduAppToken(inputs: [BaiduAppTokenInput!]!, unique_type: UniqueType): [BaiduAppTokenId!]!
  "根据 id 修改百度接口凭据"
  updateByIdBaiduAppToken(id: BaiduAppTokenId!, input: BaiduAppTokenInput!): BaiduAppTokenId!
  "根据 ids 删除百度接口凭据"
  deleteByIdsBaiduAppToken(ids: [BaiduAppTokenId!]!): Int!
  "根据 ids 还原百度接口凭据"
  revertByIdsBaiduAppToken(ids: [BaiduAppTokenId!]!): Int!
  "根据 ids 彻底删除百度接口凭据"
  forceDeleteByIdsBaiduAppToken(ids: [BaiduAppTokenId!]!): Int!
}

`);
