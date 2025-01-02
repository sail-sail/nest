import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./role.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
  
type Query {
  "获取当前角色的首页轮播图路由"
  getHomeUrls: [String!]!
}
  
`);
