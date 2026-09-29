import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./optbiz.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `

  type Query {
    "移动端是否发版中 uni_releasing"
    getUniReleasing: Boolean!
  }

`);
