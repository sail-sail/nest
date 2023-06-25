import { defineGraphql } from "/lib/context.ts";

import * as tenantResolver from "./tenant.resolver.ts";

defineGraphql(tenantResolver, /* GraphQL */`
  
  type GetLoginTenants {
    "ID"
    id: String!
    "名称"
    lbl: String!
  }
  
  #type GetHostTenant {
  #  ""
  #  domain: String
  #}

  type Query {
    "根据 当前网址的域名+端口 获取 租户列表"
    getLoginTenants(domain: String!): [GetLoginTenants!]!
    # getHostTenant: GetHostTenant!
  }
  
`);
