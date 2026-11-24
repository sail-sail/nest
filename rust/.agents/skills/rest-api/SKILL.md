---
name: rest-api
description: 原生 poem 系统接口开发规范。普通业务 JSON 走 oai-api；附件、长连接、外部协议和系统入口使用本规范
---

# 原生 REST 接口

## 先判定

**普通前端或 AI 业务 JSON 接口一律走 `oai-api`。**

仅以下场景使用原生 poem:

- 附件上传 / 下载、multipart、二进制流
- WebSocket / SSE
- 第三方 webhook、OAuth/MCP 等路径或报文受外部协议约束的接口
- 健康检查、重定向

不属于以上场景时，停止实现并改用 `oai-api`。

## 路由注册

- 系统级、公共协议入口按同类现有路由注册在 `main.rs` 或 `register_routes`
- 附件、打印、导入等业务模块路由放 `app/lib.rs::register_routes`
- OpenAPI 路由只放 `register_oai_routes`，不要混用

## 目录与职责

复杂业务放 `app/{mod}/{table}/`:

- Router: 提取 poem 参数、构建 Ctx、调用 resful
- Resful: HTTP 状态码、响应头和响应体
- Service / Resolver: 可复用业务逻辑
- Model: 输入输出类型
- 文件名是 `*_resful.rs`，不是 `*_restful.rs`

简单系统入口可直接在 Router 返回 Response，不必强行增加 resful。

## Router 模板

```rust
#[handler]
pub async fn action(
  req: &Request,
  Json(input): Json<ActionInput>,
) -> Result<Response> {
  Ctx::resful_builder(Some(req))
    .with_auth()?
    .build()
    .resful_scope({
      action_resful::action(input, None)
    })
    .await
}
```

参数提取使用 `Json<T>`、`Query<T>`、`Path<T>` 或 `Multipart`。

## 鉴权、事务与 Ctx

- 必须登录: `.with_auth()?`
- 可匿名: 不调用 `.with_auth()`
- 登录可选: `.with_auth_optional()?`
- 多表、多步写入必须整体成功或失败: 再加 `.with_tran()`
- 原生 poem 必须配对使用 `Ctx::resful_builder(Some(req))` 和 `resful_scope()`
- `resful_scope()` 会自动回写续期后的 token，不要重复设置 `Authorization`
- `Options` 和所有 id 类型都是 `Copy`，不要 `.clone()`

是否匿名由安全要求决定，不要因为是回调或健康检查就自动放行；外部回调必须校验签名、密钥或防重放机制。

## 响应

- 业务校验要在写数据前完成；缺失、格式错误或非法状态返回 400
- 内部异常返回明确的 5xx，并记录完整错误
- 不要向调用方泄露数据库错误、密钥或内部路径
- JSON 响应设置 `Content-Type: application/json`

文件下载至少设置真实 `Content-Type` 和 `Content-Disposition`。中文文件名要同时提供 ASCII 兜底与 RFC 5987 编码，不要只做一次 `urlencoding::encode`:

```rust
Response::builder()
  .content_type("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
  .header(
    header::CONTENT_DISPOSITION,
    format!(
      "attachment; filename=\"download.xlsx\"; filename*=UTF-8''{}",
      urlencoding::encode(&filename),
    ),
  )
  .body(buf)
```

## 检查

- 接口属于原生 poem 场景，路由只注册一次
- 鉴权、签名、事务边界和错误状态码正确
- 文件下载响应头正确
- `cargo check` 通过