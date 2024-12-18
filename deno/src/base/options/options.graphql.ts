import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./options.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `

  type Query {
    "获取系统选项"
    getOptionsByLbl(lbl: String!): [OptionsModel!]!
  }
  
`);
