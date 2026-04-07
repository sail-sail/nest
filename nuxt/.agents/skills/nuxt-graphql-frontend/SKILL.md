---
name: nuxt-graphql-frontend
description: 前端自定义 GraphQL API 接口. 当需要在前端调用后端自定义接口（非标准 CRUD）时使用
compatibility: Vue 3 + Nuxt 4 + TypeScript
metadata:
  version: "1.0"
---

# 前端自定义 API 接口开发

## 文件结构

```
src/pages/{mod}/{table}/
├── Api.ts      # 自动生成, 不放手写自定义接口
└── Api2.ts     # 手写自定义接口
```

## 手写接口约定

- `Api.ts` 为生成文件, 尽量不改
- 自定义 GraphQL 接口统一写到 `src/pages/{mod}/{table}/Api2.ts`
- 页面中如果需要调用手写接口, 从 `./Api2.ts` 导入, 以减少与生成代码的 git 冲突

## 编码规范
- 异常无需捕获，发起Graphql请求时会自动由全局错误处理器处理

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

| 规则 | 说明 |
|------|------|
| 类型导入 | 从 `#/types.ts` 导入 `Query`、`Mutation`、`XxxInput` 等,如果是标准的{Table}Model,{Table}Input,{Table}Search就不需要引入,因为已经在Model.ts全局定义了 |
| 返回类型 | 使用 `Query["xxx"]` 或 `Mutation["xxx"]` 声明 |
| 命名 | 函数驼峰式，参数蛇形式，与后端保持一致 |
