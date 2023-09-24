import { defineGraphql } from "/lib/context.ts";

import * as resolvers from "./wxw_usr.resolver.ts";

defineGraphql(resolvers, /* GraphQL */`

input WxwLoginByCodeInput {
  "企业号id"
  corpid: String!
  "应用id"
  agentid: String!
  "企业微信登录时获取的code"
  code: String!
}

type WxwLoginByCodePayload {
  "授权码"
  authorization: String!
  "组织id"
  org_id: String!
  "用户名"
  username: String!
  "姓名"
  name: String!
  "租户id"
  tenant_id: String!
  "语言"
  lang: String!
}

type Mutation {
  "微信企业号登录"
  wxwLoginByCode(input: WxwLoginByCodeInput!): WxwLoginByCodePayload!
}
  
`);
