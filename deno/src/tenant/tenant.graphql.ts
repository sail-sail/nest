import { defineGraphql } from "/lib/context.ts";

import {
  _internals as tenantResolver
} from "./tenant.resolver.ts";

defineGraphql(tenantResolver, /* GraphQL */`
  
  type GetLoginTenants {
    "ID"
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
