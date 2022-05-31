import { defineGraphql } from "/lib/context.ts";
import * as resolvers from "./menu.resolver.ts";

defineGraphql(resolvers, /* GraphQL */`
type GetMenus {
  id: String!
  lbl: String!
  route_path: String
  route_query: String
  children: JSON
}

type Query {
  "获取主页菜单"
  getMenus(type: String): [GetMenus]!
}
`);
