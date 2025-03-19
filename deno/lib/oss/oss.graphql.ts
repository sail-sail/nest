import { defineGraphql } from "/lib/context.ts";

import * as ossResolver from "./oss.resolver.ts";

defineGraphql(ossResolver, /* GraphQL */ `
type GetStatsOss {
  id: ID!
  lbl: String!
  contentType: String!
  size: Int!
}

type Query {
  "获取附件信息列表, 包括文件名"
  getStatsOss(ids: [ID!]!): [GetStatsOss]!
}
`);
