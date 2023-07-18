import { defineGraphql } from "/lib/context.ts";

import * as orgResolvers from "./org.resolver.ts";

defineGraphql(orgResolvers, /* GraphQL */`
  
  type Mutation {
    "切换登录状态下的组织, 更换token"
    orgLoginSelect(org_id: String!): String!
  }
  
`);
