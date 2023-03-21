import { defineGraphql } from "/lib/context.ts";

import * as dictbiz_detailResolvers from "./dictbiz_detail.resolver.ts";

defineGraphql(dictbiz_detailResolvers, /* GraphQL */`
  
  type Query {
    "获取业务字典列表"
    getDictbiz(codes: [String!]!): [[GetDict!]!]!
  }
  
`);
