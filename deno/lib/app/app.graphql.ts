import { defineGraphql } from "/lib/context.ts";

import * as appResolver from "./app.resolver.ts";

defineGraphql(appResolver, /* GraphQL */ `
  
type Query {
  "生成ID主键"
  generateId(prex: SmolStr): SmolStr!
  "检查是否已经登录"
  checkLogin: Boolean!
  "根据 appid 获取 租户ID"
  getTenantIdByAppid(platform: SmolStr!, appid: SmolStr!): TenantId!
}
type Mutation {
  "清空缓存"
  clearCache: Boolean!
}

`);
