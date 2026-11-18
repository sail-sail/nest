# GraphQL API 后端

1. 手写业务逻辑放 `app/`
2. `generated/` 可直接改, 不会被重新生成覆盖
3. `Options` 和所有 id 类型(`UsrId`/`TenantId`)都是 `Copy`, 不要 `.clone()`
4. 不执行 `cargo fmt`; 格式遵循 `.editorconfig`: 2 空格缩进(不是 Rust 惯用的 4), 保留行尾和空白行的尾部空白
5. 函数写简要注释, `*_graphql.rs` 里写详细注释
6. `cargo check` 30 分钟没结束才算卡住
7. 接口有改动跑 `npm run gqlgen` 生成前端类型
8. 布尔字段用 `tinyint unsigned` / `u8`(0/1) 不用 `bool`; 判断 `== 1`, 默认 `0`, 前端拿到的也是数字
9. `pc/graphql.config.js` 用 `generated/common/gql/schema.graphql` 校验 `Api.ts`/`Api2.ts`; 报 `Cannot query field "xxx"` 就是没跑 `gqlgen`
10. 技能所在目录：`.agents/skills/`
11. 业务 HTTP 接口走 `/api/oai/{module}` + `#[OpenApi]`(技能 `oai-api`); 附件、WebSocket、第三方回调等系统级接口才用原生 `#[handler]`(技能 `rest-api`); 新增 oai 模块要在 `register_oai_routes` 和 `oai_modules` 两处登记, 只登记一处会出现「能调但 AI 搜不到」
12. 时间戳统一用 `naive_local_timestamp` / `naive_local_timestamp_millis`; `get_now()` 是本地墙钟时间, 直接 `.and_utc().timestamp()` 会多出一个时区偏移(UTC+8 下是 28800 秒)
