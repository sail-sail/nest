import { defineGraphql } from "/lib/context.ts";

import * as resolvers from "./dictbiz_detail.resolver.ts";

defineGraphql(resolvers, /* GraphQL */ `

  type GetDictbiz {
    "业务字典ID"
    id: DictbizId!
    "业务字典编码"
    code: String!
    "业务数据类型"
    type: DictbizType!
    "名称"
    lbl: String!
    "值"
    val: String!
  }
  
  type Query {
    "获取业务字典列表"
    getDictbiz(codes: [String!]!): [[GetDictbiz!]!]!
  }
  
`);
