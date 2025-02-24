import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./tenant.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `

type GetLoginTenants {
  "ID"
  id: TenantId!
  "名称"
  lbl: String!
  "标题"
  title: String!
  "描述"
  info: String!
  "语言"
  lang: String!
}

input SetTenantAdminPwdInput {
  "租户ID"
  tenant_id: TenantId!
  "新密码"
  pwd: String!
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

type Mutation {
  
  "设置租户管理员密码"
  setTenantAdminPwd(input: SetTenantAdminPwdInput!): Boolean!
  
}
`);
