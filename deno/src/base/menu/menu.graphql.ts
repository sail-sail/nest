import { defineGraphql } from "/lib/context.ts";

import * as menuResolver from "./menu.resolver.ts";

defineGraphql(menuResolver, /* GraphQL */ `
  
  type GetMenus {
    id: MenuId!
    parent_id: MenuId!
    lbl: String!
    route_path: String!
    route_query: String!
    is_dyn_page: Int!
  }

  type Query {
    "获取主页菜单"
    getMenus: [GetMenus!]!
  }
  
`);
