---
name: graphql-upload
description: GraphQL 文件上传接入。需要用Graphql的方式上传文件时使用。
---

# GraphQL 文件上传

## 何时使用

- 在 GraphQL 中新增文件上传字段
- 前端要通过 `/graphql` 发送 `multipart/form-data`

## 后端接入

- GraphQL 字段放在 `Mutation`，不要放 `Query`
- `*_graphql.rs` 参数收 `async_graphql::Upload`
- 在 `Ctx::builder(ctx)...scope` 内先 `let file = file.value(ctx)?;`，再把 `async_graphql::UploadValue` 传给 resolver/service
- resolver/service 参数统一用 `async_graphql::UploadValue`

## 前端接入

- 页面级自定义接口放 `Api2.ts`
- 直接 `fetch("/graphql")` 发送 GraphQL multipart request spec：`operations`、`map`、文件字段 `"0"`
- 上传测试按钮沿用隐藏 `input[type=file]` + `click()` 触发；结束后清空 `input.value = ""`，否则同一文件二次选择不触发 `change`

## 排查顺序

1. 若报 `invalid content type ... expect application/json`，先看 `main.rs` 的 `graphql_handler`
2. 若 schema 报 Upload 相关错误，确认字段在 `Mutation`，前端发的是 `mutation` 而不是 `query`
3. 若 service 收不到文件内容，确认已调用 `file.value(ctx)?`，而不是把 `Upload` 直接往下传