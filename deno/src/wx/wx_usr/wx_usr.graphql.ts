import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./wx_usr.resolver.ts";

defineGraphql(resolver, /* GraphQL */`

type Mutation {
  "微信用户绑定"
  bindWxUsr(
    input: LoginInput!
  ): LoginModel!
}

`);
