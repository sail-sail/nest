import { defineGraphql } from "/lib/context.ts";

import * as resolvers from "./field_permit.resolver.ts";

defineGraphql(resolvers, /* GraphQL */ `

type Query {
  
  "字段权限"
  getFieldPermit(route_path: String!): [String!]
  
}

`);
