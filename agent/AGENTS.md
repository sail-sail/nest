# 业务智能体服务

## 核心约束

1. `graphql_execute` 必须过只读校验（AST 拒绝 Mutation），写操作走白名单
2. 工具 schema 以 `rust/app/base/mcp/mcp_model.rs` 为准，Rust 变更后同步插件
3. 流式响应用 POST + `fetch` 读流；禁止 `EventSource`（无法带 Authorization 头）
4. 技能放 `agent/skills/<name>/SKILL.md`，不递归扫描；约定见 `SKILLS.md`
5. 图表统一用 ` ```echarts ` JSON 代码块（技能 `chart-report`），纯 JSON、先查数据、不要编造数据点；新增图表类型需在 `pc/src/utils/echarts.ts` 注册模块并同步 `CHART_TYPES`
6. 页面操作走 `page_operate` / `page_status`（技能 `page-operation`）：只操作当前同源 SPA，指令写目标+可见文案；查数据仍用 `graphql_execute`，不要用页面点击绕路
7. 页面操作不受 `AGENT_TOOL_READONLY` 约束；要关闭用 `AGENT_PAGE_OPERATE=false`。浏览器内的模型请求必须走 `/agent/llm` 代理，禁止把 `DEEPSEEK_API_KEY` 注入前端
8. 长期记忆按 `usrId` 隔离，走 `memory_*` 工具和 `agent/src/memory.ts`；不要在 dsh 侧共享一个记忆库（多用户会串号），也不要保存凭据/手机号/身份证等敏感信息
9. 模型选择优先级固定为 `DEEPSEEK_API_KEY` → `CUSTOM_LLM_*` → 启动报错；自定义模型走 `llm-pi-ai` 的 hand-declared gateway（`openai-completions`），不要写死到 harness 的 `provider` 里
10. 文件字节不进模型上下文：`oss_upload` 优先传 `attachmentId`（宿主暂存 `.dsh/attachments`，见 `agent/src/attachments.ts`），内联 `contentBase64` 上限 8,192 字符且超限报错不截断；转录与 SSE 的 `tool_call.args` 必须过 `agent/src/redact.ts`，新增工具参数不要绕过它
11. 工具输出按 token 预算裁剪（`renderJson` → `renderWithinBudget`，默认 6,000，`AGENT_TOOL_OUTPUT_TOKENS`）；`dsh/patch.yml` 的 `tool-result-pruner.thresholdChars` 必须大于该预算对应的最坏字符数，否则会二次裁剪
12. 会话句柄按 LRU/TTL 回收（`src/store.ts`，`AGENT_SESSION_TTL_MS` / `AGENT_SESSION_MAX`）：回收只是丢内存引用，靠 `resumeSession` 重建；`runTurn` 必须用 `markSessionBusy` 包住，避免轮次中途被淘汰。用量按轮记账（`src/usage.ts` → `.dsh/usage/YYYY-MM-DD.jsonl`），拿不到 provider 精确用量时记 `tokens: null`，不要用估算值冒充
13. `exec_node` 走宿主 `src/sandbox.ts`，不经 Rust `/mcp`，也不进 `TOOL_NAMES`（那是 MCP 转发白名单）。隔离必须靠 `--permission` 的读写白名单，不能只靠 cwd；目录键由 `usrId + conversationId` 推导，禁止接受模型传参；子进程环境变量必须走白名单，否则 dsh 的 `DEEPSEEK_API_KEY` / `AGENT_BRIDGE_SECRET` 会随代码输出进上下文。因为它绕开了 MCP 的鉴权，`bridge.ts` 每次执行前都走 `assertSandboxAuthorized`：用同一 token 调 `session_me` 让 Rust 验签，并把返回的 `loginInfo.usr_id` 与目录归属比对；缓存键要同时含 token 与 usrId，`AGENT_SANDBOX_VERIFY_TTL_MS` 只是省往返，不是鉴权周期；校验失败与缺失字段都不缓存、fail closed。关闭用 `AGENT_SANDBOX=false`
