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
    dept_id: String
    dept_id_models: [GetLoginInfoDeptIdModels!]!
  }
  
  type LoginModel {
    dept_id: String
    authorization: String!
  }
  
  type Mutation {
    "登录"
    login(username: String!, password: String!, tenant_id: String!, dept_id: String, lang: String!): LoginModel!
    selectLang(lang: String!): String!
  }
  
  type Query {
    "获取登录信息"
    getLoginInfo: GetLoginInfo!
  }
  
`);
