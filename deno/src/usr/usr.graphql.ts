import { defineGraphql } from "/lib/context.ts";
import * as resolvers from "./usr.resolver.ts";

defineGraphql(resolvers, /* GraphQL */`

  type GetLoginInfoDept_idModels {
    id: String!
    lbl: String!
  }

  type GetLoginInfo {
    lbl: String!
    dept_id: String
    dept_idModels: [GetLoginInfoDept_idModels!]!
  }
  
  type LoginModel {
    dept_id: String
    authorization: String!
  }
  
  type Mutation {
    "登录"
    login(username: String!, password: String!, tenant_id: String!, dept_id: String): LoginModel!
  }
  
  type Query {
    "获取登录信息"
    getLoginInfo: GetLoginInfo!
  }
  
`);
