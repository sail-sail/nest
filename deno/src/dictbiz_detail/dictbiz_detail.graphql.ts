import { defineGraphql } from "/lib/context.ts";

import {
  _internals as dictbiz_detailResolvers,
} from "./dictbiz_detail.resolver.ts";

defineGraphql(dictbiz_detailResolvers, /* GraphQL */`

  type GetDict {
    "id"
    id: String!
    "字典编码"
    code: String!
    "数据类型"
    type: String!
    "名称"
    lbl: String!
    "值"
    val: String!
  }

  type Query {
    "获取业务字典列表"
    getDictbiz(codes: [String!]!): [[GetDict!]!]!
  }
  
`);
