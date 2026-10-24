# 业务智能体服务

## 核心约束

1. 端口 `4002`，对外路径前缀固定 `/agent`；只 bind `127.0.0.1`，不直接暴露公网
2. token 只存进程内存：不落盘、不打日志、不进 dsh 子进程、不进模型上下文、不放 URL query
3. dsh 运行在子进程里；工具插件通过内部桥回调本服务，不在插件里直接拿 token
4. 禁用 `tool-bash` / `tool-pwsh` / `tool-fs` / `tool-fs-search`；`tool-web` 按业务要求保留，但要注意数据外发风险
5. `graphql_execute` 必须过只读校验（AST 拒绝 Mutation），写操作走白名单
6. 所有 `@deepseek-ai/*` 包版本必须完全一致（当前 `0.2.1-rc.2`），升级时同步全部
7. 工具 schema 以 `rust/app/base/mcp/mcp_model.rs` 为准，Rust 变更后同步插件
8. 流式响应用 POST + `fetch` 读流；禁止 `EventSource`（无法带 Authorization 头）
9. 用 pnpm；原生构建在 `pnpm-workspace.yaml` 的 `allowBuilds` 里显式声明
10. 不改 Rust 的 MCP 协议；确需改时先改 `rust/app/base/mcp/` 并更新其 README
11. 外接 MCP 只写在 `mcp.config.json`（模板见 `mcp.config.example.json`），用 `${ENV}` 引用密钥；带用户身份的接口不要走 mcp-client（headers 是连接级静态值），必须走内部桥
12. 技能放 `agent/skills/<name>/SKILL.md`，不递归扫描；约定见 `SKILLS.md`
13. 图表统一用 ` ```echarts ` JSON 代码块（技能 `chart-report`），纯 JSON、先查数据、不要编造数据点；新增图表类型需在 `pc/src/utils/echarts.ts` 注册模块并同步 `CHART_TYPES`
14. 流程图/时序图/ER 图用 ` ```mermaid `（技能 `mermaid-diagram`），保持 strict 模式，不要用 HTML label 或 `click` 交互
15. 页面操作走 `page_operate` / `page_status`（技能 `page-operation`）：只操作当前同源 SPA，指令写目标+可见文案；查数据仍用 `graphql_execute`，不要用页面点击绕路
16. 页面操作不受 `AGENT_TOOL_READONLY` 约束；要关闭用 `AGENT_PAGE_OPERATE=false`。浏览器内的模型请求必须走 `/agent/llm` 代理，禁止把 `DEEPSEEK_API_KEY` 注入前端
17. 长期记忆按 `usrId` 隔离，走 `memory_*` 工具和 `agent/src/memory.ts`；不要在 dsh 侧共享一个记忆库（多用户会串号），也不要保存凭据/手机号/身份证等敏感信息
18. 记忆首轮注入只拼进模型输入，不要写进转录或前端展示；改注入逻辑时保持这个边界
19. 模型选择优先级固定为 `DEEPSEEK_API_KEY` → `CUSTOM_LLM_*` → 启动报错；自定义模型走 `llm-pi-ai` 的 hand-declared gateway（`openai-completions`），不要写死到 harness 的 `provider` 里
20. 文件字节不进模型上下文：`oss_upload` 优先传 `attachmentId`（宿主暂存 `.dsh/attachments`，见 `agent/src/attachments.ts`），内联 `contentBase64` 上限 8,192 字符且超限报错不截断；转录与 SSE 的 `tool_call.args` 必须过 `agent/src/redact.ts`，新增工具参数不要绕过它
21. 工具输出按 token 预算裁剪（`renderJson` → `renderWithinBudget`，默认 6,000，`AGENT_TOOL_OUTPUT_TOKENS`）；`dsh/patch.yml` 的 `tool-result-pruner.thresholdChars` 必须大于该预算对应的最坏字符数，否则会二次裁剪
22. 会话句柄按 LRU/TTL 回收（`src/store.ts`，`AGENT_SESSION_TTL_MS` / `AGENT_SESSION_MAX`）：回收只是丢内存引用，靠 `resumeSession` 重建；`runTurn` 必须用 `markSessionBusy` 包住，避免轮次中途被淘汰。用量按轮记账（`src/usage.ts` → `.dsh/usage/YYYY-MM-DD.jsonl`），拿不到 provider 精确用量时记 `tokens: null`，不要用估算值冒充
