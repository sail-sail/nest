---
name: pc-graphql-frontend
description: 前端自定义 GraphQL API 接口. 当需要在前端调用后端自定义接口（非标准 CRUD）时使用
compatibility: Vue 3 + TypeScript
metadata:
  version: "1.0"
---

# 前端自定义 API 接口开发

## 文件结构

```
src/views/{mod}/{table}/
├── Api.ts      # 自动生成, 不放手写自定义接口
└── Api2.ts     # 手写自定义接口
```

## 手写接口约定

- `Api.ts` 为生成文件, 尽量不改
- 自定义 GraphQL 接口统一写到 `src/views/{mod}/{table}/Api2.ts`
- 页面中如果需要调用手写接口, 从 `./Api2.ts` 导入, 以减少与生成代码的 git 冲突

## 编码规范
- GraphQL 请求通常无需手动捕获异常；调用 `query()` / `mutation()` 时会由全局错误处理器统一处理，这条规则不适用于其他异步操作
- `query()` 会在同一轮 microtask 内自动合并/去重多个查询；彼此独立的查询尽量一起发起，再 `await Promise.all(...)`

## Query 模板

```typescript
import type {
  Query,
} from "#/types.ts";

/** 接口描述 */
export async function 函数名(
  id: XxxId,
  opt?: GqlOpt,
) {
  
  const res: {
    函数名: Query["函数名"];
  } = await query({
    query: /* GraphQL */ `
      query($id: XxxId!) {
        函数名(id: $id) {
          field1
          field2
        }
      }
    `,
    variables: { id },
  }, opt);
  
  const data = res.函数名;
  
  return data;
}
```

- `query()` 和 `mutation()` 由 `@/utils/graphql` 导入, 无需手动引入 vite 会自动注入

## Mutation 模板

```typescript
import type {
  Mutation,
  XxxInput,
} from "#/types.ts";

/** 接口描述 */
export async function updateXxx(
  id: XxxId,
  input: XxxInput,
  opt?: GqlOpt,
) {
  
  const res: {
    updateXxx: Mutation["updateXxx"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: XxxId!, $input: XxxInput!) {
        updateXxx(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);
  
  const data = res.updateXxx;
  
  return data;
}
```

## 核心规则

1. 类型导入：从 `#/types.ts` 导入 `Query`、`Mutation`、`XxxInput` 等 GraphQL 相关类型；标准的 `{Table}Model`、`{Table}Input`、`{Table}Search` 无需额外引入，因为已经在 `Model.ts` 中全局定义。
2. 返回类型：使用 `Query["xxx"]` 或 `Mutation["xxx"]` 声明返回值。
3. 命名：函数名用驼峰式，参数名用蛇形式，并与后端保持一致。
