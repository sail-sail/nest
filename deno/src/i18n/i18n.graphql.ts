import { defineGraphql } from "/lib/context.ts";

import {
  _internals as i18nResolvers,
} from "./i18n.resolver.ts";

defineGraphql(i18nResolvers, /* GraphQL */`
  
  type Query {
    "国际化"
    n(langCode: String!, routePath: String, code: String!): String!
  }
  
`);
