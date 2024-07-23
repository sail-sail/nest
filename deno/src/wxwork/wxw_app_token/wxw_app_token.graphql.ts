import { defineGraphql } from "/lib/context.ts";

import * as resolvers from "./wxw_app_token.resolver.ts";

defineGraphql(resolvers, /* GraphQL */`

type WxwGetConfigSignature {
  timestamp: String!
  nonceStr: String!
  signature: String!
}

type Query {
  
  "通过 appid, agentid, url 生成企业签名"
  wxwGetConfigSignature(
    appid: String!
    agentid: String!
    url: String!
  ): WxwGetConfigSignature!
  
  "通过 appid, agentid, url 生成应用签名"
  wxwGetAgentConfigSignature(
    appid: String!
    agentid: String!
    url: String!
  ): WxwGetConfigSignature!
  
}

`);
