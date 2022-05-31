import { defineGraphql } from "/lib/context.ts";
import * as resolvers from "./usr.resolver.ts";

defineGraphql(resolvers, /* GraphQL */`
  
  type Mutation {
    "登录"
    login(username: String!, password: String!, tenant_id: String!): String!
  }
  
`);
