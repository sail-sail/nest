# GraphQL API 后端

## 核心约束

1. 手写业务逻辑优先放在 `src/`
2. `gen/` 为生成代码，可改但新接口必须放在 `src/`
3. deno 后端类型检查为：执行 `npm run typecheck`
4. 函数尽量写简要注释, `*.graphql.ts` 中的函数和字段注释尽量详细
5. 业务 HTTP 接口走 `/api/oai/{module}`, 用 `defineOaiRoute` 在 `src/base/{mod}/{table}.oai.ts` 声明, 并只在 `src/base/oai/oai.routes.ts` 登记一次(技能 `oai-api`); 附件、WebSocket、第三方回调等系统级接口继续用原生 Oak 路由