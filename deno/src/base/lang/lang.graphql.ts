import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./lang.resolver.ts";

defineGraphql(resolver, /* GraphQL */`
  
  type Query {
    "获取登录时的语言列表"
    getLoginLangs: [LangModel!]!
  }
  
`);
