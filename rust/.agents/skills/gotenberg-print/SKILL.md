---
name: gotenberg-print
description: "用 Gotenberg 将已登录 PC 页面导出为 PDF；包含打印页、Rust 下载接口和前端入口"
---
# Gotenberg PDF 导出

## 何时使用

- 通过 Rust 调用现有 Gotenberg，将已登录的 PC 业务页面导出为 PDF
- 不用于图片、Excel 或纯前端下载

## 最小闭环

### 1. PC

- 在 `src/views/{mod}/{table}/Print.vue` 新增纯打印页, 路由放在 `Layout1` 外
- 先将 `_set_authorization` 写入 `usrStore.authorization`, 再调用 `getLoginInfo({ notLoading: true })`
- 回填 `loginInfo / tenant_id / lang / username`, 并在业务请求前注册 `setClientTenantId(() => usrStore.tenant_id)`
- 数据请求完成、`await nextTick()` 后才设置 `window.__gotenberg = true`; 失败时不能标记 ready

### 2. Rust

- 放在 `app/{mod}/{table}/`, 包含 router / resful / model, 并在 `app/lib.rs` 注册
- `router` 使用 `Ctx::resful_builder(Some(req)).with_auth()?.build().resful_scope(...)`
- `resful` 外层返回 `Response`, 内部返回 `Result<Response>`; `resful_scope` 的 future 必须返回 `IntoResponse`
- 用 `get_auth_token_ok()`、`get_gotenberg_domain()` 和 `generated::common::util::http::client()`
- 对业务参数和 token 做 URL 编码, POST `/forms/chromium/convert/url`; multipart 必带:
  - `url`
  - `waitForExpression = window.__gotenberg === true`
  - `waitTimeout = 30000`
- 非 2xx 返回明确错误; 成功响应必须设置 `application/pdf` 和 `Content-Disposition`

### 3. 列表

- 优先单选; 用 `URLSearchParams` 携带业务参数、`window.location.protocol / host` 和登录 token
- 调用 `window.open(getPrintUrlXxx(id), "_blank")`
- 打印页接收 `_set_authorization`; 下载接口接收 `authorization`

## URL 约定

- 打印页: `{protocol}://{domain}/#/{mod}/{table}/print?id={id}&_set_authorization={token}`
- 下载接口: `/api/{mod}/{table}/print?id={id}&protocol={protocol}&domain={domain}&authorization={token}`
- `protocol / domain` 必须取自当前浏览器来源, 禁止拼接任意外部地址

## 验证

- Rust: `cargo check -p app`
- PC: `pnpm run typecheck`
