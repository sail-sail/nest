import { defineGraphql } from "/lib/context.ts";

import * as menuResolver from "./menu.resolver.ts";

defineGraphql(menuResolver, /* GraphQL */`
  
  type GetMenus {
    id: String!
    parent_id: String!
    lbl: String!
    route_path: String
    route_query: String
  }

  type Query {
    "获取主页菜单"
    getMenus(type: String): [GetMenus!]!
  }
  
`);
