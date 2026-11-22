---
name: uni-graphql-frontend
description: Uni 页面调用自定义 GraphQL API 时使用
compatibility: Uni-app + TypeScript
metadata:
  version: "1.1"
---

# Uni 自定义 GraphQL API

## 文件边界

```text
src/pages/{table}/
├── Api.ts   # 生成的标准 CRUD
└── Api2.ts  # 手写自定义接口
```

- 标准 CRUD 使用 `Api.ts`；自定义 GraphQL 只写 `Api2.ts`
- 页面从当前目录的 `./Api2.ts` 导入
- `query()`、`mutation()`、`request()`、`GqlOpt` 已自动导入

## 必遵规则

1. 查询用 `query()`，变更用 `mutation()`；不要改成 `request({ reqType: "graphql" })` 或直连 `/graphql`
2. `mutation()` 自动补 `x-request-id`；不要在业务代码里重复生成
3. 返回类型写成 `Query["xxx"]` / `Mutation["xxx"]`
4. `Query`、`Mutation`、`PageInput`、非标准 Input 从 `#/types.ts` 导入；全局 `XxxId`、`XxxModel`、标准 Input / Search 不重复导入
5. 函数名用 camelCase；GraphQL 字段、参数以 schema 为准，变量名不一致时在 `variables` 中显式映射
6. GraphQL helper 会处理 loading、toast、鉴权、token 刷新和 TenantId，并在错误时继续抛出
   - 不要包一层无意义 `try/catch`
   - 只关闭提示时传 `{ showErrMsg: false }`
   - 真正需要降级或兜底时，在调用方局部捕获
7. 同一次业务操作里的独立查询用 `await Promise.all(...)`，避免串行等待；helper 会合并、去重同轮查询

## Query 模板

```ts
import type {
  Query,
} from "#/types.ts";

/** 接口描述 */
export async function getXxx(
  id: XxxId,
  opt?: GqlOpt,
): Promise<Query["getXxx"]> {
  const res: {
    getXxx: Query["getXxx"];
  } = await query({
    query: /* GraphQL */ `
      query($id: XxxId!) {
        getXxx(id: $id) {
          id
          lbl
        }
      }
    `,
    variables: {
      id,
    },
  }, opt);

  return res.getXxx;
}
```

## Mutation 模板

```ts
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
  const res: {
    updateXxx: Mutation["updateXxx"];
  } = await mutation({
    query: /* GraphQL */ `
      mutation($id: XxxId!, $input: XxxApiInput!) {
        updateXxx(id: $id, input: $input)
      }
    `,
    variables: {
      id,
      input,
    },
  }, opt);

  return res.updateXxx;
}
```

## 非 GraphQL 响应

- 普通后端 JSON 接口用 `request()`
- 文件下载用 `downloadFile()` / `getDownloadUrl()`
- 第三方地址、原始 HTML 或非标准响应体用 `uni.request()`

不要把非 GraphQL 响应硬塞进 `query()` / `mutation()`。
