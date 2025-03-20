import { defineGraphql } from "/lib/context.ts";

import type { } from "./wxw_app.model.ts";
import * as resolver from "./wxw_app.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
scalar WxwAppId

type WxwAppModel {
  "ID"
  id: WxwAppId!
  "名称"
  lbl: String!
  "企业ID"
  corpid: String!
  "应用ID"
  agentid: String!
  "可信域名"
  domain_id: DomainId!
  "可信域名"
  domain_id_lbl: String!
  "应用密钥"
  corpsecret: String!
  "通讯录密钥"
  contactsecret: String!
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
  "已删除"
  is_deleted: Int!
}
type WxwAppFieldComment {
  "ID"
  id: String!
  "名称"
  lbl: String!
  "企业ID"
  corpid: String!
  "应用ID"
  agentid: String!
  "可信域名"
  domain_id: String!
  "可信域名"
  domain_id_lbl: String!
  "应用密钥"
  corpsecret: String!
  "通讯录密钥"
  contactsecret: String!
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
}
input WxwAppInput {
  "ID"
  id: WxwAppId
  "名称"
  lbl: String
  "企业ID"
  corpid: String
  "应用ID"
  agentid: String
  "可信域名"
  domain_id: DomainId
  "可信域名"
  domain_id_lbl: String
  "应用密钥"
  corpsecret: String
  "通讯录密钥"
  contactsecret: String
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
}
input WxwAppSearch {
  "已删除"
  is_deleted: Int
  "ID列表"
  ids: [WxwAppId!]
  "ID"
  id: WxwAppId
  "名称"
  lbl: String
  lbl_like: String
  "企业ID"
  corpid: String
  corpid_like: String
  "应用ID"
  agentid: String
  agentid_like: String
  "可信域名"
  domain_id: [DomainId!]
  "可信域名"
  domain_id_is_null: Boolean
  "可信域名"
  domain_id_lbl: [String!]
  "可信域名"
  domain_id_lbl_like: String
  "启用"
  is_enabled: [Int!]
}
type Query {
  "根据条件查找企微应用总数"
  findCountWxwApp(search: WxwAppSearch): Int!
  "根据搜索条件和分页查找企微应用列表"
  findAllWxwApp(search: WxwAppSearch, page: PageInput, sort: [SortInput!]): [WxwAppModel!]!
  "获取企微应用字段注释"
  getFieldCommentsWxwApp: WxwAppFieldComment!
  "根据条件查找第一个企微应用"
  findOneWxwApp(search: WxwAppSearch, sort: [SortInput!]): WxwAppModel
  "根据 id 查找企微应用"
  findByIdWxwApp(id: WxwAppId!): WxwAppModel
  "根据 ids 查找企微应用"
  findByIdsWxwApp(ids: [WxwAppId!]!): [WxwAppModel]!
  "查找企微应用 order_by 字段的最大值"
  findLastOrderByWxwApp: Int!
}
type Mutation {
  "批量创建企微应用"
  createsWxwApp(inputs: [WxwAppInput!]!, unique_type: UniqueType): [WxwAppId!]!
  "根据 id 修改企微应用"
  updateByIdWxwApp(id: WxwAppId!, input: WxwAppInput!): WxwAppId!
  "根据 ids 删除企微应用"
  deleteByIdsWxwApp(ids: [WxwAppId!]!): Int!
  "根据 ids 启用或者禁用企微应用"
  enableByIdsWxwApp(ids: [WxwAppId!]!, is_enabled: Int!): Int!
  "根据 ids 锁定或者解锁企微应用"
  lockByIdsWxwApp(ids: [WxwAppId!]!, is_locked: Int!): Int!
  "根据 ids 还原企微应用"
  revertByIdsWxwApp(ids: [WxwAppId!]!): Int!
  "根据 ids 彻底删除企微应用"
  forceDeleteByIdsWxwApp(ids: [WxwAppId!]!): Int!
}

`);
