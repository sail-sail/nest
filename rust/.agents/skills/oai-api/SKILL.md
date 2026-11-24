---
name: oai-api
description: Rust 业务 HTTP 接口开发规范. 给前端、AI 或外部工具调用的 JSON 接口必须使用
---

# 业务 HTTP 接口 (OpenAPI)

## 先判定

**给前端、AI 或外部工具调用的 JSON 业务接口必须走 OpenAPI。**

- GraphQL 接口不适用
- 附件、WebSocket / SSE、第三方回调、健康检查、重定向走 `rest-api`

## 路径与分层

```text
/api/oai/{module}/{action}

app/{mod}/{table}/
├── {table}_oai.rs      # 参数提取、鉴权上下文、DTO 转换
├── {table}_service.rs  # 业务逻辑, 与 GraphQL 共用
├── {table}_model.rs    # DTO
└── mod.rs
```

- `nest` 使用 `/api/oai/{module}`
- handler 的 `path` 只写 `/action`,禁止重复写 `/api/oai`

## Handler 模板

```rust
use poem_openapi::param::Header;
use poem_openapi::payload::{Json, Response as OaiResponse};
use poem_openapi::{Object, OpenApi, OpenApiService};

use crate::base::oai::types::{OaiAuth, R, scope_auth};

/// 业务接口
pub struct {Table}Api;

/// 返回数据
#[derive(Object, Debug)]
struct ActionData {
  /// 数据 ID
  id: String,
}

#[OpenApi]
impl {Table}Api {
  /// 操作说明,会作为 OpenAPI summary
  #[oai(path = "/get-action", method = "get")]
  async fn get_action(
    &self,
    #[oai(name = "Authorization")] auth: Header<Option<String>>,
    #[oai(name = "TenantId")] tenant: Header<Option<String>>,
  ) -> OaiResponse<Json<R<Option<ActionData>>>> {
    scope_auth(
      OaiAuth::new(auth.0, tenant.0),
      async move {
        let data = {table}_service::get_action(None).await?;
        Ok(ActionData {
          id: data.id.as_str().to_owned(),
        })
      },
    ).await.into_json()
  }
}

pub fn service() -> OpenApiService<{Table}Api, ()> {
  OpenApiService::new({Table}Api, "{module}-{table}", "1.0")
}
```

OAI 层只做参数提取、上下文、DTO 转换;业务逻辑放 service。

## 鉴权与事务

| 场景 | 用法 |
|---|---|
| 已登录、无需事务 | `scope_auth` |
| 多步骤或多记录写入,失败必须整体回滚 | `scope_auth_tran` |

不要让所有写操作都开事务。匿名接口直接返回 `Json(R::ok(data))`,不走 `scope_auth`。

## 注册: 必须两处

```rust
// app/lib.rs: 挂路由
app = app.nest(
  "/api/oai/{module}",
  {mod}::{table}::{table}_oai::service(),
);

// app/lib.rs: 合并 spec
base::oai::OaiModule::new(
  "{module}",
  {mod}::{table}::{table}_oai::service().spec(),
),
```

缺第二处时接口可直接访问,但不会进入 `/openapi.json`,AI 搜不到,`rest_call` 也会拒绝。

## 响应约定

- 统一使用 `R<T>`:`{ code, message, data }`
- `scope_auth` / `scope_auth_tran` 返回 `R<Option<T>>`;错误时 `data = null`,HTTP 仍为 200
- 鉴权失败 `code = 401`;业务错误保留业务码,其他错误为 500
- 鉴权 handler 必须返回 `OaiResponse<Json<R<Option<T>>>>`,并以 `.into_json()` 收尾;否则续期 token 不会写回 `Authorization`

## 参数来源

| 来源 | 写法 |
|---|---|
| 路径参数 | `#[oai(path = "/item/:id", method = "get")]` + `id: Path<String>` |
| Query | `page: Query<Option<u32>>` |
| JSON 请求体 | `body: Json<MyInput>` |
| 请求头 | `#[oai(name = "TenantId")] tenant: Header<Option<String>>` |

`Path`、`Query`、`Header` 来自 `poem_openapi::param`,`Json` 来自 `poem_openapi::payload`。

handler 使用 `:name`;生成 OpenAPI 时变为 `{name}`。AI 调用 `rest_call` 时必须替换成实际值。

## 硬约束

- 不要把 `#[oai]` 与原生 `#[handler]` 混挂到同一个 `nest`
- 不要与 `/api/oss`、`/api/health`、`/api/websocket`、`/api/wxwork` 等前缀重叠
- `Object` DTO 名必须全局唯一;冲突时用 `#[oai(rename = "...")]`
- DTO 字段必须使用 OpenAPI 支持的类型。避免 `serde_json::Value`,其 schema 无约束、AI 无法可靠解析
- `Decimal` 等领域类型不要直接放进 DTO;先转成 String,或确认启用了对应的 `poem-openapi` feature
- handler、字段用 doc comment,它们会进入 AI 搜索和 OpenAPI 文档

## 验收

1. `cargo check`
2. 访问 `/openapi.json`,确认完整 path 和 schema 存在
3. 用 `schema_search(source=rest)` 能搜到该接口
