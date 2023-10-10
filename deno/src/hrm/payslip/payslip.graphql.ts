import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./payslip.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `

type Mutation {
  
  "发送企微工资条"
  sendMsgWxw(
    "域名"
    host: String!
    "企微工资条ID列表"
    ids: [String!]!
  ): Int!
  
  "一键发送企微工资条"
  sendMsgWxwOneKey(
    "域名"
    host: String!
  ): Int!
  
  "确认工资条"
  confirmPayslip(
    "工资条ID"
    id: String!
  ): Int!
  
}

`);
