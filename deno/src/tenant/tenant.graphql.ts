import { defineGraphql } from "/lib/context.ts";
import * as resolvers from "./tenant.resolver.ts";

defineGraphql(resolvers, /* GraphQL */ `
type GetLoginTenants {
  ""
  id: ID
  "名称"
  lbl: String
}
#type GetHostTenant {
#  ""
#  host: String
#}

type Query {
  "根据 当前网址的域名+端口 获取 租户列表"
  getLoginTenants(host: String!): [GetLoginTenants]!
  # getHostTenant: GetHostTenant!
}
`);