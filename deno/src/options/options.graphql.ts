import { defineGraphql } from "/lib/context.ts";

import {
  _internals as optionsResolver,
} from "./options.resolver.ts";

defineGraphql(optionsResolver, /* GraphQL */`

  type Query {
    "获取系统选项"
    getOptionsByLbl(lbl: String!): [OptionsModel!]!
  }
  
`);
