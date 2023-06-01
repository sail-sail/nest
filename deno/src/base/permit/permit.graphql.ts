import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./permit.resolver.ts";

defineGraphql(resolver, /* GraphQL */`
  
  type GetUsrPermits {
    "ID"
    id: String!
    "菜单"
    menu_id: String!
    "路由"
    route_path: String!
    "编码"
    code: String!
    "名称"
    lbl: String!
    "可见"
    is_visible: Boolean!
  }
  
  type Query {
    "根据当前用户获取权限列表"
    getUsrPermits: [GetUsrPermits!]!
  }
  
`);
