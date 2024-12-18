import { defineGraphql } from "/lib/context.ts";

import * as resolvers from "./i18n.resolver.ts";

defineGraphql(resolvers, /* GraphQL */ `
  
  type Query {
    "国际化"
    n(langCode: String!, routePath: String, code: String!): String!
  }
  
`);
