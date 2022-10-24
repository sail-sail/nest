import { defineGraphql } from "/lib/context.ts";
import * as resolvers from "./dept.resolver.ts";

defineGraphql(resolvers, /* GraphQL */`
  
  type FindDeptsByToken {
    id: String!
    lbl: String!
  }
  
  type Query {
    "查找当前登录用户下的部门列表"
    findDeptsByToken: [FindDeptsByToken!]!
  }
  
`);
