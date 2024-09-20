import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./wxo_usr.resolver.ts";

defineGraphql(resolver, /* GraphQL */`

type WxoGetAppid {
  
  "开发者ID"
  appid: String!
  
  "应用授权作用域，snsapi_base 或 snsapi_userinfo"
  scope: String!
  
}

input WxoLoginByCodeInput {
  "域名"
  host: String!
  "微信公众号登录时获取的code"
  code: String!
  "语言"
  lang: String
}
 
type Query {
  
  "通过域名获取开发者ID"
  wxoGetAppid(
    "域名"
    host: String!
  ): WxoGetAppid!
  
  "公众号用户是否已绑定"
  checkBindWxoUsr: Boolean!
  
}

type Mutation {
  
  "微信公众号单点登录"
  wxoLoginByCode(
    input: WxoLoginByCodeInput!
  ): LoginModel!
  
  "公众号用户绑定"
  bindWxoUsr(
    input: LoginInput!
  ): LoginModel!
  
  "公众号用户解除绑定"
  unBindWxoUsr: Boolean!
  
}

`);
