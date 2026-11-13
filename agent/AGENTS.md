# 业务智能体服务

1. `graphql_execute` 必须过只读校验(AST 拒 Mutation), 写操作走白名单
2. 工具 schema 以 `rust/app/base/mcp/mcp_model.rs` 为准, Rust 改动后同步插件
3. 流式响应用 POST + `fetch` 读流, 禁止 `EventSource`(带不了 Authorization)
4. 技能放 `agent/skills/<name>/SKILL.md`, 不递归扫描, 约定见 `SKILLS.md`
5. 图表用 ` ```echarts ` 纯 JSON 块(技能 `chart-report`), 先查数据再画, 不编造数据点; 新图表类型要在 `pc/src/utils/echarts.ts` 注册并同步 `CHART_TYPES`
6. 页面操作走 `page_operate`/`page_status`(技能 `page-operation`), 只操作当前同源 SPA, 指令写目标 + 可见文案; 查数据仍用 `graphql_execute`, 不要用页面点击绕路
7. 页面操作不受 `AGENT_TOOL_READONLY` 约束, 关闭用 `AGENT_PAGE_OPERATE=false`; 浏览器内模型请求必须走 `/agent/llm` 代理, 禁止把 `DEEPSEEK_API_KEY` 注入前端
8. 长期记忆按 `usrId` 隔离(`memory_*` 工具 + `agent/src/memory.ts`), 不要共享一个记忆库; 不存凭据/手机号/身份证
9. 模型选择: `DEEPSEEK_API_KEY` → `CUSTOM_LLM_*` → 启动报错; 自定义模型走 `llm-pi-ai` 的 hand-declared gateway(`openai-completions`), 不要写死到 harness 的 `provider`
10. 文件字节不进模型上下文: `oss_upload` 优先传 `attachmentId`(宿主暂存 `.dsh/attachments`), 内联 `contentBase64` 上限 8,192 字符且超限报错不截断; `tool_call.args` 必须过 `agent/src/redact.ts`, 新增工具参数不要绕过
11. 工具输出按 token 预算裁剪(`renderWithinBudget`, 默认 6,000, `AGENT_TOOL_OUTPUT_TOKENS`); `dsh/patch.yml` 的 `tool-result-pruner.thresholdChars` 必须大于该预算的最坏字符数, 否则二次裁剪
12. 会话按 LRU/TTL 回收(`src/store.ts`, `AGENT_SESSION_TTL_MS`/`AGENT_SESSION_MAX`): `runTurn` 必须用 `markSessionBusy` 包住, 否则轮次中途被淘汰; 用量按轮记 `.dsh/usage/YYYY-MM-DD.jsonl`, 拿不到精确用量记 `tokens: null`, 不估算
13. `exec_node` 走宿主 `src/sandbox.ts`, 不经 Rust `/mcp`, 也不进 `TOOL_NAMES`; 隔离只靠 `--permission` 的读写白名单, 不能只靠 cwd; 目录键由 `usrId + conversationId` 推导, 不接受模型传参; 子进程环境变量走白名单
14. `exec_node` 绕开了 MCP 鉴权, 所以每次执行前 `assertSandboxAuthorized` 用同一 token 调 `session_me` 让 Rust 验签, 并把 `loginInfo.usr_id` 与目录归属比对; 缓存键含 token + usrId, 校验失败与缺字段都不缓存(fail closed); 关闭用 `AGENT_SANDBOX=false`
