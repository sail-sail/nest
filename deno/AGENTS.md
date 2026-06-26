# GraphQL API 后端

## 核心约束

1. 手写业务逻辑优先放在 `src/`
2. `gen/` 为生成代码，可改但新接口必须放在 `src/`
3. deno 后端类型检查为：执行 `npm run typecheck`