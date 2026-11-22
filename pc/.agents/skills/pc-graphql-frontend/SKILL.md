---
name: pc-graphql-frontend
description: PC 端自定义 GraphQL API。调用后端非标准 CRUD 接口或 GraphQL Upload 时使用
compatibility: Vue 3 + TypeScript
metadata:
  version: "1.2"
---

# PC 自定义 GraphQL API

## 文件边界

```text
src/views/{mod}/{table}/
├── Api.ts      # 生成的标准 CRUD
└── Api2.ts     # 手写自定义接口
```

- 手写 GraphQL 接口只放 `Api2.ts`；页面从 `./Api2.ts` 导入
- `query()`、`mutation()`、`GqlOpt`、`getDict()`、`getDictbiz()` 已自动导入

## 必遵规则

1. 返回类型使用 `Query["xxx"]` / `Mutation["xxx"]`
2. `Query`、`Mutation`、`PageInput`、非标准 Input 从 `#/types.ts` 导入
3. 全局的 `XxxId`、`XxxModel`、标准 `XxxInput` / `XxxSearch` 不重复导入
4. 函数名用 camelCase；参数名保持后端 snake_case
5. GraphQL 字段、参数名以 schema 为准；变量名不同大小写时，在 `variables` 中显式映射
6. 通常不写 `try-catch`；GraphQL helper 会显示错误并继续抛出
   - 只关闭提示：传 `{ showErrMsg: false }`
   - 明确需要降级或兜底时，才在调用方局部处理异常
7. 同一业务函数里的独立查询用 `Promise.all()` 并发发起，避免串行 `await`
8. 字典统一使用 `getDict()` / `getDictbiz()`，不要另写 GraphQL 查询

## Query 模板

```typescript
import type {
  Query,
} from "#/types.ts";

/** 接口描述 */
export async function getXxx(
  id: XxxId,
  opt?: GqlOpt,
): Promise<Query["getXxx"]> {
  const res = await query({
    query: /* GraphQL */ `
      query($id: XxxId!) {
        getXxx(id: $id) {
          field1
          field2
        }
      }
    `,
    variables: { id },
  }, opt) as {
    getXxx: Query["getXxx"];
  };
  return res.getXxx;
}
```

## Mutation 模板

```typescript
import type {
  Mutation,
  XxxApiInput,
} from "#/types.ts";

/** 接口描述 */
export async function updateXxx(
  id: XxxId,
  input: XxxApiInput,
  opt?: GqlOpt,
): Promise<Mutation["updateXxx"]> {
  const res = await mutation({
    query: /* GraphQL */ `
      mutation($id: XxxId!, $input: XxxApiInput!) {
        updateXxx(id: $id, input: $input)
      }
    `,
    variables: { id, input },
  }, opt) as {
    updateXxx: Mutation["updateXxx"];
  };
  return res.updateXxx;
}
```

## Upload

- 普通附件上传走现有 REST `uploadFile()`，不要改成 GraphQL Upload
- GraphQL `Upload` 不能使用 JSON body 的 `query()` / `mutation()`
- 在 `Api2.ts` 手写 `fetch("/graphql")` + `FormData`，`operations.variables.file` 设为 `null`
- `map` 使用 `{"0":["variables.file"]}`，文件字段为 `"0"`；不得手写 `Content-Type`
- 认证头沿用 `Authorization` / `TenantId`；同时遵循 `graphql-upload` 技能
