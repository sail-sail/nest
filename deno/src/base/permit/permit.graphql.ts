import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./permit.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `
  
  type GetUsrPermits {
    "ID"
    id: PermitId!
    "菜单"
    menu_id: MenuId!
    "路由"
    route_path: String!
    "编码"
    code: String!
    "名称"
    lbl: String!
  }
  
  type Query {
    "根据当前用户获取权限列表"
    getUsrPermits: [GetUsrPermits!]!
  }
  
`);
