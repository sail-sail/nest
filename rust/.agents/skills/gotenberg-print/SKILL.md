---
name: gotenberg-print
description: "PDF 图片 打印/导出时使用"
---
# Gotenberg 打印

## 何时使用

- 需要把某个 PC 页面渲染成 PDF
- 需要在 Rust 后端调用现有 Gotenberg 服务导出文件
- 打印页里的接口仍然依赖登录态, 必须透传 `_set_authorization`

## 最小实现

1. PC 新增一个纯打印页

- 放在业务目录下, 例如 `src/views/{mod}/{table}/Print.vue`
- 页面只负责取数和排版, 不走菜单壳子
- 进入页面先读取 `route.query._set_authorization`, 写回 `usrStore.authorization`
- 再调用 `getLoginInfo({ notLoading: true })`, 同步 `usrStore.loginInfo / tenant_id / lang / username`
- 如果页面依赖租户上下文, 同时调用 `setClientTenantId(() => usrStore.tenant_id)`
- 数据和 DOM 就绪后设置 `window.__gotenberg = true`

2. Rust 新增 REST 下载接口

- 放在 `app/{mod}/{table}/` 下, 不放 `generated/`
- `router` 用 `Ctx::resful_builder(Some(req)).with_auth()?.build().resful_scope(...)`
- `resful` 层对外返回 `Response`, 内部再包一个 `Result<Response>` 的实际实现
- 用 `get_auth_token_ok()` 取当前 token
- 用 `get_gotenberg_domain()` 取服务地址
- 用 `generated::common::util::http::client()` 发起 POST 到 `/forms/chromium/convert/url`
- 必带:
  - `url`
  - `waitForExpression = window.__gotenberg === true`
  - `waitTimeout = 30000`

3. 列表页接按钮

- 优先单选打印, 先做最小闭环
- 列表按钮直接打开后端 REST URL, 例如 `window.open(getPrintUrlXxx(id), "_blank")`
- URL 至少带 `id / protocol / domain / authorization` (id是业务相关, 不一定是必须的)

## URL 约定

- 后端打印页 URL 形如:
  `/#/scrm/expense_reimbursement/print?id={id}&_set_authorization={token}`
- 后端下载接口 URL 形如:
  `/api/scrm/expense_reimbursement/print?id={id}&protocol={protocol}&domain={domain}&authorization={token}`

## 易错点

- 不透传 `_set_authorization`, 打印页里的 GraphQL/REST 会变成未登录
- 只写 token 不回填租户上下文时, 某些页面会缺 `client_tenant_id`
- `resful_scope` 里的 future 返回值必须是 `IntoResponse`, 不要直接把 `Result<Response>` 塞进去

## 验证

- Rust: `cargo check -p app`
- PC: `pnpm run typecheck`
