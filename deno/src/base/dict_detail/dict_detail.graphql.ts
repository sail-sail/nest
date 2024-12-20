import { defineGraphql } from "/lib/context.ts";

import * as resolvers from "./dict_detail.resolver.ts";

defineGraphql(resolvers, /* GraphQL */ `

  type GetDict {
    "字典ID"
    id: DictId!
    "字典编码"
    code: String!
    "数据类型"
    type: DictType!
    "名称"
    lbl: String!
    "值"
    val: String!
  }

  type Query {
    "获取系统字典列表"
    getDict(codes: [String!]!): [[GetDict!]!]!
  }
  
`);
