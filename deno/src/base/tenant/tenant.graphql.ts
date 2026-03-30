import { defineGraphql } from "/lib/context.ts";

import * as resolver from "./tenant.resolver.ts";

defineGraphql(resolver, /* GraphQL */ `

type GetLoginTenants {
  "ID"
  id: TenantId!
  "名称"
  lbl: SmolStr!
  "标题"
  title: SmolStr!
  "描述"
  info: SmolStr!
  "语言"
  lang: SmolStr!
}

input SetTenantAdminPwdInput {
  "租户ID"
  tenant_id: TenantId!
  "新密码"
  pwd: SmolStr!
}

#type GetHostTenant {
#  ""
#  domain: String
#}

type Query {
  "根据 当前网址的域名+端口 获取 租户列表"
  getLoginTenants(domain: SmolStr!): [GetLoginTenants!]!
  # getHostTenant: GetHostTenant!
  
  "根据 租户ids 获取 租户信息"
  getLoginTenantByIds(tenant_ids: [TenantId!]!): [GetLoginTenants!]!
}

type Mutation {
  
  "设置租户管理员密码"
  setTenantAdminPwd(input: SetTenantAdminPwdInput!): Boolean!
  
}
`);
