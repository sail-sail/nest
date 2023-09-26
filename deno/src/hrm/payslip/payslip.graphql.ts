import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./payslip.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `

type Mutation {
  "发送企微工资条"
  sendMsgWxw(ids: [String!]!): Int!
}

`);
