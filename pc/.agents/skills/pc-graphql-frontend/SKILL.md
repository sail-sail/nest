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
- 如果某个接口需要在本地处理异常（例如静默失败），优先通过 `opt` 覆盖错误处理行为；仅在该接口明确要求本地兜底时，允许在函数内部使用 `try-catch`
- `query()` 会在同一轮 microtask 内自动合并/去重多个查询；彼此独立的查询尽量在同一个业务函数中并发发起，再 `await Promise.all(...)`，例如：

```typescript
const [userRes, statRes] = await Promise.all([
  query({
    query: /* GraphQL */ `query($id: UserId!) { getUser(id: $id) { id name } }`,
    variables: { id },
  }, opt),
  query({
    query: /* GraphQL */ `query($id: UserId!) { getUserStat(id: $id) { score } }`,
    variables: { id },
  }, opt),
]);
```

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

1. 类型导入：从 `#/types.ts` 导入 `Query`、`Mutation`、`XxxInput`、`XxxId` 等 GraphQL 相关类型；标准的 `{Table}Model`、`{Table}Input`、`{Table}Search` 无需额外引入，因为已经在 `Model.ts` 中全局定义
2. 返回类型：使用 `Query["xxx"]` 或 `Mutation["xxx"]` 声明返回值
3. 命名：函数名用驼峰式，参数名用蛇形式，并与后端保持一致
4. 变量映射：若 TS 参数使用蛇形命名、但后端 GraphQL schema 要求驼峰参数名，在 `variables` 组装时显式映射（例如 `variables: { bookingOrderId: booking_order_id }`）
5. 字典查询优先级：业务字典 / 系统字典统一使用全局通用函数 `getDict()` / `getDictbiz()`（全局自动注入，无需手动引入）
6. 前端调用 `Api` 接口时不需要写 `try catch`, 已被封装在 `src/utils/request.ts` 中
