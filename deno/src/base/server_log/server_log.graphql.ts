import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./server_log.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `

  type Query {
    "获取可用的日志日期列表"
    getServerLogDates: [String!]!
    "下载指定日期的原始日志文件"
    downloadServerLog(log_date: String!): String!
  }

`);