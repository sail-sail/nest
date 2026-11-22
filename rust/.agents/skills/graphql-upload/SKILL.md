---
name: graphql-upload
description: GraphQL 文件上传接入；涉及 /graphql multipart Upload 时使用。
---

# GraphQL 文件上传

## 适用边界

- 仅用于 GraphQL `Upload`；普通附件仍走现有 REST `uploadFile`
- `Upload` 字段只放在 `Mutation`，不要放 `Query`

## 后端接入

- `*_graphql.rs` 参数收 `async_graphql::Upload`
- 在 `Ctx::builder(ctx)...scope` 内先 `let file = file.value(ctx)?;`，再把 `async_graphql::UploadValue` 传给 resolver/service
- `main.rs` 的 `graphql_handler` 必须保留 `receive_batch_body(...)` + `MultipartOptions::default()`

## 前端接入

- 页面级自定义接口放 `Api2.ts`
- 不能使用 JSON body 的 `query()` / `mutation()` helper，改在 `Api2.ts` 手写 `fetch("/graphql")`
- `operations.variables.file` 设为 `null`，`map` 为 `{"0":["variables.file"]}`，文件字段名为 `"0"`
- 不要手写 `Content-Type`，让浏览器自动生成 multipart boundary；请求头沿用 `Authorization` / `TenantId`

## 排查顺序

1. 解析或 content-type 报错：确认 `FormData` 三字段齐全，且未手写 `Content-Type`
2. schema 或 Upload 解析报错：确认字段在 `Mutation`，请求使用 `mutation`
3. service 收不到内容：确认 `map` 路径匹配变量名，且已调用 `file.value(ctx)?`