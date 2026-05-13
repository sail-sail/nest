---
name: rest-api
description: Poem REST 接口开发规范. 创建非 GraphQL 接口(如微信回调、登录、文件下载)时使用
---

# Poem REST 接口开发

## 何时使用

- 微信回调通知(支付、退款)等 Webhook 接口
- 小程序登录 `code2Session` 等认证入口
- 文件下载/导出等不走 GraphQL 的场景
- 健康检查等运维接口

## 路由注册位置

REST 路由统一在 `main.rs` 的 `app` 变量中注册:

```rust
// 在 main() 的 app 构建区域
app = app.at(
  "/api/wx_usr/code2Session",
  post(app::wx::wx_usr::wx_usr_router::code2session),
);

// 业务路由通过 app::register_routes 注册
app = app::register_routes(app);
```

新增路由可以在 `app/lib.rs` 的 `register_routes` 函数中追加。

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
  Ctx::resful_builder(Some(req))
    .with_auth()?          // 需要认证时加
    .build()
    .resful_scope({
      wx_usr_resful::code2session(input, None)
    }).await
}
```

## Resful 模板

```rust
#[function_name::named]
pub async fn code2session(
  input: Code2sessionInput,
  ip: SmolStr,
  options: Option<Options>,
) -> Result<Response> {

  info!(
    "{req_id} {function_name}: {input:?}",
    req_id = get_req_id(),
    function_name = function_name!(),
  );

  // 业务逻辑...

  Ok(Response::builder()
    .header("Content-Type", "application/json")
    .body(serde_json::to_string(&result)?))
}
```

入参不合法时, 在 `*_resful.rs` 中尽早返回 `400 Bad Request`, 并给出可读的错误信息, 不要继续执行业务逻辑。

## 常用 poem 导入

```rust
use poem::{
  Request, Response,
  handler,
  web::{Json, Query},
};
use poem::http::{StatusCode, header};
```

## 文件下载响应

```rust
Ok(Response::builder()
  .header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
  .header("Content-Disposition", format!("attachment; filename=\"{}\"", urlencoding::encode(&filename)))
  .body(buf))
```

## 路径参数

```rust
// main.rs 注册:
app = app.at(
  "/api/oss/download/:filename",
  get(oss_router::download_filename),
);

// router.rs 获取:
#[handler]
pub async fn download_filename(
  req: &Request,
  path: Path<String>,
) -> Result<Response> {
  let filename = path.0;
  // ...
}
```

## Query 参数

```rust
#[derive(Deserialize)]
struct ExportRequest {
  search: Option<SmolStr>,
  page: Option<SmolStr>,
}

#[handler]
pub async fn export(
  req: &Request,
  Query(params): Query<ExportRequest>,
) -> Result<Response> {
  // params.search, params.page
}
```

## Ctx 构建器差异

| 场景 | 方法 | 说明 |
|------|------|------|
| GraphQL | `Ctx::builder(ctx)` | 从 `async_graphql::Context` 构建 |
| REST | `Ctx::resful_builder(Some(req))` | 从 `poem::Request` 构建 |
| 测试 | `Ctx::test_builder()` | 测试上下文 |

## 注意事项

- 检查文件名: 使用 `*_resful.rs`, 不要写成 `*_restful.rs`
- 检查路由注册: 简单入口可直接放在 `main.rs`; 业务路由统一追加到 `app/lib.rs` 的 `register_routes`
- 检查认证: 读取当前登录用户、访问用户私有数据、发起支付/退款等用户敏感操作时加 `.with_auth()?`; 健康检查、微信回调、公开下载等匿名入口直接 `.build()`
- 检查入参: 请求体、路径参数、Query 参数解析后, 只要发现缺失、格式错误或业务前置条件不满足, 立即返回 `400 Bad Request`
