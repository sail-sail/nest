import { defineGraphql } from "/lib/context.ts";

import * as usrResolver from "./usr.resolver.ts";

defineGraphql(usrResolver, /* GraphQL */ `

  type GetLoginInfoOrgIdModels {
    id: OrgId!
    lbl: String!
  }

  type GetLoginInfo {
    lbl: String!
    username: String!
    lang: String
    tenant_id: TenantId!
    org_id: OrgId
    org_id_models: [GetLoginInfoOrgIdModels!]!
  }
  
  type LoginModel {
    usr_id: UsrId!
    username: String!
    tenant_id: TenantId!
    org_id: OrgId
    authorization: String!
    lang: String
  }
  
  input LoginInput {
    username: String!
    password: String!
    tenant_id: TenantId!
    org_id: OrgId
  }
  
  input ChangePasswordInput {
    oldPassword: String!
    password: String!
    confirmPassword: String!
  }
  
  type Mutation {
    "登录"
    login(input: LoginInput!): LoginModel!
    "切换语言"
    selectLang(lang: String!): String!
    "修改密码"
    changePassword(
      input: ChangePasswordInput!
    ): Boolean!
  }
  
  type Query {
    "获取登录信息"
    getLoginInfo: GetLoginInfo!
  }
  
`);
