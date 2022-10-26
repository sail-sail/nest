import { defineGraphql } from "/lib/context.ts";
import * as resolvers from "./dept.resolver.ts";

defineGraphql(resolvers, /* GraphQL */`
  
  type Mutation {
    "切换登录状态下的部门, 更换token"
    deptLoginSelect(dept_id: String!): String!
  }
  
`);
