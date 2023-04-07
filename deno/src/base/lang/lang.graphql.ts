import { defineGraphql } from "/lib/context.ts";

import * as langResolver from "./lang.resolver.ts";

defineGraphql(langResolver, /* GraphQL */`
  
  type Query {
    "获取登录时的语言列表"
    getLoginLangs: [LangModel!]!
  }
  
`);
