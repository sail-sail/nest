import { defineGraphql } from "/lib/context.ts";

import * as dict_detailResolvers from "./dict_detail.resolver.ts";

defineGraphql(dict_detailResolvers, /* GraphQL */`

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
    "获取系统字典列表"
    getDict(codes: [String!]!): [[GetDict!]!]!
  }
  
`);
