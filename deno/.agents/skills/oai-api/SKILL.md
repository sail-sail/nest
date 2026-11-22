---
name: oai-api
description: 业务 HTTP 接口开发规范. 新增非 GraphQL 的业务接口(给前端和 AI 调用)时使用
---

# 业务 HTTP 接口(OpenAPI)

## 适用范围

- 业务 HTTP 接口走 `/api/oai/{module}/{action}`，并由 AI 通过 OpenAPI/MCP 查找、调用。
- multipart/二进制流、WebSocket/SSE、第三方回调、健康检查和重定向仍用原生 Oak 路由。

## 路由约定

```text
src/base/{mod}/
├── {table}.oai.ts
└── {table}.service.ts
```

- `{table}.oai.ts` 只声明 schema、提取参数并调用 service；业务逻辑放 service，与 GraphQL 共用。
- `module` 必须等于 `/api/oai/{module}` 中的模块段，路径参数只能写 `:name`；例如 `/api/oai/base/item/:id`。
- 新模块只在 `src/base/oai/oai.routes.ts` 中 import，并把路由数组展开到注册表；不要重复登记。
- `summary` 必填，`description` 要覆盖业务语义，MCP 搜索主要依赖这两个字段。

## Handler 模板

```ts
import { z } from "zod";
import { defineOaiRoute } from "/src/base/oai/oai.registry.ts";

const ActionData = z.object({
  id: z.string(),
}).meta({
  id: "ActionData",
  description: "执行结果",
});

export const tableRoutes = [
  defineOaiRoute({
    module: "base",
    method: "POST",
    path: "/api/oai/base/do-action",
    summary: "执行动作",
    description: "更新记录并返回 id",
    body: z.object({
      id: z.string().describe("业务 id"),
    }),
    output: ActionData,
    handler: async ({ body }) => {
      return await doAction(body);
    },
  }),
];
```

- 请求和响应 schema 使用 Zod；输出模型及复用模型要加全局唯一 `.meta({ id })`。
- handler 直接返回 `data`，不要自行拼 `code/message`；业务异常抛 `ServiceException`。

## 鉴权与事务

| 场景 | 配置 |
|---|---|
| 查询 | 不配置；GET 默认关闭事务 |
| 写入 | 不配置；非 GET 默认开启事务 |
| 明确不需要事务的单条非核心写入 | `transaction: false` |
| 公开接口 | `auth: false` |

`auth` 默认开启。公开接口不要在 handler/service 中调用 `getAuthModel()` 或 `get_usr_id()`。

`invokeOaiRoute` 统一处理鉴权、事务、响应信封和 token 续期。已注册接口的 HTTP 状态固定为 200：

- 成功：`{ code: 0, message: "", data }`
- 失败：`{ code: number, message, data: null }`

## 参数

| 来源 | 写法 |
|---|---|
| 路径 | `params: z.object({ id: z.string() })`，handler 从 `params.id` 取 |
| query | `query: z.object({ ... })`，必须是 object |
| JSON 请求体 | `body: z.object({ ... })` |
| 请求头 | handler 从 `headers` 取 |

HTTP 路径和 query 参数始终是字符串；数字用 `z.coerce.number()`。布尔值必须用 `oaiBoolean`，不能用 `z.coerce.boolean()`，否则 `"false"` 会变成 `true`：

```ts
import { oaiBoolean } from "/src/base/oai/oai.registry.ts";

query: z.object({
  is_enabled: oaiBoolean.optional(),
}),
```

## MCP 调用

- 只搜索 REST：`schema_search({ source: "rest", kind: "endpoint", query: "关键词" })`
- 查看定义：`schema_get({ name: "GET /api/oai/system/ping" })`
- 调用接口：`rest_call({ method: "POST", path: "/api/oai/...", body })`
- `rest_call` 只允许调用注册表中的接口，不请求任意 URL；返回 `{ status: 200, body: R }`。
- agent 只读模式拒绝非 GET 的 `rest_call`，写接口需要关闭只读模式。

## 验收

- `module`、路径前缀和 `method + path` 注册均正确且无重复。
- 所有 schema 可生成 OpenAPI；`.meta({ id })` 全局唯一。
- 访问 `/openapi.json`，确认新路径和请求/响应结构出现。
- 执行 `npm run typecheck`。
