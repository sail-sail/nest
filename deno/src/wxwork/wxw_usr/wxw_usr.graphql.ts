import { defineGraphql } from "/lib/context.ts";

import * as resolvers from "./wxw_usr.resolver.ts";

defineGraphql(resolvers, /* GraphQL */`

type WxwGetAppid {
  
  "企业微信应用id"
  appid: String!
  
  "企业微信应用agentid"
  agentid: String!
  
}

input WxwLoginByCodeInput {
  "域名"
  host: String!
  "企业微信登录时获取的code"
  code: String!
  "语言"
  lang: String
}

type WxwLoginByCode {
  "授权码"
  authorization: String!
  "组织id"
  org_id: OrgId
  "用户名"
  username: String!
  "姓名"
  name: String!
  "租户id"
  tenant_id: TenantId!
  "语言"
  lang: String!
}

type Query {
  
  "通过host获取appid, agentid"
  wxwGetAppid(
    "域名"
    host: String!
  ): WxwGetAppid!
  
}

type Mutation {
  
  "微信企业号登录"
  wxwLoginByCode(input: WxwLoginByCodeInput!): WxwLoginByCode
  
  wxwSyncUsr(
    "域名"
    host: String!
  ): Int!
}

`);
