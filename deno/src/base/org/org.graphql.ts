import { defineGraphql } from "/lib/context.ts";

import * as resolvers from "./org.resolver.ts";

defineGraphql(resolvers, /* GraphQL */ `
  
  type Mutation {
    "切换登录状态下的组织, 更换token"
    orgLoginSelect(org_id: OrgId): String!
  }
  
`);
