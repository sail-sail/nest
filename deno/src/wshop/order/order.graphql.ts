import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./order.resolver.ts";

defineGraphql(resolver, /* GraphQL */`

input PayNowInput {
  "产品ID"
  pt_id: PtId!
  "公司名称"
  company: String!
  "联系电话"
  phone: String!
  "备注"
  rem: String
}

type Mutation {
  "立即支付"
  payNow(input: PayNowInput!): Boolean!
}

`);
