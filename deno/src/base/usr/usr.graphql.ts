import { defineGraphql } from "/lib/context.ts";

import * as usrResolver from "./usr.resolver.ts";

defineGraphql(usrResolver, /* GraphQL */`

  type GetLoginInfoDeptIdModels {
    id: String!
    lbl: String!
  }

  type GetLoginInfo {
    lbl: String!
    lang: String!
    org_id: String
    org_id_models: [GetLoginInfoDeptIdModels!]!
  }
  
  type LoginModel {
    org_id: String
    authorization: String!
  }
  
  type Mutation {
    "登录"
    login(username: String!, password: String!, tenant_id: String!, org_id: String, lang: String!): LoginModel!
    selectLang(lang: String!): String!
  }
  
  type Query {
    "获取登录信息"
    getLoginInfo: GetLoginInfo!
  }
  
`);
