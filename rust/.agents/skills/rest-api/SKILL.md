---
name: rest-api
description: 系统级 REST 接口开发规范. 仅用于附件、WebSocket、第三方回调等无法用 OpenAPI 描述的系统接口; 业务接口请用 oai-api
---

# 系统级 REST 接口

## 适用范围

| 场景 | 为什么留在这里 |
|---|---|
| 附件上传 / 下载 | multipart、二进制流,OpenAPI 描述不清楚 |
| WebSocket / SSE | 协议本身就是长连接 |
| 第三方 webhook 回调 | 路径和报文由外部系统约定 |
| 健康检查 / 重定向 | 不需要文档,也不需要 AI 调用 |

判据:**需要给前端或 AI 用的 JSON 接口一律走 `oai-api`;二进制、长连接、外部回调留在原生 poem。**

这类系统级接口数量很有限,新增前先确认它真的不属于上面四种。

## 路由注册位置

系统级路由在 `main.rs` 的 `app` 构建阶段注册,业务路由通过 `app/lib.rs` 的 `register_routes` 注入:

```rust
// main.rs
app = app.at(
  "/api/oss/upload",
  post(generated::common::oss::oss_router::upload),
);

// 业务路由
app = app::register_routes(app);
```

## 标准四层结构

```text
app/{mod}/{table}/
├── {table}_model.rs    # 输入输出类型
├── {table}_resful.rs   # 业务逻辑(注意拼写: resful, 不是 restful)
├── {table}_router.rs   # poem handler, 构建 Ctx
└── mod.rs              # pub mod 声明
```

| 层 | 文件 | 职责 |
|----|------|------|
| Router | `*_router.rs` | `#[handler]` 构建 Ctx, 调用 resful |
| Resful | `*_resful.rs` | 参数校验、业务逻辑、错误响应、返回 Response |
| Resolver | `*_resolver.rs` | 日志、权限控制 |
| Service | `*_service.rs` | 业务逻辑,可被 Resolver 与 oai 层调用 |
| Model | `*_model.rs` | 类型定义 |

## Router 模板

```rust
use color_eyre::eyre::Result;
use poem::{Request, Response, handler, web::Json};
use generated::common::context::Ctx;

use super::wx_usr_model::Code2sessionInput;
use super::wx_usr_resful;

#[handler]
pub async fn code2session(
  req: &Request,
  Json(input): Json<Code2sessionInput>,
) -> Result<Response> {
  let ip = req.real_ip().unwrap_or_default().into();

  Ctx::resful_builder(Some(req))
    .with_auth()?
    .build()
    .resful_scope({
      wx_usr_resful::code2session(input, ip, None)
    }).await
}
```

## Resful 模板

```rust
#[function_name::named]
pub async fn code2session(
  input: Code2sessionInput,
  ip: String,
  options: Option<Options>,
) -> Result<Response> {
  info!(
    "{req_id} {function_name}: {input:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );

  Ok(Response::builder()
    .header("Content-Type", "application/json")
    .body(serde_json::to_string(&result)?))
}
```

入参不合法时尽早返回 `400 Bad Request`,不要继续执行业务逻辑:

```rust
return Ok(Response::builder()
  .status(StatusCode::BAD_REQUEST)
  .body("无效的入参"));
```

## 文件下载响应

```rust
Ok(Response::builder()
  .header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
  .header("Content-Disposition", format!("attachment; filename=\"{}\"", urlencoding::encode(&filename)))
  .body(buf))
```

## 路径参数与 Query

```rust
// 注册
app = app.at("/api/oss/download/:filename", get(oss_router::download_filename));

// 取值
#[handler]
pub async fn download_filename(
  req: &Request,
  path: Path<String>,
) -> Result<Response> {
  let filename = path.0;
}
```

```rust
#[derive(Deserialize)]
struct ExportRequest {
  search: Option<String>,
  page: Option<String>,
}

#[handler]
pub async fn export(
  req: &Request,
  Query(params): Query<ExportRequest>,
) -> Result<Response> {
  // params.search, params.page
}
```

## 上下文构建器

| 场景 | 方法 | 说明 |
|------|------|------|
| GraphQL | `Ctx::builder(ctx)` | 从 `async_graphql::Context` 构建 |
| 系统级 REST | `Ctx::resful_builder(Some(req))` | 从 `poem::Request` 构建 |
| OpenAPI 业务接口 | `scope_auth(...)` | 见 `oai-api`,不要直接写 builder |
| 测试 | `Ctx::test_builder()` | 测试上下文 |

注意 `scope()` 和 `resful_scope()` 互斥:`is_resful` 为真时调用 `scope()` 报 `must use resful_scope()`;非 restful 上下文调用 `resful_scope()` 报 `must use scope()`。OpenAPI 业务接口走 `oai_scope`,由 `scope_auth` 内部处理。

## 注意事项

- 文件名是 `*_resful.rs`,不是 `*_restful.rs`
- 与具体数据表或认证相关的业务处理追加到 `app/lib.rs` 的 `register_routes`
- 读取当前登录用户、访问用户私有数据、发起支付/退款时加 `.with_auth()?`;健康检查、微信回调、公开下载等匿名入口直接 `.build()`
- 请求体、路径参数、Query 参数解析后,只要发现缺失或格式错误,立即返回 `400 Bad Request`
