---
name: oai-api
description: 业务 HTTP 接口开发规范. 新增非 GraphQL 的业务接口(给前端和 AI 调用)时使用
---

# 业务接口开发 (OpenAPI)

## 何时使用

- 新增业务 HTTP 接口(非 GraphQL)
- 接口需要被 AI 通过 MCP 搜索到并调用
- 需要标准 openapi 文档给外部工具

## 不适用

以下系统级接口仍用原生 Oak 路由：

- 附件上传 / 下载(multipart、二进制流)
- WebSocket / SSE
- 第三方 webhook 回调
- 健康检查、重定向

## 路径规范

业务接口统一挂在 `/api/oai` 下，按模块分前缀：

```text
/api/oai/{module}/{action}
```

路径参数用 `:name` 写法(与 Oak、path-to-regexp 一致)，生成 openapi 时自动转成 `{name}`。

## 目录结构

```text
src/base/{mod}/
├── {table}.oai.ts      # defineOaiRoute 声明, 薄壳, 只做参数提取
├── {table}.service.ts  # 业务逻辑, 与 GraphQL 共用
└── ...
```

新增模块后，只在 `src/base/oai/oai.routes.ts` 里加一行 import，不要在多个地方登记。

## Handler 模板

```ts
import { z } from "zod";
import { defineOaiRoute } from "/src/base/oai/oai.registry.ts";

const ActionData = z.object({
  id: z.string(),
}).meta({
  id: "ActionData",
  description: "接口返回数据",
});

export const tableRoutes = [
  defineOaiRoute({
    module: "base",
    method: "POST",
    path: "/api/oai/base/do-action",
    summary: "执行动作",
    description: "接口说明会进 openapi 和 MCP 搜索结果",
    body: z.object({
      id: z.string().describe("业务 id"),
      count: z.coerce.number().int().positive().optional(),
    }),
    output: ActionData,
    handler: async ({ body }) => {
      const data = await doAction(body);
      return {
        id: data.id,
      };
    },
  }),
];
```

读写选择：

| 场景 | 用哪个 | 事务 |
|---|---|---|
| 查询、只读 | 默认 | 不开(GET 自动关闭) |
| 多表、多条记录写入、导入, 需要整体成功或失败 | `transaction: true` | 开启, 失败整体回滚 |
| 单表单条非核心记录写入 | `transaction: false` | 不开(默认非 GET 会开启, 需显式关闭) |

不需要登录的接口写 `auth: false`，handler 里不要调用 `getAuthModel()` / `get_usr_id()`。

## 响应约定

- 统一 `R<T>`：`{ code, message, data }`
- 业务错误走 `code` + `message`，HTTP 仍然返回 200
- 鉴权失败 `code = 401`，其余业务错误按 `ServiceException.code` 映射，无法映射时用 400
- 出错时 `data` 为 `null`，响应结构稳定，openapi 响应 schema 才能完整

`invokeOaiRoute` 已经处理鉴权、事务、信封和 token 续期，handler 只返回业务数据，不要自己拼 `code/message`。

## MCP 调用

- `schema_search` 的 `query` 和 `keyword` 等价；`source=rest` 只搜 HTTP 接口，`source=all` 同时搜 GraphQL 和 REST
- `schema_search(kind=endpoint)` 或 `schema_get("GET /api/oai/...")` 查看接口的 method、path、参数和响应 schema
- `rest_call` 只允许调用 `oai.routes.ts` 注册过的接口，不会请求任意 URL；返回 `{ code, message, data }`，HTTP 状态始终 200
- agent 侧只读模式会拒绝 `rest_call` 的非 GET 请求，写接口需要关闭只读模式

## 参数来源

| 来源 | 写法 |
|---|---|
| 路径参数 | `path: "/api/oai/base/item/:id"`，handler 从 `params.id` 取 |
| query 参数 | `query: z.object({ ... })`，必须是 object |
| 请求体 | `body: z.object({ ... })` |
| 请求头 | handler 从 `headers` 取 |

query 和路径参数在 HTTP 下永远是字符串，数字用 `z.coerce.number()`，布尔用 `oaiBoolean`（来自 `oai.registry.ts`），不要用 `z.coerce.boolean()`，它会把 `"false"` 转成 `true`：

```ts
import { oaiBoolean } from "/src/base/oai/oai.registry.ts";

query: z.object({
  is_enabled: oaiBoolean.optional(),
}),
```

## 检查清单

- 路径在 `/api/oai/{module}` 前缀下，`module` 与路径里的模块段一致
- 同一 `method + path` 不要重复注册，启动时会直接抛错
- `summary` 必填，`description` 尽量写清楚，AI 搜索主要靠这两个字段
- 请求/响应 schema 用 zod，并给输出模型加 `.meta({ id: "XxxData" })`
- schema 名全局唯一：合并 `components.schemas` 时同名但结构不同会抛错
- 加完接口访问 `/openapi.json` 确认新路径出现
- 跑 `npm run typecheck`

## 常见错误

| 现象 | 原因 |
|---|---|
| `rest_call` 报「不在 openapi 规范里」 | 忘了在 `oai.routes.ts` 里登记模块 |
| 接口 404 | `path` 写错，或路径参数用了 `{id}` 而不是 `:id` |
| 启动报「模块名与路径不匹配」 | `module` 和 `/api/oai/{module}` 不一致 |
| 生成 `/openapi.json` 时报「schema 名冲突」 | 两个 zod 模型用了同一个 `.meta({ id })` |
| 生成 `/openapi.json` 时报「query schema 必须是 object」 | `query` 不是 `z.object(...)` |
| 数字参数报 400 | query 参数用了 `z.number()`，需要改成 `z.coerce.number()` |
